export interface AstroModularSettings {
	// Wizard settings
	runWizardOnStartup: boolean;
	
	// Current configuration
	currentTemplate: TemplateType;
	currentTheme: ThemeType;
	contentOrganization: ContentOrganizationType;
	
	// Site information
	siteInfo: SiteInformation;
	
	// Navigation settings
	navigation: NavigationSettings;
	
	// Features (for custom template)
	features: FeatureSettings;
	
	// Typography settings
	typography: TypographySettings;
	
	// Optional features
	optionalFeatures: OptionalFeatures;
	
	// Deployment settings
	deployment: DeploymentSettings;
	
	// Plugin configuration
	pluginConfig: PluginConfiguration;
}

export interface SiteInformation {
	site: string;
	title: string;
	description: string;
	author: string;
	language: string;
}

export interface NavigationSettings {
	pages: Array<{ title: string; url: string }>;
	social: Array<{ title: string; url: string; icon: string }>;
}

export interface FeatureSettings {
	commandPalette: boolean;
	tableOfContents: boolean;
	readingTime: boolean;
	linkedMentions: boolean;
	comments: boolean;
	graphView: boolean;
	postNavigation: boolean;
	scrollToTop: boolean;
	darkModeToggleButton: 'navigation' | 'commandPalette' | 'both';
	showSocialIconsInFooter: boolean;
	showPostCardCoverImages: 'all' | 'featured' | 'home' | 'posts' | 'featured-and-posts' | 'none';
	postCardAspectRatio: 'og' | '16:9' | '4:3' | '3:2' | 'square' | 'golden' | 'custom';
	customPostCardAspectRatio?: string;
	linkedMentionsCompact: boolean;
}

export interface TypographySettings {
	headingFont: string;
	proseFont: string;
	monoFont: string;
	fontSource: 'local' | 'cdn';
	customFonts: {
		heading: string;
		prose: string;
		mono: string;
	};
}

export interface OptionalFeatures {
	profilePicture: ProfilePictureSettings;
	comments: CommentsSettings;
}

export interface ProfilePictureSettings {
	enabled: boolean;
	image: string;
	alt: string;
	size: 'sm' | 'md' | 'lg';
	url?: string;
	placement: 'footer' | 'header';
	style: 'circle' | 'square' | 'none';
}

export interface CommentsSettings {
	enabled: boolean;
	provider: 'giscus';
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
}

export interface DeploymentSettings {
	platform: 'netlify' | 'vercel' | 'github-pages';
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

export const FONT_OPTIONS = [
	'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Source Sans Pro', 'Nunito', 'Montserrat',
	'Playfair Display', 'Merriweather', 'Lora', 'Crimson Text', 'PT Serif', 'Libre Baskerville',
	'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'IBM Plex Mono', 'Cascadia Code'
];

export const DEFAULT_SETTINGS: AstroModularSettings = {
	runWizardOnStartup: true,
	currentTemplate: 'standard',
	currentTheme: 'oxygen',
	contentOrganization: 'file-based',
	siteInfo: {
		site: 'https://astro-modular.netlify.app',
		title: 'Astro Modular',
		description: 'A flexible blog theme designed for Obsidian users.',
		author: 'David V. Kimball',
		language: 'en',
	},
	navigation: {
		pages: [
			{ title: 'Posts', url: '/posts' },
			{ title: 'Projects', url: '/projects' },
			{ title: 'Docs', url: '/docs' },
			{ title: 'About', url: '/about' },
			{ title: 'GitHub', url: 'https://github.com/davidvkimball/astro-modular' },
		],
		social: [
			{ title: 'X', url: 'https://x.com/davidvkimball', icon: 'x-twitter' },
			{ title: 'GitHub', url: 'https://github.com/davidvkimball', icon: 'github' },
		],
	},
	features: {
		commandPalette: true,
		tableOfContents: true,
		readingTime: true,
		linkedMentions: true,
		comments: false,
		graphView: true,
		postNavigation: true,
		scrollToTop: true,
		darkModeToggleButton: 'both',
		showSocialIconsInFooter: true,
		showPostCardCoverImages: 'featured-and-posts',
		postCardAspectRatio: 'og',
		linkedMentionsCompact: false,
	},
	typography: {
		headingFont: 'Inter',
		proseFont: 'Inter',
		monoFont: 'JetBrains Mono',
		fontSource: 'local',
		customFonts: {
			heading: '',
			prose: '',
			mono: '',
		},
	},
	optionalFeatures: {
		profilePicture: {
			enabled: false,
			image: '/profile.jpg',
			alt: 'Profile picture',
			size: 'md',
			url: '',
			placement: 'footer',
			style: 'circle',
		},
		comments: {
			enabled: false,
			provider: 'giscus',
		},
	},
	deployment: {
		platform: 'netlify',
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
		previewColors: ['#0ea5e9', '#0284c7', '#f8fafc'],
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Understated with high contrast',
		previewColors: ['#708794', '#5a6d77', '#fafafa'],
	},
	{
		id: 'atom',
		name: 'Atom',
		description: 'Dark theme with vibrant accents',
		previewColors: ['#61dafb', '#1a92ff', '#282c34'],
	},
	{
		id: 'ayu-light',
		name: 'Ayu Light',
		description: 'Clean light theme',
		previewColors: ['#ffcc66', '#e6913d', '#fefefe'],
	},
	{
		id: 'ayu-mirage',
		name: 'Ayu Mirage',
		description: 'Soft dark theme',
		previewColors: ['#ffcc66', '#e6913d', '#1f2430'],
	},
	{
		id: 'ayu-dark',
		name: 'Ayu Dark',
		description: 'Deep dark theme',
		previewColors: ['#ffcc66', '#e6913d', '#0f1419'],
	},
	{
		id: 'catppuccin',
		name: 'Catppuccin',
		description: 'Pastel color palette',
		previewColors: ['#dcb6af', '#c49a8f', '#1e1e2e'],
	},
	{
		id: 'charcoal',
		name: 'Charcoal',
		description: 'Dark, professional look',
		previewColors: ['#ffffff', '#ff6b6b', '#2d2d2d'],
	},
	{
		id: 'dracula',
		name: 'Dracula',
		description: 'Dark theme with purple accents',
		previewColors: ['#bd93f9', '#8b5cf6', '#282a36'],
	},
	{
		id: 'everforest',
		name: 'Everforest',
		description: 'Soft, warm colors',
		previewColors: ['#a7c080', '#dbbc7f', '#2d353b'],
	},
	{
		id: 'flexoki',
		name: 'Flexoki',
		description: 'Based on Material Design 3',
		previewColors: ['#ff6b6b', '#e6b673', '#100f0f'],
	},
	{
		id: 'gruvbox',
		name: 'Gruvbox',
		description: 'Retro groove color scheme',
		previewColors: ['#fabd2f', '#b16286', '#282828'],
	},
	{
		id: 'macos',
		name: 'macOS',
		description: 'Native macOS appearance',
		previewColors: ['#007aff', '#34c759', '#ffffff'],
	},
	{
		id: 'nord',
		name: 'Nord',
		description: 'Arctic-inspired color palette',
		previewColors: ['#88c0d0', '#a3be8c', '#2e3440'],
	},
	{
		id: 'obsidian',
		name: 'Obsidian',
		description: 'Matches Obsidian\'s default theme',
		previewColors: ['#7c3aed', '#ffffff', '#1e1e1e'],
	},
	{
		id: 'rose-pine',
		name: 'Rosé Pine',
		description: 'All natural pine, faux fir, and winter',
		previewColors: ['#eb6f92', '#9ccfd8', '#191724'],
	},
	{
		id: 'sky',
		name: 'Sky',
		description: 'Light, airy design',
		previewColors: ['#0ea5e9', '#06b6d4', '#f0f9ff'],
	},
	{
		id: 'solarized',
		name: 'Solarized',
		description: 'Precision colors for machines and people',
		previewColors: ['#268bd2', '#859900', '#002b36'],
	},
	{
		id: 'things',
		name: 'Things',
		description: 'Clean, minimal design',
		previewColors: ['#007aff', '#000000', '#ffffff'],
	},
];

export const TEMPLATE_OPTIONS: TemplateOption[] = [
	{
		id: 'standard',
		name: 'Standard',
		description: 'Full-featured blog with all default options enabled',
		features: ['Command palette', 'Table of contents', 'Reading time', 'Linked mentions', 'Footer', 'Social icons', 'Scroll to top', 'Dark mode toggle'],
		recommended: true,
	},
	{
		id: 'compact',
		name: 'Compact',
		description: 'Balanced setup for smaller sites with optimized layout',
		features: ['Command palette', 'Table of contents', 'Reading time', 'Compact linked mentions', 'Custom aspect ratio'],
		recommended: false,
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Clean, simple blog with minimal features and content',
		features: ['Command palette', 'Search posts/pages', 'Minimal navigation'],
		recommended: false,
	},
	{
		id: 'custom',
		name: 'Custom',
		description: 'Granular control over every setting - opens config.ts',
		features: ['All features configurable'],
		recommended: false,
	},
];
