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

		// Skip button (for steps 2-9, not first or last)
		if (this.stateManager.canGoNext() && state.currentStep > 1) {
			const skipBtn = buttons.createEl('button', {
				text: 'Skip',
				cls: 'mod-button'
			});
			skipBtn.style.opacity = '0.6';
			skipBtn.addEventListener('click', () => {
				// Apply default values for current step
				this.applyDefaultValuesForCurrentStep();
				this.stateManager.nextStep();
				this.renderCurrentStep();
			});
		}
	}

	private applyDefaultValuesForCurrentStep() {
		const state = this.stateManager.getState();
		const stepIndex = state.currentStep - 1;
		
		// Apply default values based on current step
		switch (stepIndex) {
			case 1: // Template step - use standard template
				this.stateManager.setState({ selectedTemplate: 'standard' });
				break;
			case 2: // Theme step - use default theme
				this.stateManager.setState({ selectedTheme: 'oxygen' });
				break;
			case 3: // Font step - use default fonts
				this.stateManager.setState({ 
					selectedTypography: {
						fontSource: 'system',
						proseFont: 'Inter',
						headingFont: 'Inter',
						monoFont: 'JetBrains Mono',
						customFonts: {
							prose: '',
							heading: '',
							mono: ''
						}
					}
				});
				break;
			case 4: // Content organization step
				this.stateManager.setState({ selectedContentOrg: 'file-based' });
				break;
			case 5: // Navigation step - don't reset, keep current values
				// Navigation step should preserve current values, not reset them
				break;
			case 6: // Optional features step
				this.stateManager.setState({
					selectedOptionalFeatures: {
						profilePicture: {
							enabled: false,
							image: '/profile.jpg',
							alt: 'Profile picture',
							size: 'md',
							url: '',
							placement: 'footer',
							style: 'circle'
						},
						comments: {
							enabled: false,
							provider: 'giscus'
						}
					}
				});
				break;
			case 7: // Deployment step
				this.stateManager.setState({ selectedDeployment: 'netlify' });
				break;
			case 8: // Plugin config step - no defaults needed
				break;
		}
	}
}
