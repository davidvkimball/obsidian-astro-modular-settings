import { App, Plugin, PluginSettingTab, ButtonComponent, Setting, Notice, Modal, setIcon } from 'obsidian';
import { TEMPLATE_OPTIONS, THEME_OPTIONS, FONT_OPTIONS, AstroModularPlugin, AstroModularSettings, ObsidianVaultAdapter, PluginConfiguration, ThemeType } from '../types';
import { ThemeColorExtractor } from '../utils/ThemeColorExtractor';

// Buffer is available in Node.js environment
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const Buffer = require('buffer').Buffer;
import { GeneralTab } from './tabs/GeneralTab';
import { SiteInfoTab } from './tabs/SiteInfoTab';
import { NavigationTab } from './tabs/NavigationTab';
import { ConfigTab } from './tabs/ConfigTab';
import { PresetWarningModal } from './PresetWarningModal';
import { StyleTab } from './tabs/StyleTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { TabRenderer } from './common/TabRenderer';

type TabId = 'general' | 'site-info' | 'navigation' | 'config' | 'style' | 'features' | 'advanced';

interface TabDefinition {
	id: TabId;
	name: string;
	renderer: TabRenderer;
}

export class AstroModularSettingsTab extends PluginSettingTab {
	plugin: Plugin;
	public icon = 'lucide-settings-2';
	public id = 'astro-modular-settings';

	private tabContentMap: Map<TabId, HTMLElement> = new Map();
	private tabButtons: Map<TabId, ButtonComponent> = new Map();
	private activeTabId: TabId | null = null;
	private configWriteTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// 1.13.0+: framework calls this and renders each tab as a navigable
	// sub-page, which also surfaces the settings in the built-in settings
	// search. Pre-1.13.0: this is ignored and display() runs the tabbed UI.
	getSettingDefinitions() {
		return [
			{
				type: 'page' as const,
				name: 'General',
				items: [
					{
						type: 'group' as const,
						heading: 'Current configuration',
						items: [
							{
								// Read-only configuration summary. Carries a name so the
								// search indexer never reads an undefined name; the name
								// element is hidden in the render to keep the block clean.
								name: 'Current configuration',
								render: (setting: Setting) => {
									const s = (this.plugin as AstroModularPlugin).settings;
									const nameEl = setting.settingEl.querySelector('.setting-item-name');
									const descEl = setting.settingEl.querySelector('.setting-item-description');
									const controlEl = setting.settingEl.querySelector('.setting-item-control');
									if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
									if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
									if (controlEl) (controlEl as HTMLElement).setCssStyles({ display: 'none' });
									setting.settingEl.setCssStyles({ display: 'block' });
									const configItems = setting.settingEl.createDiv('config-items');
									configItems.setCssStyles({ width: '100%', marginBottom: '0' });
									const row = (label: string, value: string) => {
										const item = configItems.createDiv('config-item');
										item.createEl('strong', { text: label });
										item.createSpan({ text: value });
									};
									const deployNames: Record<string, string> = { netlify: 'Netlify', vercel: 'Vercel', 'github-pages': 'GitHub Pages', 'cloudflare-workers': 'Cloudflare Workers' };
									row('Template: ', TEMPLATE_OPTIONS.find(t => t.id === s.currentTemplate)?.name || 'Unknown');
									row('Theme: ', THEME_OPTIONS.find(t => t.id === s.currentTheme)?.name || 'Unknown');
									row('Organization: ', s.contentOrganization === 'file-based' ? 'File-based' : 'Folder-based');
									row('Deployment: ', deployNames[s.deployment.platform] ?? s.deployment.platform);
									row('Site title: ', s.siteInfo.title);
									// URL is an acronym, keep uppercase
									row('Site URL: ', s.siteInfo.site);
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Wizard',
						items: [
							{
								name: 'Setup wizard',
								desc: 'Run the setup wizard to reconfigure your theme',
								render: (setting: Setting) => {
									setting.addButton(button => button
										.setButtonText('Run setup wizard')
										.setCta()
										.onClick(async () => {
											const plugin = this.plugin as AstroModularPlugin;
											const data = await this.plugin.loadData() as Partial<AstroModularSettings> | null;
											if (data) Object.assign(plugin.settings, data);
											const { SetupWizardModal } = await import('./SetupWizardModal');
											new SetupWizardModal(this.app, plugin).open();
										}));
								},
							},
							{
								name: 'Run wizard on startup',
								desc: 'Show the setup wizard when Obsidian starts (if not disabled)',
								control: { type: 'toggle' as const, key: 'runWizardOnStartup' },
							},
							{
								name: 'Remove ribbon icon',
								desc: 'Remove the wizard icon from the left ribbon',
								control: { type: 'toggle' as const, key: 'removeRibbonIcon', defaultValue: false },
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Site Info',
				items: [
					{
						type: 'group' as const,
						heading: 'Site information',
						items: [
							{
								name: 'Site URL',
								desc: 'Your site\'s base URL (like https://yoursite.com)',
								control: { type: 'text' as const, key: 'siteInfo.site' },
							},
							{
								name: 'Site title',
								desc: 'Your site\'s title',
								control: { type: 'text' as const, key: 'siteInfo.title' },
							},
							{
								name: 'Homepage title',
								desc: 'Custom meta title for the homepage only. If empty, uses the site title.',
								control: { type: 'text' as const, key: 'siteInfo.homepageTitle' },
							},
							{
								name: 'Site description',
								desc: 'A brief description of your site',
								control: { type: 'text' as const, key: 'siteInfo.description' },
							},
							{
								name: 'Author name',
								desc: 'Your name or the site author\'s name',
								control: { type: 'text' as const, key: 'siteInfo.author' },
							},
							{
								name: 'Language code',
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Your site\'s primary language (ISO 639-1 code)',
								control: { type: 'text' as const, key: 'siteInfo.language' },
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Assets & metadata',
						items: [
							{
								// Floating folder affordance that opens the public folder.
								// Custom DOM, so it is a named render and not indexed.
								name: 'Open public folder',
								render: (setting: Setting) => {
									const nameEl = setting.settingEl.querySelector('.setting-item-name');
									const descEl = setting.settingEl.querySelector('.setting-item-description');
									if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
									if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
									// Keep the row borderless (floating affordance) but retain its
									// native vertical padding so it sits on its own line instead of
									// being crammed against the row below.
									setting.settingEl.setCssStyles({ borderTop: 'none' });
									const folderButton = setting.controlEl.createEl('button', {
										cls: 'clickable-icon',
										attr: { 'aria-label': 'Open public folder' },
									});
									setIcon(folderButton, 'folder');
									folderButton.addEventListener('click', () => {
										const publicPath = '../../public';
										// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
										void ((this.app as any).openWithDefaultApp?.(publicPath) ?? Promise.resolve()).catch((error: unknown) => {
											new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
										});
									});
								},
							},
							{
								// File-picker affordance: custom DOM, not a bindable setting.
								name: 'Open graph image',
								// False positive: "PNG" is an acronym and should be uppercase
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Select a PNG image to replace open-graph.png in the public folder (recommended: 1200 x 630 pixels)',
								render: (setting: Setting) => {
									const button = setting.controlEl.createEl('button', { text: 'Select PNG file', cls: 'mod-cta' });
									button.addEventListener('click', () => {
										void this.showSiteInfoFilePicker('open-graph.png');
									});
								},
							},
							{
								// Custom render: writes to two keys (siteInfo + seo) and shows a
								// notice, so a single bindable control cannot reproduce it.
								// False positive: "Open Graph" is a proper noun (OG format standard)
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								name: 'Open Graph image alt text',
								// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Alternative text for the Open Graph image',
								render: (setting: Setting) => {
									const plugin = this.plugin as AstroModularPlugin;
									setting.addText(text => {
										text.setValue(plugin.settings.siteInfo.defaultOgImageAlt || plugin.settings.seo?.defaultOgImageAlt || 'Astro Modular logo.');
										let timeoutId: number | null = null;
										const apply = () => {
											try {
												if (plugin.configManager.updateIndividualFeatures(plugin.settings)) {
													void plugin.configManager.triggerRebuild().then(() => {
														// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
														// eslint-disable-next-line obsidianmd/ui/sentence-case
														new Notice('Open Graph image alt text updated and applied to config.ts');
													});
												}
											} catch {
												// Config write is best-effort; failures must not break settings.
											}
										};
										text.onChange(value => {
											if (timeoutId) clearTimeout(timeoutId);
											plugin.settings.siteInfo.defaultOgImageAlt = value;
											if (!plugin.settings.seo) plugin.settings.seo = { defaultOgImageAlt: '' };
											plugin.settings.seo.defaultOgImageAlt = value;
											void plugin.saveData(plugin.settings);
											timeoutId = window.setTimeout(apply, 1000);
										});
										text.inputEl.addEventListener('blur', () => {
											if (timeoutId) {
												clearTimeout(timeoutId);
												apply();
											}
										});
									});
								},
							},
							{
								// File-picker affordance: custom DOM, not a bindable setting.
								name: 'Favicon',
								// False positive: "PNG" is an acronym and should be uppercase
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Select a PNG image to replace favicon.png in the public folder (recommended: 256 x 256 pixels). Standard favicon is used when browser preference cannot be determined.',
								render: (setting: Setting) => {
									const button = setting.controlEl.createEl('button', { text: 'Select PNG file', cls: 'mod-cta' });
									button.addEventListener('click', () => {
										void this.showSiteInfoFilePicker('favicon.png');
									});
								},
							},
							{
								name: 'Theme-adaptive favicon',
								desc: 'If enabled, favicon switches between light and dark variants based on browser theme preference. Standard favicon is used when browser\'s preference cannot be determined.',
								control: { type: 'toggle' as const, key: 'siteInfo.faviconThemeAdaptive', defaultValue: true },
							},
							{
								// File-picker affordance: custom DOM, not a bindable setting.
								name: 'Light theme favicon',
								// False positive: "PNG" is an acronym and should be uppercase
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Select a PNG image to replace favicon-light.png in the public folder (recommended: 256 x 256 pixels)',
								visible: () => ((this.plugin as AstroModularPlugin).settings.siteInfo.faviconThemeAdaptive ?? true),
								render: (setting: Setting) => {
									const button = setting.controlEl.createEl('button', { text: 'Select PNG file', cls: 'mod-cta' });
									button.addEventListener('click', () => {
										void this.showSiteInfoFilePicker('favicon-light.png');
									});
								},
							},
							{
								// File-picker affordance: custom DOM, not a bindable setting.
								name: 'Dark theme favicon',
								// False positive: "PNG" is an acronym and should be uppercase
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Select a PNG image to replace favicon-dark.png in the public folder (recommended: 256 x 256 pixels)',
								visible: () => ((this.plugin as AstroModularPlugin).settings.siteInfo.faviconThemeAdaptive ?? true),
								render: (setting: Setting) => {
									const button = setting.controlEl.createEl('button', { text: 'Select PNG file', cls: 'mod-cta' });
									button.addEventListener('click', () => {
										void this.showSiteInfoFilePicker('favicon-dark.png');
									});
								},
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Navigation',
				items: [
					{
						type: 'group' as const,
						heading: 'Navigation pages',
						items: [
							{
								// Custom UI: drag-reorderable list of pages with title/url
								// fields, nested child pages, add/remove buttons and event
								// delegation. Not reproducible as bindable controls, so it is a
								// named render and is not surfaced in settings search.
								name: 'Navigation pages',
								desc: 'Add or remove pages from your main navigation menu.',
								render: (setting: Setting) => {
									this.renderNavigationCustomSection(setting, 'pages');
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Social links',
						items: [
							{
								// Custom UI: drag-reorderable list of social links with
								// title/url/icon fields, add/remove buttons and event
								// delegation. Named render; not indexed for search.
								name: 'Social links',
								desc: 'Add or remove social media links.',
								render: (setting: Setting) => {
									this.renderNavigationCustomSection(setting, 'social');
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Navigation options',
						items: [
							{
								name: 'Show navigation',
								desc: 'Display navigation menu on your site',
								control: { type: 'toggle' as const, key: 'navigation.showNavigation', defaultValue: true },
							},
							{
								name: 'Navigation style',
								desc: 'Choose between minimal or traditional navigation style',
								control: {
									type: 'dropdown' as const,
									key: 'navigation.style',
									options: { traditional: 'Traditional', minimal: 'Minimal' },
								},
							},
							{
								name: 'Show mobile menu',
								desc: 'Display mobile navigation menu on smaller screens',
								control: { type: 'toggle' as const, key: 'navigation.showMobileMenu', defaultValue: true },
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Config',
				items: [
					{
						// Template selection gates behind a PresetWarningModal that
						// applies a multi-key preset on confirm and reverts on
						// cancel/error, so it is not a plain value bind. Reproduced as a
						// named render reusing ConfigTab's template-apply flow; not
						// surfaced in settings search.
						name: 'Template',
						desc: 'Choose your content template',
						render: (setting: Setting) => {
							const plugin = this.plugin as AstroModularPlugin;
							const configTab = new ConfigTab(this.app, this.plugin);
							setting.addDropdown(dropdown => {
								TEMPLATE_OPTIONS.forEach(template => {
									dropdown.addOption(template.id, template.name);
								});
								dropdown.setValue(plugin.settings.currentTemplate);
								dropdown.onChange(value => {
									const changes = configTab.getTemplateChanges(value);
									const modal = new PresetWarningModal(
										this.app,
										changes,
										() => {
											void (async () => {
												try {
													await configTab.updatePluginSettingsWithTemplate(value);
													await plugin.loadSettings();
													const freshSettings = plugin.settings;
													const presetSuccess = plugin.configManager.applyPreset({
														name: freshSettings.currentTemplate,
														description: '',
														features: freshSettings.features,
														theme: freshSettings.currentTheme,
														contentOrganization: freshSettings.contentOrganization,
														config: freshSettings,
													});
													if (presetSuccess) {
														new Notice(`Template changed to ${value} and applied to config.ts`);
													} else {
														new Notice('Failed to apply template to config.ts');
													}
												} catch (error) {
													new Notice(`Failed to apply template change: ${error instanceof Error ? error.message : String(error)}`);
													dropdown.setValue(plugin.settings.currentTemplate);
												}
											})();
										},
										() => {
											dropdown.setValue(plugin.settings.currentTemplate);
										}
									);
									modal.open();
								});
							});
						},
					},
					{
						name: 'Deployment',
						desc: 'Choose your deployment platform',
						control: {
							type: 'dropdown' as const,
							key: 'deployment.platform',
							options: {
								netlify: 'Netlify',
								vercel: 'Vercel',
								'github-pages': 'GitHub pages',
								// False positive: "Cloudflare Workers" is a proper noun (product name) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								'cloudflare-workers': 'Cloudflare Workers',
							},
						},
					},
					{
						name: 'Content organization',
						desc: 'Choose how to organize your content and assets',
						control: {
							type: 'dropdown' as const,
							key: 'contentOrganization',
							options: { 'file-based': 'File-based', 'folder-based': 'Folder-based' },
						},
					},
					{
						type: 'group' as const,
						heading: 'Plugin configuration',
						items: [
							{
								// Read-only plugin-status cards. Custom DOM that re-renders
								// itself, reproduced by reusing ConfigTab.renderPluginStatus.
								// Named render; not indexed.
								name: 'Plugin configuration status',
								render: (setting: Setting) => {
									const nameEl = setting.settingEl.querySelector('.setting-item-name');
									const descEl = setting.settingEl.querySelector('.setting-item-description');
									const controlEl = setting.settingEl.querySelector('.setting-item-control');
									if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
									if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
									if (controlEl) (controlEl as HTMLElement).setCssStyles({ display: 'none' });
									setting.settingEl.setCssStyles({ display: 'block' });
									const sectionEl = setting.settingEl.createDiv('settings-section');
									const configTab = new ConfigTab(this.app, this.plugin);
									configTab.renderPluginStatus(sectionEl, (this.plugin as AstroModularPlugin).settings);
								},
							},
						],
					},
					{
						// "Plugin actions" gets its own group heading rather than being
						// nested inside the status render (where it merged visually).
						type: 'group' as const,
						heading: 'Plugin actions',
						items: [
							{
								name: 'Plugin actions',
								render: (setting: Setting) => {
									const nameEl = setting.settingEl.querySelector('.setting-item-name');
									const descEl = setting.settingEl.querySelector('.setting-item-description');
									const controlEl = setting.settingEl.querySelector('.setting-item-control');
									if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
									if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
									if (controlEl) (controlEl as HTMLElement).setCssStyles({ display: 'none' });
									setting.settingEl.setCssStyles({ display: 'block' });
									const sectionEl = setting.settingEl.createDiv('settings-section');
									const configTab = new ConfigTab(this.app, this.plugin);
									configTab.renderPluginActions(sectionEl, (this.plugin as AstroModularPlugin).settings);
								},
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Style',
				items: [
					{
						type: 'group' as const,
						heading: 'Colors',
						items: [
							{
								// Theme dropdown. The imperative tab applied ONLY the theme to
								// config via configManager.updateThemeOnly(value) (a surgical
								// write distinct from updateIndividualFeatures). Kept as a
								// control for searchability; see the override note in the report.
								name: 'Theme',
								desc: 'Choose your color theme',
								control: {
									type: 'dropdown' as const,
									key: 'currentTheme',
									options: Object.fromEntries(THEME_OPTIONS.map(theme => [theme.id, theme.name])),
								},
							},
							{
								// "Customize available themes" toggle whose value is NOT a plain
								// boolean (it transforms availableThemes to an array or 'default')
								// and which reveals a custom pills/custom-themes editor below it.
								// Reproduced verbatim as a self-re-rendering named render, mirroring
								// the Navigation custom sections. Not surfaced in settings search.
								name: 'Customize available themes',
								desc: 'Control which themes are shown to users in the theme selector',
								render: (setting: Setting) => {
									this.renderStyleAvailableThemes(setting);
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Custom theme generation',
						items: [
							{
								// Plain boolean toggle that gates the rest of this group. Driving
								// the visible: predicates below requires it to be a control so the
								// framework auto-refreshes on change. UI-only: the imperative tab
								// only re-rendered (no config write), so it joins uiOnlyKeys.
								name: 'Generate custom theme',
								desc: 'Enable to extract colors from your Obsidian theme and generate custom theme files',
								control: { type: 'toggle' as const, key: 'customThemeGenerationEnabled', defaultValue: false },
							},
							{
								name: 'Custom theme file name',
								desc: 'Filename for the generated theme file (without .ts extension)',
								visible: () => Boolean((this.plugin as AstroModularPlugin).settings.customThemeGenerationEnabled),
								control: { type: 'text' as const, key: 'customThemeFile' },
							},
							{
								// Extract-colors button: custom side effect (reads the active
								// Obsidian theme, mutates themeColors, persists, refreshes). Named
								// render; not searchable.
								name: 'Extract from Obsidian theme',
								desc: 'Extract colors from your currently active Obsidian theme',
								visible: () => Boolean((this.plugin as AstroModularPlugin).settings.customThemeGenerationEnabled),
								render: (setting: Setting) => {
									this.renderStyleExtractButton(setting);
								},
							},
							{
								// Read-only "last extracted" timestamp. Custom DOM; named render.
								name: 'Last extracted timestamp',
								visible: () => {
									const s = (this.plugin as AstroModularPlugin).settings;
									return Boolean(s.customThemeGenerationEnabled) && Boolean(s.themeColors?.lastExtracted);
								},
								render: (setting: Setting) => {
									this.renderStyleLastExtracted(setting);
								},
							},
							{
								// Color editing mode selector. A control so the framework
								// auto-refreshes and the color editor render below picks
								// simple/advanced. UI-only (imperative tab only re-rendered).
								name: 'Color editing mode',
								desc: 'Choose how to edit your theme colors',
								visible: () => Boolean((this.plugin as AstroModularPlugin).settings.customThemeGenerationEnabled),
								control: {
									type: 'dropdown' as const,
									key: 'themeColors.mode',
									options: {
										simple: 'Simple (accent + background)',
										advanced: 'Advanced (individual shades)',
									},
								},
							},
							{
								// Color swatch preview. Custom DOM; named render.
								name: 'Color preview',
								visible: () => {
									const s = (this.plugin as AstroModularPlugin).settings;
									return Boolean(s.customThemeGenerationEnabled) && Boolean(s.themeColors?.extractedColors);
								},
								render: (setting: Setting) => {
									this.renderStyleColorPreview(setting);
								},
							},
							{
								// Simple/advanced color editor (text + native color pickers per
								// shade). Genuinely custom widgets; named render. Picks the editor
								// based on themeColors.mode, which the dropdown above drives.
								name: 'Color editor',
								visible: () => {
									const s = (this.plugin as AstroModularPlugin).settings;
									return Boolean(s.customThemeGenerationEnabled) && Boolean(s.themeColors?.extractedColors);
								},
								render: (setting: Setting) => {
									this.renderStyleColorEditor(setting);
								},
							},
							{
								// Save-to-file button: writes a generated theme file and applies
								// it to config. Custom side effect; named render.
								name: 'Save to custom theme file',
								desc: 'Generate a custom theme file from your extracted colors',
								visible: () => Boolean((this.plugin as AstroModularPlugin).settings.customThemeGenerationEnabled),
								render: (setting: Setting) => {
									this.renderStyleSaveThemeButton(setting);
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Typography',
						items: [
							{
								// Heading font. Imperative tab applied ONLY this font via
								// configManager.updateFontOnly('heading', value). Kept as a control
								// for searchability; see the override note in the report.
								name: 'Heading font',
								desc: 'Font for headings and titles',
								control: {
									type: 'dropdown' as const,
									key: 'typography.headingFont',
									options: Object.fromEntries(FONT_OPTIONS.map(font => [font, font])),
								},
							},
							{
								// Prose font. Imperative tab applied ONLY this font via
								// configManager.updateFontOnly('prose', value).
								name: 'Prose font',
								desc: 'Font for body text and content',
								control: {
									type: 'dropdown' as const,
									key: 'typography.proseFont',
									options: Object.fromEntries(FONT_OPTIONS.map(font => [font, font])),
								},
							},
							{
								// Monospace font. Imperative tab applied ONLY this font via
								// configManager.updateFontOnly('mono', value).
								name: 'Monospace font',
								desc: 'Font for code blocks and technical content',
								control: {
									type: 'dropdown' as const,
									key: 'typography.monoFont',
									options: Object.fromEntries(FONT_OPTIONS.map(font => [font, font])),
								},
							},
							{
								// Font source. Standard config write; drives the visible:
								// predicates of the custom font fields below.
								name: 'Font source',
								desc: 'How fonts are loaded',
								control: {
									type: 'dropdown' as const,
									key: 'typography.fontSource',
									options: {
										// False positive: "Google Fonts" is a proper noun (product name) and should be capitalized
										// eslint-disable-next-line obsidianmd/ui/sentence-case
										local: 'Local (Google Fonts)',
										// False positive: "CDN" is an acronym and should be capitalized
										// eslint-disable-next-line obsidianmd/ui/sentence-case
										cdn: 'CDN (Custom)',
									},
								},
							},
							{
								name: 'Font display',
								desc: 'Font display strategy',
								control: {
									type: 'dropdown' as const,
									key: 'typography.fontDisplay',
									options: {
										swap: 'Swap (recommended)',
										fallback: 'Fallback',
										optional: 'Optional',
									},
								},
							},
							{
								name: 'Content width',
								desc: 'Maximum width for content (like 45rem)',
								control: { type: 'text' as const, key: 'layout.contentWidth' },
							},
							{
								// False positive: "URLs" is an acronym and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								name: 'Custom font URLs',
								// False positive: "Google Fonts" is a proper noun (product name) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Comma-separated URLs for custom fonts (like a Google Fonts URL)',
								visible: () => (this.plugin as AstroModularPlugin).settings.typography.fontSource === 'cdn',
								control: { type: 'text' as const, key: 'typography.customFonts.urls' },
							},
							{
								name: 'Custom heading font name',
								desc: 'Font family name for headings',
								visible: () => (this.plugin as AstroModularPlugin).settings.typography.fontSource === 'cdn',
								control: { type: 'text' as const, key: 'typography.customFonts.heading' },
							},
							{
								name: 'Custom body font name',
								desc: 'Font family name for body text',
								visible: () => (this.plugin as AstroModularPlugin).settings.typography.fontSource === 'cdn',
								control: { type: 'text' as const, key: 'typography.customFonts.prose' },
							},
							{
								name: 'Custom monospace font name',
								desc: 'Font family name for code',
								visible: () => (this.plugin as AstroModularPlugin).settings.typography.fontSource === 'cdn',
								control: { type: 'text' as const, key: 'typography.customFonts.mono' },
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Features',
				items: [
					{
						type: 'group' as const,
						heading: 'Global options',
						items: [
							{
								name: 'Enable projects',
								desc: 'Enable projects as a unique content type for showcasing work and portfolios',
								control: { type: 'toggle' as const, key: 'optionalContentTypes.projects', defaultValue: true },
							},
							{
								name: 'Enable docs',
								desc: 'Enable docs as a unique content type for documentation and knowledge base',
								control: { type: 'toggle' as const, key: 'optionalContentTypes.docs', defaultValue: true },
							},
							{
								name: 'Table of contents',
								desc: 'Show table of contents on content pages',
								control: { type: 'toggle' as const, key: 'tableOfContents.enabled', defaultValue: true },
							},
							{
								name: 'Table of contents depth',
								// False positive: "ToC" is an acronym and should remain capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Maximum heading depth to include in ToC (2=H2, 3=H3, 4=H4, 5=H5, 6=H6)',
								visible: () => ((this.plugin as AstroModularPlugin).settings.tableOfContents?.enabled ?? true),
								control: { type: 'number' as const, key: 'tableOfContents.depth', min: 2, max: 6 },
							},
							{
								name: 'Footer',
								desc: 'Enable footer on your site',
								control: { type: 'toggle' as const, key: 'footer.enabled', defaultValue: true },
							},
							{
								// Multi-line footer content textarea with debounced config write.
								// Custom DOM (full-width textarea), so it is a named render and
								// not indexed for search.
								name: 'Footer content',
								desc: 'Text to display in footer. Use {author} for site author and {title} for site title',
								visible: () => ((this.plugin as AstroModularPlugin).settings.footer?.enabled ?? true),
								render: (setting: Setting) => {
									this.renderFeaturesFooterContent(setting);
								},
							},
							{
								name: 'Show social icons in footer',
								desc: 'Display social media icons in the footer',
								visible: () => ((this.plugin as AstroModularPlugin).settings.footer?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'footer.showSocialIconsInFooter', defaultValue: true },
							},
							{
								name: 'Hide scroll bar',
								desc: 'Hide the browser scroll bar for a cleaner look',
								control: { type: 'toggle' as const, key: 'features.hideScrollBar', defaultValue: false },
							},
							{
								name: 'Scroll to top',
								desc: 'Show scroll to top button',
								control: { type: 'toggle' as const, key: 'features.scrollToTop', defaultValue: true },
							},
							{
								name: 'Feature button',
								desc: 'Choose which feature button appears in the header',
								control: {
									type: 'dropdown' as const,
									key: 'features.featureButton',
									options: {
										mode: 'Dark/light mode toggle',
										graph: 'View graph',
										theme: 'Change theme',
										none: 'None',
									},
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Command palette',
						items: [
							{
								name: 'Enable command palette',
								desc: 'Add a command palette to your site',
								control: { type: 'toggle' as const, key: 'commandPalette.enabled', defaultValue: true },
							},
							{
								name: 'Shortcut',
								// False positive: "Ctrl"/"Cmd" are proper key names
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Keyboard shortcut to open command palette (Ctrl = Cmd on Mac)',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'text' as const, key: 'commandPalette.shortcut' },
							},
							{
								name: 'Placeholder',
								desc: 'Placeholder text in command palette search box',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'text' as const, key: 'commandPalette.placeholder' },
							},
							{
								name: 'Search posts',
								desc: 'Include posts in search results',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.search.posts', defaultValue: true },
							},
							{
								name: 'Search pages',
								desc: 'Include pages in search results',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.search.pages', defaultValue: false },
							},
							{
								name: 'Search projects',
								desc: 'Include projects in search results',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.search.projects', defaultValue: false },
							},
							{
								name: 'Search docs',
								desc: 'Include docs in search results',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.search.docs', defaultValue: false },
							},
							{
								name: 'Show quick actions section',
								desc: 'Display quick actions in command palette',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.sections.quickActions', defaultValue: true },
							},
							{
								name: 'Toggle dark/light mode',
								desc: 'Show mode toggle button in command palette',
								visible: () => {
									const cp = (this.plugin as AstroModularPlugin).settings.commandPalette;
									return (cp?.enabled ?? true) && (cp?.sections?.quickActions ?? true);
								},
								control: { type: 'toggle' as const, key: 'commandPalette.quickActions.toggleMode', defaultValue: true },
							},
							{
								name: 'View graph',
								desc: 'Show graph view button in command palette',
								visible: () => {
									const cp = (this.plugin as AstroModularPlugin).settings.commandPalette;
									return (cp?.enabled ?? true) && (cp?.sections?.quickActions ?? true);
								},
								control: { type: 'toggle' as const, key: 'commandPalette.quickActions.graphView', defaultValue: true },
							},
							{
								name: 'Change theme',
								desc: 'Show theme selector button in command palette',
								visible: () => {
									const cp = (this.plugin as AstroModularPlugin).settings.commandPalette;
									return (cp?.enabled ?? true) && (cp?.sections?.quickActions ?? true);
								},
								control: { type: 'toggle' as const, key: 'commandPalette.quickActions.changeTheme', defaultValue: true },
							},
							{
								name: 'Show pages section',
								desc: 'Display navigation pages in command palette',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.sections.pages', defaultValue: true },
							},
							{
								name: 'Show social section',
								desc: 'Display social links in command palette',
								visible: () => ((this.plugin as AstroModularPlugin).settings.commandPalette?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'commandPalette.sections.social', defaultValue: true },
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Home options',
						items: [
							{
								name: 'Featured post',
								desc: 'Show featured post on homepage',
								control: { type: 'toggle' as const, key: 'homeOptions.featuredPost.enabled', defaultValue: true },
							},
							{
								name: 'Featured post type',
								desc: 'Show latest post or a specific featured post',
								visible: () => ((this.plugin as AstroModularPlugin).settings.homeOptions?.featuredPost?.enabled ?? true),
								control: {
									type: 'dropdown' as const,
									key: 'homeOptions.featuredPost.type',
									options: { latest: 'Latest', featured: 'Featured' },
								},
							},
							{
								name: 'Featured post slug',
								desc: 'Slug of the post to feature (like "getting-started" for /posts/getting-started)',
								visible: () => {
									const fp = (this.plugin as AstroModularPlugin).settings.homeOptions?.featuredPost;
									return (fp?.enabled ?? true) && fp?.type === 'featured';
								},
								control: { type: 'text' as const, key: 'homeOptions.featuredPost.slug' },
							},
							{
								name: 'Recent posts',
								desc: 'Show recent posts on homepage',
								control: { type: 'toggle' as const, key: 'homeOptions.recentPosts.enabled', defaultValue: true },
							},
							{
								name: 'Recent posts count',
								desc: 'Number of recent posts to show',
								visible: () => ((this.plugin as AstroModularPlugin).settings.homeOptions?.recentPosts?.enabled ?? true),
								control: { type: 'number' as const, key: 'homeOptions.recentPosts.count' },
							},
							{
								name: 'Projects on homepage',
								desc: 'Show featured projects on homepage',
								control: { type: 'toggle' as const, key: 'homeOptions.projects.enabled', defaultValue: true },
							},
							{
								name: 'Projects count',
								desc: 'Number of projects to show',
								visible: () => ((this.plugin as AstroModularPlugin).settings.homeOptions?.projects?.enabled ?? true),
								control: { type: 'number' as const, key: 'homeOptions.projects.count' },
							},
							{
								name: 'Docs on homepage',
								desc: 'Show featured docs on homepage',
								control: { type: 'toggle' as const, key: 'homeOptions.docs.enabled', defaultValue: true },
							},
							{
								name: 'Docs count',
								desc: 'Number of docs to show',
								visible: () => ((this.plugin as AstroModularPlugin).settings.homeOptions?.docs?.enabled ?? true),
								control: { type: 'number' as const, key: 'homeOptions.docs.count' },
							},
							{
								name: 'Blurb placement',
								desc: 'Where to place the blurb text on homepage',
								control: {
									type: 'dropdown' as const,
									key: 'homeOptions.blurb.placement',
									options: { above: 'Above', below: 'Below', none: 'None' },
								},
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Post options',
						items: [
							{
								name: 'Posts per page',
								desc: 'Number of posts to show per page',
								control: { type: 'number' as const, key: 'postOptions.postsPerPage' },
							},
							{
								// Config reads features.readingTime as source of truth; the
								// override mirrors postOptions.readingTime to features.readingTime.
								name: 'Reading time',
								desc: 'Display estimated reading time on posts',
								control: { type: 'toggle' as const, key: 'postOptions.readingTime', defaultValue: true },
							},
							{
								name: 'Word count',
								desc: 'Display word count on posts',
								control: { type: 'toggle' as const, key: 'postOptions.wordCount', defaultValue: true },
							},
							{
								name: 'Tags',
								desc: 'Show tags on posts',
								control: { type: 'toggle' as const, key: 'postOptions.tags', defaultValue: true },
							},
							{
								// Config reads features.linkedMentions; override mirrors it.
								name: 'Linked mentions',
								desc: 'Show linked mentions and backlinks on posts',
								control: { type: 'toggle' as const, key: 'postOptions.linkedMentions.enabled', defaultValue: true },
							},
							{
								// Config reads features.linkedMentionsCompact; override mirrors it.
								name: 'Compact view',
								desc: 'Use compact view for linked mentions',
								visible: () => ((this.plugin as AstroModularPlugin).settings.postOptions?.linkedMentions?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'postOptions.linkedMentions.linkedMentionsCompact', defaultValue: false },
							},
							{
								// Config reads postOptions.graphView.enabled (source of truth);
								// override mirrors it to features.graphView for UI sync.
								name: 'Graph view',
								desc: 'Show graph view of post connections',
								control: { type: 'toggle' as const, key: 'postOptions.graphView.enabled', defaultValue: true },
							},
							{
								name: 'Show in sidebar',
								desc: 'Display graph view in post sidebar',
								visible: () => ((this.plugin as AstroModularPlugin).settings.postOptions?.graphView?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'postOptions.graphView.showInSidebar', defaultValue: true },
							},
							{
								name: 'Maximum nodes',
								desc: 'Maximum number of nodes to show in graph',
								visible: () => ((this.plugin as AstroModularPlugin).settings.postOptions?.graphView?.enabled ?? true),
								control: { type: 'number' as const, key: 'postOptions.graphView.maxNodes' },
							},
							{
								name: 'Show orphaned posts',
								desc: 'Include posts with no connections in graph view',
								visible: () => ((this.plugin as AstroModularPlugin).settings.postOptions?.graphView?.enabled ?? true),
								control: { type: 'toggle' as const, key: 'postOptions.graphView.showOrphanedPosts', defaultValue: true },
							},
							{
								// Config reads features.postNavigation; override mirrors it.
								name: 'Post navigation',
								desc: 'Show next/previous post navigation',
								control: { type: 'toggle' as const, key: 'postOptions.postNavigation', defaultValue: true },
							},
							{
								name: 'Show post card cover images',
								desc: 'Where to display cover images on post cards',
								control: {
									type: 'dropdown' as const,
									key: 'postOptions.showPostCardCoverImages',
									options: {
										all: 'All',
										featured: 'Featured',
										home: 'Home',
										posts: 'Posts',
										'featured-and-posts': 'Featured and posts',
										none: 'None',
									},
								},
							},
							{
								name: 'Post card aspect ratio',
								desc: 'Aspect ratio for post card cover images',
								control: {
									type: 'dropdown' as const,
									key: 'postOptions.postCardAspectRatio',
									options: {
										'16:9': '16:9',
										'4:3': '4:3',
										'3:2': '3:2',
										// False positive: "Open Graph" is a proper noun (OG format standard)
										// eslint-disable-next-line obsidianmd/ui/sentence-case
										og: 'Open Graph',
										square: 'Square',
										golden: 'Golden',
										custom: 'Custom',
									},
								},
							},
							{
								name: 'Custom aspect ratio',
								desc: 'Custom aspect ratio in format "width/height" (like "2.5/1")',
								visible: () => (this.plugin as AstroModularPlugin).settings.postOptions?.postCardAspectRatio === 'custom',
								control: { type: 'text' as const, key: 'postOptions.customPostCardAspectRatio' },
							},
						],
					},
					{
						type: 'group' as const,
						heading: 'Optional features',
						items: [
							{
								// Profile picture toggle plus a multi-field options grid (image,
								// alt, size, url, placement, style). The grid is custom DOM that
								// also gates on the toggle, so the whole block is reproduced as a
								// self-contained named render reusing FeaturesTab's renderer.
								name: 'Profile picture',
								desc: 'Show profile picture in header or footer',
								render: (setting: Setting) => {
									this.renderFeaturesOptionalSection(setting, 'profilePicture');
								},
							},
							{
								// Post comments toggle plus the Giscus script editor (instructions,
								// textarea, live validation/parsing). Custom DOM and a dynamic
								// parser side effect, so it is a named render reusing FeaturesTab.
								name: 'Post comments',
								// False positive: "Giscus" is a proper noun (product name) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								desc: 'Enable Giscus comment system for posts',
								render: (setting: Setting) => {
									this.renderFeaturesOptionalSection(setting, 'comments');
								},
							},
						],
					},
				],
			},
			{
				type: 'page' as const,
				name: 'Advanced',
				items: [
					{
						// Action button (CTA) that writes all current settings to config.ts.
						// Reproduced as a named render reusing AdvancedTab's builder so the
						// styled CTA button and its side effect are preserved verbatim.
						name: 'Apply all settings',
						desc: 'Write all current settings to your Astro config.ts file',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildApplyAllSetting(setting);
						},
					},
					{
						// Action button that opens config.ts in the default editor.
						name: 'Edit config.ts directly',
						// False positive: Text is already in sentence case; "Astro" is a proper noun
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						desc: 'Open your Astro configuration file in the editor',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildEditConfigSetting(setting);
						},
					},
					{
						// Action button (CTA) that parses config.ts and syncs plugin
						// settings to match, then triggers a settings refresh. Custom
						// multi-key side effect; reproduced via AdvancedTab's builder.
						name: 'Sync from config.ts',
						desc: 'Read current config.ts file and update plugin settings to match',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildSyncFromConfigSetting(setting);
						},
					},
					{
						// Action button (warning) that resets settings to the current
						// template preset while preserving user-specific settings.
						name: 'Reset to template',
						desc: 'Reset all settings to the current template',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildResetToTemplateSetting(setting);
						},
					},
					{
						// Action button (warning) that opens a confirmation modal and
						// resets settings to defaults, preserving site info and navigation.
						name: 'Reset to defaults',
						desc: 'Reset all settings to their default values',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildResetToDefaultsSetting(setting);
						},
					},
					{
						// Action button that exports the current configuration as JSON.
						// False positive: "JSON" is an acronym and should be uppercase
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						name: 'Export configuration',
						// False positive: "JSON" is an acronym and should be uppercase
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						desc: 'Export your current configuration as JSON',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildExportConfigurationSetting(setting);
						},
					},
					{
						// Action button that imports configuration from a JSON file.
						// False positive: "JSON" is an acronym and should be uppercase
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						name: 'Import configuration',
						// False positive: "JSON" is an acronym and should be uppercase
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						desc: 'Import configuration from JSON file',
						render: (setting: Setting) => {
							new AdvancedTab(this.app, this.plugin).buildImportConfigurationSetting(setting);
						},
					},
				],
			},
		];
	}

	// Render one of the Navigation tab's custom list sections (pages or social)
	// inside a declarative render def. The list is genuinely custom UI (drag
	// reorder, multi-field rows, nested children), so it is reproduced verbatim
	// by reusing NavigationTab's section renderers. The setting's own name/desc
	// row is hidden so the group heading and list stand alone, matching the
	// original section layout. onReRender re-renders only the list container.
	private renderNavigationCustomSection(setting: Setting, section: 'pages' | 'social'): void {
		const nameEl = setting.settingEl.querySelector('.setting-item-name');
		const descEl = setting.settingEl.querySelector('.setting-item-description');
		const controlEl = setting.settingEl.querySelector('.setting-item-control');
		if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
		if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
		if (controlEl) (controlEl as HTMLElement).setCssStyles({ display: 'none' });
		setting.settingEl.setCssStyles({ display: 'block' });
		const sectionEl = setting.settingEl.createDiv('settings-section');
		const navTab = new NavigationTab(this.app, this.plugin);
		const renderInto = () => {
			sectionEl.empty();
			if (section === 'pages') {
				navTab.renderPagesSection(sectionEl, renderInto);
			} else {
				navTab.renderSocialSection(sectionEl, renderInto);
			}
		};
		renderInto();
	}

	// Hide a render def's default name/desc/control row so the custom DOM below
	// stands alone, matching the imperative tab's hidden-setting blocks.
	private hideSettingChrome(setting: Setting): void {
		const nameEl = setting.settingEl.querySelector('.setting-item-name');
		const descEl = setting.settingEl.querySelector('.setting-item-description');
		const controlEl = setting.settingEl.querySelector('.setting-item-control');
		if (nameEl) (nameEl as HTMLElement).setCssStyles({ display: 'none' });
		if (descEl) (descEl as HTMLElement).setCssStyles({ display: 'none' });
		if (controlEl) (controlEl as HTMLElement).setCssStyles({ display: 'none' });
		setting.settingEl.setCssStyles({ display: 'block' });
	}

	// "Customize available themes": the toggle's value is not a plain boolean (it
	// transforms availableThemes to an array or 'default') and toggling it reveals
	// the theme-pills / custom-themes editor, so the whole block self-re-renders.
	// Reproduces StyleTab's imperative behaviour verbatim.
	private renderStyleAvailableThemes(setting: Setting): void {
		const plugin = this.plugin as AstroModularPlugin;
		const settings = plugin.settings;
		// Render the toggle on the native declarative row so it lines up with the
		// other rows in this group (name + desc come from the definition). A
		// nested `new Setting()` would render a second .setting-item and look
		// indented, and the plugin's scoped CSS (.astro-modular-settings …) is
		// not present on native sub-page DOM in 1.13+, so styles are set inline.
		setting.addToggle(toggle => {
			const isCustomized = Array.isArray(settings.availableThemes);
			toggle.setValue(isCustomized);
			toggle.onChange(value => {
				void (async () => {
					if (value) {
						settings.availableThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom').map(theme => theme.id) as Array<Exclude<ThemeType, 'custom'>>;
					} else {
						settings.availableThemes = 'default';
					}
					await this.plugin.saveData(settings);
					await plugin.loadSettings();
					renderPills();
					try {
						await new StyleTab(this.app, this.plugin).applyConfiguration();
						new Notice(`Available themes ${value ? 'customized' : 'set to default'} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply available themes change: ${error instanceof Error ? error.message : String(error)}`);
					}
				})();
			});
		});

		// Pills + custom-themes editor live on their own full-width line below the
		// toggle row. The setting-item is a flex row, so allowing it to wrap and
		// giving this block a full-basis pushes it onto the next line.
		setting.settingEl.setCssStyles({ flexWrap: 'wrap' });
		const sectionEl = setting.settingEl.createDiv('settings-section');
		sectionEl.setCssStyles({ flexBasis: '100%', width: '100%' });
		const renderPills = () => {
			sectionEl.empty();
			if (!Array.isArray(settings.availableThemes)) return;

			// Theme pills + custom themes input
			const themePillsContainer = sectionEl.createDiv('theme-pills-container');
			themePillsContainer.setCssStyles({ marginTop: '10px', marginBottom: '32px' });
			const pillsHeader = themePillsContainer.createEl('p', {
				text: 'Available themes (click to toggle selection):',
				cls: 'theme-pills-header',
			});
			pillsHeader.setCssStyles({ fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' });
			const pillsWrapper = themePillsContainer.createDiv('theme-pills-wrapper');
			pillsWrapper.setCssStyles({ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '20px' });

			const allThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom');
			allThemes.forEach(theme => {
				const isSelected = (settings.availableThemes as string[]).includes(theme.id);
				const pill = pillsWrapper.createDiv('theme-pill');
				pill.setCssStyles({
					display: 'inline-flex',
					alignItems: 'center',
					gap: '4px',
					padding: '4px 10px',
					borderRadius: '14px',
					fontSize: '12px',
					cursor: 'pointer',
					transition: 'all 0.15s ease',
					userSelect: 'none',
				});
				if (isSelected) {
					pill.setCssStyles({ backgroundColor: 'var(--interactive-accent)', color: 'var(--text-on-accent)', border: '1px solid var(--interactive-accent)' });
				} else {
					pill.setCssStyles({ backgroundColor: 'var(--background-secondary)', color: 'var(--text-muted)', border: '1px solid var(--background-modifier-border)' });
				}
				pill.createSpan({ text: theme.name });
				const indicator = pill.createSpan({ text: isSelected ? ' ✓' : '' });
				indicator.setCssStyles({ fontSize: '10px', opacity: '0.8' });
				pill.addEventListener('click', () => {
					void (async () => {
						const currentThemes = settings.availableThemes as string[];
						const newThemes = isSelected
							? currentThemes.filter((id: string) => id !== theme.id)
							: [...currentThemes, theme.id];
						settings.availableThemes = newThemes as Array<Exclude<ThemeType, 'custom'>>;
						await this.plugin.saveData(settings);
						await plugin.loadSettings();
						renderPills();
						try {
							await new StyleTab(this.app, this.plugin).applyConfiguration();
							new Notice(`Theme "${theme.name}" ${isSelected ? 'removed from' : 'added to'} available themes`);
						} catch (error) {
							new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
						}
					})();
				});
			});

			const customThemesSection = themePillsContainer.createDiv('custom-themes-section');
			customThemesSection.setCssStyles({ marginTop: '32px', padding: '10px', backgroundColor: 'var(--background-secondary)', borderRadius: '6px', border: '1px solid var(--background-modifier-border)' });
			const customThemesLabel = customThemesSection.createEl('label', { text: 'Custom themes (comma-separated):', cls: 'custom-themes-label' });
			customThemesLabel.setCssStyles({ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' });
			const inputContainer = customThemesSection.createDiv('custom-themes-input-container');
			inputContainer.setCssStyles({ display: 'flex', gap: '6px', alignItems: 'center' });
			const customThemesInput = inputContainer.createEl('input', {
				type: 'text',
				placeholder: 'custom,obsidinite',
				value: settings.customThemes || '',
				attr: { spellcheck: 'false' },
			});
			customThemesInput.setCssStyles({ flex: '1', padding: '6px 8px', border: '1px solid var(--background-modifier-border)', borderRadius: '4px', backgroundColor: 'var(--background-primary)', color: 'var(--text-normal)', fontSize: '12px' });
			const folderButton = inputContainer.createEl('button', { cls: 'clickable-icon', attr: { 'aria-label': 'Open themes folder' } });
			folderButton.setCssStyles({ padding: '4px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' });
			const folderIcon = folderButton.createDiv();
			setIcon(folderIcon, 'folder');
			folderButton.addEventListener('click', () => {
				void (async () => {
					try {
						// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
						const path = require('path') as typeof import('path');
						// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
						const fs = require('fs') as typeof import('fs');
						// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
						const { shell } = require('electron') as { shell: { openPath: (p: string) => Promise<string> } };
						const adapter = this.app.vault.adapter as unknown as { basePath?: string; path?: string };
						const vaultPath = String(adapter.basePath || adapter.path || '');
						const themesDir = path.resolve(vaultPath, '..', '..', 'src', 'themes', 'custom');
						if (!fs.existsSync(themesDir)) {
							fs.mkdirSync(themesDir, { recursive: true });
						}
						await shell.openPath(themesDir);
					} catch (error) {
						new Notice(`Failed to open themes folder: ${error instanceof Error ? error.message : String(error)}`);
					}
				})();
			});
			let timeoutId: number | null = null;
			customThemesInput.addEventListener('input', () => {
				settings.customThemes = customThemesInput.value.trim();
				void this.plugin.saveData(settings).then(() => plugin.loadSettings());
				if (timeoutId) clearTimeout(timeoutId);
				timeoutId = window.setTimeout(() => {
					void new StyleTab(this.app, this.plugin).applyConfiguration().then(() => {
						new Notice('Custom themes updated and applied to config.ts');
					}).catch((error: unknown) => {
						new Notice(`Failed to apply custom themes: ${error instanceof Error ? error.message : String(error)}`);
					});
				}, 1000);
			});
		};
		renderPills();
	}

	// Extract-colors button. Reproduces StyleTab's extraction side effect and
	// refreshes the page so the dependent visible: blocks re-evaluate.
	private renderStyleExtractButton(setting: Setting): void {
		const plugin = this.plugin as AstroModularPlugin;
		const settings = plugin.settings;
		setting.addButton(button => button
			.setButtonText('Extract colors')
			.setCta()
			.onClick(() => {
				void (async () => {
					try {
						const extractedColors = ThemeColorExtractor.extractObsidianThemeColors();
						settings.themeColors.extractedColors = extractedColors;
						settings.themeColors.lastExtracted = new Date().toISOString();
						if (settings.themeColors.simpleColors) {
							if (extractedColors.highlight?.[500]) settings.themeColors.simpleColors.accent = extractedColors.highlight[500];
							if (extractedColors.primary?.[700]) settings.themeColors.simpleColors.background = extractedColors.primary[700];
						}
						await this.plugin.saveData(settings);
						await plugin.loadSettings();
						this.display();
						new Notice('Colors extracted successfully from Obsidian theme!');
					} catch (error) {
						new Notice(`Failed to extract colors: ${error instanceof Error ? error.message : String(error)}`);
					}
				})();
			}));
	}

	// Read-only "last extracted" timestamp block.
	private renderStyleLastExtracted(setting: Setting): void {
		const settings = (this.plugin as AstroModularPlugin).settings;
		this.hideSettingChrome(setting);
		const lastExtracted = new Date(settings.themeColors.lastExtracted!).toLocaleString();
		const timestampEl = setting.settingEl.createEl('p', { text: `Last extracted: ${lastExtracted}`, cls: 'theme-extraction-timestamp' });
		timestampEl.setCssStyles({ color: 'var(--text-muted)' });
	}

	// Color swatch preview, reusing StyleTab's renderer.
	private renderStyleColorPreview(setting: Setting): void {
		const settings = (this.plugin as AstroModularPlugin).settings;
		this.hideSettingChrome(setting);
		if (settings.themeColors.extractedColors) {
			new StyleTab(this.app, this.plugin).renderColorPreview(setting.settingEl, settings.themeColors.extractedColors);
		}
	}

	// Simple or advanced color editor, reusing StyleTab's renderers. The active
	// editor follows themeColors.mode, which the dropdown control drives.
	private renderStyleColorEditor(setting: Setting): void {
		const settings = (this.plugin as AstroModularPlugin).settings;
		this.hideSettingChrome(setting);
		const styleTab = new StyleTab(this.app, this.plugin);
		if (settings.themeColors.mode === 'simple') {
			styleTab.renderSimpleColorEditor(setting.settingEl, settings);
		} else {
			styleTab.renderAdvancedColorEditor(setting.settingEl, settings);
		}
	}

	// Save-to-file button. Writes a generated theme file and applies it to config.
	private renderStyleSaveThemeButton(setting: Setting): void {
		const plugin = this.plugin as AstroModularPlugin;
		const settings = plugin.settings;
		setting.addButton(button => button
			.setButtonText('Save theme file')
			.setCta()
			.onClick(() => {
				void (async () => {
					try {
						if (!settings.themeColors.extractedColors) {
							new Notice('No colors available to save. Please extract colors first.');
							return;
						}
						const themeFileName = settings.customThemeFile || 'custom';
						const themeContent = ThemeColorExtractor.generateThemeFileContent(settings.themeColors.extractedColors, themeFileName);
						const filePath = `../../src/themes/custom/${themeFileName}.ts`;
						await this.app.vault.adapter.write(filePath, themeContent);
						settings.customThemeFile = themeFileName;
						await this.plugin.saveData(settings);
						try {
							const success = plugin.configManager.updateIndividualFeatures(settings);
							if (success) {
								new Notice(`${themeFileName}.ts saved successfully! Use the main theme dropdown to switch to "custom" if you want to use this theme.`);
							} else {
								new Notice('Theme file saved but failed to apply to config.ts');
							}
						} catch (error) {
							new Notice(`Theme file saved but failed to apply: ${error instanceof Error ? error.message : String(error)}`);
						}
					} catch (error) {
						new Notice(`Failed to save theme file: ${error instanceof Error ? error.message : String(error)}`);
					}
				})();
			}));
	}

	// Footer content multi-line textarea with debounced config write. The footer
	// content was a manually created full-width textarea in the imperative tab
	// (not a bindable single-line control), so it is reproduced verbatim here.
	private renderFeaturesFooterContent(setting: Setting): void {
		const plugin = this.plugin as AstroModularPlugin;
		const settings = plugin.settings;
		const defaultContent = '© 2025 {author}. Built with the <a href="https://github.com/davidvkimball/astro-modular" target="_blank">Astro Modular</a> theme.';
		const descEl = setting.settingEl.querySelector('.setting-item-description');
		if (descEl) {
			(descEl as HTMLElement).setCssStyles({ marginBottom: 'var(--size-4-3)' });
		}
		const textarea = setting.controlEl.createEl('textarea', {
			attr: {
				placeholder: '© 2025 {author}. Built with the Astro Modular theme.',
				rows: '3',
			},
		});
		textarea.value = settings.footer?.content || defaultContent;
		textarea.setCssStyles({
			width: '100%',
			minHeight: '80px',
			resize: 'vertical',
			fontFamily: 'var(--font-text)',
			fontSize: 'var(--font-ui-small)',
			padding: 'var(--size-4-2) var(--size-4-3)',
			border: '1px solid var(--background-modifier-border)',
			borderRadius: 'var(--radius-s)',
			background: 'var(--background-primary)',
			color: 'var(--text-normal)',
		});
		setting.controlEl.setCssStyles({ width: '100%', display: 'block' });
		const apply = () => {
			try {
				if (plugin.configManager.updateIndividualFeatures(plugin.settings)) {
					void plugin.configManager.triggerRebuild();
				}
			} catch {
				// Config write is best-effort; failures must not break settings.
			}
		};
		let timeoutId: number | null = null;
		textarea.addEventListener('input', () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (!settings.footer) {
				settings.footer = { enabled: true, content: '', showSocialIconsInFooter: true };
			}
			settings.footer.content = textarea.value;
			void plugin.saveData(settings);
			timeoutId = window.setTimeout(apply, 1000);
		});
		textarea.addEventListener('blur', () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				apply();
			}
		});
	}

	// Reproduce one of the Features tab's optional-feature sections (profile
	// picture or comments). Both are a toggle plus a custom multi-field editor
	// that gates on the toggle, so they are reproduced verbatim by reusing
	// FeaturesTab's section renderers. The render def's own name/desc/control row
	// is hidden so the reused section stands alone, matching the original layout.
	private renderFeaturesOptionalSection(setting: Setting, section: 'profilePicture' | 'comments'): void {
		this.hideSettingChrome(setting);
		const sectionEl = setting.settingEl.createDiv('settings-section');
		const featuresTab = new FeaturesTab(this.app, this.plugin);
		const group = { addSetting: (cb: (s: Setting) => void) => { cb(new Setting(sectionEl)); } };
		const settings = (this.plugin as AstroModularPlugin).settings;
		if (section === 'profilePicture') {
			featuresTab.renderProfilePictureSetting(group, settings);
		} else {
			featuresTab.renderCommentsSetting(group, settings);
		}
	}

	// Read a control's value, resolving dot-path keys for nested settings
	// (e.g. 'siteInfo.title'). Used by the declarative control bindings above.
	getControlValue(key: string): unknown {
		let obj: unknown = (this.plugin as AstroModularPlugin).settings;
		for (const part of key.split('.')) {
			if (obj == null) return undefined;
			obj = (obj as Record<string, unknown>)[part];
		}
		return obj;
	}

	// Write a control change (dot-path aware), persist, and fire the per-key
	// side effects the imperative display() handlers performed.
	async setControlValue(key: string, value: unknown): Promise<void> {
		const plugin = this.plugin as AstroModularPlugin;
		const parts = key.split('.');
		let obj = plugin.settings as unknown as Record<string, unknown>;
		for (let i = 0; i < parts.length - 1; i++) {
			obj = obj[parts[i]] as Record<string, unknown>;
		}
		obj[parts[parts.length - 1]] = value;
		await plugin.saveData(plugin.settings);
		if (key === 'removeRibbonIcon' && plugin.updateRibbonIcon) {
			await plugin.updateRibbonIcon();
		}
		// Deployment platform: the imperative ConfigTab reloaded settings then
		// applied the config. loadSettings() is fired here; the debounced
		// updateIndividualFeatures write below mirrors applyCurrentConfiguration.
		if (key === 'deployment.platform') {
			await plugin.loadSettings();
		}
		// Content organization: the imperative ConfigTab did NOT run the standard
		// config write; instead it reloaded settings and reconfigured the
		// companion plugins (Obsidian attachments, Astro Composer, Image Manager)
		// for the new organization. Reproduce that and skip the default write.
		if (key === 'contentOrganization') {
			await plugin.loadSettings();
			const contentOrg = value as 'file-based' | 'folder-based';
			const config: PluginConfiguration = {
				obsidianSettings: {
					attachmentLocation: contentOrg === 'file-based' ? 'subfolder' : 'same-folder',
					subfolderName: 'attachments',
				},
				astroComposerSettings: {
					creationMode: contentOrg === 'file-based' ? 'file' : 'folder',
					indexFileName: 'index',
				},
				imageManagerSettings: {
					customPropertyLinkFormat: contentOrg === 'file-based'
						? '[[attachments/{image-url}]]'
						: '[[{image-url}]]',
				},
			};
			try {
				await plugin.pluginManager.configurePlugins(config);
				const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
				const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
				new Notice(`Content organization changed to ${value}\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Manager: Format updated`, 8000);
			} catch (error) {
				new Notice(`Failed to configure plugins for content organization: ${error instanceof Error ? error.message : String(error)}`);
			}
			return;
		}
		// Theme and font selections use surgical config updates (matching the
		// imperative StyleTab), not the wholesale updateIndividualFeatures write.
		if (key === 'currentTheme') {
			try {
				plugin.configManager.updateThemeOnly(value as string);
				await plugin.loadSettings();
			} catch {
				// Config write is best-effort; failures must not break settings.
			}
			return;
		}
		const fontKeyMap: Record<string, 'heading' | 'prose' | 'mono'> = {
			'typography.headingFont': 'heading',
			'typography.proseFont': 'prose',
			'typography.monoFont': 'mono',
		};
		const fontType = fontKeyMap[key];
		if (fontType) {
			try {
				plugin.configManager.updateFontOnly(fontType, value as string);
				await plugin.loadSettings();
			} catch {
				// Config write is best-effort; failures must not break settings.
			}
			return;
		}
		// Several Features settings have a primary key plus a features.* mirror that
		// the config generator (modifyConfigFromFeatures) reads as the source of
		// truth. The imperative FeaturesTab kept both in sync inside each onChange
		// handler; declarative control defs only bind the primary key, so the mirror
		// is updated here before the config write to preserve that behaviour.
		const featureMirrors: Record<string, string> = {
			'commandPalette.enabled': 'commandPalette',
			'postOptions.readingTime': 'readingTime',
			'postOptions.linkedMentions.enabled': 'linkedMentions',
			'postOptions.linkedMentions.linkedMentionsCompact': 'linkedMentionsCompact',
			'postOptions.graphView.enabled': 'graphView',
			'postOptions.postNavigation': 'postNavigation',
			'commandPalette.quickActions.toggleMode': 'quickActions.toggleMode',
			'commandPalette.quickActions.graphView': 'quickActions.graphView',
			'commandPalette.quickActions.changeTheme': 'quickActions.changeTheme',
		};
		const mirrorTarget = featureMirrors[key];
		if (mirrorTarget) {
			const featureParts = mirrorTarget.split('.');
			let featureObj = plugin.settings.features as unknown as Record<string, unknown>;
			for (let i = 0; i < featureParts.length - 1; i++) {
				featureObj = featureObj[featureParts[i]] as Record<string, unknown>;
			}
			featureObj[featureParts[featureParts.length - 1]] = value;
			await plugin.saveData(plugin.settings);
		}
		// Settings that map to the Astro config file get a debounced config write,
		// mirroring TabRenderer.debouncedSave. UI-only prefs are skipped so a
		// ribbon or wizard toggle doesn't rewrite config or trigger a rebuild.
		const uiOnlyKeys = new Set(['runWizardOnStartup', 'removeRibbonIcon', 'customThemeGenerationEnabled', 'themeColors.mode']);
		if (!uiOnlyKeys.has(key)) {
			if (this.configWriteTimer) clearTimeout(this.configWriteTimer);
			this.configWriteTimer = setTimeout(() => {
				this.configWriteTimer = null;
				try {
					if (plugin.configManager.updateIndividualFeatures(plugin.settings)) {
						void plugin.configManager.triggerRebuild();
					}
				} catch {
					// Config write is best-effort; failures must not break settings.
				}
			}, 1000);
		}
	}

	// Copy a chosen PNG into the Astro project's public folder, replacing the
	// named asset. Reproduces the imperative SiteInfoTab file-picker behaviour.
	private copySiteInfoImageToPublic(sourcePath: string, targetFileName: string): void {
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const fs = require('fs') as typeof import('fs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
		const path = require('path') as typeof import('path');
		const vaultAdapter = this.app.vault.adapter as unknown as ObsidianVaultAdapter;
		const vaultPath = vaultAdapter.basePath || vaultAdapter.path;
		const vaultPathString = typeof vaultPath === 'string' ? vaultPath : String(vaultPath ?? '');
		const publicFolderPath = path.join(vaultPathString, '..', '..', 'public');
		const targetPath = path.join(publicFolderPath, targetFileName);
		if (!fs.existsSync(publicFolderPath)) {
			fs.mkdirSync(publicFolderPath, { recursive: true });
		}
		fs.copyFileSync(sourcePath, targetPath);
		new Notice(`Successfully copied ${targetFileName} to public folder`);
	}

	private showSiteInfoFilePicker(targetFileName: string): void {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = '.png';
		let selectedFile: File | null = null;
		fileInput.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			if (!file.name.toLowerCase().endsWith('.png')) {
				new Notice('Please select a PNG file');
				return;
			}
			selectedFile = file;
			// Defer so the file picker dialog has closed before the modal opens.
			setTimeout(() => {
				const confirmModal = new Modal(this.app);
				confirmModal.titleEl.setText('Replace image');
				const contentDiv = confirmModal.contentEl.createDiv();
				contentDiv.createEl('p', {
					text: `Are you sure you want to replace ${targetFileName} in the public folder with the new image?`,
				});
				const buttonContainer = contentDiv.createDiv();
				buttonContainer.setCssStyles({ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' });
				const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
				cancelButton.className = 'mod-button';
				cancelButton.addEventListener('click', () => confirmModal.close());
				const confirmButton = buttonContainer.createEl('button', { text: 'Replace' });
				confirmButton.className = 'mod-warning';
				confirmButton.addEventListener('click', () => {
					confirmModal.close();
					if (!selectedFile) {
						new Notice('File selection was lost. Please try again.');
						return;
					}
					void (async () => {
						try {
							const filePath = (selectedFile as unknown as { path?: string }).path;
							if (filePath) {
								this.copySiteInfoImageToPublic(filePath, targetFileName);
							} else {
								// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
								const fs = require('fs') as typeof import('fs');
								// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
								const path = require('path') as typeof import('path');
								const arrayBuffer = await selectedFile.arrayBuffer();
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
								const buffer = Buffer.from(arrayBuffer);
								const vaultAdapter = this.app.vault.adapter as unknown as ObsidianVaultAdapter;
								const vaultPath = vaultAdapter.basePath || vaultAdapter.path;
								const vaultPathString = typeof vaultPath === 'string' ? vaultPath : String(vaultPath ?? '');
								const publicFolderPath = path.join(vaultPathString, '..', '..', 'public');
								const targetPath = path.join(publicFolderPath, targetFileName);
								if (!fs.existsSync(publicFolderPath)) {
									fs.mkdirSync(publicFolderPath, { recursive: true });
								}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								fs.writeFileSync(targetPath, buffer);
								new Notice(`Successfully copied ${targetFileName} to public folder`);
							}
						} catch (err) {
							new Notice(`Failed to copy file: ${err instanceof Error ? err.message : String(err)}`);
						}
					})();
				});
				confirmModal.open();
			}, 100);
		};
		fileInput.click();
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass('astro-modular-settings-tab-root');
		containerEl.addClass('astro-modular-settings');

		this.tabContentMap.clear();
		this.tabButtons.clear();

		const tabs: TabDefinition[] = [
			{ id: 'general', name: 'General', renderer: new GeneralTab(this.app, this.plugin) },
			{ id: 'site-info', name: 'Site Info', renderer: new SiteInfoTab(this.app, this.plugin) },
			{ id: 'navigation', name: 'Navigation', renderer: new NavigationTab(this.app, this.plugin) },
			{ id: 'config', name: 'Config', renderer: new ConfigTab(this.app, this.plugin) },
			{ id: 'style', name: 'Style', renderer: new StyleTab(this.app, this.plugin) },
			{ id: 'features', name: 'Features', renderer: new FeaturesTab(this.app, this.plugin) },
			{ id: 'advanced', name: 'Advanced', renderer: new AdvancedTab(this.app, this.plugin) }
		];

		const tabsWrapper = containerEl.createDiv('astro-modular-settings-tabs');
		const navEl = tabsWrapper.createDiv('astro-modular-settings-tabs-nav');
		navEl.setAttribute('role', 'tablist');
		const contentWrapper = tabsWrapper.createDiv('astro-modular-settings-tabs-content');

		tabs.forEach(tab => {
			const buttonComponent = new ButtonComponent(navEl);
			buttonComponent.setButtonText(tab.name);
			buttonComponent.removeCta();
			buttonComponent.buttonEl.addClass('astro-modular-settings-tab-button');
			buttonComponent.buttonEl.addClass('clickable-icon');
			buttonComponent.buttonEl.setAttribute('role', 'tab');
			buttonComponent.buttonEl.setAttribute('aria-selected', 'false');
			buttonComponent.onClick(() => {
				void this.activateTab(tab.id, tabs, contentWrapper);
			});
			this.tabButtons.set(tab.id, buttonComponent);
		});

		// Activate initial tab
		const initialTabId = this.activeTabId && tabs.some(t => t.id === this.activeTabId)
			? this.activeTabId
			: tabs[0].id;

		void this.activateTab(initialTabId, tabs, contentWrapper);
	}

	private async activateTab(
		id: TabId,
		tabs: TabDefinition[],
		contentWrapper: HTMLElement
	): Promise<void> {
		const definition = tabs.find(tab => tab.id === id);
		if (!definition) return;

		// Lazy load tab content
		if (!this.tabContentMap.has(id)) {
			const tabContainer = contentWrapper.createDiv('astro-modular-settings-tab');
			await definition.renderer.render(tabContainer);
			this.tabContentMap.set(id, tabContainer);
		}

		// Deactivate previous tab
		if (this.activeTabId && this.activeTabId !== id) {
			const prevContent = this.tabContentMap.get(this.activeTabId);
			if (prevContent) prevContent.removeClass('is-active');

			const prevButton = this.tabButtons.get(this.activeTabId);
			if (prevButton) {
				prevButton.buttonEl.removeClass('is-active');
				prevButton.buttonEl.setAttribute('aria-selected', 'false');
				prevButton.removeCta();
			}
		}

		// Activate new tab
		const newContent = this.tabContentMap.get(id);
		if (newContent) newContent.addClass('is-active');

		const newButton = this.tabButtons.get(id);
		if (newButton) {
			newButton.buttonEl.addClass('is-active');
			newButton.buttonEl.setAttribute('aria-selected', 'true');
			newButton.setCta();
		}

		this.activeTabId = id;
		contentWrapper.scrollTop = 0;
	}
}
