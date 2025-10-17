import { App, Plugin, PluginSettingTab, Setting, Notice, Modal } from 'obsidian';
import { AstroModularSettings, THEME_OPTIONS, TEMPLATE_OPTIONS, DEFAULT_SETTINGS, FONT_OPTIONS } from '../types';
import { ConfigManager } from '../utils/ConfigManager';
import { PluginManager } from '../utils/PluginManager';
import { SetupWizardModal } from './SetupWizardModal';
import { PresetWarningModal } from './PresetWarningModal';

export class AstroModularSettingsTab extends PluginSettingTab {
	plugin: Plugin;
	settings: AstroModularSettings;
	configManager: ConfigManager;
	pluginManager: PluginManager;

	constructor(app: App, plugin: Plugin, settings: AstroModularSettings) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
		this.configManager = new ConfigManager(app);
		this.pluginManager = new PluginManager(app);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass('astro-modular-settings');

		// Create enhanced tab navigation
		const tabContainer = containerEl.createDiv('tab-container');
		const tabNav = tabContainer.createDiv('tab-nav');
		const tabContent = tabContainer.createDiv('tab-content');

		// Tab definitions with descriptions
		const tabs = [
			{ 
				id: 'general', 
				name: 'General', 
				description: 'Basic settings and configuration overview',
				render: () => this.renderGeneralTab(tabContent) 
			},
			{ 
				id: 'site-info', 
				name: 'Site Info', 
				description: 'Site information and metadata',
				render: () => this.renderSiteInfoTab(tabContent) 
			},
			{ 
				id: 'navigation', 
				name: 'Navigation', 
				description: 'Navigation pages and social links',
				render: () => this.renderNavigationTab(tabContent) 
			},
			{ 
				id: 'config', 
				name: 'Config', 
				description: 'Template and content organization',
				render: () => this.renderConfigTab(tabContent) 
			},
			{ 
				id: 'style', 
				name: 'Style', 
				description: 'Theme and typography settings',
				render: () => this.renderStyleTab(tabContent) 
			},
			{ 
				id: 'features', 
				name: 'Features', 
				description: 'Enable or disable theme features',
				render: () => this.renderFeaturesTab(tabContent) 
			},
			{ 
				id: 'plugins', 
				name: 'Plugins', 
				description: 'Configure Obsidian plugins',
				render: () => this.renderPluginTab(tabContent) 
			},
			{ 
				id: 'advanced', 
				name: 'Advanced', 
				description: 'Advanced settings and utilities',
				render: () => this.renderAdvancedTab(tabContent) 
			}
		];

		// Create tab buttons with clean styling
		tabs.forEach((tab, index) => {
			const button = tabNav.createEl('button', {
				text: tab.name,
				cls: `tab-button ${index === 0 ? 'active' : ''}`
			});
			
			// Add tooltip
			button.title = tab.description;
			
			button.addEventListener('click', () => {
				// Remove active class from all buttons
				tabNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
				// Add active class to clicked button
				button.classList.add('active');
				// Render tab content with animation
				tabContent.style.opacity = '0';
				setTimeout(() => {
					tabContent.empty();
					tab.render();
					tabContent.style.opacity = '1';
				}, 150);
			});
		});

		// Render initial tab
		tabs[0].render();
	}

	private renderGeneralTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'General Settings' });
		const description = settingsSection.createEl('p', { text: 'Configure basic plugin behavior and view current status.' });

		// Run wizard on startup
		new Setting(container)
			.setName('Run wizard on startup')
			.setDesc('Show the setup wizard when Obsidian starts (if not disabled)')
			.addToggle(toggle => toggle
				.setValue(this.settings.runWizardOnStartup)
				.onChange(async (value) => {
					this.settings.runWizardOnStartup = value;
					await this.plugin.saveData(this.settings);
				}));

		// Current configuration display
		const configDisplay = container.createDiv('config-display');
		const configInfo = configDisplay.createDiv('config-info');
		const configTitle = configInfo.createEl('h3', { text: 'Current Configuration' });
		
		const templateItem = configInfo.createDiv('config-item');
		templateItem.createEl('strong', { text: 'Template: ' });
		templateItem.createSpan({ text: TEMPLATE_OPTIONS.find(t => t.id === this.settings.currentTemplate)?.name || 'Unknown' });
		
		const themeItem = configInfo.createDiv('config-item');
		themeItem.createEl('strong', { text: 'Theme: ' });
		themeItem.createSpan({ text: THEME_OPTIONS.find(t => t.id === this.settings.currentTheme)?.name || 'Unknown' });
		
		const orgItem = configInfo.createDiv('config-item');
		orgItem.createEl('strong', { text: 'Organization: ' });
		orgItem.createSpan({ text: this.settings.contentOrganization === 'file-based' ? 'File-based' : 'Folder-based' });

		// Run setup wizard button
		new Setting(container)
			.setName('Setup wizard')
			.setDesc('Run the setup wizard to reconfigure your theme')
				.addButton(button => button
					.setButtonText('Run Setup Wizard')
					.setCta()
					.onClick(() => {
						const wizard = new SetupWizardModal(this.app, this.settings, async (newSettings) => {
							this.settings = newSettings;
							await this.plugin.saveData(this.settings);
							// Don't refresh the settings tab - it will stay where it is
						});
						wizard.open();
					}));

	}

	private renderSiteInfoTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Site Information' });
		const description = settingsSection.createEl('p', { text: 'Configure your site metadata and basic information. Changes are applied to your config.ts file immediately.' });

		// Site URL
		new Setting(container)
			.setName('Site URL')
			.setDesc('Your site\'s base URL (e.g., https://yoursite.com)')
			.addText(text => text
				.setPlaceholder('https://astro-modular.netlify.app')
				.setValue(this.settings.siteInfo.site)
				.onChange(async (value) => {
					this.settings.siteInfo.site = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Site URL updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply site URL change: ${error.message}`);
					}
				}));

		// Site Title
		new Setting(container)
			.setName('Site Title')
			.setDesc('Your site\'s title')
			.addText(text => text
				.setPlaceholder('Astro Modular')
				.setValue(this.settings.siteInfo.title)
				.onChange(async (value) => {
					this.settings.siteInfo.title = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Site title updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply site title change: ${error.message}`);
					}
				}));

		// Site Description
		new Setting(container)
			.setName('Site Description')
			.setDesc('A brief description of your site')
			.addTextArea(text => {
				text.setPlaceholder('A flexible blog theme designed for Obsidian users.')
					.setValue(this.settings.siteInfo.description);
				// Set rows using the input element directly
				(text as any).inputEl.rows = 4;
				text.onChange(async (value: string) => {
					this.settings.siteInfo.description = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Site description updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply site description change: ${error.message}`);
					}
				});
			});

		// Author Name
		new Setting(container)
			.setName('Author Name')
			.setDesc('Your name or the site author\'s name')
			.addText(text => text
				.setPlaceholder('David V. Kimball')
				.setValue(this.settings.siteInfo.author)
				.onChange(async (value) => {
					this.settings.siteInfo.author = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Author name updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply author name change: ${error.message}`);
					}
				}));

		// Language
		new Setting(container)
			.setName('Language')
			.setDesc('Your site\'s primary language (ISO 639-1 code)')
			.addText(text => text
				.setPlaceholder('en')
				.setValue(this.settings.siteInfo.language)
				.onChange(async (value) => {
					this.settings.siteInfo.language = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Language updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply language change: ${error.message}`);
					}
				}));
	}

	private renderNavigationTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Navigation' });
		const description = settingsSection.createEl('p', { text: 'Configure your site navigation pages and social links. Changes are applied to your config.ts file immediately.' });

		// Navigation pages section
		const pagesSection = container.createDiv('settings-section');
		pagesSection.createEl('h3', { text: 'Navigation Pages' });
		pagesSection.createEl('p', { text: 'Add or remove pages from your main navigation menu.' });

		// Display existing pages
		const pagesList = pagesSection.createDiv('nav-items');
		this.settings.navigation.pages.forEach((page: any, index: number) => {
			const pageItem = pagesList.createDiv('nav-item');
			pageItem.setAttribute('data-index', index.toString());
			
			const pageContent = pageItem.createDiv('nav-item-content');
			const pageFields = pageContent.createDiv('nav-item-fields');
			
			// Title input
			const titleInput = pageFields.createEl('input', {
				type: 'text',
				cls: 'nav-title',
				placeholder: 'Page Title'
			});
			titleInput.value = page.title;
			titleInput.addEventListener('input', async (e) => {
				this.settings.navigation.pages[index].title = (e.target as HTMLInputElement).value;
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
			});
			
			// URL input
			const urlInput = pageFields.createEl('input', {
				type: 'text',
				cls: 'nav-url',
				placeholder: '/page-url'
			});
			urlInput.value = page.url;
			urlInput.addEventListener('input', async (e) => {
				this.settings.navigation.pages[index].url = (e.target as HTMLInputElement).value;
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
			});
			
			// Remove button
			const removeBtn = pageContent.createEl('button', {
				text: 'Remove',
				cls: 'nav-remove mod-warning'
			});
			removeBtn.addEventListener('click', async () => {
				this.settings.navigation.pages.splice(index, 1);
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
				this.renderNavigationTab(container); // Re-render
			});
		});

		// Add page button
		new Setting(pagesSection)
			.setName('Add Page')
			.setDesc('Add a new page to your navigation')
			.addButton(button => button
				.setButtonText('+ Add Page')
				.setCta()
				.onClick(async () => {
					this.settings.navigation.pages.push({ title: 'New Page', url: '/new-page' });
					await this.plugin.saveData(this.settings);
					await this.applyCurrentConfiguration();
					this.renderNavigationTab(container); // Re-render
				}));

		// Social links section
		const socialSection = container.createDiv('settings-section');
		socialSection.createEl('h3', { text: 'Social Links' });
		socialSection.createEl('p', { text: 'Configure your social media links in the footer.' });

		// Display existing social links
		const socialList = socialSection.createDiv('nav-items');
		this.settings.navigation.social.forEach((social: any, index: number) => {
			const socialItem = socialList.createDiv('nav-item');
			socialItem.setAttribute('data-index', index.toString());
			
			const socialContent = socialItem.createDiv('nav-item-content');
			const socialFields = socialContent.createDiv('nav-item-fields');
			
			// Title input
			const titleInput = socialFields.createEl('input', {
				type: 'text',
				cls: 'nav-title',
				placeholder: 'Social Title'
			});
			titleInput.value = social.title;
			titleInput.addEventListener('input', async (e) => {
				this.settings.navigation.social[index].title = (e.target as HTMLInputElement).value;
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
			});
			
			// URL input
			const urlInput = socialFields.createEl('input', {
				type: 'text',
				cls: 'nav-url',
				placeholder: 'https://example.com'
			});
			urlInput.value = social.url;
			urlInput.addEventListener('input', async (e) => {
				this.settings.navigation.social[index].url = (e.target as HTMLInputElement).value;
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
			});
			
			// Icon input
			const iconRow = socialItem.createDiv('nav-icon-row');
			const iconInput = iconRow.createEl('input', {
				type: 'text',
				cls: 'nav-icon',
				placeholder: 'icon-name'
			});
			iconInput.value = social.icon || '';
			iconInput.addEventListener('input', async (e) => {
				this.settings.navigation.social[index].icon = (e.target as HTMLInputElement).value;
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
			});
			
			// Icon help text
			const iconHelp = iconRow.createDiv('nav-icon-help');
			iconHelp.createEl('small', { text: 'Icon names from FontAwesome Brands' });
			
			// Remove button
			const removeBtn = socialContent.createEl('button', {
				text: 'Remove',
				cls: 'nav-remove mod-warning'
			});
			removeBtn.addEventListener('click', async () => {
				this.settings.navigation.social.splice(index, 1);
				await this.plugin.saveData(this.settings);
				await this.applyCurrentConfiguration();
				this.renderNavigationTab(container); // Re-render
			});
		});

		// Add social link button
		new Setting(socialSection)
			.setName('Add Social Link')
			.setDesc('Add a new social media link')
			.addButton(button => button
				.setButtonText('+ Add Social Link')
				.setCta()
				.onClick(async () => {
					this.settings.navigation.social.push({ title: 'New Social', url: 'https://example.com', icon: '' });
					await this.plugin.saveData(this.settings);
					await this.applyCurrentConfiguration();
					this.renderNavigationTab(container); // Re-render
				}));
	}

	private renderConfigTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Configuration' });
		const description = settingsSection.createEl('p', { text: 'Configure your template and content organization. Changes are applied to your config.ts file immediately.' });

		// Template selector
		new Setting(container)
			.setName('Template')
			.setDesc('Choose your content template')
			.addDropdown(dropdown => {
				TEMPLATE_OPTIONS.forEach(template => {
					dropdown.addOption(template.id, template.name);
				});
				dropdown.setValue(this.settings.currentTemplate);
				dropdown.onChange(async (value) => {
					// Show warning modal for template changes
					const changes = this.getTemplateChanges(value as any);
					if (changes.length > 0) {
						const modal = new PresetWarningModal(
							this.app,
							changes,
							async () => {
								// User confirmed - apply the template
					this.settings.currentTemplate = value as any;
					await this.plugin.saveData(this.settings);
								
								try {
									await this.applyCurrentConfiguration();
									new Notice(`Template changed to ${value} and applied to config.ts`);
								} catch (error) {
									new Notice(`Failed to apply template change: ${error.message}`);
								}
							},
							() => {
								// User cancelled - reset dropdown to current value
								dropdown.setValue(this.settings.currentTemplate);
							}
						);
						modal.open();
					} else {
						// No changes needed - apply directly
						this.settings.currentTemplate = value as any;
					await this.plugin.saveData(this.settings);
						
						try {
							await this.applyCurrentConfiguration();
							new Notice(`Template changed to ${value} and applied to config.ts`);
						} catch (error) {
							new Notice(`Failed to apply template change: ${error.message}`);
						}
					}
				});
			});


		// Content organization
		new Setting(container)
			.setName('Content organization')
			.setDesc('Choose how to organize your content and assets')
			.addDropdown(dropdown => {
				dropdown.addOption('file-based', 'File-based');
				dropdown.addOption('folder-based', 'Folder-based');
				dropdown.setValue(this.settings.contentOrganization);
				dropdown.onChange(async (value) => {
					this.settings.contentOrganization = value as any;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Content organization changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply content organization change: ${error.message}`);
					}
				});
			});

		// Deployment platform
		new Setting(container)
			.setName('Deployment')
			.setDesc('Choose your deployment platform')
			.addDropdown(dropdown => {
				dropdown.addOption('netlify', 'Netlify');
				dropdown.addOption('vercel', 'Vercel');
				dropdown.addOption('github-pages', 'GitHub Pages');
				dropdown.setValue(this.settings.deployment.platform);
				dropdown.onChange(async (value) => {
					this.settings.deployment.platform = value as any;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
					await this.applyCurrentConfiguration();
						new Notice(`Deployment platform changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply deployment platform change: ${error.message}`);
					}
				});
			});

		// Reset to Template button
		new Setting(container)
			.setName('Reset to Template')
			.setDesc(`Reset all settings to the current template (${TEMPLATE_OPTIONS.find(t => t.id === this.settings.currentTemplate)?.name})`)
			.addButton(button => button
				.setButtonText('Reset to Template')
				.setWarning()
				.onClick(async () => {
					const changes = this.getTemplateChanges(this.settings.currentTemplate);
					if (changes.length > 0) {
						const modal = new PresetWarningModal(
							this.app,
							changes,
							async () => {
								// User confirmed - reset to template
								try {
					await this.applyCurrentConfiguration();
									new Notice(`Reset to ${this.settings.currentTemplate} template and applied to config.ts`);
								} catch (error) {
									new Notice(`Failed to reset to template: ${error.message}`);
								}
							},
							() => {
								// User cancelled - do nothing
							}
						);
						modal.open();
					} else {
						new Notice('Settings are already at template defaults');
					}
				}));

		// Edit config.ts directly button
		new Setting(container)
			.setName('Edit config.ts directly')
			.setDesc('Open your Astro configuration file in the editor')
			.addButton(button => button
				.setButtonText('Open config.ts')
				.onClick(async () => {
					await this.openConfigFile();
				}));
	}

	private renderStyleTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Style' });
		const description = settingsSection.createEl('p', { text: 'Configure your theme and typography settings. Changes are applied to your config.ts file immediately.' });

		// Theme selector
		new Setting(container)
			.setName('Theme')
			.setDesc('Choose your color theme')
			.addDropdown(dropdown => {
				THEME_OPTIONS.forEach(theme => {
					dropdown.addOption(theme.id, theme.name);
				});
				dropdown.setValue(this.settings.currentTheme);
				dropdown.onChange(async (value) => {
					this.settings.currentTheme = value as any;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Theme changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply theme change: ${error.message}`);
					}
				});
			});

		// Typography section
		const typographySection = container.createDiv('settings-section');
		typographySection.createEl('h3', { text: 'Typography' });
		typographySection.createEl('p', { text: 'Configure your font settings.' });

		// Heading font dropdown
		new Setting(typographySection)
			.setName('Heading Font')
			.setDesc('Font for headings and titles')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(this.settings.typography.headingFont);
				dropdown.onChange(async (value) => {
					this.settings.typography.headingFont = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Heading font updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply heading font change: ${error.message}`);
					}
				});
			});

		// Prose font dropdown
		new Setting(typographySection)
			.setName('Prose Font')
			.setDesc('Font for body text and content')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(this.settings.typography.proseFont);
				dropdown.onChange(async (value) => {
					this.settings.typography.proseFont = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Prose font updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply prose font change: ${error.message}`);
					}
				});
			});

		// Mono font dropdown
		new Setting(typographySection)
			.setName('Monospace Font')
			.setDesc('Font for code blocks and technical content')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(this.settings.typography.monoFont);
				dropdown.onChange(async (value) => {
					this.settings.typography.monoFont = value;
					await this.plugin.saveData(this.settings);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice('Monospace font updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply monospace font change: ${error.message}`);
					}
				});
			});

		// Font source dropdown
		new Setting(typographySection)
			.setName('Font Source')
			.setDesc('How fonts are loaded')
			.addDropdown(dropdown => {
				dropdown.addOption('local', 'Local (Google Fonts)');
				dropdown.addOption('cdn', 'CDN (Custom)');
				dropdown.setValue(this.settings.typography.fontSource);
				dropdown.onChange(async (value) => {
					this.settings.typography.fontSource = value as any;
					await this.plugin.saveData(this.settings);
					
					// Re-render to show/hide custom inputs
					this.renderStyleTab(container);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Font source changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply font source change: ${error.message}`);
					}
				});
			});

		// Custom font inputs (only show when CDN is selected)
		if (this.settings.typography.fontSource === 'cdn') {
			// Custom font URLs
			new Setting(typographySection)
				.setName('Custom Font URLs')
				.setDesc('Comma-separated font URLs')
				.addTextArea(text => {
					text.setPlaceholder('https://fonts.googleapis.com/css2?family=Custom+Font:wght@400;600&display=swap')
						.setValue(this.settings.typography.customFonts?.heading || '');
					text.onChange(async (value: string) => {
						if (!this.settings.typography.customFonts) {
							this.settings.typography.customFonts = { heading: '', prose: '', mono: '' };
						}
						this.settings.typography.customFonts.heading = value;
						await this.plugin.saveData(this.settings);
						await this.applyCurrentConfiguration();
					});
				});

			// Custom heading font name
			new Setting(typographySection)
				.setName('Custom Heading Font Name')
				.setDesc('Name of the custom heading font')
				.addText(text => text
					.setPlaceholder('Custom Heading Font')
					.setValue(this.settings.typography.customFonts?.heading || '')
					.onChange(async (value) => {
						if (!this.settings.typography.customFonts) {
							this.settings.typography.customFonts = { heading: '', prose: '', mono: '' };
						}
						this.settings.typography.customFonts.heading = value;
						await this.plugin.saveData(this.settings);
						await this.applyCurrentConfiguration();
					}));

			// Custom prose font name
			new Setting(typographySection)
				.setName('Custom Prose Font Name')
				.setDesc('Name of the custom prose font')
				.addText(text => text
					.setPlaceholder('Custom Prose Font')
					.setValue(this.settings.typography.customFonts?.prose || '')
					.onChange(async (value) => {
						if (!this.settings.typography.customFonts) {
							this.settings.typography.customFonts = { heading: '', prose: '', mono: '' };
						}
						this.settings.typography.customFonts.prose = value;
						await this.plugin.saveData(this.settings);
						await this.applyCurrentConfiguration();
					}));

			// Custom mono font name
			new Setting(typographySection)
				.setName('Custom Monospace Font Name')
				.setDesc('Name of the custom monospace font')
				.addText(text => text
					.setPlaceholder('Custom Monospace Font')
					.setValue(this.settings.typography.customFonts?.mono || '')
					.onChange(async (value) => {
						if (!this.settings.typography.customFonts) {
							this.settings.typography.customFonts = { heading: '', prose: '', mono: '' };
						}
						this.settings.typography.customFonts.mono = value;
						await this.plugin.saveData(this.settings);
						await this.applyCurrentConfiguration();
					}));
		}
	}

	private renderFeaturesTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Feature Configuration' });
		const description = settingsSection.createEl('p', { text: 'Enable or disable specific features for your site. Changes are applied to your config.ts file immediately when you toggle them.' });

		// Feature toggles
		const features = [
			{ key: 'commandPalette', name: 'Command palette', desc: 'Add a command palette to your site' },
			{ key: 'tableOfContents', name: 'Table of contents', desc: 'Show table of contents on pages' },
			{ key: 'readingTime', name: 'Reading time', desc: 'Display estimated reading time' },
			{ key: 'linkedMentions', name: 'Linked mentions', desc: 'Show linked mentions and backlinks' },
			{ key: 'graphView', name: 'Graph view', desc: 'Show graph view of post connections' },
			{ key: 'postNavigation', name: 'Post navigation', desc: 'Show next/previous post navigation' },
			{ key: 'scrollToTop', name: 'Scroll to top', desc: 'Show scroll to top button' },
			{ key: 'showSocialIconsInFooter', name: 'Social icons in footer', desc: 'Show social icons in footer' },
			{ key: 'profilePicture', name: 'Profile picture', desc: 'Show profile picture in header' },
			{ key: 'comments', name: 'Comments', desc: 'Enable comment system' }
		];

		features.forEach(feature => {
			const featureKey = feature.key as keyof typeof this.settings.features;
			const currentValue = this.settings.features[featureKey];
			const boolValue = typeof currentValue === 'boolean' ? currentValue : false;
			
			new Setting(container)
				.setName(feature.name)
				.setDesc(feature.desc)
				.addToggle(toggle => toggle
					.setValue(boolValue)
					.onChange(async (value) => {
						(this.settings.features as any)[featureKey] = value;
						await this.plugin.saveData(this.settings);
						
						// Apply changes immediately to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice(`${feature.name} ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
						} catch (error) {
							new Notice(`Failed to apply ${feature.name} to config.ts: ${error.message}`);
						}
					}));
		});

		// Note about immediate application
		const noteSection = container.createDiv('settings-section');
		noteSection.createEl('p', { 
			text: 'All changes are applied to your config.ts file immediately when you toggle features.',
			cls: 'setting-item-description'
		});
	}

	private async renderPluginTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Plugin Configuration' });
		const description = settingsSection.createEl('p', { text: 'Manage your Obsidian plugins and their settings.' });

		// Get plugin status
		const pluginStatus = await this.pluginManager.getPluginStatus();

		// Display plugin status
		const statusContainer = container.createDiv('plugin-status-container');
		const pluginStatusDiv = statusContainer.createDiv('plugin-status');
		
		for (const plugin of pluginStatus) {
			const pluginItem = pluginStatusDiv.createDiv(`plugin-item ${plugin.installed ? 'installed' : 'missing'}`);
			const icon = pluginItem.createDiv('plugin-icon');
			icon.innerHTML = plugin.installed 
				? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
				: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
			
			const info = pluginItem.createDiv('plugin-info');
			info.createEl('h3', { text: plugin.name });
			const statusText = plugin.installed ? (plugin.enabled ? 'Enabled' : 'Disabled') : 'Not installed';
			info.createEl('p', { text: statusText });
		}

		// Configure automatically button
		new Setting(container)
			.setName('Configure automatically')
			.setDesc('Automatically configure all installed plugins')
			.addButton(button => button
				.setButtonText('Configure Automatically')
				.setCta()
				.onClick(async () => {
					const success = await this.pluginManager.configurePlugins(this.settings.pluginConfig);
					if (success) {
						new Notice('Plugins configured successfully!');
					} else {
						new Notice('Some plugins could not be configured automatically.');
					}
				}));

		// Show manual instructions button
		new Setting(container)
			.setName('Show manual instructions')
			.setDesc('Get step-by-step instructions for manual configuration')
			.addButton(button => button
				.setButtonText('Show Manual Instructions')
				.onClick(async () => {
					const instructions = await this.pluginManager.getManualConfigurationInstructions(this.settings.pluginConfig);
					
					// Create a modal to show instructions
					const instructionModal = new Modal(this.app);
					instructionModal.titleEl.setText('Manual Configuration Instructions');
					const pre = instructionModal.contentEl.createEl('pre');
					pre.textContent = instructions;
					instructionModal.open();
				}));
	}

	private renderAdvancedTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Advanced Settings' });
		const description = settingsSection.createEl('p', { text: 'Advanced configuration options and utilities.' });

		// Reset to defaults
		new Setting(container)
			.setName('Reset to defaults')
			.setDesc('Reset all settings to their default values')
			.addButton(button => button
				.setButtonText('Reset to Defaults')
				.setWarning()
				.onClick(async () => {
					if (confirm('Are you sure you want to reset all configuration settings to defaults? This will preserve your site info and navigation settings.')) {
						// Reset only configuration settings, preserve site info and navigation
						const preservedSiteInfo = this.settings.siteInfo;
						const preservedNavigation = this.settings.navigation;
						
						// Reset to defaults
						this.settings = { ...DEFAULT_SETTINGS };
						
						// Restore preserved settings
						this.settings.siteInfo = preservedSiteInfo;
						this.settings.navigation = preservedNavigation;
						
						await this.plugin.saveData(this.settings);
						
						// Apply the reset configuration to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice('Configuration reset to defaults and applied to config.ts (site info and navigation preserved)');
						} catch (error) {
							new Notice(`Configuration reset but failed to apply to config.ts: ${error.message}`);
						}
						
						// Refresh the UI to show the reset values
						this.display();
					}
				}));

		// Export configuration
		new Setting(container)
			.setName('Export configuration')
			.setDesc('Export your current configuration as JSON')
			.addButton(button => button
				.setButtonText('Export JSON')
				.onClick(() => {
					this.exportConfiguration();
				}));

		// Import configuration
		new Setting(container)
			.setName('Import configuration')
			.setDesc('Import configuration from JSON file')
			.addButton(button => button
				.setButtonText('Import JSON')
				.onClick(() => {
					this.importConfiguration();
				}));
	}

	private async applyCurrentConfiguration() {
		try {
			// Apply the current settings to the config file
			const presetSuccess = await this.configManager.applyPreset({
				name: this.settings.currentTemplate,
				description: '',
				features: this.settings.features,
				theme: this.settings.currentTheme,
				contentOrganization: this.settings.contentOrganization,
				config: this.settings
			});

			// Also apply individual feature toggles
			const featuresSuccess = await this.configManager.updateIndividualFeatures(this.settings);

			if (presetSuccess && featuresSuccess) {
				new Notice('Configuration applied successfully!');
				await this.configManager.triggerRebuild();
			} else {
				new Notice('Failed to apply configuration. Check the console for errors.');
			}
		} catch (error) {
			new Notice(`Error applying configuration: ${error.message}`);
		}
	}

	private async openConfigFile() {
		try {
			const fs = require('fs');
			const path = require('path');
			const { shell } = require('electron');
			
			// Get the actual vault path string from the adapter
			const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			console.log('🔍 SettingsTab: Trying to open config at:', configPath);
			console.log('🔍 SettingsTab: Config exists:', fs.existsSync(configPath));
			
			if (fs.existsSync(configPath)) {
				// Use Electron's shell to open the file with the default editor
				console.log('✅ SettingsTab: Opening config file with default editor');
				shell.openPath(configPath);
		} else {
				console.log('❌ SettingsTab: Config file not found');
				new Notice(`Config file not found at: ${configPath}`);
			}
		} catch (error) {
			console.log('❌ SettingsTab: Error opening config file:', error);
			new Notice(`Error opening config file: ${error.message}`);
		}
	}

	private exportConfiguration() {
		const configJson = JSON.stringify(this.settings, null, 2);
		const blob = new Blob([configJson], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = 'astro-modular-config.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		
		new Notice('Configuration exported successfully!');
	}

	private importConfiguration() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				try {
					const text = await file.text();
					const importedSettings = JSON.parse(text);
					
					// Merge with current settings
					this.settings = { ...this.settings, ...importedSettings };
					await this.plugin.saveData(this.settings);
					
					// Refresh the settings tab to show imported settings
					this.display();
					new Notice('Configuration imported successfully!');
				} catch (error) {
					new Notice('Failed to import configuration. Please check the file format.');
				}
			}
		};
		input.click();
	}

	private getTemplateChanges(templateId: string): string[] {
		const changes: string[] = [];
		
		// Get the template preset
		const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
		if (!template) return changes;

		// This is a simplified version - in reality, you'd need to compare
		// the current settings with what the template would set
		// For now, we'll show a generic message for template changes
		changes.push('Theme and color scheme');
		changes.push('Feature toggles and settings');
		changes.push('Typography and font settings');
		changes.push('Content organization settings');
		
		return changes;
	}
}
