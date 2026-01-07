import { Setting, Notice, Modal, setIcon } from 'obsidian';
import { AstroModularPlugin, PluginConfiguration } from '../../types';
import { TabRenderer } from '../common/TabRenderer';

export class PluginsTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Get plugin status
		const contentOrg = settings.contentOrganization;
		const pluginStatus = (this.plugin as AstroModularPlugin).pluginManager.getPluginStatus(contentOrg);

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
			// Check if this is Image Manager and settings don't match
			const isImageManager = plugin.name === 'Image Manager';
			const imageManagerMismatch = isImageManager && plugin.installed && plugin.enabled && plugin.settingsMatch === false;
			
			// Determine item class and styling
			let itemClass = 'plugin-item';
			if (isSettingsCheck) {
				itemClass += isConfigured ? ' installed' : ' missing';
			} else if (imageManagerMismatch || allMismatched) {
				// Image Manager settings don't match or all content types are out of sync - show as "missing" (red X)
				itemClass += ' missing';
			} else if (isPartiallyConfigured) {
				itemClass += ' partially-configured';
			} else {
				itemClass += isConfigured && plugin.enabled ? ' installed' : ' missing';
			}
			
			const pluginItem = pluginStatusDiv.createDiv(itemClass);
			const icon = pluginItem.createDiv('plugin-icon');
			
			// Set icon based on status using setIcon
			if (isSettingsCheck) {
				setIcon(icon, isConfigured ? 'check' : 'x');
			} else if (imageManagerMismatch || allMismatched) {
				// Image Manager settings don't match or all content types are out of sync - show red X
				setIcon(icon, 'x');
			} else if (isPartiallyConfigured) {
				// Alert triangle icon (neutral warning icon from Lucide)
				setIcon(icon, 'alert-triangle');
			} else {
				setIcon(icon, isConfigured && plugin.enabled ? 'check' : 'x');
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
			} else if (imageManagerMismatch || allMismatched) {
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
				detailsP.setCssProps({
					fontSize: '0.9em',
					opacity: '0.8',
					marginTop: '4px'
				});
			}
		}

		// Configure automatically button
		new Setting(container)
			.setName('Configure automatically')
			.setDesc('Automatically configure all installed plugins')
			.addButton(button => button
				.setButtonText('Configure automatically')
				.setCta()
				.onClick(async () => {
					// Create configuration based on current content organization choice
					const contentOrg = settings.contentOrganization;
					const config: PluginConfiguration = {
						obsidianSettings: {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							attachmentLocation: (contentOrg === 'file-based' ? 'subfolder' : 'same-folder') as 'subfolder' | 'same-folder',
							subfolderName: 'attachments'
						},
						astroComposerSettings: {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							creationMode: (contentOrg === 'file-based' ? 'file' : 'folder') as 'file' | 'folder',
							indexFileName: 'index'
						},
						imageManagerSettings: {
							customPropertyLinkFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]'
						}
					};

					const success = await (this.plugin as AstroModularPlugin).pluginManager.configurePlugins(config);
					if (success) {
						// Reload plugin status to reflect changes
						const updatedStatus = (this.plugin as AstroModularPlugin).pluginManager.getPluginStatus(settings.contentOrganization);
						
						// Re-render the status display
						pluginStatusDiv.empty();
						for (const plugin of updatedStatus) {
							const isSettingsCheck = plugin.name === 'Attachment settings';
							const isConfigured = plugin.installed;
							const hasSyncIssues = plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length > 0;
							const allOutOfSync = hasSyncIssues && plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length === 4;
							const isPartiallyConfigured = hasSyncIssues && !allOutOfSync && plugin.installed && plugin.enabled;
							const allMismatched = allOutOfSync && plugin.installed && plugin.enabled;
							const isImageManager = plugin.name === 'Image Manager';
							const imageManagerMismatch = isImageManager && plugin.installed && plugin.enabled && plugin.settingsMatch === false;
							
							let itemClass = 'plugin-item';
							if (isSettingsCheck) {
								itemClass += isConfigured ? ' installed' : ' missing';
							} else if (imageManagerMismatch || allMismatched) {
								itemClass += ' missing';
							} else if (isPartiallyConfigured) {
								itemClass += ' partially-configured';
							} else {
								itemClass += (plugin.installed && plugin.enabled) ? ' installed' : ' missing';
							}
							
							const pluginItem = pluginStatusDiv.createDiv(itemClass);
							const icon = pluginItem.createDiv('plugin-icon');
							
							if (isSettingsCheck) {
								setIcon(icon, isConfigured ? 'check' : 'x');
							} else if (imageManagerMismatch || allMismatched) {
								setIcon(icon, 'x');
							} else if (isPartiallyConfigured) {
								setIcon(icon, 'alert-triangle');
							} else {
								setIcon(icon, (plugin.installed && plugin.enabled) ? 'check' : 'x');
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
							} else if (imageManagerMismatch || allMismatched) {
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
							
							if (hasSyncIssues && plugin.outOfSyncContentTypes) {
								const detailsP = info.createEl('p', { 
									text: `Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}`,
									cls: 'sync-details'
								});
								detailsP.setCssProps({
									fontSize: '0.9em',
									opacity: '0.8',
									marginTop: '4px'
								});
							}
						}
						
						// Show detailed success message
						const contentOrg = settings.contentOrganization;
						const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
						const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
						
						new Notice(`Plugins configured successfully!\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Manager: Format updated for ${contentOrg}`, 8000);
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
				.onClick(() => {
					// Create configuration based on current content organization choice
					const contentOrg = settings.contentOrganization;
					const config: PluginConfiguration = {
						obsidianSettings: {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							attachmentLocation: (contentOrg === 'file-based' ? 'subfolder' : 'same-folder') as 'subfolder' | 'same-folder',
							subfolderName: 'attachments'
						},
						astroComposerSettings: {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							creationMode: (contentOrg === 'file-based' ? 'file' : 'folder') as 'file' | 'folder',
							indexFileName: 'index'
						},
						imageManagerSettings: {
							customPropertyLinkFormat: contentOrg === 'file-based' 
								? '[[attachments/{image-url}]]' 
								: '[[{image-url}]]'
						}
					};

					const instructions = (this.plugin as AstroModularPlugin).pluginManager.getManualConfigurationInstructions(config);
					
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

}