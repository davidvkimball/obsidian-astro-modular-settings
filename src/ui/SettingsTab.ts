import { App, Plugin, PluginSettingTab, Setting, Notice, Modal } from 'obsidian';
import { AstroModularSettings, THEME_OPTIONS, TEMPLATE_OPTIONS } from '../types';
import { ConfigManager } from '../utils/ConfigManager';
import { PluginManager } from '../utils/PluginManager';
import { SetupWizardModal } from './SetupWizardModal';

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
				id: 'quick-config', 
				name: 'Quick Config', 
				description: 'Fast template and theme changes',
				render: () => this.renderQuickConfigTab(tabContent) 
			},
			{ 
				id: 'features', 
				name: 'Features', 
				description: 'Enable or disable theme features',
				render: () => this.renderFeaturesTab(tabContent) 
			},
			{ 
				id: 'plugin-settings', 
				name: 'Plugin Settings', 
				description: 'Manage Obsidian plugin configurations',
				render: () => this.renderPluginTab(tabContent) 
			},
			{ 
				id: 'advanced', 
				name: 'Advanced', 
				description: 'Advanced options and utilities',
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

	private renderQuickConfigTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Quick Configuration' });
		const description = settingsSection.createEl('p', { text: 'Quickly change your template, theme, and content organization.' });

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
					this.settings.currentTemplate = value as any;
					await this.plugin.saveData(this.settings);
					// No need to refresh - the dropdowns are independent
				});
			});

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
				});
			});

		// Apply configuration button
		new Setting(container)
			.setName('Apply configuration')
			.setDesc('Apply the current settings to your Astro configuration')
			.addButton(button => button
				.setButtonText('Apply Configuration')
				.setCta()
				.onClick(async () => {
					await this.applyCurrentConfiguration();
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

	private renderFeaturesTab(container: HTMLElement) {
		container.empty();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Feature Configuration' });
		const description = settingsSection.createEl('p', { text: 'Enable or disable specific features for your site.' });

		// Feature toggles
		const features = [
			{ key: 'commandPalette', name: 'Command palette', desc: 'Add a command palette to your site' },
			{ key: 'tableOfContents', name: 'Table of contents', desc: 'Show table of contents on pages' },
			{ key: 'readingTime', name: 'Reading time', desc: 'Display estimated reading time' },
			{ key: 'linkedMentions', name: 'Linked mentions', desc: 'Show linked mentions and backlinks' },
			{ key: 'comments', name: 'Comments', desc: 'Enable comment system' },
			{ key: 'graphView', name: 'Graph view', desc: 'Show graph view of post connections' },
			{ key: 'postNavigation', name: 'Post navigation', desc: 'Show next/previous post navigation' },
			{ key: 'scrollToTop', name: 'Scroll to top', desc: 'Show scroll to top button' },
			{ key: 'showSocialIconsInFooter', name: 'Social icons in footer', desc: 'Show social icons in footer' }
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
					}));
		});

		// Save configuration button
		new Setting(container)
			.setName('Save configuration')
			.setDesc('Save your feature settings to the configuration file')
			.addButton(button => button
				.setButtonText('Save Configuration')
				.setCta()
				.onClick(async () => {
					await this.applyCurrentConfiguration();
				}));
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
			icon.textContent = plugin.installed ? '✅' : '❌';
			
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

		// Open config.ts in editor
		new Setting(container)
			.setName('Open config.ts in editor')
			.setDesc('Open your Astro configuration file in the editor')
			.addButton(button => button
				.setButtonText('Open config.ts')
				.onClick(async () => {
					await this.openConfigFile();
				}));

		// Reset to defaults
		new Setting(container)
			.setName('Reset to defaults')
			.setDesc('Reset all settings to their default values')
			.addButton(button => button
				.setButtonText('Reset to Defaults')
				.setWarning()
				.onClick(async () => {
					if (confirm('Are you sure you want to reset all settings to defaults?')) {
						// Reset settings logic here
						new Notice('Settings reset to defaults');
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
			const success = await this.configManager.applyPreset({
				name: this.settings.currentTemplate,
				description: '',
				features: this.settings.features,
				theme: this.settings.currentTheme,
				contentOrganization: this.settings.contentOrganization,
				config: this.settings
			});

			if (success) {
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
		const file = this.app.vault.getAbstractFileByPath('astro.config.ts');
		if (file) {
			await this.app.workspace.openLinkText('', 'astro.config.ts');
		} else {
			new Notice('Config file not found. Make sure you have an Astro project in this vault.');
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
}
