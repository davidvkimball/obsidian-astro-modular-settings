import { Plugin } from 'obsidian';
import { ObsidianApp, AstroModularPlugin, AstroModularSettings } from '../types';
import { SetupWizardModal } from '../ui/SetupWizardModal';

export function registerCommands(plugin: Plugin) {
	// Open settings command
	plugin.addCommand({
		id: 'open-settings',
		name: 'Open settings',
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
			await plugin.loadData().then((data: Partial<AstroModularSettings> | null) => {
				if (data && 'settings' in plugin) {
					Object.assign((plugin as AstroModularPlugin).settings, data);
				}
			});
			const wizard = new SetupWizardModal(plugin.app, plugin as AstroModularPlugin);
			wizard.open();
		}
	});
}
