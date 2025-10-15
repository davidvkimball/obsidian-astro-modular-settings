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
	creationMode: 'file' | 'folder';
	indexFileName: string;
}

export interface ImageInserterSettings {
	valueFormat: string;
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
	backgroundColorLight: string;
	backgroundColorDark: string;
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
			creationMode: 'file',
			indexFileName: 'index',
		},
		imageInserterSettings: {
			valueFormat: '[[attachments/{image-url}]]',
			insertFormat: '[[attachments/{image-url}]]',
		},
	},
};

export const THEME_OPTIONS: ThemeOption[] = [
	{
		id: 'oxygen',
		name: 'Oxygen',
		description: 'Modern, clean design',
		previewColors: ['#075985', '#38bdf8'],
		backgroundColorLight: '#f8fafc',
		backgroundColorDark: '#020617',
	},
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Understated with high contrast',
		previewColors: ['#2d383c', '#87bfcf'],
		backgroundColorLight: '#fafafa',
		backgroundColorDark: '#1a1a1a',
	},
	{
		id: 'atom',
		name: 'Atom',
		description: 'Dark theme with vibrant accents',
		previewColors: ['#075985', '#578af2'],
		backgroundColorLight: '#f8fafc',
		backgroundColorDark: '#181a1f',
	},
	{
		id: 'ayu-light',
		name: 'Ayu Light',
		description: 'Clean light theme',
		previewColors: ['#99521a', '#ff9933'],
		backgroundColorLight: '#f8f8f0',
		backgroundColorDark: '#0f1419',
	},
	{
		id: 'ayu-mirage',
		name: 'Ayu Mirage',
		description: 'Soft dark theme',
		previewColors: ['#99521a', '#ff9933'],
		backgroundColorLight: '#f8f8f0',
		backgroundColorDark: '#0f1419',
	},
	{
		id: 'ayu-dark',
		name: 'Ayu Dark',
		description: 'Deep dark theme',
		previewColors: ['#99521a', '#ff9933'],
		backgroundColorLight: '#f8f8f0',
		backgroundColorDark: '#0f1419',
	},
	{
		id: 'catppuccin',
		name: 'Catppuccin',
		description: 'Pastel color palette',
		previewColors: ['#95624f', '#df7763'],
		backgroundColorLight: '#fef7ed',
		backgroundColorDark: '#181825',
	},
	{
		id: 'charcoal',
		name: 'Charcoal',
		description: 'Dark, professional look',
		previewColors: ['#202020', '#c0c0c0'],
		backgroundColorLight: '#f8f8f8',
		backgroundColorDark: '#000000',
	},
	{
		id: 'dracula',
		name: 'Dracula',
		description: 'Dark theme with purple accents',
		previewColors: ['#7c3aed', '#a78bfa'],
		backgroundColorLight: '#f8f8f2',
		backgroundColorDark: '#191a21',
	},
	{
		id: 'everforest',
		name: 'Everforest',
		description: 'Soft, warm colors',
		previewColors: ['#5a7a5a', '#83c092'],
		backgroundColorLight: '#f7f6f3',
		backgroundColorDark: '#2d353b',
	},
	{
		id: 'flexoki',
		name: 'Flexoki',
		description: 'Based on Material Design 3',
		previewColors: ['#16504a', '#4dbdb5'],
		backgroundColorLight: '#fefefe',
		backgroundColorDark: '#100f0f',
	},
	{
		id: 'gruvbox',
		name: 'Gruvbox',
		description: 'Retro groove color scheme',
		previewColors: ['#7a5412', '#f78b33'],
		backgroundColorLight: '#fbf1c7',
		backgroundColorDark: '#1d2021',
	},
	{
		id: 'macos',
		name: 'macOS',
		description: 'Native macOS appearance',
		previewColors: ['#002e66', '#339fff'],
		backgroundColorLight: '#f5f5f7',
		backgroundColorDark: '#141414',
	},
	{
		id: 'nord',
		name: 'Nord',
		description: 'Arctic-inspired color palette',
		previewColors: ['#2e4c63', '#5e94b8'],
		backgroundColorLight: '#f8fafc',
		backgroundColorDark: '#2e3440',
	},
	{
		id: 'obsidian',
		name: 'Obsidian',
		description: 'Matches Obsidian\'s default theme',
		previewColors: ['#522994', '#9c75ff'],
		backgroundColorLight: '#f8f8f8',
		backgroundColorDark: '#0a0a0a',
	},
	{
		id: 'rose-pine',
		name: 'Rosé Pine',
		description: 'All natural pine, faux fir, and winter',
		previewColors: ['#ab2142', '#ef97a9'],
		backgroundColorLight: '#faf4ed',
		backgroundColorDark: '#191724',
	},
	{
		id: 'sky',
		name: 'Sky',
		description: 'Light, airy design',
		previewColors: ['#136194', '#46aad0'],
		backgroundColorLight: '#f0f9ff',
		backgroundColorDark: '#232729',
	},
	{
		id: 'solarized',
		name: 'Solarized',
		description: 'Precision colors for machines and people',
		previewColors: ['#0e3754', '#339fff'],
		backgroundColorLight: '#fdf6e3',
		backgroundColorDark: '#002b36',
	},
	{
		id: 'things',
		name: 'Things',
		description: 'Clean, minimal design',
		previewColors: ['#1e3a8a', '#4d95f7'],
		backgroundColorLight: '#f8fafc',
		backgroundColorDark: '#17191c',
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
