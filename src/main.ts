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

		// Add ribbon icon
		this.addRibbonIcon('wand-sparkles', 'Open Astro Modular wizard', async () => {
			// Reload settings from disk to get the latest values
			await this.loadSettings();
			
			const wizard = new SetupWizardModal(this.app, this);
			wizard.open();
		});

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

		// No welcome notice needed - modal is the intro
	}

	onunload() {
		// Clear startup timeout if it exists
		if (this.startupTimeoutId) {
			window.clearTimeout(this.startupTimeoutId);
			this.startupTimeoutId = undefined;
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
			if (this.customHelpButton && this.customHelpButton.parentElement) {
				this.customHelpButton.remove();
				this.customHelpButton = undefined;
			}

			// Create a new custom button
			const customButton = helpButton.cloneNode(true) as HTMLElement;
			customButton.style.display = '';
			customButton.removeAttribute('aria-label'); // Remove any existing aria-label
			
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
				
				// Check if we have a custom button, if not, inject it
				if (!this.customHelpButton) {
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
}