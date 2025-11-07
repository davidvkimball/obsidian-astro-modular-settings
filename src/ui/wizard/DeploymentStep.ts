import { BaseWizardStep } from './BaseWizardStep';

export class DeploymentStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="deployment-selection">
				<h2>Deployment platform</h2>
				<p>Choose your preferred deployment platform.</p>
				<div class="deployment-options">
					<div class="deployment-option ${state.selectedDeployment === 'netlify' ? 'selected' : ''}" 
						 data-deployment="netlify">
						<div class="deployment-header">
							<h3>Netlify</h3>
						</div>
						<p>Zero-config deployments with built-in CI/CD and serverless functions.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'vercel' ? 'selected' : ''}" 
						 data-deployment="vercel">
						<div class="deployment-header">
							<h3>Vercel</h3>
						</div>
						<p>Edge-optimized platform with instant deployments and global CDN.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'github-pages' ? 'selected' : ''}" 
						 data-deployment="github-pages">
						<div class="deployment-header">
							<h3>GitHub Pages</h3>
						</div>
						<p>Free static hosting integrated directly with your GitHub repository.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'cloudflare-workers' ? 'selected' : ''}" 
						 data-deployment="cloudflare-workers">
						<div class="deployment-header">
							<h3>Cloudflare Workers</h3>
						</div>
						<p>Global edge network with unlimited bandwidth and custom headers on all plans.</p>
					</div>
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.deployment-option').forEach(option => {
			option.addEventListener('click', () => {
				const deployment = option.getAttribute('data-deployment');
				if (deployment) {
					this.updateState({ 
						selectedDeployment: deployment as 'netlify' | 'vercel' | 'github-pages' | 'cloudflare-workers' 
					});
					this.render(container);
				}
			});
		});
	}
}
