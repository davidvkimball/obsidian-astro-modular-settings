import { App, TFile } from 'obsidian';
import { ConfigFileInfo, ObsidianVaultAdapter } from '../../types';

export class ConfigFileManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		this.configPath = '../config.ts';
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		// NOTE: This plugin accesses files outside the Obsidian vault to manage Astro configuration.
		// This is necessary for the plugin's core functionality of managing Astro Modular theme settings.
		
		// Try to access the file outside the vault using Node.js fs
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			// Check if the parent directory exists
			const parentDir = path.dirname(configPath);
			
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
		} catch (error) {
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
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			fs.writeFileSync(configPath, content, 'utf8');
			return true;
		} catch (error) {
			return false;
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

	async parseConfigFile(content?: string): Promise<any> {
		// Parse the config.ts file to extract current settings
		// This extracts all key settings from the config using the marker system
		
		const configContent = content || await this.readConfig();
		if (!configContent) {
			return null;
		}

		const config: any = {};

		// Extract site information
		config.siteInfo = {};
		const siteUrlMatch = configContent.match(/\/\/ \[CONFIG:SITE_URL\]\s*\n\s*site:\s*"([^"]*)"/);
		if (siteUrlMatch) {
			config.siteInfo.site = siteUrlMatch[1];
		}
		
		const siteTitleMatch = configContent.match(/\/\/ \[CONFIG:SITE_TITLE\]\s*\n\s*title:\s*"([^"]*)"/);
		if (siteTitleMatch) {
			config.siteInfo.title = siteTitleMatch[1];
		}
		
		const siteDescMatch = configContent.match(/\/\/ \[CONFIG:SITE_DESCRIPTION\]\s*\n\s*description:\s*"([^"]*)"/);
		if (siteDescMatch) {
			config.siteInfo.description = siteDescMatch[1];
		}
		
		const siteAuthorMatch = configContent.match(/\/\/ \[CONFIG:SITE_AUTHOR\]\s*\n\s*author:\s*"([^"]*)"/);
		if (siteAuthorMatch) {
			config.siteInfo.author = siteAuthorMatch[1];
		}
		
		const siteLangMatch = configContent.match(/\/\/ \[CONFIG:SITE_LANGUAGE\]\s*\n\s*language:\s*"([^"]*)"/);
		if (siteLangMatch) {
			config.siteInfo.language = siteLangMatch[1];
		}

		// Extract theme
		const themeMatch = configContent.match(/\/\/ \[CONFIG:THEME\]\s*\n\s*theme:\s*"([^"]*)"/);
		if (themeMatch) {
			config.currentTheme = themeMatch[1];
		}

		// Extract typography settings
		config.typography = {};
		const fontSourceMatch = configContent.match(/\/\/ \[CONFIG:FONT_SOURCE\]\s*\n\s*source:\s*"([^"]*)"/);
		if (fontSourceMatch) {
			config.typography.fontSource = fontSourceMatch[1];
		}
		
		const fontBodyMatch = configContent.match(/\/\/ \[CONFIG:FONT_BODY\]\s*\n\s*body:\s*"([^"]*)"/);
		if (fontBodyMatch) {
			config.typography.proseFont = fontBodyMatch[1];
		}
		
		const fontHeadingMatch = configContent.match(/\/\/ \[CONFIG:FONT_HEADING\]\s*\n\s*heading:\s*"([^"]*)"/);
		if (fontHeadingMatch) {
			config.typography.headingFont = fontHeadingMatch[1];
		}
		
		const fontMonoMatch = configContent.match(/\/\/ \[CONFIG:FONT_MONO\]\s*\n\s*mono:\s*"([^"]*)"/);
		if (fontMonoMatch) {
			config.typography.monoFont = fontMonoMatch[1];
		}

		// Extract navigation settings
		config.navigation = { pages: [], social: [] };
		
		// Extract navigation pages
		const pagesMatch = configContent.match(/\/\/ \[CONFIG:NAVIGATION_PAGES\]\s*\n\s*pages:\s*\[([\s\S]*?)\]/);
		if (pagesMatch) {
			const pagesContent = pagesMatch[1];
			// Match the single-line format: { title: "...", url: "..." }
			const pageMatches = pagesContent.matchAll(/\{\s*title:\s*"([^"]*)",\s*url:\s*"([^"]*)"\s*\}/g);
			for (const pageMatch of pageMatches) {
				config.navigation.pages.push({
					title: pageMatch[1],
					url: pageMatch[2]
				});
			}
		}
		
		// Extract navigation social
		const socialMatch = configContent.match(/\/\/ \[CONFIG:NAVIGATION_SOCIAL\]\s*\n\s*social:\s*\[([\s\S]*?)\]/);
		if (socialMatch) {
			const socialContent = socialMatch[1];
			// Match the multi-line format: { title: "...", url: "...", icon: "..." }
			const socialMatches = socialContent.matchAll(/\{\s*\n\s*title:\s*"([^"]*)",\s*\n\s*url:\s*"([^"]*)",\s*\n\s*icon:\s*"([^"]*)",?\s*\n\s*\}/g);
			for (const socialMatch of socialMatches) {
				config.navigation.social.push({
					title: socialMatch[1],
					url: socialMatch[2],
					icon: socialMatch[3]
				});
			}
		}

		// Extract post options
		config.postOptions = {};
		
		// Extract table of contents
		const tocMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS\]\s*tableOfContents:\s*(true|false)/);
		if (tocMatch) {
			config.postOptions.tableOfContents = tocMatch[1] === 'true';
		}

		// Extract reading time
		const readingTimeMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_READING_TIME\]\s*readingTime:\s*(true|false)/);
		if (readingTimeMatch) {
			config.postOptions.readingTime = readingTimeMatch[1] === 'true';
		}

		// Extract linked mentions
		const linkedMentionsEnabledMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED\]\s*enabled:\s*(true|false)/);
		const linkedMentionsCompactMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT\]\s*linkedMentionsCompact:\s*(true|false)/);
		
		if (linkedMentionsEnabledMatch || linkedMentionsCompactMatch) {
			config.postOptions.linkedMentions = {
				enabled: linkedMentionsEnabledMatch ? linkedMentionsEnabledMatch[1] === 'true' : false,
				linkedMentionsCompact: linkedMentionsCompactMatch ? linkedMentionsCompactMatch[1] === 'true' : false
			};
		}

		// Extract graph view
		const graphViewMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED\]\s*enabled:\s*(true|false)/);
		if (graphViewMatch) {
			config.postOptions.graphView = {
				enabled: graphViewMatch[1] === 'true'
			};
		}

		// Extract post navigation
		const postNavigationMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_POST_NAVIGATION\]\s*postNavigation:\s*(true|false)/);
		if (postNavigationMatch) {
			config.postOptions.postNavigation = postNavigationMatch[1] === 'true';
		}

		// Extract comments
		const commentsMatch = configContent.match(/\/\/ \[CONFIG:POST_OPTIONS_COMMENTS_ENABLED\]\s*enabled:\s*(true|false)/);
		if (commentsMatch) {
			config.postOptions.comments = {
				enabled: commentsMatch[1] === 'true'
			};
		}

		// Extract optional content types
		config.optionalContentTypes = {};
		
		const projectsMatch = configContent.match(/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS\]\s*projects:\s*(true|false)/);
		if (projectsMatch) {
			config.optionalContentTypes.projects = projectsMatch[1] === 'true';
		}

		const docsMatch = configContent.match(/\/\/ \[CONFIG:OPTIONAL_CONTENT_TYPES_DOCS\]\s*docs:\s*(true|false)/);
		if (docsMatch) {
			config.optionalContentTypes.docs = docsMatch[1] === 'true';
		}

		// Extract footer settings
		config.footer = {};
		
		const footerSocialMatch = configContent.match(/\/\/ \[CONFIG:FOOTER_SHOW_SOCIAL_ICONS\]\s*showSocialIconsInFooter:\s*(true|false)/);
		if (footerSocialMatch) {
			config.footer.showSocialIconsInFooter = footerSocialMatch[1] === 'true';
		}

		// Extract command palette
		config.commandPalette = {};
		
		const commandPaletteMatch = configContent.match(/\/\/ \[CONFIG:COMMAND_PALETTE_ENABLED\]\s*enabled:\s*(true|false)/);
		if (commandPaletteMatch) {
			config.commandPalette.enabled = commandPaletteMatch[1] === 'true';
		}

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
