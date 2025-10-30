import { Setting, Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { DEFAULT_SETTINGS } from '../../types';

export class AdvancedTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Sync from config.ts button (at the top)
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
}