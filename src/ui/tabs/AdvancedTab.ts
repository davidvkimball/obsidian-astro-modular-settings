import { Setting, Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { DEFAULT_SETTINGS, TEMPLATE_OPTIONS } from '../../types';

export class AdvancedTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Edit config.ts directly button
		new Setting(container)
			.setName('Edit config.ts directly')
			.setDesc('Open your Astro configuration file in the editor')
			.addButton(button => button
				.setButtonText('Open config.ts')
				.onClick(async () => {
					await this.openConfigFile();
				}));

		// Sync from config.ts button
		new Setting(container)
			.setName('Sync from config.ts')
			.setDesc('Read current config.ts file and update plugin settings to match')
			.addButton(button => button
				.setButtonText('Sync from config.ts')
				.setCta()
				.onClick(async () => {
					try {
						// Read the current config.ts file
						const configContent = await (this.plugin as any).configManager.fileManager.readConfig();
						
						if (!configContent) {
							new Notice('Could not read config.ts file');
							return;
						}
						
						// Parse the config.ts file to extract current settings
						const currentConfig = await (this.plugin as any).configManager.fileManager.parseConfigFile(configContent);
						
						if (!currentConfig) {
							new Notice('Could not parse config.ts file');
							return;
						}
						
						
						
						// Update plugin settings to match config.ts
						const settings = this.getSettings();
						
						// Update site information
						if (currentConfig.siteInfo) {
							settings.siteInfo.site = currentConfig.siteInfo.site ?? settings.siteInfo.site;
							settings.siteInfo.title = currentConfig.siteInfo.title ?? settings.siteInfo.title;
							settings.siteInfo.description = currentConfig.siteInfo.description ?? settings.siteInfo.description;
							settings.siteInfo.author = currentConfig.siteInfo.author ?? settings.siteInfo.author;
							settings.siteInfo.language = currentConfig.siteInfo.language ?? settings.siteInfo.language;
						}
						
						// Update favicon and OG image settings from top-level config (they're at the top level in config.ts)
						if (currentConfig.faviconThemeAdaptive !== undefined) {
							settings.siteInfo.faviconThemeAdaptive = currentConfig.faviconThemeAdaptive;
						}
						if (currentConfig.defaultOgImageAlt) {
							settings.siteInfo.defaultOgImageAlt = currentConfig.defaultOgImageAlt;
							// Also update seo for backwards compatibility
							if (!settings.seo) {
								settings.seo = { defaultOgImageAlt: '' };
							}
							settings.seo.defaultOgImageAlt = currentConfig.defaultOgImageAlt;
						}
						
						// Update navigation settings
						if (currentConfig.navigation) {
							if (currentConfig.navigation.pages) {
								settings.navigation.pages = currentConfig.navigation.pages;
							}
							if (currentConfig.navigation.social) {
								settings.navigation.social = currentConfig.navigation.social;
							}
						}
						
						// Update theme
						if (currentConfig.currentTheme) {
							settings.currentTheme = currentConfig.currentTheme;
						}
						
						// Update typography settings
						if (currentConfig.typography) {
							settings.typography.fontSource = currentConfig.typography.fontSource ?? settings.typography.fontSource;
							settings.typography.proseFont = currentConfig.typography.proseFont ?? settings.typography.proseFont;
							settings.typography.headingFont = currentConfig.typography.headingFont ?? settings.typography.headingFont;
							settings.typography.monoFont = currentConfig.typography.monoFont ?? settings.typography.monoFont;
						}
						
						// Update table of contents settings
						if (currentConfig.tableOfContents) {
							if (!settings.tableOfContents) {
								settings.tableOfContents = { enabled: true, depth: 4 };
							}
							settings.tableOfContents.enabled = currentConfig.tableOfContents.enabled ?? settings.tableOfContents.enabled;
							settings.tableOfContents.depth = currentConfig.tableOfContents.depth ?? settings.tableOfContents.depth;
						}
						
						// Update features based on config.ts
						if (currentConfig.postOptions) {
							settings.features.readingTime = currentConfig.postOptions.readingTime ?? settings.features.readingTime;
							settings.features.linkedMentions = currentConfig.postOptions.linkedMentions?.enabled ?? settings.features.linkedMentions;
							settings.features.linkedMentionsCompact = currentConfig.postOptions.linkedMentions?.linkedMentionsCompact ?? settings.features.linkedMentionsCompact;
							settings.features.graphView = currentConfig.postOptions.graphView?.enabled ?? settings.features.graphView;
							settings.features.postNavigation = currentConfig.postOptions.postNavigation ?? settings.features.postNavigation;
							settings.features.comments = currentConfig.postOptions.comments?.enabled ?? settings.features.comments;
						}
						
						// Update optional content types
						if (currentConfig.optionalContentTypes) {
							settings.optionalContentTypes.projects = currentConfig.optionalContentTypes.projects ?? settings.optionalContentTypes.projects;
							settings.optionalContentTypes.docs = currentConfig.optionalContentTypes.docs ?? settings.optionalContentTypes.docs;
						}
						
						// Update footer settings
						if (currentConfig.footer) {
							settings.features.showSocialIconsInFooter = currentConfig.footer.showSocialIconsInFooter ?? false;
						}
						
						// Update command palette - comprehensive sync
						if (currentConfig.commandPalette) {
							settings.features.commandPalette = currentConfig.commandPalette.enabled ?? false;
							
							// Sync all command palette settings
							if (!settings.commandPalette) {
								settings.commandPalette = {
									enabled: true,
									shortcut: 'ctrl+K',
									placeholder: 'Search posts',
									search: { posts: true, pages: false, projects: false, docs: false },
									sections: { quickActions: true, pages: true, social: true },
									quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true }
								};
							}
							
							settings.commandPalette.enabled = currentConfig.commandPalette.enabled ?? settings.commandPalette.enabled;
							settings.commandPalette.placeholder = currentConfig.commandPalette.placeholder ?? settings.commandPalette.placeholder;
							settings.commandPalette.shortcut = currentConfig.commandPalette.shortcut ?? settings.commandPalette.shortcut;
							
							if (currentConfig.commandPalette.search) {
								settings.commandPalette.search = {
									...settings.commandPalette.search,
									...currentConfig.commandPalette.search
								};
							}
							
							if (currentConfig.commandPalette.sections) {
								settings.commandPalette.sections = {
									...settings.commandPalette.sections,
									...currentConfig.commandPalette.sections
								};
							}
							
							if (currentConfig.commandPalette.quickActions) {
								settings.commandPalette.quickActions = {
									...settings.commandPalette.quickActions,
									...currentConfig.commandPalette.quickActions
								};
								// Sync to features.quickActions for consistency
								settings.features.quickActions = {
									...settings.features.quickActions,
									...currentConfig.commandPalette.quickActions
								};
							}
						}
						
						// Update theme
						if (currentConfig.theme) {
							settings.currentTheme = currentConfig.theme as any;
						}
						
						// Update site information
						if (currentConfig.site) {
							settings.siteInfo.site = currentConfig.site;
						}
						if (currentConfig.title) {
							settings.siteInfo.title = currentConfig.title;
						}
						if (currentConfig.description) {
							settings.siteInfo.description = currentConfig.description;
						}
						if (currentConfig.author) {
							settings.siteInfo.author = currentConfig.author;
						}
						if (currentConfig.language) {
							settings.siteInfo.language = currentConfig.language;
						}
						
						// Update template based on current settings
						// This is a bit tricky since we need to determine which template best matches
						// For now, we'll set it to 'standard' since it's been manually modified
						settings.currentTemplate = 'standard';
						
						// Save the updated settings
						await this.plugin.saveData(settings);
						
						// Refresh the settings tab to show the synced values
						await (this.plugin as any).triggerSettingsRefresh();
						
						new Notice('Settings synced from config.ts successfully');
					} catch (error) {
						new Notice(`Failed to sync from config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Reset to Template button
		new Setting(container)
			.setName('Reset to Template')
			.setDesc(`Reset all settings to the current template (${TEMPLATE_OPTIONS.find(t => t.id === settings.currentTemplate)?.name})`)
			.addButton(button => button
				.setButtonText('Reset to Template')
				.setWarning()
				.onClick(async () => {
					// Reset settings to template defaults
					try {
						// Load the template preset
						const templatePreset = (this.plugin as any).configManager.getTemplatePreset(settings.currentTemplate);
						if (templatePreset && templatePreset.config) {
							// Preserve user-specific settings that shouldn't be reset
							const preservedSiteInfo = settings.siteInfo;
							const preservedNavigation = settings.navigation;
							const preservedTheme = settings.currentTheme;
							const preservedContentOrg = settings.contentOrganization;
							const preservedTypography = settings.typography;
							const preservedOptionalFeatures = settings.optionalFeatures;
							const preservedRunWizardOnStartup = settings.runWizardOnStartup;
							
							// Apply template features and table of contents from preset
							if (templatePreset.config.features) {
								settings.features = { ...settings.features, ...templatePreset.config.features };
								
								// CRITICAL: Sync postOptions with features to maintain data integrity
								// postOptions.graphView.enabled is the source of truth
								if (settings.postOptions?.graphView) {
									settings.postOptions.graphView.enabled = templatePreset.config.features.graphView ?? false;
									settings.features.graphView = settings.postOptions.graphView.enabled;
								}
								
								// Sync linked mentions
								if (settings.postOptions?.linkedMentions) {
									settings.postOptions.linkedMentions.enabled = templatePreset.config.features.linkedMentions ?? false;
									settings.postOptions.linkedMentions.linkedMentionsCompact = templatePreset.config.features.linkedMentionsCompact ?? false;
								}
								
								// Sync command palette quick actions
								if (settings.commandPalette?.quickActions && templatePreset.config.features.quickActions) {
									settings.commandPalette.quickActions = { ...settings.commandPalette.quickActions, ...templatePreset.config.features.quickActions };
								}
							}
							
							if (templatePreset.config.tableOfContents) {
								settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
							}
							
							// Set template name
							settings.currentTemplate = templatePreset.config.currentTemplate || settings.currentTemplate;
							
							// Restore preserved settings
							settings.siteInfo = preservedSiteInfo;
							settings.navigation = preservedNavigation;
							settings.currentTheme = preservedTheme;
							settings.contentOrganization = preservedContentOrg;
							settings.typography = preservedTypography;
							settings.optionalFeatures = preservedOptionalFeatures;
							settings.runWizardOnStartup = preservedRunWizardOnStartup;
							
							await this.plugin.saveData(settings);
							// Reload settings to ensure the plugin has the latest values
							await (this.plugin as any).loadSettings();
							
							// Apply to config file
							await this.applyCurrentConfiguration(true);
							new Notice(`Reset to ${settings.currentTemplate} template and applied to config.ts`);
						} else {
							new Notice('Template not found');
						}
					} catch (error) {
						new Notice(`Failed to reset to template: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Reset to defaults
		new Setting(container)
			.setName('Reset to defaults')
			.setDesc('Reset all settings to their default values')
			.addButton(button => button
				.setButtonText('Reset to Defaults')
				.setWarning()
				.onClick(async () => {
					// Create a native Obsidian confirmation modal
					const confirmModal = new Modal(this.app);
					confirmModal.titleEl.setText('Reset to Defaults');
					
					const contentDiv = confirmModal.contentEl.createDiv();
					contentDiv.createEl('p', { text: 'Are you sure you want to reset all configuration settings to defaults?' });
					contentDiv.createEl('p', { text: 'This will preserve your site info and navigation pages/links.' });
					
					const buttonContainer = contentDiv.createDiv();
					buttonContainer.style.marginTop = '20px';
					buttonContainer.style.display = 'flex';
					buttonContainer.style.gap = '10px';
					buttonContainer.style.justifyContent = 'flex-end';
					
					// Cancel button
					const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
					cancelButton.className = 'mod-button';
					cancelButton.addEventListener('click', () => {
						confirmModal.close();
					});
					
					// Confirm button
					const confirmButton = buttonContainer.createEl('button', { text: 'Reset to Defaults' });
					confirmButton.className = 'mod-warning';
					confirmButton.addEventListener('click', async () => {
						confirmModal.close();
						
						// Reset only configuration settings, preserve site info and navigation pages/links
						const settings = this.getSettings();
						const preservedSiteInfo = settings.siteInfo;
						const preservedNavigationPages = settings.navigation.pages;
						const preservedNavigationSocial = settings.navigation.social;
						
						// Reset to defaults
						const resetSettings = { ...DEFAULT_SETTINGS };
						
						// Restore preserved settings
						resetSettings.siteInfo = preservedSiteInfo;
						// Preserve only user's pages and social links, reset display settings to defaults
						resetSettings.navigation.pages = preservedNavigationPages;
						resetSettings.navigation.social = preservedNavigationSocial;
						
						// Update the plugin's main settings object
						(this.plugin as any).settings = resetSettings;
						
						await this.plugin.saveData(resetSettings);
						
						// Ensure settings are loaded after save
						await (this.plugin as any).loadSettings();
						
						// Apply the reset configuration to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice('Configuration reset to defaults and applied to config.ts (site info and navigation pages/links preserved)');
						} catch (error) {
							new Notice(`Configuration reset but failed to apply to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
						
						// Refresh the settings tab to show the reset values
						await (this.plugin as any).triggerSettingsRefresh();
					});
					
					// Focus the confirm button
					confirmButton.focus();
					
					confirmModal.open();
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

	private exportConfiguration(): void {
  const configJson = JSON.stringify(this.getSettings(), null, 2);
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

	private importConfiguration(): void {
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
      const settings = this.getSettings();
      Object.assign(settings, importedSettings);
      await this.plugin.saveData(settings);
					
					// Refresh the settings tab to show imported settings
					// Note: This would need to be handled by the parent component
					new Notice('Configuration imported successfully!');
				} catch (error) {
					new Notice('Failed to import configuration. Please check the file format.');
				}
			}
		};
		input.click();
	}

	private async openConfigFile(): Promise<void> {
		try {
			const fs = require('fs');
			const path = require('path');
			const { shell } = require('electron');
			
			// Get the actual vault path string from the adapter
			const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			if (fs.existsSync(configPath)) {
				// Use Electron's shell to open the file with the default editor
				shell.openPath(configPath);
			} else {
				new Notice(`Config file not found at: ${configPath}`);
			}
		} catch (error) {
			new Notice(`Error opening config file: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}