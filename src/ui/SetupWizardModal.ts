import { App, Modal, Notice, Setting } from 'obsidian';
import { AstroModularSettings, TemplateType, ThemeType, ContentOrganizationType, THEME_OPTIONS, TEMPLATE_OPTIONS, FONT_OPTIONS } from '../types';
import { ConfigManager } from '../utils/ConfigManager';
import { PluginManager } from '../utils/PluginManager';

export class SetupWizardModal extends Modal {
	private settings: AstroModularSettings;
	private currentStep: number = 1;
	private totalSteps: number = 10;
	private configManager: ConfigManager;
	private pluginManager: PluginManager;
	private onComplete: (settings: AstroModularSettings) => void;

	// Wizard state - initialized from current settings
	private selectedTemplate: TemplateType;
	private selectedTheme: ThemeType;
	private selectedContentOrg: ContentOrganizationType;
	private selectedSiteInfo: any;
	private selectedNavigation: any;
	private selectedFeatures: any = {};
	private selectedTypography: any;
	private selectedOptionalFeatures: any;
	private selectedDeployment: 'netlify' | 'vercel' | 'github-pages';
	private runWizardOnStartup: boolean;

	constructor(app: App, settings: AstroModularSettings, onComplete: (settings: AstroModularSettings) => void) {
		super(app);
		this.settings = settings;
		this.configManager = new ConfigManager(app);
		this.pluginManager = new PluginManager(app);
		this.onComplete = onComplete;
		
		// Initialize wizard state from current settings
		this.initializeFromSettings();
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

	private initializeFromSettings() {
		// Initialize from current settings, with fallbacks to defaults
		this.selectedTemplate = this.settings.currentTemplate || 'standard';
		this.selectedTheme = this.settings.currentTheme || 'oxygen';
		this.selectedContentOrg = this.settings.contentOrganization || 'file-based';
		this.selectedSiteInfo = this.settings.siteInfo || {
			site: 'https://astro-modular.netlify.app',
			title: 'Astro Modular',
			description: 'A flexible blog theme designed for Obsidian users.',
			author: 'David V. Kimball',
			language: 'en'
		};
		this.selectedNavigation = this.settings.navigation || {
			pages: [
				{ title: 'Posts', url: '/posts' },
				{ title: 'Projects', url: '/projects' },
				{ title: 'Docs', url: '/docs' },
				{ title: 'About', url: '/about' },
				{ title: 'GitHub', url: 'https://github.com/davidvkimball/astro-modular' }
			],
			social: [
				{ title: 'X', url: 'https://x.com/davidvkimball', icon: 'x-twitter' },
				{ title: 'GitHub', url: 'https://github.com/davidvkimball', icon: 'github' }
			]
		};
		this.selectedFeatures = this.settings.features || {};
		this.selectedTypography = this.settings.typography || {
			headingFont: 'Inter',
			proseFont: 'Inter',
			monoFont: 'JetBrains Mono',
			fontSource: 'local' as 'local' | 'cdn',
			customFonts: {
				heading: '',
				prose: '',
				mono: ''
			}
		};
		this.selectedOptionalFeatures = this.settings.optionalFeatures || {
			profilePicture: {
				enabled: false,
				image: '/profile.jpg',
				alt: 'Profile picture',
				size: 'md' as 'sm' | 'md' | 'lg',
				url: '',
				placement: 'footer' as 'footer' | 'header',
				style: 'circle' as 'circle' | 'square' | 'none'
			},
			comments: {
				enabled: false,
				provider: 'giscus' as 'giscus'
			}
		};
		this.selectedDeployment = this.settings.deployment?.platform || 'netlify';
		this.runWizardOnStartup = this.settings.runWizardOnStartup !== undefined ? this.settings.runWizardOnStartup : true;
	}

	private renderCurrentStep() {
		const { contentEl } = this;
		contentEl.empty();

		// Reset scroll position to top
		contentEl.scrollTop = 0;

		// Header
		const header = contentEl.createDiv('wizard-header');
		const progressPercentage = Math.max((this.currentStep / this.totalSteps) * 100, 5);
		
		header.innerHTML = `
			<h1>Astro Modular Setup</h1>
			<div class="wizard-progress">
				<div class="progress-bar">
					<div class="progress-fill"></div>
				</div>
				<span class="progress-text">Step ${this.currentStep} of ${this.totalSteps}</span>
			</div>
		`;
		
		// Set the progress bar width after the element is created
		const progressFill = header.querySelector('.progress-fill') as HTMLElement;
		const progressBar = header.querySelector('.progress-bar') as HTMLElement;
		if (progressFill && progressBar) {
			progressFill.style.width = `${progressPercentage}%`;
			progressFill.style.setProperty('background', 'var(--interactive-accent)', 'important'); // Use Obsidian theme color
			progressFill.style.setProperty('height', '12px', 'important'); // Match container height
			progressFill.style.setProperty('border-radius', '4px', 'important');
			progressFill.style.setProperty('display', 'block', 'important');
			progressFill.style.setProperty('min-height', '12px', 'important'); // Match container height
			progressFill.style.setProperty('margin', '0', 'important'); // Remove any margins
			progressFill.style.setProperty('padding', '0', 'important'); // Remove any padding
			progressFill.style.setProperty('position', 'absolute', 'important'); // Position absolutely
			progressFill.style.setProperty('top', '0', 'important'); // Start from top
			progressFill.style.setProperty('left', '0', 'important'); // Start from left
			
		}

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
				this.renderFontStep(container);
				break;
			case 5:
				this.renderContentOrgStep(container);
				break;
			case 6:
				this.renderNavigationStep(container);
				break;
			case 7:
				this.renderOptionalFeaturesStep(container);
				break;
			case 8:
				this.renderDeploymentStep(container);
				break;
			case 9:
				this.renderPluginConfigStep(container);
				break;
			case 10:
				this.renderFinalizeStep(container);
				break;
		}
	}

	private renderWelcomeStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="welcome-content">
				<h2>Welcome to Astro Modular!</h2>
				<p>This wizard will help you set up your Astro Modular theme with the perfect configuration for your needs.</p>
				
				<div class="site-info-form">
					<h3>Site Information</h3>
					<div class="form-group">
						<label for="site-url">URL</label>
						<input type="text" id="site-url" value="${this.selectedSiteInfo.site}" placeholder="https://astro-modular.netlify.app">
					</div>
					<div class="form-group">
						<label for="site-title">Title</label>
						<input type="text" id="site-title" value="${this.selectedSiteInfo.title}" placeholder="Astro Modular">
					</div>
					<div class="form-group">
						<label for="site-description">Description</label>
						<input type="text" id="site-description" value="${this.selectedSiteInfo.description}" placeholder="A flexible blog theme designed for Obsidian users.">
					</div>
					<div class="form-group">
						<label for="site-author">Author Name</label>
						<input type="text" id="site-author" value="${this.selectedSiteInfo.author}" placeholder="David V. Kimball">
					</div>
					<div class="form-group">
						<label for="site-language">Language</label>
						<input type="text" id="site-language" value="${this.selectedSiteInfo.language}" placeholder="en">
					</div>
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#site-url')?.addEventListener('input', (e) => {
			this.selectedSiteInfo.site = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#site-title')?.addEventListener('input', (e) => {
			this.selectedSiteInfo.title = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#site-description')?.addEventListener('input', (e) => {
			this.selectedSiteInfo.description = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#site-author')?.addEventListener('input', (e) => {
			this.selectedSiteInfo.author = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#site-language')?.addEventListener('input', (e) => {
			this.selectedSiteInfo.language = (e.target as HTMLInputElement).value;
		});
	}

	private renderTemplateStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="template-selection">
				<h2>Choose your preset</h2>
				<p>Select a preset that best fits your content type and goals.</p>
				<div class="template-options">
					${TEMPLATE_OPTIONS.map(template => `
						<div class="template-option ${this.selectedTemplate === template.id ? 'selected' : ''}" 
							 data-template="${template.id}">
							<div class="template-header">
								<h3>${template.name}</h3>
								${template.recommended ? '<span class="recommended">Default</span>' : ''}
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
					if (template === 'custom') {
						// Open config.ts file
						const configPath = '../../../config.ts';
						const file = this.app.vault.getAbstractFileByPath(configPath);
						if (file) {
							this.app.workspace.openLinkText('', configPath);
						} else {
							// Create the file if it doesn't exist
							this.app.vault.create(configPath, '// Astro Modular Configuration\n// Customize your settings here\n\nexport const siteConfig = {\n  // Add your configuration here\n};\n');
							this.app.workspace.openLinkText('', configPath);
						}
						new Notice('Opening config.ts for custom configuration');
						this.close();
						return;
					}
					this.renderCurrentStep();
				}
			});
		});
	}

	private renderThemeStep(container: HTMLElement) {
		const isDarkMode = this.isObsidianDarkMode();
		
		container.innerHTML = `
			<div class="theme-selection">
				<h2>Choose your theme</h2>
				<p>Select a color scheme that matches your style and content.</p>
				<div class="theme-options">
					${THEME_OPTIONS.map(theme => `
						<div class="theme-option ${this.selectedTheme === theme.id ? 'selected' : ''}" 
							 data-theme="${theme.id}" 
							 style="background: ${isDarkMode ? theme.backgroundColorDark : theme.backgroundColorLight};">
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
							<pre><code>posts/
├── my-post.md
└── attachments/
    └── image.jpg</code></pre>
						</div>
					</div>
					<div class="org-option ${this.selectedContentOrg === 'folder-based' ? 'selected' : ''}" 
						 data-org="folder-based">
						<div class="org-header">
							<h3>Folder-based</h3>
						</div>
						<p>Each post gets its own folder with co-located assets</p>
						<div class="org-example">
							<pre><code>posts/
├── my-post/
│   ├── index.md
│   └── image.jpg
└── another-post/
    ├── index.md
    └── image.jpg</code></pre>
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

	private renderNavigationStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="navigation-config">
				<h2>Navigation</h2>
				<p>Configure your site's navigation menu and social links.</p>
				
				<div class="navigation-sections">
					<div class="nav-section">
						<h3>Pages</h3>
						<p>Add and arrange navigation pages</p>
						<div class="nav-items" id="pages-list">
							${this.selectedNavigation.pages.map((page: any, index: number) => `
								<div class="nav-item" data-index="${index}" draggable="true">
									<div class="nav-item-content">
										<div class="nav-item-fields">
											<input type="text" class="nav-title" value="${page.title}" placeholder="Page Title">
											<input type="text" class="nav-url" value="${page.url}" placeholder="/page-url">
										</div>
										<button class="nav-remove mod-warning" type="button">Remove</button>
									</div>
								</div>
							`).join('')}
						</div>
						<button class="nav-add mod-button" id="add-page" type="button">Add Page</button>
					</div>
					
					<div class="nav-section">
						<h3>Social Links</h3>
						<p>Add social media and external links</p>
						<div class="nav-items" id="social-list">
							${this.selectedNavigation.social.map((social: any, index: number) => `
								<div class="nav-item" data-index="${index}" draggable="true">
									<div class="nav-item-content">
										<div class="nav-item-fields">
											<input type="text" class="nav-title" value="${social.title}" placeholder="Social Title">
											<input type="text" class="nav-url" value="${social.url}" placeholder="https://example.com">
										</div>
										<button class="nav-remove mod-warning" type="button">Remove</button>
									</div>
									<div class="nav-icon-row">
										<input type="text" class="nav-icon" value="${social.icon}" placeholder="icon-name">
										<div class="nav-icon-help">
											<small>Icon names from <a href="https://fontawesome.com/search?ic=brands&o=r" target="_blank">FontAwesome Brands</a></small>
										</div>
									</div>
								</div>
							`).join('')}
						</div>
						<button class="nav-add mod-button" id="add-social" type="button">Add Social Link</button>
					</div>
				</div>
			</div>
		`;

		// Add event handlers for pages
		container.querySelector('#add-page')?.addEventListener('click', () => {
			this.addNavigationItem('pages');
		});

		container.querySelector('#add-social')?.addEventListener('click', () => {
			this.addNavigationItem('social');
		});

		// Add event handlers for existing items
		container.querySelectorAll('#pages-list .nav-remove').forEach(button => {
			button.addEventListener('click', (e) => {
				const item = (e.target as HTMLElement).closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				this.removeNavigationItem('pages', index);
				this.renderCurrentStep();
			});
		});

		container.querySelectorAll('#social-list .nav-remove').forEach(button => {
			button.addEventListener('click', (e) => {
				const item = (e.target as HTMLElement).closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				this.removeNavigationItem('social', index);
				this.renderCurrentStep();
			});
		});

		// Add input change handlers
		container.querySelectorAll('#pages-list .nav-title, #pages-list .nav-url').forEach(input => {
			input.addEventListener('input', (e) => {
				const item = (e.target as HTMLElement).closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = (e.target as HTMLElement).classList.contains('nav-title') ? 'title' : 'url';
				this.updateNavigationItem('pages', index, field, (e.target as HTMLInputElement).value);
			});
		});

		container.querySelectorAll('#social-list .nav-title, #social-list .nav-url').forEach(input => {
			input.addEventListener('input', (e) => {
				const item = (e.target as HTMLElement).closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = (e.target as HTMLElement).classList.contains('nav-title') ? 'title' : 'url';
				this.updateNavigationItem('social', index, field, (e.target as HTMLInputElement).value);
			});
		});

		container.querySelectorAll('#social-list .nav-icon').forEach(input => {
			input.addEventListener('input', (e) => {
				const item = (e.target as HTMLElement).closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				this.updateNavigationItem('social', index, 'icon', (e.target as HTMLInputElement).value);
			});
		});

		// Add drag and drop functionality
		this.setupDragAndDrop(container);
	}

	private setupDragAndDrop(container: HTMLElement) {
		let draggedElement: HTMLElement | null = null;
		let draggedIndex: number = -1;
		let draggedType: 'pages' | 'social' | null = null;

		// Add drag event listeners to all nav items
		container.querySelectorAll('.nav-item').forEach((item: HTMLElement) => {
			item.addEventListener('dragstart', (e) => {
				draggedElement = item;
				draggedIndex = parseInt(item.getAttribute('data-index') || '0');
				draggedType = item.closest('#pages-list') ? 'pages' : 'social';
				item.classList.add('dragging');
				e.dataTransfer?.setData('text/plain', '');
			});

			item.addEventListener('dragend', (e) => {
				item.classList.remove('dragging');
				draggedElement = null;
				draggedIndex = -1;
				draggedType = null;
			});

			item.addEventListener('dragover', (e) => {
				e.preventDefault();
				item.classList.add('drag-over');
			});

			item.addEventListener('dragleave', (e) => {
				item.classList.remove('drag-over');
			});

			item.addEventListener('drop', (e) => {
				e.preventDefault();
				item.classList.remove('drag-over');
				
				if (draggedElement && draggedType) {
					const targetIndex = parseInt(item.getAttribute('data-index') || '0');
					this.reorderNavigationItems(draggedType, draggedIndex, targetIndex);
					this.renderCurrentStep(); // Re-render to update the UI
				}
			});
		});
	}

	private reorderNavigationItems(type: 'pages' | 'social', fromIndex: number, toIndex: number) {
		const items = type === 'pages' ? this.selectedNavigation.pages : this.selectedNavigation.social;
		
		if (fromIndex === toIndex) return;
		
		// Remove the item from its current position
		const [movedItem] = items.splice(fromIndex, 1);
		
		// Insert it at the new position
		items.splice(toIndex, 0, movedItem);
		
		console.log(`🔄 Reordered ${type}: moved item from ${fromIndex} to ${toIndex}`);
	}

	private addNavigationItem(type: 'pages' | 'social') {
		if (type === 'pages') {
			this.selectedNavigation.pages.push({ title: '', url: '' });
		} else {
			this.selectedNavigation.social.push({ title: '', url: '', icon: '' });
		}
		this.renderCurrentStep();
	}

	private removeNavigationItem(type: 'pages' | 'social', index: number) {
		if (type === 'pages') {
			this.selectedNavigation.pages.splice(index, 1);
		} else {
			this.selectedNavigation.social.splice(index, 1);
		}
	}

	private updateNavigationItem(type: 'pages' | 'social', index: number, field: string, value: string) {
		if (type === 'pages') {
			(this.selectedNavigation.pages[index] as any)[field] = value;
		} else {
			(this.selectedNavigation.social[index] as any)[field] = value;
		}
	}

	private renderFontStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="font-selection">
				<h2>Choose your fonts</h2>
				<p>Select fonts for headings, body text, and code.</p>
				<div class="font-options">
					<div class="font-setting">
						<label>Heading Font</label>
						<select id="heading-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${this.selectedTypography.headingFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Body Font</label>
						<select id="prose-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${this.selectedTypography.proseFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Monospace Font</label>
						<select id="mono-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${this.selectedTypography.monoFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Font Source</label>
						<select id="font-source">
							<option value="local" ${this.selectedTypography.fontSource === 'local' ? 'selected' : ''}>Local (Google Fonts)</option>
							<option value="cdn" ${this.selectedTypography.fontSource === 'cdn' ? 'selected' : ''}>CDN (Custom)</option>
						</select>
					</div>
					${this.selectedTypography.fontSource === 'cdn' ? `
						<div class="font-setting">
							<label>Custom Font URLs (comma-separated)</label>
							<input type="text" id="custom-fonts" placeholder="https://fonts.googleapis.com/css2?family=Custom+Font:wght@400;600&display=swap">
						</div>
						<div class="font-setting">
							<label>Heading Font Name</label>
							<input type="text" id="custom-heading-font" value="${this.selectedTypography.customFonts.heading}" placeholder="Custom Heading Font">
						</div>
						<div class="font-setting">
							<label>Body Font Name</label>
							<input type="text" id="custom-prose-font" value="${this.selectedTypography.customFonts.prose}" placeholder="Custom Body Font">
						</div>
						<div class="font-setting">
							<label>Monospace Font Name</label>
							<input type="text" id="custom-mono-font" value="${this.selectedTypography.customFonts.mono}" placeholder="Custom Monospace Font">
						</div>
					` : ''}
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#heading-font')?.addEventListener('change', (e) => {
			this.selectedTypography.headingFont = (e.target as HTMLSelectElement).value;
		});
		container.querySelector('#prose-font')?.addEventListener('change', (e) => {
			this.selectedTypography.proseFont = (e.target as HTMLSelectElement).value;
		});
		container.querySelector('#mono-font')?.addEventListener('change', (e) => {
			this.selectedTypography.monoFont = (e.target as HTMLSelectElement).value;
		});
		container.querySelector('#font-source')?.addEventListener('change', (e) => {
			this.selectedTypography.fontSource = (e.target as HTMLSelectElement).value as 'local' | 'cdn';
			this.renderCurrentStep(); // Re-render to show/hide custom input
		});

		// Custom font name handlers
		container.querySelector('#custom-heading-font')?.addEventListener('input', (e) => {
			this.selectedTypography.customFonts.heading = (e.target as HTMLInputElement).value;
		});

		container.querySelector('#custom-prose-font')?.addEventListener('input', (e) => {
			this.selectedTypography.customFonts.prose = (e.target as HTMLInputElement).value;
		});

		container.querySelector('#custom-mono-font')?.addEventListener('input', (e) => {
			this.selectedTypography.customFonts.mono = (e.target as HTMLInputElement).value;
		});
	}

	private renderOptionalFeaturesStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="optional-features">
				<h2>Optional features</h2>
				<p>Configure additional features for your site.</p>
				
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-header">
							<label class="feature-toggle">
								<input type="checkbox" ${this.selectedOptionalFeatures.profilePicture.enabled ? 'checked' : ''} id="profile-picture-enabled">
								<span class="toggle-slider"></span>
								<span class="feature-label">Profile Picture</span>
							</label>
						</div>
						<div class="feature-details" id="profile-picture-details" style="display: ${this.selectedOptionalFeatures.profilePicture.enabled ? 'block' : 'none'};">
							<div class="settings-grid">
								<div class="setting-group">
									<label>Image Path (within /public folder)</label>
									<input type="text" id="profile-image" value="${this.selectedOptionalFeatures.profilePicture.image}" placeholder="/profile.jpg">
								</div>
								<div class="setting-group">
									<label>Alt Text</label>
									<input type="text" id="profile-alt" value="${this.selectedOptionalFeatures.profilePicture.alt}" placeholder="Profile picture">
								</div>
								<div class="setting-group">
									<label>Size</label>
									<select id="profile-size">
										<option value="sm" ${this.selectedOptionalFeatures.profilePicture.size === 'sm' ? 'selected' : ''}>Small (32px)</option>
										<option value="md" ${this.selectedOptionalFeatures.profilePicture.size === 'md' ? 'selected' : ''}>Medium (48px)</option>
										<option value="lg" ${this.selectedOptionalFeatures.profilePicture.size === 'lg' ? 'selected' : ''}>Large (64px)</option>
									</select>
								</div>
								<div class="setting-group">
									<label>URL (optional)</label>
									<input type="text" id="profile-url" value="${this.selectedOptionalFeatures.profilePicture.url}" placeholder="/about">
								</div>
								<div class="setting-group">
									<label>Placement</label>
									<select id="profile-placement">
										<option value="footer" ${this.selectedOptionalFeatures.profilePicture.placement === 'footer' ? 'selected' : ''}>Footer</option>
										<option value="header" ${this.selectedOptionalFeatures.profilePicture.placement === 'header' ? 'selected' : ''}>Header</option>
									</select>
								</div>
								<div class="setting-group">
									<label>Style</label>
									<select id="profile-style">
										<option value="circle" ${this.selectedOptionalFeatures.profilePicture.style === 'circle' ? 'selected' : ''}>Circle</option>
										<option value="square" ${this.selectedOptionalFeatures.profilePicture.style === 'square' ? 'selected' : ''}>Square</option>
										<option value="none" ${this.selectedOptionalFeatures.profilePicture.style === 'none' ? 'selected' : ''}>None</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					
					<div class="feature-card">
						<div class="feature-header">
							<label class="feature-toggle">
								<input type="checkbox" ${this.selectedOptionalFeatures.comments.enabled ? 'checked' : ''} id="comments-enabled">
								<span class="toggle-slider"></span>
								<span class="feature-label">Comments (Giscus)</span>
							</label>
						</div>
						<div class="feature-details" id="comments-details" style="display: ${this.selectedOptionalFeatures.comments.enabled ? 'block' : 'none'};">
							<div class="feature-note">
								<p>Comments require GitHub repository setup. See the <a href="https://github.com/astro-modular/docs" target="_blank">documentation</a> for detailed setup instructions.</p>
							</div>
							<div style="height: 1rem;"></div>
						</div>
					</div>
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#profile-picture-enabled')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.enabled = (e.target as HTMLInputElement).checked;
			const details = container.querySelector('#profile-picture-details') as HTMLElement;
			details.style.display = this.selectedOptionalFeatures.profilePicture.enabled ? 'block' : 'none';
		});

		container.querySelector('#comments-enabled')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.comments.enabled = (e.target as HTMLInputElement).checked;
			const details = container.querySelector('#comments-details') as HTMLElement;
			details.style.display = this.selectedOptionalFeatures.comments.enabled ? 'block' : 'none';
		});

		// Profile picture settings
		container.querySelector('#profile-image')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.image = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#profile-alt')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.alt = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#profile-size')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.size = (e.target as HTMLSelectElement).value as 'sm' | 'md' | 'lg';
		});
		container.querySelector('#profile-url')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.url = (e.target as HTMLInputElement).value;
		});
		container.querySelector('#profile-placement')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.placement = (e.target as HTMLSelectElement).value as 'footer' | 'header';
		});
		container.querySelector('#profile-style')?.addEventListener('change', (e) => {
			this.selectedOptionalFeatures.profilePicture.style = (e.target as HTMLSelectElement).value as 'circle' | 'square' | 'none';
		});

		// Browse button for profile image
		// Browse button removed - no event handler needed
	}

	private renderDeploymentStep(container: HTMLElement) {
		container.innerHTML = `
			<div class="deployment-selection">
				<h2>Deployment platform</h2>
				<p>Choose your deployment platform for automatic configuration file generation.</p>
				<div class="deployment-options">
					<div class="deployment-option ${this.selectedDeployment === 'netlify' ? 'selected' : ''}" data-platform="netlify">
						<div class="deployment-header">
							<h3>Netlify</h3>
							<span class="default-badge">Default</span>
						</div>
						<p>Generates netlify.toml with redirects and build settings</p>
					</div>
					<div class="deployment-option ${this.selectedDeployment === 'vercel' ? 'selected' : ''}" data-platform="vercel">
						<div class="deployment-header">
							<h3>Vercel</h3>
						</div>
						<p>Generates vercel.json with redirects and cache headers</p>
					</div>
					<div class="deployment-option ${this.selectedDeployment === 'github-pages' ? 'selected' : ''}" data-platform="github-pages">
						<div class="deployment-header">
							<h3>GitHub Pages</h3>
						</div>
						<p>Generates public/redirects.txt for GitHub Pages redirects</p>
					</div>
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.deployment-option').forEach(option => {
			option.addEventListener('click', () => {
				const platform = option.getAttribute('data-platform');
				if (platform) {
					this.selectedDeployment = platform as 'netlify' | 'vercel' | 'github-pages';
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
							<div class="plugin-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									${plugin.installed ? '<path d="M20 6L9 17l-5-5"/>' : '<path d="M18 6L6 18M6 6l12 12"/>'}
								</svg>
							</div>
							<div class="plugin-info">
								<h3>${plugin.name}</h3>
								<p>${plugin.installed ? 'Ready to configure' : 'Not installed'}</p>
							</div>
						</div>
					`).join('')}
				</div>
				<div class="config-options">
					<button class="mod-button mod-cta" id="auto-configure">Configure automatically</button>
					<button class="mod-button" id="manual-configure">Show manual instructions</button>
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
						<strong>Preset:</strong> ${TEMPLATE_OPTIONS.find(t => t.id === this.selectedTemplate)?.name}
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
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#run-on-startup')?.addEventListener('change', (e) => {
			this.runWizardOnStartup = (e.target as HTMLInputElement).checked;
		});
	}

	private renderStepFooter(container: HTMLElement) {
		const buttonContainer = container.createDiv('wizard-buttons');

		// Previous button
		if (this.currentStep > 1) {
			const prevButton = buttonContainer.createEl('button', {
				text: 'Previous',
				cls: 'mod-button'
			});
			prevButton.addEventListener('click', () => {
				this.currentStep--;
				this.renderCurrentStep();
			});
		}

		// Next/Complete button
		const nextButton = buttonContainer.createEl('button', {
			text: this.currentStep === this.totalSteps ? 'Complete Setup' : 'Next',
			cls: 'mod-button mod-cta'
		});

		nextButton.addEventListener('click', () => {
			if (this.currentStep === this.totalSteps) {
				this.completeSetup();
			} else {
				this.currentStep++;
				this.renderCurrentStep();
			}
		});

		// Skip button (for most steps, but not the first step)
		if (this.currentStep < this.totalSteps && this.currentStep > 1) {
			const skipButton = buttonContainer.createEl('button', {
				text: 'Skip',
				cls: 'mod-button'
			});
			skipButton.style.opacity = '0.6';
			skipButton.addEventListener('click', () => {
				this.applyDefaultValues();
				this.currentStep++;
				this.renderCurrentStep();
			});
		}
	}

	private applyDefaultValues() {
		// Apply default values based on current step, using current settings as defaults
		switch (this.currentStep) {
			case 4: // Font step
				this.selectedTypography = this.settings.typography || {
					headingFont: 'Inter',
					proseFont: 'Inter',
					monoFont: 'JetBrains Mono',
					fontSource: 'local',
					customFonts: {
						heading: '',
						prose: '',
						mono: ''
					}
				};
				break;
			case 5: // Content organization step
				this.selectedContentOrg = this.settings.contentOrganization || 'file-based';
				break;
			case 6: // Optional features step
				this.selectedOptionalFeatures = this.settings.optionalFeatures || {
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
				};
				break;
			case 7: // Deployment step
				this.selectedDeployment = this.settings.deployment?.platform || 'netlify';
				break;
		}
	}

	private async configurePlugins(): Promise<boolean> {
		// Show loading state
		const button = document.querySelector('#auto-configure') as HTMLButtonElement;
		if (button) {
			button.textContent = 'Configuring...';
			button.disabled = true;
		}

		try {
			const config: any = {
				obsidianSettings: {
					attachmentLocation: this.selectedContentOrg === 'file-based' ? 'subfolder' : 'same-folder',
					subfolderName: 'attachments'
				},
				astroComposerSettings: {
					creationMode: this.selectedContentOrg === 'file-based' ? 'file' : 'folder',
					indexFileName: 'index'
				},
				imageInserterSettings: {
					valueFormat: this.selectedContentOrg === 'file-based' 
						? '[[attachments/{image-url}]]' 
						: '[[{image-url}]]',
					insertFormat: this.selectedContentOrg === 'file-based' 
						? '[[attachments/{image-url}]]' 
						: '[[{image-url}]]'
				}
			};

			console.log('🔧 Configuring plugins with settings:', config);
			const success = await this.pluginManager.configurePlugins(config);
			
			// Show result
			if (success) {
				new Notice('Plugins configured successfully!', 3000);
				if (button) {
					button.textContent = 'Configured';
					button.style.background = 'var(--color-green)';
				}
			} else {
				new Notice('Some plugins could not be configured. Check console for details.', 5000);
				if (button) {
					button.textContent = 'Partial Success';
					button.style.background = 'var(--color-orange)';
				}
			}
			
			return success;
		} catch (error) {
			console.error('Plugin configuration failed:', error);
			new Notice('Plugin configuration failed. Check console for details.', 5000);
			
			if (button) {
				button.textContent = 'Failed';
				button.style.background = 'var(--color-red)';
			}
			
			return false;
		}
	}

	private async showManualInstructions() {
		const config: any = {
			obsidianSettings: {
				attachmentLocation: this.selectedContentOrg === 'file-based' ? 'subfolder' : 'same-folder',
				subfolderName: 'attachments'
			},
			astroComposerSettings: {
				creationMode: this.selectedContentOrg === 'file-based' ? 'file' : 'folder',
				indexFileName: 'index'
			},
			imageInserterSettings: {
				valueFormat: this.selectedContentOrg === 'file-based' 
					? '[[attachments/{image-url}]]' 
					: '[[{image-url}]]',
				insertFormat: this.selectedContentOrg === 'file-based' 
					? '[[attachments/{image-url}]]' 
					: '[[{image-url}]]'
			}
		};

		const instructions = await this.pluginManager.getManualConfigurationInstructions(config);
		
		// Create a modal to show instructions
		const instructionModal = new Modal(this.app);
		// Don't set title to avoid duplicate heading
		
		// Format the instructions properly
		const formattedInstructions = instructions
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
			.replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
			.replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3 headings
			.replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2 headings
			.replace(/^# (.*$)/gim, '<h1>$1</h1>') // H1 headings
			.replace(/^\d+\. (.*$)/gim, '<li>$1</li>') // Numbered lists
			.replace(/^- (.*$)/gim, '<li>$1</li>') // Bullet lists
			.replace(/\n\n/g, '</p><p>') // Paragraph breaks
			.replace(/^(.*)$/gim, '<p>$1</p>') // Wrap lines in paragraphs
			.replace(/<p><\/p>/g, '') // Remove empty paragraphs
			.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1') // Remove p tags around headings
			.replace(/<p>(<li>.*<\/li>)<\/p>/g, '<ul>$1</ul>') // Wrap list items in ul
			.replace(/<\/ul><ul>/g, '') // Merge consecutive ul tags
			.replace(/<p>(<strong>.*<\/strong>)<\/p>/g, '$1') // Remove p tags around bold text
			.replace(/<p>(<em>.*<\/em>)<\/p>/g, '$1'); // Remove p tags around italic text
		
		instructionModal.contentEl.innerHTML = `
			<div style="padding: 15px; line-height: 1.5; max-height: 75vh; overflow-y: auto;">
				${formattedInstructions}
			</div>
		`;
		instructionModal.open();
	}

	private isObsidianDarkMode(): boolean {
		// Check if Obsidian is in dark mode by looking at the body class or CSS custom properties
		const body = document.body;
		const isDarkClass = body.classList.contains('theme-dark') || body.classList.contains('dark');
		
		// Also check CSS custom properties as a fallback
		const computedStyle = getComputedStyle(document.documentElement);
		const colorScheme = computedStyle.getPropertyValue('color-scheme').trim();
		const isDarkProperty = colorScheme === 'dark';
		
		// Check if the background is dark by looking at the primary background color
		const bgColor = computedStyle.getPropertyValue('--background-primary').trim();
		const isDarkBackground = Boolean(bgColor && (
			bgColor.includes('#') && parseInt(bgColor.slice(1, 3), 16) < 128 ||
			bgColor.includes('rgb') && bgColor.includes('0, 0, 0') ||
			bgColor.includes('hsl') && bgColor.includes('0, 0%, 0%')
		));
		
		return isDarkClass || isDarkProperty || isDarkBackground;
	}

	private async completeSetup() {
		console.log('🎯 SetupWizard: Starting completion process');
		console.log('📋 Selected template:', this.selectedTemplate);
		console.log('🎨 Selected theme:', this.selectedTheme);
		console.log('📁 Selected content org:', this.selectedContentOrg);
		
		// Update settings
		this.settings.currentTemplate = this.selectedTemplate;
		this.settings.currentTheme = this.selectedTheme;
		this.settings.contentOrganization = this.selectedContentOrg;
		this.settings.siteInfo = this.selectedSiteInfo;
		this.settings.navigation = this.selectedNavigation;
		this.settings.runWizardOnStartup = this.runWizardOnStartup;
		this.settings.typography = this.selectedTypography;
		this.settings.optionalFeatures = this.selectedOptionalFeatures;
		this.settings.deployment = { platform: this.selectedDeployment };

		console.log('💾 Settings updated, calling config manager...');

		// Apply configuration
		const configResult = await this.configManager.applyPreset({
			name: this.selectedTemplate,
			description: '',
			features: this.selectedFeatures,
			theme: this.selectedTheme,
			contentOrganization: this.selectedContentOrg,
			config: this.settings
		});

		console.log('🔧 Config manager result:', configResult);

		// Trigger rebuild
		await this.configManager.triggerRebuild();

		// Configure plugins
		const pluginSuccess = await this.configurePlugins();

		// Complete
		this.onComplete(this.settings);
		this.close();
		
		// Show comprehensive completion notice
		const message = pluginSuccess 
			? 'Astro Modular setup complete! Configuration saved and plugins configured successfully. Your site is ready to go!'
			: 'Astro Modular setup complete! Configuration saved. Some plugins may need manual configuration - check the documentation for details.';
		
		new Notice(message, 8000); // Show for 8 seconds instead of default 3
	}
}
