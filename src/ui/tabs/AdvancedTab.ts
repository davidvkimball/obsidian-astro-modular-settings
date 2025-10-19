import { Setting, Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { DEFAULT_SETTINGS } from '../../types';

export class AdvancedTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Advanced Settings' });
		const description = settingsSection.createEl('p', { text: 'Advanced configuration options and utilities.' });

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
						
						// Update features based on config.ts
						if (currentConfig.postOptions) {
							settings.features.tableOfContents = currentConfig.postOptions.tableOfContents ?? false;
							settings.features.readingTime = currentConfig.postOptions.readingTime ?? false;
							settings.features.linkedMentions = currentConfig.postOptions.linkedMentions?.enabled ?? false;
							settings.features.linkedMentionsCompact = currentConfig.postOptions.linkedMentions?.linkedMentionsCompact ?? false;
							settings.features.graphView = currentConfig.postOptions.graphView?.enabled ?? false;
							settings.features.postNavigation = currentConfig.postOptions.postNavigation ?? false;
							settings.features.comments = currentConfig.postOptions.comments?.enabled ?? false;
						}
						
						// Update optional content types
						if (currentConfig.optionalContentTypes) {
							settings.optionalContentTypes.projects = currentConfig.optionalContentTypes.projects ?? false;
							settings.optionalContentTypes.docs = currentConfig.optionalContentTypes.docs ?? false;
						}
						
						// Update footer settings
						if (currentConfig.footer) {
							settings.features.showSocialIconsInFooter = currentConfig.footer.showSocialIconsInFooter ?? false;
						}
						
						// Update command palette
						if (currentConfig.commandPalette) {
							settings.features.commandPalette = currentConfig.commandPalette.enabled ?? false;
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
						// For now, we'll set it to 'custom' since it's been manually modified
						settings.currentTemplate = 'custom';
						
						// Save the updated settings
						await this.plugin.saveData(settings);
						
						// Refresh the settings tab to show the synced values
						(this.plugin as any).triggerSettingsRefresh();
						
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
					contentDiv.createEl('p', { text: 'This will preserve your site info and navigation settings.' });
					
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
						
						// Reset only configuration settings, preserve site info and navigation
						const settings = this.getSettings();
						const preservedSiteInfo = settings.siteInfo;
						const preservedNavigation = settings.navigation;
						
						// Reset to defaults
						const resetSettings = { ...DEFAULT_SETTINGS };
						
						// Restore preserved settings
						resetSettings.siteInfo = preservedSiteInfo;
						resetSettings.navigation = preservedNavigation;
						
						// Update the plugin's main settings object
						(this.plugin as any).settings = resetSettings;
						
						await this.plugin.saveData(resetSettings);
						
						// Apply the reset configuration to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice('Configuration reset to defaults and applied to config.ts (site info and navigation preserved)');
						} catch (error) {
							new Notice(`Configuration reset but failed to apply to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
						
						// Refresh the settings tab to show the reset values
						(this.plugin as any).triggerSettingsRefresh();
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