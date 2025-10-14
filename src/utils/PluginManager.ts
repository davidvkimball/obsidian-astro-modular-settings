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
		try {
			// Configure Obsidian settings
			await this.configureObsidianSettings(config.obsidianSettings);
			
			// Configure Astro Composer settings
			await this.configureAstroComposerSettings(config.astroComposerSettings);
			
			// Configure Image Inserter settings
			await this.configureImageInserterSettings(config.imageInserterSettings);
			
			return true;
		} catch (error) {
			return false;
		}
	}

	private async configureObsidianSettings(settings: any): Promise<void> {
		// Configure Obsidian's attachment settings
		const obsidianSettings = (this.app.vault as any).config;
		
		if (settings.attachmentLocation === 'subfolder') {
			obsidianSettings.newLinkFormat = 'shortest';
			obsidianSettings.attachmentFolderPath = settings.subfolderName;
		} else {
			obsidianSettings.newLinkFormat = 'shortest';
			obsidianSettings.attachmentFolderPath = '';
		}
		
		await (this.app.vault as any).saveConfig();
	}

	private async configureAstroComposerSettings(settings: any): Promise<void> {
		// This would need to be implemented based on Astro Composer's API
		// For now, we'll just log the configuration
	}

	private async configureImageInserterSettings(settings: any): Promise<void> {
		// This would need to be implemented based on Image Inserter's API
		// For now, we'll just log the configuration
	}

	async getManualConfigurationInstructions(config: PluginConfiguration): Promise<string> {
		let instructions = '# Manual Configuration Instructions\n\n';
		
		instructions += '## Obsidian Settings\n';
		instructions += `1. Go to **Settings → Files & Links**\n`;
		instructions += `2. Set **Default location for new attachments** to: `;
		instructions += config.obsidianSettings.attachmentLocation === 'subfolder' 
			? `"In subfolder under current folder"` 
			: `"Same folder as current file"`;
		instructions += `\n`;
		if (config.obsidianSettings.attachmentLocation === 'subfolder') {
			instructions += `3. Set **Subfolder name** to: "${config.obsidianSettings.subfolderName}"\n`;
		}
		instructions += '\n';
		
		instructions += '## Astro Composer Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Astro Composer**\n`;
		instructions += `2. Set **Creation mode** to: "${config.astroComposerSettings.creationMode}"\n`;
		if (config.astroComposerSettings.creationMode === 'folder-based') {
			instructions += `3. Set **Index file name** to: "${config.astroComposerSettings.indexFileName}"\n`;
		}
		instructions += '\n';
		
		instructions += '## Image Inserter Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Image Inserter**\n`;
		instructions += `2. Set **Insert to Frontmatter Value Format** to: "${config.imageInserterSettings.insertFormat}"\n`;
		
		return instructions;
	}
}
