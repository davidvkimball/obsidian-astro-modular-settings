import { Plugin, Notice } from 'obsidian';
import { ObsidianApp } from '../types';
import { SetupWizardModal } from '../ui/SetupWizardModal';

export function registerCommands(plugin: Plugin) {
	// Open settings command
	plugin.addCommand({
		id: 'open-settings',
		name: 'Open Astro Modular Settings',
		icon: 'settings-2',
		callback: () => {
			// This will be handled by the settings tab
			(plugin.app as unknown as ObsidianApp).setting.open();
			(plugin.app as unknown as ObsidianApp).setting.openTabById(plugin.manifest.id);
		}
	});

	// Run setup wizard command
	plugin.addCommand({
		id: 'run-setup-wizard',
		name: 'Run setup wizard',
		icon: 'wand',
		callback: async () => {
			// Reload settings to ensure we have the latest values
			await plugin.loadData().then((data: any) => {
				Object.assign((plugin as any).settings, data);
			});
			const wizard = new SetupWizardModal(plugin.app, plugin as any);
			wizard.open();
		}
	});
}
