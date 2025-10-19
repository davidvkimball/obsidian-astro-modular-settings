import { AstroModularSettings } from '../../types';

export class ConfigTemplateManager {
	private interpolateTemplate(template: string, settings: AstroModularSettings, templateName: string): string {
		
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
		
		
		return result;
	}

	getTemplateConfig(templateName: string, settings: AstroModularSettings): any {
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
}
