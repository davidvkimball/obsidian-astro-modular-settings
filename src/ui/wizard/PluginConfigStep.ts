import { BaseWizardStep } from './BaseWizardStep';
import { Notice } from 'obsidian';

export class PluginConfigStep extends BaseWizardStep {
	async render(container: HTMLElement): Promise<void> {
		const state = this.getState();
		
		// Get plugin status
		const pluginStatus = await (this.plugin as any).pluginManager.getPluginStatus();
		
		container.innerHTML = `
			<div class="plugin-config">
				<h2>Plugin configuration</h2>
				<p>Configure your Obsidian plugins for optimal integration.</p>
				
				<div class="plugin-status">
      ${pluginStatus.map((plugin: any) => `
						<div class="plugin-item ${plugin.installed ? 'installed' : 'missing'}">
							<div class="plugin-icon">
								${plugin.installed 
									? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
									: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
								}
							</div>
							<div class="plugin-info">
								<h3>${plugin.name}</h3>
								<p>${plugin.installed ? (plugin.enabled ? 'Enabled' : 'Disabled') : 'Not installed'}</p>
							</div>
						</div>
					`).join('')}
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
