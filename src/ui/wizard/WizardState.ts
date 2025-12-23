import { Plugin } from 'obsidian';
import { TemplateType, ThemeType, ContentOrganizationType, SiteInformation, NavigationSettings, FeatureSettings, TypographySettings, OptionalFeatures, AstroModularPlugin } from '../../types';

export interface WizardState {
	// Current step
	currentStep: number;
	totalSteps: number;
	
	// Wizard selections
	selectedTemplate: TemplateType;
	selectedTheme: ThemeType;
	selectedContentOrg: ContentOrganizationType;
	selectedSiteInfo: SiteInformation;
	selectedNavigation: NavigationSettings;
	selectedFeatures: FeatureSettings;
	selectedTypography: TypographySettings;
	selectedOptionalFeatures: OptionalFeatures;
	selectedOptionalContentTypes: {
		projects: boolean;
		docs: boolean;
	};
	selectedDeployment: 'netlify' | 'vercel' | 'github-pages' | 'cloudflare-workers';
	runWizardOnStartup: boolean;
}

export class WizardStateManager {
	private state: WizardState;
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		const settings = (plugin as AstroModularPlugin).settings;
		this.state = {
			currentStep: 1,
			totalSteps: 10,
			selectedTemplate: settings.currentTemplate,
			selectedTheme: settings.currentTheme,
			selectedContentOrg: settings.contentOrganization,
			selectedSiteInfo: settings.siteInfo,
			selectedNavigation: settings.navigation,
			selectedFeatures: (() => {
				// Initialize features based on current template
				const templateFeatures: Record<string, FeatureSettings> = {
				'standard': {
					commandPalette: true,
					tableOfContents: true,
					readingTime: true,
					linkedMentions: true,
					linkedMentionsCompact: false,
					graphView: true,
					postNavigation: true,
					hideScrollBar: false,
					scrollToTop: true,
					showSocialIconsInFooter: true,
					profilePicture: false,
					comments: false,
					featureButton: 'mode',
					showPostCardCoverImages: 'featured-and-posts',
					postCardAspectRatio: 'og',
					customPostCardAspectRatio: '2.5/1',
					quickActions: {
						enabled: true,
						toggleMode: true,
						graphView: true,
						changeTheme: true,
					}
				},
					'compact': {
						commandPalette: true,
						tableOfContents: true,
						readingTime: true,
						linkedMentions: true,
						linkedMentionsCompact: true,
						graphView: false,
						postNavigation: true,
						hideScrollBar: false,
						scrollToTop: true,
						showSocialIconsInFooter: false,
						profilePicture: false,
						comments: false,
						featureButton: 'none',
						showPostCardCoverImages: 'featured-and-posts',
						postCardAspectRatio: 'og',
						customPostCardAspectRatio: '2.5/1',
						quickActions: {
							enabled: true,
							toggleMode: true,
							graphView: true,
							changeTheme: true,
						}
					},
					'minimal': {
						commandPalette: true,
						tableOfContents: false,
						readingTime: false,
						linkedMentions: false,
						linkedMentionsCompact: false,
						graphView: false,
						postNavigation: false,
						hideScrollBar: true,
						scrollToTop: true,
						showSocialIconsInFooter: false,
						profilePicture: false,
						comments: false,
						featureButton: 'none',
						showPostCardCoverImages: 'featured-and-posts',
						postCardAspectRatio: 'og',
						customPostCardAspectRatio: '2.5/1',
						quickActions: {
							enabled: true,
							toggleMode: true,
							graphView: true,
							changeTheme: true,
						}
					},
					'custom': {
						// For custom, use current settings
						...settings.features
					}
				};
				const templateFeaturesResult = templateFeatures[settings.currentTemplate] || templateFeatures['standard'];
				
				// Ensure profile picture and comments features are synchronized with existing settings
				if (settings.optionalFeatures?.profilePicture) {
					templateFeaturesResult.profilePicture = settings.optionalFeatures.profilePicture.enabled;
				}
				if (settings.optionalFeatures?.comments) {
					templateFeaturesResult.comments = settings.optionalFeatures.comments.enabled;
				}
				
				return templateFeaturesResult;
			})(),
			selectedTypography: settings.typography,
			selectedOptionalFeatures: {
				profilePicture: {
					enabled: settings.optionalFeatures?.profilePicture?.enabled || false,
					image: settings.optionalFeatures?.profilePicture?.image || '/profile.jpg',
					alt: settings.optionalFeatures?.profilePicture?.alt || 'Profile picture',
					size: settings.optionalFeatures?.profilePicture?.size || 'md',
					url: settings.optionalFeatures?.profilePicture?.url || '',
					placement: settings.optionalFeatures?.profilePicture?.placement || 'footer',
					style: settings.optionalFeatures?.profilePicture?.style || 'circle',
				},
				comments: (() => {
					const commentsEnabled = settings.optionalFeatures?.comments?.enabled || false;
					const existingComments = settings.optionalFeatures?.comments;
					
					// If comments are disabled, preserve existing values (don't populate defaults)
					if (!commentsEnabled) {
						return {
							enabled: false,
							provider: existingComments?.provider || 'giscus',
							rawScript: existingComments?.rawScript || '',
							repo: existingComments?.repo || '',
							repoId: existingComments?.repoId || '',
							category: existingComments?.category || '',
							categoryId: existingComments?.categoryId || '',
							mapping: existingComments?.mapping || '',
							strict: existingComments?.strict || '',
							reactions: existingComments?.reactions || '',
							metadata: existingComments?.metadata || '',
							inputPosition: existingComments?.inputPosition || '',
							theme: existingComments?.theme || '',
							lang: existingComments?.lang || '',
							loading: existingComments?.loading || '',
						};
					}
					
					// If comments are enabled, use defaults for missing values
					return {
						enabled: true,
						provider: existingComments?.provider || 'giscus',
						rawScript: existingComments?.rawScript || '',
						repo: existingComments?.repo || 'davidvkimball/astro-modular',
						repoId: existingComments?.repoId || 'R_kgDOPllfKw',
						category: existingComments?.category || 'General',
						categoryId: existingComments?.categoryId || 'DIC_kwDOPllfK84CvUpx',
						mapping: existingComments?.mapping || 'pathname',
						strict: existingComments?.strict || '0',
						reactions: existingComments?.reactions || '1',
						metadata: existingComments?.metadata || '0',
						inputPosition: existingComments?.inputPosition || 'bottom',
						theme: existingComments?.theme || 'preferred_color_scheme',
						lang: existingComments?.lang || 'en',
						loading: existingComments?.loading || 'lazy',
					};
				})(),
			},
			selectedOptionalContentTypes: (() => {
				// Set based on current template: enabled for 'standard', disabled for others
				const isStandard = settings.currentTemplate === 'standard';
				return {
					projects: isStandard,
					docs: isStandard
				};
			})(),
			selectedDeployment: settings.deployment.platform,
			runWizardOnStartup: settings.runWizardOnStartup
		};
	}

	getState(): WizardState {
		return this.state;
	}

	updateState(updates: Partial<WizardState>): void {
		this.state = { ...this.state, ...updates };
	}

	setState(updates: Partial<WizardState>): void {
		this.state = { ...this.state, ...updates };
	}

	nextStep(): void {
		if (this.state.currentStep < this.state.totalSteps) {
			this.state.currentStep++;
		}
	}

	previousStep(): void {
		if (this.state.currentStep > 1) {
			this.state.currentStep--;
		}
	}

	canGoNext(): boolean {
		return this.state.currentStep < this.state.totalSteps;
	}

	canGoPrevious(): boolean {
		return this.state.currentStep > 1;
	}

	getProgress(): number {
		return (this.state.currentStep / this.state.totalSteps) * 100;
	}

	refreshState(): void {
		// Refresh the wizard state with current plugin settings
		const settings = (this.plugin as AstroModularPlugin).settings;
		
		// Update the state with current settings
		this.state.selectedTemplate = settings.currentTemplate;
		this.state.selectedTheme = settings.currentTheme;
		this.state.selectedContentOrg = settings.contentOrganization;
		this.state.selectedSiteInfo = settings.siteInfo;
		this.state.selectedNavigation = settings.navigation;
		this.state.selectedTypography = settings.typography;
		this.state.selectedDeployment = settings.deployment.platform;
		this.state.runWizardOnStartup = settings.runWizardOnStartup;
		
		// Update features with current settings, preserving template defaults for missing values
		const templateFeatures: Record<string, FeatureSettings> = {
			'standard': {
				commandPalette: true, tableOfContents: true, readingTime: true, linkedMentions: true,
				linkedMentionsCompact: false, graphView: true, postNavigation: true, hideScrollBar: false,
				scrollToTop: true, showSocialIconsInFooter: true, profilePicture: false, comments: false,
				featureButton: 'mode', showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og',
				customPostCardAspectRatio: '2.5/1', quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true }
			},
			'compact': {
				commandPalette: true, tableOfContents: true, readingTime: true, linkedMentions: true,
				linkedMentionsCompact: true, graphView: false, postNavigation: true, hideScrollBar: false,
				scrollToTop: true, showSocialIconsInFooter: false, profilePicture: false, comments: false,
				featureButton: 'none', showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og',
				customPostCardAspectRatio: '2.5/1', quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true }
			},
			'minimal': {
				commandPalette: true, tableOfContents: false, readingTime: false, linkedMentions: false,
				linkedMentionsCompact: false, graphView: false, postNavigation: false, hideScrollBar: true,
				scrollToTop: true, showSocialIconsInFooter: false, profilePicture: false, comments: false,
				featureButton: 'none', showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og',
				customPostCardAspectRatio: '2.5/1', quickActions: { enabled: true, toggleMode: true, graphView: true, changeTheme: true }
			},
		};
		
		const templateFeaturesResult = templateFeatures[settings.currentTemplate] || templateFeatures['standard'];
		
		// Ensure profile picture and comments features are synchronized with existing settings
		if (settings.optionalFeatures?.profilePicture) {
			templateFeaturesResult.profilePicture = settings.optionalFeatures.profilePicture.enabled;
		}
		if (settings.optionalFeatures?.comments) {
			templateFeaturesResult.comments = settings.optionalFeatures.comments.enabled;
		}
		
		this.state.selectedFeatures = templateFeaturesResult;
		
		// Update optional features with current settings
		this.state.selectedOptionalFeatures = {
			profilePicture: {
				enabled: settings.optionalFeatures?.profilePicture?.enabled || false,
				image: settings.optionalFeatures?.profilePicture?.image || '/profile.jpg',
				alt: settings.optionalFeatures?.profilePicture?.alt || 'Profile picture',
				size: settings.optionalFeatures?.profilePicture?.size || 'md',
				url: settings.optionalFeatures?.profilePicture?.url || '',
				placement: settings.optionalFeatures?.profilePicture?.placement || 'footer',
				style: settings.optionalFeatures?.profilePicture?.style || 'circle',
			},
			comments: (() => {
				const commentsEnabled = settings.optionalFeatures?.comments?.enabled || false;
				const existingComments = settings.optionalFeatures?.comments;
				
				// If comments are disabled, preserve existing values (don't populate defaults)
				if (!commentsEnabled) {
					return {
						enabled: false,
						provider: existingComments?.provider || 'giscus',
						rawScript: existingComments?.rawScript || '',
						repo: existingComments?.repo || '',
						repoId: existingComments?.repoId || '',
						category: existingComments?.category || '',
						categoryId: existingComments?.categoryId || '',
						mapping: existingComments?.mapping || '',
						strict: existingComments?.strict || '',
						reactions: existingComments?.reactions || '',
						metadata: existingComments?.metadata || '',
						inputPosition: existingComments?.inputPosition || '',
						theme: existingComments?.theme || '',
						lang: existingComments?.lang || '',
						loading: existingComments?.loading || '',
					};
				}
				
				// If comments are enabled, use defaults for missing values
				return {
					enabled: true,
					provider: existingComments?.provider || 'giscus',
					rawScript: existingComments?.rawScript || '',
					repo: existingComments?.repo || 'davidvkimball/astro-modular',
					repoId: existingComments?.repoId || 'R_kgDOPllfKw',
					category: existingComments?.category || 'General',
					categoryId: existingComments?.categoryId || 'DIC_kwDOPllfK84CvUpx',
					mapping: existingComments?.mapping || 'pathname',
					strict: existingComments?.strict || '0',
					reactions: existingComments?.reactions || '1',
					metadata: existingComments?.metadata || '0',
					inputPosition: existingComments?.inputPosition || 'bottom',
					theme: existingComments?.theme || 'preferred_color_scheme',
					lang: existingComments?.lang || 'en',
					loading: existingComments?.loading || 'lazy',
				};
			})(),
		};
		
		// Update optional content types
		const isStandard = settings.currentTemplate === 'standard';
		this.state.selectedOptionalContentTypes = {
			projects: isStandard,
			docs: isStandard
		};
	}

	buildFinalSettings(): void {
		// Update plugin.settings directly instead of returning a new object
		const settings = (this.plugin as AstroModularPlugin).settings;
		
		// Store the original template to detect if it changed
		const originalTemplate = settings.currentTemplate;
		
		settings.currentTemplate = this.state.selectedTemplate;
		settings.currentTheme = this.state.selectedTheme;
		settings.contentOrganization = this.state.selectedContentOrg;
		settings.siteInfo = this.state.selectedSiteInfo;
		settings.navigation = this.state.selectedNavigation;
		settings.features = this.state.selectedFeatures;
		settings.typography = this.state.selectedTypography;
		settings.optionalFeatures = this.state.selectedOptionalFeatures;
		settings.deployment.platform = this.state.selectedDeployment;
		settings.runWizardOnStartup = this.state.runWizardOnStartup;

		// CRITICAL: Sync postOptions and commandPalette with features after wizard completion
		// This ensures data.json has consistent values
		if (this.state.selectedFeatures) {
			// Sync postOptions.graphView with features.graphView
			if (settings.postOptions?.graphView) {
				settings.postOptions.graphView.enabled = this.state.selectedFeatures.graphView ?? false;
			}
			
			// Sync linked mentions
			if (settings.postOptions?.linkedMentions) {
				settings.postOptions.linkedMentions.enabled = this.state.selectedFeatures.linkedMentions ?? false;
				settings.postOptions.linkedMentions.linkedMentionsCompact = this.state.selectedFeatures.linkedMentionsCompact ?? false;
			}
			
			// Sync command palette quick actions
			if (settings.commandPalette?.quickActions && this.state.selectedFeatures.quickActions) {
				settings.commandPalette.quickActions = { 
					...settings.commandPalette.quickActions, 
					...this.state.selectedFeatures.quickActions 
				};
			}
		}

		// ONLY apply template preset changes if the template was actually changed
		// This prevents reverting user customizations when navigating the wizard
		if (this.state.selectedTemplate !== originalTemplate) {
			const templatePreset = (this.plugin as AstroModularPlugin).configManager.getTemplatePreset(this.state.selectedTemplate);
			if (templatePreset && templatePreset.config) {
				// Update table of contents settings from preset
				if (templatePreset.config.tableOfContents) {
					settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
				}
			}
		}

		// Synchronize profile picture settings between features and optionalFeatures
		if (settings.optionalFeatures?.profilePicture) {
			settings.features.profilePicture = settings.optionalFeatures.profilePicture.enabled;
		}

		// Synchronize comments settings between features, optionalFeatures, and postOptions
		if (settings.optionalFeatures?.comments) {
			settings.features.comments = settings.optionalFeatures.comments.enabled;
			
			// Also sync postOptions.comments.enabled to ensure consistency
			if (!settings.postOptions) {
				settings.postOptions = { postsPerPage: 6, readingTime: true, wordCount: true, tableOfContents: true, tags: true, linkedMentions: { enabled: true, linkedMentionsCompact: false }, graphView: { enabled: true, showInSidebar: true, maxNodes: 100, showOrphanedPosts: true }, postNavigation: true, showPostCardCoverImages: 'featured-and-posts', postCardAspectRatio: 'og', customPostCardAspectRatio: '2.5/1', comments: { ...settings.optionalFeatures.comments } };
			} else if (!settings.postOptions.comments) {
				settings.postOptions.comments = { ...settings.optionalFeatures.comments };
			} else {
				// Preserve existing comment settings but update enabled state
				settings.postOptions.comments.enabled = settings.optionalFeatures.comments.enabled;
				// Also sync all other comment fields from optionalFeatures
				Object.assign(settings.postOptions.comments, settings.optionalFeatures.comments);
			}
		}

		// Sync optional content types from wizard state
		settings.optionalContentTypes = this.state.selectedOptionalContentTypes;
	}
}
