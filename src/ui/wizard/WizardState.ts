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
	selectedDeployment: 'netlify' | 'vercel' | 'github-pages';
	runWizardOnStartup: boolean;
	
	// Original settings
	originalSettings: AstroModularSettings;
}

export class WizardStateManager {
	private state: WizardState;

	constructor(settings: AstroModularSettings) {
		this.state = {
			currentStep: 1,
			totalSteps: 10,
			selectedTemplate: settings.currentTemplate,
			selectedTheme: settings.currentTheme,
			selectedContentOrg: settings.contentOrganization,
			selectedSiteInfo: settings.siteInfo,
			selectedNavigation: settings.navigation,
			selectedFeatures: settings.features,
			selectedTypography: settings.typography,
			selectedOptionalFeatures: settings.optionalFeatures || {},
			selectedDeployment: settings.deployment.platform,
			runWizardOnStartup: settings.runWizardOnStartup,
			originalSettings: settings
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

	buildFinalSettings(): AstroModularSettings {
		return {
			...this.state.originalSettings,
			currentTemplate: this.state.selectedTemplate,
			currentTheme: this.state.selectedTheme,
			contentOrganization: this.state.selectedContentOrg,
			siteInfo: this.state.selectedSiteInfo,
			// Use originalSettings.navigation since it's updated directly by NavigationStep
			navigation: this.state.originalSettings.navigation,
			features: this.state.selectedFeatures,
			typography: this.state.selectedTypography,
			optionalFeatures: this.state.selectedOptionalFeatures,
			deployment: {
				...this.state.originalSettings.deployment,
				platform: this.state.selectedDeployment
			},
			runWizardOnStartup: this.state.runWizardOnStartup
		};
	}
}
