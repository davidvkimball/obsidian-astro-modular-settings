import { Notice, Modal, setIcon } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { AstroModularPlugin, ObsidianVaultAdapter } from '../../types';
import { createSettingsGroup } from '../../utils/settings-compat';
// Buffer is available in Node.js environment
// Buffer is available in Node.js environment
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const Buffer = require('buffer').Buffer;

export class SiteInfoTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// First group: Group initial settings with no heading
		const siteInfoGroup = createSettingsGroup(container);

		// Site URL
		siteInfoGroup.addSetting((setting) => {
			setting
				.setName('Site URL')
				.setDesc('Your site\'s base URL (e.g., https://yoursite.com)')
				.addText(text => {
					text.setValue(settings.siteInfo.site);
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.site = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Site Title
		siteInfoGroup.addSetting((setting) => {
			setting
				.setName('Site title')
				.setDesc('Your site\'s title')
				.addText(text => {
					text.setValue(settings.siteInfo.title);
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.title = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Site Description
		siteInfoGroup.addSetting((setting) => {
			setting
				.setName('Site description')
				.setDesc('A brief description of your site')
				.addText(text => {
					text.setValue(settings.siteInfo.description);
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.description = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Author Name
		siteInfoGroup.addSetting((setting) => {
			setting
				.setName('Author name')
				.setDesc('Your name or the site author\'s name')
				.addText(text => {
					text.setValue(settings.siteInfo.author);
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.author = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Language
		siteInfoGroup.addSetting((setting) => {
			setting
				.setName('Language code')
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Your site\'s primary language (ISO 639-1 code)')
				.addText(text => {
					text.setValue(settings.siteInfo.language);
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.language = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration();
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration();
						}
					});
				});
		});

		// Assets & Metadata group with heading
		const assetsGroup = createSettingsGroup(container, 'Assets & metadata');

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

		// Shared folder button - add as a setting within the group
		assetsGroup.addSetting((setting) => {
			// Hide default UI elements and add custom button
			const nameEl = setting.settingEl.querySelector('.setting-item-name');
			const descEl = setting.settingEl.querySelector('.setting-item-description');
			const controlEl = setting.settingEl.querySelector('.setting-item-control');
			if (nameEl) (nameEl as HTMLElement).setCssProps({ display: 'none' });
			if (descEl) (descEl as HTMLElement).setCssProps({ display: 'none' });
			if (controlEl) (controlEl as HTMLElement).setCssProps({ display: 'none' });
			setting.settingEl.setCssProps({
				borderTop: 'none',
				paddingTop: '0',
				paddingBottom: '0'
			});
			
			const assetsHeader = setting.settingEl.createDiv();
			assetsHeader.setCssProps({
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: '10px',
				marginBottom: '20px'
			});
			
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
			
			setIcon(sharedFolderButton, 'folder');
			
			sharedFolderButton.addEventListener('click', () => {
				const publicPath = '../../public';
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
				void ((this.app as any).openWithDefaultApp?.(publicPath) ?? Promise.resolve()).catch((error: unknown) => {
					new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
				});
			});
		});

		// Open Graph Image
		assetsGroup.addSetting((setting) => {
			setting
				.setName('Open graph image')
				// False positive: "PNG" is an acronym and should be uppercase
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Select a PNG image to replace open-graph.png in the public folder (recommended: 1200 x 630 pixels)');
			
			const ogImageButton = setting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			ogImageButton.addEventListener('click', () => {
				void showFilePicker('open-graph.png');
			});
		});

		// Open Graph Image Alt Text
		assetsGroup.addSetting((setting) => {
			setting
				// False positive: "Open Graph" is a proper noun (OG format standard)
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setName('Open Graph image alt text')
				// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Alternative text for the Open Graph image')
				.addText(text => {
					text.setValue(settings.siteInfo.defaultOgImageAlt || settings.seo?.defaultOgImageAlt || 'Astro Modular logo.');
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						settings.siteInfo.defaultOgImageAlt = value;
						if (!settings.seo) {
							settings.seo = { defaultOgImageAlt: '' };
						}
						settings.seo.defaultOgImageAlt = value;
						void this.plugin.saveData(settings);
						timeoutId = window.setTimeout(() => {
							void this.applyCurrentConfiguration().then(() => {
								// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								new Notice('Open Graph image alt text updated and applied to config.ts');
							});
						}, 1000);
					});
					text.inputEl.addEventListener('blur', () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							void this.applyCurrentConfiguration().then(() => {
								// False positive: "Open Graph" is a technical term (OG image standard) and should be capitalized
								// eslint-disable-next-line obsidianmd/ui/sentence-case
								new Notice('Open Graph image alt text updated and applied to config.ts');
							});
						}
					});
				});
		});

		// Favicon (always visible - used as fallback when theme-adaptive is enabled)
		assetsGroup.addSetting((setting) => {
			setting
				.setName('Favicon')
				// False positive: "PNG" is an acronym and should be uppercase
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Select a PNG image to replace favicon.png in the public folder (recommended: 256 x 256 pixels). Standard favicon is used when browser preference cannot be determined.');
			
			const faviconButton = setting.controlEl.createEl('button', {
				text: 'Select PNG file',
				cls: 'mod-cta'
			});
			
			faviconButton.addEventListener('click', () => {
				void showFilePicker('favicon.png');
			});
		});

		// Theme-adaptive favicon toggle
		assetsGroup.addSetting((setting) => {
			setting
				.setName('Theme-adaptive favicon')
				.setDesc('If enabled, favicon switches between light and dark variants based on browser theme preference. Standard favicon is used when browser\'s preference cannot be determined.')
				.addToggle(toggle => toggle
					.setValue(settings.siteInfo.faviconThemeAdaptive ?? true)
					.onChange(async (value) => {
						settings.siteInfo.faviconThemeAdaptive = value;
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						this.render(container);
						new Notice(`Theme-adaptive favicon ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Light/Dark favicon fields (only shown when theme-adaptive is enabled)
		if (settings.siteInfo.faviconThemeAdaptive ?? true) {
			// Light theme favicon
			assetsGroup.addSetting((setting) => {
				setting
					.setName('Light theme favicon')
					// False positive: "PNG" is an acronym and should be uppercase
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setDesc('Select a PNG image to replace favicon-light.png in the public folder (recommended: 256 x 256 pixels)');
				
				const faviconLightButton = setting.controlEl.createEl('button', {
					text: 'Select PNG file',
					cls: 'mod-cta'
				});
				
				faviconLightButton.addEventListener('click', () => {
					void showFilePicker('favicon-light.png');
				});
			});

			// Dark theme favicon
			assetsGroup.addSetting((setting) => {
				setting
					.setName('Dark theme favicon')
					// False positive: "PNG" is an acronym and should be uppercase
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setDesc('Select a PNG image to replace favicon-dark.png in the public folder (recommended: 256 x 256 pixels)');
				
				const faviconDarkButton = setting.controlEl.createEl('button', {
					text: 'Select PNG file',
					cls: 'mod-cta'
				});
				
				faviconDarkButton.addEventListener('click', () => {
					void showFilePicker('favicon-dark.png');
				});
			});
		}
	}
}
