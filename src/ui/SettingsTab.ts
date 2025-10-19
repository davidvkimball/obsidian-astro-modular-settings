import { App, Plugin, PluginSettingTab } from 'obsidian';
import { AstroModularSettings } from '../types';
import { ConfigManager } from '../utils/ConfigManager';
import { PluginManager } from '../utils/PluginManager';
import { SetupWizardModal } from './SetupWizardModal';
import { PresetWarningModal } from './PresetWarningModal';
import { GeneralTab } from './tabs/GeneralTab';
import { SiteInfoTab } from './tabs/SiteInfoTab';
import { NavigationTab } from './tabs/NavigationTab';
import { ConfigTab } from './tabs/ConfigTab';
import { StyleTab } from './tabs/StyleTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { PluginsTab } from './tabs/PluginsTab';
import { AdvancedTab } from './tabs/AdvancedTab';

export class AstroModularSettingsTab extends PluginSettingTab {
	plugin: Plugin;
	settings: AstroModularSettings;
	configManager: ConfigManager;
	pluginManager: PluginManager;

	constructor(app: App, plugin: Plugin, settings: AstroModularSettings) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
		this.configManager = new ConfigManager(app);
		this.pluginManager = new PluginManager(app);
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

		// Tab definitions with descriptions
		const tabs = [
			{ 
				id: 'general', 
				name: 'General', 
				description: 'Basic settings and configuration overview',
				renderer: new GeneralTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'site-info', 
				name: 'Site Info', 
				description: 'Site information and metadata',
				renderer: new SiteInfoTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'navigation', 
				name: 'Navigation', 
				description: 'Navigation pages and social links',
				renderer: new NavigationTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'config', 
				name: 'Config', 
				description: 'Template and content organization',
				renderer: new ConfigTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'style', 
				name: 'Style', 
				description: 'Theme and typography settings',
				renderer: new StyleTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'features', 
				name: 'Features', 
				description: 'Enable or disable theme features',
				renderer: new FeaturesTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'plugins', 
				name: 'Plugins', 
				description: 'Configure Obsidian plugins',
				renderer: new PluginsTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			},
			{ 
				id: 'advanced', 
				name: 'Advanced', 
				description: 'Advanced settings and utilities',
				renderer: new AdvancedTab(this.app, this.settings, this.configManager, this.pluginManager, this.plugin)
			}
		];

		// Create tab buttons with clean styling
		tabs.forEach((tab, index) => {
			const button = tabNav.createEl('button', {
				text: tab.name,
				cls: `tab-button ${index === 0 ? 'active' : ''}`
			});
			
			// Add tooltip
			button.title = tab.description;
			
				button.addEventListener('click', () => {
					// Remove active class from all buttons
					tabNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
					// Add active class to clicked button
					button.classList.add('active');
					// Render tab content with animation
					tabContent.style.opacity = '0';
					setTimeout(() => {
						tabContent.empty();
						tab.renderer.render(tabContent);
						tabContent.style.opacity = '1';
					}, 150);
				});
		});

		// Render the first tab by default
		tabs[0].renderer.render(tabContent);
	}
}
