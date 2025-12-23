import { App, Plugin } from 'obsidian';
import type { PluginStatus, PluginConfiguration, ObsidianPlugins, ObsidianVaultConfig, ContentOrganizationType, ObsidianSettings, AstroComposerSettings, ImageInserterSettings } from '../types';

interface PluginWithSettings extends Plugin {
	settings?: Record<string, unknown>;
}

export class PluginManager {
	private app: App;
	private getContentOrganization?: () => ContentOrganizationType;

	constructor(app: App, getContentOrganization?: () => ContentOrganizationType) {
		this.app = app;
		this.getContentOrganization = getContentOrganization;
	}

	async getPluginStatus(contentOrg?: ContentOrganizationType): Promise<PluginStatus[]> {
		const plugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
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
			
			// For Astro Composer, check content type settings and include in main status
			let outOfSyncContentTypes: string[] | undefined;
			if (pluginId === 'astro-composer' && plugin) {
				const syncCheck = await this.checkAstroComposerSettings(plugin, contentOrg);
				if (syncCheck) {
					outOfSyncContentTypes = syncCheck.outOfSyncContentTypes;
				}
			}
			
			// For Image Inserter, check if settings match content organization
			let imageInserterSettingsMatch = true;
			if (pluginId === 'insert-unsplash-image' && plugin && isInstalled && isInEnabledSet) {
				imageInserterSettingsMatch = this.checkImageInserterSettings(plugin, contentOrg);
			}
			
			status.push({
				name: this.getPluginDisplayName(pluginId),
				installed: isInstalled,
				enabled: isInEnabledSet || false,
				configurable: this.isPluginConfigurable(pluginId),
				currentSettings: plugin ? await this.getPluginSettings(plugin) : undefined,
				outOfSyncContentTypes: outOfSyncContentTypes,
				settingsMatch: pluginId === 'insert-unsplash-image' ? imageInserterSettingsMatch : undefined
			});
		}

		return status;
	}

	private isPluginInstalled(pluginId: string): boolean {
		// Check if plugin is in the community plugins list
		// This works even when the plugin is disabled
		const appPlugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
		const communityPlugins = appPlugins?.communityPlugins;
		if (communityPlugins && Array.isArray(communityPlugins)) {
			return communityPlugins.includes(pluginId);
		}
		
		// Fallback: check if plugin exists in plugins object (only works when enabled)
		return !!appPlugins?.plugins?.[pluginId];
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
		const vaultConfig = (this.app.vault as unknown as { config?: ObsidianVaultConfig }).config;
		
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
			               normalizedPath === `.${expectedSubfolder}` ||
			               normalizedPath === `${expectedSubfolder}/` ||
			               normalizedPath === `./${expectedSubfolder}/`;
		} else {
			// For folder-based: should be "./" or empty (same folder)
			// Obsidian stores empty string or "./" for "same folder as current file"
			isConfigured = normalizedPath === './' || 
			               normalizedPath === '' || 
			               normalizedPath === '.' ||
			               normalizedPath === undefined ||
			               normalizedPath === null;
		}
		
		return {
			name: 'Attachment settings',
			installed: isConfigured, // Use installed field to indicate configured status
			enabled: false, // Not applicable for settings
			configurable: true,
			currentSettings: undefined
		};
	}

	private async checkAstroComposerSettings(plugin: Plugin, contentOrg?: ContentOrganizationType): Promise<{ outOfSyncContentTypes: string[] } | null> {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const expectedMode = contentOrgValue === 'file-based' ? 'file' : 'folder';
		
		try {
			const pluginSettings = (plugin as PluginWithSettings).settings;
			if (!pluginSettings) {
				return null;
			}
			
			const mismatchedTypes: string[] = [];
			
			// Check if using new contentTypes array structure
			if (Array.isArray(pluginSettings.contentTypes)) {
				// New structure: check each content type in the contentTypes array
				const expectedContentTypes = ['posts', 'pages', 'projects', 'docs'];
				
				for (const expectedType of expectedContentTypes) {
					const contentType = pluginSettings.contentTypes.find((ct: unknown) => 
						ct && typeof ct === 'object' && ct !== null && 'folder' in ct && typeof (ct as { folder?: unknown }).folder === 'string' && (ct as { folder: string }).folder.toLowerCase() === expectedType
					) as { enabled?: boolean; creationMode?: string } | undefined;
					
					if (contentType) {
						// Content type exists - check if it's enabled and matches expected mode
						if (contentType.enabled !== false) { // Only check if enabled (or not explicitly disabled)
							if (contentType.creationMode !== expectedMode) {
								mismatchedTypes.push(expectedType);
							}
						}
						// If disabled, we don't check it (don't add to mismatched)
					} else {
						// Content type not found - only check if it's one of the required ones
						// For now, we'll only check the ones that exist
					}
				}
			} else {
				// Fallback to old structure for backward compatibility
				// Check posts: use global creationMode
				if (pluginSettings.creationMode && typeof pluginSettings.creationMode === 'string') {
					if (pluginSettings.creationMode !== expectedMode) {
						mismatchedTypes.push('posts');
					}
				} else {
					// No creationMode set, needs configuration
					mismatchedTypes.push('posts');
				}
				
				// Check pages: use pagesCreationMode
				if (pluginSettings.pagesCreationMode) {
					if (pluginSettings.pagesCreationMode !== expectedMode) {
						mismatchedTypes.push('pages');
					}
				} else {
					// No pagesCreationMode set, needs configuration
					mismatchedTypes.push('pages');
				}
				
				// Check projects and docs: use customContentTypes
				if (Array.isArray(pluginSettings.customContentTypes)) {
					for (const contentType of ['projects', 'docs']) {
						const customType = pluginSettings.customContentTypes.find((ct: unknown) => 
							ct && typeof ct === 'object' && ct !== null && 'folder' in ct && typeof (ct as { folder?: unknown }).folder === 'string' && (ct as { folder: string }).folder.toLowerCase() === contentType
						) as { creationMode?: string } | undefined;
						if (customType && customType.creationMode) {
							if (customType.creationMode !== expectedMode) {
								mismatchedTypes.push(contentType);
							}
						} else {
							// Custom type exists but no creationMode set, needs configuration
							mismatchedTypes.push(contentType);
						}
					}
				} else {
					// No customContentTypes array, projects and docs need configuration
					mismatchedTypes.push('projects', 'docs');
				}
			}
			
			// If all content types match, return null (no issues)
			if (mismatchedTypes.length === 0) {
				return null;
			}
			
			// Return the list of out-of-sync content types
			return { outOfSyncContentTypes: mismatchedTypes };
		} catch (error) {
			console.error('Failed to check Astro Composer settings:', error);
			return null;
		}
	}
	
	private checkImageInserterSettings(plugin: Plugin, contentOrg?: ContentOrganizationType): boolean {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const expectedFormat = contentOrgValue === 'file-based' 
			? '[[attachments/{image-url}]]' 
			: '[[{image-url}]]';
		
		try {
			const pluginSettings = (plugin as PluginWithSettings).settings;
			if (!pluginSettings) {
				return false;
			}
			
			// Check the frontmatter valueFormat
			const frontmatter = pluginSettings.frontmatter;
			const actualFormat = frontmatter && typeof frontmatter === 'object' && 'valueFormat' in frontmatter
				? (frontmatter as { valueFormat?: unknown }).valueFormat
				: undefined;
			return actualFormat === expectedFormat;
		} catch (error) {
			console.error('Failed to check Image Inserter settings:', error);
			return false;
		}
	}

	private isPluginConfigurable(pluginId: string): boolean {
		const configurablePlugins = [
			'astro-composer',
			'insert-unsplash-image'
		];
		return configurablePlugins.includes(pluginId);
	}

	private async getPluginSettings(plugin: Plugin): Promise<Record<string, unknown> | undefined> {
		// This would need to be implemented based on each plugin's specific API
		// For now, return a placeholder
		const pluginWithSettings = plugin as PluginWithSettings;
		return pluginWithSettings.settings;
	}

	async configurePlugins(config: PluginConfiguration): Promise<boolean> {
		let successCount = 0;
		
		try {
			// Configure Obsidian settings
			await this.configureObsidianSettings(config.obsidianSettings);
			successCount++;
			
			// Configure Astro Composer settings
			await this.configureAstroComposerSettings(config.astroComposerSettings);
			successCount++;
			
			// Configure Image Inserter settings
			await this.configureImageInserterSettings(config.imageInserterSettings);
			successCount++;
			
			return successCount > 0; // Return true if at least one configuration succeeded
		} catch (error) {
			console.error('Plugin configuration failed:', error);
			return false;
		}
	}

	private async configureObsidianSettings(settings: ObsidianSettings): Promise<void> {
		try {
			const app = this.app as unknown as { setting?: { set?: (key: string, value: string) => Promise<void>; save?: () => Promise<void> } };
			const targetPath = settings.attachmentLocation === 'subfolder' 
				? `./${settings.subfolderName}` 
				: './';
			
			// Method 1: Try to use the app's settings manager if available
			if (app.setting && typeof app.setting.set === 'function') {
				await app.setting.set('attachmentFolderPath', targetPath);
				await app.setting.set('newLinkFormat', 'relative');
				
				// Save the settings
				if (typeof app.setting.save === 'function') {
					await app.setting.save();
				}
			} else {
				// Method 2: Fallback to vault config (current approach)
				const vault = this.app.vault as unknown as { config?: ObsidianVaultConfig; saveConfig?: () => Promise<void> };
				const obsidianSettings = vault.config;
				
				if (obsidianSettings) {
					obsidianSettings.newLinkFormat = 'relative';
					obsidianSettings.attachmentFolderPath = targetPath;
					
					if (typeof vault.saveConfig === 'function') {
						await vault.saveConfig();
					}
				}
			}
			
		} catch (error) {
			console.error('Failed to configure Obsidian settings:', error);
			throw error;
		}
	}

	private async configureAstroComposerSettings(settings: AstroComposerSettings): Promise<void> {
		try {
			const plugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
			const astroComposerPlugin = plugins?.plugins?.['astro-composer'];
			
			if (!astroComposerPlugin) {
				console.warn('Astro Composer plugin not found');
				return;
			}
			
			if (!astroComposerPlugin.settings) {
				console.warn('Astro Composer plugin settings not available');
				return;
			}
			
			const pluginSettings = astroComposerPlugin.settings as Record<string, unknown>;
			const creationMode = settings.creationMode;
			
			// Check if using new contentTypes array structure
			if (Array.isArray(pluginSettings.contentTypes)) {
				// New structure: update each content type in the contentTypes array
				const contentTypesToUpdate = ['posts', 'pages', 'projects', 'docs'];
				
				for (const contentType of pluginSettings.contentTypes) {
					if (contentType && typeof contentType === 'object' && contentType !== null) {
						const contentTypeObj = contentType as Record<string, unknown>;
						const folderName = (typeof contentTypeObj.folder === 'string' ? contentTypeObj.folder : '').toLowerCase();
						if (contentTypesToUpdate.includes(folderName)) {
							contentTypeObj.creationMode = creationMode;
						}
					}
				}
			} else {
				// Fallback to old structure for backward compatibility
				// Update posts: use global creationMode (for posts)
				pluginSettings.creationMode = creationMode;
				
				// Update pages: use pagesCreationMode
				pluginSettings.pagesCreationMode = creationMode;
				
				// Update projects and docs: use customContentTypes array
				if (Array.isArray(pluginSettings.customContentTypes)) {
					for (const customType of pluginSettings.customContentTypes) {
						if (customType && typeof customType === 'object' && customType !== null) {
							const customTypeObj = customType as Record<string, unknown>;
							// Check if this is projects or docs by folder name
							const folderName = (typeof customTypeObj.folder === 'string' ? customTypeObj.folder : '').toLowerCase();
							if (folderName === 'projects' || folderName === 'docs') {
								customTypeObj.creationMode = creationMode;
							}
						}
					}
				}
			}
			
			// Update index file name
			pluginSettings.indexFileName = settings.indexFileName;
			
			// Save the settings
			const pluginWithSave = astroComposerPlugin as { saveSettings?: () => Promise<void> };
			const saveSettings = pluginWithSave.saveSettings;
			if (saveSettings && typeof saveSettings === 'function') {
				await saveSettings();
			}
		} catch (error) {
			console.error('Failed to configure Astro Composer:', error);
			throw error; // Re-throw to let caller know it failed
		}
	}

	private async configureImageInserterSettings(settings: ImageInserterSettings): Promise<void> {
		try {
			const plugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
			const imageInserterPlugin = plugins?.plugins?.['insert-unsplash-image'];
			
			if (imageInserterPlugin && imageInserterPlugin.settings) {
				// Update Image Inserter settings
				// Only update the frontmatter.valueFormat (this is the main setting)
				const pluginSettings = imageInserterPlugin.settings as Record<string, unknown>;
				if (pluginSettings.frontmatter && typeof pluginSettings.frontmatter === 'object' && pluginSettings.frontmatter !== null) {
					const frontmatter = pluginSettings.frontmatter as Record<string, unknown>;
					frontmatter.valueFormat = settings.valueFormat;
				}
				
				// Save the settings
				const pluginWithSave = imageInserterPlugin as { saveSettings?: () => Promise<void> };
				const saveSettings = pluginWithSave.saveSettings;
				if (saveSettings && typeof saveSettings === 'function') {
					await saveSettings();
				}
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
		instructions += `3. Ensure **Creation mode** is set to "${config.astroComposerSettings.creationMode === 'file' ? 'File-based' : 'Folder-based'}" for all content types:\n`;
		instructions += `   - Posts\n`;
		instructions += `   - Pages\n`;
		instructions += `   - Projects\n`;
		instructions += `   - Docs\n`;
		if (config.astroComposerSettings.creationMode === 'folder') {
			instructions += `4. Set **Index file name** to: "${config.astroComposerSettings.indexFileName}"\n`;
		}
		
		instructions += '## Image Inserter Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Image Inserter**\n`;
		instructions += `2. Set **Frontmatter → Value Format** to: "${config.imageInserterSettings.valueFormat}"\n`;
		
		instructions += '**Note**: After making these changes, you should see them reflected in Obsidian\'s settings interface. If the automatic configuration worked, these settings should already be applied.\n';
		
		return instructions;
	}
}
