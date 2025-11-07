import { App, Modal, Notice, Plugin } from 'obsidian';
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
import { AstroModularSettings } from '../types';
import { ConfigManager } from '../utils/ConfigManager';

export interface AstroModularPlugin extends Plugin {
	settings: AstroModularSettings;
	configManager: ConfigManager;
	loadSettings(): Promise<void>;
	triggerSettingsRefresh(): Promise<void>;
}

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
		
		this.renderCurrentStep();
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();
		
		// Save any wizard state changes to data.json and config.ts if modal is closed
		// This ensures changes are preserved even if user closes modal without completing wizard
		// Only show notification if not completing (Complete Setup already shows its own notification)
		await this.saveWizardStateToDataJson(!this.isCompleting);
		
		// Reset the flag
		this.isCompleting = false;
	}

	private renderCurrentStep() {
		const { contentEl } = this;
		const state = this.stateManager.getState();
		
		// Clear content
		contentEl.empty();
		contentEl.addClass('astro-modular-wizard');

		// Render header
		this.renderHeader(contentEl);

		// Render progress
		this.renderProgress(contentEl);

		// Render step content
		const stepContent = contentEl.createDiv('wizard-content');
		this.renderStepContent(stepContent);

		// Render footer
		this.renderFooter(contentEl);
		
		// Scroll to top of the modal content after rendering
		contentEl.scrollTop = 0;
	}

	private renderHeader(container: HTMLElement) {
		const header = container.createDiv('wizard-header');
		header.innerHTML = `
			<h1>Astro Modular Setup</h1>
		`;
	}

	private renderProgress(container: HTMLElement) {
		const state = this.stateManager.getState();
		const progress = container.createDiv('wizard-progress');
		
		progress.innerHTML = `
			<div class="progress-bar">
				<div class="progress-fill" style="width: ${this.stateManager.getProgress()}%"></div>
			</div>
			<div class="progress-text">Step ${state.currentStep} of ${state.totalSteps}</div>
		`;
	}

	private async renderStepContent(container: HTMLElement) {
		const state = this.stateManager.getState();
		const stepIndex = state.currentStep - 1;
		
		if (stepIndex >= 0 && stepIndex < this.steps.length) {
			await this.steps[stepIndex].render(container);
		}
	}

	private renderFooter(container: HTMLElement) {
		const state = this.stateManager.getState();
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
				this.renderCurrentStep();
			});
		}

		// Next/Complete button
		if (this.stateManager.canGoNext()) {
			const nextBtn = buttons.createEl('button', {
				text: 'Next',
				cls: 'mod-button mod-cta'
			});
			nextBtn.addEventListener('click', async () => {
				// Save current step changes to wizard state, data.json, and config.ts
				await this.saveCurrentStepToWizardState();
				this.stateManager.nextStep();
				this.renderCurrentStep();
			});
		} else {
			const completeBtn = buttons.createEl('button', {
				text: 'Complete Setup',
				cls: 'mod-button mod-cta'
			});
			completeBtn.addEventListener('click', async () => {
				// Mark that we're completing the wizard to avoid duplicate notifications
				this.isCompleting = true;
				
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
			});
		}

		// Skip button (for all steps except the last)
		if (this.stateManager.canGoNext()) {
			const skipBtn = buttons.createEl('button', {
				text: 'Skip',
				cls: 'mod-button'
			});
			skipBtn.style.opacity = '0.6';
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
			
			// Save to data.json
			await this.plugin.saveData(this.plugin.settings);
			
			// Reload settings to ensure the plugin has the latest values
			await this.plugin.loadSettings();
			
			// Only apply to config.ts if there were changes
			if (hasChanges) {
				const settings = this.plugin.settings;
				const presetSuccess = await this.plugin.configManager.applyPreset({
					name: settings.currentTemplate,
					description: '',
					features: settings.features,
					theme: settings.currentTheme,
					contentOrganization: settings.contentOrganization,
					config: settings
				});
				
				// Only show notification if requested and changes were made
				if (showNotification && hasChanges) {
					if (presetSuccess) {
						new Notice('Configuration saved to config.ts');
					} else {
						new Notice('Failed to save configuration to config.ts');
					}
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
