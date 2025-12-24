import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { AstroModularPlugin, AstroModularSettings, ProfilePictureSettings } from '../../types';
import { createSettingsGroup, SettingsContainer } from '../../utils/settings-compat';

export class FeaturesTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Global options group with heading
		const globalGroup = createSettingsGroup(container, 'Global options');

		// Enable Projects
		globalGroup.addSetting((setting) => {
			setting
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
		globalGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Docs ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Table of contents
		globalGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of ToC depth setting
						const tocDepthSetting = container.querySelector('.toc-depth-setting') as HTMLElement;
						if (tocDepthSetting) {
							tocDepthSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
						new Notice(`Table of contents ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// ToC depth - add as setting with conditional visibility
		globalGroup.addSetting((setting) => {
			setting.settingEl.classList.add('toc-depth-setting');
			setting.settingEl.setCssProps({
				display: (settings.tableOfContents?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						text.setValue(String(clampedNum));
						void this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Table of contents depth set to ${clampedNum} and applied to config.ts`);
					}));
		});

		// Footer enabled
		globalGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of footer options
						const footerContentSetting = container.querySelector('.footer-content-setting') as HTMLElement;
						const footerSocialSetting = container.querySelector('.footer-social-setting') as HTMLElement;
						if (footerContentSetting) {
							footerContentSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						if (footerSocialSetting) {
							footerSocialSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
						new Notice(`Footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Footer content - add as setting with conditional visibility
		globalGroup.addSetting((setting) => {
			setting.settingEl.classList.add('footer-content-setting');
			setting.settingEl.setCssProps({
				display: (settings.footer?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Footer content')
				.setDesc('Text to display in footer. Use {author} for site author and {title} for site title');
			
			// Apply spacing directly to description element
			const descEl = setting.settingEl.querySelector('.setting-item-description');
			if (descEl) {
				(descEl as HTMLElement).setCssProps({
					marginBottom: 'var(--size-4-3)'
				});
			}
			
			// Create textarea manually for full-width, multi-line input
			const textarea = setting.controlEl.createEl('textarea', {
				attr: {
					placeholder: '© 2025 {author}. Built with the Astro Modular theme.',
					rows: '3'
				}
			});
			textarea.value = settings.footer?.content || '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.';
			
			textarea.setCssProps({
				width: '100%',
				minHeight: '80px',
				resize: 'vertical',
				fontFamily: 'var(--font-text)',
				fontSize: 'var(--font-ui-small)',
				padding: 'var(--size-4-2) var(--size-4-3)',
				border: '1px solid var(--background-modifier-border)',
				borderRadius: 'var(--radius-s)',
				background: 'var(--background-primary)',
				color: 'var(--text-normal)'
			});
			
			// Position textarea below description (not to the right)
			setting.controlEl.setCssProps({
				width: '100%',
				display: 'block'
			});
			
			let timeoutId: number | null = null;
			textarea.addEventListener('input', () => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				if (!settings.footer) {
					settings.footer = { enabled: true, content: '', showSocialIconsInFooter: true };
				}
				settings.footer.content = textarea.value;
				void this.plugin.saveData(settings);
				timeoutId = window.setTimeout(() => {
					void (async () => {
						await (this.plugin as AstroModularPlugin).loadSettings();
						void this.applyCurrentConfiguration();
					})();
				}, 1000);
			});
			
			textarea.addEventListener('blur', () => {
				if (timeoutId) {
					clearTimeout(timeoutId);
					void (async () => {
						await (this.plugin as AstroModularPlugin).loadSettings();
						void this.applyCurrentConfiguration();
					})();
				}
			});
		});

		// Show social icons in footer - add as setting with conditional visibility
		globalGroup.addSetting((setting) => {
			setting.settingEl.classList.add('footer-social-setting');
			setting.settingEl.setCssProps({
				display: (settings.footer?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Social icons in footer ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Hide scroll bar
		globalGroup.addSetting((setting) => {
			setting
				.setName('Hide scroll bar')
				.setDesc('Hide the browser scroll bar for a cleaner look')
				.addToggle(toggle => toggle
					.setValue(settings.features?.hideScrollBar ?? false)
					.onChange(async (value) => {
						settings.features.hideScrollBar = value;
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Hide scroll bar ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Scroll to top
		globalGroup.addSetting((setting) => {
			setting
				.setName('Scroll to top')
				.setDesc('Show scroll to top button')
				.addToggle(toggle => toggle
					.setValue(settings.features?.scrollToTop ?? true)
					.onChange(async (value) => {
						settings.features.scrollToTop = value;
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Scroll to top ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Feature button
		globalGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Feature button updated to "${value}" and applied to config.ts`);
					}));
		});

		// Command Palette group with heading
		const commandPaletteGroup = createSettingsGroup(container, 'Command palette');

		// Enable Command Palette
		commandPaletteGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of all command palette options
						const cpSettings = container.querySelectorAll('.cp-option-setting');
						cpSettings.forEach((el) => {
							(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
						});
						
						await this.applyCurrentConfiguration();
						new Notice(`Command palette ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Shortcut - add with conditional visibility
		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Shortcut')
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Keyboard shortcut to open command palette (Ctrl = Cmd on Mac)')
				.addText(text => {
					text.setValue(settings.commandPalette?.shortcut || 'ctrl+K');
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						if (!settings.commandPalette) {
							settings.commandPalette = { enabled: true, shortcut: 'ctrl+K', placeholder: 'Search posts', search: { posts: true, pages: false, projects: false, docs: false }, sections: { quickActions: true, pages: true, social: true }, quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true } };
						}
						settings.commandPalette.shortcut = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Placeholder - add with conditional visibility
		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Placeholder')
				.setDesc('Placeholder text in command palette search box')
				.addText(text => {
					text.setValue(settings.commandPalette?.placeholder || 'Search posts');
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						if (!settings.commandPalette) {
							settings.commandPalette = { enabled: true, shortcut: 'ctrl+K', placeholder: 'Search posts', search: { posts: true, pages: false, projects: false, docs: false }, sections: { quickActions: true, pages: true, social: true }, quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true } };
						}
						settings.commandPalette.placeholder = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Search content types - all with conditional visibility
		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		// Command palette sections - all with conditional visibility
		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						
						// Update visibility of quick actions options
						const qaSettings = container.querySelectorAll('.qa-option-setting');
						qaSettings.forEach((el) => {
							(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
						});
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Quick actions options - with conditional visibility based on both enabled and quickActions section
		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting', 'qa-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) && (settings.commandPalette?.sections?.quickActions ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting', 'qa-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) && (settings.commandPalette?.sections?.quickActions ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting', 'qa-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) && (settings.commandPalette?.sections?.quickActions ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		commandPaletteGroup.addSetting((setting) => {
			setting.settingEl.classList.add('cp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.commandPalette?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		// Home Options group with heading
		const homeOptionsGroup = createSettingsGroup(container, 'Home options');

		// Featured Post
		homeOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of featured post options
						const fpSettings = container.querySelectorAll('.fp-option-setting');
						fpSettings.forEach((el) => {
							(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
						});
						
						await this.applyCurrentConfiguration();
						new Notice(`Featured post ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Featured Post options - with conditional visibility
		homeOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('fp-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.homeOptions?.featuredPost?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Featured post type')
				.setDesc('Show latest post or a specific featured post')
				.addDropdown(dropdown => {
					dropdown
						.addOption('latest', 'Latest')
						.addOption('featured', 'Featured')
						.setValue(settings.homeOptions?.featuredPost?.type || 'latest')
						.onChange(async (value) => {
							if (!settings.homeOptions?.featuredPost) {
								settings.homeOptions.featuredPost = { enabled: true, type: 'latest', slug: 'getting-started' };
							}
							settings.homeOptions.featuredPost.type = value as 'latest' | 'featured';
							await this.plugin.saveData(settings);
							
							// Update visibility of slug field
							const fpSlugSetting = container.querySelector('.fp-slug-setting') as HTMLElement;
							if (fpSlugSetting) {
								fpSlugSetting.setCssProps({ display: value === 'featured' ? 'block' : 'none' });
							}
							
							await this.applyCurrentConfiguration();
						});
					// Apply width directly to select element after it's created
					setTimeout(() => {
						const selectEl = setting.controlEl.querySelector('select');
						if (selectEl) {
							selectEl.setCssProps({
								width: '200px',
								minWidth: '200px',
								maxWidth: '200px'
							});
						}
					}, 0);
				});
		});

		// Featured post slug - with conditional visibility
		homeOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('fp-option-setting', 'fp-slug-setting');
			setting.settingEl.setCssProps({
				display: (settings.homeOptions?.featuredPost?.enabled ?? true) && (settings.homeOptions?.featuredPost?.type === 'featured') ? 'block' : 'none'
			});
			setting
				.setName('Featured post slug')
				.setDesc('Slug of the post to feature (e.g., "getting-started" for /posts/getting-started)')
				.addText(text => {
					// False positive: "getting-started" is a placeholder example, not UI text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					text.setPlaceholder('getting-started');
					text.setValue(settings.homeOptions?.featuredPost?.slug || 'getting-started');
					let timeoutId: number | null = null;
					text.onChange(async (value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						if (!settings.homeOptions?.featuredPost) {
							settings.homeOptions.featuredPost = { enabled: true, type: 'featured', slug: 'getting-started' };
						}
						settings.homeOptions.featuredPost.slug = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}
					});
				});
		});

		// Recent Posts
		homeOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of recent posts count
						const rpCountSetting = container.querySelector('.rp-count-setting') as HTMLElement;
						if (rpCountSetting) {
							rpCountSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Recent Posts count - with conditional visibility
		homeOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('rp-count-setting');
			setting.settingEl.setCssProps({
				display: (settings.homeOptions?.recentPosts?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Recent posts count')
				.setDesc('Number of recent posts to show')
				.addText(text => {
					text.setPlaceholder('7');
					text.setValue(String(settings.homeOptions?.recentPosts?.count || 7));
					let timeoutId: number | null = null;
					text.onChange(async (value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						const num = parseInt(value) || 7;
						if (!settings.homeOptions?.recentPosts) {
							settings.homeOptions.recentPosts = { enabled: true, count: 7 };
						}
						settings.homeOptions.recentPosts.count = num;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}
					});
				});
		});

		// Projects
		homeOptionsGroup.addSetting((setting) => {
			setting
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
						
						// Update visibility of projects count
						const pCountSetting = container.querySelector('.p-count-setting') as HTMLElement;
						if (pCountSetting) {
							pCountSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Projects count - with conditional visibility
		homeOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('p-count-setting');
			setting.settingEl.setCssProps({
				display: (settings.homeOptions?.projects?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Projects count')
				.setDesc('Number of projects to show')
				.addText(text => {
					text.setPlaceholder('2');
					text.setValue(String(settings.homeOptions?.projects?.count || 2));
					let timeoutId: number | null = null;
					text.onChange(async (value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						const num = parseInt(value) || 2;
						if (!settings.homeOptions?.projects) {
							settings.homeOptions.projects = { enabled: true, count: 2 };
						}
						settings.homeOptions.projects.count = num;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void (async () => {
								await this.applyCurrentConfiguration();
							})();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void (async () => {
								await this.applyCurrentConfiguration();
							})();
						}
					});
				});
		});

		// Docs
		homeOptionsGroup.addSetting((setting) => {
			setting
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
						
						// Update visibility of docs count
						const dCountSetting = container.querySelector('.d-count-setting') as HTMLElement;
						if (dCountSetting) {
							dCountSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Docs count - with conditional visibility
		homeOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('d-count-setting');
			setting.settingEl.setCssProps({
				display: (settings.homeOptions?.docs?.enabled ?? true) ? 'block' : 'none'
			});
			setting
				.setName('Docs count')
				.setDesc('Number of docs to show')
				.addText(text => {
					text.setPlaceholder('3');
					text.setValue(String(settings.homeOptions?.docs?.count || 3));
					let timeoutId: number | null = null;
					text.onChange(async (value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						const num = parseInt(value) || 3;
						if (!settings.homeOptions?.docs) {
							settings.homeOptions.docs = { enabled: true, count: 3 };
						}
						settings.homeOptions.docs.count = num;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void (async () => {
								await this.applyCurrentConfiguration();
							})();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void (async () => {
								await this.applyCurrentConfiguration();
							})();
						}
					});
				});
		});

		// Blurb placement
		homeOptionsGroup.addSetting((setting) => {
			setting
				.setName('Blurb placement')
				.setDesc('Where to place the blurb text on homepage')
				.addDropdown(dropdown => {
					dropdown
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
						});
					// Apply width directly to select element after it's created
					setTimeout(() => {
						const selectEl = setting.controlEl.querySelector('select');
						if (selectEl) {
							selectEl.setCssProps({
								width: '200px',
								minWidth: '200px',
								maxWidth: '200px'
							});
						}
					}, 0);
				});
		});

		// Post Options group with heading
		const postOptionsGroup = createSettingsGroup(container, 'Post options');

		// Posts per page
		postOptionsGroup.addSetting((setting) => {
			setting
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
		});

		// Reading time
		postOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		// Word count
		postOptionsGroup.addSetting((setting) => {
			setting
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
		postOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		// Linked Mentions
		postOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of compact view setting
						const lmCompactSetting = container.querySelector('.lm-compact-setting') as HTMLElement;
						if (lmCompactSetting) {
							lmCompactSetting.setCssProps({ display: value ? 'block' : 'none' });
						}
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Linked Mentions Compact - with conditional visibility
		postOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('lm-compact-setting');
			setting.settingEl.setCssProps({
				display: (settings.postOptions?.linkedMentions?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
		});

		// Graph view
		postOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of graph view options
						const gvSettings = container.querySelectorAll('.gv-option-setting');
						gvSettings.forEach((el) => {
							(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
						});
						
						await this.applyCurrentConfiguration();
					}));
		});

		// Graph View options - with conditional visibility
		postOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('gv-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.postOptions?.graphView?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
		});

		postOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('gv-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.postOptions?.graphView?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
		});

		postOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('gv-option-setting');
			setting.settingEl.setCssProps({
				display: (settings.postOptions?.graphView?.enabled ?? true) ? 'block' : 'none'
			});
			setting
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
		});

		// Post navigation
		postOptionsGroup.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});

		// Show post card cover images
		postOptionsGroup.addSetting((setting) => {
			setting
				.setName('Show post card cover images')
				.setDesc('Where to display cover images on post cards')
				.addDropdown(dropdown => {
					dropdown
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
							await (this.plugin as AstroModularPlugin).loadSettings();
							await this.applyCurrentConfiguration();
						});
					// Apply width directly to select element after it's created
					setTimeout(() => {
						const selectEl = setting.controlEl.querySelector('select');
						if (selectEl) {
							selectEl.setCssProps({
								width: '200px',
								minWidth: '200px',
								maxWidth: '200px'
							});
						}
					}, 0);
				});
		});

		// Post card aspect ratio
		postOptionsGroup.addSetting((setting) => {
			setting
				.setName('Post card aspect ratio')
				.setDesc('Aspect ratio for post card cover images')
				.addDropdown(dropdown => {
					dropdown
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
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Update visibility of custom aspect ratio setting
							const customARSetting = container.querySelector('.custom-ar-setting') as HTMLElement;
							if (customARSetting) {
								customARSetting.setCssProps({ display: value === 'custom' ? 'block' : 'none' });
							}
							
							await this.applyCurrentConfiguration();
						});
					// Apply width directly to select element after it's created
					setTimeout(() => {
						const selectEl = setting.controlEl.querySelector('select');
						if (selectEl) {
							selectEl.setCssProps({
								width: '200px',
								minWidth: '200px',
								maxWidth: '200px'
							});
						}
					}, 0);
				});
		});

		// Custom aspect ratio - with conditional visibility
		postOptionsGroup.addSetting((setting) => {
			setting.settingEl.classList.add('custom-ar-setting');
			setting.settingEl.setCssProps({
				display: (settings.postOptions?.postCardAspectRatio === 'custom') ? 'block' : 'none'
			});
			setting
				.setName('Custom aspect ratio')
				.setDesc('Custom aspect ratio in format "width/height" (e.g., "2.5/1")')
				.addText(text => {
					text.setValue(settings.postOptions?.customPostCardAspectRatio || '2.5/1');
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						if (!settings.postOptions) {
							settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', strict: '0', reactions: '1', metadata: '0', inputPosition: 'bottom', theme: 'preferred_color_scheme', lang: 'en', loading: 'lazy' } };
						}
						settings.postOptions.customPostCardAspectRatio = value;
						settings.features.customPostCardAspectRatio = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void (async () => {
								await (this.plugin as AstroModularPlugin).loadSettings();
								await this.applyCurrentConfiguration();
							})();
						}
					});
				});
			});
			});
		});

		// Optional Features group with heading
		const optionalFeaturesGroup = createSettingsGroup(container, 'Optional features');

		// Profile Picture (keep existing implementation)
		this.renderProfilePictureSetting(optionalFeaturesGroup, settings);

		// Post Comments (keep existing implementation, update title)
		this.renderCommentsSetting(optionalFeaturesGroup, settings);
	}

	private renderProfilePictureSetting(group: SettingsContainer, settings: AstroModularSettings): void {
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
		group.addSetting((setting) => {
			setting
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
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Update visibility of profile picture options
						const ppSettings = setting.settingEl.parentElement?.querySelectorAll('.pp-option-setting');
						if (ppSettings) {
							ppSettings.forEach((el) => {
								(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
							});
						}
						
						try {
							await this.applyCurrentConfiguration();
							new Notice(`Profile picture ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
						} catch (error) {
							new Notice(`Failed to apply profile picture to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
					}));
		});

		// Detailed options - add as custom setting within group
		group.addSetting((setting) => {
			setting.settingEl.classList.add('pp-option-setting');
			setting.settingEl.setCssProps({
				display: isEnabled ? 'block' : 'none',
				marginTop: '10px'
			});
			
			// Hide default UI elements and add custom container
			const nameEl = setting.settingEl.querySelector('.setting-item-name');
			const descEl = setting.settingEl.querySelector('.setting-item-description');
			const controlEl = setting.settingEl.querySelector('.setting-item-control');
			if (nameEl) (nameEl as HTMLElement).setCssProps({ display: 'none' });
			if (descEl) (descEl as HTMLElement).setCssProps({ display: 'none' });
			if (controlEl) (controlEl as HTMLElement).setCssProps({ display: 'none' });
			setting.settingEl.setCssProps({
				borderTop: 'none',
				paddingTop: '0',
				paddingBottom: '0'
			});
			
			const optionsContainer = setting.settingEl.createDiv('profile-picture-options');

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
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
					}));
		});
	}

	private renderCommentsSetting(group: SettingsContainer, settings: AstroModularSettings): void {
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
		group.addSetting((setting) => {
			setting
				.setName('Post comments')
				// False positive: "Giscus" is a proper noun (product name) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Enable Giscus comment system for posts')
				.addToggle(toggle => toggle
					.setValue(isEnabled)
					.onChange(async (value) => {
						// Update all three locations to ensure consistency
						settings.features.comments = value;
						
					// Update visibility of comments options first
					const commentsSettingsEls = setting.settingEl.parentElement?.querySelectorAll('.comments-option-setting');
					
					// Get existing comments settings or create default
					const existingComments = settings.postOptions?.comments || settings.optionalFeatures?.comments || { enabled: false, provider: 'giscus', repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname', term: '', reactionsEnabled: true, emitMetadata: false, inputPosition: 'bottom', lang: 'en', loading: 'lazy', rawScript: '' };
					
					// Ensure postOptions exists, but preserve existing comment settings
					if (!settings.postOptions) {
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: { ...existingComments } };
					}
					// Only update the enabled state, preserve all other comment settings
					settings.postOptions.comments.enabled = value;
					
					// Ensure optionalFeatures exists, but preserve existing comment settings
					if (!settings.optionalFeatures) {
						settings.optionalFeatures = { profilePicture: { enabled: false, image: '/profile.jpg', alt: 'Profile picture', size: 'md', url: '', placement: 'footer', style: 'circle' }, comments: { ...existingComments } };
					}
					// Only update the enabled state, preserve all other comment settings
					settings.optionalFeatures.comments.enabled = value;
					await this.plugin.saveData(settings);
					await (this.plugin as AstroModularPlugin).loadSettings();
					
					// Update visibility of comments options
					const commentsSettings = commentsSettingsEls;
						if (commentsSettings) {
							commentsSettings.forEach((el) => {
								(el as HTMLElement).setCssProps({ display: value ? 'block' : 'none' });
							});
						}
						
						try {
							await this.applyCurrentConfiguration();
							new Notice(`Comments system ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
						} catch (error) {
							new Notice(`Failed to apply comments system to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
					}));
		});

		// Options container - add as custom setting within group
		group.addSetting((setting) => {
			setting.settingEl.classList.add('comments-option-setting');
			setting.settingEl.setCssProps({
				display: isEnabled ? 'block' : 'none',
				marginTop: '10px'
			});
			
			// Hide default UI elements and add custom container
			const nameEl = setting.settingEl.querySelector('.setting-item-name');
			const descEl = setting.settingEl.querySelector('.setting-item-description');
			const controlEl = setting.settingEl.querySelector('.setting-item-control');
			if (nameEl) (nameEl as HTMLElement).setCssProps({ display: 'none' });
			if (descEl) (descEl as HTMLElement).setCssProps({ display: 'none' });
			if (controlEl) (controlEl as HTMLElement).setCssProps({ display: 'none' });
			setting.settingEl.setCssProps({
				borderTop: 'none',
				paddingTop: '0',
				paddingBottom: '0'
			});
			
			const optionsContainer = setting.settingEl.createDiv('comments-options');

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
						settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: settings.optionalFeatures.comments };
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
							settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: commentsSettings };
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
		});
	}
}
