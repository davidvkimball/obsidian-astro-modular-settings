import { App, Plugin } from 'obsidian';
import type { PluginStatus, PluginConfiguration, ObsidianPlugins, ObsidianVaultConfig, ContentOrganizationType, ObsidianSettings, AstroComposerSettings, ImageManagerSettings } from '../types';

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

	getPluginStatus(contentOrg?: ContentOrganizationType): PluginStatus[] {
		const plugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
		const requiredPlugins = [
			'astro-composer',
			'image-manager'
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
				const syncCheck = this.checkAstroComposerSettings(plugin as Plugin, contentOrg);
				if (syncCheck) {
					outOfSyncContentTypes = syncCheck.outOfSyncContentTypes;
				}
			}
			
			// For Image Manager, check if settings match content organization
			let imageManagerSettingsMatch = true;
			if (pluginId === 'image-manager' && plugin && isInstalled && isInEnabledSet) {
				imageManagerSettingsMatch = this.checkImageManagerSettings(plugin as Plugin, contentOrg);
			}
			
			status.push({
				name: this.getPluginDisplayName(pluginId),
				installed: isInstalled,
				enabled: isInEnabledSet || false,
				configurable: this.isPluginConfigurable(pluginId),
				currentSettings: plugin ? this.getPluginSettings(plugin as Plugin) : undefined,
				outOfSyncContentTypes: outOfSyncContentTypes,
				settingsMatch: pluginId === 'image-manager' ? imageManagerSettingsMatch : undefined
			});
		}

		return status;
	}

	private isPluginInstalled(pluginId: string): boolean {
		const appPlugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
		// Primary: Obsidian keeps manifests for every installed community plugin (enabled or not)
		if (appPlugins?.manifests && typeof appPlugins.manifests === 'object' && pluginId in appPlugins.manifests) {
			return true;
		}
		if (appPlugins?.communityPlugins && Array.isArray(appPlugins.communityPlugins)) {
			return appPlugins.communityPlugins.includes(pluginId);
		}
		return !!appPlugins?.plugins?.[pluginId];
	}

	private getPluginDisplayName(pluginId: string): string {
		const names: Record<string, string> = {
			'astro-composer': 'Astro Composer',
			'image-manager': 'Image Manager'
		};
		return names[pluginId] || pluginId;
	}

	/** True when vault Files & Links attachment location matches Astro Modular content organization */
	private isVaultAttachmentConfiguredForContentOrg(contentOrg?: ContentOrganizationType): boolean {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const vaultConfig = (this.app.vault as unknown as { config?: ObsidianVaultConfig }).config;
		const expectedLocation = contentOrgValue === 'file-based' ? 'subfolder' : 'same-folder';
		const expectedSubfolder = 'attachments';
		const attachmentPath = (vaultConfig?.attachmentFolderPath ?? '').trim();
		const normalizedPath = attachmentPath.replace(/\/+$/, '');
		if (expectedLocation === 'subfolder') {
			return normalizedPath === `./${expectedSubfolder}` ||
				normalizedPath === `${expectedSubfolder}` ||
				normalizedPath.endsWith(`/${expectedSubfolder}`) ||
				normalizedPath === `.${expectedSubfolder}` ||
				normalizedPath === `${expectedSubfolder}/` ||
				normalizedPath === `./${expectedSubfolder}/`;
		}
		return normalizedPath === './' ||
			normalizedPath === '' ||
			normalizedPath === '.' ||
			normalizedPath === undefined ||
			normalizedPath === null;
	}

	private checkObsidianSettings(contentOrg?: ContentOrganizationType): PluginStatus {
		const isConfigured = this.isVaultAttachmentConfiguredForContentOrg(contentOrg);
		return {
			name: 'Attachment settings',
			installed: isConfigured,
			enabled: false,
			configurable: true,
			currentSettings: undefined
		};
	}

	/** Last path segment of a content folder path, lowercased (e.g. `content/posts` → `posts`) */
	private contentTypeFolderKey(folder: string): string {
		const normalized = folder.replace(/\\/g, '/').trim();
		const parts = normalized.split('/').filter(Boolean);
		const last = parts[parts.length - 1] ?? normalized;
		return last.toLowerCase();
	}

	private findContentTypeByCanonical(
		contentTypes: unknown[],
		canonical: string
	): { enabled?: boolean; creationMode?: string } | undefined {
		for (const ct of contentTypes) {
			if (!ct || typeof ct !== 'object') continue;
			const o = ct as Record<string, unknown>;
			if (typeof o.folder === 'string' && this.contentTypeFolderKey(o.folder) === canonical) {
				return o as { enabled?: boolean; creationMode?: string };
			}
		}
		for (const ct of contentTypes) {
			if (!ct || typeof ct !== 'object') continue;
			const o = ct as Record<string, unknown>;
			if (typeof o.id === 'string') {
				const low = o.id.toLowerCase();
				if (low === canonical || low.startsWith(`${canonical}-`)) {
					return o as { enabled?: boolean; creationMode?: string };
				}
			}
		}
		return undefined;
	}

	private checkAstroComposerSettings(plugin: Plugin, contentOrg?: ContentOrganizationType): { outOfSyncContentTypes: string[] } | null {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const expectedMode = contentOrgValue === 'file-based' ? 'file' : 'folder';

		try {
			const pluginSettings = (plugin as PluginWithSettings).settings;
			if (!pluginSettings) {
				return null;
			}

			const mismatchedTypes: string[] = [];
			const expectedContentTypes = ['posts', 'pages', 'projects', 'docs'];
			const contentTypes = pluginSettings.contentTypes;
			const hasNewContentTypes = Array.isArray(contentTypes) && contentTypes.length > 0;

			if (hasNewContentTypes) {
				for (const expectedType of expectedContentTypes) {
					const contentType = this.findContentTypeByCanonical(contentTypes, expectedType);
					if (!contentType) {
						continue;
					}
					if (contentType.enabled === false) {
						continue;
					}
					if (contentType.creationMode !== expectedMode) {
						mismatchedTypes.push(expectedType);
					}
				}
			} else {
				if (pluginSettings.creationMode && typeof pluginSettings.creationMode === 'string') {
					if (pluginSettings.creationMode !== expectedMode) {
						mismatchedTypes.push('posts');
					}
				} else {
					mismatchedTypes.push('posts');
				}

				if (pluginSettings.pagesCreationMode) {
					if (pluginSettings.pagesCreationMode !== expectedMode) {
						mismatchedTypes.push('pages');
					}
				} else {
					mismatchedTypes.push('pages');
				}

				if (Array.isArray(pluginSettings.customContentTypes)) {
					for (const contentType of ['projects', 'docs'] as const) {
						const customType = pluginSettings.customContentTypes.find((ct: unknown) =>
							ct && typeof ct === 'object' && ct !== null && 'folder' in ct &&
							typeof (ct as { folder?: unknown }).folder === 'string' &&
							this.contentTypeFolderKey((ct as { folder: string }).folder) === contentType
						) as { creationMode?: string } | undefined;
						if (customType && customType.creationMode) {
							if (customType.creationMode !== expectedMode) {
								mismatchedTypes.push(contentType);
							}
						} else {
							mismatchedTypes.push(contentType);
						}
					}
				} else {
					mismatchedTypes.push('projects', 'docs');
				}
			}

			if (mismatchedTypes.length === 0) {
				return null;
			}
			return { outOfSyncContentTypes: mismatchedTypes };
		} catch (error) {
			console.error('Failed to check Astro Composer settings:', error);
			return null;
		}
	}
	
	private normalizeImageManagerTemplate(value: unknown): string {
		if (typeof value !== 'string') {
			return '';
		}
		return value.trim().replace(/\{image-url\}/gi, '{image-url}');
	}

	private checkImageManagerSettings(plugin: Plugin, contentOrg?: ContentOrganizationType): boolean {
		const contentOrgValue = contentOrg || this.getContentOrganization?.() || 'file-based';
		const expectedFormat =
			contentOrgValue === 'file-based'
				? '[[attachments/{image-url}]]'
				: '[[{image-url}]]';
		const vaultOk = this.isVaultAttachmentConfiguredForContentOrg(contentOrg);

		try {
			const pluginSettings = (plugin as PluginWithSettings).settings;
			if (!pluginSettings) {
				return false;
			}

			const propertyLinkFormat = pluginSettings.propertyLinkFormat;
			// Image Manager (current): PropertyLinkFormat — obsidian | path | relative | wikilink | markdown | custom
			if (propertyLinkFormat === 'obsidian') {
				return vaultOk;
			}
			if (propertyLinkFormat === 'wikilink' && vaultOk) {
				return true;
			}
			if (propertyLinkFormat === 'custom') {
				const actual = this.normalizeImageManagerTemplate(pluginSettings.customPropertyLinkFormat);
				return actual === this.normalizeImageManagerTemplate(expectedFormat);
			}
			return false;
		} catch (error) {
			console.error('Failed to check Image Manager settings:', error);
			return false;
		}
	}

	private isPluginConfigurable(pluginId: string): boolean {
		const configurablePlugins = [
			'astro-composer',
			'image-manager'
		];
		return configurablePlugins.includes(pluginId);
	}

	private getPluginSettings(plugin: Plugin): Record<string, unknown> | undefined {
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
			
			// Configure Image Manager settings
			await this.configureImageManagerSettings(config.imageManagerSettings);
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
			
			const astroComposerPluginWithSettings = astroComposerPlugin as PluginWithSettings;
			if (!astroComposerPluginWithSettings.settings) {
				console.warn('Astro Composer plugin settings not available');
				return;
			}
			
			const pluginSettings = astroComposerPluginWithSettings.settings;
			const creationMode = settings.creationMode;
			const contentTypes = pluginSettings.contentTypes;
			const hasNewContentTypes = Array.isArray(contentTypes) && contentTypes.length > 0;

			if (hasNewContentTypes) {
				const canonicals = ['posts', 'pages', 'projects', 'docs'];
				for (const contentType of contentTypes) {
					if (!contentType || typeof contentType !== 'object') continue;
					const contentTypeObj = contentType as Record<string, unknown>;
					const folderRaw = typeof contentTypeObj.folder === 'string' ? contentTypeObj.folder : '';
					const key = this.contentTypeFolderKey(folderRaw);
					const idStr = typeof contentTypeObj.id === 'string' ? contentTypeObj.id : '';
					const idLow = idStr.toLowerCase();
					const matchesCanonical = canonicals.includes(key) ||
						canonicals.some(c => idLow === c || idLow.startsWith(`${c}-`));
					if (matchesCanonical) {
						contentTypeObj.creationMode = creationMode;
						contentTypeObj.indexFileName = settings.indexFileName;
					}
				}
			} else {
				pluginSettings.creationMode = creationMode;
				pluginSettings.pagesCreationMode = creationMode;
				if (Array.isArray(pluginSettings.customContentTypes)) {
					for (const customType of pluginSettings.customContentTypes) {
						if (customType && typeof customType === 'object' && customType !== null) {
							const customTypeObj = customType as Record<string, unknown>;
							const folderName = typeof customTypeObj.folder === 'string'
								? this.contentTypeFolderKey(customTypeObj.folder)
								: '';
							if (folderName === 'projects' || folderName === 'docs') {
								customTypeObj.creationMode = creationMode;
							}
						}
					}
				}
				pluginSettings.indexFileName = settings.indexFileName;
			}
			
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

	private async configureImageManagerSettings(settings: ImageManagerSettings): Promise<void> {
		try {
			const plugins = (this.app as unknown as { plugins?: ObsidianPlugins }).plugins;
			const imageManagerPlugin = plugins?.plugins?.['image-manager'];
			
			const imageManagerPluginWithSettings = imageManagerPlugin as PluginWithSettings | undefined;
			if (imageManagerPluginWithSettings && imageManagerPluginWithSettings.settings) {
				// Align with Image Manager: custom template + follow Obsidian attachment location after vault configure
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
				const pluginSettings = imageManagerPluginWithSettings.settings as Record<string, unknown>;
				pluginSettings.propertyLinkFormat = 'custom';
				pluginSettings.customPropertyLinkFormat = settings.customPropertyLinkFormat;
				pluginSettings.attachmentLocation = 'obsidian';
				
				// Save the settings
				const pluginWithSave = imageManagerPlugin as { saveSettings?: () => Promise<void> };
				const saveSettings = pluginWithSave.saveSettings;
				if (saveSettings && typeof saveSettings === 'function') {
					await saveSettings();
				}
			}
		} catch (error) {
			console.error('Failed to configure Image Manager:', error);
		}
	}

	getManualConfigurationInstructions(config: PluginConfiguration): string {
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
		
		instructions += '## Image Manager Plugin\n';
		instructions += `1. Go to **Settings → Community plugins → Image Manager**\n`;
		instructions += `2. Under **General**, set **Attachment location** to **"Use Obsidian's settings"** (matches Files & Links above).\n`;
		instructions += `3. Under **Property insertion**, either:\n`;
		instructions += `   - Set **Property link format** to **"Use Obsidian's settings"** (recommended when vault attachment settings match Astro Modular), or\n`;
		instructions += `   - Set **Property link format** to **"Custom format"** and **Custom format template** to: \`${config.imageManagerSettings.customPropertyLinkFormat}\`\n`;
		
		instructions += '**Note**: After making these changes, you should see them reflected in Obsidian\'s settings interface. If the automatic configuration worked, these settings should already be applied.\n';
		
		return instructions;
	}
}
