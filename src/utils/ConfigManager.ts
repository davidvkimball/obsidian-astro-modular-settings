import { App, TFile, Notice } from 'obsidian';
import { AstroModularSettings, ConfigFileInfo, PresetTemplate } from '../types';

export class ConfigManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		this.configPath = '../config.ts';
		console.log('📁 Config path:', this.configPath);
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		console.log('🔍 Looking for config at:', this.configPath);
		console.log('🏠 Vault root path:', (this.app.vault.adapter as any).path);
		
		// Try to access the file outside the vault using Node.js fs
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
			console.log('🏠 Vault path object:', vaultPath);
			console.log('🏠 Vault path type:', typeof vaultPath);
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
			console.log('🏠 Vault path string:', vaultPathString);
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			console.log('🔍 Trying to read config from:', configPath);
			
			if (fs.existsSync(configPath)) {
				console.log('✅ Found config file outside vault at:', configPath);
				const content = fs.readFileSync(configPath, 'utf8');
				const stats = fs.statSync(configPath);
				return {
					exists: true,
					path: configPath,
					content: content,
					lastModified: new Date(stats.mtime),
					valid: true,
					errors: []
				};
			} else {
				console.log('❌ Config file not found at:', configPath);
				return {
					exists: false,
					path: configPath,
					content: '',
					lastModified: new Date(),
					valid: false,
					errors: ['Config file not found']
				};
			}
		} catch (error) {
			console.log('❌ Error accessing file outside vault:', error.message);
			return {
				exists: false,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: ['Cannot access file outside vault']
			};
		}
	}

	private validateConfigContent(content: string): boolean {
		// Basic validation - check for common Astro config patterns
		return content.includes('defineConfig') || 
			   content.includes('export default') ||
			   content.includes('astro/config');
	}

	async readConfig(): Promise<string> {
		const fileInfo = await this.getConfigFileInfo();
		return fileInfo.content;
	}

	async writeConfig(content: string): Promise<boolean> {
		console.log('📝 ConfigManager: Attempting to write config');
		
		// Try to write the file outside the vault using Node.js fs
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
			console.log('🏠 Vault path object:', vaultPath);
			console.log('🏠 Vault path type:', typeof vaultPath);
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
			console.log('🏠 Vault path string:', vaultPathString);
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			console.log('📁 Writing config to:', configPath);
			
			fs.writeFileSync(configPath, content, 'utf8');
			console.log('✅ Config file written successfully');
			return true;
		} catch (error) {
			console.log('❌ Error writing config file:', error.message);
			return false;
		}
	}

	async applyPreset(preset: PresetTemplate): Promise<boolean> {
		console.log('🔧 ConfigManager: Starting preset application');
		console.log('📋 Preset:', preset.name);
		console.log('⚙️ Settings:', preset.config);
		
		// Read the existing config file
		const currentConfig = await this.readConfig();
		console.log('📖 Current config length:', currentConfig.length);
		console.log('📖 Current config preview:', currentConfig.substring(0, 200) + '...');
		
		// Modify the existing config based on the preset
		const modifiedConfig = this.modifyConfigFromPreset(preset, currentConfig);
		console.log('🆕 Modified config length:', modifiedConfig.length);
		console.log('🆕 Modified config preview:', modifiedConfig.substring(0, 200) + '...');
		
		const writeResult = await this.writeConfig(modifiedConfig);
		console.log('💾 Write result:', writeResult);
		
		return writeResult;
	}

	private modifyConfigFromPreset(preset: PresetTemplate, currentConfig: string): string {
		const settings = preset.config as AstroModularSettings;
		
		console.log('🔄 ConfigManager: Modifying existing config from preset');
		console.log('🎨 Theme:', settings.currentTheme);
		console.log('🔤 Fonts:', settings.typography);
		console.log('🔍 Current config contains style:', currentConfig.includes('style: "circle"'));
		console.log('🔍 Current config contains pages:', currentConfig.includes('pages: false'));
		
		// Debug: Check if the regex patterns will match
		const searchRegex = /search:\s*\{\s*posts:\s*(true|false),\s*pages:\s*(true|false),\s*projects:\s*(true|false),\s*docs:\s*(true|false),\s*\}/;
		const styleRegex = /url:\s*"[^"]*",?\s*\/\/ Optional\s*,\s*placement:\s*"[^"]*",?\s*\/\/ "footer" or "header"\s*,\s*style:\s*"[^"]*",?\s*\/\/ "circle", "square", or "none"/;
		
		console.log('🔍 Search regex will match:', searchRegex.test(currentConfig));
		console.log('🔍 Style regex will match:', styleRegex.test(currentConfig));
		
		// Debug: Find all occurrences of "style:" in the config
		const styleMatches = currentConfig.match(/style:\s*"[^"]*"/g);
		console.log('🔍 All style matches:', styleMatches);
		
		// Debug: Find all occurrences of "pages:" in the config
		const pagesMatches = currentConfig.match(/pages:\s*(true|false)/g);
		console.log('🔍 All pages matches:', pagesMatches);
		
		// Debug: Check if the specific regex patterns will match
		const styleRegexTest = /style:\s*"[^"]*",?\s*\/\/ "circle", "square", or "none"/;
		const pagesRegexTest = /pages:\s*(true|false),/;
		
		console.log('🔍 Style regex test:', styleRegexTest.test(currentConfig));
		console.log('🔍 Pages regex test:', pagesRegexTest.test(currentConfig));
		
		// Debug: Find the exact context around style and pages
		const styleContext = currentConfig.match(/placement:\s*"[^"]*",?\s*\/\/ "footer" or "header"\s*,\s*style:\s*"[^"]*",?\s*\/\/ "circle", "square", or "none"/);
		console.log('🔍 Style context match:', styleContext);
		
		const pagesContext = currentConfig.match(/search:\s*\{\s*posts:\s*(true|false),\s*pages:\s*(true|false),\s*projects:\s*(true|false),\s*docs:\s*(true|false),\s*\}/);
		console.log('🔍 Pages context match:', pagesContext);
		
		// Get the template configuration based on the preset name
		const templateConfig = this.getTemplateConfig(preset.name, settings);
		
		let modifiedConfig = currentConfig;
		
		// Update theme - use marker-based replacement
		console.log('🔍 Looking for theme marker in config...');
		const themeMarkerExists = currentConfig.includes('// [CONFIG:THEME]');
		console.log('🔍 Theme marker exists:', themeMarkerExists);
		
		if (themeMarkerExists) {
			const themeRegex = /\/\/ \[CONFIG:THEME\]\s*\n\s*theme:\s*"[^"]*"/;
			const themeMatch = currentConfig.match(themeRegex);
			console.log('🔍 Theme regex match:', themeMatch);
			
			modifiedConfig = modifiedConfig.replace(
				themeRegex,
				`// [CONFIG:THEME]\n  theme: "${settings.currentTheme}"`
			);
			console.log('🔍 Theme replacement applied');
		} else {
			console.log('❌ Theme marker not found in config!');
		}
		
		// Update font source
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:FONT_SOURCE\]\s*\n\s*source:\s*"[^"]*"/,
			`// [CONFIG:FONT_SOURCE]\n    source: "${settings.typography.fontSource}"`
		);
		
		// Update font families
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:FONT_BODY\]\s*\n\s*body:\s*"[^"]*"/,
			`// [CONFIG:FONT_BODY]\n      body: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.prose : settings.typography.proseFont}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:FONT_HEADING\]\s*\n\s*heading:\s*"[^"]*"/,
			`// [CONFIG:FONT_HEADING]\n      heading: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.heading : settings.typography.headingFont}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:FONT_MONO\]\s*\n\s*mono:\s*"[^"]*"/,
			`// [CONFIG:FONT_MONO]\n      mono: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.mono : settings.typography.monoFont}"`
		);
		
		// Update deployment platform
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:DEPLOYMENT_PLATFORM\]\s*\n\s*platform:\s*"[^"]*"/,
			`// [CONFIG:DEPLOYMENT_PLATFORM]\n    platform: "${settings.deployment.platform}"`
		);
		
		// Update layout content width if specified in template
		if (templateConfig.layout?.contentWidth) {
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:LAYOUT_CONTENT_WIDTH\]\s*\n\s*contentWidth:\s*"[^"]*"/,
				`// [CONFIG:LAYOUT_CONTENT_WIDTH]\n    contentWidth: "${templateConfig.layout.contentWidth}"`
			);
		}
		
		// Update optional content types if specified in template
		if (templateConfig.optionalContentTypes) {
			if (templateConfig.optionalContentTypes.projects !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS\]\s*\n\s*projects:\s*(true|false)/,
					`// [CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS]\n    projects: ${templateConfig.optionalContentTypes.projects}`
				);
			}
			if (templateConfig.optionalContentTypes.docs !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_DOCS\]\s*\n\s*docs:\s*(true|false)/,
					`// [CONFIG:OPTIONAL_CONTENT_TYPES_DOCS]\n    docs: ${templateConfig.optionalContentTypes.docs}`
				);
			}
		}
		
		// Update dark mode toggle button if specified in template
		if (templateConfig.darkModeToggleButton) {
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:DARK_MODE_TOGGLE_BUTTON\]\s*\n\s*darkModeToggleButton:\s*"[^"]*"/,
				`// [CONFIG:DARK_MODE_TOGGLE_BUTTON]\n  darkModeToggleButton: "${templateConfig.darkModeToggleButton}"`
			);
		}
		
		// Update footer settings if specified in template
		// NOTE: We only update showSocialIconsInFooter and enabled, NEVER the footer.content
		if (templateConfig.footer) {
			// Update footer enabled state
			if (templateConfig.footer.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:FOOTER_ENABLED\]\s*enabled:\s*(true|false)/,
					`// [CONFIG:FOOTER_ENABLED]\n    enabled: ${templateConfig.footer.enabled}`
				);
			}
			// Update footer social icons
			if (templateConfig.footer.showSocialIconsInFooter !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:FOOTER_SHOW_SOCIAL_ICONS\]\s*showSocialIconsInFooter:\s*(true|false)/,
					`// [CONFIG:FOOTER_SHOW_SOCIAL_ICONS]\n    showSocialIconsInFooter: ${templateConfig.footer.showSocialIconsInFooter}`
				);
			}
		}
		
		// Update navigation settings if specified in template
		if (templateConfig.navigation) {
			// Update navigation style
			if (templateConfig.navigation.style) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:NAVIGATION_STYLE\]\s*style:\s*"[^"]*"/,
					`// [CONFIG:NAVIGATION_STYLE]\n    style: "${templateConfig.navigation.style}"`
				);
			}
			
			// Update showNavigation
			if (templateConfig.navigation.showNavigation !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:NAVIGATION_SHOW_NAVIGATION\]\s*showNavigation:\s*(true|false)/,
					`// [CONFIG:NAVIGATION_SHOW_NAVIGATION]\n    showNavigation: ${templateConfig.navigation.showNavigation}`
				);
			}
			
			// Update showMobileMenu
			if (templateConfig.navigation.showMobileMenu !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:NAVIGATION_SHOW_MOBILE_MENU\]\s*showMobileMenu:\s*(true|false)/,
					`// [CONFIG:NAVIGATION_SHOW_MOBILE_MENU]\n    showMobileMenu: ${templateConfig.navigation.showMobileMenu}`
				);
			}
		}
		
		// Update command palette settings if specified in template
		if (templateConfig.commandPalette) {
			// Update enabled state
			if (templateConfig.commandPalette.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_ENABLED\]\s*enabled:\s*(true|false)/,
					`// [CONFIG:COMMAND_PALETTE_ENABLED]\n    enabled: ${templateConfig.commandPalette.enabled}`
				);
			}
			
			// Update shortcut
			if (templateConfig.commandPalette.shortcut !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_SHORTCUT\]\s*shortcut:\s*"[^"]*"/,
					`// [CONFIG:COMMAND_PALETTE_SHORTCUT]\n    shortcut: "${templateConfig.commandPalette.shortcut}"`
				);
			}
			
			// Update placeholder
			if (templateConfig.commandPalette.placeholder !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_PLACEHOLDER\]\s*placeholder:\s*"[^"]*"/,
					`// [CONFIG:COMMAND_PALETTE_PLACEHOLDER]\n    placeholder: "${templateConfig.commandPalette.placeholder}"`
				);
			}
			
		// Update search settings - use individual markers
		if (templateConfig.commandPalette.search) {
			console.log('🔍 Template search config:', templateConfig.commandPalette.search);
			
			// Update each search setting individually
			if (templateConfig.commandPalette.search.posts !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_POSTS\]\s*posts:\s*(true|false)/,
					`// [CONFIG:COMMAND_PALETTE_SEARCH_POSTS]\n      posts: ${templateConfig.commandPalette.search.posts}`
				);
			}
			if (templateConfig.commandPalette.search.pages !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_PAGES\]\s*pages:\s*(true|false)/,
					`// [CONFIG:COMMAND_PALETTE_SEARCH_PAGES]\n      pages: ${templateConfig.commandPalette.search.pages}`
				);
			}
			if (templateConfig.commandPalette.search.projects !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_PROJECTS\]\s*projects:\s*(true|false)/,
					`// [CONFIG:COMMAND_PALETTE_SEARCH_PROJECTS]\n      projects: ${templateConfig.commandPalette.search.projects}`
				);
			}
			if (templateConfig.commandPalette.search.docs !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_DOCS\]\s*docs:\s*(true|false)/,
					`// [CONFIG:COMMAND_PALETTE_SEARCH_DOCS]\n      docs: ${templateConfig.commandPalette.search.docs}`
				);
			}
			
			console.log('🔍 Search replacement completed');
		}
			
			// Update sections settings - use individual markers
			if (templateConfig.commandPalette.sections) {
				console.log('🔍 Template sections config:', templateConfig.commandPalette.sections);
				
				// Update each section setting individually
				if (templateConfig.commandPalette.sections.quickActions !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_QUICK_ACTIONS\]\s*quickActions:\s*(true|false)/,
						`// [CONFIG:COMMAND_PALETTE_SECTIONS_QUICK_ACTIONS]\n      quickActions: ${templateConfig.commandPalette.sections.quickActions}`
					);
				}
				if (templateConfig.commandPalette.sections.pages !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_PAGES\]\s*pages:\s*(true|false)/,
						`// [CONFIG:COMMAND_PALETTE_SECTIONS_PAGES]\n      pages: ${templateConfig.commandPalette.sections.pages}`
					);
				}
				if (templateConfig.commandPalette.sections.social !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_SOCIAL\]\s*social:\s*(true|false)/,
						`// [CONFIG:COMMAND_PALETTE_SECTIONS_SOCIAL]\n      social: ${templateConfig.commandPalette.sections.social}`
					);
				}
				
				console.log('🔍 Sections replacement completed');
			}
		}
		
		// Update home options if specified in template
		if (templateConfig.homeOptions) {
			// Update featured post settings
			if (templateConfig.homeOptions.featuredPost) {
				if (templateConfig.homeOptions.featuredPost.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_FEATURED_POST_ENABLED\]\s*enabled:\s*(true|false)/,
						`// [CONFIG:HOME_OPTIONS_FEATURED_POST_ENABLED]\n      enabled: ${templateConfig.homeOptions.featuredPost.enabled}`
					);
				}
				if (templateConfig.homeOptions.featuredPost.type) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_FEATURED_POST_TYPE\]\s*type:\s*"[^"]*"/,
						`// [CONFIG:HOME_OPTIONS_FEATURED_POST_TYPE]\n      type: "${templateConfig.homeOptions.featuredPost.type}"`
					);
				}
			}
			
			// Update recent posts settings
			if (templateConfig.homeOptions.recentPosts) {
				if (templateConfig.homeOptions.recentPosts.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_RECENT_POSTS_ENABLED\]\s*enabled:\s*(true|false)/,
						`// [CONFIG:HOME_OPTIONS_RECENT_POSTS_ENABLED]\n      enabled: ${templateConfig.homeOptions.recentPosts.enabled}`
					);
				}
				if (templateConfig.homeOptions.recentPosts.count) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_RECENT_POSTS_COUNT\]\s*count:\s*\d+/,
						`// [CONFIG:HOME_OPTIONS_RECENT_POSTS_COUNT]\n      count: ${templateConfig.homeOptions.recentPosts.count}`
					);
				}
			}
			
			// Update projects settings
			if (templateConfig.homeOptions.projects) {
				if (templateConfig.homeOptions.projects.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_PROJECTS_ENABLED\]\s*enabled:\s*(true|false)/,
						`// [CONFIG:HOME_OPTIONS_PROJECTS_ENABLED]\n      enabled: ${templateConfig.homeOptions.projects.enabled}`
					);
				}
				if (templateConfig.homeOptions.projects.count) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_PROJECTS_COUNT\]\s*count:\s*\d+/,
						`// [CONFIG:HOME_OPTIONS_PROJECTS_COUNT]\n      count: ${templateConfig.homeOptions.projects.count}`
					);
				}
			}
			
			// Update docs settings
			if (templateConfig.homeOptions.docs) {
				if (templateConfig.homeOptions.docs.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_DOCS_ENABLED\]\s*enabled:\s*(true|false)/,
						`// [CONFIG:HOME_OPTIONS_DOCS_ENABLED]\n      enabled: ${templateConfig.homeOptions.docs.enabled}`
					);
				}
				if (templateConfig.homeOptions.docs.count) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:HOME_OPTIONS_DOCS_COUNT\]\s*count:\s*\d+/,
						`// [CONFIG:HOME_OPTIONS_DOCS_COUNT]\n      count: ${templateConfig.homeOptions.docs.count}`
					);
				}
			}
			
			// Update blurb placement
			if (templateConfig.homeOptions.blurb?.placement) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:HOME_OPTIONS_BLURB_PLACEMENT\]\s*placement:\s*"[^"]*"/,
					`// [CONFIG:HOME_OPTIONS_BLURB_PLACEMENT]\n      placement: "${templateConfig.homeOptions.blurb.placement}"`
				);
			}
		}
		
		// Update post options if specified in template
		if (templateConfig.postOptions) {
			// Update posts per page
			if (templateConfig.postOptions.postsPerPage) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_POSTS_PER_PAGE\]\s*postsPerPage:\s*\d+/,
					`// [CONFIG:POST_OPTIONS_POSTS_PER_PAGE]\n    postsPerPage: ${templateConfig.postOptions.postsPerPage}`
				);
			}
			
			// Update boolean features with marker-based replacement
			const booleanFeatures = [
				{ key: 'readingTime', marker: 'CONFIG:POST_OPTIONS_READING_TIME' },
				{ key: 'wordCount', marker: 'CONFIG:POST_OPTIONS_WORD_COUNT' },
				{ key: 'tableOfContents', marker: 'CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS' },
				{ key: 'tags', marker: 'CONFIG:POST_OPTIONS_TAGS' },
				{ key: 'postNavigation', marker: 'CONFIG:POST_OPTIONS_POST_NAVIGATION' }
			];
			
			booleanFeatures.forEach(feature => {
				if (templateConfig.postOptions[feature.key] !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						new RegExp(`// \\[${feature.marker}\\]\\s*${feature.key}:\\s*(true|false)`),
						`// [${feature.marker}]\n    ${feature.key}: ${templateConfig.postOptions[feature.key]}`
					);
				}
			});
			
			// Update linked mentions settings
			if (templateConfig.postOptions.linkedMentions) {
				if (templateConfig.postOptions.linkedMentions.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED\]\s*enabled:\s*(true|false)/,
						`// [CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED]\n      enabled: ${templateConfig.postOptions.linkedMentions.enabled}`
					);
				}
				if (templateConfig.postOptions.linkedMentions.linkedMentionsCompact !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT\]\s*linkedMentionsCompact:\s*(true|false)/,
						`// [CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT]\n      linkedMentionsCompact: ${templateConfig.postOptions.linkedMentions.linkedMentionsCompact}`
					);
				}
			}
			
		// Update graph view settings with marker-based replacement
		if (templateConfig.postOptions.graphView) {
			// Update enabled state
			if (templateConfig.postOptions.graphView.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED\]\s*enabled:\s*(true|false)/,
					`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED]\n    enabled: ${templateConfig.postOptions.graphView.enabled}`
				);
			}
			// Update showInSidebar state
			if (templateConfig.postOptions.graphView.showInSidebar !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_SIDEBAR\]\s*showInSidebar:\s*(true|false)/,
					`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_SIDEBAR]\n      showInSidebar: ${templateConfig.postOptions.graphView.showInSidebar}`
				);
			}
			// Update showInCommandPalette state
			if (templateConfig.postOptions.graphView.showInCommandPalette !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_COMMAND_PALETTE\]\s*showInCommandPalette:\s*(true|false)/,
					`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_COMMAND_PALETTE]\n      showInCommandPalette: ${templateConfig.postOptions.graphView.showInCommandPalette}`
				);
			}
			// Update maxNodes
			if (templateConfig.postOptions.graphView.maxNodes) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_MAX_NODES\]\s*maxNodes:\s*\d+/,
					`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_MAX_NODES]\n      maxNodes: ${templateConfig.postOptions.graphView.maxNodes}`
				);
			}
			// Update showOrphanedPosts
			if (templateConfig.postOptions.graphView.showOrphanedPosts !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_ORPHANED_POSTS\]\s*showOrphanedPosts:\s*(true|false)/,
					`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_ORPHANED_POSTS]\n      showOrphanedPosts: ${templateConfig.postOptions.graphView.showOrphanedPosts}`
				);
			}
		}
			
			// Update post card settings
			if (templateConfig.postOptions.showPostCardCoverImages) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES\]\s*showPostCardCoverImages:\s*"[^"]*"/,
					`// [CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES]\n    showPostCardCoverImages: "${templateConfig.postOptions.showPostCardCoverImages}"`
				);
			}
			if (templateConfig.postOptions.postCardAspectRatio) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO\]\s*postCardAspectRatio:\s*"[^"]*"/,
					`// [CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO]\n    postCardAspectRatio: "${templateConfig.postOptions.postCardAspectRatio}"`
				);
			}
			if (templateConfig.postOptions.customPostCardAspectRatio) {
				modifiedConfig = modifiedConfig.replace(
					/\/\/ \[CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO\]\s*customPostCardAspectRatio:\s*"[^"]*"/,
					`// [CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO]\n    customPostCardAspectRatio: "${templateConfig.postOptions.customPostCardAspectRatio}"`
				);
			}
		}
		
		// Update profile picture settings - always update enabled state, other settings only if enabled
		// Update enabled state (always update this)
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:PROFILE_PICTURE_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:PROFILE_PICTURE_ENABLED]\n    enabled: ${settings.optionalFeatures.profilePicture.enabled}`
		);
		
		// Update other profile picture settings only if enabled
		if (settings.optionalFeatures.profilePicture.enabled) {
			// Update image
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_IMAGE\]\s*image:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_IMAGE]\n    image: "${settings.optionalFeatures.profilePicture.image}"`
			);
			// Update alt
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_ALT\]\s*alt:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_ALT]\n    alt: "${settings.optionalFeatures.profilePicture.alt}"`
			);
			// Update size
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_SIZE\]\s*size:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_SIZE]\n    size: "${settings.optionalFeatures.profilePicture.size}"`
			);
			// Update url
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_URL\]\s*url:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_URL]\n    url: "${settings.optionalFeatures.profilePicture.url || ''}"`
			);
			// Update placement
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_PLACEMENT\]\s*placement:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_PLACEMENT]\n    placement: "${settings.optionalFeatures.profilePicture.placement}"`
			);
			// Update style
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:PROFILE_PICTURE_STYLE\]\s*style:\s*"[^"]*"/,
				`// [CONFIG:PROFILE_PICTURE_STYLE]\n    style: "${settings.optionalFeatures.profilePicture.style}"`
			);
		}
		
		// Update comments settings
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_COMMENTS_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_COMMENTS_ENABLED]\n      enabled: ${settings.optionalFeatures.comments.enabled}`
		);
		
		// Validate markers are present
		const markerValidation = this.validateMarkers(modifiedConfig);
		if (!markerValidation.valid) {
			console.error('❌ Config modification failed: Missing markers:', markerValidation.missing);
			console.error('Please ensure all CONFIG markers are present in your config.ts file');
			return currentConfig; // Return original config if markers are missing
		}
		
		// Validate the modified config has proper syntax
		try {
			// Check for basic syntax issues
			const openBraces = (modifiedConfig.match(/\{/g) || []).length;
			const closeBraces = (modifiedConfig.match(/\}/g) || []).length;
			const openBrackets = (modifiedConfig.match(/\[/g) || []).length;
			const closeBrackets = (modifiedConfig.match(/\]/g) || []).length;
			
			if (openBraces !== closeBraces) {
				console.error('❌ Config modification failed: Mismatched braces');
				return currentConfig; // Return original config if syntax is broken
			}
			
			if (openBrackets !== closeBrackets) {
				console.error('❌ Config modification failed: Mismatched brackets');
				return currentConfig; // Return original config if syntax is broken
			}
			
			console.log('✅ Config modification complete');
		} catch (error) {
			console.error('❌ Config validation failed:', error);
			return currentConfig; // Return original config if validation fails
		}
		
		// Update site information
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SITE_URL\]\s*\n\s*site:\s*"[^"]*"/,
			`// [CONFIG:SITE_URL]\n  site: "${settings.siteInfo.site}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SITE_TITLE\]\s*\n\s*title:\s*"[^"]*"/,
			`// [CONFIG:SITE_TITLE]\n  title: "${settings.siteInfo.title}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SITE_DESCRIPTION\]\s*\n\s*description:\s*"[^"]*"/,
			`// [CONFIG:SITE_DESCRIPTION]\n  description: "${settings.siteInfo.description}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SITE_AUTHOR\]\s*\n\s*author:\s*"[^"]*"/,
			`// [CONFIG:SITE_AUTHOR]\n  author: "${settings.siteInfo.author}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SITE_LANGUAGE\]\s*\n\s*language:\s*"[^"]*"/,
			`// [CONFIG:SITE_LANGUAGE]\n  language: "${settings.siteInfo.language}"`
		);
		
		// Update navigation pages
		const pagesArray = settings.navigation.pages.map(page => 
			`      { title: "${page.title}", url: "${page.url}" }`
		).join(',\n');
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:NAVIGATION_PAGES\]\s*\n\s*pages:\s*\[[\s\S]*?\]/,
			`// [CONFIG:NAVIGATION_PAGES]\n    pages: [\n${pagesArray},\n    ]`
		);
		
		// Update navigation social
		const socialArray = settings.navigation.social.map(social => 
			`      {\n        title: "${social.title}",\n        url: "${social.url}",\n        icon: "${social.icon}",\n      }`
		).join(',\n');
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:NAVIGATION_SOCIAL\]\s*\n\s*social:\s*\[[\s\S]*?\]/,
			`// [CONFIG:NAVIGATION_SOCIAL]\n    social: [\n${socialArray},\n    ]`
		);
		
		return modifiedConfig;
	}

	private validateMarkers(config: string): { valid: boolean; missing: string[] } {
		const requiredMarkers = [
			'CONFIG:SITE_URL',
			'CONFIG:SITE_TITLE',
			'CONFIG:SITE_DESCRIPTION',
			'CONFIG:SITE_AUTHOR',
			'CONFIG:SITE_LANGUAGE',
			'CONFIG:THEME',
			'CONFIG:FONT_SOURCE',
			'CONFIG:FONT_BODY',
			'CONFIG:FONT_HEADING',
			'CONFIG:FONT_MONO',
			'CONFIG:LAYOUT_CONTENT_WIDTH',
			'CONFIG:FOOTER_ENABLED',
			'CONFIG:FOOTER_SHOW_SOCIAL_ICONS',
			'CONFIG:SCROLL_TO_TOP',
			'CONFIG:DARK_MODE_TOGGLE_BUTTON',
			'CONFIG:DEPLOYMENT_PLATFORM',
			'CONFIG:COMMAND_PALETTE_ENABLED',
			'CONFIG:COMMAND_PALETTE_SHORTCUT',
			'CONFIG:COMMAND_PALETTE_PLACEHOLDER',
			'CONFIG:COMMAND_PALETTE_SEARCH_POSTS',
			'CONFIG:COMMAND_PALETTE_SEARCH_PAGES',
			'CONFIG:COMMAND_PALETTE_SEARCH_PROJECTS',
			'CONFIG:COMMAND_PALETTE_SEARCH_DOCS',
			'CONFIG:COMMAND_PALETTE_SECTIONS_QUICK_ACTIONS',
			'CONFIG:COMMAND_PALETTE_SECTIONS_PAGES',
			'CONFIG:COMMAND_PALETTE_SECTIONS_SOCIAL',
			'CONFIG:PROFILE_PICTURE_ENABLED',
			'CONFIG:PROFILE_PICTURE_IMAGE',
			'CONFIG:PROFILE_PICTURE_ALT',
			'CONFIG:PROFILE_PICTURE_SIZE',
			'CONFIG:PROFILE_PICTURE_URL',
			'CONFIG:PROFILE_PICTURE_PLACEMENT',
			'CONFIG:PROFILE_PICTURE_STYLE',
			'CONFIG:NAVIGATION_SHOW_NAVIGATION',
			'CONFIG:NAVIGATION_STYLE',
			'CONFIG:NAVIGATION_SHOW_MOBILE_MENU',
			'CONFIG:NAVIGATION_PAGES',
			'CONFIG:NAVIGATION_SOCIAL',
			'CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS',
			'CONFIG:OPTIONAL_CONTENT_TYPES_DOCS',
			'CONFIG:HOME_OPTIONS_FEATURED_POST_ENABLED',
			'CONFIG:HOME_OPTIONS_FEATURED_POST_TYPE',
			'CONFIG:HOME_OPTIONS_FEATURED_POST_SLUG',
			'CONFIG:HOME_OPTIONS_RECENT_POSTS_ENABLED',
			'CONFIG:HOME_OPTIONS_RECENT_POSTS_COUNT',
			'CONFIG:HOME_OPTIONS_PROJECTS_ENABLED',
			'CONFIG:HOME_OPTIONS_PROJECTS_COUNT',
			'CONFIG:HOME_OPTIONS_DOCS_ENABLED',
			'CONFIG:HOME_OPTIONS_DOCS_COUNT',
			'CONFIG:HOME_OPTIONS_BLURB_PLACEMENT',
			'CONFIG:POST_OPTIONS_POSTS_PER_PAGE',
			'CONFIG:POST_OPTIONS_READING_TIME',
			'CONFIG:POST_OPTIONS_WORD_COUNT',
			'CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS',
			'CONFIG:POST_OPTIONS_TAGS',
			'CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED',
			'CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT',
			'CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED',
			'CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_SIDEBAR',
			'CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_COMMAND_PALETTE',
			'CONFIG:POST_OPTIONS_GRAPH_VIEW_MAX_NODES',
			'CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_ORPHANED_POSTS',
			'CONFIG:POST_OPTIONS_POST_NAVIGATION',
			'CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES',
			'CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO',
			'CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO',
			'CONFIG:POST_OPTIONS_COMMENTS_ENABLED'
		];
		
		const missing = requiredMarkers.filter(marker => 
			!config.includes(`// [${marker}]`)
		);
		
		return { valid: missing.length === 0, missing };
	}

	private interpolateTemplate(template: string, settings: AstroModularSettings, templateName: string): string {
		console.log('🔄 ConfigManager: Interpolating template variables');
		console.log('🎨 Theme:', settings.currentTheme);
		console.log('📝 Font source:', settings.typography.fontSource);
		console.log('🔤 Prose font:', settings.typography.proseFont);
		console.log('📋 Template name:', templateName);
		
		// Replace all template variables with actual values
		const result = template
			.replace(/\$\{settings\.currentTheme\}/g, settings.currentTheme)
			.replace(/\$\{settings\.typography\.fontSource\}/g, settings.typography.fontSource)
			.replace(/\$\{settings\.typography\.proseFont\}/g, settings.typography.proseFont)
			.replace(/\$\{settings\.typography\.headingFont\}/g, settings.typography.headingFont)
			.replace(/\$\{settings\.typography\.monoFont\}/g, settings.typography.monoFont)
			.replace(/\$\{settings\.typography\.customFonts\.prose\}/g, settings.typography.customFonts.prose)
			.replace(/\$\{settings\.typography\.customFonts\.heading\}/g, settings.typography.customFonts.heading)
			.replace(/\$\{settings\.typography\.customFonts\.mono\}/g, settings.typography.customFonts.mono)
			.replace(/\$\{settings\.optionalFeatures\.comments\.enabled\}/g, settings.optionalFeatures.comments.enabled.toString())
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.enabled\}/g, settings.optionalFeatures.profilePicture.enabled.toString())
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.image\}/g, settings.optionalFeatures.profilePicture.image)
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.alt\}/g, settings.optionalFeatures.profilePicture.alt)
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.size\}/g, settings.optionalFeatures.profilePicture.size)
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.url\}/g, settings.optionalFeatures.profilePicture.url || '')
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.placement\}/g, settings.optionalFeatures.profilePicture.placement)
			.replace(/\$\{settings\.optionalFeatures\.profilePicture\.style\}/g, settings.optionalFeatures.profilePicture.style)
			.replace(/\$\{settings\.deployment\.platform\}/g, settings.deployment.platform)
			.replace(/\$\{templateName\}/g, templateName);
		
		console.log('✅ Template interpolation complete');
		console.log('🔍 Sample of interpolated result:', result.substring(0, 300) + '...');
		
		return result;
	}

	private getTemplateConfig(templateName: string, settings: AstroModularSettings): any {
		// Return template-specific configuration based on the preset name
		switch (templateName) {
            case 'standard':
              return {
        layout: {
          contentWidth: '45rem',
        },
        footer: {
          enabled: true,
          showSocialIconsInFooter: true,
        },
        darkModeToggleButton: 'both',
        commandPalette: {
          enabled: true,
          shortcut: "ctrl+K",
          placeholder: "Search posts",
						search: {
							posts: true,
							pages: false,
							projects: false,
							docs: false,
						},
          sections: {
            quickActions: true,
            pages: true,
            social: true,
          },
        },
        optionalContentTypes: {
          projects: true,
          docs: true,
        },
        homeOptions: {
          featuredPost: {
            enabled: true,
            type: 'latest',
          },
          recentPosts: {
            enabled: true,
            count: 7,
          },
          projects: {
							enabled: true,
            count: 2,
          },
          docs: {
							enabled: true,
            count: 3,
          },
          blurb: {
            placement: 'below',
          },
        },
        postOptions: {
          postsPerPage: 6,
          readingTime: true,
          wordCount: true,
          tableOfContents: true,
          tags: true,
          linkedMentions: {
            enabled: true,
            linkedMentionsCompact: false,
          },
          graphView: {
            enabled: true,
            showInSidebar: true,
            showInCommandPalette: true,
            maxNodes: 100,
          },
          postNavigation: true,
          showPostCardCoverImages: 'featured-and-posts',
          postCardAspectRatio: 'og',
        },
        navigation: {
          showNavigation: true,
          showMobileMenu: true,
          style: 'traditional',
        },
      };
            case 'compact':
              return {
        layout: {
          contentWidth: '42rem',
        },
        optionalContentTypes: {
          projects: false,
          docs: false,
        },
        footer: {
          showSocialIconsInFooter: false,
        },
        darkModeToggleButton: 'commandPalette',
        commandPalette: {
          enabled: true,
          shortcut: "ctrl+K",
          placeholder: "Search posts",
						search: {
							posts: true,
							pages: false,
							projects: false,
							docs: false,
						},
          sections: {
            quickActions: true,
            pages: false,
            social: true,
          },
        },
        homeOptions: {
          featuredPost: {
            enabled: false,
            type: 'latest',
          },
          recentPosts: {
            enabled: true,
            count: 7,
          },
          blurb: {
            placement: 'below',
          },
        },
        postOptions: {
          postsPerPage: 6,
          readingTime: true,
          wordCount: true,
          tableOfContents: true,
          tags: true,
          linkedMentions: {
            enabled: true,
            linkedMentionsCompact: true,
          },
          graphView: {
            enabled: false,
          },
          postNavigation: true,
          showPostCardCoverImages: 'posts',
          postCardAspectRatio: 'custom',
          customPostCardAspectRatio: '2.5/1',
        },
        navigation: {
          showNavigation: true,
          showMobileMenu: true,
          style: 'minimal',
        },
      };
            case 'minimal':
              return {
        layout: {
          contentWidth: '40rem',
        },
        optionalContentTypes: {
          projects: false,
          docs: false,
        },
        footer: {
          showSocialIconsInFooter: false,
        },
        darkModeToggleButton: 'commandPalette',
        commandPalette: {
          enabled: true,
          shortcut: "",
          placeholder: "Search content",
						search: {
							posts: true,
							pages: true,
							projects: false,
							docs: false,
						},
          sections: {
            quickActions: false,
            pages: false,
            social: false,
          },
        },
        homeOptions: {
          featuredPost: {
            enabled: false,
            type: 'latest',
          },
          recentPosts: {
            enabled: true,
            count: 7,
          },
          blurb: {
            placement: 'none',
          },
        },
        postOptions: {
          postsPerPage: 6,
          readingTime: false,
          wordCount: false,
          tableOfContents: false,
          tags: false,
          linkedMentions: {
            enabled: false,
            linkedMentionsCompact: false,
          },
          graphView: {
            enabled: false,
          },
          postNavigation: false,
          showPostCardCoverImages: 'none',
          postCardAspectRatio: 'og',
        },
        navigation: {
          showNavigation: false,
          showMobileMenu: false,
          style: 'minimal',
        },
      };
    default:
      return {};
  }
	}

	async detectAstroDevServer(): Promise<boolean> {
		// Check if Astro dev server is running by looking for common indicators
		// This is a simplified check - in reality you'd need more sophisticated detection
		const packageJson = this.app.vault.getAbstractFileByPath('package.json');
		if (packageJson) {
			try {
				const content = await this.app.vault.read(packageJson as TFile);
				return content.includes('astro') && content.includes('dev');
			} catch {
				return false;
			}
		}
		return false;
	}

	async triggerRebuild(): Promise<void> {
		// In a real implementation, you might:
		// 1. Send a signal to the Astro dev server
		// 2. Use the Shell Commands plugin to restart the dev server
		// 3. Show instructions to the user
		// Notice will be shown by the main setup completion
	}
}
