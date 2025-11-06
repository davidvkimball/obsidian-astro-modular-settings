import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { SetupWizardModal } from '../SetupWizardModal';
import { TEMPLATE_OPTIONS, THEME_OPTIONS } from '../../types';

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
					const wizard = new SetupWizardModal(this.app, this.plugin);
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
	}

	private formatDeploymentName(deployment: string): string {
		switch (deployment) {
			case 'netlify':
				return 'Netlify';
			case 'vercel':
				return 'Vercel';
			case 'github-pages':
				return 'GitHub Pages';
			case 'cloudflare-pages':
				return 'Cloudflare Pages';
			default:
				return deployment;
		}
	}
}
