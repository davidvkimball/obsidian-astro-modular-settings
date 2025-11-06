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
						<p>Automatic deployments from Git with built-in form handling and serverless functions.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'vercel' ? 'selected' : ''}" 
						 data-deployment="vercel">
						<div class="deployment-header">
							<h3>Vercel</h3>
						</div>
						<p>Excellent performance with edge functions and automatic HTTPS.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'github-pages' ? 'selected' : ''}" 
						 data-deployment="github-pages">
						<div class="deployment-header">
							<h3>GitHub Pages</h3>
						</div>
						<p>Free hosting directly from your GitHub repository.</p>
					</div>
					<div class="deployment-option ${state.selectedDeployment === 'cloudflare-pages' ? 'selected' : ''}" 
						 data-deployment="cloudflare-pages">
						<div class="deployment-header">
							<h3>Cloudflare Pages</h3>
						</div>
						<p>Static site hosting with custom headers support on all plans (same format as GitHub Pages).</p>
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
						selectedDeployment: deployment as 'netlify' | 'vercel' | 'github-pages' | 'cloudflare-pages' 
					});
					this.render(container);
				}
			});
		});
	}
}
