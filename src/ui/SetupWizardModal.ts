import { App, Modal, Notice } from 'obsidian';
import { WizardStateManager } from './wizard/WizardState';
import { BaseWizardStep } from './wizard/BaseWizardStep';
import { WelcomeStep } from './wizard/WelcomeStep';
import { TemplateStep } from './wizard/TemplateStep';
import { ThemeStep } from './wizard/ThemeStep';
import { FontStep } from './wizard/FontStep';
import { ContentOrgStep } from './wizard/ContentOrgStep';
import { NavigationStep } from './wizard/NavigationStep';
import { OptionalFeaturesStep } from './wizard/OptionalFeaturesStep';
import { DeploymentStep } from './wizard/DeploymentStep';
import { PluginConfigStep } from './wizard/PluginConfigStep';
import { FinalizeStep } from './wizard/FinalizeStep';
import { AstroModularPlugin, AstroModularSettings } from '../types';

export class SetupWizardModal extends Modal {
	private stateManager: WizardStateManager;
	private plugin: AstroModularPlugin;
	private steps: BaseWizardStep[];
	private isCompleting: boolean = false;
	private initialSettingsSnapshot: Partial<AstroModularSettings> | null = null;

	constructor(app: App, plugin: AstroModularPlugin) {
		super(app);
		this.plugin = plugin;
		this.stateManager = new WizardStateManager(plugin);
		
		// Initialize step instances
		this.steps = [
			new WelcomeStep(app, this, this.stateManager, this.plugin),
			new TemplateStep(app, this, this.stateManager, this.plugin),
			new ThemeStep(app, this, this.stateManager, this.plugin),
			new FontStep(app, this, this.stateManager, this.plugin),
			new ContentOrgStep(app, this, this.stateManager, this.plugin),
			new NavigationStep(app, this, this.stateManager, this.plugin),
			new OptionalFeaturesStep(app, this, this.stateManager, this.plugin),
			new DeploymentStep(app, this, this.stateManager, this.plugin),
			new PluginConfigStep(app, this, this.stateManager, this.plugin),
			new FinalizeStep(app, this, this.stateManager, this.plugin)
		];
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('astro-modular-wizard');
		
		// Refresh the wizard state with current settings
		this.stateManager.refreshState();
		
		// Store a snapshot of initial settings to detect changes later
		this.initialSettingsSnapshot = this.createSettingsSnapshot();
		
		// Render current step (may be async, but we don't await it)
		void this.renderCurrentStep();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		
		// Save any wizard state changes to data.json and config.ts if modal is closed
		// This ensures changes are preserved even if user closes modal without completing wizard
		// Only show notification if not completing (Complete Setup already shows its own notification)
		void this.saveWizardStateToDataJson(!this.isCompleting);
		
		// Reset the flag
		this.isCompleting = false;
	}

	private scrollToTop() {
		const { contentEl } = this;
		
		// Method 1: Find and scroll the actual scrollable parent
		let scrollableParent: HTMLElement | null = contentEl;
		while (scrollableParent && scrollableParent !== document.body) {
			const style = window.getComputedStyle(scrollableParent);
			if (scrollableParent.scrollHeight > scrollableParent.clientHeight && 
				(style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflow === 'auto' || style.overflow === 'scroll')) {
				scrollableParent.scrollTop = 0;
				break;
			}
			scrollableParent = scrollableParent.parentElement;
		}
		
		// Method 2: Try common Obsidian modal containers
		const modalContent = contentEl.closest('.modal-content');
		if (modalContent) {
			(modalContent as HTMLElement).scrollTop = 0;
		}
		
		const modalContainer = contentEl.closest('.modal-container');
		if (modalContainer) {
			(modalContainer as HTMLElement).scrollTop = 0;
		}
		
		// Also try contentEl itself
		contentEl.scrollTop = 0;
	}

	private renderCurrentStep() {
		const { contentEl } = this;
		
		// Scroll to top IMMEDIATELY before clearing content to prevent visual jump
		this.scrollToTop();
		
		// Clear content
		contentEl.empty();
		contentEl.addClass('astro-modular-wizard');

		// Scroll to top again after clearing (in case clearing changed scroll position)
		this.scrollToTop();

		// Render progress
		this.renderProgress(contentEl);

		// Render step content (may be async, but we don't await it)
		const stepContent = contentEl.createDiv('wizard-content');
		this.renderStepContent(stepContent);

		// Render footer
		this.renderFooter(contentEl);
		
		// Final scroll to top after all rendering is complete
		requestAnimationFrame(() => {
			this.scrollToTop();
		});
	}

	private renderHeader(container: HTMLElement) {
		const header = container.createDiv('wizard-header');
		header.createEl('h1', { text: 'Astro modular setup' });
	}

	private renderProgress(container: HTMLElement) {
		const state = this.stateManager.getState();
		const progress = container.createDiv('wizard-progress');
		
		const progressBar = progress.createDiv('progress-bar');
		const progressFill = progressBar.createDiv('progress-fill');
		// Set dynamic width using setCssProps
		progressFill.setCssProps({ width: `${this.stateManager.getProgress()}%` });
		
		// Add step text below the progress bar
		const progressText = progress.createDiv('progress-text');
		progressText.textContent = `Step ${state.currentStep} of ${state.totalSteps}`;
	}

	private renderStepContent(container: HTMLElement) {
		const state = this.stateManager.getState();
		const stepIndex = state.currentStep - 1;
		
		if (stepIndex >= 0 && stepIndex < this.steps.length) {
			// Render step (may be async, but we don't await it)
			const result = this.steps[stepIndex].render(container);
			// If render returns a promise, handle it
			if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
				void (result as Promise<void>);
			}
		}
	}

	private renderFooter(container: HTMLElement) {
		const footer = container.createDiv('wizard-footer');
		
		const buttons = footer.createDiv('wizard-buttons');
		
		// Previous button
		if (this.stateManager.canGoPrevious()) {
			const prevBtn = buttons.createEl('button', {
				text: 'Previous',
				cls: 'mod-button'
			});
			prevBtn.addEventListener('click', () => {
				// Discard any changes made on current step and go back
				this.discardCurrentStepChanges();
				this.stateManager.previousStep();
				void this.renderCurrentStep();
			});
		}

		// Next/Complete button
		if (this.stateManager.canGoNext()) {
			const nextBtn = buttons.createEl('button', {
				text: 'Next',
				cls: 'mod-button mod-cta'
			});
			nextBtn.addEventListener('click', () => {
				// Save current step changes to wizard state, data.json, and config.ts
				void (async () => {
					await this.saveCurrentStepToWizardState();
					this.stateManager.nextStep();
					this.renderCurrentStep();
				})();
			});
		} else {
			const completeBtn = buttons.createEl('button', {
				text: 'Complete setup',
				cls: 'mod-button mod-cta'
			});
			completeBtn.addEventListener('click', () => {
				// Mark that we're completing the wizard to avoid duplicate notifications
				this.isCompleting = true;
				
				// Complete the wizard (fire and forget)
				void (async () => {
					// Complete the wizard
					const finalStep = this.steps[this.steps.length - 1] as FinalizeStep;
					await finalStep.completeWizard();
					
					// Save the final settings
					await this.plugin.saveData(this.plugin.settings);
					
					// CRITICAL: Reload settings from disk to ensure everything is synchronized
					await this.plugin.loadSettings();
					
					// Trigger settings tab refresh to show updated values
					await this.plugin.triggerSettingsRefresh();
					
					this.close();
				})();
			});
		}

		// Skip button (for all steps except the last)
		if (this.stateManager.canGoNext()) {
			const skipBtn = buttons.createEl('button', {
				text: 'Skip',
				cls: 'mod-button'
			});
			skipBtn.addClass('wizard-skip-button');
			skipBtn.addEventListener('click', () => {
				// Skip without saving current step changes to wizard state
				this.stateManager.nextStep();
				this.renderCurrentStep();
			});
		}
	}

	private async saveCurrentStepToWizardState(): Promise<void> {
		// Save current step changes to wizard state, data.json, and config.ts
		// This is called when NEXT is clicked to ensure data.json and config.ts stay in sync
		try {
			// Build final settings from wizard state (updates plugin.settings)
			this.stateManager.buildFinalSettings();
			
			// Save to data.json
			await this.plugin.saveData(this.plugin.settings);
			
			// Reload settings to ensure the plugin has the latest values
			await this.plugin.loadSettings();
			
			// Apply to config.ts to keep it in sync
			const settings = this.plugin.settings;
			await this.plugin.configManager.applyPreset({
				name: settings.currentTemplate,
				description: '',
				features: settings.features,
				theme: settings.currentTheme,
				contentOrganization: settings.contentOrganization,
				config: settings
			});
		} catch (error) {
			console.error('Error saving current step to data.json and config.ts:', error);
			// Don't show error to user - just log it, as this shouldn't block navigation
		}
	}

	private discardCurrentStepChanges(): void {
		// Discard changes made on current step - this is called when PREVIOUS is clicked
		// Refresh the wizard state to show original values from data.json
		this.stateManager.refreshState();
	}

	private async saveWizardStateToDataJson(showNotification: boolean = true): Promise<void> {
		// Save wizard state changes to data.json and config.ts when modal is closed
		// This ensures changes are preserved even if user closes modal without completing wizard
		try {
			// Build final settings from wizard state
			this.stateManager.buildFinalSettings();
			
			// Check if any changes were actually made
			const hasChanges = this.hasSettingsChanged();
			
			// Only save to data.json and config.ts if there were actual changes
			if (!hasChanges) {
				return; // No changes, don't save anything
			}
			
			// Save to data.json
			await this.plugin.saveData(this.plugin.settings);
			
			// Reload settings to ensure the plugin has the latest values
			await this.plugin.loadSettings();
			
			// Apply to config.ts
			const settings = this.plugin.settings;
			const presetSuccess = await this.plugin.configManager.applyPreset({
				name: settings.currentTemplate,
				description: '',
				features: settings.features,
				theme: settings.currentTheme,
				contentOrganization: settings.contentOrganization,
				config: settings
			});
			
			// Only show notification if requested
			if (showNotification) {
				if (presetSuccess) {
					new Notice('Configuration saved to config.ts');
				} else {
					new Notice('Failed to save configuration to config.ts');
				}
			}
		} catch (error) {
			console.error('Error saving wizard state to data.json and config.ts:', error);
			if (showNotification) {
				new Notice(`Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}
	
	private createSettingsSnapshot(): Partial<AstroModularSettings> {
		// Create a deep copy of current settings for comparison
		const settings = this.plugin.settings;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return JSON.parse(JSON.stringify({
			currentTemplate: settings.currentTemplate,
			currentTheme: settings.currentTheme,
			contentOrganization: settings.contentOrganization,
			siteInfo: settings.siteInfo,
			navigation: settings.navigation,
			features: settings.features,
			typography: settings.typography,
			optionalFeatures: settings.optionalFeatures,
			deployment: settings.deployment,
			optionalContentTypes: settings.optionalContentTypes
		}));
	}
	
	private hasSettingsChanged(): boolean {
		if (!this.initialSettingsSnapshot) {
			return false;
		}
		
		const currentSnapshot = this.createSettingsSnapshot();
		
		// Compare key settings that can be changed in the wizard
		return (
			currentSnapshot.currentTemplate !== this.initialSettingsSnapshot.currentTemplate ||
			currentSnapshot.currentTheme !== this.initialSettingsSnapshot.currentTheme ||
			currentSnapshot.contentOrganization !== this.initialSettingsSnapshot.contentOrganization ||
			JSON.stringify(currentSnapshot.siteInfo) !== JSON.stringify(this.initialSettingsSnapshot.siteInfo) ||
			JSON.stringify(currentSnapshot.navigation) !== JSON.stringify(this.initialSettingsSnapshot.navigation) ||
			JSON.stringify(currentSnapshot.features) !== JSON.stringify(this.initialSettingsSnapshot.features) ||
			JSON.stringify(currentSnapshot.typography) !== JSON.stringify(this.initialSettingsSnapshot.typography) ||
			JSON.stringify(currentSnapshot.optionalFeatures) !== JSON.stringify(this.initialSettingsSnapshot.optionalFeatures) ||
			JSON.stringify(currentSnapshot.deployment) !== JSON.stringify(this.initialSettingsSnapshot.deployment) ||
			JSON.stringify(currentSnapshot.optionalContentTypes) !== JSON.stringify(this.initialSettingsSnapshot.optionalContentTypes)
		);
	}

	private applyDefaultValuesForCurrentStep() {
		// Skip button should preserve current values for all steps
		// This means not applying any changes - just move to the next step
		// The current state already has the correct values from refreshState()
		// No state modifications needed
	}
}
