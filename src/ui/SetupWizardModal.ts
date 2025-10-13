import { App, Modal, Notice, Setting } from 'obsidian';
import { AstroModularSettings, TemplateType, ThemeType, ContentOrganizationType, THEME_OPTIONS, TEMPLATE_OPTIONS } from '../types';
import { ConfigManager } from '../utils/ConfigManager';
import { PluginManager } from '../utils/PluginManager';

export class SetupWizardModal extends Modal {
	private settings: AstroModularSettings;
	private currentStep: number = 1;
	private totalSteps: number = 7;
	private configManager: ConfigManager;
	private pluginManager: PluginManager;
	private onComplete: (settings: AstroModularSettings) => void;

	// Wizard state
	private selectedTemplate: TemplateType = 'standard';
	private selectedTheme: ThemeType = 'oxygen';
	private selectedContentOrg: ContentOrganizationType = 'file-based';
	private selectedFeatures: any = {};
	private runWizardOnStartup: boolean = true;
	private doNotShowAgain: boolean = false;

	constructor(app: App, settings: AstroModularSettings, onComplete: (settings: AstroModularSettings) => void) {
		super(app);
		this.settings = settings;
		this.configManager = new ConfigManager(app);
		this.pluginManager = new PluginManager(app);
		this.onComplete = onComplete;
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
		contentEl.empty();

		// Header
		const header = contentEl.createDiv('wizard-header');
		header.innerHTML = `
			<div class="wizard-logo">🚀</div>
			<h1>Astro Modular Setup</h1>
			<div class="wizard-progress">
				<div class="progress-bar">
					<div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
				</div>
				<span class="progress-text">Step ${this.currentStep} of ${this.totalSteps}</span>
			</div>
		`;

		// Content
		const content = contentEl.createDiv('wizard-content');
		this.renderStepContent(content);

		// Footer
		const footer = contentEl.createDiv('wizard-footer');
		this.renderStepFooter(footer);
	}

	private renderStepContent(container: HTMLElement) {
		switch (this.currentStep) {
			case 1:
				this.renderWelcomeStep(container);
				break;
			case 2:
				this.renderTemplateStep(container);
				break;
			case 3:
				this.renderThemeStep(container);
				break;
			case 4:
				this.renderContentOrgStep(container);
				break;
			case 5:
				this.renderFeaturesStep(container);
				break;
			case 6:
				this.renderPluginConfigStep(container);
				break;
			case 7:
				this.renderFinalizeStep(container);
				break;
		}
	}

	private renderWelcomeStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="welcome-content">
				<h2>Welcome to Astro Modular!</h2>
				<p>This wizard will help you set up your Astro Modular theme with the perfect configuration for your needs.</p>
				<div class="welcome-features">
					<div class="feature-item">
						<span class="feature-icon">🎨</span>
						<span>Beautiful themes</span>
					</div>
					<div class="feature-item">
						<span class="feature-icon">⚡</span>
						<span>Fast setup</span>
					</div>
					<div class="feature-item">
						<span class="feature-icon">🔧</span>
						<span>Easy configuration</span>
					</div>
				</div>
				<p class="welcome-note">
					<a href="https://github.com/astro-modular/docs" target="_blank">📖 View documentation</a>
				</p>
			</div>
		`;
	}

	private renderTemplateStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="template-selection">
				<h2>Choose your template</h2>
				<p>Select a template that best fits your content type and goals.</p>
				<div class="template-options">
					${TEMPLATE_OPTIONS.map(template => `
						<div class="template-option ${this.selectedTemplate === template.id ? 'selected' : ''}" 
							 data-template="${template.id}">
							<div class="template-header">
								<h3>${template.name}</h3>
								${template.recommended ? '<span class="recommended">Recommended</span>' : ''}
							</div>
							<p class="template-description">${template.description}</p>
							<div class="template-features">
								${template.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
							</div>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.template-option').forEach(option => {
			option.addEventListener('click', () => {
				const template = option.getAttribute('data-template');
				if (template) {
					this.selectedTemplate = template as TemplateType;
					this.renderCurrentStep();
				}
			});
		});
	}

	private renderThemeStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="theme-selection">
				<h2>Choose your theme</h2>
				<p>Select a color scheme that matches your style and content.</p>
				<div class="theme-options">
					${THEME_OPTIONS.map(theme => `
						<div class="theme-option ${this.selectedTheme === theme.id ? 'selected' : ''}" 
							 data-theme="${theme.id}">
							<div class="theme-preview" style="background: linear-gradient(135deg, ${theme.previewColors.join(', ')});">
								<div class="theme-preview-content">
									<div class="preview-text">Sample Text</div>
									<div class="preview-accent">Accent</div>
								</div>
							</div>
							<div class="theme-info">
								<h3>${theme.name}</h3>
								<p>${theme.description}</p>
							</div>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.theme-option').forEach(option => {
			option.addEventListener('click', () => {
				const theme = option.getAttribute('data-theme');
				if (theme) {
					this.selectedTheme = theme as ThemeType;
					this.renderCurrentStep();
				}
			});
		});
	}

	private renderContentOrgStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="content-org-selection">
				<h2>Content organization</h2>
				<p>Choose how you want to organize your content and assets.</p>
				<div class="org-options">
					<div class="org-option ${this.selectedContentOrg === 'file-based' ? 'selected' : ''}" 
						 data-org="file-based">
						<div class="org-header">
							<h3>File-based</h3>
							<span class="default-badge">Default</span>
						</div>
						<p>Single markdown files with images in attachments subfolder</p>
						<div class="org-example">
							<code>
								posts/<br>
								├── my-post.md<br>
								└── attachments/<br>
								    └── image.jpg
							</code>
						</div>
					</div>
					<div class="org-option ${this.selectedContentOrg === 'folder-based' ? 'selected' : ''}" 
						 data-org="folder-based">
						<div class="org-header">
							<h3>Folder-based</h3>
						</div>
						<p>Each post gets its own folder with co-located assets</p>
						<div class="org-example">
							<code>
								posts/<br>
								├── my-post/<br>
								│   ├── index.md<br>
								│   └── image.jpg<br>
								└── another-post/<br>
								    ├── index.md<br>
								    └── image.jpg
							</code>
						</div>
					</div>
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.org-option').forEach(option => {
			option.addEventListener('click', () => {
				const org = option.getAttribute('data-org');
				if (org) {
					this.selectedContentOrg = org as ContentOrganizationType;
					this.renderCurrentStep();
				}
			});
		});
	}

	private renderFeaturesStep(container: HTMLElement) {
		if (this.selectedTemplate !== 'custom') {
			// Skip features step for non-custom templates
			this.currentStep++;
			this.renderCurrentStep();
			return;
		}

		container.innerHTML = `
			<div class="features-selection">
				<h2>Configure features</h2>
				<p>Choose which features you want to enable for your site.</p>
				<div class="features-list">
					${Object.entries({
						commandPalette: 'Command palette',
						tableOfContents: 'Table of contents',
						readingTime: 'Reading time',
						linkedMentions: 'Linked mentions',
						comments: 'Comments'
					}).map(([key, label]) => `
						<div class="feature-setting">
							<label class="feature-toggle">
								<input type="checkbox" ${this.selectedFeatures[key] ? 'checked' : ''} data-feature="${key}">
								<span class="toggle-slider"></span>
								<span class="feature-label">${label}</span>
							</label>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
			checkbox.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				const feature = target.dataset.feature;
				if (feature) {
					this.selectedFeatures[feature] = target.checked;
				}
			});
		});
	}

	private async renderPluginConfigStep(container: HTMLElement) {
		const pluginStatus = await this.pluginManager.getPluginStatus();
		
		container.innerHTML = `
			<div class="plugin-config">
				<h2>Plugin configuration</h2>
				<p>We'll automatically configure your plugins based on your choices.</p>
				<div class="plugin-status">
					${pluginStatus.map(plugin => `
						<div class="plugin-item ${plugin.installed ? 'installed' : 'missing'}">
							<div class="plugin-icon">${plugin.installed ? '✅' : '❌'}</div>
							<div class="plugin-info">
								<h3>${plugin.name}</h3>
								<p>${plugin.installed ? 'Ready to configure' : 'Not installed'}</p>
							</div>
						</div>
					`).join('')}
				</div>
				<div class="config-options">
					<button class="config-button primary" id="auto-configure">Configure automatically</button>
					<button class="config-button secondary" id="manual-configure">Show manual instructions</button>
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelector('#auto-configure')?.addEventListener('click', () => {
			this.configurePlugins();
		});

		container.querySelector('#manual-configure')?.addEventListener('click', () => {
			this.showManualInstructions();
		});
	}

	private renderFinalizeStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="finalize-step">
				<h2>Almost done!</h2>
				<p>Review your configuration and complete the setup.</p>
				<div class="config-summary">
					<div class="summary-item">
						<strong>Template:</strong> ${TEMPLATE_OPTIONS.find(t => t.id === this.selectedTemplate)?.name}
					</div>
					<div class="summary-item">
						<strong>Theme:</strong> ${THEME_OPTIONS.find(t => t.id === this.selectedTheme)?.name}
					</div>
					<div class="summary-item">
						<strong>Organization:</strong> ${this.selectedContentOrg === 'file-based' ? 'File-based' : 'Folder-based'}
					</div>
				</div>
				<div class="finalize-options">
					<label class="checkbox-option">
						<input type="checkbox" ${this.runWizardOnStartup ? 'checked' : ''} id="run-on-startup">
						<span>Run wizard on startup</span>
					</label>
					<label class="checkbox-option">
						<input type="checkbox" ${this.doNotShowAgain ? 'checked' : ''} id="do-not-show-again">
						<span>Do not show this again</span>
					</label>
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#run-on-startup')?.addEventListener('change', (e) => {
			this.runWizardOnStartup = (e.target as HTMLInputElement).checked;
		});

		container.querySelector('#do-not-show-again')?.addEventListener('change', (e) => {
			this.doNotShowAgain = (e.target as HTMLInputElement).checked;
		});
	}

	private renderStepFooter(container: HTMLElement) {
		const buttonContainer = container.createDiv('wizard-buttons');

		// Previous button
		if (this.currentStep > 1) {
			const prevButton = buttonContainer.createEl('button', {
				text: 'Previous',
				cls: 'wizard-button secondary'
			});
			prevButton.addEventListener('click', () => {
				this.currentStep--;
				this.renderCurrentStep();
			});
		}

		// Next/Complete button
		const nextButton = buttonContainer.createEl('button', {
			text: this.currentStep === this.totalSteps ? 'Complete Setup' : 'Next',
			cls: 'wizard-button primary'
		});

		nextButton.addEventListener('click', () => {
			if (this.currentStep === this.totalSteps) {
				this.completeSetup();
			} else {
				this.currentStep++;
				this.renderCurrentStep();
			}
		});

		// Skip button (for most steps)
		if (this.currentStep < this.totalSteps) {
			const skipButton = buttonContainer.createEl('button', {
				text: 'Skip',
				cls: 'wizard-button tertiary'
			});
			skipButton.addEventListener('click', () => {
				this.currentStep++;
				this.renderCurrentStep();
			});
		}
	}

	private async configurePlugins() {
		const config: any = {
			obsidianSettings: {
				attachmentLocation: this.selectedContentOrg === 'file-based' ? 'subfolder' : 'same-folder',
				subfolderName: 'attachments'
			},
			astroComposerSettings: {
				creationMode: this.selectedContentOrg,
				indexFileName: 'index'
			},
			imageInserterSettings: {
				insertFormat: this.selectedContentOrg === 'file-based' 
					? '[[attachments/{image-url}]]' 
					: '[[{image-url}]]'
			}
		};

		const success = await this.pluginManager.configurePlugins(config);
		if (success) {
			new Notice('Plugins configured successfully!');
		} else {
			new Notice('Some plugins could not be configured automatically. Check the manual instructions.');
		}
	}

	private async showManualInstructions() {
		const config: any = {
			obsidianSettings: {
				attachmentLocation: this.selectedContentOrg === 'file-based' ? 'subfolder' : 'same-folder',
				subfolderName: 'attachments'
			},
			astroComposerSettings: {
				creationMode: this.selectedContentOrg,
				indexFileName: 'index'
			},
			imageInserterSettings: {
				insertFormat: this.selectedContentOrg === 'file-based' 
					? '[[attachments/{image-url}]]' 
					: '[[{image-url}]]'
			}
		};

		const instructions = await this.pluginManager.getManualConfigurationInstructions(config);
		
		// Create a modal to show instructions
		const instructionModal = new Modal(this.app);
		instructionModal.titleEl.setText('Manual Configuration Instructions');
		instructionModal.contentEl.innerHTML = `<pre>${instructions}</pre>`;
		instructionModal.open();
	}

	private async completeSetup() {
		// Update settings
		this.settings.currentTemplate = this.selectedTemplate;
		this.settings.currentTheme = this.selectedTheme;
		this.settings.contentOrganization = this.selectedContentOrg;
		this.settings.runWizardOnStartup = this.runWizardOnStartup;
		this.settings.doNotShowWizardAgain = this.doNotShowAgain;

		// Apply configuration
		await this.configManager.applyPreset({
			name: this.selectedTemplate,
			description: '',
			features: this.selectedFeatures,
			theme: this.selectedTheme,
			contentOrganization: this.selectedContentOrg,
			config: this.settings
		});

		// Trigger rebuild
		await this.configManager.triggerRebuild();

		// Complete
		this.onComplete(this.settings);
		this.close();
		new Notice('Astro Modular setup complete! 🎉');
	}
}
