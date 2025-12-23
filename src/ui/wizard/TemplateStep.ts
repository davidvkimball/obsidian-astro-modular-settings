import { BaseWizardStep } from './BaseWizardStep';
import { TEMPLATE_OPTIONS, AstroModularPlugin } from '../../types';
import { Notice, Setting } from 'obsidian';

export class TemplateStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const templateSelectionDiv = container.createDiv('template-selection');
		templateSelectionDiv.createEl('h2', { text: 'Choose your preset' });
		templateSelectionDiv.createEl('p', { text: 'Select a preset that best fits your content type and goals.' });
		
		const templateOptions = templateSelectionDiv.createDiv('template-options');
		
		TEMPLATE_OPTIONS.forEach(template => {
			const templateOption = templateOptions.createDiv('template-option');
			if (state.selectedTemplate === template.id) {
				templateOption.addClass('selected');
			}
			templateOption.setAttribute('data-template', template.id);
			
			const templateHeader = templateOption.createDiv('template-header');
			templateHeader.createEl('h3', { text: template.name });
			if (template.recommended) {
				templateHeader.createEl('span', { text: 'Default', cls: 'recommended' });
			}
			
			templateOption.createEl('p', { text: template.description, cls: 'template-description' });
			
			const templateFeatures = templateOption.createDiv('template-features');
			template.features.forEach(feature => {
				templateFeatures.createEl('span', { text: feature, cls: 'feature-tag' });
			});
			
			// Add click handler
			templateOption.addEventListener('click', () => {
				const templateId = template.id;
				this.updateState({ selectedTemplate: templateId });
				
				// Sync optional content types based on template selection
				const isStandard = templateId === 'standard';
				this.updateState({
					selectedOptionalContentTypes: {
						projects: isStandard,
						docs: isStandard
					}
				});

				// Sync all features based on template selection
				this.syncFeaturesWithTemplate(templateId);
				
				// Re-render to update the UI
				this.render(container);
			});
		});

		// Edit config.ts directly setting (standard Obsidian Setting format)
		const templateSelectionEl = container.querySelector('.template-selection');
		if (templateSelectionEl) {
			const setting = new Setting(templateSelectionEl as HTMLElement)
				.setName('Edit config.ts directly (advanced)')
				// eslint-disable-next-line obsidianmd/ui/sentence-case -- "Astro" is a proper noun
				.setDesc('Skip the wizard and edit your Astro configuration file directly.')
				.addButton(button => button
					.setButtonText('Edit config.ts')
					.onClick(() => {
						this.openConfigFile();
					}));
			
			// Add spacing above the setting
			const settingEl = setting.settingEl;
			if (settingEl) {
				settingEl.setCssProps({ marginTop: '2rem' });
			}
		}
	}

	private syncFeaturesWithTemplate(template: string): void {
		// Load features from preset JSON (single source of truth)
		const pluginInstance = this.plugin as AstroModularPlugin;
		const templatePreset = pluginInstance.configManager.getTemplatePreset(template);
		if (!templatePreset || !templatePreset.config || !templatePreset.config.features) {
			console.error('Template preset not found:', template);
			return;
		}

		// Update wizard state with features from preset JSON
		this.updateState({
			selectedFeatures: templatePreset.config.features
		});
	}

	private async updatePluginSettingsWithTemplate(template: string): Promise<void> {
		// Get the current plugin settings
		const pluginForUpdate = this.plugin as AstroModularPlugin;
		const settings = pluginForUpdate.settings;
		
		// Load the template preset from JSON (single source of truth)
		const templatePreset = pluginForUpdate.configManager.getTemplatePreset(template);
		if (!templatePreset || !templatePreset.config) {
			console.error('Template preset not found:', template);
			return;
		}

		// CRITICAL: Get full template config including all settings
		const templateConfig = pluginForUpdate.configManager.getTemplateConfig(template, settings);

		// Update settings from the preset's config
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
		
		// CRITICAL: Update ALL settings from template config (same as ConfigTab)
		
		// Update command palette
		if (templateConfig.commandPalette && typeof templateConfig.commandPalette === 'object') {
			const commandPalette = templateConfig.commandPalette as Record<string, unknown>;
			settings.commandPalette = {
				...settings.commandPalette,
				enabled: (commandPalette.enabled as boolean | undefined) ?? settings.commandPalette.enabled,
				placeholder: (commandPalette.placeholder as string | undefined) ?? settings.commandPalette.placeholder,
				shortcut: (commandPalette.shortcut as string | undefined) ?? settings.commandPalette.shortcut,
				search: {
					...settings.commandPalette.search,
					...(commandPalette.search && typeof commandPalette.search === 'object' ? commandPalette.search as Record<string, unknown> : {})
				},
				sections: {
					...settings.commandPalette.sections,
					...(commandPalette.sections && typeof commandPalette.sections === 'object' ? commandPalette.sections as Record<string, unknown> : {})
				},
				quickActions: {
					...settings.commandPalette.quickActions,
					...(templatePreset.config.features?.quickActions || {})
				}
			};
			
			if (templatePreset.config.features && templatePreset.config.features.quickActions) {
				settings.features.quickActions = {
					...settings.features.quickActions,
					...templatePreset.config.features.quickActions
				};
			}
		}
		
		// Update home options
		if (templateConfig.homeOptions && typeof templateConfig.homeOptions === 'object') {
			const homeOptions = templateConfig.homeOptions as Record<string, unknown>;
			settings.homeOptions = {
				...settings.homeOptions,
				featuredPost: {
					...settings.homeOptions.featuredPost,
					...(homeOptions.featuredPost && typeof homeOptions.featuredPost === 'object' ? homeOptions.featuredPost as Record<string, unknown> : {})
				},
				recentPosts: {
					...settings.homeOptions.recentPosts,
					...(homeOptions.recentPosts && typeof homeOptions.recentPosts === 'object' ? homeOptions.recentPosts as Record<string, unknown> : {})
				},
				projects: {
					...settings.homeOptions.projects,
					...(homeOptions.projects && typeof homeOptions.projects === 'object' ? homeOptions.projects as Record<string, unknown> : {})
				},
				docs: {
					...settings.homeOptions.docs,
					...(homeOptions.docs && typeof homeOptions.docs === 'object' ? homeOptions.docs as Record<string, unknown> : {})
				},
				blurb: {
					...settings.homeOptions.blurb,
					...(homeOptions.blurb && typeof homeOptions.blurb === 'object' ? homeOptions.blurb as Record<string, unknown> : {})
				}
			};
		}
		
		// Update post options
		if (templateConfig.postOptions && typeof templateConfig.postOptions === 'object') {
			const postOptions = templateConfig.postOptions as Record<string, unknown>;
			settings.postOptions = {
				...settings.postOptions,
				postsPerPage: (postOptions.postsPerPage as number | undefined) ?? settings.postOptions.postsPerPage,
				readingTime: (postOptions.readingTime as boolean | undefined) ?? settings.postOptions.readingTime,
				wordCount: (postOptions.wordCount as boolean | undefined) ?? settings.postOptions.wordCount,
				tags: (postOptions.tags as boolean | undefined) ?? settings.postOptions.tags,
				postNavigation: (postOptions.postNavigation as boolean | undefined) ?? settings.postOptions.postNavigation,
				showPostCardCoverImages: ((postOptions.showPostCardCoverImages as string | undefined) ?? settings.postOptions.showPostCardCoverImages) as 'all' | 'featured' | 'home' | 'posts' | 'featured-and-posts' | 'none',
				postCardAspectRatio: ((postOptions.postCardAspectRatio as string | undefined) ?? settings.postOptions.postCardAspectRatio) as 'og' | '16:9' | '4:3' | '3:2' | 'square' | 'golden' | 'custom',
				linkedMentions: {
					...settings.postOptions.linkedMentions,
					...(postOptions.linkedMentions && typeof postOptions.linkedMentions === 'object' ? postOptions.linkedMentions as Record<string, unknown> : {})
				},
				graphView: {
					...settings.postOptions.graphView,
					enabled: (postOptions.graphView && typeof postOptions.graphView === 'object' ? (postOptions.graphView as Record<string, unknown>).enabled as boolean | undefined : undefined) ?? settings.postOptions.graphView.enabled,
					showInSidebar: (postOptions.graphView && typeof postOptions.graphView === 'object' ? (postOptions.graphView as Record<string, unknown>).showInSidebar as boolean | undefined : undefined) ?? settings.postOptions.graphView.showInSidebar,
					maxNodes: (postOptions.graphView && typeof postOptions.graphView === 'object' ? (postOptions.graphView as Record<string, unknown>).maxNodes as number | undefined : undefined) ?? settings.postOptions.graphView.maxNodes,
					showOrphanedPosts: (postOptions.graphView && typeof postOptions.graphView === 'object' ? (postOptions.graphView as Record<string, unknown>).showOrphanedPosts as boolean | undefined : undefined) ?? settings.postOptions.graphView.showOrphanedPosts
				},
				comments: settings.postOptions.comments  // Preserve comments
			};
		}
		
		// Update navigation
		if (templateConfig.navigation && typeof templateConfig.navigation === 'object') {
			const navigation = templateConfig.navigation as Record<string, unknown>;
			settings.navigation = {
				...settings.navigation,
				showNavigation: (navigation.showNavigation as boolean | undefined) ?? settings.navigation.showNavigation,
				showMobileMenu: (navigation.showMobileMenu as boolean | undefined) ?? settings.navigation.showMobileMenu,
				style: ((navigation.style as string | undefined) ?? settings.navigation.style) as 'minimal' | 'traditional'
				// Preserve pages and social arrays from user settings
			};
		}
		
		// Update table of contents settings from preset
		if (templatePreset.config.tableOfContents) {
			settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
		}
		
		// Update optional content types from template config
		if (templateConfig.optionalContentTypes && typeof templateConfig.optionalContentTypes === 'object') {
			const optionalContentTypes = templateConfig.optionalContentTypes as Record<string, unknown>;
			settings.optionalContentTypes = {
				projects: (optionalContentTypes.projects as boolean | undefined) ?? false,
				docs: (optionalContentTypes.docs as boolean | undefined) ?? false
			};
		}
		
		// CRITICAL: Update footer settings from template config
		if (templateConfig.footer && typeof templateConfig.footer === 'object') {
			const footer = templateConfig.footer as Record<string, unknown>;
			const showSocialIconsInFooter = (footer.showSocialIconsInFooter as boolean | undefined) ?? settings.footer.showSocialIconsInFooter;
			settings.footer = {
				...settings.footer,
				showSocialIconsInFooter
			};
			// Sync features.showSocialIconsInFooter
			settings.features.showSocialIconsInFooter = showSocialIconsInFooter;
		}

		// Save the updated settings
		await this.plugin.saveData(settings);
		
		// Reload settings to ensure the plugin has the latest values
		const pluginInstance = this.plugin as AstroModularPlugin;
		await pluginInstance.loadSettings();
		
		// Trigger a refresh of the settings tab if it's open
		this.refreshSettingsTab();
	}

	private refreshSettingsTab(): void {
		// Check if the settings tab is currently open and refresh it
		const plugin = this.plugin as unknown as { settingsTab?: { display?: () => void } };
		const settingsTab = plugin.settingsTab;
		if (settingsTab && typeof settingsTab.display === 'function') {
			settingsTab.display();
		}
	}

	private openConfigFile(): void {
		// Open config.ts file - it's one level up from the vault
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const fs = require('fs') as typeof import('fs');
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const path = require('path') as typeof import('path');
			// @ts-expect-error - electron is only available in Electron environment
			// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
			const electronModule = require('electron') as unknown as { shell?: typeof import('electron').shell };
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const shellRaw = electronModule.shell;
			
			// Get the actual vault path string from the adapter
			const vaultAdapter = this.app.vault.adapter as unknown as { basePath?: string; path?: string };
			const vaultPath = vaultAdapter.basePath || vaultAdapter.path;
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			if (!shellRaw || typeof shellRaw !== 'object' || !('openPath' in shellRaw) || typeof (shellRaw as { openPath?: unknown }).openPath !== 'function') {
				throw new Error('Electron shell API not available');
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Runtime type guard ensures safety
			const shell = shellRaw;
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			if (fs.existsSync(configPath)) {
				// Use Electron's shell to open the file with the default editor
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				shell.openPath(configPath);
			} else {
				// Create the file if it doesn't exist
				fs.writeFileSync(configPath, '// Astro Modular Configuration\n// Customize your settings here\n\nexport const siteConfig = {\n  // Add your configuration here\n};\n');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				shell.openPath(configPath);
			}
			new Notice('Opening config.ts for direct editing');
			this.modal.close();
		} catch (error) {
			new Notice(`Error opening config file: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}
