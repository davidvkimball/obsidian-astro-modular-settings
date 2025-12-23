import { App, TFile } from 'obsidian';
import { ConfigFileInfo, ObsidianVaultAdapter } from '../../types';

export class ConfigFileManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		// The main Astro config.ts file is at src/config.ts (two levels up from vault)
		this.configPath = '../../src/config.ts';
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		// The main Astro config.ts file is at src/config.ts (two levels up from vault)
		// NOTE: This plugin accesses files outside the Obsidian vault to manage Astro configuration.
		// This is necessary for the plugin's core functionality of managing Astro Modular theme settings.
		
		// Try to access the file outside the vault using Node.js fs
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const fs = require('fs') as typeof import('fs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const path = require('path') as typeof import('path');
		try {
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', '..', 'src', 'config.ts');
			
			if (fs.existsSync(configPath)) {
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
				return {
					exists: false,
					path: configPath,
					content: '',
					lastModified: new Date(),
					valid: false,
					errors: ['Config file not found']
				};
			}
		} catch {
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
		// Try to write the file outside the vault using Node.js fs
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const fs = require('fs') as typeof import('fs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const path = require('path') as typeof import('path');
		try {
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', '..', 'src', 'config.ts');
			
			fs.writeFileSync(configPath, content, 'utf8');
			return true;
		} catch {
			return false;
		}
	}

	async detectAstroDevServer(): Promise<boolean> {
		// Check if Astro dev server is running by looking for common indicators
		// This is a simplified check - in reality you'd need more sophisticated detection
		const packageJson = this.app.vault.getAbstractFileByPath('package.json');
		if (packageJson && packageJson instanceof TFile) {
			try {
				const content = await this.app.vault.read(packageJson);
				return content.includes('astro') && content.includes('dev');
			} catch {
				return false;
			}
		}
		return false;
	}

	async parseConfigFile(content?: string): Promise<Record<string, unknown> | null> {
		// Parse the config.ts file to extract current settings
		// This extracts all key settings from the config using the marker system
		
		const configContent = content || await this.readConfig();
		if (!configContent) {
			return null;
		}

		const config: Record<string, unknown> = {};

		// Extract site information
		const siteInfo: Record<string, unknown> = {};
		const siteUrlMatch = configContent.match(/\/\/ \[CONFIG:SITE_URL\]\s*\n\s*site:\s*"([^"]*)"/);
		if (siteUrlMatch) {
			siteInfo.site = siteUrlMatch[1];
		}
		
		const siteTitleMatch = configContent.match(/\/\/ \[CONFIG:SITE_TITLE\]\s*\n\s*title:\s*"([^"]*)"/);
		if (siteTitleMatch) {
			siteInfo.title = siteTitleMatch[1];
		}
		
		const siteDescMatch = configContent.match(/\/\/ \[CONFIG:SITE_DESCRIPTION\]\s*\n\s*description:\s*"([^"]*)"/);
		if (siteDescMatch) {
			siteInfo.description = siteDescMatch[1];
		}
		
		const siteAuthorMatch = configContent.match(/\/\/ \[CONFIG:SITE_AUTHOR\]\s*\n\s*author:\s*"([^"]*)"/);
		if (siteAuthorMatch) {
			siteInfo.author = siteAuthorMatch[1];
		}
		
		const siteLangMatch = configContent.match(/\/\/ \[CONFIG:SITE_LANGUAGE\]\s*\n\s*language:\s*"([^"]*)"/);
		if (siteLangMatch) {
			siteInfo.language = siteLangMatch[1];
		}
		config.siteInfo = siteInfo;
		
		const faviconThemeAdaptiveMatch = configContent.match(/\/\/ \[CONFIG:FAVICON_THEME_ADAPTIVE\]\s*\n\s*faviconThemeAdaptive:\s*(true|false)/);
		if (faviconThemeAdaptiveMatch) {
			config.faviconThemeAdaptive = faviconThemeAdaptiveMatch[1] === 'true';
		}
		
		const defaultOgImageAltMatch = configContent.match(/\/\/ \[CONFIG:DEFAULT_OG_IMAGE_ALT\]\s*\n\s*defaultOgImageAlt:\s*"([^"]*)"/);
		if (defaultOgImageAltMatch) {
			config.defaultOgImageAlt = defaultOgImageAltMatch[1];
		}

		// Extract theme
		const themeMatch = configContent.match(/\/\/ \[CONFIG:THEME\]\s*\n\s*theme:\s*"([^"]*)"/);
		if (themeMatch) {
			config.currentTheme = themeMatch[1];
		}

		// Extract available themes
		const availableThemesMatch = configContent.match(/\/\/ \[CONFIG:AVAILABLE_THEMES\]\s*\n\s*availableThemes:\s*(?:"default"|\[[^\]]*\])/);
		if (availableThemesMatch) {
			const value = availableThemesMatch[0].match(/availableThemes:\s*(.+)$/)?.[1];
			if (value === '"default"') {
				config.availableThemes = 'default';
			} else if (value?.startsWith('[') && value?.endsWith(']')) {
				// Parse array format: ["oxygen", "minimal", "nord"]
				const themesArray = value.slice(1, -1).split(',').map(theme => theme.trim().replace(/"/g, ''));
				config.availableThemes = themesArray;
			}
		}

		// Extract custom themes
		const customThemesMatch = configContent.match(/\/\/ \[CONFIG:CUSTOM_THEMES\]\s*\n\s*customThemes:\s*"[^"]*"/);
		if (customThemesMatch) {
			const value = customThemesMatch[0].match(/customThemes:\s*"([^"]*)"/)?.[1];
			config.customThemes = value || '';
		}

		// Extract typography settings
		const typography: Record<string, unknown> = {};
		const fontSourceMatch = configContent.match(/\/\/ \[CONFIG:FONT_SOURCE\]\s*\n\s*source:\s*"([^"]*)"/);
		if (fontSourceMatch) {
			typography.fontSource = fontSourceMatch[1];
		}
		
		const fontBodyMatch = configContent.match(/\/\/ \[CONFIG:FONT_BODY\]\s*\n\s*body:\s*"([^"]*)"/);
		if (fontBodyMatch) {
			typography.proseFont = fontBodyMatch[1];
		}
		
		const fontHeadingMatch = configContent.match(/\/\/ \[CONFIG:FONT_HEADING\]\s*\n\s*heading:\s*"([^"]*)"/);
		if (fontHeadingMatch) {
			typography.headingFont = fontHeadingMatch[1];
		}
		
		const fontMonoMatch = configContent.match(/\/\/ \[CONFIG:FONT_MONO\]\s*\n\s*mono:\s*"([^"]*)"/);
		if (fontMonoMatch) {
			typography.monoFont = fontMonoMatch[1];
		}
		config.typography = typography;

		// Extract navigation settings
		const navigation: Record<string, unknown> = { pages: [], social: [] };
		
		// Extract navigation pages (supports nested structure)
		const pagesMatch = configContent.match(/\/\/ \[CONFIG:NAVIGATION_PAGES\]\s*\n\s*pages:\s*\[([\s\S]*?)\]/);
		if (pagesMatch) {
			const pagesContent = pagesMatch[1];
			
			// Parse navigation items (supports nested children)
			const parseNavigationItem = (content: string, startPos: number = 0): { item: Record<string, unknown> | null, endPos: number } => {
				let pos = startPos;
				const item: Record<string, unknown> = {};
				
				// Skip whitespace
				while (pos < content.length && /\s/.test(content[pos])) pos++;
				
				// Find opening brace
				if (content[pos] !== '{') {
					return { item: null, endPos: pos };
				}
				pos++;
				
				// Parse fields
				while (pos < content.length) {
					// Skip whitespace
					while (pos < content.length && /\s/.test(content[pos])) pos++;
					
					// Check for closing brace
					if (content[pos] === '}') {
						pos++;
						break;
					}
					
					// Parse field name
					const fieldMatch = content.slice(pos).match(/^(\w+):\s*/);
					if (!fieldMatch) {
						pos++;
						continue;
					}
					const fieldName = fieldMatch[1];
					pos += fieldMatch[0].length;
					
					// Parse field value
					if (fieldName === 'title' || fieldName === 'url') {
						const valueMatch = content.slice(pos).match(/^"([^"]*)"/);
						if (valueMatch) {
							item[fieldName] = valueMatch[1];
							pos += valueMatch[0].length;
						}
					} else if (fieldName === 'children') {
						// Parse children array
						pos++; // skip '['
						const children: Array<Record<string, unknown>> = [];
						while (pos < content.length) {
							// Skip whitespace
							while (pos < content.length && /\s/.test(content[pos])) pos++;
							
							// Check for closing bracket
							if (content[pos] === ']') {
								pos++;
								break;
							}
							
							// Parse child item
							const childResult = parseNavigationItem(content, pos);
							if (childResult.item) {
								children.push(childResult.item);
								pos = childResult.endPos;
							} else {
								break;
							}
							
							// Skip comma
							while (pos < content.length && /\s/.test(content[pos])) pos++;
							if (content[pos] === ',') pos++;
						}
						item.children = children;
					}
					
					// Skip comma
					while (pos < content.length && /\s/.test(content[pos])) pos++;
					if (content[pos] === ',') pos++;
				}
				
				return { item, endPos: pos };
			};
			
			// Parse all pages
			let pos = 0;
			while (pos < pagesContent.length) {
				// Skip whitespace
				while (pos < pagesContent.length && /\s/.test(pagesContent[pos])) pos++;
				
				// Check for end of array
				if (pos >= pagesContent.length || pagesContent[pos] === ']') break;
				
				// Parse item
				const result = parseNavigationItem(pagesContent, pos);
				if (result.item) {
					(navigation.pages as Array<Record<string, unknown>>).push(result.item);
					pos = result.endPos;
				} else {
					// Fallback to simple regex for backward compatibility
					const simpleMatch = pagesContent.slice(pos).match(/\{\s*title:\s*"([^"]*)",\s*url:\s*"([^"]*)"\s*\}/);
					if (simpleMatch) {
						(navigation.pages as Array<Record<string, unknown>>).push({
							title: simpleMatch[1],
							url: simpleMatch[2]
						});
						pos += simpleMatch[0].length;
					} else {
						break;
					}
				}
				
				// Skip comma
				while (pos < pagesContent.length && /\s/.test(pagesContent[pos])) pos++;
				if (pagesContent[pos] === ',') pos++;
			}
		}
		
		// Extract navigation social
		const socialMatch = configContent.match(/\/\/ \[CONFIG:NAVIGATION_SOCIAL\]\s*\n\s*social:\s*\[([\s\S]*?)\]/);
		if (socialMatch) {
			const socialContent = socialMatch[1];
			// Match the multi-line format: { title: "...", url: "...", icon: "..." }
			const socialMatches = socialContent.matchAll(/\{\s*\n\s*title:\s*"([^"]*)",\s*\n\s*url:\s*"([^"]*)",\s*\n\s*icon:\s*"([^"]*)",?\s*\n\s*\}/g);
			for (const socialMatch of socialMatches) {
				(navigation.social as Array<Record<string, unknown>>).push({
					title: socialMatch[1],
					url: socialMatch[2],
					icon: socialMatch[3]
				});
			}
		}
		config.navigation = navigation;

		// Extract post options
		const postOptions: Record<string, unknown> = {};
		
		// Extract table of contents
		const tocMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS\]\s*tableOfContents:\s*(true|false)/);
		if (tocMatch) {
			postOptions.tableOfContents = tocMatch[1] === 'true';
		}

		// Extract reading time
		const readingTimeMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_READING_TIME\]\s*readingTime:\s*(true|false)/);
		if (readingTimeMatch) {
			postOptions.readingTime = readingTimeMatch[1] === 'true';
		}

		// Extract linked mentions
		const linkedMentionsEnabledMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED\]\s*enabled:\s*(true|false)/);
		const linkedMentionsCompactMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT\]\s*linkedMentionsCompact:\s*(true|false)/);
		
		if (linkedMentionsEnabledMatch || linkedMentionsCompactMatch) {
			postOptions.linkedMentions = {
				enabled: linkedMentionsEnabledMatch ? linkedMentionsEnabledMatch[1] === 'true' : false,
				linkedMentionsCompact: linkedMentionsCompactMatch ? linkedMentionsCompactMatch[1] === 'true' : false
			};
		}

		// Extract graph view
		const graphViewMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED\]\s*enabled:\s*(true|false)/);
		if (graphViewMatch) {
			postOptions.graphView = {
				enabled: graphViewMatch[1] === 'true'
			};
		}

		// Extract post navigation
		const postNavigationMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_POST_NAVIGATION\]\s*postNavigation:\s*(true|false)/);
		if (postNavigationMatch) {
			postOptions.postNavigation = postNavigationMatch[1] === 'true';
		}

		// Extract comments
		const commentsMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_COMMENTS_ENABLED\]\s*enabled:\s*(true|false)/);
		if (commentsMatch) {
			postOptions.comments = {
				enabled: commentsMatch[1] === 'true'
			};
		}
		config.postOptions = postOptions;

		// Extract optional content types
		const optionalContentTypes: Record<string, unknown> = {};
		
		const projectsMatch = configContent.match(/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS\]\s*projects:\s*(true|false)/);
		if (projectsMatch) {
			optionalContentTypes.projects = projectsMatch[1] === 'true';
		}

		const docsMatch = configContent.match(/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_DOCS\]\s*docs:\s*(true|false)/);
		if (docsMatch) {
			optionalContentTypes.docs = docsMatch[1] === 'true';
		}
		config.optionalContentTypes = optionalContentTypes;

		// Extract footer settings
		const footer: Record<string, unknown> = {};
		
		const footerSocialMatch = configContent.match(/\/\/ \[CONFIG:FOOTER_SHOW_SOCIAL_ICONS\]\s*showSocialIconsInFooter:\s*(true|false)/);
		if (footerSocialMatch) {
			footer.showSocialIconsInFooter = footerSocialMatch[1] === 'true';
		}
		config.footer = footer;

		// Extract command palette
		const commandPalette: Record<string, unknown> = {};
		
		const commandPaletteMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_ENABLED\]\s*enabled:\s*(true|false)/);
		if (commandPaletteMatch) {
			commandPalette.enabled = commandPaletteMatch[1] === 'true';
		}
		
		const commandPalettePlaceholderMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_PLACEHOLDER\]\s*placeholder:\s*['"`]([^'"`]+)['"`]/);
		if (commandPalettePlaceholderMatch) {
			commandPalette.placeholder = commandPalettePlaceholderMatch[1];
		}
		
		const commandPaletteShortcutMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SHORTCUT\]\s*shortcut:\s*['"`]([^'"`]+)['"`]/);
		if (commandPaletteShortcutMatch) {
			commandPalette.shortcut = commandPaletteShortcutMatch[1];
		}
		
		// Command palette search options
		const search: Record<string, unknown> = {};
		const searchPostsMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_POSTS\]\s*posts:\s*(true|false)/);
		if (searchPostsMatch) {
			search.posts = searchPostsMatch[1] === 'true';
		}
		
		const searchPagesMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_PAGES\]\s*pages:\s*(true|false)/);
		if (searchPagesMatch) {
			search.pages = searchPagesMatch[1] === 'true';
		}
		
		const searchProjectsMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_PROJECTS\]\s*projects:\s*(true|false)/);
		if (searchProjectsMatch) {
			search.projects = searchProjectsMatch[1] === 'true';
		}
		
		const searchDocsMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SEARCH_DOCS\]\s*docs:\s*(true|false)/);
		if (searchDocsMatch) {
			search.docs = searchDocsMatch[1] === 'true';
		}
		commandPalette.search = search;
		
		// Command palette sections
		const sections: Record<string, unknown> = {};
		const sectionsQuickActionsMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_QUICK_ACTIONS\]\s*quickActions:\s*(true|false)/);
		if (sectionsQuickActionsMatch) {
			sections.quickActions = sectionsQuickActionsMatch[1] === 'true';
		}
		
		const sectionsPagesMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_PAGES\]\s*pages:\s*(true|false)/);
		if (sectionsPagesMatch) {
			sections.pages = sectionsPagesMatch[1] === 'true';
		}
		
		const sectionsSocialMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_SECTIONS_SOCIAL\]\s*social:\s*(true|false)/);
		if (sectionsSocialMatch) {
			sections.social = sectionsSocialMatch[1] === 'true';
		}
		commandPalette.sections = sections;
		
		// Command palette quick actions
		const quickActions: Record<string, unknown> = {};
		const qaEnabledMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_QUICK_ACTIONS_ENABLED\]\s*enabled:\s*(true|false)/);
		if (qaEnabledMatch) {
			quickActions.enabled = qaEnabledMatch[1] === 'true';
		}
		
		const qaToggleModeMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_QUICK_ACTIONS_TOGGLE_MODE\]\s*toggleMode:\s*(true|false)/);
		if (qaToggleModeMatch) {
			quickActions.toggleMode = qaToggleModeMatch[1] === 'true';
		}
		
		const qaGraphViewMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_QUICK_ACTIONS_GRAPH_VIEW\]\s*graphView:\s*(true|false)/);
		if (qaGraphViewMatch) {
			quickActions.graphView = qaGraphViewMatch[1] === 'true';
		}
		
		const qaChangeThemeMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_QUICK_ACTIONS_CHANGE_THEME\]\s*changeTheme:\s*(true|false)/);
		if (qaChangeThemeMatch) {
			quickActions.changeTheme = qaChangeThemeMatch[1] === 'true';
		}
		commandPalette.quickActions = quickActions;
		config.commandPalette = commandPalette;

		// Extract site information
		const siteMatch = configContent.match(/\/\/ \[CONFIG:SITE_URL\]\s*site:\s*['"`]([^'"`]+)['"`]/);
		if (siteMatch) {
			config.site = siteMatch[1];
		}

		const titleMatch = configContent.match(/\/\/ \[CONFIG:SITE_TITLE\]\s*title:\s*['"`]([^'"`]+)['"`]/);
		if (titleMatch) {
			config.title = titleMatch[1];
		}

		const descriptionMatch = configContent.match(/\/\/ \[CONFIG:SITE_DESCRIPTION\]\s*description:\s*['"`]([^'"`]+)['"`]/);
		if (descriptionMatch) {
			config.description = descriptionMatch[1];
		}

		const authorMatch = configContent.match(/\/\/ \[CONFIG:SITE_AUTHOR\]\s*author:\s*['"`]([^'"`]+)['"`]/);
		if (authorMatch) {
			config.author = authorMatch[1];
		}

		const languageMatch = configContent.match(/\/\/ \[CONFIG:SITE_LANGUAGE\]\s*language:\s*['"`]([^'"`]+)['"`]/);
		if (languageMatch) {
			config.language = languageMatch[1];
		}

		return config;
	}
}
