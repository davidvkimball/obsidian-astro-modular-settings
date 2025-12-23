import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { AstroModularPlugin, AstroModularSettings, ProfilePictureSettings } from '../../types';

export class FeaturesTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// ═══════════════════════════════════════════════════════════════════
		// GLOBAL OPTIONS
		// ═══════════════════════════════════════════════════════════════════
		const globalSection = container.createDiv('settings-section');
		globalSection.setCssProps({ marginTop: '20px' });
		
		// Global Options heading
		new Setting(globalSection)
			.setHeading()
			.setName('Global options');

		// Enable Projects
		new Setting(globalSection)
			.setName('Enable projects')
			.setDesc('Enable projects as a unique content type for showcasing work and portfolios')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes?.projects ?? true)
				.onChange(async (value) => {
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.projects = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Projects ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Enable Docs
		new Setting(globalSection)
			.setName('Enable docs')
			.setDesc('Enable docs as a unique content type for documentation and knowledge base')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes?.docs ?? true)
				.onChange(async (value) => {
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.docs = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Docs ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Table of contents
		new Setting(globalSection)
			.setName('Table of contents')
			.setDesc('Show table of contents on content pages')
			.addToggle(toggle => toggle
				.setValue(settings.tableOfContents?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.tableOfContents) {
						settings.tableOfContents = { enabled: true, depth: 4 };
					}
					settings.tableOfContents.enabled = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Show/hide ToC depth option
					const tocDepth = globalSection.querySelector('.toc-depth-option') as HTMLElement;
					if (tocDepth) {
						tocDepth.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Table of contents ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					void this.plugin.saveData(settings);
					void this.applyCurrentConfiguration();
				}));

		// ToC depth container
		const tocDepthContainer = globalSection.createDiv('toc-depth-option');
		tocDepthContainer.setCssProps({
			display: (settings.tableOfContents?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(tocDepthContainer)
			.setName('Table of contents depth')
			// False positive: "ToC" is an acronym and should remain capitalized
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Maximum heading depth to include in ToC (2=H2, 3=H3, 4=H4, 5=H5, 6=H6)')
			.addText(text => text
				.setPlaceholder('4')
				.setValue(String(settings.tableOfContents?.depth || 4))
				.onChange(async (value) => {
					const num = parseInt(value) || 4;
					const clampedNum = Math.max(2, Math.min(6, num));
					if (!settings.tableOfContents) {
						settings.tableOfContents = { enabled: true, depth: 4 };
					}
					settings.tableOfContents.depth = clampedNum;
					text.setValue(String(clampedNum)); // Update display if clamped
					void this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
					new Notice(`Table of contents depth set to ${clampedNum} and applied to config.ts`);
				}));

		// Footer enabled
		new Setting(globalSection)
			.setName('Footer')
			.setDesc('Enable footer on your site')
			.addToggle(toggle => toggle
				.setValue(settings.footer?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.footer) {
						settings.footer = { enabled: true, content: '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.', showSocialIconsInFooter: true };
					}
					settings.footer.enabled = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Show/hide footer options
					const footerOptions = globalSection.querySelector('.footer-options') as HTMLElement;
					if (footerOptions) {
						footerOptions.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Footer options container
		const footerOptions = globalSection.createDiv('footer-options');
		footerOptions.setCssProps({
			display: (settings.footer?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		// Footer content
		new Setting(footerOptions)
			.setName('Footer content')
			.setDesc('Text to display in footer. Use {author} for site author and {title} for site title')
			.addText(text => text
				.setPlaceholder('© 2025 {author}. Built with the Astro Modular theme.')
				.setValue(settings.footer?.content || '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.')
				.onChange(async (value) => {
					if (!settings.footer) {
						settings.footer = { enabled: true, content: '', showSocialIconsInFooter: true };
					}
					settings.footer.content = value;
					void this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					void this.applyCurrentConfiguration();
				}));

		// Show social icons in footer
		new Setting(footerOptions)
			.setName('Show social icons in footer')
			.setDesc('Display social media icons in the footer')
					.addToggle(toggle => toggle
				.setValue(settings.footer?.showSocialIconsInFooter ?? true)
						.onChange(async (value) => {
					if (!settings.footer) {
						settings.footer = { enabled: true, content: '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.', showSocialIconsInFooter: true };
					}
					settings.footer.showSocialIconsInFooter = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
					new Notice(`Social icons in footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Hide scroll bar
		new Setting(globalSection)
			.setName('Hide scroll bar')
			.setDesc('Hide the browser scroll bar for a cleaner look')
			.addToggle(toggle => toggle
				.setValue(settings.features?.hideScrollBar ?? false)
				.onChange(async (value) => {
					settings.features.hideScrollBar = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
					new Notice(`Hide scroll bar ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Scroll to top
		new Setting(globalSection)
			.setName('Scroll to top')
			.setDesc('Show scroll to top button')
			.addToggle(toggle => toggle
				.setValue(settings.features?.scrollToTop ?? true)
				.onChange(async (value) => {
					settings.features.scrollToTop = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
					new Notice(`Scroll to top ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Feature button
		new Setting(globalSection)
			.setName('Feature button')
			.setDesc('Choose which feature button appears in the header')
			.addDropdown(dropdown => dropdown
				.addOption('mode', 'Dark/light mode toggle')
				.addOption('graph', 'View graph')
				.addOption('theme', 'Change theme')
				.addOption('none', 'None')
				.setValue(settings.features?.featureButton || 'mode')
				.onChange(async (value) => {
					settings.features.featureButton = value as 'mode' | 'graph' | 'theme' | 'none';
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
						new Notice(`Feature button updated to "${value}" and applied to config.ts`);
				}));

		// ═══════════════════════════════════════════════════════════════════
		// COMMAND PALETTE
		// ═══════════════════════════════════════════════════════════════════
		const commandPaletteSection = container.createDiv('settings-section');
		commandPaletteSection.setCssProps({
			marginTop: '30px',
			paddingTop: '20px',
			borderTop: '2px solid var(--background-modifier-border)'
		});
		
		// Command Palette heading
		new Setting(commandPaletteSection)
			.setHeading()
			.setName('Command palette');

		// Enable Command Palette
		new Setting(commandPaletteSection)
			.setName('Enable command palette')
			.setDesc('Add a command palette to your site')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette) {
						settings.commandPalette = {
							enabled: true,
							shortcut: 'ctrl+K',
							placeholder: 'Search posts',
							search: { posts: true, pages: false, projects: false, docs: false },
							sections: { quickActions: true, pages: true, social: true },
							quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true }
						};
					}
					settings.commandPalette.enabled = value;
					settings.features.commandPalette = value;
					void this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Show/hide command palette options
					const cpOptions = commandPaletteSection.querySelector('.command-palette-options') as HTMLElement;
					if (cpOptions) {
						cpOptions.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Command palette ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Command Palette options container
		const cpOptions = commandPaletteSection.createDiv('command-palette-options');
		cpOptions.setCssProps({
			display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		// Shortcut
		this.createTextSetting(
			cpOptions,
			'Shortcut',
			'Keyboard shortcut to open command palette (Ctrl = Cmd on Mac)',
			settings.commandPalette?.shortcut || 'ctrl+K',
			(value) => {
				if (!settings.commandPalette) {
					settings.commandPalette = { enabled: true, shortcut: 'ctrl+K', placeholder: 'Search posts', search: { posts: true, pages: false, projects: false, docs: false }, sections: { quickActions: true, pages: true, social: true }, quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true } };
				}
				settings.commandPalette.shortcut = value;
			}
		);

		// Placeholder
		this.createTextSetting(
			cpOptions,
			'Placeholder',
			'Placeholder text in command palette search box',
			settings.commandPalette?.placeholder || 'Search posts',
			(value) => {
				if (!settings.commandPalette) {
					settings.commandPalette = { enabled: true, shortcut: 'ctrl+K', placeholder: 'Search posts', search: { posts: true, pages: false, projects: false, docs: false }, sections: { quickActions: true, pages: true, social: true }, quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true } };
				}
				settings.commandPalette.placeholder = value;
			}
		);

		// Search toggles
		const searchSection = cpOptions.createDiv();
		searchSection.createEl('h4', { text: 'Search content types' });

		new Setting(searchSection)
			.setName('Search posts')
			.setDesc('Include posts in search results')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.search?.posts ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette) {
						settings.commandPalette = { enabled: true, shortcut: 'ctrl+K', placeholder: 'Search posts', search: { posts: true, pages: false, projects: false, docs: false }, sections: { quickActions: true, pages: true, social: true }, quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true } };
					}
					if (!settings.commandPalette.search) {
						settings.commandPalette.search = { posts: true, pages: false, projects: false, docs: false };
					}
					settings.commandPalette.search.posts = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
				}));

		new Setting(searchSection)
			.setName('Search pages')
			.setDesc('Include pages in search results')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.search?.pages ?? false)
				.onChange(async (value) => {
					if (!settings.commandPalette?.search) {
						settings.commandPalette.search = { posts: true, pages: false, projects: false, docs: false };
					}
				settings.commandPalette.search.pages = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(searchSection)
			.setName('Search projects')
			.setDesc('Include projects in search results')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.search?.projects ?? false)
				.onChange(async (value) => {
					if (!settings.commandPalette?.search) {
						settings.commandPalette.search = { posts: true, pages: false, projects: false, docs: false };
					}
				settings.commandPalette.search.projects = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(searchSection)
			.setName('Search docs')
			.setDesc('Include docs in search results')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.search?.docs ?? false)
				.onChange(async (value) => {
					if (!settings.commandPalette?.search) {
						settings.commandPalette.search = { posts: true, pages: false, projects: false, docs: false };
					}
				settings.commandPalette.search.docs = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
			}));

		// Sections toggles
		const sectionsSection = cpOptions.createDiv();
		sectionsSection.setCssProps({ marginTop: '15px' });
		sectionsSection.createEl('h4', { text: 'Command palette sections' });

		new Setting(sectionsSection)
			.setName('Show quick actions section')
			.setDesc('Display quick actions in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.sections?.quickActions ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.sections) {
						settings.commandPalette.sections = { quickActions: true, pages: true, social: true };
					}
					settings.commandPalette.sections.quickActions = value;
					await this.plugin.saveData(settings);
					
					// Show/hide quick actions options
					const qaOptions = sectionsSection.querySelector('.quick-actions-options') as HTMLElement;
					if (qaOptions) {
						qaOptions.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Quick Actions options container
		const qaOptions = sectionsSection.createDiv('quick-actions-options');
		qaOptions.setCssProps({
			display: (settings.commandPalette?.sections?.quickActions ?? true) ? 'block' : 'none',
			paddingLeft: '20px',
			marginTop: '10px'
		});

		new Setting(qaOptions)
			.setName('Toggle dark/light mode')
			.setDesc('Show mode toggle button in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.quickActions?.toggleMode ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.quickActions) {
						settings.commandPalette.quickActions = { enabled: true, toggleMode: true, graphView: true, changeTheme: true };
					}
				settings.commandPalette.quickActions.toggleMode = value;
				settings.features.quickActions.toggleMode = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(qaOptions)
			.setName('View graph')
			.setDesc('Show graph view button in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.quickActions?.graphView ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.quickActions) {
						settings.commandPalette.quickActions = { enabled: true, toggleMode: true, graphView: true, changeTheme: true };
					}
				settings.commandPalette.quickActions.graphView = value;
				settings.features.quickActions.graphView = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(qaOptions)
			.setName('Change theme')
			.setDesc('Show theme selector button in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.quickActions?.changeTheme ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.quickActions) {
						settings.commandPalette.quickActions = { enabled: true, toggleMode: true, graphView: true, changeTheme: true };
					}
				settings.commandPalette.quickActions.changeTheme = value;
				settings.features.quickActions.changeTheme = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(sectionsSection)
			.setName('Show pages section')
			.setDesc('Display navigation pages in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.sections?.pages ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.sections) {
						settings.commandPalette.sections = { quickActions: true, pages: true, social: true };
					}
				settings.commandPalette.sections.pages = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		new Setting(sectionsSection)
			.setName('Show social section')
			.setDesc('Display social links in command palette')
			.addToggle(toggle => toggle
				.setValue(settings.commandPalette?.sections?.social ?? true)
				.onChange(async (value) => {
					if (!settings.commandPalette?.sections) {
						settings.commandPalette.sections = { quickActions: true, pages: true, social: true };
					}
				settings.commandPalette.sections.social = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// ═══════════════════════════════════════════════════════════════════
		// HOME OPTIONS
		// ═══════════════════════════════════════════════════════════════════
		const homeOptionsSection = container.createDiv('settings-section');
		homeOptionsSection.setCssProps({
			marginTop: '30px',
			paddingTop: '20px',
			borderTop: '2px solid var(--background-modifier-border)'
		});
		
		// Home Options heading
		new Setting(homeOptionsSection)
			.setHeading()
			.setName('Home options');

		// Featured Post
		new Setting(homeOptionsSection)
			.setName('Featured post')
			.setDesc('Show featured post on homepage')
				.addToggle(toggle => toggle
				.setValue(settings.homeOptions?.featuredPost?.enabled ?? true)
					.onChange(async (value) => {
					if (!settings.homeOptions) {
						settings.homeOptions = {
							featuredPost: { enabled: true, type: 'latest', slug: 'getting-started' },
							recentPosts: { enabled: true, count: 7 },
							projects: { enabled: true, count: 2 },
							docs: { enabled: true, count: 3 },
							blurb: { placement: 'below' }
						};
					}
					if (!settings.homeOptions.featuredPost) {
						settings.homeOptions.featuredPost = { enabled: true, type: 'latest', slug: 'getting-started' };
					}
				settings.homeOptions.featuredPost.enabled = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
				// Show/hide featured post options
					const fpOptions = homeOptionsSection.querySelector('.featured-post-options') as HTMLElement;
					if (fpOptions) {
						fpOptions.setCssProps({ display: value ? 'block' : 'none' });
					}
				
							await this.applyCurrentConfiguration();
					new Notice(`Featured post ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Featured Post options container
		const fpOptions = homeOptionsSection.createDiv('featured-post-options');
		fpOptions.setCssProps({
			display: (settings.homeOptions?.featuredPost?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(fpOptions)
			.setName('Featured post type')
			.setDesc('Show latest post or a specific featured post')
			.addDropdown(dropdown => dropdown
				.addOption('latest', 'Latest')
				.addOption('featured', 'Featured')
				.setValue(settings.homeOptions?.featuredPost?.type || 'latest')
				.onChange(async (value) => {
					if (!settings.homeOptions?.featuredPost) {
						settings.homeOptions.featuredPost = { enabled: true, type: 'latest', slug: 'getting-started' };
					}
					settings.homeOptions.featuredPost.type = value as 'latest' | 'featured';
					await this.plugin.saveData(settings);
					
					// Show/hide slug field
					const fpSlug = fpOptions.querySelector('.featured-post-slug') as HTMLElement;
					if (fpSlug) {
						fpSlug.setCssProps({ display: value === 'featured' ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Featured post slug (only shown when type is 'featured')
		const fpSlug = fpOptions.createDiv('featured-post-slug');
		fpSlug.setCssProps({
			display: (settings.homeOptions?.featuredPost?.type === 'featured') ? 'block' : 'none'
		});

		new Setting(fpSlug)
			.setName('Featured post slug')
			.setDesc('Slug of the post to feature (e.g., "getting-started" for /posts/getting-started)')
			.addText(text => text
				// False positive: "getting-started" is a placeholder example, not UI text
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setPlaceholder('getting-started')
				.setValue(settings.homeOptions?.featuredPost?.slug || 'getting-started')
				.onChange(async (value) => {
					if (!settings.homeOptions?.featuredPost) {
						settings.homeOptions.featuredPost = { enabled: true, type: 'featured', slug: 'getting-started' };
					}
					settings.homeOptions.featuredPost.slug = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
				}));

		// Recent Posts
		new Setting(homeOptionsSection)
			.setName('Recent posts')
			.setDesc('Show recent posts on homepage')
			.addToggle(toggle => toggle
				.setValue(settings.homeOptions?.recentPosts?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.homeOptions?.recentPosts) {
						settings.homeOptions.recentPosts = { enabled: true, count: 7 };
					}
				settings.homeOptions.recentPosts.enabled = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Show/hide recent posts count
					const rpCount = homeOptionsSection.querySelector('.recent-posts-count') as HTMLElement;
					if (rpCount) {
						rpCount.setCssProps({ display: value ? 'block' : 'none' });
					}
				
				await this.applyCurrentConfiguration();
				}));

		// Recent Posts count container
		const rpCount = homeOptionsSection.createDiv('recent-posts-count');
		rpCount.setCssProps({
			display: (settings.homeOptions?.recentPosts?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(rpCount)
			.setName('Recent posts count')
			.setDesc('Number of recent posts to show')
			.addText(text => text
				.setPlaceholder('7')
				.setValue(String(settings.homeOptions?.recentPosts?.count || 7))
				.onChange(async (value) => {
					const num = parseInt(value) || 7;
					if (!settings.homeOptions?.recentPosts) {
						settings.homeOptions.recentPosts = { enabled: true, count: 7 };
					}
				settings.homeOptions.recentPosts.count = num;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// Projects
		new Setting(homeOptionsSection)
			.setName('Projects on homepage')
			.setDesc('Show featured projects on homepage')
			.addToggle(toggle => toggle
				.setValue(settings.homeOptions?.projects?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.homeOptions?.projects) {
						settings.homeOptions.projects = { enabled: true, count: 2 };
					}
					settings.homeOptions.projects.enabled = value;
					await this.plugin.saveData(settings);
					
					// Show/hide projects count
					const pCount = homeOptionsSection.querySelector('.projects-count') as HTMLElement;
					if (pCount) {
						pCount.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Projects count container
		const pCount = homeOptionsSection.createDiv('projects-count');
		pCount.setCssProps({
			display: (settings.homeOptions?.projects?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(pCount)
			.setName('Projects count')
			.setDesc('Number of projects to show')
			.addText(text => text
				.setPlaceholder('2')
				.setValue(String(settings.homeOptions?.projects?.count || 2))
				.onChange(async (value) => {
					const num = parseInt(value) || 2;
					if (!settings.homeOptions?.projects) {
						settings.homeOptions.projects = { enabled: true, count: 2 };
					}
					settings.homeOptions.projects.count = num;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Docs
		new Setting(homeOptionsSection)
			.setName('Docs on homepage')
			.setDesc('Show featured docs on homepage')
			.addToggle(toggle => toggle
				.setValue(settings.homeOptions?.docs?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.homeOptions?.docs) {
						settings.homeOptions.docs = { enabled: true, count: 3 };
					}
					settings.homeOptions.docs.enabled = value;
					await this.plugin.saveData(settings);
					
					// Show/hide docs count
					const dCount = homeOptionsSection.querySelector('.docs-count') as HTMLElement;
					if (dCount) {
						dCount.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Docs count container
		const dCount = homeOptionsSection.createDiv('docs-count');
		dCount.setCssProps({
			display: (settings.homeOptions?.docs?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(dCount)
			.setName('Docs count')
			.setDesc('Number of docs to show')
			.addText(text => text
				.setPlaceholder('3')
				.setValue(String(settings.homeOptions?.docs?.count || 3))
				.onChange(async (value) => {
					const num = parseInt(value) || 3;
					if (!settings.homeOptions?.docs) {
						settings.homeOptions.docs = { enabled: true, count: 3 };
					}
					settings.homeOptions.docs.count = num;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Blurb placement
		new Setting(homeOptionsSection)
			.setName('Blurb placement')
			.setDesc('Where to place the blurb text on homepage')
			.addDropdown(dropdown => dropdown
				.addOption('above', 'Above')
				.addOption('below', 'Below')
				.addOption('none', 'None')
				.setValue(settings.homeOptions?.blurb?.placement || 'below')
				.onChange(async (value) => {
					if (!settings.homeOptions?.blurb) {
						settings.homeOptions.blurb = { placement: 'below' };
					}
					settings.homeOptions.blurb.placement = value as 'above' | 'below' | 'none';
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// ═══════════════════════════════════════════════════════════════════
		// POST OPTIONS
		// ═══════════════════════════════════════════════════════════════════
		const postOptionsSection = container.createDiv('settings-section');
		postOptionsSection.setCssProps({
			marginTop: '30px',
			paddingTop: '20px',
			borderTop: '2px solid var(--background-modifier-border)'
		});
		
		// Post Options heading
		new Setting(postOptionsSection)
			.setHeading()
			.setName('Post options');

		// Posts per page
		new Setting(postOptionsSection)
			.setName('Posts per page')
			.setDesc('Number of posts to show per page')
			.addText(text => text
				.setPlaceholder('6')
				.setValue(String(settings.postOptions?.postsPerPage || 6))
				.onChange(async (value) => {
					const num = parseInt(value) || 6;
					if (!settings.postOptions) {
						settings.postOptions = {
							postsPerPage: 6,
							readingTime: true,
							wordCount: true,
							tags: true,
							linkedMentions: { enabled: true, linkedMentionsCompact: false },
							graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true },
							postNavigation: true,
							showPostCardCoverImages: 'featured-and-posts',
							postCardAspectRatio: 'og',
							customPostCardAspectRatio: '2.5/1',
							comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' }
						};
					}
					settings.postOptions.postsPerPage = num;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Reading time
		new Setting(postOptionsSection)
			.setName('Reading time')
			.setDesc('Display estimated reading time on posts')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.readingTime ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.readingTime = value;
				settings.features.readingTime = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// Word count
		new Setting(postOptionsSection)
			.setName('Word count')
			.setDesc('Display word count on posts')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.wordCount ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.wordCount = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));


		// Tags
		new Setting(postOptionsSection)
			.setName('Tags')
			.setDesc('Show tags on posts')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.tags ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.tags = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// Linked Mentions
		new Setting(postOptionsSection)
			.setName('Linked mentions')
			.setDesc('Show linked mentions and backlinks on posts')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.linkedMentions?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions?.linkedMentions) {
						settings.postOptions.linkedMentions = { enabled: true, linkedMentionsCompact: false };
					}
				settings.postOptions.linkedMentions.enabled = value;
				settings.features.linkedMentions = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Show/hide linked mentions compact option
				const lmCompact = postOptionsSection.querySelector('.linked-mentions-compact') as HTMLElement;
				if (lmCompact) {
					lmCompact.setCssProps({ display: value ? 'block' : 'none' });
				}
				
				await this.applyCurrentConfiguration();
				}));

		// Linked Mentions Compact container
		const lmCompact = postOptionsSection.createDiv('linked-mentions-compact');
		lmCompact.setCssProps({
			display: (settings.postOptions?.linkedMentions?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(lmCompact)
			.setName('Compact view')
			.setDesc('Use compact view for linked mentions')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.linkedMentions?.linkedMentionsCompact ?? false)
				.onChange(async (value) => {
					if (!settings.postOptions?.linkedMentions) {
						settings.postOptions.linkedMentions = { enabled: true, linkedMentionsCompact: false };
					}
					settings.postOptions.linkedMentions.linkedMentionsCompact = value;
					settings.features.linkedMentionsCompact = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Graph view
		new Setting(postOptionsSection)
			.setName('Graph view')
			.setDesc('Show graph view of post connections')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.graphView?.enabled ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions?.graphView) {
						settings.postOptions.graphView = { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true };
					}
				settings.postOptions.graphView.enabled = value;
				settings.features.graphView = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Show/hide graph view options
				const gvOptions = postOptionsSection.querySelector('.graph-view-options') as HTMLElement;
				if (gvOptions) {
					gvOptions.setCssProps({ display: value ? 'block' : 'none' });
				}
				
				await this.applyCurrentConfiguration();
				}));

		// Graph View options container
		const gvOptions = postOptionsSection.createDiv('graph-view-options');
		gvOptions.setCssProps({
			display: (settings.postOptions?.graphView?.enabled ?? true) ? 'block' : 'none',
			paddingLeft: '20px'
		});

		new Setting(gvOptions)
			.setName('Show in sidebar')
			.setDesc('Display graph view in post sidebar')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.graphView?.showInSidebar ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions?.graphView) {
						settings.postOptions.graphView = { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true };
					}
					settings.postOptions.graphView.showInSidebar = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		new Setting(gvOptions)
			.setName('Maximum nodes')
			.setDesc('Maximum number of nodes to show in graph')
			.addText(text => text
				.setPlaceholder('100')
				.setValue(String(settings.postOptions?.graphView?.maxNodes || 100))
				.onChange(async (value) => {
					const num = parseInt(value) || 100;
					if (!settings.postOptions?.graphView) {
						settings.postOptions.graphView = { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true };
					}
					settings.postOptions.graphView.maxNodes = num;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		new Setting(gvOptions)
			.setName('Show orphaned posts')
			.setDesc('Include posts with no connections in graph view')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.graphView?.showOrphanedPosts ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions?.graphView) {
						settings.postOptions.graphView = { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true };
					}
					settings.postOptions.graphView.showOrphanedPosts = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Post navigation
		new Setting(postOptionsSection)
			.setName('Post navigation')
			.setDesc('Show next/previous post navigation')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.postNavigation ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.postNavigation = value;
				settings.features.postNavigation = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// Show post card cover images
		new Setting(postOptionsSection)
			.setName('Show post card cover images')
			.setDesc('Where to display cover images on post cards')
			.addDropdown(dropdown => dropdown
				.addOption('all', 'All')
				.addOption('featured', 'Featured')
				.addOption('home', 'Home')
				.addOption('posts', 'Posts')
				.addOption('featured-and-posts', 'Featured and posts')
				.addOption('none', 'None')
				.setValue(settings.postOptions?.showPostCardCoverImages || 'featured-and-posts')
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.showPostCardCoverImages = value as 'all' | 'featured' | 'home' | 'posts' | 'featured-and-posts' | 'none';
				settings.features.showPostCardCoverImages = value as 'all' | 'featured' | 'home' | 'posts' | 'featured-and-posts' | 'none';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
				}));

		// Post card aspect ratio
		new Setting(postOptionsSection)
			.setName('Post card aspect ratio')
			.setDesc('Aspect ratio for post card cover images')
			.addDropdown(dropdown => dropdown
				.addOption('16:9', '16:9')
				.addOption('4:3', '4:3')
				.addOption('3:2', '3:2')
				// False positive: "Open Graph" is a proper noun (OG format standard)
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.addOption('og', 'Open Graph')
				.addOption('square', 'Square')
				.addOption('golden', 'Golden')
				.addOption('custom', 'Custom')
				.setValue(settings.postOptions?.postCardAspectRatio || 'og')
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
				settings.postOptions.postCardAspectRatio = value as 'og' | '16:9' | '4:3' | '3:2' | 'square' | 'golden' | 'custom';
				settings.features.postCardAspectRatio = value as 'og' | '16:9' | '4:3' | '3:2' | 'square' | 'golden' | 'custom';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Show/hide custom aspect ratio field
				const customAR = postOptionsSection.querySelector('.custom-aspect-ratio') as HTMLElement;
				if (customAR) {
					customAR.setCssProps({ display: value === 'custom' ? 'block' : 'none' });
				}
				
				await this.applyCurrentConfiguration();
				}));

		// Custom aspect ratio container
		const customAR = postOptionsSection.createDiv('custom-aspect-ratio');
		customAR.setCssProps({
			display: (settings.postOptions?.postCardAspectRatio === 'custom') ? 'block' : 'none',
			paddingLeft: '20px'
		});

		this.createTextSetting(
			customAR,
			'Custom aspect ratio',
			'Custom aspect ratio in format "width/height" (e.g., "2.5/1")',
			settings.postOptions?.customPostCardAspectRatio || '2.5/1',
			(value) => {
				if (!settings.postOptions) {
					settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
				}
				settings.postOptions.customPostCardAspectRatio = value;
				settings.features.customPostCardAspectRatio = value;
			},
			1000,
			async () => {
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
			}
		);

		// ═══════════════════════════════════════════════════════════════════
		// OPTIONAL FEATURES
		// ═══════════════════════════════════════════════════════════════════
		const optionalFeaturesSection = container.createDiv('settings-section');
		optionalFeaturesSection.setCssProps({
			marginTop: '30px',
			paddingTop: '20px',
			borderTop: '2px solid var(--background-modifier-border)'
		});
		
		// Optional Features heading
		new Setting(optionalFeaturesSection)
			.setHeading()
			.setName('Optional features');

		// Profile Picture (keep existing implementation)
		this.renderProfilePictureSetting(optionalFeaturesSection, settings);

		// Post Comments (keep existing implementation, update title)
		this.renderCommentsSetting(optionalFeaturesSection, settings);
	}

	private renderProfilePictureSetting(container: HTMLElement, settings: AstroModularSettings): void {
		const isEnabled = settings.features?.profilePicture || settings.optionalFeatures?.profilePicture?.enabled;
		const profileSettings: ProfilePictureSettings = settings.optionalFeatures?.profilePicture || {
			enabled: false,
			image: '/profile.jpg',
			alt: 'Profile picture',
			size: 'md',
			url: '',
			placement: 'footer',
			style: 'circle',
		};

		// Main toggle
		new Setting(container)
			.setName('Profile picture')
			.setDesc('Show profile picture in header or footer')
			.addToggle(toggle => toggle
				.setValue(isEnabled)
				.onChange(async (value) => {
					settings.features.profilePicture = value;
					if (!settings.optionalFeatures) {
						settings.optionalFeatures = { profilePicture: profileSettings, comments: settings.postOptions?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.optionalFeatures.profilePicture.enabled = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Show/hide the detailed options
					const optionsDiv = container.querySelector('.profile-picture-options') as HTMLElement;
					if (optionsDiv) {
						optionsDiv.setCssProps({ display: value ? 'block' : 'none' });
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
		optionsContainer.setCssProps({
			display: isEnabled ? 'block' : 'none',
			marginTop: '10px',
			paddingLeft: '20px'
		});

		// Create two-column grid for options
		const optionsGrid = optionsContainer.createDiv('options-grid');
		optionsGrid.setCssProps({
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			gap: '10px',
			marginTop: '10px'
		});

		// Image path setting
		this.createTextSetting(
			optionsGrid,
			'Image path',
			'Path to the profile picture image (in the public folder)',
			profileSettings.image,
			(value) => {
				profileSettings.image = value;
			},
			1000,
			async () => {
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
			},
			'/profile.jpg'
		);

		// Alt text setting
		this.createTextSetting(
			optionsGrid,
			'Alt text',
			'Alternative text for the profile picture',
			profileSettings.alt,
			(value) => {
				profileSettings.alt = value;
			},
			1000,
			async () => {
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
			},
			'Profile picture'
		);

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
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
				}));

		// URL setting
		this.createTextSetting(
			optionsGrid,
			'URL (optional)',
			'Optional URL to link the profile picture to',
			profileSettings.url || '',
			(value) => {
				profileSettings.url = value;
			},
			1000,
			async () => {
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration();
			},
			'/about'
		);

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
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
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
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
				}));
	}

	private renderCommentsSetting(container: HTMLElement, settings: AstroModularSettings): void {
		// Use optionalFeatures.comments.enabled as the primary source, fallback to others
		const isEnabled = settings.optionalFeatures?.comments?.enabled ?? settings.features?.comments ?? settings.postOptions?.comments?.enabled ?? false;
		const commentsSettings = settings.postOptions?.comments || settings.optionalFeatures?.comments || {
			enabled: false,
			provider: 'giscus',
			rawScript: '',
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
		new Setting(container)
			.setName('Post comments')
			// False positive: "Giscus" is a proper noun (product name) and should be capitalized
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Enable Giscus comment system for posts')
			.addToggle(toggle => toggle
				.setValue(isEnabled)
				.onChange(async (value) => {
					// Update all three locations to ensure consistency
					settings.features.comments = value;
					
					// Ensure postOptions exists, but preserve existing comment settings
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: { ...commentsSettings } };
					}
					// Only update the enabled state, preserve all other comment settings
					settings.postOptions.comments.enabled = value;
					
					// Ensure optionalFeatures exists, but preserve existing comment settings
					if (!settings.optionalFeatures) {
						settings.optionalFeatures = { profilePicture: { enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md', url: '', placement: 'footer', style: 'circle' }, comments: { ...commentsSettings } };
					}
					// Only update the enabled state, preserve all other comment settings
					settings.optionalFeatures.comments.enabled = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Show/hide the detailed options
					const optionsDiv = container.querySelector('.comments-options') as HTMLElement;
					if (optionsDiv) {
						optionsDiv.setCssProps({ display: value ? 'block' : 'none' });
					}
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Comments system ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply comments system to config.ts: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.setCssProps({
			display: isEnabled ? 'block' : 'none',
			marginTop: '10px'
		});
		optionsContainer.setCssProps({ paddingLeft: '20px' });

		// Instructions
		const instructionsDiv = optionsContainer.createDiv('comments-instructions');
		instructionsDiv.setCssProps({
			marginBottom: '15px',
			padding: '10px',
			background: 'var(--background-modifier-border)'
		});
		instructionsDiv.setCssProps({
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
			// False positive: "giscus.app" is a domain name, not UI text
			// eslint-disable-next-line obsidianmd/ui/sentence-case
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
			// False positive: "Giscus" is a proper noun (product name) and should be capitalized
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setName('Giscus Script')
			// False positive: "Giscus" is a proper noun (product name) and should be capitalized
			// eslint-disable-next-line obsidianmd/ui/sentence-case
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
		
		// Set current value from the actual saved settings
		textarea.value = settings.optionalFeatures?.comments?.rawScript || settings.postOptions?.comments?.rawScript || '';
		
		// Validation and parsing
		const validationDiv = optionsContainer.createDiv('script-validation');
		validationDiv.setCssProps({
			marginTop: '8px',
			fontSize: '12px'
		});
		
		// Debounce timeout ID
		let debounceTimeoutId: number | null = null;
		
		const updateValidation = async (showNotification: boolean = false) => {
			const scriptContent = textarea.value.trim();
			
			if (!scriptContent) {
				validationDiv.empty();
				// Get the current enabled state from the actual settings (not the local variable)
				const currentEnabled = settings.optionalFeatures?.comments?.enabled ?? settings.features?.comments ?? settings.postOptions?.comments?.enabled ?? false;
				
				// Clear all comment settings when script is deleted (but preserve enabled state)
				if (!settings.optionalFeatures) {
					settings.optionalFeatures = { profilePicture: { enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md', url: '', placement: 'footer', style: 'circle' }, comments: { enabled: currentEnabled, provider: 'giscus', rawScript: '', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
				} else {
					settings.optionalFeatures.comments = {
						...settings.optionalFeatures.comments,
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
					};
				}
				
				// Also update postOptions.comments
				if (!settings.postOptions) {
					settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures.comments };
				} else {
					settings.postOptions.comments = { ...settings.optionalFeatures.comments };
				}
				
				// Ensure features.comments is in sync
				if (!settings.features) {
					settings.features = {
						commandPalette: false,
						readingTime: false,
						linkedMentions: false,
						linkedMentionsCompact: false,
						comments: false,
						graphView: false,
						postNavigation: false,
						hideScrollBar: false,
						scrollToTop: false,
						featureButton: 'none',
						showSocialIconsInFooter: false,
						showPostCardCoverImages: 'none',
						postCardAspectRatio: 'og',
						profilePicture: false,
						quickActions: {
							enabled: false,
							toggleMode: false,
							graphView: false,
							changeTheme: false
						}
					};
				}
				settings.features.comments = currentEnabled;
				
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				if (showNotification) {
					await this.applyCurrentConfiguration();
					new Notice('Giscus script cleared and applied to config.ts');
				}
				return;
			}
			
			// Import the parser dynamically
			const { GiscusScriptParser } = await import('../../utils/GiscusScriptParser');
			const validation = GiscusScriptParser.validateScript(scriptContent);
			
			if (validation.valid) {
				validationDiv.empty();
				// False positive: "Giscus" is a proper noun (product name) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				const successSpan = validationDiv.createEl('span', { text: '✓ Valid Giscus script detected' });
				successSpan.setCssProps({ color: 'var(--text-success)' });
				
				// Parse and update all settings
				const parsed = GiscusScriptParser.parseScript(scriptContent);
				if (parsed) {
					// Get the current enabled state from the actual settings (not the local variable)
					const currentEnabled = settings.optionalFeatures?.comments?.enabled ?? settings.features?.comments ?? settings.postOptions?.comments?.enabled ?? false;
					
					// Update the commentsSettings object with parsed data
					commentsSettings.rawScript = scriptContent;
					commentsSettings.repo = parsed.repo;
					commentsSettings.repoId = parsed.repoId;
					commentsSettings.category = parsed.category;
					commentsSettings.categoryId = parsed.categoryId;
					commentsSettings.mapping = parsed.mapping;
					commentsSettings.strict = parsed.strict;
					commentsSettings.reactions = parsed.reactions;
					commentsSettings.metadata = parsed.metadata;
					commentsSettings.inputPosition = parsed.inputPosition;
					commentsSettings.theme = parsed.theme;
					commentsSettings.lang = parsed.lang;
					commentsSettings.loading = parsed.loading;
					// Preserve the enabled state - don't force it to true
					commentsSettings.enabled = currentEnabled;
					
					// Update optionalFeatures.comments (this is what modifyConfigFromFeatures reads)
					if (!settings.optionalFeatures) {
						settings.optionalFeatures = { profilePicture: { enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md', url: '', placement: 'footer', style: 'circle' }, comments: commentsSettings };
					}
					settings.optionalFeatures.comments = { ...commentsSettings };
					
					// Also update postOptions.comments for consistency
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: commentsSettings };
					}
					settings.postOptions.comments = { ...commentsSettings };
					
					// Ensure features.comments is in sync so modifyConfigFromFeatures can apply the parsed values
					// This is required because modifyConfigFromFeatures checks both settings.features.comments AND settings.optionalFeatures.comments
					if (!settings.features) {
						settings.features = {
							commandPalette: false,
							readingTime: false,
							linkedMentions: false,
							linkedMentionsCompact: false,
							comments: false,
							graphView: false,
							postNavigation: false,
							hideScrollBar: false,
							scrollToTop: false,
							featureButton: 'none',
							showSocialIconsInFooter: false,
							showPostCardCoverImages: 'none',
							postCardAspectRatio: 'og',
							profilePicture: false,
							quickActions: {
								enabled: false,
								toggleMode: false,
								graphView: false,
								changeTheme: false
							}
						};
					}
					settings.features.comments = currentEnabled;
					
					// Save settings immediately
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Apply configuration if notification is requested (debounced or on blur)
					if (showNotification) {
						try {
							await this.applyCurrentConfiguration();
							const statusMessage = currentEnabled 
								? 'Giscus script parsed and applied to config.ts' 
								: 'Giscus script parsed and saved. Enable comments to apply to config.ts';
							new Notice(statusMessage);
						} catch (error) {
							new Notice(`Failed to apply Giscus script to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
					}
				}
			} else {
				validationDiv.empty();
				const errorSpan = validationDiv.createEl('span', { text: `✗ ${validation.error}` });
				errorSpan.setCssProps({ color: 'var(--text-error)' });
			}
		};
		
		// Debounced input handler (1 second debounce like other text fields)
		textarea.addEventListener('input', () => {
			// Clear existing timeout
			if (debounceTimeoutId) {
				clearTimeout(debounceTimeoutId);
			}
			
			// Update validation immediately (for UI feedback)
			void updateValidation(false);
			
			// Debounce the configuration application and notification
			debounceTimeoutId = window.setTimeout(() => {
				void updateValidation(true);
			}, 1000); // 1 second debounce
		});
		
		// Apply immediately on blur (when user leaves the field)
		textarea.addEventListener('blur', () => {
			// Clear any pending timeout
			if (debounceTimeoutId) {
				clearTimeout(debounceTimeoutId);
				debounceTimeoutId = null;
			}
			// Apply immediately when leaving the field
			void updateValidation(true);
		});
		
		// Initial validation (no notification on load)
		void updateValidation(false);
	}
}
