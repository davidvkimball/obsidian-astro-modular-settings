import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { SetupWizardModal } from '../SetupWizardModal';
import { TEMPLATE_OPTIONS, THEME_OPTIONS } from '../../types';
import { CommandPickerModal } from '../components/CommandPickerModal';
import { IconPickerModal } from '../components/IconPickerModal';

export class GeneralTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		
		// Always use the plugin's current settings
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Current configuration display (moved to top)
		const configDisplay = container.createDiv('config-display');
		const configInfo = configDisplay.createDiv('config-info');
		const configTitle = configInfo.createEl('h3', { text: 'Current Configuration' });
		
		const templateItem = configInfo.createDiv('config-item');
		templateItem.createEl('strong', { text: 'Template: ' });
		templateItem.createSpan({ text: TEMPLATE_OPTIONS.find(t => t.id === settings.currentTemplate)?.name || 'Unknown' });
		
		const themeItem = configInfo.createDiv('config-item');
		themeItem.createEl('strong', { text: 'Theme: ' });
		themeItem.createSpan({ text: THEME_OPTIONS.find(t => t.id === settings.currentTheme)?.name || 'Unknown' });
		
		const orgItem = configInfo.createDiv('config-item');
		orgItem.createEl('strong', { text: 'Organization: ' });
		orgItem.createSpan({ text: settings.contentOrganization === 'file-based' ? 'File-based' : 'Folder-based' });
		
		const deploymentItem = configInfo.createDiv('config-item');
		deploymentItem.createEl('strong', { text: 'Deployment: ' });
		deploymentItem.createSpan({ text: this.formatDeploymentName(settings.deployment.platform) });
		
		const siteTitleItem = configInfo.createDiv('config-item');
		siteTitleItem.createEl('strong', { text: 'Site Title: ' });
		siteTitleItem.createSpan({ text: settings.siteInfo.title });
		
		const siteUrlItem = configInfo.createDiv('config-item');
		siteUrlItem.createEl('strong', { text: 'Site URL: ' });
		siteUrlItem.createSpan({ text: settings.siteInfo.site });


		// Run setup wizard button
		new Setting(container)
			.setName('Setup wizard')
			.setDesc('Run the setup wizard to reconfigure your theme')
			.addButton(button => button
				.setButtonText('Run Setup Wizard')
				.setCta()
				.onClick(async () => {
					// Reload settings to ensure we have the latest values
					await this.plugin.loadData().then((data: any) => {
						Object.assign((this.plugin as any).settings, data);
					});
					const wizard = new SetupWizardModal(this.app, this.plugin as any);
					wizard.open();
				}));

		// Run wizard on startup (moved to bottom)
		new Setting(container)
			.setName('Run wizard on startup')
			.setDesc('Show the setup wizard when Obsidian starts (if not disabled)')
			.addToggle(toggle => toggle
				.setValue(settings.runWizardOnStartup)
				.onChange(async (value) => {
					settings.runWizardOnStartup = value;
					await this.plugin.saveData(settings);
				}));

		// Help button replacement toggle
		const helpButtonSetting = new Setting(container)
			.setName('Swap out help button for custom action')
			.setDesc('Replace the help button in the vault profile area with a custom action')
			.addToggle(toggle => toggle
				.setValue(settings.helpButtonReplacement?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.helpButtonReplacement) {
								settings.helpButtonReplacement = {
									enabled: true,
									commandId: 'astro-modular-settings:open-settings',
									iconId: 'wrench',
								};
					}
					settings.helpButtonReplacement.enabled = value;
					await this.plugin.saveData(settings);
					// Trigger help button replacement update (it will reload settings)
					if ((this.plugin as any).updateHelpButton) {
						await (this.plugin as any).updateHelpButton();
					}
					// Re-render to show/hide options
					this.render(container);
				}));

		// Show command and icon pickers only if enabled
		if (settings.helpButtonReplacement?.enabled) {
			// Command picker
			const commandName = this.getCommandName(settings.helpButtonReplacement.commandId);
			new Setting(container)
				.setName('Command')
				.setDesc('Select the command to execute when the button is clicked')
				.addButton(button => button
					.setButtonText(commandName || 'Select command...')
					.onClick(() => {
						const modal = new CommandPickerModal(this.app, async (commandId) => {
							if (!settings.helpButtonReplacement) {
								settings.helpButtonReplacement = {
									enabled: true,
									commandId: 'astro-modular-settings:open-settings',
									iconId: 'wrench',
								};
							}
							settings.helpButtonReplacement.commandId = commandId;
							await this.plugin.saveData(settings);
							// Trigger help button replacement update immediately (it will reload settings)
							if ((this.plugin as any).updateHelpButton) {
								await (this.plugin as any).updateHelpButton();
							}
							// Re-render to show updated command name
							this.render(container);
						});
						modal.open();
					}));

			// Icon picker
			const iconName = this.getIconName(settings.helpButtonReplacement.iconId);
			new Setting(container)
				.setName('Icon')
				.setDesc('Select the icon to display on the button')
				.addButton(button => button
					.setButtonText(iconName || 'Select icon...')
					.onClick(() => {
						const modal = new IconPickerModal(this.app, async (iconId) => {
							if (!settings.helpButtonReplacement) {
								settings.helpButtonReplacement = {
									enabled: true,
									commandId: 'astro-modular-settings:open-settings',
									iconId: 'wrench',
								};
							}
							settings.helpButtonReplacement.iconId = iconId;
							await this.plugin.saveData(settings);
							// Trigger help button replacement update immediately (it will reload settings)
							if ((this.plugin as any).updateHelpButton) {
								await (this.plugin as any).updateHelpButton();
							}
							// Re-render to show updated icon name
							this.render(container);
						});
						modal.open();
					}));
		}
	}

	private getCommandName(commandId: string): string {
		try {
			const commands = (this.app as any).commands;
			if (commands && commands.listCommands) {
				const allCommands = commands.listCommands();
				const command = allCommands.find((cmd: any) => cmd.id === commandId);
				return command?.name || commandId;
			}
		} catch (e) {
			console.warn('[Astro Modular Settings] Error getting command name:', e);
		}
		return commandId;
	}

	private getIconName(iconId: string): string {
		if (!iconId) return '';
		// Convert icon ID to a readable name, removing lucide- prefix if present
		return iconId
			.replace(/^lucide-/, '') // Remove lucide- prefix
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	private formatDeploymentName(deployment: string): string {
		switch (deployment) {
			case 'netlify':
				return 'Netlify';
			case 'vercel':
				return 'Vercel';
			case 'github-pages':
				return 'GitHub Pages';
			case 'cloudflare-workers':
				return 'Cloudflare Workers';
			default:
				return deployment;
		}
	}
}
