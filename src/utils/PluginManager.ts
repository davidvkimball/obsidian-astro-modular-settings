import { App, Plugin } from 'obsidian';
import type { PluginStatus, PluginConfiguration } from '../types';

export class PluginManager {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async getPluginStatus(): Promise<PluginStatus[]> {
		const plugins = (this.app as any).plugins;
		const requiredPlugins = [
			'astro-composer',
			'insert-unsplash-image',
			'obsidian-shellcommands'
		];


		const status: PluginStatus[] = [];

		for (const pluginId of requiredPlugins) {
			const plugin = plugins?.plugins?.[pluginId];
			const isInEnabledSet = plugins?.enabledPlugins && plugins.enabledPlugins.has(pluginId);
			
			// Check if plugin is installed by looking at community plugins list
			// This works even when the plugin is disabled
			const isInstalled = this.isPluginInstalled(pluginId);
			
			
			status.push({
				name: this.getPluginDisplayName(pluginId),
				installed: isInstalled,
				enabled: isInEnabledSet,
				configurable: this.isPluginConfigurable(pluginId),
				currentSettings: plugin ? await this.getPluginSettings(plugin) : undefined
			});
		}

		return status;
	}

	private isPluginInstalled(pluginId: string): boolean {
		// Check if plugin is in the community plugins list
		// This works even when the plugin is disabled
		const communityPlugins = (this.app as any).plugins?.communityPlugins;
		if (communityPlugins && Array.isArray(communityPlugins)) {
			return communityPlugins.includes(pluginId);
		}
		
		// Fallback: check if plugin exists in plugins object (only works when enabled)
		const plugins = (this.app as any).plugins;
		return !!plugins?.plugins?.[pluginId];
	}

	private getPluginDisplayName(pluginId: string): string {
		const names: Record<string, string> = {
			'astro-composer': 'Astro Composer',
			'insert-unsplash-image': 'Image Inserter',
			'obsidian-shellcommands': 'Shell Commands'
		};
		return names[pluginId] || pluginId;
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
		console.log('Starting plugin configuration...');
		let successCount = 0;
		let totalConfigurations = 0;
		
		try {
			// Configure Obsidian settings
			totalConfigurations++;
			console.log('Configuring Obsidian settings...');
			await this.configureObsidianSettings(config.obsidianSettings);
			successCount++;
			console.log('Obsidian settings configured');
			
			// Configure Astro Composer settings
			totalConfigurations++;
			console.log('Configuring Astro Composer...');
			await this.configureAstroComposerSettings(config.astroComposerSettings);
			successCount++;
			
			// Configure Image Inserter settings
			totalConfigurations++;
			console.log('Configuring Image Inserter...');
			await this.configureImageInserterSettings(config.imageInserterSettings);
			successCount++;
			
			console.log(`Plugin configuration complete! ${successCount}/${totalConfigurations} configurations successful`);
			return successCount > 0; // Return true if at least one configuration succeeded
		} catch (error) {
			console.error('Plugin configuration failed:', error);
			return false;
		}
	}

	private async configureObsidianSettings(settings: any): Promise<void> {
		try {
			// Configure Obsidian's attachment settings
			const obsidianSettings = (this.app.vault as any).config;
			
		if (settings.attachmentLocation === 'subfolder') {
			// File-based: attachments in subfolder
			obsidianSettings.newLinkFormat = 'relative';
			obsidianSettings.attachmentFolderPath = `./${settings.subfolderName}`;
			console.log(`Set attachment location to subfolder: ${settings.subfolderName}`);
		} else {
			// Folder-based: attachments in same folder, keep relative links
			obsidianSettings.newLinkFormat = 'relative';
			obsidianSettings.attachmentFolderPath = './';
			console.log('Set attachment location to same folder as current file');
		}
			
			// Also try to set the setting through the app's settings manager
			const appSettings = (this.app as any).settings;
			if (appSettings) {
				appSettings.set('attachmentFolderPath', obsidianSettings.attachmentFolderPath);
				appSettings.set('newLinkFormat', obsidianSettings.newLinkFormat);
			}
			
			await (this.app.vault as any).saveConfig();
			console.log('Obsidian settings saved');
		} catch (error) {
			console.error('Failed to configure Obsidian settings:', error);
			throw error;
		}
	}

	private async configureAstroComposerSettings(settings: any): Promise<void> {
		try {
			const plugins = (this.app as any).plugins;
			const astroComposerPlugin = plugins?.plugins?.['astro-composer'];
			
			if (astroComposerPlugin && astroComposerPlugin.settings) {
				// Update Astro Composer settings
				astroComposerPlugin.settings.creationMode = settings.creationMode;
				astroComposerPlugin.settings.indexFileName = settings.indexFileName;
				
				// Save the settings
				await astroComposerPlugin.saveSettings();
				console.log('Astro Composer configured successfully');
			} else {
				console.log('Astro Composer plugin not found or not enabled');
			}
		} catch (error) {
			console.error('Failed to configure Astro Composer:', error);
		}
	}

	private async configureImageInserterSettings(settings: any): Promise<void> {
		try {
			const plugins = (this.app as any).plugins;
			const imageInserterPlugin = plugins?.plugins?.['insert-unsplash-image'];
			
			if (imageInserterPlugin && imageInserterPlugin.settings) {
				// Update Image Inserter settings
				// Only update the frontmatter.valueFormat (this is the main setting)
				if (imageInserterPlugin.settings.frontmatter) {
					imageInserterPlugin.settings.frontmatter.valueFormat = settings.valueFormat;
				}
				
				// Save the settings
				await imageInserterPlugin.saveSettings();
				console.log('Image Inserter configured successfully');
			} else {
				console.log('Image Inserter plugin not found or not enabled');
			}
		} catch (error) {
			console.error('Failed to configure Image Inserter:', error);
		}
	}

	async getManualConfigurationInstructions(config: PluginConfiguration): Promise<string> {
		let instructions = '# Manual Configuration Instructions\n\n';
		
		instructions += '## Obsidian Settings\n';
		instructions += `1. Go to **Settings → Files & Links**\n`;
		instructions += `2. Set **Default location for new attachments** to: `;
		instructions += config.obsidianSettings.attachmentLocation === 'subfolder' 
			? `**"In subfolder under current folder"**\n` 
			: `**"Same folder as current file"**\n`;
		if (config.obsidianSettings.attachmentLocation === 'subfolder') {
			instructions += `3. Set **Subfolder name** to: **"${config.obsidianSettings.subfolderName}"**\n`;
		}
		instructions += '\n';
		
		instructions += '## Astro Composer Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Astro Composer**\n`;
		instructions += `2. Set **Creation mode** to: "${config.astroComposerSettings.creationMode}"\n`;
		if (config.astroComposerSettings.creationMode === 'folder') {
			instructions += `3. Set **Index file name** to: "${config.astroComposerSettings.indexFileName}"\n`;
		}
		instructions += '\n';
		
		instructions += '## Image Inserter Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Image Inserter**\n`;
		instructions += `2. Set **Frontmatter → Value Format** to: "${config.imageInserterSettings.valueFormat}"\n`;
		
		return instructions;
	}
}
