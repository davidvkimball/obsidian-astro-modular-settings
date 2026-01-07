import { Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { DEFAULT_SETTINGS, TEMPLATE_OPTIONS, AstroModularPlugin } from '../../types';
import { createSettingsGroup } from '../../utils/settings-compat';

export class AdvancedTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Group all settings with no heading
		const advancedGroup = createSettingsGroup(container, undefined, 'astro-modular-settings');

		// Edit config.ts directly button
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Edit config.ts directly') // "config.ts" is a filename, keep as is
				// False positive: Text is already in sentence case; "Astro" is a proper noun
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Open your Astro configuration file in the editor')
				.addButton(button => button
					.setButtonText('Open config.ts')
					.onClick(() => {
						this.openConfigFile();
					}));
		});

		// Sync from config.ts button
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Sync from config.ts')
				.setDesc('Read current config.ts file and update plugin settings to match')
				.addButton(button => button
					.setButtonText('Sync from config.ts')
					.setCta()
					.onClick(async () => {
					try {
						// Read the current config.ts file
						const plugin = this.plugin as AstroModularPlugin;
						const configContent = plugin.configManager.fileManager.readConfig();
						
						if (!configContent) {
							new Notice('Could not read config.ts file');
							return;
						}
						
						// Parse the config.ts file to extract current settings
						const currentConfig = plugin.configManager.fileManager.parseConfigFile(configContent) as Record<string, unknown>;
						
						if (!currentConfig) {
							new Notice('Could not parse config.ts file');
							return;
						}
						
						
						
						// Update plugin settings to match config.ts
						const settings = this.getSettings();
						
						// Update site information
						if (currentConfig.siteInfo && typeof currentConfig.siteInfo === 'object') {
							const siteInfo = currentConfig.siteInfo as Record<string, unknown>;
							settings.siteInfo.site = (siteInfo.site as string | undefined) ?? settings.siteInfo.site;
							settings.siteInfo.title = (siteInfo.title as string | undefined) ?? settings.siteInfo.title;
							settings.siteInfo.description = (siteInfo.description as string | undefined) ?? settings.siteInfo.description;
							settings.siteInfo.author = (siteInfo.author as string | undefined) ?? settings.siteInfo.author;
							settings.siteInfo.language = (siteInfo.language as string | undefined) ?? settings.siteInfo.language;
						}
						
						// Update favicon and OG image settings from top-level config (they're at the top level in config.ts)
						if (currentConfig.faviconThemeAdaptive !== undefined) {
							settings.siteInfo.faviconThemeAdaptive = currentConfig.faviconThemeAdaptive as boolean;
						}
						if (currentConfig.defaultOgImageAlt) {
							settings.siteInfo.defaultOgImageAlt = currentConfig.defaultOgImageAlt as string;
							// Also update seo for backwards compatibility
							if (!settings.seo) {
								settings.seo = { defaultOgImageAlt: '' };
							}
							settings.seo.defaultOgImageAlt = currentConfig.defaultOgImageAlt as string;
						}
						
						// Update navigation settings
						if (currentConfig.navigation && typeof currentConfig.navigation === 'object') {
							const navigation = currentConfig.navigation as Record<string, unknown>;
							if (navigation.pages) {
								settings.navigation.pages = navigation.pages as typeof settings.navigation.pages;
							}
							if (navigation.social) {
								settings.navigation.social = navigation.social as typeof settings.navigation.social;
							}
						}
						
						// Update theme
						if (currentConfig.currentTheme) {
							settings.currentTheme = currentConfig.currentTheme as typeof settings.currentTheme;
						}
						
						// Update typography settings
						if (currentConfig.typography && typeof currentConfig.typography === 'object') {
							const typography = currentConfig.typography as Record<string, unknown>;
							const fontSource = (typography.fontSource as string | undefined) ?? settings.typography.fontSource;
							settings.typography.fontSource = (fontSource === 'local' || fontSource === 'cdn') ? fontSource : settings.typography.fontSource;
							settings.typography.proseFont = (typography.proseFont as string | undefined) ?? settings.typography.proseFont;
							settings.typography.headingFont = (typography.headingFont as string | undefined) ?? settings.typography.headingFont;
							settings.typography.monoFont = (typography.monoFont as string | undefined) ?? settings.typography.monoFont;
						}
						
						// Update table of contents settings
						if (currentConfig.tableOfContents && typeof currentConfig.tableOfContents === 'object') {
							const toc = currentConfig.tableOfContents as Record<string, unknown>;
							if (!settings.tableOfContents) {
								settings.tableOfContents = { enabled: true, depth: 4 };
							}
							settings.tableOfContents.enabled = (toc.enabled as boolean | undefined) ?? settings.tableOfContents.enabled;
							settings.tableOfContents.depth = (toc.depth as number | undefined) ?? settings.tableOfContents.depth;
						}
						
						// Update features based on config.ts
						if (currentConfig.postOptions && typeof currentConfig.postOptions === 'object') {
							const postOptions = currentConfig.postOptions as Record<string, unknown>;
							settings.features.readingTime = (postOptions.readingTime as boolean | undefined) ?? settings.features.readingTime;
							if (postOptions.linkedMentions && typeof postOptions.linkedMentions === 'object') {
								const linkedMentions = postOptions.linkedMentions as Record<string, unknown>;
								settings.features.linkedMentions = (linkedMentions.enabled as boolean | undefined) ?? settings.features.linkedMentions;
								settings.features.linkedMentionsCompact = (linkedMentions.linkedMentionsCompact as boolean | undefined) ?? settings.features.linkedMentionsCompact;
							}
							if (postOptions.graphView && typeof postOptions.graphView === 'object') {
								const graphView = postOptions.graphView as Record<string, unknown>;
								settings.features.graphView = (graphView.enabled as boolean | undefined) ?? settings.features.graphView;
							}
							settings.features.postNavigation = (postOptions.postNavigation as boolean | undefined) ?? settings.features.postNavigation;
							if (postOptions.comments && typeof postOptions.comments === 'object') {
								const comments = postOptions.comments as Record<string, unknown>;
								settings.features.comments = (comments.enabled as boolean | undefined) ?? settings.features.comments;
							}
						}
						
						// Update optional content types
						if (currentConfig.optionalContentTypes && typeof currentConfig.optionalContentTypes === 'object') {
							const optionalContentTypes = currentConfig.optionalContentTypes as Record<string, unknown>;
							settings.optionalContentTypes.projects = (optionalContentTypes.projects as boolean | undefined) ?? settings.optionalContentTypes.projects;
							settings.optionalContentTypes.docs = (optionalContentTypes.docs as boolean | undefined) ?? settings.optionalContentTypes.docs;
						}
						
						// Update footer settings
						if (currentConfig.footer && typeof currentConfig.footer === 'object') {
							const footer = currentConfig.footer as Record<string, unknown>;
							settings.features.showSocialIconsInFooter = (footer.showSocialIconsInFooter as boolean | undefined) ?? false;
						}
						
						// Update command palette - comprehensive sync
						if (currentConfig.commandPalette && typeof currentConfig.commandPalette === 'object') {
							const commandPalette = currentConfig.commandPalette as Record<string, unknown>;
							settings.features.commandPalette = (commandPalette.enabled as boolean | undefined) ?? false;
							
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
							
							settings.commandPalette.enabled = (commandPalette.enabled as boolean | undefined) ?? settings.commandPalette.enabled;
							settings.commandPalette.placeholder = (commandPalette.placeholder as string | undefined) ?? settings.commandPalette.placeholder;
							settings.commandPalette.shortcut = (commandPalette.shortcut as string | undefined) ?? settings.commandPalette.shortcut;
							
							if (commandPalette.search && typeof commandPalette.search === 'object') {
								settings.commandPalette.search = {
									...settings.commandPalette.search,
									...commandPalette.search
								} as typeof settings.commandPalette.search;
							}
							
							if (commandPalette.sections && typeof commandPalette.sections === 'object') {
								settings.commandPalette.sections = {
									...settings.commandPalette.sections,
									...commandPalette.sections
								} as typeof settings.commandPalette.sections;
							}
							
							if (commandPalette.quickActions && typeof commandPalette.quickActions === 'object') {
								settings.commandPalette.quickActions = {
									...settings.commandPalette.quickActions,
									...commandPalette.quickActions
								} as typeof settings.commandPalette.quickActions;
								// Sync to features.quickActions for consistency
								settings.features.quickActions = {
									...settings.features.quickActions,
									...commandPalette.quickActions
								} as typeof settings.features.quickActions;
							}
						}
						
						// Update theme
						if (currentConfig.theme) {
							settings.currentTheme = currentConfig.theme as typeof settings.currentTheme;
						}
						
						// Update site information
						if (currentConfig.site) {
							settings.siteInfo.site = currentConfig.site as string;
						}
						if (currentConfig.title) {
							settings.siteInfo.title = currentConfig.title as string;
						}
						if (currentConfig.description) {
							settings.siteInfo.description = currentConfig.description as string;
						}
						if (currentConfig.author) {
							settings.siteInfo.author = currentConfig.author as string;
						}
						if (currentConfig.language) {
							settings.siteInfo.language = currentConfig.language as string;
						}
						
						// Update template based on current settings
						// This is a bit tricky since we need to determine which template best matches
						// For now, we'll set it to 'standard' since it's been manually modified
						settings.currentTemplate = 'standard';
						
						// Save the updated settings
						await this.plugin.saveData(settings);
						
						// Refresh the settings tab to show the synced values
						await (this.plugin as AstroModularPlugin).triggerSettingsRefresh();
						
						new Notice('Settings synced from config.ts successfully');
					} catch (error) {
						new Notice(`Failed to sync from config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));
		});

		// Reset to Template button
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Reset to template')
				.setDesc(`Reset all settings to the current template (${TEMPLATE_OPTIONS.find(t => t.id === settings.currentTemplate)?.name})`)
				.addButton(button => button
					.setButtonText('Reset to template')
					.setWarning()
					.onClick(async () => {
					// Reset settings to template defaults
					try {
						// Load the template preset
						const templatePreset = (this.plugin as AstroModularPlugin).configManager.getTemplatePreset(settings.currentTemplate);
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
									settings.postOptions.graphView.enabled = ((templatePreset.config.features as unknown) as Record<string, unknown>).graphView as boolean ?? false;
									settings.features.graphView = settings.postOptions.graphView.enabled;
								}
								
								// Sync linked mentions
								if (settings.postOptions?.linkedMentions) {
									const features = (templatePreset.config.features as unknown) as Record<string, unknown>;
									settings.postOptions.linkedMentions.enabled = features.linkedMentions as boolean ?? false;
									settings.postOptions.linkedMentions.linkedMentionsCompact = features.linkedMentionsCompact as boolean ?? false;
								}
								
								// Sync command palette quick actions
								const features = (templatePreset.config.features as unknown) as Record<string, unknown>;
								if (settings.commandPalette?.quickActions && features.quickActions) {
									settings.commandPalette.quickActions = { ...settings.commandPalette.quickActions, ...features.quickActions as Record<string, unknown> };
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
							await (this.plugin as AstroModularPlugin).loadSettings();
							
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
		});

		// Reset to defaults
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Reset to defaults')
				.setDesc('Reset all settings to their default values')
				.addButton(button => button
					.setButtonText('Reset to defaults')
					.setWarning()
					.onClick(() => {
					(() => {
						// Create a native Obsidian confirmation modal
						const confirmModal = new Modal(this.app);
						confirmModal.titleEl.setText('Reset to defaults');
						
						const contentDiv = confirmModal.contentEl.createDiv();
						contentDiv.createEl('p', { text: 'Are you sure you want to reset all configuration settings to defaults?' });
						contentDiv.createEl('p', { text: 'This will preserve your site info and navigation pages/links.' });
						
						const buttonContainer = contentDiv.createDiv();
						buttonContainer.setCssProps({
							marginTop: '20px',
							display: 'flex',
							gap: '10px',
							justifyContent: 'flex-end'
						});
						
						// Cancel button
						const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
						cancelButton.className = 'mod-button';
						cancelButton.addEventListener('click', () => {
							confirmModal.close();
						});
						
						// Confirm button
						const confirmButton = buttonContainer.createEl('button', { text: 'Reset to defaults' });
						confirmButton.className = 'mod-warning';
						confirmButton.addEventListener('click', () => {
							void (async () => {
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
								(this.plugin as AstroModularPlugin).settings = resetSettings;
								
								await this.plugin.saveData(resetSettings);
								
								// Ensure settings are loaded after save
								await (this.plugin as AstroModularPlugin).loadSettings();
								
								// Apply the reset configuration to config.ts
								try {
									await this.applyCurrentConfiguration();
									new Notice('Configuration reset to defaults and applied to config.ts (site info and navigation pages/links preserved)');
								} catch (error) {
									new Notice(`Configuration reset but failed to apply to config.ts: ${error instanceof Error ? error.message : String(error)}`);
								}
								
								// Refresh the settings tab to show the reset values
								await (this.plugin as AstroModularPlugin).triggerSettingsRefresh();
							})();
						});
						
						// Focus the confirm button
						confirmButton.focus();
						
						confirmModal.open();
					})();
				}));
		});

		// Export configuration
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Export configuration')
				.setDesc('Export your current configuration as JSON')
				.addButton(button => button
					.setButtonText('Export JSON')
					.onClick(() => {
						this.exportConfiguration();
					}));
		});

		// Import configuration
		advancedGroup.addSetting((setting) => {
			setting
				.setName('Import configuration')
				.setDesc('Import configuration from JSON file')
				.addButton(button => button
					.setButtonText('Import JSON')
					.onClick(() => {
						this.importConfiguration();
					}));
		});
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
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const importedSettings = JSON.parse(text);
					
					// Merge with current settings
					const settings = this.getSettings();
					Object.assign(settings, importedSettings);
					await this.plugin.saveData(settings);
					
					// Refresh the settings tab to show imported settings
					// Note: This would need to be handled by the parent component
					new Notice('Configuration imported successfully!');
				} catch {
					new Notice('Failed to import configuration. Please check the file format.');
				}
			}
		};
		input.click();
	}

	private openConfigFile(): void {
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const fs = require('fs') as typeof import('fs');
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const path = require('path') as typeof import('path');
			// @ts-expect-error - electron is only available in Electron environment
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const electronModule = require('electron') as unknown as { shell?: typeof import('electron').shell };
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const shell = electronModule.shell;
			if (!shell) {
				throw new Error('Electron shell API not available');
			}
			
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as { basePath?: string; path?: string };
			const vaultPath = adapter.basePath || adapter.path;
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			if (fs.existsSync(configPath)) {
				// Use Electron's shell to open the file with the default editor
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				shell.openPath(configPath);
			} else {
				new Notice(`Config file not found at: ${configPath}`);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			new Notice(`Error opening config file: ${errorMessage}`);
		}
	}
}