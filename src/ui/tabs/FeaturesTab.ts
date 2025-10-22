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
					console.log('🔧 Projects toggle changed to:', value);
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.projects = value;
					console.log('🔧 Settings after projects change:', settings.optionalContentTypes);
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as any).loadSettings();
					console.log('🔧 Settings saved and reloaded, calling applyCurrentConfiguration');
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
					console.log('🔧 Docs toggle changed to:', value);
					if (!settings.optionalContentTypes) {
						settings.optionalContentTypes = { projects: true, docs: true };
					}
					settings.optionalContentTypes.docs = value;
					console.log('🔧 Settings after docs change:', settings.optionalContentTypes);
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as any).loadSettings();
					console.log('🔧 Settings saved and reloaded, calling applyCurrentConfiguration');
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
					
					// Show/hide ToC depth option
					const tocDepth = globalSection.querySelector('.toc-depth-option') as HTMLElement;
					if (tocDepth) {
						tocDepth.style.display = value ? 'block' : 'none';
					}
					
					await this.applyCurrentConfiguration();
					new Notice(`Table of contents ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// ToC depth container
		const tocDepthContainer = globalSection.createDiv('toc-depth-option');
		tocDepthContainer.style.display = (settings.tableOfContents?.enabled ?? true) ? 'block' : 'none';
		tocDepthContainer.style.paddingLeft = '20px';

		new Setting(tocDepthContainer)
			.setName('Table of contents depth')
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
					await this.plugin.saveData(settings);
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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
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
				.addOption('og', 'Open Graph')
				.addOption('square', 'Square')
				.addOption('golden', 'Golden')
				.addOption('custom', 'Custom')
				.setValue(settings.postOptions?.postCardAspectRatio || 'og')
				.onChange(async (value) => {
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
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
					settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
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

		// Options container
		const optionsContainer = container.createDiv('comments-options');
		optionsContainer.style.display = isEnabled ? 'block' : 'none';
		optionsContainer.style.marginTop = '10px';
		optionsContainer.style.paddingLeft = '20px';

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
				commentsSettings.rawScript = '';
				await this.plugin.saveData(settings);
				return;
			}
			
			// Import the parser dynamically
			const { GiscusScriptParser } = await import('../../utils/GiscusScriptParser');
			const validation = GiscusScriptParser.validateScript(scriptContent);
			
			if (validation.valid) {
				validationDiv.innerHTML = '<span style="color: var(--text-success)">✓ Valid Giscus script detected</span>';
				
				// Parse and update all settings
				const parsed = GiscusScriptParser.parseScript(scriptContent);
				if (parsed) {
					// Enable comments when a valid script is pasted
					settings.features.comments = true;
					
					// Update the commentsSettings object with parsed data
					commentsSettings.enabled = true;
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
					
					await this.plugin.saveData(settings);
					
					// Update the toggle to show comments are enabled
					const toggle = container.querySelector('.setting-item .checkbox-container input[type="checkbox"]') as HTMLInputElement;
					if (toggle) {
						toggle.checked = true;
					}
					
					// Show the options container
					const optionsDiv = container.querySelector('.comments-options') as HTMLElement;
					if (optionsDiv) {
						optionsDiv.style.display = 'block';
					}
					
					await this.applyCurrentConfiguration();
				}
			} else {
				validationDiv.innerHTML = `<span style="color: var(--text-error)">✗ ${validation.error}</span>`;
			}
		};
		
		textarea.addEventListener('input', updateValidation);
		
		// Initial validation
		updateValidation();
	}
}
