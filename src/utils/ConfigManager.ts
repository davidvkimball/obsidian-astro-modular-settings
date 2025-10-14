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
		
		const currentConfig = await this.readConfig();
		console.log('📖 Current config length:', currentConfig.length);
		console.log('📖 Current config preview:', currentConfig.substring(0, 200) + '...');
		
		const newConfig = this.generateConfigFromPreset(preset, currentConfig);
		console.log('🆕 New config length:', newConfig.length);
		console.log('🆕 New config preview:', newConfig.substring(0, 200) + '...');
		
		const writeResult = await this.writeConfig(newConfig);
		console.log('💾 Write result:', writeResult);
		
		return writeResult;
	}

	private generateConfigFromPreset(preset: PresetTemplate, currentConfig: string): string {
		// Update only the specific values in the existing config
		const settings = preset.config as AstroModularSettings;
		
		console.log('🔄 ConfigManager: Updating existing config with new values');
		console.log('🎨 Theme to update:', settings.currentTheme);
		console.log('🔤 Fonts to update:', settings.typography);
		
		// Start with the current config
		let updatedConfig = currentConfig;
		
		// Update theme - target the siteConfig object specifically
		updatedConfig = updatedConfig.replace(
			/export const siteConfig: SiteConfig = \{[\s\S]*?theme:\s*"[^"]*"/,
			(match) => match.replace(/theme:\s*"[^"]*"/, `theme: "${settings.currentTheme}"`)
		);
		
		// Update font families - target the siteConfig object specifically
		updatedConfig = updatedConfig.replace(
			/export const siteConfig: SiteConfig = \{[\s\S]*?families:\s*\{[^}]*body:\s*"[^"]*"[^}]*heading:\s*"[^"]*"[^}]*mono:\s*"[^"]*"[^}]*\}/s,
			(match) => match.replace(
				/families:\s*\{[^}]*body:\s*"[^"]*"[^}]*heading:\s*"[^"]*"[^}]*mono:\s*"[^"]*"[^}]*\}/s,
				`families: {
      body: "${settings.typography.proseFont}",
      heading: "${settings.typography.headingFont}",
      mono: "${settings.typography.monoFont}",
    }`
			)
		);
		
		// Update font source - target the siteConfig object specifically
		updatedConfig = updatedConfig.replace(
			/export const siteConfig: SiteConfig = \{[\s\S]*?source:\s*"[^"]*"/,
			(match) => match.replace(/source:\s*"[^"]*"/, `source: "${settings.typography.fontSource}"`)
		);
		
		// Update deployment platform - target the siteConfig object specifically
		updatedConfig = updatedConfig.replace(
			/export const siteConfig: SiteConfig = \{[\s\S]*?platform:\s*"[^"]*"/,
			(match) => match.replace(/platform:\s*"[^"]*"/, `platform: "${settings.deployment.platform}"`)
		);
		
		// Update profile picture settings
		if (settings.optionalFeatures.profilePicture.enabled) {
			updatedConfig = updatedConfig.replace(
				/profilePicture:\s*\{[^}]*enabled:\s*false[^}]*\}/s,
				`profilePicture: {
    enabled: true,
    image: "${settings.optionalFeatures.profilePicture.image}",
    alt: "${settings.optionalFeatures.profilePicture.alt}",
    size: "${settings.optionalFeatures.profilePicture.size}",
    url: "${settings.optionalFeatures.profilePicture.url || ''}",
    placement: "${settings.optionalFeatures.profilePicture.placement}",
    style: "${settings.optionalFeatures.profilePicture.style}",
  }`
			);
		}
		
		// Update comments settings
		if (settings.optionalFeatures.comments.enabled) {
			updatedConfig = updatedConfig.replace(
				/comments:\s*\{[^}]*enabled:\s*false[^}]*\}/s,
				`comments: {
    enabled: true,
    provider: "giscus",
  }`
			);
		}
		
		console.log('✅ Config update complete');
		return updatedConfig;
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

	private getTemplateConfig(templateName: string, settings: AstroModularSettings): string {
		const baseConfig = `// Site configuration with TypeScript types

// Aspect ratio options for post cards
export type AspectRatio = 
  | "16:9" 
  | "4:3"
  | "3:2"
  | "og"
  | "square"
  | "golden"
  | "custom";

export interface SiteConfig {
  // Site Information
  site: string;
  title: string;
  description: string;
  author: string;
  language: string;
  
  // Global Settings
  theme: "minimal" | "oxygen" | "atom" | "ayu" | "catppuccin" | "charcoal" | "dracula" | "everforest" | "flexoki" | "gruvbox" | "macos" | "nord" | "obsidian" | "rose-pine" | "sky" | "solarized" | "things" | "custom";
  customThemeFile?: string;
  fonts: {
    source: "local" | "cdn";
    families: {
      body: string;
      heading: string;
      mono: string;
    };
    display: "swap" | "fallback" | "optional";
  };
  layout: {
    contentWidth: string;
  };
  footer: {
    enabled: boolean;
    content: string;
    showSocialIconsInFooter: boolean;
  };
  scrollToTop: boolean;
  darkModeToggleButton: "navigation" | "commandPalette" | "both";
  seo: {
    defaultOgImageAlt: string;
  };
  deployment: {
    platform: "netlify" | "vercel" | "github-pages";
  };
  
  // Command Palette
  commandPalette: {
    enabled: boolean;
    searchPosts: boolean;
    searchPages: boolean;
    searchProjects: boolean;
    searchDocs: boolean;
    sections: {
      quotations: boolean;
      pages: boolean;
      social: boolean;
    };
  };
  
  // Homepage Options
  homeOptions: {
    featuredPost: {
      enabled: boolean;
      type: "latest" | "featured";
      slug?: string;
    };
    recentPosts: {
      enabled: boolean;
      count: number;
    };
    projects: {
      enabled: boolean;
      count: number;
    };
    docs: {
      enabled: boolean;
      count: number;
    };
    blurb: {
      placement: "above" | "below" | "none";
    };
  };
  
  // Post Options
  postOptions: {
    postsPerPage: number;
    readingTime: boolean;
    wordCount: boolean;
    tableOfContents: boolean;
    tags: boolean;
    linkedMentions: {
      enabled: boolean;
      linkedMentionsCompact: boolean;
    };
    graphView: {
      enabled: boolean;
      showInSidebar: boolean;
      showInCommandPalette: boolean;
      maxNodes: number;
      showOrphanedPosts: boolean;
    };
    postNavigation: boolean;
    showPostCardCoverImages: "all" | "featured" | "home" | "posts" | "featured-and-posts" | "none";
    postCardAspectRatio: AspectRatio;
    customPostCardAspectRatio?: string;
    comments: {
      enabled: boolean;
      provider: "giscus";
      repo?: string;
      repoId?: string;
      category?: string;
      categoryId?: string;
      mapping?: string;
      strict?: string;
      reactions?: string;
      metadata?: string;
      inputPosition?: string;
      theme?: string;
      lang?: string;
      loading?: string;
    };
  };
  
  // Navigation
  navigation: {
    showNavigation: boolean;
    style: "traditional" | "minimal";
    showMobileMenu: boolean;
    pages: Array<{ title: string; url: string }>;
    social: Array<{ title: string; url: string; icon: string }>;
  };
  
  // Profile Picture
  profilePicture: {
    enabled: boolean;
    image: string;
    alt: string;
    size: "sm" | "md" | "lg";
    url?: string;
    placement: "footer" | "header";
    style: "circle" | "square" | "none";
  };
}

// Template-specific configurations
const getTemplateConfig = (template: string): Partial<SiteConfig> => {
  switch (template) {
            case 'standard':
              return {
                theme: '${settings.currentTheme}',
                fonts: {
                  source: '${settings.typography.fontSource}',
                  families: {
                    body: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.prose : settings.typography.proseFont}',
                    heading: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.heading : settings.typography.headingFont}',
                    mono: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.mono : settings.typography.monoFont}',
                  },
                  display: 'swap',
                },
        layout: {
          contentWidth: '45rem',
        },
        footer: {
          enabled: true,
          content: '© 2025 {author}. Built with Astro Modular.',
          showSocialIconsInFooter: true,
        },
        scrollToTop: true,
        darkModeToggleButton: 'both',
        commandPalette: {
          enabled: true,
          searchPosts: true,
          searchPages: true,
          searchProjects: true,
          searchDocs: true,
          sections: {
            quotations: true,
            pages: true,
            social: true,
          },
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
            enabled: false,
            count: 2,
          },
          docs: {
            enabled: false,
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
            showOrphanedPosts: true,
          },
          postNavigation: true,
          showPostCardCoverImages: 'featured-and-posts',
          postCardAspectRatio: 'og',
          comments: {
            enabled: ${settings.optionalFeatures.comments.enabled},
            provider: 'giscus',
          },
        },
        navigation: {
          showNavigation: true,
          style: 'traditional',
          showMobileMenu: true,
          pages: [
            { title: 'Posts', url: '/posts' },
            { title: 'About', url: '/about' }
          ],
          social: [
            { title: 'GitHub', url: 'https://github.com/username', icon: 'github' }
          ],
        },
        profilePicture: {
          enabled: ${settings.optionalFeatures.profilePicture.enabled},
          image: '${settings.optionalFeatures.profilePicture.image}',
          alt: '${settings.optionalFeatures.profilePicture.alt}',
          size: '${settings.optionalFeatures.profilePicture.size}',
          url: '${settings.optionalFeatures.profilePicture.url}',
          placement: '${settings.optionalFeatures.profilePicture.placement}',
          style: '${settings.optionalFeatures.profilePicture.style}',
        },
        deployment: {
          platform: '${settings.deployment.platform}',
        },
      };
            case 'compact':
              return {
                theme: '${settings.currentTheme}',
                fonts: {
                  source: '${settings.typography.fontSource}',
                  families: {
                    body: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.prose : settings.typography.proseFont}',
                    heading: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.heading : settings.typography.headingFont}',
                    mono: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.mono : settings.typography.monoFont}',
                  },
                  display: 'swap',
                },
        layout: {
          contentWidth: '42rem',
        },
        footer: {
          enabled: true,
          content: '© 2025 {author}. Built with Astro Modular.',
          showSocialIconsInFooter: false,
        },
        scrollToTop: true,
        darkModeToggleButton: 'commandPalette',
        commandPalette: {
          enabled: true,
          searchPosts: true,
          searchPages: false,
          searchProjects: true,
          searchDocs: true,
          sections: {
            quotations: true,
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
          projects: {
            enabled: false,
            count: 2,
          },
          docs: {
            enabled: false,
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
            linkedMentionsCompact: true,
          },
          graphView: {
            enabled: false,
            showInSidebar: false,
            showInCommandPalette: false,
            maxNodes: 100,
            showOrphanedPosts: true,
          },
          postNavigation: true,
          showPostCardCoverImages: 'posts',
          postCardAspectRatio: 'custom',
          customPostCardAspectRatio: '2.5/1',
          comments: {
            enabled: ${settings.optionalFeatures.comments.enabled},
            provider: 'giscus',
          },
        },
        navigation: {
          showNavigation: true,
          style: 'minimal',
          showMobileMenu: true,
          pages: [
            { title: 'Posts', url: '/posts' },
            { title: 'About', url: '/about' }
          ],
          social: [
            { title: 'GitHub', url: 'https://github.com/username', icon: 'github' }
          ],
        },
        profilePicture: {
          enabled: ${settings.optionalFeatures.profilePicture.enabled},
          image: '${settings.optionalFeatures.profilePicture.image}',
          alt: '${settings.optionalFeatures.profilePicture.alt}',
          size: '${settings.optionalFeatures.profilePicture.size}',
          url: '${settings.optionalFeatures.profilePicture.url}',
          placement: '${settings.optionalFeatures.profilePicture.placement}',
          style: '${settings.optionalFeatures.profilePicture.style}',
        },
        deployment: {
          platform: '${settings.deployment.platform}',
        },
      };
            case 'minimal':
              return {
                theme: '${settings.currentTheme}',
                fonts: {
                  source: '${settings.typography.fontSource}',
                  families: {
                    body: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.prose : settings.typography.proseFont}',
                    heading: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.heading : settings.typography.headingFont}',
                    mono: '${settings.typography.fontSource === 'cdn' ? settings.typography.customFonts.mono : settings.typography.monoFont}',
                  },
                  display: 'swap',
                },
        layout: {
          contentWidth: '40rem',
        },
        footer: {
          enabled: true,
          content: '© 2025 {author}. Built with Astro Modular.',
          showSocialIconsInFooter: true,
        },
        scrollToTop: true,
        darkModeToggleButton: 'commandPalette',
        commandPalette: {
          enabled: true,
          searchPosts: true,
          searchPages: true,
          searchProjects: false,
          searchDocs: false,
          sections: {
            quotations: false,
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
          projects: {
            enabled: false,
            count: 2,
          },
          docs: {
            enabled: false,
            count: 3,
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
            showInSidebar: false,
            showInCommandPalette: false,
            maxNodes: 100,
            showOrphanedPosts: true,
          },
          postNavigation: false,
          showPostCardCoverImages: 'none',
          postCardAspectRatio: 'og',
          comments: {
            enabled: ${settings.optionalFeatures.comments.enabled},
            provider: 'giscus',
          },
        },
        navigation: {
          showNavigation: true,
          style: 'minimal',
          showMobileMenu: true,
          pages: [
            { title: 'Posts', url: '/posts' },
            { title: 'About', url: '/about' }
          ],
          social: [
            { title: 'GitHub', url: 'https://github.com/username', icon: 'github' }
          ],
        },
        profilePicture: {
          enabled: ${settings.optionalFeatures.profilePicture.enabled},
          image: '${settings.optionalFeatures.profilePicture.image}',
          alt: '${settings.optionalFeatures.profilePicture.alt}',
          size: '${settings.optionalFeatures.profilePicture.size}',
          url: '${settings.optionalFeatures.profilePicture.url}',
          placement: '${settings.optionalFeatures.profilePicture.placement}',
          style: '${settings.optionalFeatures.profilePicture.style}',
        },
        deployment: {
          platform: '${settings.deployment.platform}',
        },
      };
    default:
      return {};
  }
};

// Export the site configuration
export const siteConfig: SiteConfig = {
  // Site Information
  site: 'https://yourdomain.com',
  title: 'Your Blog Title',
  description: 'Your blog description',
  author: 'Your Name',
  language: 'en',
  
  // Apply template configuration
  ...getTemplateConfig('${templateName}'),
} as SiteConfig;

export default siteConfig;`;

		return baseConfig;
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
