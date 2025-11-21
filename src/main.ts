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
	private helpButtonObserver?: MutationObserver;
	private helpButtonElement?: HTMLElement;
	private customHelpButton?: HTMLElement;
	private helpButtonStyleEl?: HTMLStyleElement;
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

		// Setup help button replacement
		this.setupHelpButtonReplacement();

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
		
		// Cleanup help button replacement
		if (this.helpButtonObserver) {
			this.helpButtonObserver.disconnect();
			this.helpButtonObserver = undefined;
		}
		
		// Remove CSS style that hides help button
		if (this.helpButtonStyleEl) {
			this.helpButtonStyleEl.remove();
			this.helpButtonStyleEl = undefined;
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
		
		// Restore original help button if we modified it
		this.restoreHelpButton();
		
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

	// Help button replacement methods
	private setupHelpButtonReplacement() {
		// Update CSS and button
		this.updateHelpButtonCSS();
		
		// Wait for the DOM to be ready
		const trySetup = () => {
			if (this.settings.helpButtonReplacement?.enabled) {
				this.updateHelpButton();
			}
		};

		// Try immediately
		trySetup();

		// Also try after a short delay to ensure DOM is ready
		setTimeout(trySetup, 500);

		// Set up observer after initial setup to watch for button recreation
		setTimeout(() => {
			this.setupHelpButtonObserver();
		}, 1000);
	}

	private updateHelpButtonCSS() {
		// Remove existing style if any
		if (this.helpButtonStyleEl) {
			this.helpButtonStyleEl.remove();
		}

		// Only add CSS if replacement is enabled
		if (this.settings.helpButtonReplacement?.enabled) {
			// Create style element to hide help button globally
			// Use unique ID to avoid conflicts with other plugins
			this.helpButtonStyleEl = document.createElement('style');
			this.helpButtonStyleEl.id = 'astro-modular-settings-hide-help-button';
			this.helpButtonStyleEl.textContent = `
				.workspace-drawer-vault-actions .clickable-icon:has(svg.help) {
					display: none !important;
				}
			`;
			document.head.appendChild(this.helpButtonStyleEl);
		}
	}

	public async updateHelpButton() {
		// Temporarily disconnect observer to prevent infinite loops
		if (this.helpButtonObserver) {
			this.helpButtonObserver.disconnect();
		}

		// Ensure we have the latest settings
		await this.loadSettings();

		// Update CSS first (this will hide the help button globally)
		this.updateHelpButtonCSS();

		try {
			// Check if replacement is enabled
			if (!this.settings.helpButtonReplacement?.enabled) {
				this.restoreHelpButton();
				return;
			}

			// Find the help button
			const vaultActions = document.querySelector('.workspace-drawer-vault-actions');
			if (!vaultActions) {
				return;
			}

			// Find the help button - it's the first clickable-icon that contains an SVG with class "help"
			const clickableIcons = Array.from(vaultActions.querySelectorAll('.clickable-icon'));
			let helpButton: HTMLElement | null = null;
			
			for (const icon of clickableIcons) {
				const svg = icon.querySelector('svg.help');
				if (svg) {
					helpButton = icon as HTMLElement;
					break;
				}
			}
			
			if (!helpButton) {
				return;
			}

			// Store reference to the button
			this.helpButtonElement = helpButton;

			// Remove existing custom button if it exists (always recreate to update icon/command)
			// Check if it's actually in the DOM and has our identifier before trying to remove it
			if (this.customHelpButton && 
				this.customHelpButton.parentElement && 
				document.body.contains(this.customHelpButton) &&
				this.customHelpButton.hasAttribute('data-astro-modular-settings-help-replacement')) {
				this.customHelpButton.remove();
			}
			this.customHelpButton = undefined;

			// Create a new custom button
			const customButton = helpButton.cloneNode(true) as HTMLElement;
			customButton.style.display = '';
			customButton.removeAttribute('aria-label'); // Remove any existing aria-label
			
			// Add unique identifier to avoid conflicts with other plugins
			customButton.setAttribute('data-astro-modular-settings-help-replacement', 'true');
			customButton.classList.add('astro-modular-settings-help-replacement');
			
			// Clear any existing click handlers
			customButton.onclick = null;
			
			// Replace the icon using Obsidian's setIcon function
			const iconContainer = customButton.querySelector('svg')?.parentElement || customButton;
			try {
				setIcon(iconContainer as HTMLElement, this.settings.helpButtonReplacement.iconId);
			} catch (error) {
				console.warn('[Astro Modular Settings] Error setting icon:', error);
			}

			// Add our custom click handler
			customButton.addEventListener('click', async (evt: MouseEvent) => {
				evt.preventDefault();
				evt.stopPropagation();
				
				const commandId = this.settings.helpButtonReplacement?.commandId;
				if (commandId) {
					try {
						await (this.app as any).commands.executeCommandById(commandId);
					} catch (error) {
						console.warn('[Astro Modular Settings] Error executing command:', error);
						new Notice(`Failed to execute command: ${commandId}`);
					}
				}
			}, true); // Use capture phase to ensure we handle it first

			// Insert the custom button right after the original (hidden) button
			helpButton.parentElement?.insertBefore(customButton, helpButton.nextSibling);
			
			// Store reference to custom button
			this.customHelpButton = customButton;
		} finally {
			// Reconnect observer after a delay
			setTimeout(() => {
				if (this.settings.helpButtonReplacement?.enabled) {
					this.setupHelpButtonObserver();
				}
			}, 1000);
		}
	}

	private setupHelpButtonObserver() {
		// Disconnect existing observer if any
		if (this.helpButtonObserver) {
			this.helpButtonObserver.disconnect();
		}

		// Only set up observer if replacement is enabled
		if (!this.settings.helpButtonReplacement?.enabled) {
			return;
		}

		// Watch for changes to the vault profile area only (more targeted)
		let updateTimeout: number | null = null;
		this.helpButtonObserver = new MutationObserver(() => {
			// Debounce updates to prevent infinite loops
			if (updateTimeout) {
				clearTimeout(updateTimeout);
			}
			updateTimeout = window.setTimeout(() => {
				// Check if help button was recreated (CSS will hide it, but we need to inject our custom button)
				const vaultActions = document.querySelector('.workspace-drawer-vault-actions');
				if (!vaultActions) return;
				
			// Check if we have a custom button AND it's still in the DOM
			// The reference might exist but the button could have been removed
			// Also verify it has our unique identifier to avoid conflicts with other plugins
			const customButtonExists = this.customHelpButton && 
				this.customHelpButton.parentElement && 
				document.body.contains(this.customHelpButton) &&
				this.customHelpButton.hasAttribute('data-astro-modular-settings-help-replacement');
			
			if (!customButtonExists) {
				// Clear stale reference if button was removed or doesn't have our identifier
				if (this.customHelpButton && (!document.body.contains(this.customHelpButton) || 
					!this.customHelpButton.hasAttribute('data-astro-modular-settings-help-replacement'))) {
					this.customHelpButton = undefined;
				}
				this.updateHelpButton();
			}
			}, 100); // Shorter debounce for better responsiveness
		});

		// Observe the vault actions area more specifically
		const vaultActions = document.querySelector('.workspace-drawer-vault-actions');
		if (vaultActions) {
			this.helpButtonObserver.observe(vaultActions, {
				childList: true,
				subtree: true, // Watch subtree to catch when buttons are recreated
			});
		}
		
		// Also observe the parent vault profile area
		const vaultProfile = document.querySelector('.workspace-sidedock-vault-profile');
		if (vaultProfile) {
			this.helpButtonObserver.observe(vaultProfile, {
				childList: true,
				subtree: false,
			});
		}
	}

	private restoreHelpButton() {
		// Remove CSS that hides help button
		if (this.helpButtonStyleEl) {
			this.helpButtonStyleEl.remove();
			this.helpButtonStyleEl = undefined;
		}

		// Remove the custom button
		if (this.customHelpButton) {
			this.customHelpButton.remove();
			this.customHelpButton = undefined;
		}

		// Clear stored references
		this.helpButtonElement = undefined;
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