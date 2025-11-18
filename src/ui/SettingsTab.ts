import { App, Plugin, PluginSettingTab } from 'obsidian';
import { SetupWizardModal } from './SetupWizardModal';
import { PresetWarningModal } from './PresetWarningModal';
import { GeneralTab } from './tabs/GeneralTab';
import { SiteInfoTab } from './tabs/SiteInfoTab';
import { NavigationTab } from './tabs/NavigationTab';
import { ConfigTab } from './tabs/ConfigTab';
import { StyleTab } from './tabs/StyleTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AdvancedTab } from './tabs/AdvancedTab';

export class AstroModularSettingsTab extends PluginSettingTab {
	plugin: Plugin;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.render();
	}

	render(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass('astro-modular-settings');

		// Create enhanced tab navigation
		const tabContainer = containerEl.createDiv('tab-container');
		const tabNav = tabContainer.createDiv('tab-nav');
		const tabContent = tabContainer.createDiv('tab-content');

		// Tab definitions
		const tabs = [
			{ 
				id: 'general', 
				name: 'General', 
				renderer: new GeneralTab(this.app, this.plugin)
			},
			{ 
				id: 'site-info', 
				name: 'Site Info', 
				renderer: new SiteInfoTab(this.app, this.plugin)
			},
			{ 
				id: 'navigation', 
				name: 'Navigation', 
				renderer: new NavigationTab(this.app, this.plugin)
			},
			{ 
				id: 'config', 
				name: 'Config', 
				renderer: new ConfigTab(this.app, this.plugin)
			},
			{ 
				id: 'style', 
				name: 'Style', 
				renderer: new StyleTab(this.app, this.plugin)
			},
			{ 
				id: 'features', 
				name: 'Features', 
				renderer: new FeaturesTab(this.app, this.plugin)
			},
			{ 
				id: 'advanced', 
				name: 'Advanced', 
				renderer: new AdvancedTab(this.app, this.plugin)
			}
		];

		// Create tab buttons with clean styling
		tabs.forEach((tab, index) => {
			const button = tabNav.createEl('button', {
				text: tab.name,
				cls: `tab-button ${index === 0 ? 'active' : ''}`
			});
			
			
			button.addEventListener('click', async () => {
				// Remove active class from all buttons
				tabNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
				// Add active class to clicked button
				button.classList.add('active');
				// Render tab content immediately
				tabContent.empty();
				await tab.renderer.render(tabContent);
			});
		});

		// Render the first tab by default
		const renderResult = tabs[0].renderer.render(tabContent) as void | Promise<void>;
		if (renderResult && typeof (renderResult as any).then === 'function') {
			(renderResult as Promise<void>).catch((err: any) => {
				console.error('Error rendering initial tab:', err);
			});
		}
	}
}
