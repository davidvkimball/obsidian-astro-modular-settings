import { Setting, Notice, Modal, setIcon } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { AstroModularPlugin, ObsidianVaultAdapter } from '../../types';
// Buffer is available in Node.js environment
// Buffer is available in Node.js environment
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const Buffer = require('buffer').Buffer;

export class SiteInfoTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

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
		assetsSection.setCssProps({
			marginTop: '30px',
			paddingTop: '20px',
			borderTop: '2px solid var(--background-modifier-border)'
		});
		// Assets & Metadata heading
		new Setting(assetsSection)
			.setHeading()
			.setName('Assets & metadata');
		
		// Shared folder button container
		const assetsHeader = assetsSection.createDiv();
		assetsHeader.setCssProps({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '10px',
			marginBottom: '20px'
		});
		
		// Shared folder button for opening public folder
		const sharedFolderButton = assetsHeader.createEl('button', {
			cls: 'clickable-icon',
			attr: { 'aria-label': 'Open public folder' }
		});
		sharedFolderButton.setCssProps({
			marginLeft: 'auto',
			padding: '4px',
			border: 'none',
			backgroundColor: 'transparent',
			color: 'var(--text-normal)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		});
		
		// Use setIcon for folder icon (Obsidian API)
		setIcon(sharedFolderButton, 'folder');
		
		sharedFolderButton.addEventListener('click', () => {
			// Use relative path like StyleTab does for themes folder
			const publicPath = '../../public';
			// openWithDefaultApp is not available in Obsidian's App interface, but may exist in Electron
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
			void ((this.app as any).openWithDefaultApp?.(publicPath) ?? Promise.resolve()).catch((error: unknown) => {
				new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
			});
		});

		// Helper function to copy file to public folder
		const copyImageToPublic = async (sourcePath: string, targetFileName: string): Promise<void> => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
				const fs = require('fs') as typeof import('fs');
				// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
				const path = require('path') as typeof import('path');
				
				// Get vault path
				const vaultAdapter = this.app.vault.adapter as unknown as ObsidianVaultAdapter;
				const vaultPath = vaultAdapter.basePath || vaultAdapter.path;
				const vaultPathString = typeof vaultPath === 'string' ? vaultPath : String(vaultPath ?? '');
				
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
						confirmModal.titleEl.setText('Replace image');
						
						const contentDiv = confirmModal.contentEl.createDiv();
						contentDiv.createEl('p', { 
							text: `Are you sure you want to replace ${targetFileName} in the public folder with the new image?` 
						});
						
						const buttonContainer = contentDiv.createDiv();
						buttonContainer.setCssProps({
							marginTop: '20px',
							display: 'flex',
							gap: '10px',
							justifyContent: 'flex-end'
						});
						
						// Cancel button
						const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
						cancelButton.className = 'mod-button';
						cancelButton.addEventListener('click', () => {
							confirmModal.close();
						});
						
						// Confirm button
						const confirmButton = buttonContainer.createEl('button', { text: 'Replace' });
						confirmButton.className = 'mod-warning';
						confirmButton.addEventListener('click', () => {
							confirmModal.close();
							
							if (!selectedFile) {
								new Notice('File selection was lost. Please try again.');
								return;
							}
							
							void (async () => {
								try {
									// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
									const fs = require('fs') as typeof import('fs');
									// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
									const path = require('path') as typeof import('path');
									
									// Try to get path from file object (works in Electron)
									// Note: TFile doesn't have a path property in Obsidian API, but some implementations may have it
									const filePath = (selectedFile as unknown as { path?: string }).path;
									if (filePath) {
										await copyImageToPublic(filePath, targetFileName);
									} else {
										// If no path, read file content and write it
										const arrayBuffer = await selectedFile.arrayBuffer();
										// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
										const buffer = Buffer.from(arrayBuffer);
										
										const vaultAdapter = this.app.vault.adapter as unknown as ObsidianVaultAdapter;
										const vaultPath = vaultAdapter.basePath || vaultAdapter.path;
										const vaultPathString = typeof vaultPath === 'string' ? vaultPath : String(vaultPath ?? '');
										const publicFolderPath = path.join(vaultPathString, '..', '..', 'public');
										const targetPath = path.join(publicFolderPath, targetFileName);
										
										if (!fs.existsSync(publicFolderPath)) {
											fs.mkdirSync(publicFolderPath, { recursive: true });
										}
										
										// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
										fs.writeFileSync(targetPath, buffer);
										new Notice(`Successfully copied ${targetFileName} to public folder`);
									}
								} catch (err) {
									new Notice(`Failed to copy file: ${err instanceof Error ? err.message : String(err)}`);
								}
							})();
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
			.setName('Open graph image')
			// False positive: "PNG" is an acronym and should be uppercase
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Select a PNG image to replace open-graph.png in the public folder (recommended: 1200 x 630 pixels)');
		
		const ogImageButton = ogImageSetting.controlEl.createEl('button', {
			text: 'Select PNG file',
			cls: 'mod-cta'
		});
		
		ogImageButton.addEventListener('click', () => {
			void showFilePicker('open-graph.png');
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
				// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				new Notice('Open Graph image alt text updated and applied to config.ts');
			}
		);

		// Favicon (always visible - used as fallback when theme-adaptive is enabled)
		const faviconSetting = new Setting(assetsSection)
			.setName('Favicon') // Already sentence case
			// False positive: "PNG" is an acronym and should be uppercase
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Select a PNG image to replace favicon.png in the public folder (recommended: 256 x 256 pixels). Standard favicon is used when browser preference cannot be determined.');
		
		const faviconButton = faviconSetting.controlEl.createEl('button', {
			text: 'Select PNG file',
			cls: 'mod-cta'
		});
		
		faviconButton.addEventListener('click', () => {
			void showFilePicker('favicon.png');
		});

		// Theme-adaptive favicon toggle
		new Setting(assetsSection)
			.setName('Theme-adaptive favicon')
			.setDesc('If enabled, favicon switches between light and dark variants based on browser theme preference. Standard favicon is used when browser\'s preference cannot be determined.')
			.addToggle(toggle => toggle
				.setValue(settings.siteInfo.faviconThemeAdaptive ?? true)
				.onChange(async (value) => {
					settings.siteInfo.faviconThemeAdaptive = value;
					await this.plugin.saveData(settings);
					// Reload settings to ensure we have the latest values before rendering
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration();
					// Re-render to show/hide light/dark favicon fields
					this.render(container);
					new Notice(`Theme-adaptive favicon ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Light/Dark favicon fields (only shown when theme-adaptive is enabled)
		if (settings.siteInfo.faviconThemeAdaptive ?? true) {
			// Light theme favicon
			const faviconLightSetting = new Setting(assetsSection)
				.setName('Light theme favicon') // Already sentence case
				// False positive: "PNG" is an acronym and should be uppercase
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Select a PNG image to replace favicon-light.png in the public folder (recommended: 256 x 256 pixels)');
			
			const faviconLightButton = faviconLightSetting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			faviconLightButton.addEventListener('click', () => {
				void showFilePicker('favicon-light.png');
			});

			// Dark theme favicon
			const faviconDarkSetting = new Setting(assetsSection)
				.setName('Dark theme favicon') // Already sentence case
				// False positive: "PNG" is an acronym and should be uppercase
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Select a PNG image to replace favicon-dark.png in the public folder (recommended: 256 x 256 pixels)');
			
			const faviconDarkButton = faviconDarkSetting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			faviconDarkButton.addEventListener('click', () => {
				void showFilePicker('favicon-dark.png');
			});
		}
	}
}
