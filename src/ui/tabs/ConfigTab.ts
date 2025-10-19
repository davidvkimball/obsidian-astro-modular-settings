import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { TEMPLATE_OPTIONS } from '../../types';
import { PresetWarningModal } from '../PresetWarningModal';

export class ConfigTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		this.refreshSettings();

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
									new Notice(`Failed to apply template change: ${error instanceof Error ? error.message : String(error)}`);
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
							new Notice(`Failed to apply template change: ${error instanceof Error ? error.message : String(error)}`);
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
						new Notice(`Failed to apply content organization change: ${error instanceof Error ? error.message : String(error)}`);
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
						new Notice(`Failed to apply deployment platform change: ${error instanceof Error ? error.message : String(error)}`);
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
					// Reset settings to template defaults
					try {
						// Load the template preset
						const templatePreset = this.configManager.getTemplatePreset(this.settings.currentTemplate);
						if (templatePreset) {
							// Apply the template settings
							this.settings = { ...this.settings, ...templatePreset.config };
							await this.plugin.saveData(this.settings);
							
							// Apply to config file
							await this.applyCurrentConfiguration(true);
							new Notice(`Reset to ${this.settings.currentTemplate} template and applied to config.ts`);
						} else {
							new Notice('Template not found');
						}
					} catch (error) {
						new Notice(`Failed to reset to template: ${error instanceof Error ? error.message : String(error)}`);
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