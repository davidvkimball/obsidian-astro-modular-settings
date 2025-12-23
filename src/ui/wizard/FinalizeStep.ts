import { BaseWizardStep } from './BaseWizardStep';
import { Notice } from 'obsidian';
import { TEMPLATE_OPTIONS, THEME_OPTIONS, AstroModularPlugin } from '../../types';

export class FinalizeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		// Format the values
		const templateName = this.formatTemplateName(state.selectedTemplate);
		const themeName = this.formatThemeName(state.selectedTheme);
		const contentOrgName = this.formatContentOrganization(state.selectedContentOrg);
		const deploymentName = this.formatDeploymentName(state.selectedDeployment);
		
		const finalizeDiv = container.createDiv('finalize-step');
		finalizeDiv.createEl('h2', { text: 'Finalize your configuration' });
		finalizeDiv.createEl('p', { text: 'Review your settings and complete the setup.' });
		
		const configSummary = finalizeDiv.createDiv('config-summary');
		configSummary.createEl('h3', { text: 'Configuration summary' });
		
		const createConfigItem = (label: string, value: string) => {
			const item = configSummary.createDiv('config-item');
			item.createEl('strong', { text: `${label}: ` });
			item.appendText(value);
		};
		
		createConfigItem('Template', templateName);
		createConfigItem('Theme', themeName);
		createConfigItem('Content Organization', contentOrgName);
		createConfigItem('Deployment', deploymentName);
		createConfigItem('Site Title', state.selectedSiteInfo.title);
		createConfigItem('Site URL', state.selectedSiteInfo.site);

		this.setupEventHandlers(container);
	}

	private setupEventHandlers(container: HTMLElement): void {
		// No event handlers needed for finalize step
	}

	async completeWizard(): Promise<void> {
		try {
			// Build final settings - this now updates plugin.settings directly
			this.stateManager.buildFinalSettings();
			
			// Save the settings to disk
			const plugin = this.plugin as AstroModularPlugin;
			await plugin.saveData(plugin.settings);
			
			// Reload settings to ensure the plugin has the latest values
			await plugin.loadSettings();
			
			// Always apply the configuration
			const settings = plugin.settings;
			const presetSuccess = await plugin.configManager.applyPreset({
				name: settings.currentTemplate,
				description: '',
				features: settings.features,
				theme: settings.currentTheme,
				contentOrganization: settings.contentOrganization,
				config: settings
			});

			if (presetSuccess) {
				new Notice('Configuration applied successfully!');
			} else {
				new Notice('Failed to apply configuration. Check the console for errors.');
			}
			
			// Call the completion callback
			this.stateManager.updateState({ currentStep: this.stateManager.getState().totalSteps });
			
		} catch (error) {
			new Notice(`Error completing wizard: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private formatTemplateName(template: string): string {
		const option = TEMPLATE_OPTIONS.find(t => t.id === template);
		return option ? option.name : template;
	}

	private formatThemeName(theme: string): string {
		const option = THEME_OPTIONS.find(t => t.id === theme);
		return option ? option.name : theme;
	}

	private formatContentOrganization(org: string): string {
		return org === 'file-based' ? 'File-based' : 'Folder-based';
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
