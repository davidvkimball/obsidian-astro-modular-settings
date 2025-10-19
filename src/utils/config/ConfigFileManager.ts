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
		// This is a basic implementation that extracts key settings from the config
		
		const configContent = content || await this.readConfig();
		if (!configContent) {
			return null;
		}

		const config: any = {};

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

		// Extract theme
		const themeMatch = configContent.match(/\/\/ \[CONFIG:THEME\]\s*theme:\s*['"`]([^'"`]+)['"`]/);
		if (themeMatch) {
			config.theme = themeMatch[1];
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
