import { BaseWizardStep } from './BaseWizardStep';

export class DeploymentStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const deploymentSelection = container.createDiv('deployment-selection');
		deploymentSelection.createEl('h2', { text: 'Deployment platform' });
		deploymentSelection.createEl('p', { text: 'Choose your preferred deployment platform.' });
		
		const deploymentOptions = deploymentSelection.createDiv('deployment-options');
		
		const deployments = [
			{ id: 'netlify', name: 'Netlify', desc: 'Zero-config deployments with built-in CI/CD and serverless functions.' },
			{ id: 'vercel', name: 'Vercel', desc: 'Edge-optimized platform with instant deployments and global CDN.' },
			{ id: 'github-pages', name: 'GitHub Pages', desc: 'Free static hosting integrated directly with your GitHub repository.' },
			{ id: 'cloudflare-workers', name: 'Cloudflare Workers', desc: 'Global edge network with unlimited bandwidth and custom headers on all plans.' }
		];
		
		deployments.forEach(deployment => {
			const option = deploymentOptions.createDiv('deployment-option');
			if (state.selectedDeployment === deployment.id) {
				option.addClass('selected');
			}
			option.setAttribute('data-deployment', deployment.id);
			
			const header = option.createDiv('deployment-header');
			header.createEl('h3', { text: deployment.name });
			option.createEl('p', { text: deployment.desc });
			
			option.addEventListener('click', () => {
				this.updateState({ 
					selectedDeployment: deployment.id as 'netlify' | 'vercel' | 'github-pages' | 'cloudflare-workers' 
				});
				this.render(container);
			});
		});
	}
}
