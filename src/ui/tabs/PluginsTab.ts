import { Setting, Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class PluginsTab extends TabRenderer {
	async render(container: HTMLElement): Promise<void> {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Get plugin status
		const contentOrg = settings.contentOrganization;
		const pluginStatus = await (this.plugin as any).pluginManager.getPluginStatus(contentOrg);

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
				itemClass += isConfigured && plugin.enabled ? ' installed' : ' missing';
			}
			
			const pluginItem = pluginStatusDiv.createDiv(itemClass);
			const icon = pluginItem.createDiv('plugin-icon');
			
			// Set icon based on status
			if (isSettingsCheck) {
				icon.innerHTML = isConfigured 
					? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
					: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
			} else if (imageInserterMismatch || allMismatched) {
				// Image Inserter settings don't match or all content types are out of sync - show red X
				icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
			} else if (isPartiallyConfigured) {
				// Alert triangle icon (neutral warning icon from Lucide)
				icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
			} else {
				icon.innerHTML = isConfigured && plugin.enabled
					? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
					: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
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
			
			const statusP = info.createEl('p', { text: statusText });
			
			// Add details about out-of-sync content types
			if (hasSyncIssues && plugin.outOfSyncContentTypes) {
				const detailsP = info.createEl('p', { 
					text: `Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}`,
					cls: 'sync-details'
				});
				detailsP.style.fontSize = '0.9em';
				detailsP.style.opacity = '0.8';
				detailsP.style.marginTop = '4px';
			}
		}

		// Configure automatically button
		new Setting(container)
			.setName('Configure automatically')
			.setDesc('Automatically configure all installed plugins')
			.addButton(button => button
				.setButtonText('Configure Automatically')
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

					const success = await (this.plugin as any).pluginManager.configurePlugins(config);
					if (success) {
						// Reload plugin status to reflect changes
						const updatedStatus = await (this.plugin as any).pluginManager.getPluginStatus(settings.contentOrganization);
						
						// Re-render the status display
						pluginStatusDiv.empty();
						for (const plugin of updatedStatus) {
							const isSettingsCheck = plugin.name === 'Attachment settings';
							const isConfigured = plugin.installed;
							const hasSyncIssues = plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length > 0;
							const allOutOfSync = hasSyncIssues && plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length === 4;
							const isPartiallyConfigured = hasSyncIssues && !allOutOfSync && plugin.installed && plugin.enabled;
							const allMismatched = allOutOfSync && plugin.installed && plugin.enabled;
							const isImageInserter = plugin.name === 'Image Inserter';
							const imageInserterMismatch = isImageInserter && plugin.installed && plugin.enabled && plugin.settingsMatch === false;
							
							let itemClass = 'plugin-item';
							if (isSettingsCheck) {
								itemClass += isConfigured ? ' installed' : ' missing';
							} else if (imageInserterMismatch || allMismatched) {
								itemClass += ' missing';
							} else if (isPartiallyConfigured) {
								itemClass += ' partially-configured';
							} else {
								itemClass += (plugin.installed && plugin.enabled) ? ' installed' : ' missing';
							}
							
							const pluginItem = pluginStatusDiv.createDiv(itemClass);
							const icon = pluginItem.createDiv('plugin-icon');
							
							if (isSettingsCheck) {
								icon.innerHTML = isConfigured 
									? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
									: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
							} else if (imageInserterMismatch || allMismatched) {
								icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
							} else if (isPartiallyConfigured) {
								icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
							} else {
								icon.innerHTML = (plugin.installed && plugin.enabled)
									? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
									: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
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
							
							if (hasSyncIssues && plugin.outOfSyncContentTypes) {
								const detailsP = info.createEl('p', { 
									text: `Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}`,
									cls: 'sync-details'
								});
								detailsP.style.fontSize = '0.9em';
								detailsP.style.opacity = '0.8';
								detailsP.style.marginTop = '4px';
							}
						}
						
						// Show detailed success message
						const contentOrg = settings.contentOrganization;
						const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
						const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
						
						new Notice(`Plugins configured successfully!\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated for ${contentOrg}`, 8000);
					} else {
						new Notice('⚠️ Some plugins could not be configured automatically. Check console for details.', 5000);
					}
				}));

		// Show manual instructions button
		new Setting(container)
			.setName('Show manual instructions')
			.setDesc('Get step-by-step instructions for manual configuration')
			.addButton(button => button
				.setButtonText('Show Manual Instructions')
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

					const instructions = await (this.plugin as any).pluginManager.getManualConfigurationInstructions(config);
					
					// Create a modal to show instructions
					const instructionModal = new Modal(this.app);
					instructionModal.titleEl.setText('Manual Configuration Instructions');
					
					// Create a container for the instructions
					const contentDiv = instructionModal.contentEl.createDiv();
					contentDiv.style.padding = '20px';
					contentDiv.style.lineHeight = '1.6';
					
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
							h2.style.marginTop = '20px';
							h2.style.marginBottom = '10px';
							h2.style.fontSize = '1.2em';
							h2.style.fontWeight = 'bold';
						} else if (trimmedLine.match(/^\d+\.\s/)) {
							// Numbered list item
							if (!currentList) {
								currentList = contentDiv.createEl('ol');
								currentList.style.marginLeft = '20px';
								currentList.style.marginBottom = '15px';
							}
							const li = currentList!.createEl('li');
							li.style.marginBottom = '5px';
							// Parse bold text in the line
							this.parseBoldText(li, trimmedLine.replace(/^\d+\.\s/, ''));
						} else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
							// Bullet list item
							if (!currentList) {
								currentList = contentDiv.createEl('ul');
								currentList.style.marginLeft = '20px';
								currentList.style.marginBottom = '15px';
							}
							const li = currentList!.createEl('li');
							li.style.marginBottom = '5px';
							// Parse bold text in the line
							this.parseBoldText(li, trimmedLine.substring(2));
						} else {
							// Regular paragraph
							if (currentList) {
								currentList = null; // End current list
							}
							const p = contentDiv.createEl('p');
							p.style.marginBottom = '10px';
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