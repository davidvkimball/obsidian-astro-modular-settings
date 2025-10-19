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
					this.updateState({
						selectedFeatures: { ...state.selectedFeatures, profilePicture: value },
						selectedOptionalFeatures: {
							...state.selectedOptionalFeatures,
							profilePicture: { ...state.selectedOptionalFeatures?.profilePicture, enabled: value }
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
		this.updateState({
			selectedOptionalFeatures: {
				...state.selectedOptionalFeatures,
				profilePicture: { ...state.selectedOptionalFeatures?.profilePicture, [key]: value }
			}
		});
	}

	private renderCommentsFeatureNative(container: HTMLElement, state: any): void {
		const isEnabled = state.selectedOptionalFeatures?.comments?.enabled || false;
		const commentsSettings = state.selectedOptionalFeatures?.comments || {
			enabled: false, provider: 'giscus', repo: 'davidvkimball/astro-modular',
			repoId: 'R_kgDOPllfKw', category: 'General', categoryId: 'DIC_kwDOPllfK84CvUpx',
			mapping: 'pathname', strict: '0', reactions: '1', metadata: '0',
			inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy'
		};

		// Main toggle
		new Setting(container)
			.setName('Comments')
			.setDesc('Enable Giscus comment system for posts')
			.addToggle((toggle: ToggleComponent) => toggle
				.setValue(isEnabled)
				.onChange((value: boolean) => {
					this.updateState({
						selectedFeatures: { ...state.selectedFeatures, comments: value },
						selectedOptionalFeatures: {
							...state.selectedOptionalFeatures,
							comments: { ...state.selectedOptionalFeatures?.comments, enabled: value }
						}
					});
					const optionsDiv = container.querySelector('.comments-options') as HTMLElement;
					if (optionsDiv) optionsDiv.style.display = value ? 'block' : 'none';
				}));

		// Options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.className = 'comments-options';

		// Giscus setup link
		const giscusLink = optionsContainer.createDiv('giscus-setup-link');
		const linkText = giscusLink.createEl('p', { text: 'Need help setting up Giscus? ' });
		const link = linkText.createEl('a', { 
			text: 'Visit giscus.app →', href: 'https://giscus.app/',
			attr: { target: '_blank', rel: 'noopener noreferrer' }
		});

		// Helper function for comments settings
		const createCommentSetting = (name: string, desc: string, type: 'text' | 'dropdown', options?: Array<{value: string, label: string}>) => {
			const setting = new Setting(optionsContainer).setName(name).setDesc(desc);
			if (type === 'text') {
				setting.addText((text: TextComponent) => text
					.setValue(commentsSettings[name] || '')
					.setPlaceholder(options?.[0]?.value || '')
					.onChange((value: string) => this.updateCommentSetting(name, value, state)));
			} else {
				setting.addDropdown((dropdown: DropdownComponent) => {
					options?.forEach(opt => dropdown.addOption(opt.value, opt.label));
					dropdown.setValue(commentsSettings[name])
						.onChange((value: string) => this.updateCommentSetting(name, value, state));
				});
			}
		};

		// Create all comment settings
		createCommentSetting('repo', 'Repository', 'text', [{value: 'username/repo', label: 'username/repo'}]);
		createCommentSetting('repoId', 'Repository ID', 'text', [{value: 'R_kgDOPllfKw', label: 'R_kgDOPllfKw'}]);
		createCommentSetting('category', 'Category', 'text', [{value: 'General', label: 'General'}]);
		createCommentSetting('categoryId', 'Category ID', 'text', [{value: 'DIC_kwDOPllfK84CvUpx', label: 'DIC_kwDOPllfK84CvUpx'}]);
		createCommentSetting('mapping', 'Mapping', 'dropdown', [
			{value: 'pathname', label: 'Pathname'}, {value: 'url', label: 'URL'},
			{value: 'title', label: 'Title'}, {value: 'og:title', label: 'OG Title'}
		]);
		createCommentSetting('strict', 'Strict', 'dropdown', [
			{value: '0', label: 'No'}, {value: '1', label: 'Yes'}
		]);
		createCommentSetting('reactions', 'Reactions', 'dropdown', [
			{value: '0', label: 'Disabled'}, {value: '1', label: 'Enabled'}
		]);
		createCommentSetting('metadata', 'Metadata', 'dropdown', [
			{value: '0', label: 'Disabled'}, {value: '1', label: 'Enabled'}
		]);
		createCommentSetting('inputPosition', 'Input Position', 'dropdown', [
			{value: 'top', label: 'Top'}, {value: 'bottom', label: 'Bottom'}
		]);
		createCommentSetting('theme', 'Theme', 'dropdown', [
			{value: 'light', label: 'Light'}, {value: 'dark', label: 'Dark'},
			{value: 'preferred_color_scheme', label: 'Auto'}
		]);
		createCommentSetting('lang', 'Language', 'dropdown', [
			{value: 'en', label: 'English'}, {value: 'es', label: 'Spanish'},
			{value: 'fr', label: 'French'}, {value: 'de', label: 'German'},
			{value: 'ja', label: 'Japanese'}, {value: 'ko', label: 'Korean'},
			{value: 'zh-CN', label: 'Chinese (Simplified)'}, {value: 'zh-TW', label: 'Chinese (Traditional)'}
		]);
		createCommentSetting('loading', 'Loading', 'dropdown', [
			{value: 'lazy', label: 'Lazy'}, {value: 'eager', label: 'Eager'}
		]);
	}

	private updateCommentSetting(key: string, value: any, state: any): void {
		this.updateState({
			selectedOptionalFeatures: {
				...state.selectedOptionalFeatures,
				comments: { ...state.selectedOptionalFeatures?.comments, [key]: value }
			}
		});
	}
}