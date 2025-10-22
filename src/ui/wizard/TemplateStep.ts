import { BaseWizardStep } from './BaseWizardStep';
import { TEMPLATE_OPTIONS, TemplateType } from '../../types';
import { Notice } from 'obsidian';

export class TemplateStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="template-selection">
				<h2>Choose your preset</h2>
				<p>Select a preset that best fits your content type and goals.</p>
				<div class="template-options">
					${TEMPLATE_OPTIONS.map(template => `
						<div class="template-option ${state.selectedTemplate === template.id ? 'selected' : ''}" 
							 data-template="${template.id}">
							<div class="template-header">
								<h3>${template.name}</h3>
								${template.recommended ? '<span class="recommended">Default</span>' : ''}
							</div>
							<p class="template-description">${template.description}</p>
							<div class="template-features">
								${template.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
							</div>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.template-option').forEach(option => {
			option.addEventListener('click', () => {
				const template = option.getAttribute('data-template');
				if (template) {
					this.updateState({ selectedTemplate: template as TemplateType });
					
					// Sync optional content types based on template selection
					const isStandardOrCustom = template === 'standard' || template === 'custom';
					this.updateState({
						selectedOptionalContentTypes: {
							projects: isStandardOrCustom,
							docs: isStandardOrCustom
						}
					});

					// Sync all features based on template selection
					this.syncFeaturesWithTemplate(template);
					
					// Update plugin settings immediately so Features tab reflects changes
					this.updatePluginSettingsWithTemplate(template);
					
					if (template === 'custom') {
						// Open config.ts file - it's one level up from the vault
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
								// Create the file if it doesn't exist
								fs.writeFileSync(configPath, '// Astro Modular Configuration\n// Customize your settings here\n\nexport const siteConfig = {\n  // Add your configuration here\n};\n');
								shell.openPath(configPath);
							}
							new Notice('Opening config.ts for custom configuration');
							this.modal.close();
							return;
						} catch (error) {
							new Notice(`Error opening config file: ${error instanceof Error ? error.message : String(error)}`);
						}
					}
					
					// Re-render to update the UI
					this.render(container);
				}
			});
		});
	}

	private syncFeaturesWithTemplate(template: string): void {
		// Load features from preset JSON (single source of truth)
		const templatePreset = (this.plugin as any).configManager.getTemplatePreset(template);
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
		const settings = (this.plugin as any).settings;
		
		// Load the template preset from JSON (single source of truth)
		const templatePreset = (this.plugin as any).configManager.getTemplatePreset(template);
		if (!templatePreset || !templatePreset.config) {
			console.error('Template preset not found:', template);
			return;
		}

		// Update settings from the preset's config
		// NOTE: We do NOT update theme or contentOrganization - those are separate user choices
		
		// Update features from preset (preserving user preferences for comments/profilePicture)
		if (templatePreset.config.features) {
			const currentComments = settings.features.comments;
			const currentProfilePicture = settings.features.profilePicture;
			settings.features = { ...settings.features, ...templatePreset.config.features };
			settings.features.comments = currentComments;
			settings.features.profilePicture = currentProfilePicture;
		}
		
		// Update table of contents settings from preset
		if (templatePreset.config.tableOfContents) {
			settings.tableOfContents = { ...settings.tableOfContents, ...templatePreset.config.tableOfContents };
		}
		
		// Update optional content types
		const isStandardOrCustom = template === 'standard' || template === 'custom';
		settings.optionalContentTypes = {
			projects: isStandardOrCustom,
			docs: isStandardOrCustom
		};

		// Save the updated settings
		await this.plugin.saveData(settings);
		
		// Trigger a refresh of the settings tab if it's open
		this.refreshSettingsTab();
	}

	private refreshSettingsTab(): void {
		// Check if the settings tab is currently open and refresh it
		const settingsTab = (this.plugin as any).settingsTab;
		if (settingsTab && typeof settingsTab.display === 'function') {
			settingsTab.display();
		}
	}
}
