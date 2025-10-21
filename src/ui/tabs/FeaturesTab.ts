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

		// ═══════════════════════════════════════════════════════════════════
		// GLOBAL OPTIONS
		// ═══════════════════════════════════════════════════════════════════
		const globalSection = container.createDiv('settings-section');
		globalSection.style.marginTop = '20px';
		globalSection.createEl('h3', { text: 'Global Options' });

		// Enable Projects
		new Setting(globalSection)
			.setName('Enable Projects')
			.setDesc('Enable projects as a unique content type for showcasing work and portfolios')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes?.projects ?? true)
				.onChange(async (value) => {
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.projects = value;
					await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration();
						new Notice(`Projects ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Enable Docs
		new Setting(globalSection)
			.setName('Enable Docs')
			.setDesc('Enable docs as a unique content type for documentation and knowledge base')
			.addToggle(toggle => toggle
				.setValue(settings.optionalContentTypes?.docs ?? true)
				.onChange(async (value) => {
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.docs = value;
					await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration();
						new Notice(`Docs ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
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
					
					// Show/hide footer options
					const footerOptions = globalSection.querySelector('.footer-options') as HTMLElement;
					if (footerOptions) {
						footerOptions.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Footer options container
		const footerOptions = globalSection.createDiv('footer-options');
		footerOptions.style.display = (settings.footer?.enabled ?? true) ? 'block' : 'none';
		footerOptions.style.paddingLeft = '20px';

		// Footer content
		this.createTextSetting(
			footerOptions,
			'Footer content',
			'Text to display in footer. Use {author} for site author and {title} for site title',
			settings.footer?.content || '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.',
			(value) => {
				if (!settings.footer) {
					settings.footer = { enabled: true, content: '', showSocialIconsInFooter: true };
				}
				settings.footer.content = value;
			}
		);

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
					await this.applyCurrentConfiguration();
					new Notice(`Social icons in footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
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
								await this.applyCurrentConfiguration();
					new Notice(`Scroll to top ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// SEO: Default OG Image Alt
		this.createTextSetting(
			globalSection,
			'Default OG image alt text',
			'Alternative text for the default Open Graph image (public/open-graph.png)',
			settings.seo?.defaultOgImageAlt || 'Astro Modular logo.',
			(value) => {
				if (!settings.seo) {
					settings.seo = { defaultOgImageAlt: '' };
				}
				settings.seo.defaultOgImageAlt = value;
			}
		);

		// Feature button
		new Setting(globalSection)
			.setName('Feature button')
			.setDesc('Choose which feature button appears in the header')
			.addDropdown(dropdown => dropdown
				.addOption('mode', 'Dark/Light Mode Toggle')
				.addOption('graph', 'View Graph')
				.addOption('theme', 'Change Theme')
				.addOption('none', 'None')
				.setValue(settings.features?.featureButton || 'mode')
				.onChange(async (value) => {
					settings.features.featureButton = value as 'mode' | 'graph' | 'theme' | 'none';
					await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration();
						new Notice(`Feature button updated to "${value}" and applied to config.ts`);
				}));

		// ═══════════════════════════════════════════════════════════════════
		// COMMAND PALETTE
		// ═══════════════════════════════════════════════════════════════════
		const commandPaletteSection = container.createDiv('settings-section');
		commandPaletteSection.style.marginTop = '30px';
		commandPaletteSection.style.paddingTop = '20px';
		commandPaletteSection.style.borderTop = '2px solid var(--background-modifier-border)';
		commandPaletteSection.createEl('h3', { text: 'Command Palette' });

		// Enable Command Palette
		new Setting(commandPaletteSection)
			.setName('Enable Command Palette')
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
					await this.plugin.saveData(settings);
					
					// Show/hide command palette options
					const cpOptions = commandPaletteSection.querySelector('.command-palette-options') as HTMLElement;
					if (cpOptions) {
						cpOptions.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Command Palette ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Command Palette options container
		const cpOptions = commandPaletteSection.createDiv('command-palette-options');
		cpOptions.style.display = (settings.commandPalette?.enabled ?? true) ? 'block' : 'none';
		cpOptions.style.paddingLeft = '20px';

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
		searchSection.createEl('h4', { text: 'Search Content Types' });

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
					await this.applyCurrentConfiguration();
				}));

		// Sections toggles
		const sectionsSection = cpOptions.createDiv();
		sectionsSection.style.marginTop = '15px';
		sectionsSection.createEl('h4', { text: 'Command Palette Sections' });

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
						qaOptions.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Quick Actions options container
		const qaOptions = sectionsSection.createDiv('quick-actions-options');
		qaOptions.style.display = (settings.commandPalette?.sections?.quickActions ?? true) ? 'block' : 'none';
		qaOptions.style.paddingLeft = '20px';
		qaOptions.style.marginTop = '10px';

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
					await this.applyCurrentConfiguration();
				}));

		// ═══════════════════════════════════════════════════════════════════
		// HOME OPTIONS
		// ═══════════════════════════════════════════════════════════════════
		const homeOptionsSection = container.createDiv('settings-section');
		homeOptionsSection.style.marginTop = '30px';
		homeOptionsSection.style.paddingTop = '20px';
		homeOptionsSection.style.borderTop = '2px solid var(--background-modifier-border)';
		homeOptionsSection.createEl('h3', { text: 'Home Options' });

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
						
					// Show/hide featured post options
					const fpOptions = homeOptionsSection.querySelector('.featured-post-options') as HTMLElement;
					if (fpOptions) {
						fpOptions.style.display = value ? 'block' : 'none';
					}
					
							await this.applyCurrentConfiguration();
					new Notice(`Featured post ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Featured Post options container
		const fpOptions = homeOptionsSection.createDiv('featured-post-options');
		fpOptions.style.display = (settings.homeOptions?.featuredPost?.enabled ?? true) ? 'block' : 'none';
		fpOptions.style.paddingLeft = '20px';

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
						fpSlug.style.display = value === 'featured' ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Featured post slug (only shown when type is 'featured')
		const fpSlug = fpOptions.createDiv('featured-post-slug');
		fpSlug.style.display = (settings.homeOptions?.featuredPost?.type === 'featured') ? 'block' : 'none';

		this.createTextSetting(
			fpSlug,
			'Featured post slug',
			'Slug of the post to feature (e.g., "getting-started" for /posts/getting-started)',
			settings.homeOptions?.featuredPost?.slug || 'getting-started',
			(value) => {
				if (!settings.homeOptions?.featuredPost) {
					settings.homeOptions.featuredPost = { enabled: true, type: 'featured', slug: 'getting-started' };
				}
				settings.homeOptions.featuredPost.slug = value;
			}
		);

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
					
					// Show/hide recent posts count
					const rpCount = homeOptionsSection.querySelector('.recent-posts-count') as HTMLElement;
					if (rpCount) {
						rpCount.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Recent Posts count container
		const rpCount = homeOptionsSection.createDiv('recent-posts-count');
		rpCount.style.display = (settings.homeOptions?.recentPosts?.enabled ?? true) ? 'block' : 'none';
		rpCount.style.paddingLeft = '20px';

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
						pCount.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Projects count container
		const pCount = homeOptionsSection.createDiv('projects-count');
		pCount.style.display = (settings.homeOptions?.projects?.enabled ?? true) ? 'block' : 'none';
		pCount.style.paddingLeft = '20px';

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
						dCount.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Docs count container
		const dCount = homeOptionsSection.createDiv('docs-count');
		dCount.style.display = (settings.homeOptions?.docs?.enabled ?? true) ? 'block' : 'none';
		dCount.style.paddingLeft = '20px';

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
		postOptionsSection.style.marginTop = '30px';
		postOptionsSection.style.paddingTop = '20px';
		postOptionsSection.style.borderTop = '2px solid var(--background-modifier-border)';
		postOptionsSection.createEl('h3', { text: 'Post Options' });

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
							tableOfContents: true,
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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.readingTime = value;
					settings.features.readingTime = value;
					await this.plugin.saveData(settings);
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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.wordCount = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
				}));

		// Table of contents
		new Setting(postOptionsSection)
			.setName('Table of contents')
			.setDesc('Show table of contents on posts')
			.addToggle(toggle => toggle
				.setValue(settings.postOptions?.tableOfContents ?? true)
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.tableOfContents = value;
					settings.features.tableOfContents = value;
					await this.plugin.saveData(settings);
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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.tags = value;
					await this.plugin.saveData(settings);
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
					
					// Show/hide linked mentions compact option
					const lmCompact = postOptionsSection.querySelector('.linked-mentions-compact') as HTMLElement;
					if (lmCompact) {
						lmCompact.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Linked Mentions Compact container
		const lmCompact = postOptionsSection.createDiv('linked-mentions-compact');
		lmCompact.style.display = (settings.postOptions?.linkedMentions?.enabled ?? true) ? 'block' : 'none';
		lmCompact.style.paddingLeft = '20px';

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
					
					// Show/hide graph view options
					const gvOptions = postOptionsSection.querySelector('.graph-view-options') as HTMLElement;
					if (gvOptions) {
						gvOptions.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Graph View options container
		const gvOptions = postOptionsSection.createDiv('graph-view-options');
		gvOptions.style.display = (settings.postOptions?.graphView?.enabled ?? true) ? 'block' : 'none';
		gvOptions.style.paddingLeft = '20px';

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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.postNavigation = value;
					settings.features.postNavigation = value;
					await this.plugin.saveData(settings);
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
				.addOption('featured-and-posts', 'Featured and Posts')
				.addOption('none', 'None')
				.setValue(settings.postOptions?.showPostCardCoverImages || 'featured-and-posts')
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.showPostCardCoverImages = value as any;
					settings.features.showPostCardCoverImages = value as any;
					await this.plugin.saveData(settings);
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
				.addOption('og', 'OG')
				.addOption('square', 'Square')
				.addOption('golden', 'Golden')
				.addOption('custom', 'Custom')
				.setValue(settings.postOptions?.postCardAspectRatio || 'og')
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
					}
					settings.postOptions.postCardAspectRatio = value as any;
					settings.features.postCardAspectRatio = value as any;
					await this.plugin.saveData(settings);
					
					// Show/hide custom aspect ratio field
					const customAR = postOptionsSection.querySelector('.custom-aspect-ratio') as HTMLElement;
					if (customAR) {
						customAR.style.display = value === 'custom' ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
				}));

		// Custom aspect ratio container
		const customAR = postOptionsSection.createDiv('custom-aspect-ratio');
		customAR.style.display = (settings.postOptions?.postCardAspectRatio === 'custom') ? 'block' : 'none';
		customAR.style.paddingLeft = '20px';

		this.createTextSetting(
			customAR,
			'Custom aspect ratio',
			'Custom aspect ratio in format "width/height" (e.g., "2.5/1")',
			settings.postOptions?.customPostCardAspectRatio || '2.5/1',
			(value) => {
				if (!settings.postOptions) {
					settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
				}
				settings.postOptions.customPostCardAspectRatio = value;
				settings.features.customPostCardAspectRatio = value;
			}
		);

		// ═══════════════════════════════════════════════════════════════════
		// OPTIONAL FEATURES
		// ═══════════════════════════════════════════════════════════════════
		const optionalFeaturesSection = container.createDiv('settings-section');
		optionalFeaturesSection.style.marginTop = '30px';
		optionalFeaturesSection.style.paddingTop = '20px';
		optionalFeaturesSection.style.borderTop = '2px solid var(--background-modifier-border)';
		optionalFeaturesSection.createEl('h3', { text: 'Optional Features' });

		// Profile Picture (keep existing implementation)
		this.renderProfilePictureSetting(optionalFeaturesSection, settings);

		// Post Comments (keep existing implementation, update title)
		this.renderCommentsSetting(optionalFeaturesSection, settings);
	}

	private renderProfilePictureSetting(container: HTMLElement, settings: any): void {
		const isEnabled = settings.features?.profilePicture || settings.optionalFeatures?.profilePicture?.enabled;
		const profileSettings = settings.optionalFeatures?.profilePicture || {
			enabled: false,
			image: '/profile.jpg',
			alt: 'Profile picture',
			size: 'md',
			url: '',
			placement: 'footer',
			style: 'circle',
		};

		// Main toggle
		const profileSetting = new Setting(container)
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
		const isEnabled = settings.postOptions?.comments?.enabled || settings.optionalFeatures?.comments?.enabled;
		const commentsSettings = settings.postOptions?.comments || settings.optionalFeatures?.comments || {
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
			.setName('Post comments')
			.setDesc('Enable Giscus comment system for posts')
			.addToggle(toggle => toggle
				.setValue(isEnabled)
				.onChange(async (value) => {
					settings.features.comments = value;
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: commentsSettings };
					}
					settings.postOptions.comments.enabled = value;
					if (!settings.optionalFeatures) {
						settings.optionalFeatures = { profilePicture: { enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md', url: '', placement: 'footer', style: 'circle' }, comments: commentsSettings };
					}
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
