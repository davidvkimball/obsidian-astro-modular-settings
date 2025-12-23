import { Setting, Notice, Modal, setIcon } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { TEMPLATE_OPTIONS, AstroModularPlugin, TemplateType, AstroModularSettings, CommandPaletteSettings, HomeOptions, PostOptions, NavigationSettings } from '../../types';
import { PresetWarningModal } from '../PresetWarningModal';

export class ConfigTab extends TabRenderer {
	async render(container: HTMLElement): Promise<void> {
		container.empty();
		const settings = this.getSettings();

		// Template selector
		new Setting(container)
			.setName('Template')
			.setDesc('Choose your content template')
			.addDropdown(dropdown => {
				TEMPLATE_OPTIONS.forEach(template => {
					dropdown.addOption(template.id, template.name);
				});
				dropdown.setValue(settings.currentTemplate);
				dropdown.onChange((value) => {
					// Show warning modal for template changes
					const changes = this.getTemplateChanges(value as TemplateType);
					const modal = new PresetWarningModal(
						this.app,
						changes,
						() => {
							void (async () => {
							// User confirmed - apply exactly like TemplateStep does
							try {
								// Update template settings exactly like the wizard does
								await this.updatePluginSettingsWithTemplate(value);
								
								// Reload settings to ensure the plugin has the latest values
								const plugin = this.plugin as AstroModularPlugin;
								await plugin.loadSettings();
								
								// Get fresh settings after reload
								const freshSettings = plugin.settings;
								
								// Apply the configuration
								const presetSuccess = await plugin.configManager.applyPreset({
									name: freshSettings.currentTemplate,
									description: '',
									features: freshSettings.features,
									theme: freshSettings.currentTheme,
									contentOrganization: freshSettings.contentOrganization,
									config: freshSettings
								});
								
								if (presetSuccess) {
									new Notice(`Template changed to ${value} and applied to config.ts`);
								} else {
									new Notice('Failed to apply template to config.ts');
								}
							} catch (error) {
								new Notice(`Failed to apply template change: ${error instanceof Error ? error.message : String(error)}`);
								dropdown.setValue(settings.currentTemplate);
							}
							})();
						},
						() => {
							// User cancelled - reset dropdown to current value
							dropdown.setValue(settings.currentTemplate);
						}
					);
					modal.open();
				});
			});

		// Deployment platform
		new Setting(container)
			.setName('Deployment')
			.setDesc('Choose your deployment platform')
			.addDropdown(dropdown => {
				dropdown.addOption('netlify', 'Netlify');
				dropdown.addOption('vercel', 'Vercel');
				dropdown.addOption('github-pages', 'GitHub pages');
				// False positive: "Cloudflare Workers" is a proper noun (product name) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				dropdown.addOption('cloudflare-workers', 'Cloudflare Workers');
				dropdown.setValue(settings.deployment.platform);
				dropdown.onChange(async (value) => {
				settings.deployment.platform = value as 'netlify' | 'vercel' | 'github-pages' | 'cloudflare-workers';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice(`Deployment platform changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply deployment platform change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Content organization
		new Setting(container)
			.setName('Content organization')
			.setDesc('Choose how to organize your content and assets')
			.addDropdown(dropdown => {
				dropdown.addOption('file-based', 'File-based');
				dropdown.addOption('folder-based', 'Folder-based');
				dropdown.setValue(settings.contentOrganization);
				dropdown.onChange(async (value) => {
				settings.contentOrganization = value as 'file-based' | 'folder-based';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as AstroModularPlugin).loadSettings();
				
				// Build plugin config dynamically based on new content organization (like wizard does)
					const contentOrg = value as 'file-based' | 'folder-based';
					const config = {
						obsidianSettings: {
							attachmentLocation: contentOrg === 'file-based' ? 'subfolder' : 'same-folder',
							subfolderName: 'attachments'
						},
						astroComposerSettings: {
							creationMode: contentOrg === 'file-based' ? 'file' : 'folder',
							indexFileName: 'index'
						},
						imageInserterSettings: {
							valueFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]',
							insertFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]'
						}
					};
					
					// Configure plugins with the new config
					try {
						await (this.plugin as AstroModularPlugin).pluginManager.configurePlugins(config);
						const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
						const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
						new Notice(`Content organization changed to ${value}\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated`, 8000);
					} catch (error) {
						new Notice(`Failed to configure plugins for content organization: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Plugin configuration section
		// Plugin configuration heading
		new Setting(container)
			.setHeading()
			.setName('Plugin configuration');
		
		// Get plugin status (async, so we need to handle this)
		void this.renderPluginStatus(container, settings);
	}

	private async renderPluginStatus(container: HTMLElement, settings: AstroModularSettings): Promise<void> {
		// Get plugin status
		const contentOrg = settings.contentOrganization;
		const pluginStatus = await (this.plugin as AstroModularPlugin).pluginManager.getPluginStatus(contentOrg);

		// Display plugin status
		const statusContainer = container.createDiv('plugin-status-container');
		const pluginStatusDiv = statusContainer.createDiv('plugin-status');
		
		for (const plugin of pluginStatus) {
			const isSettingsCheck = plugin.name === 'Attachment settings';
			const isConfigured = plugin.installed; // For settings, installed means configured
			const hasSyncIssues = plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length > 0;
			// If ALL content types are out of sync (4 out of 4), it's "Doesn't match", not "Partially configured"
			const allOutOfSync = hasSyncIssues && plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length === 4;
			const isPartiallyConfigured = hasSyncIssues && !allOutOfSync && plugin.installed && plugin.enabled;
			const allMismatched = allOutOfSync && plugin.installed && plugin.enabled;
			// Check if this is Image Inserter and settings don't match
			const isImageInserter = plugin.name === 'Image Inserter';
			const imageInserterMismatch = isImageInserter && plugin.installed && plugin.enabled && plugin.settingsMatch === false;
			
			// Determine item class and styling
			let itemClass = 'plugin-item';
			if (isSettingsCheck) {
				itemClass += isConfigured ? ' installed' : ' missing';
			} else if (imageInserterMismatch || allMismatched) {
				// Image Inserter settings don't match or all content types are out of sync - show as "missing" (red X)
				itemClass += ' missing';
			} else if (isPartiallyConfigured) {
				itemClass += ' partially-configured';
			} else {
				itemClass += plugin.installed && plugin.enabled ? ' installed' : ' missing';
			}
			
			const pluginItem = pluginStatusDiv.createDiv(itemClass);
			const icon = pluginItem.createDiv('plugin-icon');
			
			// Set icon based on status using setIcon
			if (isSettingsCheck) {
				setIcon(icon, isConfigured ? 'check' : 'x');
			} else if (imageInserterMismatch || allMismatched) {
				// Image Inserter settings don't match or all content types are out of sync - show red X
				setIcon(icon, 'x');
			} else if (isPartiallyConfigured) {
				// Alert triangle icon (neutral warning icon from Lucide)
				setIcon(icon, 'alert-triangle');
			} else {
				setIcon(icon, plugin.installed && plugin.enabled ? 'check' : 'x');
			}
			
			const info = pluginItem.createDiv('plugin-info');
			info.createEl('h3', { text: plugin.name });
			
			let statusText: string;
			if (isSettingsCheck) {
				// For settings check, installed means configured
				statusText = isConfigured ? 'Configured' : 'Doesn\'t match';
			} else if (!plugin.installed) {
				statusText = 'Not installed';
			} else if (!plugin.enabled) {
				statusText = 'Disabled';
			} else if (imageInserterMismatch || allMismatched) {
				// Settings don't match
				statusText = 'Doesn\'t match';
			} else if (isPartiallyConfigured) {
				// Some settings don't match
				statusText = 'Partially configured';
			} else {
				// Plugin is installed, enabled, and settings match (or no settings to check)
				statusText = 'Configured';
			}
			
			info.createEl('p', { text: statusText });
			
			// Add details about out-of-sync content types
			if (hasSyncIssues && plugin.outOfSyncContentTypes) {
				const detailsP = info.createEl('p', { 
					text: `Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}`,
					cls: 'sync-details'
				});
				// Set dynamic styles
				detailsP.setCssProps({
					fontSize: '0.9em',
					opacity: '0.8',
					marginTop: '4px'
				});
			}
		}

		// Re-apply configuration button
		new Setting(container)
			.setName('Re-apply configuration')
			.setDesc('Re-apply plugin settings based on your content organization choice (useful if settings were changed manually or configuration failed)')
			.addButton(button => button
				.setButtonText('Re-apply configuration')
				.setCta()
				.onClick(async () => {
					// Create configuration based on current content organization choice
					const contentOrg = settings.contentOrganization;
					const config = {
						obsidianSettings: {
							attachmentLocation: contentOrg === 'file-based' ? 'subfolder' : 'same-folder',
							subfolderName: 'attachments'
						},
						astroComposerSettings: {
							creationMode: contentOrg === 'file-based' ? 'file' : 'folder',
							indexFileName: 'index'
						},
						imageInserterSettings: {
							valueFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]',
							insertFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]'
						}
					};

					const success = await (this.plugin as AstroModularPlugin).pluginManager.configurePlugins(config);
					if (success) {
						// Show detailed success message
						const contentOrg = settings.contentOrganization;
						const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
						const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
						
						new Notice(`Configuration re-applied successfully!\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated for ${contentOrg}`, 8000);
						// Refresh the plugin status display
						const statusContainerEl = container.querySelector('.plugin-status-container');
						if (statusContainerEl) {
							statusContainerEl.remove();
							await this.renderPluginStatus(container, settings);
						}
					} else {
						// Text is already in sentence case
						// eslint-disable-next-line obsidianmd/ui/sentence-case
						new Notice('⚠️ Some plugins could not be configured automatically. Check console for details.', 5000);
					}
				}));

		// Show manual instructions button
		new Setting(container)
			.setName('Show manual instructions')
			.setDesc('Get step-by-step instructions for manual configuration')
			.addButton(button => button
				.setButtonText('Show manual instructions')
				.onClick(async () => {
					// Create configuration based on current content organization choice
					const contentOrg = settings.contentOrganization;
					const config = {
						obsidianSettings: {
							attachmentLocation: contentOrg === 'file-based' ? 'subfolder' : 'same-folder',
							subfolderName: 'attachments'
						},
						astroComposerSettings: {
							creationMode: contentOrg === 'file-based' ? 'file' : 'folder',
							indexFileName: 'index'
						},
						imageInserterSettings: {
							valueFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]',
							insertFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]'
						}
					};

					const instructions = await (this.plugin as AstroModularPlugin).pluginManager.getManualConfigurationInstructions(config);
					
					// Create a modal to show instructions
					const instructionModal = new Modal(this.app);
					instructionModal.titleEl.setText('Manual configuration instructions');
					
					// Create a container for the instructions
					const contentDiv = instructionModal.contentEl.createDiv();
					contentDiv.setCssProps({
						padding: '20px',
						lineHeight: '1.6'
					});
					
					// Parse instructions line by line and create proper DOM elements
					const lines = instructions.split('\n');
					let currentList: HTMLElement | null = null;
					
					lines.forEach((line: string) => {
						const trimmedLine = line.trim();
						
						if (trimmedLine === '') {
							// Empty line - add spacing
							contentDiv.createEl('br');
						} else if (trimmedLine.startsWith('## ')) {
							// Sub heading
							if (currentList) {
								currentList = null; // End current list
							}
							const h2 = contentDiv.createEl('h2');
							h2.setText(trimmedLine.substring(3));
							h2.setCssProps({
								marginTop: '20px',
								marginBottom: '10px',
								fontSize: '1.2em',
								fontWeight: 'bold'
							});
						} else if (trimmedLine.match(/^\d+\.\s/)) {
							// Numbered list item
							if (!currentList) {
								currentList = contentDiv.createEl('ol');
								currentList.setCssProps({
									marginLeft: '20px',
									marginBottom: '15px'
								});
							}
							const li = currentList.createEl('li');
							li.setCssProps({
								marginBottom: '5px'
							});
							// Parse bold text in the line
							this.parseBoldText(li, trimmedLine.replace(/^\d+\.\s/, ''));
						} else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
							// Bullet list item
							if (!currentList) {
								currentList = contentDiv.createEl('ul');
								currentList.setCssProps({
									marginLeft: '20px',
									marginBottom: '15px'
								});
							}
							const li = currentList.createEl('li');
							li.setCssProps({
								marginBottom: '5px'
							});
							// Parse bold text in the line
							this.parseBoldText(li, trimmedLine.substring(2));
						} else {
							// Regular paragraph
							if (currentList) {
								currentList = null; // End current list
							}
							const p = contentDiv.createEl('p');
							p.setCssProps({
								marginBottom: '10px'
							});
							// Parse bold text in the line
							this.parseBoldText(p, trimmedLine);
						}
					});
					
					instructionModal.open();
				}));
	}

	private parseBoldText(container: HTMLElement, text: string): void {
		// Simple bold text parser - handles **text** patterns
		const parts = text.split(/(\*\*.*?\*\*)/g);
		
		parts.forEach(part => {
			if (part.startsWith('**') && part.endsWith('**')) {
				// Bold text
				const strong = container.createEl('strong');
				strong.setText(part.substring(2, part.length - 2));
			} else if (part.trim() !== '') {
				// Regular text
				container.appendText(part);
			}
		});
	}

	private async updatePluginSettingsWithTemplate(template: string): Promise<void> {
		// Get the current plugin settings
		const plugin = this.plugin as AstroModularPlugin;
		const settings = plugin.settings;
		
		// Load the template preset from JSON (single source of truth)
		const templatePreset = plugin.configManager.getTemplatePreset(template);
		if (!templatePreset || !templatePreset.config) {
			new Notice('Template preset not found');
			return;
		}

		// CRITICAL: Get full template config including command palette settings
		const templateConfig = plugin.configManager.getTemplateConfig(template, settings);

		// Update settings from the preset's config
		settings.currentTemplate = template;
		
		// NOTE: We do NOT update theme or contentOrganization - those are separate user choices
		
		// Update features from preset (preserving user preferences for comments/profilePicture)
		if (templatePreset.config.features) {
			const currentComments = settings.features.comments;
			const currentProfilePicture = settings.features.profilePicture;
			settings.features = { ...settings.features, ...templatePreset.config.features };
			settings.features.comments = currentComments;
			settings.features.profilePicture = currentProfilePicture;
			
			// CRITICAL: Sync postOptions with features to maintain data integrity
			// postOptions.graphView.enabled is the source of truth
			if (settings.postOptions?.graphView) {
				settings.postOptions.graphView.enabled = templatePreset.config.features.graphView ?? false;
				settings.features.graphView = settings.postOptions.graphView.enabled;
			}
			
			// Sync linked mentions
			if (settings.postOptions?.linkedMentions) {
				settings.postOptions.linkedMentions.enabled = templatePreset.config.features.linkedMentions ?? false;
				settings.postOptions.linkedMentions.linkedMentionsCompact = templatePreset.config.features.linkedMentionsCompact ?? false;
			}
			
			// Sync command palette quick actions
			if (settings.commandPalette?.quickActions && templatePreset.config.features.quickActions) {
				settings.commandPalette.quickActions = { ...settings.commandPalette.quickActions, ...templatePreset.config.features.quickActions };
			}
		}
		
		// CRITICAL: Update ALL settings from template config (not just preset JSON)
		// This ensures data.json matches what config.ts will show
		
		// Update command palette
		const commandPalette = templateConfig.commandPalette as Partial<CommandPaletteSettings> | undefined;
		if (commandPalette) {
			settings.commandPalette = {
				...settings.commandPalette,
				enabled: commandPalette.enabled ?? settings.commandPalette.enabled,
				placeholder: commandPalette.placeholder ?? settings.commandPalette.placeholder,
				shortcut: commandPalette.shortcut ?? settings.commandPalette.shortcut,
				search: {
					...settings.commandPalette.search,
					...(commandPalette.search || {})
				},
				sections: {
					...settings.commandPalette.sections,
					...(commandPalette.sections || {})
				},
				quickActions: {
					...settings.commandPalette.quickActions,
					...(templatePreset.config.features?.quickActions || {})
				}
			};
			
			// Sync features.quickActions
			if (templatePreset.config.features?.quickActions) {
				settings.features.quickActions = {
					...settings.features.quickActions,
					...templatePreset.config.features.quickActions
				};
			}
		}
		
		// Update home options
		const homeOptions = templateConfig.homeOptions as Partial<HomeOptions> | undefined;
		if (homeOptions) {
			settings.homeOptions = {
				...settings.homeOptions,
				featuredPost: {
					...settings.homeOptions.featuredPost,
					...(homeOptions.featuredPost || {})
				},
				recentPosts: {
					...settings.homeOptions.recentPosts,
					...(homeOptions.recentPosts || {})
				},
				projects: {
					...settings.homeOptions.projects,
					...(homeOptions.projects || {})
				},
				docs: {
					...settings.homeOptions.docs,
					...(homeOptions.docs || {})
				},
				blurb: {
					...settings.homeOptions.blurb,
					...(homeOptions.blurb || {})
				}
			};
		}
		
		// Update post options
		const postOptions = templateConfig.postOptions as Partial<PostOptions> | undefined;
		if (postOptions) {
			settings.postOptions = {
				...settings.postOptions,
				postsPerPage: postOptions.postsPerPage ?? settings.postOptions.postsPerPage,
				readingTime: postOptions.readingTime ?? settings.postOptions.readingTime,
				wordCount: postOptions.wordCount ?? settings.postOptions.wordCount,
				tags: postOptions.tags ?? settings.postOptions.tags,
				postNavigation: postOptions.postNavigation ?? settings.postOptions.postNavigation,
				showPostCardCoverImages: postOptions.showPostCardCoverImages ?? settings.postOptions.showPostCardCoverImages,
				postCardAspectRatio: postOptions.postCardAspectRatio ?? settings.postOptions.postCardAspectRatio,
				linkedMentions: {
					...settings.postOptions.linkedMentions,
					...(postOptions.linkedMentions || {})
				},
				graphView: {
					...settings.postOptions.graphView,
					enabled: postOptions.graphView?.enabled ?? settings.postOptions.graphView.enabled,
					showInSidebar: postOptions.graphView?.showInSidebar ?? settings.postOptions.graphView.showInSidebar,
					maxNodes: postOptions.graphView?.maxNodes ?? settings.postOptions.graphView.maxNodes,
					showOrphanedPosts: postOptions.graphView?.showOrphanedPosts ?? settings.postOptions.graphView.showOrphanedPosts
				},
				comments: settings.postOptions.comments  // Preserve comments
			};
		}
		
		// Update navigation
		const navigation = templateConfig.navigation as Partial<NavigationSettings> | undefined;
		if (navigation) {
			settings.navigation = {
				...settings.navigation,
				showNavigation: navigation.showNavigation ?? settings.navigation.showNavigation,
				showMobileMenu: navigation.showMobileMenu ?? settings.navigation.showMobileMenu,
				style: navigation.style ?? settings.navigation.style
				// Preserve pages and social arrays from user settings
			};
		}
		
		// Update table of contents settings from preset
		if (templatePreset.config.tableOfContents) {
			settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
		}
		
		// Update optional content types from template config
		const optionalContentTypes = templateConfig.optionalContentTypes as { projects?: boolean; docs?: boolean } | undefined;
		if (optionalContentTypes) {
			settings.optionalContentTypes = {
				projects: optionalContentTypes.projects ?? false,
				docs: optionalContentTypes.docs ?? false
			};
		}
		
		// CRITICAL: Update footer settings from template config
		const footer = templateConfig.footer as { showSocialIconsInFooter?: boolean } | undefined;
		if (footer) {
			settings.footer = {
				...settings.footer,
				showSocialIconsInFooter: footer.showSocialIconsInFooter ?? settings.footer.showSocialIconsInFooter
			};
			// Sync features.showSocialIconsInFooter
			settings.features.showSocialIconsInFooter = footer.showSocialIconsInFooter ?? settings.features.showSocialIconsInFooter;
		}

		// Save the updated settings
		await this.plugin.saveData(settings);
	}

	private getTemplateChanges(templateId: string): string[] {
		const changes: string[] = [];
		const settings = this.getSettings();
		
		// Load the template preset from JSON
		const templatePreset = (this.plugin as AstroModularPlugin).configManager.getTemplatePreset(templateId);
		if (!templatePreset || !templatePreset.config) {
			changes.push('This will apply the template settings to your configuration.');
			return changes;
		}

		const newConfig = templatePreset.config;
		const featureChanges = [];

		// NOTE: We don't compare theme - that's a separate user choice

		// Compare all features from the preset
		if (newConfig.features) {
			// Key features to highlight (excluding comments which is user-configured)
			const keyFeatures = [
				{ key: 'graphView', label: 'Graph view' },
				{ key: 'tableOfContents', label: 'Table of contents' },
				{ key: 'readingTime', label: 'Reading time' },
				{ key: 'linkedMentions', label: 'Linked mentions' },
				{ key: 'linkedMentionsCompact', label: 'Compact linked mentions' },
				{ key: 'postNavigation', label: 'Post navigation' },
				{ key: 'showSocialIconsInFooter', label: 'Social icons in footer' },
				{ key: 'featureButton', label: 'Feature button' }
			];

			keyFeatures.forEach(({ key, label }) => {
				const oldFeature = (settings.features as unknown as Record<string, unknown>)[key];
				const newFeature = (newConfig.features as unknown as Record<string, unknown>)[key];
			if (newFeature !== undefined && oldFeature !== newFeature) {
				const oldVal = typeof oldFeature === 'boolean' 
					? (oldFeature ? 'ON' : 'OFF')
					: (oldFeature === null || oldFeature === undefined ? '' : (typeof oldFeature === 'string' || typeof oldFeature === 'number' ? String(oldFeature) : JSON.stringify(oldFeature)));
				const newVal = typeof newFeature === 'boolean'
					? (newFeature ? 'ON' : 'OFF')
					: (newFeature === null || newFeature === undefined ? '' : (typeof newFeature === 'string' || typeof newFeature === 'number' ? String(newFeature) : JSON.stringify(newFeature)));
				featureChanges.push(`${label}: ${oldVal} → ${newVal}`);
			}
			});

			// Check quickActions changes
			if (newConfig.features.quickActions && settings.features.quickActions) {
				if (newConfig.features.quickActions.enabled !== settings.features.quickActions.enabled) {
					featureChanges.push(`Quick actions: ${settings.features.quickActions.enabled ? 'ON' : 'OFF'} → ${newConfig.features.quickActions.enabled ? 'ON' : 'OFF'}`);
				}
			}
		}

		// Compare optional content types
		const isStandard = templateId === 'standard';
		if (settings.optionalContentTypes?.projects !== isStandard) {
			featureChanges.push(`Projects content type: ${settings.optionalContentTypes?.projects ? 'enabled' : 'disabled'} → ${isStandard ? 'enabled' : 'disabled'}`);
		}
		if (settings.optionalContentTypes?.docs !== isStandard) {
			featureChanges.push(`Docs content type: ${settings.optionalContentTypes?.docs ? 'enabled' : 'disabled'} → ${isStandard ? 'enabled' : 'disabled'}`);
		}

		if (featureChanges.length > 0) {
			changes.push(...featureChanges);
		} else {
			changes.push('No changes needed - your settings already match this template.');
		}
		
		return changes;
	}
}