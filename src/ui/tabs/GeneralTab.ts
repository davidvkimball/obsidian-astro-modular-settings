import { Setting } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { SetupWizardModal } from '../SetupWizardModal';
import { TEMPLATE_OPTIONS, THEME_OPTIONS, AstroModularPlugin, AstroModularSettings } from '../../types';
import { createSettingsGroup } from '../../utils/settings-compat';

export class GeneralTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		
		// Always use the plugin's current settings
		const settings = this.getSettings();

		// Current configuration display (moved to top)
		const configDisplay = container.createDiv('config-display');
		const configInfo = configDisplay.createDiv('config-info');
		
		// Current Configuration heading
		new Setting(configInfo)
			.setHeading()
			.setName('Current configuration');
		
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
		siteTitleItem.createEl('strong', { text: 'Site title: ' });
		siteTitleItem.createSpan({ text: settings.siteInfo.title });
		
		const siteUrlItem = configInfo.createDiv('config-item');
		siteUrlItem.createEl('strong', { text: 'Site URL: ' }); // URL is an acronym, keep uppercase
		siteUrlItem.createSpan({ text: settings.siteInfo.site });

		// Group three settings with no heading
		const generalGroup = createSettingsGroup(container);
		
		// Run setup wizard button
		generalGroup.addSetting((setting) => {
			setting
				.setName('Setup wizard')
				.setDesc('Run the setup wizard to reconfigure your theme')
				.addButton(button => button
					.setButtonText('Run setup wizard')
					.setCta()
					.onClick(async () => {
						// Reload settings to ensure we have the latest values
						const plugin = this.plugin as AstroModularPlugin;
						await this.plugin.loadData().then((data: Partial<AstroModularSettings> | null) => {
							if (data) {
								Object.assign(plugin.settings, data);
							}
						});
						const wizard = new SetupWizardModal(this.app, plugin);
						wizard.open();
					}));
		});

		// Run wizard on startup (moved to bottom)
		generalGroup.addSetting((setting) => {
			setting
				.setName('Run wizard on startup')
				.setDesc('Show the setup wizard when Obsidian starts (if not disabled)')
				.addToggle(toggle => toggle
					.setValue(settings.runWizardOnStartup)
					.onChange(async (value) => {
						settings.runWizardOnStartup = value;
						await this.plugin.saveData(settings);
					}));
		});

		// Remove ribbon icon toggle
		generalGroup.addSetting((setting) => {
			setting
				.setName('Remove ribbon icon')
				.setDesc('Remove the wizard icon from the left ribbon')
				.addToggle(toggle => toggle
					.setValue(settings.removeRibbonIcon ?? false)
					.onChange(async (value) => {
						settings.removeRibbonIcon = value;
						await this.plugin.saveData(settings);
						// Update ribbon icon immediately
						const plugin = this.plugin as AstroModularPlugin;
						if (plugin.updateRibbonIcon) {
							await plugin.updateRibbonIcon();
						}
					}));
		});
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
