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
				this.stateManager.previousStep();
				// Refresh state when navigating to ensure we have the latest settings
				this.stateManager.refreshState();
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
				this.stateManager.nextStep();
				// Refresh state when navigating to ensure we have the latest settings
				this.stateManager.refreshState();
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
				
				// Trigger settings tab refresh to show updated values
				(this.plugin as any).triggerSettingsRefresh();
				
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
				// Revert current step to original settings (skip without applying changes)
				this.revertCurrentStepToOriginalSettings();
				this.stateManager.nextStep();
				this.renderCurrentStep();
			});
		}
	}

	private revertCurrentStepToOriginalSettings() {
		// Revert the current step's state back to the original plugin settings
		// This ensures that skipping a step doesn't apply any changes made on that step
		const settings = (this.plugin as any).settings;
		const state = this.stateManager.getState();
		const stepIndex = state.currentStep - 1;
		
		switch (stepIndex) {
			case 0: // WelcomeStep - revert site info
				this.stateManager.updateState({
					selectedSiteInfo: settings.siteInfo
				});
				break;
			case 1: // TemplateStep - revert template and features
				// Revert template selection
				this.stateManager.updateState({
					selectedTemplate: settings.currentTemplate
				});
				
				// Revert features to match the original template
				const originalTemplatePreset = (this.plugin as any).configManager.getTemplatePreset(settings.currentTemplate);
				if (originalTemplatePreset && originalTemplatePreset.config && originalTemplatePreset.config.features) {
					this.stateManager.updateState({
						selectedFeatures: originalTemplatePreset.config.features
					});
				}
				break;
			case 2: // ThemeStep - revert theme
				this.stateManager.updateState({
					selectedTheme: settings.currentTheme
				});
				break;
			case 3: // FontStep - revert typography
				this.stateManager.updateState({
					selectedTypography: settings.typography
				});
				break;
			case 4: // ContentOrgStep - revert content organization
				this.stateManager.updateState({
					selectedContentOrg: settings.contentOrganization
				});
				break;
			case 5: // NavigationStep - revert navigation
				this.stateManager.updateState({
					selectedNavigation: settings.navigation
				});
				break;
			case 6: // OptionalFeaturesStep - revert optional features
				this.stateManager.updateState({
					selectedOptionalFeatures: settings.optionalFeatures
				});
				break;
			case 7: // DeploymentStep - revert deployment
				this.stateManager.updateState({
					selectedDeployment: settings.deployment.platform
				});
				break;
			case 8: // PluginConfigStep - no specific state to revert
				break;
		}
	}

	private applyDefaultValuesForCurrentStep() {
		// Skip button should preserve current values for all steps
		// This means not applying any changes - just move to the next step
		// The current state already has the correct values from refreshState()
		// No state modifications needed
	}
}
