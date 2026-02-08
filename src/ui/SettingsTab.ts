import { App, Plugin, PluginSettingTab, ButtonComponent } from 'obsidian';
import { GeneralTab } from './tabs/GeneralTab';
import { SiteInfoTab } from './tabs/SiteInfoTab';
import { NavigationTab } from './tabs/NavigationTab';
import { ConfigTab } from './tabs/ConfigTab';
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

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass('astro-modular-settings-tab-root');

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
