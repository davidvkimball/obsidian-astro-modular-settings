import { App, TFile, Notice } from 'obsidian';
import { AstroModularSettings, ConfigFileInfo, PresetTemplate } from '../types';

export class ConfigManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		this.configPath = '../../../config.ts'; // Path to src/config.ts from the plugin location
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		const file = this.app.vault.getAbstractFileByPath(this.configPath) as TFile;
		
		if (!file) {
			return {
				exists: false,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: ['Config file not found']
			};
		}

		try {
			const content = await this.app.vault.read(file);
			const lastModified = new Date(file.stat.mtime);
			
			// Basic validation - check if it's a valid TypeScript file
			const valid = this.validateConfigContent(content);
			const errors = valid ? [] : ['Invalid TypeScript syntax or missing required exports'];

			return {
				exists: true,
				path: this.configPath,
				content,
				lastModified,
				valid,
				errors
			};
		} catch (error) {
			return {
				exists: true,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: [`Error reading file: ${error.message}`]
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
		try {
			await this.app.vault.create(this.configPath, content);
			return true;
		} catch (error) {
			// If file exists, try to modify it
			try {
				await this.app.vault.modify(
					this.app.vault.getAbstractFileByPath(this.configPath) as TFile,
					content
				);
				return true;
			} catch (modifyError) {
				return false;
			}
		}
	}

	async applyPreset(preset: PresetTemplate): Promise<boolean> {
		const currentConfig = await this.readConfig();
		const newConfig = this.generateConfigFromPreset(preset, currentConfig);
		return await this.writeConfig(newConfig);
	}

	private generateConfigFromPreset(preset: PresetTemplate, currentConfig: string): string {
		// Generate a proper config.ts file based on the selected template
		const settings = preset.config as AstroModularSettings;
		
		// Template-specific configurations
		let config = this.getTemplateConfig(preset.name, settings);
		
		return config;
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
