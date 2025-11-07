import { BaseWizardStep } from './BaseWizardStep';
import { Setting, ToggleComponent, TextComponent, DropdownComponent } from 'obsidian';

export class OptionalFeaturesStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="features-selection">
				<h2>Optional features</h2>
				<p>Enable or disable specific features for your site.</p>
			</div>
		`;

		// Create the features list container
		const featuresList = container.querySelector('.features-selection')!.createDiv('features-list');
		
		// Render profile picture feature using native components
		this.renderProfilePictureFeatureNative(featuresList, state);
		
		// Render comments feature using native components  
		this.renderCommentsFeatureNative(featuresList, state);
	}

	private renderProfilePictureFeatureNative(container: HTMLElement, state: any): void {
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
					if (optionsDiv) optionsDiv.style.display = value ? 'block' : 'none';
				}));

		// Options container
		const optionsContainer = container.createDiv('profile-picture-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.className = 'profile-picture-options';

		// Helper function to create settings
		const createSetting = (name: string, desc: string, type: 'text' | 'dropdown', options?: Array<{value: string, label: string}>) => {
			const setting = new Setting(optionsContainer).setName(name).setDesc(desc);
			if (type === 'text') {
				setting.addText((text: TextComponent) => text
					.setValue(profileSettings[name] || '')
					.setPlaceholder(options?.[0]?.value || '')
					.onChange((value: string) => this.updateProfileSetting(name, value, state)));
			} else {
				setting.addDropdown((dropdown: DropdownComponent) => {
					options?.forEach(opt => dropdown.addOption(opt.value, opt.label));
					dropdown.setValue(profileSettings[name])
						.onChange((value: string) => this.updateProfileSetting(name, value, state));
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

	private updateProfileSetting(key: string, value: any, state: any): void {
		// Get fresh state to avoid stale closure issues
		const currentState = this.getState();
		this.updateState({
			selectedOptionalFeatures: {
				...currentState.selectedOptionalFeatures,
				profilePicture: { ...currentState.selectedOptionalFeatures?.profilePicture, [key]: value }
			}
		});
	}

	private renderCommentsFeatureNative(container: HTMLElement, state: any): void {
		const isEnabled = state.selectedOptionalFeatures?.comments?.enabled || false;
		const commentsSettings = state.selectedOptionalFeatures?.comments || {
			enabled: false, provider: 'giscus', rawScript: '',
			repo: 'davidvkimball/astro-modular', repoId: 'R_kgDOPllfKw', 
			category: 'General', categoryId: 'DIC_kwDOPllfK84CvUpx',
			mapping: 'pathname', strict: '0', reactions: '1', metadata: '0',
			inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy'
		};

		// Store reference to toggle for later updates
		let commentsToggle: ToggleComponent;

		// Main toggle
		new Setting(container)
			.setName('Comments')
			.setDesc('Enable Giscus comment system for posts')
			.addToggle((toggle: ToggleComponent) => {
				commentsToggle = toggle;
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
						if (optionsDiv) optionsDiv.style.display = value ? 'block' : 'none';
					});
			});

		// Options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.className = 'comments-options';

		// Instructions
		const instructionsDiv = optionsContainer.createDiv('comments-instructions');
		instructionsDiv.style.marginBottom = '15px';
		instructionsDiv.style.padding = '10px';
		instructionsDiv.style.background = 'var(--background-modifier-border)';
		instructionsDiv.style.borderRadius = '4px';
		instructionsDiv.style.borderLeft = '3px solid var(--interactive-accent)';
		
		const instructionsText = instructionsDiv.createEl('p');
		instructionsText.style.margin = '0';
		instructionsText.style.fontSize = '13px';
		instructionsText.style.color = 'var(--text-muted)';
		instructionsText.style.whiteSpace = 'pre-line';
		
		// Create the text with proper link placement
		instructionsText.innerHTML = '1. Go to <a href="https://giscus.app/" target="_blank" rel="noopener noreferrer" style="color: var(--interactive-accent); text-decoration: none;">giscus.app</a> and configure your comments\n2. Copy the generated script\n3. Paste it below';
		
		// Add hover effects to the link
		const giscusLink = instructionsText.querySelector('a');
		if (giscusLink) {
			giscusLink.addEventListener('mouseenter', () => {
				giscusLink.style.textDecoration = 'underline';
			});
			giscusLink.addEventListener('mouseleave', () => {
				giscusLink.style.textDecoration = 'none';
			});
		}

		// Script textarea
		const scriptSetting = new Setting(optionsContainer)
			.setName('Giscus Script')
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
		
		textarea.style.width = '100%';
		textarea.style.fontFamily = 'var(--font-monospace)';
		textarea.style.fontSize = '12px';
		textarea.style.padding = '8px';
		textarea.style.border = '1px solid var(--background-modifier-border)';
		textarea.style.borderRadius = '4px';
		textarea.style.background = 'var(--background-primary)';
		textarea.style.color = 'var(--text-normal)';
		textarea.style.resize = 'none';
		
		// Set current value
		textarea.value = commentsSettings.rawScript || '';
		
		// Validation and parsing
		const validationDiv = optionsContainer.createDiv('script-validation');
		validationDiv.style.marginTop = '8px';
		validationDiv.style.fontSize = '12px';
		
		const updateValidation = async () => {
			const scriptContent = textarea.value.trim();
			
			if (!scriptContent) {
				validationDiv.innerHTML = '';
				// Clear all comment settings when script is deleted
				const currentState = this.getState();
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
							loading: ''
						}
					}
				});
				return;
			}
			
			// Import the parser dynamically
			const { GiscusScriptParser } = await import('../../utils/GiscusScriptParser');
			const validation = GiscusScriptParser.validateScript(scriptContent);
			
			if (validation.valid) {
				validationDiv.innerHTML = '<span style="color: var(--text-success)">✓ Valid Giscus script detected</span>';
				
				// Parse and update script settings without forcing comments to be enabled
				const parsed = GiscusScriptParser.parseScript(scriptContent);
				if (parsed) {
					// Update script data but preserve the current enabled state
					this.updateState({
						selectedOptionalFeatures: {
							...state.selectedOptionalFeatures,
							comments: { 
								...state.selectedOptionalFeatures?.comments, 
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
								loading: parsed.loading
							}
						}
					});
					
					// Don't force the toggle - let the user decide whether to enable comments
					// The toggle should reflect the current state, not be forced to true
				}
			} else {
				validationDiv.innerHTML = `<span style="color: var(--text-error)">✗ ${validation.error}</span>`;
			}
		};
		
		textarea.addEventListener('input', updateValidation);
		
		// Initial validation
		updateValidation();
	}

	private updateCommentSetting(key: string, value: any, state: any): void {
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