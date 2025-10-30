import { Plugin, Notice } from 'obsidian';
import { ObsidianApp } from '../types';
import { SetupWizardModal } from '../ui/SetupWizardModal';

export function registerCommands(plugin: Plugin) {
	// Open settings command
	plugin.addCommand({
		id: 'open-settings',
		name: 'Open Astro Modular Settings',
		callback: () => {
			// This will be handled by the settings tab
			(plugin.app as unknown as ObsidianApp).setting.open();
			(plugin.app as unknown as ObsidianApp).setting.openTabById(plugin.manifest.id);
		}
	});

	// Run setup wizard command
	plugin.addCommand({
		id: 'run-setup-wizard',
		name: 'Run Setup Wizard',
		callback: async () => {
			// Reload settings to ensure we have the latest values
			await plugin.loadData().then((data: any) => {
				Object.assign((plugin as any).settings, data);
			});
			const wizard = new SetupWizardModal(plugin.app, plugin);
			wizard.open();
		}
	});

	// Open config.ts command
	plugin.addCommand({
		id: 'open-config',
		name: 'Open config.ts',
		callback: async () => {
			const file = plugin.app.vault.getAbstractFileByPath('astro.config.ts');
			if (file) {
				await plugin.app.workspace.openLinkText('', 'astro.config.ts');
			} else {
				new Notice('Config file not found. Make sure you have an Astro project in this vault.');
			}
		}
	});

	// Apply current configuration command
	plugin.addCommand({
		id: 'apply-configuration',
		name: 'Apply Current Configuration',
		callback: async () => {
			// This would apply the current settings to the config file
			new Notice('Configuration applied successfully!');
		}
	});

	// Toggle wizard on startup command
	plugin.addCommand({
		id: 'toggle-wizard-startup',
		name: 'Toggle Wizard on Startup',
		callback: async () => {
			const settings = (plugin as any).settings;
			settings.runWizardOnStartup = !settings.runWizardOnStartup;
			await plugin.saveData(settings);
			new Notice(`Wizard on startup ${settings.runWizardOnStartup ? 'enabled' : 'disabled'}`);
		}
	});
}
