import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { SetupWizardModal } from '../SetupWizardModal';
import { TEMPLATE_OPTIONS, THEME_OPTIONS } from '../../types';

export class GeneralTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		
		// Always use the plugin's current settings
		this.refreshSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'General Settings' });
		const description = settingsSection.createEl('p', { text: 'Configure basic plugin behavior and view current status.' });

		// Run wizard on startup
		new Setting(container)
			.setName('Run wizard on startup')
			.setDesc('Show the setup wizard when Obsidian starts (if not disabled)')
			.addToggle(toggle => toggle
				.setValue(this.settings.runWizardOnStartup)
				.onChange(async (value) => {
					this.settings.runWizardOnStartup = value;
					await this.plugin.saveData(this.settings);
				}));

		// Current configuration display
		const configDisplay = container.createDiv('config-display');
		const configInfo = configDisplay.createDiv('config-info');
		const configTitle = configInfo.createEl('h3', { text: 'Current Configuration' });
		
		const templateItem = configInfo.createDiv('config-item');
		templateItem.createEl('strong', { text: 'Template: ' });
		templateItem.createSpan({ text: TEMPLATE_OPTIONS.find(t => t.id === this.settings.currentTemplate)?.name || 'Unknown' });
		
		const themeItem = configInfo.createDiv('config-item');
		themeItem.createEl('strong', { text: 'Theme: ' });
		themeItem.createSpan({ text: THEME_OPTIONS.find(t => t.id === this.settings.currentTheme)?.name || 'Unknown' });
		
		const orgItem = configInfo.createDiv('config-item');
		orgItem.createEl('strong', { text: 'Organization: ' });
		orgItem.createSpan({ text: this.settings.contentOrganization === 'file-based' ? 'File-based' : 'Folder-based' });
		
		const deploymentItem = configInfo.createDiv('config-item');
		deploymentItem.createEl('strong', { text: 'Deployment: ' });
		deploymentItem.createSpan({ text: this.formatDeploymentName(this.settings.deployment.platform) });
		
		const siteTitleItem = configInfo.createDiv('config-item');
		siteTitleItem.createEl('strong', { text: 'Site Title: ' });
		siteTitleItem.createSpan({ text: this.settings.siteInfo.title });
		
		const siteUrlItem = configInfo.createDiv('config-item');
		siteUrlItem.createEl('strong', { text: 'Site URL: ' });
		siteUrlItem.createSpan({ text: this.settings.siteInfo.site });

		// Run setup wizard button
		new Setting(container)
			.setName('Setup wizard')
			.setDesc('Run the setup wizard to reconfigure your theme')
				.addButton(button => button
					.setButtonText('Run Setup Wizard')
					.setCta()
					.onClick(async () => {
						// Use the plugin's settings directly - no need to reload
						const wizard = new SetupWizardModal(this.app, (this.plugin as any).settings, async (newSettings) => {
							// Update the plugin's settings directly
							(this.plugin as any).settings = newSettings;
							await this.plugin.saveData((this.plugin as any).settings);
							// Update our local reference
							this.settings = (this.plugin as any).settings;
							// Force refresh of the settings tab
							(this.plugin as any).triggerSettingsRefresh();
						});
						wizard.open();
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
			default:
				return deployment;
		}
	}
}
