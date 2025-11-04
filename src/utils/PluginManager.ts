import { App, Plugin } from 'obsidian';
import type { PluginStatus, PluginConfiguration, ObsidianPlugins, ObsidianVaultConfig, ObsidianAppSettings, ContentOrganizationType } from '../types';

export class PluginManager {
	private app: App;
	private getContentOrganization?: () => ContentOrganizationType;

	constructor(app: App, getContentOrganization?: () => ContentOrganizationType) {
		this.app = app;
		this.getContentOrganization = getContentOrganization;
	}

	async getPluginStatus(contentOrg?: ContentOrganizationType): Promise<PluginStatus[]> {
		const plugins = (this.app as any).plugins as ObsidianPlugins;
		const requiredPlugins = [
			'astro-composer',
			'insert-unsplash-image'
		];

		const status: PluginStatus[] = [];

		// Add Obsidian settings check first
		const obsidianSettingsStatus = this.checkObsidianSettings(contentOrg);
		status.push(obsidianSettingsStatus);

		// Then add plugin checks
		for (const pluginId of requiredPlugins) {
			const plugin = plugins?.plugins?.[pluginId];
			const isInEnabledSet = plugins?.enabledPlugins && plugins.enabledPlugins.has(pluginId);
			
			// Check if plugin is installed by looking at community plugins list
			// This works even when the plugin is disabled
			const isInstalled = this.isPluginInstalled(pluginId);
			
			
			status.push({
				name: this.getPluginDisplayName(pluginId),
				installed: isInstalled,
				enabled: isInEnabledSet || false,
				configurable: this.isPluginConfigurable(pluginId),
				currentSettings: plugin ? await this.getPluginSettings(plugin) : undefined
			});
		}

		return status;
	}

	private isPluginInstalled(pluginId: string): boolean {
		// Check if plugin is in the community plugins list
		// This works even when the plugin is disabled
		const communityPlugins = (this.app as any).plugins?.communityPlugins as string[] | undefined;
		if (communityPlugins && Array.isArray(communityPlugins)) {
			return communityPlugins.includes(pluginId);
		}
		
		// Fallback: check if plugin exists in plugins object (only works when enabled)
		const plugins = (this.app as any).plugins as ObsidianPlugins;
		return !!plugins?.plugins?.[pluginId];
	}

	private getPluginDisplayName(pluginId: string): string {
		const names: Record<string, string> = {
			'astro-composer': 'Astro Composer',
			'insert-unsplash-image': 'Image Inserter'
		};
		return names[pluginId] || pluginId;
	}

	private checkObsidianSettings(contentOrg?: ContentOrganizationType): PluginStatus {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const vaultConfig = (this.app.vault as any).config as ObsidianVaultConfig;
		
		// Get the expected attachment location based on content organization
		const expectedLocation = contentOrgValue === 'file-based' ? 'subfolder' : 'same-folder';
		const expectedSubfolder = 'attachments';
		
		// Check if settings match
		let isConfigured = false;
		
		// Normalize the attachment path for comparison
		const attachmentPath = (vaultConfig.attachmentFolderPath || '').trim();
		const normalizedPath = attachmentPath.replace(/\/+$/, ''); // Remove trailing slashes
		
		if (expectedLocation === 'subfolder') {
			// For file-based: should be "./attachments" or "attachments"
			// Check various formats that Obsidian might use
			isConfigured = normalizedPath === `./${expectedSubfolder}` || 
			               normalizedPath === `${expectedSubfolder}` ||
			               normalizedPath.endsWith(`/${expectedSubfolder}`) ||
			               normalizedPath === `.${expectedSubfolder}`;
		} else {
			// For folder-based: should be "./" or empty (same folder)
			// Obsidian stores empty string or "./" for "same folder as current file"
			isConfigured = normalizedPath === './' || 
			               normalizedPath === '' || 
			               normalizedPath === '.' ||
			               normalizedPath === undefined;
		}
		
		return {
			name: 'Plugin-compatible Obsidian settings',
			installed: isConfigured, // Use installed field to indicate configured status
			enabled: false, // Not applicable for settings
			configurable: true,
			currentSettings: undefined
		};
	}

	private isPluginConfigurable(pluginId: string): boolean {
		const configurablePlugins = [
			'astro-composer',
			'insert-unsplash-image'
		];
		return configurablePlugins.includes(pluginId);
	}

	private async getPluginSettings(plugin: Plugin): Promise<any> {
		// This would need to be implemented based on each plugin's specific API
		// For now, return a placeholder
		return {};
	}

	async configurePlugins(config: PluginConfiguration): Promise<boolean> {
		let successCount = 0;
		let totalConfigurations = 0;
		
		try {
			// Configure Obsidian settings
			totalConfigurations++;
			await this.configureObsidianSettings(config.obsidianSettings);
			successCount++;
			
			// Configure Astro Composer settings
			totalConfigurations++;
			await this.configureAstroComposerSettings(config.astroComposerSettings);
			successCount++;
			
			// Configure Image Inserter settings
			totalConfigurations++;
			await this.configureImageInserterSettings(config.imageInserterSettings);
			successCount++;
			
			return successCount > 0; // Return true if at least one configuration succeeded
		} catch (error) {
			console.error('Plugin configuration failed:', error);
			return false;
		}
	}

	private async configureObsidianSettings(settings: any): Promise<void> {
		try {
			// Method 1: Try to use the app's settings manager if available
			const app = this.app as any;
			if (app.setting && typeof app.setting.set === 'function') {
				if (settings.attachmentLocation === 'subfolder') {
					await app.setting.set('attachmentFolderPath', `./${settings.subfolderName}`);
					await app.setting.set('newLinkFormat', 'relative');
				} else {
					await app.setting.set('attachmentFolderPath', './');
					await app.setting.set('newLinkFormat', 'relative');
				}
				
				// Save the settings
				if (typeof app.setting.save === 'function') {
					await app.setting.save();
				}
			} else {
				// Method 2: Fallback to vault config (current approach)
				const obsidianSettings = (this.app.vault as any).config as ObsidianVaultConfig;
				
				if (settings.attachmentLocation === 'subfolder') {
					obsidianSettings.newLinkFormat = 'relative';
					obsidianSettings.attachmentFolderPath = `./${settings.subfolderName}`;
				} else {
					obsidianSettings.newLinkFormat = 'relative';
					obsidianSettings.attachmentFolderPath = './';
				}
				
				await (this.app.vault as any).saveConfig();
			}
			
			// Method 3: Try to trigger a settings refresh
			try {
				if (app.setting && typeof app.setting.open === 'function') {
					// This might trigger a refresh of the settings UI
				}
			} catch (refreshError) {
				// Ignore refresh errors
			}
			
		} catch (error) {
			console.error('Failed to configure Obsidian settings:', error);
			throw error;
		}
	}

	private async configureAstroComposerSettings(settings: any): Promise<void> {
		try {
			const plugins = (this.app as any).plugins as ObsidianPlugins;
			const astroComposerPlugin = plugins?.plugins?.['astro-composer'];
			
			if (astroComposerPlugin && astroComposerPlugin.settings) {
				// Update Astro Composer settings
				astroComposerPlugin.settings.creationMode = settings.creationMode;
				astroComposerPlugin.settings.indexFileName = settings.indexFileName;
				
				// Save the settings
				await astroComposerPlugin.saveSettings();
			}
		} catch (error) {
			console.error('Failed to configure Astro Composer:', error);
		}
	}

	private async configureImageInserterSettings(settings: any): Promise<void> {
		try {
			const plugins = (this.app as any).plugins as ObsidianPlugins;
			const imageInserterPlugin = plugins?.plugins?.['insert-unsplash-image'];
			
			if (imageInserterPlugin && imageInserterPlugin.settings) {
				// Update Image Inserter settings
				// Only update the frontmatter.valueFormat (this is the main setting)
				if (imageInserterPlugin.settings.frontmatter) {
					imageInserterPlugin.settings.frontmatter.valueFormat = settings.valueFormat;
				}
				
				// Save the settings
				await imageInserterPlugin.saveSettings();
			}
		} catch (error) {
			console.error('Failed to configure Image Inserter:', error);
		}
	}

	async getManualConfigurationInstructions(config: PluginConfiguration): Promise<string> {
		let instructions = '## Obsidian Settings\n';
		instructions += `1. Go to **Settings → Files & Links**\n`;
		instructions += `2. Set **Default location for new attachments** to: `;
		instructions += config.obsidianSettings.attachmentLocation === 'subfolder' 
			? `**"In subfolder under current folder"**\n` 
			: `**"Same folder as current file"**\n`;
		if (config.obsidianSettings.attachmentLocation === 'subfolder') {
			instructions += `3. Set **Subfolder name** to: **"${config.obsidianSettings.subfolderName}"**\n`;
		}
		
		instructions += '## Astro Composer Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Astro Composer**\n`;
		instructions += `2. Set **Creation mode** to: "${config.astroComposerSettings.creationMode === 'file' ? 'File-based' : 'Folder-based'}"\n`;
		if (config.astroComposerSettings.creationMode === 'folder') {
			instructions += `3. Set **Index file name** to: "${config.astroComposerSettings.indexFileName}"\n`;
		}
		
		instructions += '## Image Inserter Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Image Inserter**\n`;
		instructions += `2. Set **Frontmatter → Value Format** to: "${config.imageInserterSettings.valueFormat}"\n`;
		
		instructions += '**Note**: After making these changes, you should see them reflected in Obsidian\'s settings interface. If the automatic configuration worked, these settings should already be applied.\n';
		
		return instructions;
	}
}
