export interface AstroModularSettings {
	// Wizard settings
	runWizardOnStartup: boolean;
	doNotShowWizardAgain: boolean;
	
	// Current configuration
	currentTemplate: TemplateType;
	currentTheme: ThemeType;
	contentOrganization: ContentOrganizationType;
	
	// Features (for custom template)
	features: FeatureSettings;
	
	// Plugin configuration
	pluginConfig: PluginConfiguration;
}

export interface FeatureSettings {
	commandPalette: boolean;
	tableOfContents: boolean;
	readingTime: boolean;
	linkedMentions: boolean;
	comments: boolean;
}

export interface PluginConfiguration {
	obsidianSettings: ObsidianSettings;
	astroComposerSettings: AstroComposerSettings;
	imageInserterSettings: ImageInserterSettings;
}

export interface ObsidianSettings {
	attachmentLocation: 'subfolder' | 'same-folder';
	subfolderName: string;
}

export interface AstroComposerSettings {
	creationMode: 'file-based' | 'folder-based';
	indexFileName: string;
}

export interface ImageInserterSettings {
	insertFormat: string;
}

export type TemplateType = 'standard' | 'minimal' | 'compact' | 'documentation' | 'custom';

export type ThemeType = 
	| 'oxygen' | 'minimal' | 'atom' | 'ayu-light' | 'ayu-mirage' | 'ayu-dark'
	| 'catppuccin' | 'charcoal' | 'dracula' | 'everforest' | 'flexoki' | 'gruvbox'
	| 'macos' | 'nord' | 'obsidian' | 'rose-pine' | 'sky' | 'solarized' | 'things';

export type ContentOrganizationType = 'file-based' | 'folder-based';

export interface PresetTemplate {
	name: string;
	description: string;
	features: FeatureSettings;
	theme: ThemeType;
	contentOrganization: ContentOrganizationType;
	config: Partial<AstroModularSettings>;
}

export interface WizardStep {
	stepNumber: number;
	title: string;
	description: string;
	canSkip: boolean;
	defaultValue?: any;
}

export interface ThemeOption {
	id: ThemeType;
	name: string;
	description: string;
	previewColors: string[];
}

export interface TemplateOption {
	id: TemplateType;
	name: string;
	description: string;
	features: string[];
	recommended: boolean;
}

export interface PluginStatus {
	name: string;
	installed: boolean;
	enabled: boolean;
	configurable: boolean;
	currentSettings?: any;
}

export interface ConfigFileInfo {
	exists: boolean;
	path: string;
	content: string;
	lastModified: Date;
	valid: boolean;
	errors: string[];
}

export const DEFAULT_SETTINGS: AstroModularSettings = {
	runWizardOnStartup: true,
	doNotShowWizardAgain: false,
	currentTemplate: 'standard',
	currentTheme: 'oxygen',
	contentOrganization: 'file-based',
	features: {
		commandPalette: true,
		tableOfContents: true,
		readingTime: true,
		linkedMentions: true,
		comments: true,
	},
	pluginConfig: {
		obsidianSettings: {
			attachmentLocation: 'subfolder',
			subfolderName: 'attachments',
		},
		astroComposerSettings: {
			creationMode: 'file-based',
			indexFileName: 'index',
		},
		imageInserterSettings: {
			insertFormat: '[[attachments/{image-url}]]',
		},
	},
};

export const THEME_OPTIONS: ThemeOption[] = [
	{
		id: 'oxygen',
		name: 'Oxygen',
		description: 'Modern, clean design',
		previewColors: ['#3b82f6', '#1e40af', '#ffffff'],
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Understated with high contrast',
		previewColors: ['#000000', '#ffffff', '#666666'],
	},
	{
		id: 'atom',
		name: 'Atom',
		description: 'Dark theme with vibrant accents',
		previewColors: ['#282c34', '#61dafb', '#98c379'],
	},
	{
		id: 'ayu-light',
		name: 'Ayu Light',
		description: 'Clean light theme',
		previewColors: ['#fafafa', '#ff6b6b', '#4ecdc4'],
	},
	{
		id: 'ayu-mirage',
		name: 'Ayu Mirage',
		description: 'Soft dark theme',
		previewColors: ['#1f2430', '#ffcc66', '#5ccfe6'],
	},
	{
		id: 'ayu-dark',
		name: 'Ayu Dark',
		description: 'Deep dark theme',
		previewColors: ['#0d1117', '#ffcc66', '#5ccfe6'],
	},
	{
		id: 'catppuccin',
		name: 'Catppuccin',
		description: 'Pastel color palette',
		previewColors: ['#1e1e2e', '#f5c2e7', '#a6e3a1'],
	},
	{
		id: 'charcoal',
		name: 'Charcoal',
		description: 'Dark, professional look',
		previewColors: ['#2d2d2d', '#ffffff', '#ff6b6b'],
	},
	{
		id: 'dracula',
		name: 'Dracula',
		description: 'Dark theme with purple accents',
		previewColors: ['#282a36', '#bd93f9', '#50fa7b'],
	},
	{
		id: 'everforest',
		name: 'Everforest',
		description: 'Soft, warm colors',
		previewColors: ['#2d353b', '#a7c080', '#dbbc7f'],
	},
	{
		id: 'flexoki',
		name: 'Flexoki',
		description: 'Based on Material Design 3',
		previewColors: ['#100f0f', '#f2f0e5', '#ff6b6b'],
	},
	{
		id: 'gruvbox',
		name: 'Gruvbox',
		description: 'Retro groove color scheme',
		previewColors: ['#282828', '#fabd2f', '#b16286'],
	},
	{
		id: 'macos',
		name: 'macOS',
		description: 'Native macOS appearance',
		previewColors: ['#ffffff', '#007aff', '#34c759'],
	},
	{
		id: 'nord',
		name: 'Nord',
		description: 'Arctic-inspired color palette',
		previewColors: ['#2e3440', '#88c0d0', '#a3be8c'],
	},
	{
		id: 'obsidian',
		name: 'Obsidian',
		description: 'Matches Obsidian\'s default theme',
		previewColors: ['#1e1e1e', '#ffffff', '#7c3aed'],
	},
	{
		id: 'rose-pine',
		name: 'Rosé Pine',
		description: 'All natural pine, faux fir, and winter',
		previewColors: ['#191724', '#eb6f92', '#9ccfd8'],
	},
	{
		id: 'sky',
		name: 'Sky',
		description: 'Light, airy design',
		previewColors: ['#f0f9ff', '#0ea5e9', '#06b6d4'],
	},
	{
		id: 'solarized',
		name: 'Solarized',
		description: 'Precision colors for machines and people',
		previewColors: ['#002b36', '#268bd2', '#859900'],
	},
	{
		id: 'things',
		name: 'Things',
		description: 'Clean, minimal design',
		previewColors: ['#ffffff', '#000000', '#007aff'],
	},
];

export const TEMPLATE_OPTIONS: TemplateOption[] = [
	{
		id: 'standard',
		name: 'Standard',
		description: 'Full-featured blog with all options enabled',
		features: ['Command palette', 'Table of contents', 'Reading time', 'Linked mentions', 'Comments'],
		recommended: true,
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Clean, simple blog with minimal features',
		features: ['Command palette', 'Table of contents'],
		recommended: false,
	},
	{
		id: 'compact',
		name: 'Compact',
		description: 'Balanced setup for smaller sites',
		features: ['Command palette', 'Table of contents', 'Reading time'],
		recommended: false,
	},
	{
		id: 'documentation',
		name: 'Documentation',
		description: 'Optimized for technical documentation',
		features: ['Table of contents', 'Linked mentions', 'Comments'],
		recommended: false,
	},
	{
		id: 'custom',
		name: 'Custom',
		description: 'Granular control over every setting',
		features: ['All features configurable'],
		recommended: false,
	},
];
