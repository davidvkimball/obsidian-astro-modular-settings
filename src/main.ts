import { Plugin, Notice } from 'obsidian';
import { AstroModularSettings, DEFAULT_SETTINGS } from './settings';
import { registerCommands } from './commands';
import { AstroModularSettingsTab } from './ui/SettingsTab';
import { SetupWizardModal } from './ui/SetupWizardModal';
import { ConfigManager } from './utils/ConfigManager';
import { PluginManager } from './utils/PluginManager';
import { ObsidianApp } from './types';

export default class AstroModularSettingsPlugin extends Plugin {
	settings!: AstroModularSettings;
	private settingsTab!: AstroModularSettingsTab;
	private startupTimeoutId?: number;
	configManager!: ConfigManager;
	pluginManager!: PluginManager;

	async onload() {
		await this.loadSettings();

		// Initialize managers
		this.configManager = new ConfigManager(this.app);
		this.pluginManager = new PluginManager(this.app, () => this.settings.contentOrganization);

		// Register commands
		registerCommands(this);

		// Add settings tab
		this.settingsTab = new AstroModularSettingsTab(this.app, this);
		this.addSettingTab(this.settingsTab);

		// Add ribbon icon
		this.addRibbonIcon('rocket', 'Astro Modular Settings', async () => {
			// Reload settings from disk to get the latest values
			await this.loadSettings();
			
			const wizard = new SetupWizardModal(this.app, this);
			wizard.open();
		});

		// Check if we should run the wizard on startup
		if (this.settings.runWizardOnStartup) {
			// Delay the wizard to let Obsidian fully load
			this.startupTimeoutId = window.setTimeout(async () => {
				// Reload settings to check if user disabled the setting
				await this.loadSettings();
				if (this.settings.runWizardOnStartup) {
					const wizard = new SetupWizardModal(this.app, this);
					wizard.open();
				}
			}, 2000);
		}

		// No welcome notice needed - modal is the intro
	}

	onunload() {
		// Clear startup timeout if it exists
		if (this.startupTimeoutId) {
			window.clearTimeout(this.startupTimeoutId);
			this.startupTimeoutId = undefined;
		}
		// Other cleanup is handled automatically by Obsidian
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	// Public method to open settings (called by commands)
	openSettings() {
		// This will be handled by the settings tab
		// The settings tab is already registered, so we just need to focus it
		(this.app as unknown as ObsidianApp).setting.open();
		(this.app as unknown as ObsidianApp).setting.openTabById(this.manifest.id);
	}

	// Method to trigger settings refresh
	async triggerSettingsRefresh() {
		// Force the settings tab to re-render with updated settings
		// First reload settings from disk to ensure we have the latest values
		await this.loadSettings();
		
		if (this.settingsTab) {
			// Re-render the settings tab with updated settings
			this.settingsTab.render();
		}
	}
}