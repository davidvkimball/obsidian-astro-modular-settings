import { Setting, Notice, Modal } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class SiteInfoTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

		// Site URL
		this.createTextSetting(
			container,
			'Site URL',
			'Your site\'s base URL (e.g., https://yoursite.com)',
			settings.siteInfo.site,
			(value) => {
				settings.siteInfo.site = value;
			}
		);

		// Site Title
		this.createTextSetting(
			container,
			'Site Title',
			'Your site\'s title',
			settings.siteInfo.title,
			(value) => {
				settings.siteInfo.title = value;
			}
		);

		// Site Description
		this.createTextSetting(
			container,
			'Site Description',
			'A brief description of your site',
			settings.siteInfo.description,
			(value) => {
				settings.siteInfo.description = value;
			}
		);

		// Author Name
		this.createTextSetting(
			container,
			'Author Name',
			'Your name or the site author\'s name',
			settings.siteInfo.author,
			(value) => {
				settings.siteInfo.author = value;
			}
		);

		// Language
		this.createTextSetting(
			container,
			'Language',
			'Your site\'s primary language (ISO 639-1 code)',
			settings.siteInfo.language,
			(value) => {
				settings.siteInfo.language = value;
			}
		);

		// ═══════════════════════════════════════════════════════════════════
		// ASSETS & METADATA
		// ═══════════════════════════════════════════════════════════════════
		const assetsSection = container.createDiv('settings-section');
		assetsSection.style.marginTop = '30px';
		assetsSection.style.paddingTop = '20px';
		assetsSection.style.borderTop = '2px solid var(--background-modifier-border)';
		const assetsHeader = assetsSection.createDiv();
		assetsHeader.style.display = 'flex';
		assetsHeader.style.alignItems = 'center';
		assetsHeader.style.justifyContent = 'space-between';
		assetsHeader.style.gap = '10px';
		assetsHeader.style.marginBottom = '20px';
		assetsHeader.createEl('h3', { text: 'Assets & Metadata' });
		
		// Shared folder button for opening public folder
		const sharedFolderButton = assetsHeader.createEl('button', {
			cls: 'clickable-icon',
			attr: { 'aria-label': 'Open public folder' }
		});
		sharedFolderButton.style.marginLeft = 'auto';
		sharedFolderButton.style.padding = '4px';
		sharedFolderButton.style.border = 'none';
		sharedFolderButton.style.backgroundColor = 'transparent';
		sharedFolderButton.style.color = 'var(--text-normal)';
		sharedFolderButton.style.display = 'flex';
		sharedFolderButton.style.alignItems = 'center';
		sharedFolderButton.style.justifyContent = 'center';
		
		const sharedFolderIcon = sharedFolderButton.createDiv();
		sharedFolderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
		
		sharedFolderButton.addEventListener('click', async () => {
			try {
				// Use relative path like StyleTab does for themes folder
				const publicPath = '../../public';
				await (this.app as any).openWithDefaultApp(publicPath);
			} catch (error) {
				new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
			}
		});

		// Helper function to copy file to public folder
		const copyImageToPublic = async (sourcePath: string, targetFileName: string): Promise<void> => {
			try {
				const fs = require('fs');
				const path = require('path');
				
				// Get vault path
				const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
				const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
				
				// Public folder path (two levels up from vault, then into public)
				const publicFolderPath = path.join(vaultPathString, '..', '..', 'public');
				const targetPath = path.join(publicFolderPath, targetFileName);
				
				// Ensure public folder exists
				if (!fs.existsSync(publicFolderPath)) {
					fs.mkdirSync(publicFolderPath, { recursive: true });
				}
				
				// Copy file
				fs.copyFileSync(sourcePath, targetPath);
				new Notice(`Successfully copied ${targetFileName} to public folder`);
			} catch (error) {
				throw new Error(`Failed to copy file: ${error instanceof Error ? error.message : String(error)}`);
			}
		};

		// Helper function to show file picker dialog
		const showFilePicker = async (targetFileName: string): Promise<void> => {
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = '.png';
			
			// Store file reference outside the event handler
			let selectedFile: File | null = null;
			
			fileInput.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					if (!file.name.toLowerCase().endsWith('.png')) {
						new Notice('Please select a PNG file');
						return;
					}
					
					// Store the file reference
					selectedFile = file;
					
					// Show confirmation modal before copying
					// Use setTimeout to ensure file picker dialog has closed
					setTimeout(() => {
						const confirmModal = new Modal(this.app);
						confirmModal.titleEl.setText('Replace Image');
						
						const contentDiv = confirmModal.contentEl.createDiv();
						contentDiv.createEl('p', { 
							text: `Are you sure you want to replace ${targetFileName} in the public folder with the new image?` 
						});
						
						const buttonContainer = contentDiv.createDiv();
						buttonContainer.style.marginTop = '20px';
						buttonContainer.style.display = 'flex';
						buttonContainer.style.gap = '10px';
						buttonContainer.style.justifyContent = 'flex-end';
						
						// Cancel button
						const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
						cancelButton.className = 'mod-button';
						cancelButton.addEventListener('click', () => {
							confirmModal.close();
						});
						
						// Confirm button
						const confirmButton = buttonContainer.createEl('button', { text: 'Replace' });
						confirmButton.className = 'mod-warning';
						confirmButton.addEventListener('click', async () => {
							confirmModal.close();
							
							if (!selectedFile) {
								new Notice('File selection was lost. Please try again.');
								return;
							}
							
							try {
								const fs = require('fs');
								const path = require('path');
								
								// Try to get path from file object (works in Electron)
								const filePath = (selectedFile as any).path;
								if (filePath) {
									await copyImageToPublic(filePath, targetFileName);
								} else {
									// If no path, read file content and write it
									const arrayBuffer = await selectedFile.arrayBuffer();
									const buffer = Buffer.from(arrayBuffer);
									
									const vaultPath = (this.app.vault.adapter as any).basePath || (this.app.vault.adapter as any).path;
									const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
									const publicFolderPath = path.join(vaultPathString, '..', '..', 'public');
									const targetPath = path.join(publicFolderPath, targetFileName);
									
									if (!fs.existsSync(publicFolderPath)) {
										fs.mkdirSync(publicFolderPath, { recursive: true });
									}
									
									fs.writeFileSync(targetPath, buffer);
									new Notice(`Successfully copied ${targetFileName} to public folder`);
								}
							} catch (err) {
								new Notice(`Failed to copy file: ${err instanceof Error ? err.message : String(err)}`);
							}
						});
						
						// Open the modal
						confirmModal.open();
					}, 100);
				}
			};
			
			fileInput.click();
		};

		// Open Graph Image
		const ogImageSetting = new Setting(assetsSection)
			.setName('Open Graph image')
			.setDesc('Select a PNG image to replace open-graph.png in the public folder (recommended: 1200 x 630 pixels)');
		
		const ogImageButton = ogImageSetting.controlEl.createEl('button', {
			text: 'Select PNG file',
			cls: 'mod-cta'
		});
		
		ogImageButton.addEventListener('click', async () => {
			await showFilePicker('open-graph.png');
		});

		// Open Graph Image Alt Text
		this.createTextSetting(
			assetsSection,
			'Open Graph image alt text',
			'Alternative text for the Open Graph image',
			settings.siteInfo.defaultOgImageAlt || settings.seo?.defaultOgImageAlt || 'Astro Modular logo.',
			(value) => {
				settings.siteInfo.defaultOgImageAlt = value;
				// Also update seo for backwards compatibility
				if (!settings.seo) {
					settings.seo = { defaultOgImageAlt: '' };
				}
				settings.seo.defaultOgImageAlt = value;
			},
			1000,
			async () => {
				await this.applyCurrentConfiguration();
				new Notice('Open Graph image alt text updated and applied to config.ts');
			}
		);

		// Favicon (always visible - used as fallback when theme-adaptive is enabled)
		const faviconSetting = new Setting(assetsSection)
			.setName('Favicon')
			.setDesc('Select a PNG image to replace favicon.png in the public folder (recommended: 256 x 256 pixels). Standard favicon is used when browser preference cannot be determined.');
		
		const faviconButton = faviconSetting.controlEl.createEl('button', {
			text: 'Select PNG file',
			cls: 'mod-cta'
		});
		
		faviconButton.addEventListener('click', async () => {
			await showFilePicker('favicon.png');
		});

		// Theme-adaptive favicon toggle
		const faviconAdaptiveSetting = new Setting(assetsSection)
			.setName('Theme-adaptive favicon')
			.setDesc('If enabled, favicon switches between light and dark variants based on browser theme preference. Standard favicon is used when browser\'s preference cannot be determined.')
			.addToggle(toggle => toggle
				.setValue(settings.siteInfo.faviconThemeAdaptive ?? true)
				.onChange(async (value) => {
					settings.siteInfo.faviconThemeAdaptive = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure we have the latest values before rendering
					await (this.plugin as any).loadSettings();
					await this.applyCurrentConfiguration();
					// Re-render to show/hide light/dark favicon fields
					this.render(container);
					new Notice(`Theme-adaptive favicon ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Light/Dark favicon fields (only shown when theme-adaptive is enabled)
		if (settings.siteInfo.faviconThemeAdaptive ?? true) {
			// Light theme favicon
			const faviconLightSetting = new Setting(assetsSection)
				.setName('Light theme favicon')
				.setDesc('Select a PNG image to replace favicon-light.png in the public folder (recommended: 256 x 256 pixels)');
			
			const faviconLightButton = faviconLightSetting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			faviconLightButton.addEventListener('click', async () => {
				await showFilePicker('favicon-light.png');
			});

			// Dark theme favicon
			const faviconDarkSetting = new Setting(assetsSection)
				.setName('Dark theme favicon')
				.setDesc('Select a PNG image to replace favicon-dark.png in the public folder (recommended: 256 x 256 pixels)');
			
			const faviconDarkButton = faviconDarkSetting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			faviconDarkButton.addEventListener('click', async () => {
				await showFilePicker('favicon-dark.png');
			});
		}
	}
}
