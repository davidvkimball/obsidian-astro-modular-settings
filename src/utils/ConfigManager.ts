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
		
		// Update theme - target the actual value assignment, not the type definition
		modifiedConfig = modifiedConfig.replace(
			/theme:\s*"[^"]*",?\s*\/\/ Available themes:/,
			`theme: "${settings.currentTheme}", // Available themes:`
		);
		
		// Update font source
		modifiedConfig = modifiedConfig.replace(
			/source:\s*"[^"]*"/,
			`source: "${settings.typography.fontSource}"`
		);
		
		// Update font families
		modifiedConfig = modifiedConfig.replace(
			/body:\s*"[^"]*"/,
			`body: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.prose : settings.typography.proseFont}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/heading:\s*"[^"]*"/,
			`heading: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.heading : settings.typography.headingFont}"`
		);
		modifiedConfig = modifiedConfig.replace(
			/mono:\s*"[^"]*"/,
			`mono: "${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.mono : settings.typography.monoFont}"`
		);
		
		// Update deployment platform
		modifiedConfig = modifiedConfig.replace(
			/platform:\s*"[^"]*"/,
			`platform: "${settings.deployment.platform}"`
		);
		
		// Update layout content width if specified in template
		if (templateConfig.layout?.contentWidth) {
			modifiedConfig = modifiedConfig.replace(
				/contentWidth:\s*"[^"]*"/,
				`contentWidth: "${templateConfig.layout.contentWidth}"`
			);
		}
		
		// Update optional content types if specified in template
		if (templateConfig.optionalContentTypes) {
			if (templateConfig.optionalContentTypes.projects !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/projects:\s*(true|false),?\s*\/\/ Enable projects section/,
					`projects: ${templateConfig.optionalContentTypes.projects}, // Enable projects section`
				);
			}
			if (templateConfig.optionalContentTypes.docs !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/docs:\s*(true|false),?\s*\/\/ Enable documentation section/,
					`docs: ${templateConfig.optionalContentTypes.docs}, // Enable documentation section`
				);
			}
		}
		
		// Update dark mode toggle button if specified in template
		if (templateConfig.darkModeToggleButton) {
			modifiedConfig = modifiedConfig.replace(
				/darkModeToggleButton:\s*"[^"]*",?\s*\/\/ "navigation" \| "commandPalette" \| "both"/,
				`darkModeToggleButton: "${templateConfig.darkModeToggleButton}", // "navigation" | "commandPalette" | "both"`
			);
		}
		
		// Update footer settings if specified in template
		// NOTE: We only update showSocialIconsInFooter and enabled, NEVER the footer.content
		if (templateConfig.footer) {
			// Update footer enabled state
			if (templateConfig.footer.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/footer:\s*\{\s*enabled:\s*(true|false),/,
					`footer: {
    enabled: ${templateConfig.footer.enabled},`
				);
			}
			// Update footer social icons
			if (templateConfig.footer.showSocialIconsInFooter !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/showSocialIconsInFooter:\s*(true|false)/,
					`showSocialIconsInFooter: ${templateConfig.footer.showSocialIconsInFooter}`
				);
			}
		}
		
		// Update navigation style if specified in template
		if (templateConfig.navigation?.style) {
			modifiedConfig = modifiedConfig.replace(
				/style:\s*"[^"]*",?\s*\/\/ 'minimal' or 'traditional'/,
				`style: "${templateConfig.navigation.style}", // 'minimal' or 'traditional'`
			);
		}
		
		// Update command palette settings if specified in template
		if (templateConfig.commandPalette) {
			// Update enabled state
			if (templateConfig.commandPalette.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/enabled:\s*(true|false)(,\s*shortcut:)/,
					`enabled: ${templateConfig.commandPalette.enabled}$2`
				);
			}
			
		// Update search settings - use context-specific replacement
		if (templateConfig.commandPalette.search) {
			console.log('🔍 Template search config:', templateConfig.commandPalette.search);
			
			// Replace each field individually with context-specific regex
			if (templateConfig.commandPalette.search.posts !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/search:\s*\{[\s\S]*?posts:\s*(true|false),/,
					(match) => match.replace(/posts:\s*(true|false),/, `posts: ${templateConfig.commandPalette.search.posts},`)
				);
			}
			if (templateConfig.commandPalette.search.pages !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/search:\s*\{[\s\S]*?pages:\s*(true|false),/,
					(match) => match.replace(/pages:\s*(true|false),/, `pages: ${templateConfig.commandPalette.search.pages},`)
				);
			}
			if (templateConfig.commandPalette.search.projects !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/search:\s*\{[\s\S]*?projects:\s*(true|false),/,
					(match) => match.replace(/projects:\s*(true|false),/, `projects: ${templateConfig.commandPalette.search.projects},`)
				);
			}
			if (templateConfig.commandPalette.search.docs !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/search:\s*\{[\s\S]*?docs:\s*(true|false),/,
					(match) => match.replace(/docs:\s*(true|false),/, `docs: ${templateConfig.commandPalette.search.docs},`)
				);
			}
			
			console.log('🔍 Search replacement completed');
		}
			
			// Update sections settings - use simple line-by-line replacement
			if (templateConfig.commandPalette.sections) {
				console.log('🔍 Template sections config:', templateConfig.commandPalette.sections);
				
				// Replace each field individually with very specific regex
				if (templateConfig.commandPalette.sections.quickActions !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/quickActions:\s*(true|false),/,
						`quickActions: ${templateConfig.commandPalette.sections.quickActions},`
					);
				}
				if (templateConfig.commandPalette.sections.pages !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/pages:\s*(true|false),/,
						`pages: ${templateConfig.commandPalette.sections.pages},`
					);
				}
				if (templateConfig.commandPalette.sections.social !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/social:\s*(true|false),/,
						`social: ${templateConfig.commandPalette.sections.social},`
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
						/enabled:\s*(true|false),?\s*\/\/ Show featured post on homepage/,
						`enabled: ${templateConfig.homeOptions.featuredPost.enabled}, // Show featured post on homepage`
					);
				}
				if (templateConfig.homeOptions.featuredPost.type) {
					modifiedConfig = modifiedConfig.replace(
						/type:\s*"[^"]*",?\s*\/\/ "latest" or "featured"/,
						`type: "${templateConfig.homeOptions.featuredPost.type}", // "latest" or "featured"`
					);
				}
			}
			
			// Update recent posts settings
			if (templateConfig.homeOptions.recentPosts) {
				if (templateConfig.homeOptions.recentPosts.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/enabled:\s*(true|false),?\s*\/\/ Show recent posts on homepage/,
						`enabled: ${templateConfig.homeOptions.recentPosts.enabled}, // Show recent posts on homepage`
					);
				}
				if (templateConfig.homeOptions.recentPosts.count) {
					modifiedConfig = modifiedConfig.replace(
						/count:\s*\d+,?\s*\/\/ Number of recent posts to show/,
						`count: ${templateConfig.homeOptions.recentPosts.count}, // Number of recent posts to show`
					);
				}
			}
			
			// Update projects settings
			if (templateConfig.homeOptions.projects) {
				if (templateConfig.homeOptions.projects.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/enabled:\s*(true|false),?\s*\/\/ Show featured projects on homepage/,
						`enabled: ${templateConfig.homeOptions.projects.enabled}, // Show featured projects on homepage`
					);
				}
				if (templateConfig.homeOptions.projects.count) {
					modifiedConfig = modifiedConfig.replace(
						/count:\s*\d+,?\s*\/\/ Number of projects to show/,
						`count: ${templateConfig.homeOptions.projects.count}, // Number of projects to show`
					);
				}
			}
			
			// Update docs settings
			if (templateConfig.homeOptions.docs) {
				if (templateConfig.homeOptions.docs.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/enabled:\s*(true|false),?\s*\/\/ Show featured docs on homepage/,
						`enabled: ${templateConfig.homeOptions.docs.enabled}, // Show featured docs on homepage`
					);
				}
				if (templateConfig.homeOptions.docs.count) {
					modifiedConfig = modifiedConfig.replace(
						/count:\s*\d+,?\s*\/\/ Number of docs to show/,
						`count: ${templateConfig.homeOptions.docs.count}, // Number of docs to show`
					);
				}
			}
			
			// Update blurb placement
			if (templateConfig.homeOptions.blurb?.placement) {
				modifiedConfig = modifiedConfig.replace(
					/placement:\s*"[^"]*",?\s*\/\/ 'above' \(at the top\), 'below' \(after content\), or 'none' \(disabled\)/,
					`placement: "${templateConfig.homeOptions.blurb.placement}", // 'above' (at the top), 'below' (after content), or 'none' (disabled)`
				);
			}
		}
		
		// Update post options if specified in template
		if (templateConfig.postOptions) {
			// Update posts per page
			if (templateConfig.postOptions.postsPerPage) {
				modifiedConfig = modifiedConfig.replace(
					/postsPerPage:\s*\d+/,
					`postsPerPage: ${templateConfig.postOptions.postsPerPage}`
				);
			}
			
			// Update boolean features with highly specific regex patterns
			const booleanFeatures = ['readingTime', 'wordCount', 'tableOfContents', 'tags', 'postNavigation'];
			booleanFeatures.forEach(feature => {
				if (templateConfig.postOptions[feature] !== undefined) {
					// Use highly specific regex that targets each feature individually with context
					let regex;
					if (feature === 'readingTime') {
						regex = /readingTime:\s*(true|false),?\s*\/\/ Show estimated reading time/;
					} else if (feature === 'wordCount') {
						regex = /wordCount:\s*(true|false),?\s*\/\/ Show word count/;
					} else if (feature === 'tableOfContents') {
						regex = /tableOfContents:\s*(true|false),?\s*\/\/ Show table of contents/;
					} else if (feature === 'tags') {
						regex = /tags:\s*(true|false),?\s*\/\/ Show tags/;
					} else if (feature === 'postNavigation') {
						regex = /postNavigation:\s*(true|false),?\s*\/\/ Show post navigation/;
					}
					
					if (regex) {
						modifiedConfig = modifiedConfig.replace(
							regex,
							`${feature}: ${templateConfig.postOptions[feature]}, // Show ${feature}`
						);
					}
				}
			});
			
			// Update linked mentions settings
			if (templateConfig.postOptions.linkedMentions) {
				if (templateConfig.postOptions.linkedMentions.enabled !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/enabled:\s*(true|false),?\s*\/\/ Enable linked mentions/,
						`enabled: ${templateConfig.postOptions.linkedMentions.enabled}, // Enable linked mentions`
					);
				}
				if (templateConfig.postOptions.linkedMentions.linkedMentionsCompact !== undefined) {
					modifiedConfig = modifiedConfig.replace(
						/linkedMentionsCompact:\s*(true|false)/,
						`linkedMentionsCompact: ${templateConfig.postOptions.linkedMentions.linkedMentionsCompact}`
					);
				}
			}
			
		// Update graph view settings with highly specific regex patterns
		if (templateConfig.postOptions.graphView) {
			// Update enabled state - target specifically within graphView object
			if (templateConfig.postOptions.graphView.enabled !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/graphView:\s*\{\s*enabled:\s*(true|false),/,
					`graphView: {
    enabled: ${templateConfig.postOptions.graphView.enabled},`
				);
			}
			// Update showInSidebar state - target specifically within graphView object
			if (templateConfig.postOptions.graphView.showInSidebar !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/graphView:\s*\{[\s\S]*?showInSidebar:\s*(true|false),/,
					(match) => {
						return match.replace(
							/showInSidebar:\s*(true|false),/,
							`showInSidebar: ${templateConfig.postOptions.graphView.showInSidebar},`
						);
					}
				);
			}
			// Update showInCommandPalette state - target specifically within graphView object
			if (templateConfig.postOptions.graphView.showInCommandPalette !== undefined) {
				modifiedConfig = modifiedConfig.replace(
					/graphView:\s*\{[\s\S]*?showInCommandPalette:\s*(true|false),/,
					(match) => {
						return match.replace(
							/showInCommandPalette:\s*(true|false),/,
							`showInCommandPalette: ${templateConfig.postOptions.graphView.showInCommandPalette},`
						);
					}
				);
			}
			// Update maxNodes - target specifically within graphView object
			if (templateConfig.postOptions.graphView.maxNodes) {
				modifiedConfig = modifiedConfig.replace(
					/graphView:\s*\{[\s\S]*?maxNodes:\s*\d+,/,
					(match) => {
						return match.replace(
							/maxNodes:\s*\d+,/,
							`maxNodes: ${templateConfig.postOptions.graphView.maxNodes},`
						);
					}
				);
			}
		}
			
			// Update post card settings
			if (templateConfig.postOptions.showPostCardCoverImages) {
				modifiedConfig = modifiedConfig.replace(
					/showPostCardCoverImages:\s*"[^"]*",?\s*\/\/ "all" \| "featured" \| "home" \| "posts" \| "featured-and-posts" \| "none"/,
					`showPostCardCoverImages: "${templateConfig.postOptions.showPostCardCoverImages}", // "all" | "featured" | "home" | "posts" | "featured-and-posts" | "none"`
				);
			}
			if (templateConfig.postOptions.postCardAspectRatio) {
				modifiedConfig = modifiedConfig.replace(
					/postCardAspectRatio:\s*"[^"]*",?\s*\/\/ "16:9" \| "4:3" \| "3:2" \| "og" \| "square" \| "golden" \| "custom"/,
					`postCardAspectRatio: "${templateConfig.postOptions.postCardAspectRatio}", // "16:9" | "4:3" | "3:2" | "og" | "square" | "golden" | "custom"`
				);
			}
			if (templateConfig.postOptions.customPostCardAspectRatio) {
				modifiedConfig = modifiedConfig.replace(
					/customPostCardAspectRatio:\s*"[^"]*",?\s*\/\/ For custom aspect ratio/,
					`customPostCardAspectRatio: "${templateConfig.postOptions.customPostCardAspectRatio}", // For custom aspect ratio`
				);
			}
		}
		
		// Update profile picture settings - only update if profile picture is enabled
		if (settings.optionalFeatures.profilePicture.enabled) {
			// Update enabled state - target specifically within profilePicture object
			modifiedConfig = modifiedConfig.replace(
				/profilePicture:\s*\{\s*enabled:\s*(true|false),?\s*\/\/ Profile picture/,
				`profilePicture: {
    enabled: ${settings.optionalFeatures.profilePicture.enabled}, // Profile picture`
			);
			// Update image - target specifically within profilePicture object
			modifiedConfig = modifiedConfig.replace(
				/profilePicture:\s*\{[\s\S]*?image:\s*"[^"]*",?\s*\/\/ Path to your profile image/,
				(match) => {
					return match.replace(
						/image:\s*"[^"]*",?\s*\/\/ Path to your profile image/,
						`image: "${settings.optionalFeatures.profilePicture.image}", // Path to your profile image`
					);
				}
			);
			// Update alt - target specifically within profilePicture object
			modifiedConfig = modifiedConfig.replace(
				/profilePicture:\s*\{[\s\S]*?alt:\s*"[^"]*"/,
				(match) => {
					return match.replace(
						/alt:\s*"[^"]*"/,
						`alt: "${settings.optionalFeatures.profilePicture.alt}"`
					);
				}
			);
			// Update size - target specifically within profilePicture object
			modifiedConfig = modifiedConfig.replace(
				/profilePicture:\s*\{[\s\S]*?size:\s*"[^"]*",?\s*\/\/ "sm" \(32px\), "md" \(48px\), or "lg" \(64px\)/,
				(match) => {
					return match.replace(
						/size:\s*"[^"]*",?\s*\/\/ "sm" \(32px\), "md" \(48px\), or "lg" \(64px\)/,
						`size: "${settings.optionalFeatures.profilePicture.size}", // "sm" (32px), "md" (48px), or "lg" (64px)`
					);
				}
			);
			// Update url, placement, and style - target specifically within profilePicture object
			modifiedConfig = modifiedConfig.replace(
				/profilePicture:\s*\{[\s\S]*?url:\s*"[^"]*",?\s*\/\/ Optional\s*,\s*placement:\s*"[^"]*",?\s*\/\/ "footer" or "header"\s*,\s*style:\s*"[^"]*",?\s*\/\/ "circle", "square", or "none"/,
				(match) => {
					return match.replace(
						/url:\s*"[^"]*",?\s*\/\/ Optional\s*,\s*placement:\s*"[^"]*",?\s*\/\/ "footer" or "header"\s*,\s*style:\s*"[^"]*",?\s*\/\/ "circle", "square", or "none"/,
						`url: "${settings.optionalFeatures.profilePicture.url || ''}", // Optional
    placement: "${settings.optionalFeatures.profilePicture.placement}", // "footer" or "header"
    style: "${settings.optionalFeatures.profilePicture.style}", // "circle", "square", or "none"`
					);
				}
			);
		}
		
		// Update comments settings
		modifiedConfig = modifiedConfig.replace(
			/comments:\s*\{\s*enabled:\s*(true|false),/,
				`comments: {
      enabled: ${settings.optionalFeatures.comments.enabled},`
			);
		
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
		
		return modifiedConfig;
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
          showSocialIconsInFooter: true,
        },
        darkModeToggleButton: 'commandPalette',
        commandPalette: {
          enabled: true,
						search: {
							posts: true,
							pages: true,
							projects: false,
							docs: false,
						},
          sections: {
            quickActions: false,
            pages: true,
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
