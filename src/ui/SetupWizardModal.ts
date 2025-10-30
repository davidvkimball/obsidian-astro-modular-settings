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

export class SetupWizardModal extends Modal {
	private stateManager: WizardStateManager;
	private plugin: Plugin;
	private steps: BaseWizardStep[];

	constructor(app: App, plugin: Plugin) {
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
		
		this.renderCurrentStep();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		
		// Save any wizard state changes to data.json if modal is closed
		// This ensures changes are preserved even if user closes modal without completing wizard
		this.saveWizardStateToDataJson();
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
			nextBtn.addEventListener('click', () => {
				// Save current step changes to wizard state (not to data.json yet)
				this.saveCurrentStepToWizardState();
				this.stateManager.nextStep();
				this.renderCurrentStep();
			});
		} else {
			const completeBtn = buttons.createEl('button', {
				text: 'Complete Setup',
				cls: 'mod-button mod-cta'
			});
			completeBtn.addEventListener('click', async () => {
				// Complete the wizard
				const finalStep = this.steps[this.steps.length - 1] as FinalizeStep;
				await finalStep.completeWizard();
				
				// Save the final settings
				await this.plugin.saveData((this.plugin as any).settings);
				
				// CRITICAL: Reload settings from disk to ensure everything is synchronized
				await (this.plugin as any).loadSettings();
				
				// Trigger settings tab refresh to show updated values
				await (this.plugin as any).triggerSettingsRefresh();
				
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

	private saveCurrentStepToWizardState(): void {
		// Save current step changes to wizard state (not to data.json yet)
		// This is called when NEXT is clicked
		// The wizard state already contains the changes from user interactions
		// This method is mainly for any final processing needed before moving to next step
	}

	private discardCurrentStepChanges(): void {
		// Discard changes made on current step - this is called when PREVIOUS is clicked
		// Refresh the wizard state to show original values from data.json
		this.stateManager.refreshState();
	}

	private async saveWizardStateToDataJson(): Promise<void> {
		// Save wizard state changes to data.json when modal is closed
		// This ensures changes are preserved even if user closes modal without completing wizard
		try {
			// Build final settings from wizard state
			this.stateManager.buildFinalSettings();
			
			// Save to data.json
			await this.plugin.saveData((this.plugin as any).settings);
			
			// Reload settings to ensure the plugin has the latest values
			await (this.plugin as any).loadSettings();
		} catch (error) {
			console.error('Error saving wizard state to data.json:', error);
		}
	}

	private applyDefaultValuesForCurrentStep() {
		// Skip button should preserve current values for all steps
		// This means not applying any changes - just move to the next step
		// The current state already has the correct values from refreshState()
		// No state modifications needed
	}
}
