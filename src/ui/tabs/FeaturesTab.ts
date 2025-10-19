import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class FeaturesTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Feature Configuration' });
		const description = settingsSection.createEl('p', { text: 'Enable or disable specific features for your site. Changes are applied to your config.ts file immediately when you toggle them.' });

		// Optional content types toggles (at the top)
		new Setting(container)
			.setName('Enable Projects')
			.setDesc('Enable projects as a unique content type for showcasing work and portfolios')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes.projects)
				.onChange(async (value) => {
					settings.optionalContentTypes.projects = value;
					await this.plugin.saveData(settings);
					// Apply changes to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Projects ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply projects setting to config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		new Setting(container)
			.setName('Enable Docs')
			.setDesc('Enable docs as a unique content type for documentation and knowledge base')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes.docs)
				.onChange(async (value) => {
					settings.optionalContentTypes.docs = value;
					await this.plugin.saveData(settings);
					// Apply changes to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Docs ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply docs setting to config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Feature toggles
		const features = [
			{ key: 'commandPalette', name: 'Command palette', desc: 'Add a command palette to your site' },
			{ key: 'tableOfContents', name: 'Table of contents', desc: 'Show table of contents on posts' },
			{ key: 'readingTime', name: 'Reading time', desc: 'Display estimated reading time' },
			{ key: 'linkedMentions', name: 'Linked mentions', desc: 'Show linked mentions and backlinks' },
			{ key: 'graphView', name: 'Graph view', desc: 'Show graph view of post connections' },
			{ key: 'postNavigation', name: 'Post navigation', desc: 'Show next/previous post navigation' },
			{ key: 'scrollToTop', name: 'Scroll to top', desc: 'Show scroll to top button' },
			{ key: 'showSocialIconsInFooter', name: 'Social icons in footer', desc: 'Show social icons in footer' },
			{ key: 'profilePicture', name: 'Profile picture', desc: 'Show profile picture in header' },
			{ key: 'comments', name: 'Comments', desc: 'Enable comment system' }
		];

		features.forEach(feature => {
			const settings = this.getSettings();
			const featureKey = feature.key as keyof typeof settings.features;
			const currentValue = settings.features[featureKey];
			const boolValue = typeof currentValue === 'boolean' ? currentValue : false;
			
			// Special handling for profile picture and comments
			if (feature.key === 'profilePicture') {
				this.renderProfilePictureSetting(container, settings);
			} else if (feature.key === 'comments') {
				this.renderCommentsSetting(container, settings);
			} else {
				new Setting(container)
					.setName(feature.name)
					.setDesc(feature.desc)
					.addToggle(toggle => toggle
						.setValue(boolValue)
						.onChange(async (value) => {
							(settings.features as any)[featureKey] = value;
							await this.plugin.saveData(settings);
							
							// Apply changes immediately to config.ts
							try {
								await this.applyCurrentConfiguration();
								new Notice(`${feature.name} ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
							} catch (error) {
								new Notice(`Failed to apply ${feature.name} to config.ts: ${error instanceof Error ? error.message : String(error)}`);
							}
						}));
			}
		});

		// Note about immediate application
		const noteSection = container.createDiv('settings-section');
		noteSection.createEl('p', { 
			text: 'All changes are applied to your config.ts file immediately when you toggle features.',
			cls: 'setting-item-description'
		});
	}

	private renderProfilePictureSetting(container: HTMLElement, settings: any): void {
		const isEnabled = settings.features.profilePicture;
		const profileSettings = settings.optionalFeatures.profilePicture;

		// Main toggle
		const profileSetting = new Setting(container)
			.setName('Profile picture')
			.setDesc('Show profile picture in header or footer')
			.addToggle(toggle => toggle
				.setValue(isEnabled)
				.onChange(async (value) => {
					settings.features.profilePicture = value;
					settings.optionalFeatures.profilePicture.enabled = value;
					await this.plugin.saveData(settings);
					
					// Show/hide the detailed options
					const optionsDiv = container.querySelector('.profile-picture-options') as HTMLElement;
					if (optionsDiv) {
						optionsDiv.style.display = value ? 'block' : 'none';
					}
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Profile picture ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply profile picture to config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Detailed options container
		const optionsContainer = container.createDiv('profile-picture-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.style.marginTop = '10px';
		optionsContainer.style.paddingLeft = '20px';
		optionsContainer.style.borderLeft = '2px solid var(--background-modifier-border)';

		// Create two-column grid for options
		const optionsGrid = optionsContainer.createDiv('options-grid');
		optionsGrid.style.display = 'grid';
		optionsGrid.style.gridTemplateColumns = '1fr 1fr';
		optionsGrid.style.gap = '10px';
		optionsGrid.style.marginTop = '10px';

		// Image path setting
		new Setting(optionsGrid)
			.setName('Image path')
			.setDesc('Path to the profile picture image')
			.addText(text => text
				.setValue(profileSettings.image)
				.setPlaceholder('/profile.jpg')
				.onChange(async (value) => {
					profileSettings.image = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Alt text setting
		new Setting(optionsGrid)
			.setName('Alt text')
			.setDesc('Alternative text for the profile picture')
			.addText(text => text
				.setValue(profileSettings.alt)
				.setPlaceholder('Profile picture')
				.onChange(async (value) => {
					profileSettings.alt = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Size setting
		new Setting(optionsGrid)
			.setName('Size')
			.setDesc('Size of the profile picture')
			.addDropdown(dropdown => dropdown
				.addOption('sm', 'Small')
				.addOption('md', 'Medium')
				.addOption('lg', 'Large')
				.setValue(profileSettings.size)
				.onChange(async (value) => {
					profileSettings.size = value as 'sm' | 'md' | 'lg';
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// URL setting
		new Setting(optionsGrid)
			.setName('URL (optional)')
			.setDesc('Optional URL to link the profile picture to')
			.addText(text => text
				.setValue(profileSettings.url || '')
				.setPlaceholder('https://example.com')
				.onChange(async (value) => {
					profileSettings.url = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Placement setting
		new Setting(optionsGrid)
			.setName('Placement')
			.setDesc('Where to show the profile picture')
			.addDropdown(dropdown => dropdown
				.addOption('footer', 'Footer')
				.addOption('header', 'Header')
				.setValue(profileSettings.placement)
				.onChange(async (value) => {
					profileSettings.placement = value as 'footer' | 'header';
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Style setting
		new Setting(optionsGrid)
			.setName('Style')
			.setDesc('Visual style of the profile picture')
			.addDropdown(dropdown => dropdown
				.addOption('circle', 'Circle')
				.addOption('square', 'Square')
				.addOption('none', 'None')
				.setValue(profileSettings.style)
				.onChange(async (value) => {
					profileSettings.style = value as 'circle' | 'square' | 'none';
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));
	}

	private renderCommentsSetting(container: HTMLElement, settings: any): void {
		const isEnabled = settings.features.comments;
		const commentsSettings = settings.optionalFeatures.comments || {
			enabled: false,
			provider: 'giscus',
			repo: 'davidvkimball/astro-modular',
			repoId: 'R_kgDOPllfKw',
			category: 'General',
			categoryId: 'DIC_kwDOPllfK84CvUpx',
			mapping: 'pathname',
			strict: '0',
			reactions: '1',
			metadata: '0',
			inputPosition: 'bottom',
			theme: 'preferred_color_scheme',
			lang: 'en',
			loading: 'lazy',
		};

		// Main toggle
		const commentsSetting = new Setting(container)
			.setName('Comments')
			.setDesc('Enable Giscus comment system for posts')
			.addToggle(toggle => toggle
				.setValue(isEnabled)
				.onChange(async (value) => {
					settings.features.comments = value;
					settings.optionalFeatures.comments.enabled = value;
					await this.plugin.saveData(settings);
					
					// Show/hide the detailed options
					const optionsDiv = container.querySelector('.comments-options') as HTMLElement;
					if (optionsDiv) {
						optionsDiv.style.display = value ? 'block' : 'none';
					}
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Comments system ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply comments system to config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Detailed options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.style.marginTop = '10px';
		optionsContainer.style.paddingLeft = '20px';
		optionsContainer.style.borderLeft = '2px solid var(--background-modifier-border)';

		// Add Giscus setup link
		const giscusLink = optionsContainer.createDiv('giscus-setup-link');
		giscusLink.style.marginBottom = '15px';
		giscusLink.style.padding = '10px';
		giscusLink.style.background = 'var(--background-modifier-border)';
		giscusLink.style.borderRadius = '4px';
		giscusLink.style.borderLeft = '3px solid var(--interactive-accent)';
		
		const linkText = giscusLink.createEl('p', { text: 'Need help setting up Giscus? ' });
		linkText.style.margin = '0';
		linkText.style.fontSize = '13px';
		linkText.style.color = 'var(--text-muted)';
		
		const link = linkText.createEl('a', { 
			text: 'Visit giscus.app →',
			href: 'https://giscus.app/',
			attr: { target: '_blank', rel: 'noopener noreferrer' }
		});
		link.style.color = 'var(--interactive-accent)';
		link.style.textDecoration = 'none';
		link.addEventListener('mouseenter', () => {
			link.style.textDecoration = 'underline';
		});
		link.addEventListener('mouseleave', () => {
			link.style.textDecoration = 'none';
		});

		// Create two-column grid for options
		const optionsGrid = optionsContainer.createDiv('options-grid');
		optionsGrid.style.display = 'grid';
		optionsGrid.style.gridTemplateColumns = '1fr 1fr';
		optionsGrid.style.gap = '10px';
		optionsGrid.style.marginTop = '10px';

		// Repository setting
		new Setting(optionsGrid)
			.setName('Repository')
			.setDesc('GitHub repository for comments (username/repo)')
			.addText(text => text
				.setValue(commentsSettings.repo)
				.setPlaceholder('username/repo')
				.onChange(async (value) => {
					commentsSettings.repo = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Repository ID setting
		new Setting(optionsGrid)
			.setName('Repository ID')
			.setDesc('GitHub repository ID for Giscus')
			.addText(text => text
				.setValue(commentsSettings.repoId)
				.setPlaceholder('R_kgDOPllfKw')
				.onChange(async (value) => {
					commentsSettings.repoId = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Category setting
		new Setting(optionsGrid)
			.setName('Category')
			.setDesc('Discussion category name')
			.addText(text => text
				.setValue(commentsSettings.category)
				.setPlaceholder('General')
				.onChange(async (value) => {
					commentsSettings.category = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Category ID setting
		new Setting(optionsGrid)
			.setName('Category ID')
			.setDesc('Discussion category ID for Giscus')
			.addText(text => text
				.setValue(commentsSettings.categoryId)
				.setPlaceholder('DIC_kwDOPllfK84CvUpx')
				.onChange(async (value) => {
					commentsSettings.categoryId = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Mapping setting
		new Setting(optionsGrid)
			.setName('Mapping')
			.setDesc('How to map discussions to pages')
			.addDropdown(dropdown => dropdown
				.addOption('pathname', 'Pathname')
				.addOption('url', 'URL')
				.addOption('title', 'Title')
				.addOption('og:title', 'OG Title')
				.setValue(commentsSettings.mapping)
				.onChange(async (value) => {
					commentsSettings.mapping = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Strict setting
		new Setting(optionsGrid)
			.setName('Strict')
			.setDesc('Only match discussions with the same category')
			.addDropdown(dropdown => dropdown
				.addOption('0', 'No')
				.addOption('1', 'Yes')
				.setValue(commentsSettings.strict)
				.onChange(async (value) => {
					commentsSettings.strict = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Reactions setting
		new Setting(optionsGrid)
			.setName('Reactions')
			.setDesc('Enable reaction buttons')
			.addDropdown(dropdown => dropdown
				.addOption('0', 'Disabled')
				.addOption('1', 'Enabled')
				.setValue(commentsSettings.reactions)
				.onChange(async (value) => {
					commentsSettings.reactions = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Metadata setting
		new Setting(optionsGrid)
			.setName('Metadata')
			.setDesc('Show metadata in comments')
			.addDropdown(dropdown => dropdown
				.addOption('0', 'Disabled')
				.addOption('1', 'Enabled')
				.setValue(commentsSettings.metadata)
				.onChange(async (value) => {
					commentsSettings.metadata = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Input Position setting
		new Setting(optionsGrid)
			.setName('Input Position')
			.setDesc('Where to place the comment input')
			.addDropdown(dropdown => dropdown
				.addOption('top', 'Top')
				.addOption('bottom', 'Bottom')
				.setValue(commentsSettings.inputPosition)
				.onChange(async (value) => {
					commentsSettings.inputPosition = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Theme setting
		new Setting(optionsGrid)
			.setName('Theme')
			.setDesc('Comments theme')
			.addDropdown(dropdown => dropdown
				.addOption('light', 'Light')
				.addOption('dark', 'Dark')
				.addOption('preferred_color_scheme', 'Auto')
				.setValue(commentsSettings.theme)
				.onChange(async (value) => {
					commentsSettings.theme = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Language setting
		new Setting(optionsGrid)
			.setName('Language')
			.setDesc('Comments interface language')
			.addDropdown(dropdown => dropdown
				.addOption('en', 'English')
				.addOption('es', 'Spanish')
				.addOption('fr', 'French')
				.addOption('de', 'German')
				.addOption('ja', 'Japanese')
				.addOption('ko', 'Korean')
				.addOption('zh-CN', 'Chinese (Simplified)')
				.addOption('zh-TW', 'Chinese (Traditional)')
				.setValue(commentsSettings.lang)
				.onChange(async (value) => {
					commentsSettings.lang = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Loading setting
		new Setting(optionsGrid)
			.setName('Loading')
			.setDesc('When to load comments')
			.addDropdown(dropdown => dropdown
				.addOption('lazy', 'Lazy')
				.addOption('eager', 'Eager')
				.setValue(commentsSettings.loading)
				.onChange(async (value) => {
					commentsSettings.loading = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));
	}
}