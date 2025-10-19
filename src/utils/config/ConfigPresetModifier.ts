import { AstroModularSettings, PresetTemplate } from '../../types';
import { ConfigTemplateManager } from './ConfigTemplateManager';
import { ConfigMarkerValidator } from './ConfigMarkerValidator';

export class ConfigPresetModifier {
	private templateManager: ConfigTemplateManager;
	private markerValidator: ConfigMarkerValidator;

	constructor() {
		this.templateManager = new ConfigTemplateManager();
		this.markerValidator = new ConfigMarkerValidator();
	}

	modifyConfigFromPreset(preset: PresetTemplate, currentConfig: string): string {
		const settings = preset.config as AstroModularSettings;
		
		// First apply individual features to ensure they're not overridden by template
		let modifiedConfig = this.modifyConfigFromFeatures(settings, currentConfig);
		
		// Get the template configuration based on the preset name
		const templateConfig = this.templateManager.getTemplateConfig(preset.name, settings);
		
		// Update theme - use marker-based replacement
		const themeMarkerExists = modifiedConfig.includes('// [CONFIG:THEME]');
		
		if (themeMarkerExists) {
			const themeRegex = /\/\/ \[CONFIG:THEME\]\s*\n\s*theme:\s*"[^"]*"/;
			const themeMatch = modifiedConfig.match(themeRegex);
			
			modifiedConfig = modifiedConfig.replace(
				themeRegex,
				`// [CONFIG:THEME]\n  theme: "${settings.currentTheme}"`
			);
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
			
		}
			
			// Update sections settings - use individual markers
			if (templateConfig.commandPalette.sections) {
				
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
		const markerValidation = this.markerValidator.validateMarkers(modifiedConfig);
		if (!markerValidation.valid) {
			console.error('❌ Config modification failed: Missing markers:', markerValidation.missing);
			console.error('Please ensure all CONFIG markers are present in your config.ts file');
			return currentConfig; // Return original config if markers are missing
		}
		
		// Validate the modified config has proper syntax
		const syntaxValidation = this.markerValidator.validateSyntax(modifiedConfig);
		if (!syntaxValidation.valid) {
			console.error('❌ Config modification failed: Syntax errors:', syntaxValidation.errors);
			return currentConfig; // Return original config if syntax is broken
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

	modifyConfigFromFeatures(settings: AstroModularSettings, currentConfig: string): string {
		
		let modifiedConfig = currentConfig;
		
		// Update theme
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:THEME\]\s*\n\s*theme:\s*"[^"]*"/,
			`// [CONFIG:THEME]\n  theme: "${settings.currentTheme}"`
		);
		
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
		
		// Update command palette enabled state
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:COMMAND_PALETTE_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:COMMAND_PALETTE_ENABLED]\n    enabled: ${settings.features.commandPalette}`
		);
		
		// Update table of contents
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS\]\s*tableOfContents:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS]\n    tableOfContents: ${settings.features.tableOfContents}`
		);
		
		// Update reading time
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_READING_TIME\]\s*readingTime:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_READING_TIME]\n    readingTime: ${settings.features.readingTime}`
		);
		
		// Update word count (if it exists in features)
		if ('wordCount' in settings.features) {
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:POST_OPTIONS_WORD_COUNT\]\s*wordCount:\s*(true|false)/,
				`// [CONFIG:POST_OPTIONS_WORD_COUNT]\n    wordCount: ${(settings.features as any).wordCount}`
			);
		}
		
		// Update tags (if it exists in features)
		if ('tags' in settings.features) {
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:POST_OPTIONS_TAGS\]\s*tags:\s*(true|false)/,
				`// [CONFIG:POST_OPTIONS_TAGS]\n    tags: ${(settings.features as any).tags}`
			);
		}
		
		// Update linked mentions enabled
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED]\n      enabled: ${settings.features.linkedMentions}`
		);
		
		// Update linked mentions compact
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT\]\s*linkedMentionsCompact:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT]\n      linkedMentionsCompact: ${settings.features.linkedMentionsCompact}`
		);
		
		// Update comments enabled
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_COMMENTS_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_COMMENTS_ENABLED]\n      enabled: ${settings.features.comments}`
		);
		
		// Update graph view enabled
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED\]\s*enabled:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED]\n    enabled: ${settings.features.graphView}`
		);
		
		// Update post navigation
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_POST_NAVIGATION\]\s*postNavigation:\s*(true|false)/,
			`// [CONFIG:POST_OPTIONS_POST_NAVIGATION]\n    postNavigation: ${settings.features.postNavigation}`
		);
		
		// Update scroll to top
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:SCROLL_TO_TOP\]\s*scrollToTop:\s*(true|false)/,
			`// [CONFIG:SCROLL_TO_TOP]\n  scrollToTop: ${settings.features.scrollToTop}`
		);
		
		// Update social icons in footer
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:FOOTER_SHOW_SOCIAL_ICONS\]\s*showSocialIconsInFooter:\s*(true|false)/,
			`// [CONFIG:FOOTER_SHOW_SOCIAL_ICONS]\n    showSocialIconsInFooter: ${settings.features.showSocialIconsInFooter}`
		);
		
		// Update dark mode toggle button
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:DARK_MODE_TOGGLE_BUTTON\]\s*darkModeToggleButton:\s*"[^"]*"/,
			`// [CONFIG:DARK_MODE_TOGGLE_BUTTON]\n  darkModeToggleButton: "${settings.features.darkModeToggleButton}"`
		);
		
		// Update post card cover images
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES\]\s*showPostCardCoverImages:\s*"[^"]*"/,
			`// [CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES]\n    showPostCardCoverImages: "${settings.features.showPostCardCoverImages}"`
		);
		
		// Update post card aspect ratio
		modifiedConfig = modifiedConfig.replace(
			/\/\/ \[CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO\]\s*postCardAspectRatio:\s*"[^"]*"/,
			`// [CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO]\n    postCardAspectRatio: "${settings.features.postCardAspectRatio}"`
		);
		
		// Update custom post card aspect ratio if it exists
		if (settings.features.customPostCardAspectRatio) {
			modifiedConfig = modifiedConfig.replace(
				/\/\/ \[CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO\]\s*customPostCardAspectRatio:\s*"[^"]*"/,
				`// [CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO]\n    customPostCardAspectRatio: "${settings.features.customPostCardAspectRatio}"`
			);
		}
		
		return modifiedConfig;
	}
}
