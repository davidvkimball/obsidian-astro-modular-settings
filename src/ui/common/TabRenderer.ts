import { App, Setting, Notice, Plugin } from 'obsidian';
import { AstroModularSettings } from '../../types';
import { ConfigManager } from '../../utils/ConfigManager';
import { PluginManager } from '../../utils/PluginManager';

export abstract class TabRenderer {
	protected app: App;
	protected settings: AstroModularSettings;
	protected configManager: ConfigManager;
	protected pluginManager: PluginManager;
	protected plugin: Plugin;

	constructor(
		app: App,
		settings: AstroModularSettings,
		configManager: ConfigManager,
		pluginManager: PluginManager,
		plugin: Plugin
	) {
		this.app = app;
		this.settings = settings;
		this.configManager = configManager;
		this.pluginManager = pluginManager;
		this.plugin = plugin;
	}

	abstract render(container: HTMLElement): void | Promise<void>;

	protected refreshSettings(): void {
		// Always use the plugin's current settings
		this.settings = (this.plugin as any).settings;
	}

	protected async applyCurrentConfiguration(showNotice: boolean = false): Promise<void> {
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
				if (showNotice) {
					new Notice('Configuration applied successfully!');
				}
				await this.configManager.triggerRebuild();
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
					await this.plugin.saveData(this.settings);
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
					await this.plugin.saveData(this.settings);
					
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
					await this.applyCurrentConfiguration();
				});
				return toggle;
			});
	}
}
