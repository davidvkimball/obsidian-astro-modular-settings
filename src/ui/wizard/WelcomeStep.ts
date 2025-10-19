import { BaseWizardStep } from './BaseWizardStep';

export class WelcomeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="welcome-content">
				<h2>Welcome to Astro Modular!</h2>
				<p>This wizard will help you set up your Astro Modular theme with the perfect configuration for your needs.</p>
				
				<div class="checkbox-option">
					<input type="checkbox" id="run-wizard-startup" ${state.runWizardOnStartup ? 'checked' : ''}>
					<label for="run-wizard-startup">Run this wizard on startup</label>
				</div>
				
				<div class="site-info-form">
					<h3>Site Information</h3>
					<div class="form-group">
						<label for="site-url">URL</label>
						<input type="text" id="site-url" value="${state.selectedSiteInfo.site}" placeholder="https://astro-modular.netlify.app">
					</div>
					<div class="form-group">
						<label for="site-title">Title</label>
						<input type="text" id="site-title" value="${state.selectedSiteInfo.title}" placeholder="Astro Modular">
					</div>
					<div class="form-group">
						<label for="site-description">Description</label>
						<input type="text" id="site-description" value="${state.selectedSiteInfo.description}" placeholder="A flexible blog theme designed for Obsidian users.">
					</div>
					<div class="form-group">
						<label for="site-author">Author Name</label>
						<input type="text" id="site-author" value="${state.selectedSiteInfo.author}" placeholder="David V. Kimball">
					</div>
					<div class="form-group">
						<label for="site-language">Language</label>
						<input type="text" id="site-language" value="${state.selectedSiteInfo.language}" placeholder="en">
					</div>
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#run-wizard-startup')?.addEventListener('change', (e) => {
			const target = e.target as HTMLInputElement;
			this.updateState({ runWizardOnStartup: target.checked });
		});
		
		container.querySelector('#site-url')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedSiteInfo: {
					...currentState.selectedSiteInfo,
					site: (e.target as HTMLInputElement).value
				}
			});
		});
		container.querySelector('#site-title')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedSiteInfo: {
					...currentState.selectedSiteInfo,
					title: (e.target as HTMLInputElement).value
				}
			});
		});
		container.querySelector('#site-description')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedSiteInfo: {
					...currentState.selectedSiteInfo,
					description: (e.target as HTMLInputElement).value
				}
			});
		});
		container.querySelector('#site-author')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedSiteInfo: {
					...currentState.selectedSiteInfo,
					author: (e.target as HTMLInputElement).value
				}
			});
		});
		container.querySelector('#site-language')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedSiteInfo: {
					...currentState.selectedSiteInfo,
					language: (e.target as HTMLInputElement).value
				}
			});
		});
	}
}
