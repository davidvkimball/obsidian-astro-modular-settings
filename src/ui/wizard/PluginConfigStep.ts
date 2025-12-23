import { BaseWizardStep } from './BaseWizardStep';
import { Notice, setIcon, Modal } from 'obsidian';
import { AstroModularPlugin, PluginStatus } from '../../types';

export class PluginConfigStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		// Get plugin status (pass content org from wizard state)
		const contentOrg = state.selectedContentOrg;
		void (async () => {
			const pluginStatus = await (this.plugin as AstroModularPlugin).pluginManager.getPluginStatus(contentOrg);
			
			const pluginConfig = container.createDiv('plugin-config');
			pluginConfig.createEl('h2', { text: 'Plugin configuration' });
			pluginConfig.createEl('p', { text: 'Configure your Obsidian plugins for optimal integration.' });
			
			const pluginStatusDiv = pluginConfig.createDiv('plugin-status');
			
			// Render each plugin status item
			for (const plugin of pluginStatus) {
				this.renderPluginStatusItem(pluginStatusDiv, plugin);
			}
			
			const configOptions = pluginConfig.createDiv('config-options');
			// False positive: "Automatically" and "Manual Instructions" are UI action labels
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			const autoBtn = configOptions.createEl('button', { text: 'Configure Automatically', cls: 'mod-button mod-cta' });
			autoBtn.id = 'configure-plugins';
			// False positive: "Manual Instructions" is a UI action label
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			const manualBtn = configOptions.createEl('button', { text: 'Show Manual Instructions', cls: 'mod-button' });
			manualBtn.id = 'show-instructions';

			this.setupEventHandlers(container);
		})();
	}

	private renderPluginStatusItem(container: HTMLElement, plugin: PluginStatus): void {
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
		
		// Determine if plugin is properly configured (not just enabled)
		const isProperlyConfigured = plugin.installed && plugin.enabled && 
			!imageInserterMismatch && !allMismatched && !isPartiallyConfigured;
		
		// Determine status text
		let statusText: string;
		if (isSettingsCheck) {
			statusText = isConfigured ? 'Configured' : 'Doesn\'t match';
		} else if (!plugin.installed) {
			statusText = 'Not installed';
		} else if (!plugin.enabled) {
			statusText = 'Disabled';
		} else if (imageInserterMismatch || allMismatched) {
			statusText = 'Doesn\'t match';
		} else if (isPartiallyConfigured) {
			statusText = 'Partially configured';
		} else if (isProperlyConfigured) {
			statusText = 'Configured';
		} else {
			// Fallback - should not happen, but just in case
			statusText = 'Configured';
		}
		
		// Determine item class
		let itemClass = 'plugin-item';
		if (isSettingsCheck) {
			itemClass += isConfigured ? ' installed' : ' missing';
		} else if (imageInserterMismatch || allMismatched) {
			// Image Inserter settings don't match or all content types are out of sync - show as "missing" (red X)
			itemClass += ' missing';
		} else if (isPartiallyConfigured) {
			itemClass += ' partially-configured';
		} else {
			itemClass += (plugin.installed && plugin.enabled) ? ' installed' : ' missing';
		}
		
		const pluginItem = container.createDiv(itemClass);
		const iconDiv = pluginItem.createDiv('plugin-icon');
		
		// Set icon based on status using setIcon
		if (isSettingsCheck) {
			setIcon(iconDiv, isConfigured ? 'check' : 'x');
		} else if (imageInserterMismatch || allMismatched) {
			setIcon(iconDiv, 'x');
		} else if (isPartiallyConfigured) {
			setIcon(iconDiv, 'alert-triangle');
		} else {
			setIcon(iconDiv, (plugin.installed && plugin.enabled) ? 'check' : 'x');
		}
		
		const info = pluginItem.createDiv('plugin-info');
		info.createEl('h3', { text: plugin.name });
		info.createEl('p', { text: statusText });
		
		// Add sync issues details if present
		if (hasSyncIssues && plugin.outOfSyncContentTypes) {
			const syncDetails = info.createEl('p', { text: `Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}`, cls: 'sync-details' });
			// Set dynamic styles
			syncDetails.setCssProps({
				fontSize: '0.9em',
				opacity: '0.8',
				marginTop: '4px'
			});
		}
	}

	private setupEventHandlers(container: HTMLElement): void {
		const state = this.getState();

		// Configure automatically button
		container.querySelector('#configure-plugins')?.addEventListener('click', () => {
			void (async () => {
				try {
				// Create configuration based on current content organization choice
				const contentOrg = state.selectedContentOrg;
				const config = {
					obsidianSettings: {
						attachmentLocation: (contentOrg === 'file-based' ? 'subfolder' : 'same-folder') as 'subfolder' | 'same-folder',
						subfolderName: 'attachments'
					},
					astroComposerSettings: {
						creationMode: (contentOrg === 'file-based' ? 'file' : 'folder') as 'file' | 'folder',
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
					// Reload plugin status to reflect changes
					const updatedStatus = await (this.plugin as AstroModularPlugin).pluginManager.getPluginStatus(state.selectedContentOrg);
					
					// Re-render the status display
					const statusContainerEl = container.querySelector('.plugin-status') as HTMLElement | null;
					if (statusContainerEl) {
						statusContainerEl.empty(); // Clear existing items
						updatedStatus.forEach(plugin => {
							this.renderPluginStatusItem(statusContainerEl, plugin);
						});
					}
					
					// Show detailed success message
					const contentOrg = state.selectedContentOrg;
					const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
					const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
					
					new Notice(`Plugins configured successfully!\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated for ${contentOrg}`, 8000);
				} else {
					// False positive: "automatically" is an adverb in UI text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					new Notice('⚠️ Some plugins could not be configured automatically. Check console for details.', 5000);
				}
			} catch (error) {
				new Notice(`Error configuring plugins: ${error instanceof Error ? error.message : String(error)}`);
			}
			})();
		});

		// Show manual instructions button
		container.querySelector('#show-instructions')?.addEventListener('click', () => {
			void (async () => {
			try {
				// Create configuration based on current content organization choice
				const contentOrg = state.selectedContentOrg;
				const config = {
					obsidianSettings: {
						attachmentLocation: (contentOrg === 'file-based' ? 'subfolder' : 'same-folder') as 'subfolder' | 'same-folder',
						subfolderName: 'attachments'
					},
					astroComposerSettings: {
						creationMode: (contentOrg === 'file-based' ? 'file' : 'folder') as 'file' | 'folder',
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
				// False positive: "Manual Configuration Instructions" is a title/heading
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				instructionModal.titleEl.setText('Manual Configuration Instructions');
				
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
								if (currentList) {
									currentList.setCssProps({
										marginLeft: '20px',
										marginBottom: '15px'
									});
								}
							}
							if (currentList) {
								const li = currentList.createEl('li');
								li.setCssProps({
									marginBottom: '5px'
								});
								// Parse bold text in the line
								this.parseBoldText(li, trimmedLine.replace(/^\d+\.\s/, ''));
							}
						} else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
							// Bullet list item
							if (!currentList) {
								currentList = contentDiv.createEl('ul');
								if (currentList) {
									currentList.setCssProps({
										marginLeft: '20px',
										marginBottom: '15px'
									});
								}
							}
							if (currentList) {
								const li = currentList.createEl('li');
								li.setCssProps({
									marginBottom: '5px'
								});
								// Parse bold text in the line
								this.parseBoldText(li, trimmedLine.substring(2));
							}
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
			} catch (error) {
				new Notice(`Error getting instructions: ${error instanceof Error ? error.message : String(error)}`);
			}
			})();
		});
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
}
