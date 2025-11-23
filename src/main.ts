import { Plugin, Notice, setIcon } from 'obsidian';
import { AstroModularSettings, DEFAULT_SETTINGS } from './settings';
import { registerCommands } from './commands';
import { AstroModularSettingsTab } from './ui/SettingsTab';
import { SetupWizardModal } from './ui/SetupWizardModal';
import { ConfigManager } from './utils/ConfigManager';
import { PluginManager } from './utils/PluginManager';
import { ObsidianApp } from './types';

export default class AstroModularSettingsPlugin extends Plugin {
	settings!: AstroModularSettings;
	private settingsTab!: AstroModularSettingsTab;
	private startupTimeoutId?: number;
	configManager!: ConfigManager;
	pluginManager!: PluginManager;
	private ribbonIcon?: HTMLElement;
	private ribbonContextMenuStyleEl?: HTMLStyleElement;
	private ribbonContextMenuObserver?: MutationObserver;

	async onload() {
		await this.loadSettings();

		// Initialize managers
		this.configManager = new ConfigManager(this.app);
		this.pluginManager = new PluginManager(this.app, () => this.settings.contentOrganization);

		// Register commands
		registerCommands(this);

		// Add settings tab
		this.settingsTab = new AstroModularSettingsTab(this.app, this);
		this.addSettingTab(this.settingsTab);

		// Add ribbon icon (only if not disabled)
		if (!this.settings.removeRibbonIcon) {
			this.ribbonIcon = this.addRibbonIcon('wand-sparkles', 'Open Astro Modular wizard', async () => {
				// Reload settings from disk to get the latest values
				await this.loadSettings();
				
				const wizard = new SetupWizardModal(this.app, this);
				wizard.open();
			});
			// Add a data attribute to identify our ribbon icon
			if (this.ribbonIcon) {
				this.ribbonIcon.setAttribute('data-astro-modular-settings-ribbon', 'true');
			}
		}

		// Check if we should run the wizard on startup
		if (this.settings.runWizardOnStartup) {
			// Delay the wizard to let Obsidian fully load
			this.startupTimeoutId = window.setTimeout(async () => {
				// Reload settings to check if user disabled the setting
				await this.loadSettings();
				if (this.settings.runWizardOnStartup) {
					const wizard = new SetupWizardModal(this.app, this);
					wizard.open();
				}
			}, 2000);
		}

		// Setup ribbon context menu handling
		this.setupRibbonContextMenuHandling();

		// No welcome notice needed - modal is the intro
	}

	onunload() {
		// Clear startup timeout if it exists
		if (this.startupTimeoutId) {
			window.clearTimeout(this.startupTimeoutId);
			this.startupTimeoutId = undefined;
		}
		
		// Remove ribbon icon if it exists
		if (this.ribbonIcon) {
			this.ribbonIcon.remove();
			this.ribbonIcon = undefined;
		}
		
		// Cleanup ribbon context menu handling
		if (this.ribbonContextMenuObserver) {
			this.ribbonContextMenuObserver.disconnect();
			this.ribbonContextMenuObserver = undefined;
		}
		
		if (this.ribbonContextMenuStyleEl) {
			this.ribbonContextMenuStyleEl.remove();
			this.ribbonContextMenuStyleEl = undefined;
		}
		
		// Other cleanup is handled automatically by Obsidian
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	// Public method to open settings (called by commands)
	openSettings() {
		// This will be handled by the settings tab
		// The settings tab is already registered, so we just need to focus it
		(this.app as unknown as ObsidianApp).setting.open();
		(this.app as unknown as ObsidianApp).setting.openTabById(this.manifest.id);
	}

	// Method to trigger settings refresh
	async triggerSettingsRefresh() {
		// Force the settings tab to re-render with updated settings
		// First reload settings from disk to ensure we have the latest values
		await this.loadSettings();
		
		if (this.settingsTab) {
			// Re-render the settings tab with updated settings
			this.settingsTab.render();
		}
	}

	// Method to update ribbon icon based on settings
	public async updateRibbonIcon() {
		// Ensure we have the latest settings
		await this.loadSettings();

		// Remove existing ribbon icon - try both the stored reference and DOM search
		if (this.ribbonIcon) {
			// Check if the element is still in the DOM before trying to remove it
			if (this.ribbonIcon.parentElement && document.body.contains(this.ribbonIcon)) {
				this.ribbonIcon.remove();
			}
			this.ribbonIcon = undefined;
		}

		// Also search for our ribbon icon in the DOM using the data attribute
		// This handles cases where the reference might be stale
		const ourRibbonIcon = document.querySelector('[data-astro-modular-settings-ribbon="true"]');
		if (ourRibbonIcon) {
			ourRibbonIcon.remove();
		}

		// Fallback: search for wand-sparkles icon in the left sidebar ribbon
		// This is a more aggressive approach to ensure removal
		const leftSidebar = document.querySelector('.sidebar-left');
		if (leftSidebar) {
			const allIcons = leftSidebar.querySelectorAll('.clickable-icon, .sidebar-toggle-button');
			for (const icon of Array.from(allIcons)) {
				const svg = icon.querySelector('svg');
				if (svg) {
					// Check if this is a wand-sparkles icon
					const iconName = svg.getAttribute('data-lucide') || svg.getAttribute('xmlns:lucide');
					if (iconName === 'wand-sparkles' || svg.classList.contains('lucide-wand-sparkles')) {
						// Verify it's in the ribbon area (not in a different part of the sidebar)
						const ribbonArea = icon.closest('.sidebar-left-content, .workspace-ribbon');
						if (ribbonArea) {
							icon.remove();
							break; // Only remove one icon
						}
					}
				}
			}
		}

		// Update context menu handling
		this.updateRibbonContextMenuCSS();
		this.setupRibbonContextMenuObserver();

		// Also remove from any existing context menus
		if (this.settings.removeRibbonIcon) {
			const existingMenus = document.querySelectorAll('.menu');
			for (const menu of Array.from(existingMenus)) {
				this.removeRibbonIconFromContextMenu(menu as HTMLElement);
			}
		}

		// Add ribbon icon if not disabled
		if (!this.settings.removeRibbonIcon) {
			this.ribbonIcon = this.addRibbonIcon('wand-sparkles', 'Open Astro Modular wizard', async () => {
				// Reload settings from disk to get the latest values
				await this.loadSettings();
				
				const wizard = new SetupWizardModal(this.app, this);
				wizard.open();
			});
			// Add a data attribute to identify our ribbon icon
			if (this.ribbonIcon) {
				this.ribbonIcon.setAttribute('data-astro-modular-settings-ribbon', 'true');
			}
		}
	}

	// Ribbon context menu handling
	private setupRibbonContextMenuHandling() {
		this.updateRibbonContextMenuCSS();
		this.setupRibbonContextMenuObserver();
	}

	private updateRibbonContextMenuCSS() {
		// Remove existing style if any
		if (this.ribbonContextMenuStyleEl) {
			this.ribbonContextMenuStyleEl.remove();
		}

		// Only add CSS if ribbon icon is disabled
		if (this.settings.removeRibbonIcon) {
			// Create style element to hide our ribbon icon from context menu
			this.ribbonContextMenuStyleEl = document.createElement('style');
			this.ribbonContextMenuStyleEl.id = 'astro-modular-settings-hide-ribbon-context-menu';
			this.ribbonContextMenuStyleEl.textContent = `
				/* Hide our ribbon icon from context menu when removed */
				.menu-item:has(svg[data-lucide="wand-sparkles"]),
				.menu-item:has(.lucide-wand-sparkles),
				.menu-item .menu-item-icon:has(svg[data-lucide="wand-sparkles"]),
				.menu-item .menu-item-icon:has(.lucide-wand-sparkles) {
					display: none !important;
				}
			`;
			document.head.appendChild(this.ribbonContextMenuStyleEl);
		}
	}

	private setupRibbonContextMenuObserver() {
		// Disconnect existing observer if any
		if (this.ribbonContextMenuObserver) {
			this.ribbonContextMenuObserver.disconnect();
		}

		// Only set up observer if ribbon icon is disabled
		if (!this.settings.removeRibbonIcon) {
			return;
		}

		// Watch for context menu creation and remove our item
		this.ribbonContextMenuObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length > 0) {
					// Check if a menu was added
					for (const node of Array.from(mutation.addedNodes)) {
						if (node instanceof HTMLElement) {
							// Check if it's a menu
							if (node.classList.contains('menu') || node.querySelector('.menu')) {
								this.removeRibbonIconFromContextMenu(node);
							}
						}
					}
				}
			}
		});

		// Observe the document body for menu additions
		this.ribbonContextMenuObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	private removeRibbonIconFromContextMenu(menuElement: HTMLElement) {
		// Find all menu items
		const menuItems = menuElement.querySelectorAll('.menu-item');
		for (const item of Array.from(menuItems)) {
			// Check if this menu item contains our wand-sparkles icon
			const svg = item.querySelector('svg');
			if (svg) {
				const iconName = svg.getAttribute('data-lucide') || 
					svg.getAttribute('xmlns:lucide') ||
					(svg.classList.contains('lucide-wand-sparkles') ? 'wand-sparkles' : null);
				
				if (iconName === 'wand-sparkles') {
					// Also check if the menu item text matches our wizard
					const itemText = item.textContent?.toLowerCase() || '';
					if (itemText.includes('wizard') || itemText.includes('astro modular')) {
						item.remove();
					}
				}
			}
		}
	}
}