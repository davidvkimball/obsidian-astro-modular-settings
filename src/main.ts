import { Plugin, Notice } from 'obsidian';
import { AstroModularSettings, DEFAULT_SETTINGS } from './settings';
import { registerCommands } from './commands';
import { AstroModularSettingsTab } from './ui/SettingsTab';
import { SetupWizardModal } from './ui/SetupWizardModal';

export default class AstroModularSettingsPlugin extends Plugin {
	settings: AstroModularSettings;

	async onload() {
		await this.loadSettings();

		// Register commands
		registerCommands(this, this.settings);

		// Add settings tab
		this.addSettingTab(new AstroModularSettingsTab(this.app, this, this.settings));

		// Add ribbon icon
		this.addRibbonIcon('rocket', 'Astro Modular Settings', () => {
			const wizard = new SetupWizardModal(this.app, this.settings, async (newSettings) => {
				this.settings = newSettings;
				await this.saveSettings();
			});
			wizard.open();
		});

		// Check if we should run the wizard on startup
		if (this.settings.runWizardOnStartup) {
			// Delay the wizard to let Obsidian fully load
			setTimeout(() => {
				this.runStartupWizard();
			}, 2000);
		}

		// No welcome notice needed - modal is the intro
	}

	onunload() {
		// Cleanup is handled automatically by Obsidian
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async runStartupWizard() {
		// Run the wizard on startup if enabled
		const wizard = new SetupWizardModal(this.app, this.settings, async (newSettings) => {
			this.settings = newSettings;
			await this.saveSettings();
		});
		wizard.open();
	}

	// Public method to open settings (called by commands)
	openSettings() {
		// This will be handled by the settings tab
		// The settings tab is already registered, so we just need to focus it
		(this.app as any).setting.open();
		(this.app as any).setting.openTabById(this.manifest.id);
	}
}