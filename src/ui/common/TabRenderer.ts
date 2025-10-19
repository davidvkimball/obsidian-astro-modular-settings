import { App, Setting, Notice, Plugin } from 'obsidian';
import { AstroModularSettings } from '../../types';

export abstract class TabRenderer {
	protected app: App;
	protected plugin: Plugin;

	constructor(
		app: App,
		plugin: Plugin
	) {
		this.app = app;
		this.plugin = plugin;
	}

	abstract render(container: HTMLElement): void | Promise<void>;

	protected getSettings(): AstroModularSettings {
		// Always get the plugin's current settings
		return (this.plugin as any).settings;
	}

	protected async applyCurrentConfiguration(showNotice: boolean = false): Promise<void> {
		try {
			const settings = this.getSettings();
			// Apply the current settings to the config file
			const presetSuccess = await (this.plugin as any).configManager.applyPreset({
				name: settings.currentTemplate,
				description: '',
				features: settings.features,
				theme: settings.currentTheme,
				contentOrganization: settings.contentOrganization,
				config: settings
			});

			if (presetSuccess) {
				if (showNotice) {
					new Notice('Configuration applied successfully!');
				}
				await (this.plugin as any).configManager.triggerRebuild();
			} else {
				if (showNotice) {
					new Notice('Failed to apply configuration. Check the console for errors.');
				}
			}
		} catch (error) {
			if (showNotice) {
				new Notice(`Error applying configuration: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}

	protected createDropdownSetting(
		container: HTMLElement,
		name: string,
		description: string,
		value: string,
		options: Record<string, string>,
		onChange: (value: string) => void
	): Setting {
		return new Setting(container)
			.setName(name)
			.setDesc(description)
			.addDropdown(dropdown => {
				Object.entries(options).forEach(([key, label]) => {
					dropdown.addOption(key, label);
				});
				dropdown.setValue(value);
				dropdown.onChange(async (value) => {
					onChange(value);
					await this.plugin.saveData(this.getSettings());
					await this.applyCurrentConfiguration(true);
				});
				return dropdown;
			});
	}

	protected createTextSetting(
		container: HTMLElement,
		name: string,
		description: string,
		value: string,
		onChange: (value: string) => void,
		debounceMs: number = 1000
	): Setting {
		return new Setting(container)
			.setName(name)
			.setDesc(description)
			.addText(text => {
				text.setValue(value);
				
				let timeoutId: number | null = null;
				text.onChange(async (value) => {
					// Clear existing timeout
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
					
					// Update the value immediately for UI responsiveness
					onChange(value);
					
					// Save settings immediately
					await this.plugin.saveData(this.getSettings());
					
					// Debounce the configuration application
					timeoutId = window.setTimeout(async () => {
						await this.applyCurrentConfiguration(true);
					}, debounceMs);
				});
				
				// Also apply on blur (when user leaves the field)
				text.inputEl.addEventListener('blur', async () => {
					if (timeoutId) {
						clearTimeout(timeoutId);
						await this.applyCurrentConfiguration(true);
					}
				});
				
				return text;
			});
	}

	protected createToggleSetting(
		container: HTMLElement,
		name: string,
		description: string,
		value: boolean,
		onChange: (value: boolean) => void
	): Setting {
		return new Setting(container)
			.setName(name)
			.setDesc(description)
			.addToggle(toggle => {
				toggle.setValue(value);
				toggle.onChange(async (value) => {
					onChange(value);
					await this.plugin.saveData(this.getSettings());
					await this.applyCurrentConfiguration(true);
				});
				return toggle;
			});
	}
}
