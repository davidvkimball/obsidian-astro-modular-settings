import { Plugin } from 'obsidian';
import { AstroModularSettings, DEFAULT_SETTINGS } from './settings';
import { registerCommands } from './commands';
import { AstroModularSettingsTab } from './ui/SettingsTab';
import { ConfigManager } from './utils/ConfigManager';
import { PluginManager } from './utils/PluginManager';
import { RibbonIconManager } from './utils/RibbonIconManager';
import { ObsidianApp } from './types';

export default class AstroModularSettingsPlugin extends Plugin {
	settings!: AstroModularSettings;
	private settingsTab!: AstroModularSettingsTab;
	private startupTimeoutId?: number;
	configManager!: ConfigManager;
	pluginManager!: PluginManager;
	private ribbonManager!: RibbonIconManager;

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

		// Initialize ribbon icon manager
		this.ribbonManager = new RibbonIconManager(this, async () => {
			await this.loadSettings();
			await this.openWizard();
		});
		this.ribbonManager.update(this.settings.removeRibbonIcon);

		// Check if we should run the wizard on startup
		if (this.settings.runWizardOnStartup) {
			// Delay the wizard to let Obsidian fully load
			this.startupTimeoutId = window.setTimeout(() => {
				void (async () => {
					await this.loadSettings();
					if (this.settings.runWizardOnStartup) {
						await this.openWizard();
					}
				})();
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

		// Cleanup ribbon icon manager
		this.ribbonManager?.destroy();

		// Other cleanup is handled automatically by Obsidian
	}

	async loadSettings() {
		const data = await this.loadData() as Partial<AstroModularSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
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
			this.settingsTab.display();
		}
	}

	// Method to update ribbon icon based on settings
	public async updateRibbonIcon() {
		await this.loadSettings();
		this.ribbonManager.update(this.settings.removeRibbonIcon);
	}

	// Lazy-load and open the setup wizard
	async openWizard() {
		const { SetupWizardModal } = await import('./ui/SetupWizardModal');
		const wizard = new SetupWizardModal(this.app, this);
		wizard.open();
	}
}