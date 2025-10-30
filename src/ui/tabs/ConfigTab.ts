import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { TEMPLATE_OPTIONS } from '../../types';
import { PresetWarningModal } from '../PresetWarningModal';

export class ConfigTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Template selector
		new Setting(container)
			.setName('Template')
			.setDesc('Choose your content template')
			.addDropdown(dropdown => {
				TEMPLATE_OPTIONS.forEach(template => {
					dropdown.addOption(template.id, template.name);
				});
				dropdown.setValue(settings.currentTemplate);
				dropdown.onChange(async (value) => {
					// Show warning modal for template changes
					const changes = this.getTemplateChanges(value as any);
					const modal = new PresetWarningModal(
						this.app,
						changes,
						async () => {
							// User confirmed - apply exactly like TemplateStep does
							try {
								// Update template settings exactly like the wizard does
								await this.updatePluginSettingsWithTemplate(value);
								
								// Reload settings to ensure the plugin has the latest values
								await (this.plugin as any).loadSettings();
								
								// Get fresh settings after reload
								const freshSettings = (this.plugin as any).settings;
								
								// Apply the configuration
								const presetSuccess = await (this.plugin as any).configManager.applyPreset({
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
						},
						() => {
							// User cancelled - reset dropdown to current value
							dropdown.setValue(settings.currentTemplate);
						}
					);
					modal.open();
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
				settings.contentOrganization = value as any;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
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
						await (this.plugin as any).pluginManager.configurePlugins(config);
						const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
						const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
						new Notice(`Content organization changed to ${value}\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated`, 8000);
					} catch (error) {
						new Notice(`Failed to configure plugins for content organization: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Deployment platform
		new Setting(container)
			.setName('Deployment')
			.setDesc('Choose your deployment platform')
			.addDropdown(dropdown => {
				dropdown.addOption('netlify', 'Netlify');
				dropdown.addOption('vercel', 'Vercel');
				dropdown.addOption('github-pages', 'GitHub Pages');
				dropdown.setValue(settings.deployment.platform);
				dropdown.onChange(async (value) => {
				settings.deployment.platform = value as any;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice(`Deployment platform changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply deployment platform change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Reset to Template button
		new Setting(container)
			.setName('Reset to Template')
			.setDesc(`Reset all settings to the current template (${TEMPLATE_OPTIONS.find(t => t.id === settings.currentTemplate)?.name})`)
			.addButton(button => button
				.setButtonText('Reset to Template')
				.setWarning()
				.onClick(async () => {
					// Reset settings to template defaults
					try {
						// Load the template preset
						const templatePreset = (this.plugin as any).configManager.getTemplatePreset(settings.currentTemplate);
						if (templatePreset && templatePreset.config) {
							// Preserve user-specific settings that shouldn't be reset
							const preservedSiteInfo = settings.siteInfo;
							const preservedNavigation = settings.navigation;
							const preservedTheme = settings.currentTheme;
							const preservedContentOrg = settings.contentOrganization;
							const preservedTypography = settings.typography;
							const preservedOptionalFeatures = settings.optionalFeatures;
							const preservedRunWizardOnStartup = settings.runWizardOnStartup;
							
							// Apply template features and table of contents from preset
							if (templatePreset.config.features) {
								settings.features = { ...settings.features, ...templatePreset.config.features };
								
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
							
							if (templatePreset.config.tableOfContents) {
								settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
							}
							
							// Set template name
							settings.currentTemplate = templatePreset.config.currentTemplate || settings.currentTemplate;
							
							// Restore preserved settings
							settings.siteInfo = preservedSiteInfo;
							settings.navigation = preservedNavigation;
							settings.currentTheme = preservedTheme;
							settings.contentOrganization = preservedContentOrg;
							settings.typography = preservedTypography;
							settings.optionalFeatures = preservedOptionalFeatures;
							settings.runWizardOnStartup = preservedRunWizardOnStartup;
							
							await this.plugin.saveData(settings);
							// Reload settings to ensure the plugin has the latest values
							await (this.plugin as any).loadSettings();
							
							// Apply to config file
							await this.applyCurrentConfiguration(true);
							new Notice(`Reset to ${settings.currentTemplate} template and applied to config.ts`);
						} else {
							new Notice('Template not found');
						}
					} catch (error) {
						new Notice(`Failed to reset to template: ${error instanceof Error ? error.message : String(error)}`);
					}
				}));

		// Edit config.ts directly button
		new Setting(container)
			.setName('Edit config.ts directly')
			.setDesc('Open your Astro configuration file in the editor')
			.addButton(button => button
				.setButtonText('Open config.ts')
				.onClick(async () => {
					await this.openConfigFile();
				}));
	}

	private async openConfigFile(): Promise<void> {
		try {
			const fs = require('fs');
			const path = require('path');
			const { shell } = require('electron');
			
			// Get the actual vault path string from the adapter
			const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			if (fs.existsSync(configPath)) {
				// Use Electron's shell to open the file with the default editor
				shell.openPath(configPath);
			} else {
				new Notice(`Config file not found at: ${configPath}`);
			}
		} catch (error) {
			new Notice(`Error opening config file: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private async updatePluginSettingsWithTemplate(template: string): Promise<void> {
		// Get the current plugin settings
		const settings = (this.plugin as any).settings;
		
		// Load the template preset from JSON (single source of truth)
		const templatePreset = (this.plugin as any).configManager.getTemplatePreset(template);
		if (!templatePreset || !templatePreset.config) {
			new Notice('Template preset not found');
			return;
		}

		// CRITICAL: Get full template config including command palette settings
		const templateConfig = (this.plugin as any).configManager.getTemplateConfig(template, settings);

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
		if (templateConfig.commandPalette) {
			settings.commandPalette = {
				...settings.commandPalette,
				enabled: templateConfig.commandPalette.enabled ?? settings.commandPalette.enabled,
				placeholder: templateConfig.commandPalette.placeholder ?? settings.commandPalette.placeholder,
				shortcut: templateConfig.commandPalette.shortcut ?? settings.commandPalette.shortcut,
				search: {
					...settings.commandPalette.search,
					...(templateConfig.commandPalette.search || {})
				},
				sections: {
					...settings.commandPalette.sections,
					...(templateConfig.commandPalette.sections || {})
				},
				quickActions: {
					...settings.commandPalette.quickActions,
					...(templatePreset.config.features.quickActions || {})
				}
			};
			
			// Sync features.quickActions
			if (templatePreset.config.features.quickActions) {
				settings.features.quickActions = {
					...settings.features.quickActions,
					...templatePreset.config.features.quickActions
				};
			}
		}
		
		// Update home options
		if (templateConfig.homeOptions) {
			settings.homeOptions = {
				...settings.homeOptions,
				featuredPost: {
					...settings.homeOptions.featuredPost,
					...(templateConfig.homeOptions.featuredPost || {})
				},
				recentPosts: {
					...settings.homeOptions.recentPosts,
					...(templateConfig.homeOptions.recentPosts || {})
				},
				projects: {
					...settings.homeOptions.projects,
					...(templateConfig.homeOptions.projects || {})
				},
				docs: {
					...settings.homeOptions.docs,
					...(templateConfig.homeOptions.docs || {})
				},
				blurb: {
					...settings.homeOptions.blurb,
					...(templateConfig.homeOptions.blurb || {})
				}
			};
		}
		
		// Update post options
		if (templateConfig.postOptions) {
			settings.postOptions = {
				...settings.postOptions,
				postsPerPage: templateConfig.postOptions.postsPerPage ?? settings.postOptions.postsPerPage,
				readingTime: templateConfig.postOptions.readingTime ?? settings.postOptions.readingTime,
				wordCount: templateConfig.postOptions.wordCount ?? settings.postOptions.wordCount,
				tags: templateConfig.postOptions.tags ?? settings.postOptions.tags,
				postNavigation: templateConfig.postOptions.postNavigation ?? settings.postOptions.postNavigation,
				showPostCardCoverImages: templateConfig.postOptions.showPostCardCoverImages ?? settings.postOptions.showPostCardCoverImages,
				postCardAspectRatio: templateConfig.postOptions.postCardAspectRatio ?? settings.postOptions.postCardAspectRatio,
				linkedMentions: {
					...settings.postOptions.linkedMentions,
					...(templateConfig.postOptions.linkedMentions || {})
				},
				graphView: {
					...settings.postOptions.graphView,
					enabled: templateConfig.postOptions.graphView?.enabled ?? settings.postOptions.graphView.enabled,
					showInSidebar: templateConfig.postOptions.graphView?.showInSidebar ?? settings.postOptions.graphView.showInSidebar,
					maxNodes: templateConfig.postOptions.graphView?.maxNodes ?? settings.postOptions.graphView.maxNodes,
					showOrphanedPosts: templateConfig.postOptions.graphView?.showOrphanedPosts ?? settings.postOptions.graphView.showOrphanedPosts
				},
				comments: settings.postOptions.comments  // Preserve comments
			};
		}
		
		// Update navigation
		if (templateConfig.navigation) {
			settings.navigation = {
				...settings.navigation,
				showNavigation: templateConfig.navigation.showNavigation ?? settings.navigation.showNavigation,
				showMobileMenu: templateConfig.navigation.showMobileMenu ?? settings.navigation.showMobileMenu,
				style: templateConfig.navigation.style ?? settings.navigation.style
				// Preserve pages and social arrays from user settings
			};
		}
		
		// Update table of contents settings from preset
		if (templatePreset.config.tableOfContents) {
			settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
		}
		
		// Update optional content types from template config
		if (templateConfig.optionalContentTypes) {
			settings.optionalContentTypes = {
				projects: templateConfig.optionalContentTypes.projects ?? false,
				docs: templateConfig.optionalContentTypes.docs ?? false
			};
		}
		
		// CRITICAL: Update footer settings from template config
		if (templateConfig.footer) {
			settings.footer = {
				...settings.footer,
				showSocialIconsInFooter: templateConfig.footer.showSocialIconsInFooter ?? settings.footer.showSocialIconsInFooter
			};
			// Sync features.showSocialIconsInFooter
			settings.features.showSocialIconsInFooter = templateConfig.footer.showSocialIconsInFooter ?? settings.features.showSocialIconsInFooter;
		}

		// Save the updated settings
		await this.plugin.saveData(settings);
	}

	private getTemplateChanges(templateId: string): string[] {
		const changes: string[] = [];
		const settings = this.getSettings();
		
		// Load the template preset from JSON
		const templatePreset = (this.plugin as any).configManager.getTemplatePreset(templateId);
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
				const oldFeature = (settings.features as any)[key];
				const newFeature = (newConfig.features as any)[key];
				if (newFeature !== undefined && oldFeature !== newFeature) {
					const oldVal = typeof oldFeature === 'boolean' 
						? (oldFeature ? 'ON' : 'OFF')
						: oldFeature;
					const newVal = typeof newFeature === 'boolean'
						? (newFeature ? 'ON' : 'OFF')
						: newFeature;
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