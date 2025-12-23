import { BaseWizardStep } from './BaseWizardStep';

export class WelcomeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const welcomeContent = container.createDiv('welcome-content');
		// False positive: "Astro Modular" is a proper noun (theme name)
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		welcomeContent.createEl('h2', { text: 'Welcome to Astro Modular!' });
		// False positive: "Astro Modular" is a proper noun (theme name)
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		welcomeContent.createEl('p', { text: 'This wizard will help you set up your Astro Modular theme with the perfect configuration for your needs.' });
		
		const checkboxOption = welcomeContent.createDiv('checkbox-option');
		const checkbox = checkboxOption.createEl('input', { type: 'checkbox' });
		checkbox.id = 'run-wizard-startup';
		if (state.runWizardOnStartup) {
			checkbox.setAttribute('checked', 'checked');
		}
		const label = checkboxOption.createEl('label', { text: 'Run this wizard on startup' });
		label.setAttribute('for', 'run-wizard-startup');
		
		const siteInfoForm = welcomeContent.createDiv('site-info-form');
		siteInfoForm.createEl('h3', { text: 'Site information' });
		
		const urlGroup = siteInfoForm.createDiv('form-group');
		const urlLabel = urlGroup.createEl('label', { text: 'URL' });
		urlLabel.setAttribute('for', 'site-url');
		const urlInput = urlGroup.createEl('input', { type: 'text' });
		urlInput.id = 'site-url';
		urlInput.placeholder = 'https://astro-modular.netlify.app';
		urlInput.setAttribute('value', state.selectedSiteInfo.site);
		
		const titleGroup = siteInfoForm.createDiv('form-group');
		const titleLabel = titleGroup.createEl('label', { text: 'Title' });
		titleLabel.setAttribute('for', 'site-title');
		const titleInput = titleGroup.createEl('input', { type: 'text' });
		titleInput.id = 'site-title';
		// False positive: "Astro Modular" is a proper noun (theme name) - placeholder value
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		titleInput.placeholder = 'Astro Modular';
		titleInput.setAttribute('value', state.selectedSiteInfo.title);
		
		const descGroup = siteInfoForm.createDiv('form-group');
		const descLabel = descGroup.createEl('label', { text: 'Description' });
		descLabel.setAttribute('for', 'site-description');
		const descInput = descGroup.createEl('input', { type: 'text' });
		descInput.id = 'site-description';
		descInput.placeholder = 'A flexible blog theme designed for Obsidian users.';
		descInput.setAttribute('value', state.selectedSiteInfo.description);
		
		const authorGroup = siteInfoForm.createDiv('form-group');
		const authorLabel = authorGroup.createEl('label', { text: 'Author name' });
		authorLabel.setAttribute('for', 'site-author');
		const authorInput = authorGroup.createEl('input', { type: 'text' });
		authorInput.id = 'site-author';
		// False positive: "David V. Kimball" is a proper noun (person's name) - placeholder value
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		authorInput.placeholder = 'David V. Kimball';
		authorInput.setAttribute('value', state.selectedSiteInfo.author);
		
		const langGroup = siteInfoForm.createDiv('form-group');
		const langLabel = langGroup.createEl('label', { text: 'Language' });
		langLabel.setAttribute('for', 'site-language');
		const langInput = langGroup.createEl('input', { type: 'text' });
		langInput.id = 'site-language';
		// eslint-disable-next-line obsidianmd/ui/sentence-case -- Language code should remain lowercase
		langInput.placeholder = 'en';
		langInput.setAttribute('value', state.selectedSiteInfo.language);

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
