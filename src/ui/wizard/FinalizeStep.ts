import { BaseWizardStep } from './BaseWizardStep';
import { Notice } from 'obsidian';
import { TEMPLATE_OPTIONS, THEME_OPTIONS } from '../../types';

export class FinalizeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		// Format the values
		const templateName = this.formatTemplateName(state.selectedTemplate);
		const themeName = this.formatThemeName(state.selectedTheme);
		const contentOrgName = this.formatContentOrganization(state.selectedContentOrg);
		const deploymentName = this.formatDeploymentName(state.selectedDeployment);
		
		container.innerHTML = `
			<div class="finalize-step">
				<h2>Finalize your configuration</h2>
				<p>Review your settings and complete the setup.</p>
				
				<div class="config-summary">
					<h3>Configuration Summary</h3>
					<div class="config-item">
						<strong>Template:</strong> ${templateName}
					</div>
					<div class="config-item">
						<strong>Theme:</strong> ${themeName}
					</div>
					<div class="config-item">
						<strong>Content Organization:</strong> ${contentOrgName}
					</div>
					<div class="config-item">
						<strong>Deployment:</strong> ${deploymentName}
					</div>
					<div class="config-item">
						<strong>Site Title:</strong> ${state.selectedSiteInfo.title}
					</div>
					<div class="config-item">
						<strong>Site URL:</strong> ${state.selectedSiteInfo.site}
					</div>
				</div>
				
			</div>
		`;

		this.setupEventHandlers(container);
	}

	private setupEventHandlers(container: HTMLElement): void {
		// No event handlers needed for finalize step
	}

	async completeWizard(): Promise<void> {
		const state = this.getState();
		
		try {
			// Build final settings - this now updates plugin.settings directly
			this.stateManager.buildFinalSettings();
			
			// Save the settings to disk
			await (this.plugin as any).saveData((this.plugin as any).settings);
			
			// Reload settings to ensure the plugin has the latest values
			await (this.plugin as any).loadSettings();
			
			// Always apply the configuration
			const settings = (this.plugin as any).settings;
			const presetSuccess = await (this.plugin as any).configManager.applyPreset({
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
