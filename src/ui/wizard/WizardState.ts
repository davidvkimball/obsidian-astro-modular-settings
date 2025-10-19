import { Plugin } from 'obsidian';
import { AstroModularSettings, TemplateType, ThemeType, ContentOrganizationType } from '../../types';

export interface WizardState {
	// Current step
	currentStep: number;
	totalSteps: number;
	
	// Wizard selections
	selectedTemplate: TemplateType;
	selectedTheme: ThemeType;
	selectedContentOrg: ContentOrganizationType;
	selectedSiteInfo: any;
	selectedNavigation: any;
	selectedFeatures: any;
	selectedTypography: any;
	selectedOptionalFeatures: any;
	selectedOptionalContentTypes: {
		projects: boolean;
		docs: boolean;
	};
	selectedDeployment: 'netlify' | 'vercel' | 'github-pages';
	runWizardOnStartup: boolean;
}

export class WizardStateManager {
	private state: WizardState;
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		const settings = (plugin as any).settings;
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
				const templateFeatures: Record<string, any> = {
					'standard': {
						commandPalette: true,
						tableOfContents: true,
						readingTime: true,
						linkedMentions: true,
						linkedMentionsCompact: false,
						graphView: true,
						postNavigation: true,
						scrollToTop: true,
						showSocialIconsInFooter: true,
						profilePicture: false,
						comments: true
					},
					'compact': {
						commandPalette: true,
						tableOfContents: true,
						readingTime: true,
						linkedMentions: true,
						linkedMentionsCompact: true,
						graphView: false,
						postNavigation: true,
						scrollToTop: true,
						showSocialIconsInFooter: false,
						profilePicture: false,
						comments: false
					},
					'minimal': {
						commandPalette: true,
						tableOfContents: false,
						readingTime: false,
						linkedMentions: false,
						linkedMentionsCompact: false,
						graphView: false,
						postNavigation: false,
						scrollToTop: true,
						showSocialIconsInFooter: false,
						profilePicture: false,
						comments: false
					},
					'custom': {
						// For custom, use current settings
						...settings.features
					}
				};
				return templateFeatures[settings.currentTemplate] || templateFeatures['standard'];
			})(),
			selectedTypography: settings.typography,
			selectedOptionalFeatures: settings.optionalFeatures || {},
			selectedOptionalContentTypes: (() => {
				// Set based on current template: enabled for 'standard' and 'custom', disabled for others
				const isStandardOrCustom = settings.currentTemplate === 'standard' || settings.currentTemplate === 'custom';
				return {
					projects: isStandardOrCustom,
					docs: isStandardOrCustom
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

	buildFinalSettings(): void {
		// Update plugin.settings directly instead of returning a new object
		const settings = (this.plugin as any).settings;
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

		// Synchronize profile picture settings between features and optionalFeatures
		if (settings.optionalFeatures?.profilePicture) {
			settings.features.profilePicture = settings.optionalFeatures.profilePicture.enabled;
		}

		// Synchronize comments settings between features and optionalFeatures
		if (settings.optionalFeatures?.comments) {
			settings.features.comments = settings.optionalFeatures.comments.enabled;
		}

		// Sync optional content types from wizard state
		settings.optionalContentTypes = this.state.selectedOptionalContentTypes;
	}
}
