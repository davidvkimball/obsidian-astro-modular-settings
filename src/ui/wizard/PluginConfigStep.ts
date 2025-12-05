import { BaseWizardStep } from './BaseWizardStep';
import { Notice } from 'obsidian';

export class PluginConfigStep extends BaseWizardStep {
	async render(container: HTMLElement): Promise<void> {
		const state = this.getState();
		
		// Get plugin status (pass content org from wizard state)
		const contentOrg = state.selectedContentOrg;
		const pluginStatus = await (this.plugin as any).pluginManager.getPluginStatus(contentOrg);
		
		container.innerHTML = `
			<div class="plugin-config">
				<h2>Plugin configuration</h2>
				<p>Configure your Obsidian plugins for optimal integration.</p>
				
				<div class="plugin-status">
      ${pluginStatus.map((plugin: any) => {
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
						
						// Determine icon
						let iconSvg: string;
						if (isSettingsCheck) {
							iconSvg = isConfigured 
								? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
								: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
						} else if (imageInserterMismatch || allMismatched) {
							// Image Inserter settings don't match or all content types are out of sync - show red X
							iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
						} else if (isPartiallyConfigured) {
							iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
						} else {
							iconSvg = (plugin.installed && plugin.enabled)
								? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
								: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
						}
						
						return `
						<div class="${itemClass}">
							<div class="plugin-icon">
								${iconSvg}
							</div>
							<div class="plugin-info">
								<h3>${plugin.name}</h3>
								<p>${statusText}</p>
								${hasSyncIssues && plugin.outOfSyncContentTypes ? `<p style="font-size: 0.9em; opacity: 0.8; margin-top: 4px;">Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}</p>` : ''}
							</div>
						</div>
					`;
					}).join('')}
				</div>
				
				<div class="config-options">
					<button class="mod-button mod-cta" id="configure-plugins">Configure Automatically</button>
					<button class="mod-button" id="show-instructions">Show Manual Instructions</button>
				</div>
			</div>
		`;

		this.setupEventHandlers(container);
	}

	private setupEventHandlers(container: HTMLElement): void {
		const state = this.getState();

		// Configure automatically button
		container.querySelector('#configure-plugins')?.addEventListener('click', async () => {
			try {
				// Create configuration based on current content organization choice
				const contentOrg = state.selectedContentOrg;
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
					const updatedStatus = await (this.plugin as any).pluginManager.getPluginStatus(state.selectedContentOrg);
					
					// Re-render the status display
					const statusContainer = container.querySelector('.plugin-status');
					if (statusContainer) {
						statusContainer.innerHTML = updatedStatus.map((plugin: any) => {
							const isSettingsCheck = plugin.name === 'Attachment settings';
							const isConfigured = plugin.installed;
							const hasSyncIssues = plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length > 0;
							const allOutOfSync = hasSyncIssues && plugin.outOfSyncContentTypes && plugin.outOfSyncContentTypes.length === 4;
							const isPartiallyConfigured = hasSyncIssues && !allOutOfSync && plugin.installed && plugin.enabled;
							const allMismatched = allOutOfSync && plugin.installed && plugin.enabled;
							const isImageInserter = plugin.name === 'Image Inserter';
							const imageInserterMismatch = isImageInserter && plugin.installed && plugin.enabled && plugin.settingsMatch === false;
							
							// Determine if plugin is properly configured (not just enabled)
							const isProperlyConfigured = plugin.installed && plugin.enabled && 
								!imageInserterMismatch && !allMismatched && !isPartiallyConfigured;
							
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
							
							let iconSvg: string;
							if (isSettingsCheck) {
								iconSvg = isConfigured 
									? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
									: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
							} else if (imageInserterMismatch || allMismatched) {
								iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
							} else if (isPartiallyConfigured) {
								iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
							} else {
								iconSvg = (plugin.installed && plugin.enabled)
									? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
									: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
							}
							
							return `
								<div class="${itemClass}">
									<div class="plugin-icon">
										${iconSvg}
									</div>
									<div class="plugin-info">
										<h3>${plugin.name}</h3>
										<p>${statusText}</p>
										${hasSyncIssues && plugin.outOfSyncContentTypes ? `<p style="font-size: 0.9em; opacity: 0.8; margin-top: 4px;">Out of sync: ${plugin.outOfSyncContentTypes.join(', ')}</p>` : ''}
									</div>
								</div>
							`;
						}).join('');
					}
					
					// Show detailed success message
					const contentOrg = state.selectedContentOrg;
					const attachmentLocation = contentOrg === 'file-based' ? 'subfolder (attachments/)' : 'same folder';
					const creationMode = contentOrg === 'file-based' ? 'file' : 'folder';
					
					new Notice(`Plugins configured successfully!\n\n• Obsidian: Attachments → ${attachmentLocation}\n• Astro Composer: Creation mode → ${creationMode}\n• Image Inserter: Format updated for ${contentOrg}`, 8000);
				} else {
					new Notice('⚠️ Some plugins could not be configured automatically. Check console for details.', 5000);
				}
			} catch (error) {
				new Notice(`Error configuring plugins: ${error instanceof Error ? error.message : String(error)}`);
			}
		});

		// Show manual instructions button
		container.querySelector('#show-instructions')?.addEventListener('click', async () => {
			try {
				// Create configuration based on current content organization choice
				const contentOrg = state.selectedContentOrg;
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
				const { Modal } = require('obsidian');
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
								if (currentList) {
									currentList.style.marginLeft = '20px';
									currentList.style.marginBottom = '15px';
								}
							}
							if (currentList) {
								const li = currentList.createEl('li');
								li.style.marginBottom = '5px';
								// Parse bold text in the line
								this.parseBoldText(li, trimmedLine.replace(/^\d+\.\s/, ''));
							}
						} else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
							// Bullet list item
							if (!currentList) {
								currentList = contentDiv.createEl('ul');
								if (currentList) {
									currentList.style.marginLeft = '20px';
									currentList.style.marginBottom = '15px';
								}
							}
							if (currentList) {
								const li = currentList.createEl('li');
								li.style.marginBottom = '5px';
								// Parse bold text in the line
								this.parseBoldText(li, trimmedLine.substring(2));
							}
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
			} catch (error) {
				new Notice(`Error getting instructions: ${error instanceof Error ? error.message : String(error)}`);
			}
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
