import { BaseWizardStep } from './BaseWizardStep';
import { Setting, ToggleComponent, TextComponent, DropdownComponent } from 'obsidian';
import { WizardState } from './WizardState';
import { ProfilePictureSettings, CommentsSettings } from '../../types';

export class OptionalFeaturesStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const featuresSelection = container.createDiv('features-selection');
		featuresSelection.createEl('h2', { text: 'Optional features' });
		featuresSelection.createEl('p', { text: 'Enable or disable specific features for your site.' });

		// Create the features list container
		const featuresList = featuresSelection.createDiv('features-list');
		
		// Render profile picture feature using native components
		this.renderProfilePictureFeatureNative(featuresList, state);
		
		// Render comments feature using native components  
		this.renderCommentsFeatureNative(featuresList, state);
	}

	private renderProfilePictureFeatureNative(container: HTMLElement, state: WizardState): void {
		const isEnabled = state.selectedOptionalFeatures?.profilePicture?.enabled || false;
		const profileSettings = state.selectedOptionalFeatures?.profilePicture || {
			enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md',
			url: '', placement: 'footer', style: 'circle'
		};

		// Main toggle
		new Setting(container)
			.setName('Profile picture')
			.setDesc('Show profile picture in header or footer')
			.addToggle((toggle: ToggleComponent) => toggle
				.setValue(isEnabled)
				.onChange((value: boolean) => {
					// Get fresh state to avoid stale closure issues
					const currentState = this.getState();
					this.updateState({
						selectedFeatures: { ...currentState.selectedFeatures, profilePicture: value },
						selectedOptionalFeatures: {
							...currentState.selectedOptionalFeatures,
							profilePicture: { ...currentState.selectedOptionalFeatures?.profilePicture, enabled: value }
						}
					});
					// Show/hide options
					const optionsDiv = container.querySelector('.profile-picture-options') as HTMLElement;
					if (optionsDiv) optionsDiv.setCssProps({ display: value ? 'block' : 'none' });
				}));

		// Options container
		const optionsContainer = container.createDiv('profile-picture-options');
		optionsContainer.setCssProps({ display: isEnabled ? 'block' : 'none' });
		optionsContainer.className = 'profile-picture-options';

		// Helper function to create settings
		const createSetting = (name: keyof ProfilePictureSettings, desc: string, type: 'text' | 'dropdown', options?: Array<{value: string, label: string}>) => {
			const setting = new Setting(optionsContainer).setName(name).setDesc(desc);
			if (type === 'text') {
				setting.addText((text: TextComponent) => text
					.setValue(String(profileSettings[name] ?? ''))
					.setPlaceholder(options?.[0]?.value || '')
					.onChange((value: string) => {
						void this.updateProfileSetting(name, value, state);
					})); 
			} else {
				setting.addDropdown((dropdown: DropdownComponent) => {
					if (options) {
						for (const opt of options) {
							dropdown.addOption(opt.value, opt.label);
						}
					}
					dropdown.setValue(String(profileSettings[name] ?? ''))
						.onChange((value: string) => {
							void this.updateProfileSetting(name, value, state);
						});
				});
			}
		};

		// Create all settings
		createSetting('image', 'Image path', 'text', [{value: '/profile.jpg', label: '/profile.jpg'}]);
		createSetting('alt', 'Alt text', 'text', [{value: 'Profile picture', label: 'Profile picture'}]);
		createSetting('size', 'Size', 'dropdown', [
			{value: 'sm', label: 'Small'}, {value: 'md', label: 'Medium'}, {value: 'lg', label: 'Large'}
		]);
		createSetting('url', 'URL (optional)', 'text', [{value: 'https://example.com', label: 'https://example.com'}]);
		createSetting('placement', 'Placement', 'dropdown', [
			{value: 'footer', label: 'Footer'}, {value: 'header', label: 'Header'}
		]);
		createSetting('style', 'Style', 'dropdown', [
			{value: 'circle', label: 'Circle'}, {value: 'square', label: 'Square'}, {value: 'none', label: 'None'}
		]);
	}

	private updateProfileSetting(key: keyof ProfilePictureSettings, value: string, state: WizardState): void {
		// Get fresh state to avoid stale closure issues
		const currentState = this.getState();
		this.updateState({
			selectedOptionalFeatures: {
				...currentState.selectedOptionalFeatures,
				profilePicture: { ...currentState.selectedOptionalFeatures?.profilePicture, [key]: value }
			}
		});
	}

	private renderCommentsFeatureNative(container: HTMLElement, state: WizardState): void {
		const isEnabled = state.selectedOptionalFeatures?.comments?.enabled || false;
		const commentsSettings = state.selectedOptionalFeatures?.comments || {
			enabled: false, provider: 'giscus', rawScript: '',
			repo: 'davidvkimball/astro-modular', repoId: 'R_kgDOPllfKw', 
			category: 'General', categoryId: 'DIC_kwDOPllfK84CvUpx',
			mapping: 'pathname', strict: '0', reactions: '1', metadata: '0',
			inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy'
		};


		// Main toggle
		new Setting(container)
			.setName('Comments')
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- "Giscus" is a proper noun
			.setDesc('Enable Giscus comment system for posts')
			.addToggle((toggle: ToggleComponent) => {
				toggle.setValue(isEnabled)
					.onChange((value: boolean) => {
						// Get fresh state to avoid stale closure issues
						const currentState = this.getState();
						this.updateState({
							selectedFeatures: { ...currentState.selectedFeatures, comments: value },
							selectedOptionalFeatures: {
								...currentState.selectedOptionalFeatures,
								comments: { ...currentState.selectedOptionalFeatures?.comments, enabled: value }
							}
						});
						const optionsDiv = container.querySelector('.comments-options') as HTMLElement;
						if (optionsDiv) optionsDiv.setCssProps({ display: value ? 'block' : 'none' });
					});
			});

		// Options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.setCssProps({ display: isEnabled ? 'block' : 'none' });
		optionsContainer.className = 'comments-options';

		// Instructions
		const instructionsDiv = optionsContainer.createDiv('comments-instructions');
		instructionsDiv.setCssProps({
			marginBottom: '15px',
			padding: '10px',
			background: 'var(--background-modifier-border)',
			borderRadius: '4px',
			borderLeft: '3px solid var(--interactive-accent)'
		});
		
		const instructionsText = instructionsDiv.createEl('p');
		instructionsText.setCssProps({
			margin: '0',
			fontSize: '13px',
			color: 'var(--text-muted)',
			whiteSpace: 'pre-line'
		});
		
		// Create the text with proper link placement
		instructionsText.appendText('1. Go to ');
		const giscusLink = instructionsText.createEl('a', {
			href: 'https://giscus.app/',
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- URL should remain lowercase
			text: 'giscus.app',
			attr: {
				target: '_blank',
				rel: 'noopener noreferrer'
			}
		});
		giscusLink.setCssProps({
			color: 'var(--interactive-accent)',
			textDecoration: 'none'
		});
		instructionsText.appendText(' and configure your comments\n2. Copy the generated script\n3. Paste it below');
		
		// Add hover effects to the link
		giscusLink.addEventListener('mouseenter', () => {
			giscusLink.setCssProps({ textDecoration: 'underline' });
		});
		giscusLink.addEventListener('mouseleave', () => {
			giscusLink.setCssProps({ textDecoration: 'none' });
		});

		// Script textarea
		const scriptSetting = new Setting(optionsContainer)
			.setName('Giscus script')
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- "Giscus" is a proper noun
			.setDesc('Paste your Giscus script here (the plugin will automatically parse all settings)');
		
		const textarea = scriptSetting.controlEl.createEl('textarea', {
			attr: {
				placeholder: `<script src="https://giscus.app/client.js"
        data-repo="davidvkimball/astro-modular"
        data-repo-id="R_kgDOPllfKw"
        data-category="General"
        data-category-id="DIC_kwDOPllfK84CvUpx"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>`,
				rows: '8'
			}
		});
		
		textarea.setCssProps({
			width: '100%',
			fontFamily: 'var(--font-monospace)',
			fontSize: '12px',
			padding: '8px',
			border: '1px solid var(--background-modifier-border)',
			borderRadius: '4px',
			background: 'var(--background-primary)',
			color: 'var(--text-normal)',
			resize: 'none'
		});
		
		// Set current value
		textarea.value = commentsSettings.rawScript || '';
		
		// Validation and parsing
		const validationDiv = optionsContainer.createDiv('script-validation');
		validationDiv.setCssProps({
			marginTop: '8px',
			fontSize: '12px'
		});
		
		const updateValidation = async () => {
			const scriptContent = textarea.value.trim();
			
			if (!scriptContent) {
				validationDiv.empty();
				// Clear all comment settings when script is deleted, but preserve enabled state
				const currentState = this.getState();
				const currentEnabled = currentState.selectedOptionalFeatures?.comments?.enabled ?? false;
				this.updateState({
					selectedOptionalFeatures: {
						...currentState.selectedOptionalFeatures,
						comments: {
							...currentState.selectedOptionalFeatures?.comments,
							rawScript: '',
							repo: '',
							repoId: '',
							category: '',
							categoryId: '',
							mapping: '',
							strict: '',
							reactions: '',
							metadata: '',
							inputPosition: '',
							theme: '',
							lang: '',
							loading: '',
							enabled: currentEnabled // Preserve enabled state
						}
					}
				});
				return;
			}
			
			// Import the parser dynamically
			const { GiscusScriptParser } = await import('../../utils/GiscusScriptParser');
			const validation = GiscusScriptParser.validateScript(scriptContent);
			
			if (validation.valid) {
				validationDiv.empty();
				// False positive: "Giscus" is a proper noun (service name)
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				const successSpan = validationDiv.createEl('span', { text: '✓ Valid Giscus script detected' });
				successSpan.setCssProps({ color: 'var(--text-success)' });
				
				// Parse and update script settings without forcing comments to be enabled
				const parsed = GiscusScriptParser.parseScript(scriptContent);
				if (parsed) {
					// Get the current enabled state to preserve it
					const currentState = this.getState();
					const currentEnabled = currentState.selectedOptionalFeatures?.comments?.enabled ?? false;
					
					// Update script data but preserve the current enabled state
					this.updateState({
						selectedOptionalFeatures: {
							...currentState.selectedOptionalFeatures,
							comments: { 
								...currentState.selectedOptionalFeatures?.comments, 
								rawScript: scriptContent,
								repo: parsed.repo,
								repoId: parsed.repoId,
								category: parsed.category,
								categoryId: parsed.categoryId,
								mapping: parsed.mapping,
								strict: parsed.strict,
								reactions: parsed.reactions,
								metadata: parsed.metadata,
								inputPosition: parsed.inputPosition,
								theme: parsed.theme,
								lang: parsed.lang,
								loading: parsed.loading,
								enabled: currentEnabled // Preserve enabled state
							}
						}
					});
					
					// Don't force the toggle - let the user decide whether to enable comments
					// The toggle should reflect the current state, not be forced to true
				}
			} else {
				validationDiv.empty();
				const errorSpan = validationDiv.createEl('span', { text: `✗ ${validation.error}` });
				errorSpan.setCssProps({ color: 'var(--text-error)' });
			}
		};
		
		textarea.addEventListener('input', () => {
			void updateValidation();
		});
		
		// Initial validation
		void updateValidation();
	}

	private updateCommentSetting(key: keyof CommentsSettings, value: string, state: WizardState): void {
		// Get fresh state to avoid stale closure issues
		const currentState = this.getState();
		this.updateState({
			selectedOptionalFeatures: {
				...currentState.selectedOptionalFeatures,
				comments: { ...currentState.selectedOptionalFeatures?.comments, [key]: value }
			}
		});
	}
}