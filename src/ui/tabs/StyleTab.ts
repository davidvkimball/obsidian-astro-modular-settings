import { Notice, setIcon } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { THEME_OPTIONS, FONT_OPTIONS, AstroModularPlugin, ThemeType, AstroModularSettings, ColorScale } from '../../types';
import { ThemeColorExtractor } from '../../utils/ThemeColorExtractor';
import { createSettingsGroup } from '../../utils/settings-compat';

export class StyleTab extends TabRenderer {
	private mainContainer: HTMLElement | null = null;

	render(container: HTMLElement): void {
		container.empty();
		this.mainContainer = container; // Store reference to main container
		const settings = this.getSettings();

		// Colors group with heading
		const colorsGroup = createSettingsGroup(container, 'Colors');

		// Theme selector
		colorsGroup.addSetting((setting) => {
			setting
			.setName('Theme')
			.setDesc('Choose your color theme')
			.addDropdown(dropdown => {
				THEME_OPTIONS.forEach(theme => {
					dropdown.addOption(theme.id, theme.name);
				});
				dropdown.setValue(settings.currentTheme);
				dropdown.onChange((value) => {
					void (async () => {
						settings.currentTheme = value as ThemeType;
						await this.plugin.saveData(settings);
						// Reload settings to ensure the plugin has the latest values
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Re-render to show/hide custom theme file field
						this.render(container);
						
						// Apply only theme change to config.ts (not all settings)
						try {
							const success = await (this.plugin as AstroModularPlugin).configManager.updateThemeOnly(value);
							if (success) {
								new Notice(`Theme changed to ${value} and applied to config.ts`);
							} else {
								new Notice(`Failed to apply theme change to config.ts`);
							}
						} catch (error) {
							new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
						}
					})();
				});
			});
		});

		// Available themes customization
		colorsGroup.addSetting((setting) => {
			setting
				.setName('Customize available themes')
				.setDesc('Control which themes are shown to users in the theme selector')
				.addToggle(toggle => {
					const isCustomized = Array.isArray(settings.availableThemes);
					toggle.setValue(isCustomized);
					toggle.onChange((value) => {
						void (async () => {
							if (value) {
								// Enable customization - set to all themes except 'custom'
								const allThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom').map(theme => theme.id) as Array<Exclude<ThemeType, 'custom'>>;
								settings.availableThemes = allThemes;
							} else {
								// Disable customization - set to "default"
								settings.availableThemes = 'default';
							}
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Re-render to show/hide theme pills
							if (this.mainContainer) {
								this.render(this.mainContainer);
							}
							
							// Apply changes immediately to config.ts
							try {
								await this.applyCurrentConfiguration();
								new Notice(`Available themes ${value ? 'customized' : 'set to default'} and applied to config.ts`);
							} catch (error) {
								new Notice(`Failed to apply available themes change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Show theme pills when customization is enabled - add as custom setting within group
		if (Array.isArray(settings.availableThemes)) {
			colorsGroup.addSetting((setting) => {
				// Hide default UI elements
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
				
				const themePillsContainer = setting.settingEl.createDiv('theme-pills-container');
			themePillsContainer.setCssProps({
				marginTop: '10px',
				marginBottom: '20px'
			});
			
			const pillsHeader = themePillsContainer.createEl('p', { 
				text: 'Available themes (click to toggle selection):',
				cls: 'theme-pills-header'
			});
			pillsHeader.setCssProps({
				fontSize: '14px',
				marginBottom: '8px',
				color: 'var(--text-muted)'
			});
			
			const pillsWrapper = themePillsContainer.createDiv('theme-pills-wrapper');
			pillsWrapper.setCssProps({
				display: 'flex',
				flexWrap: 'wrap',
				gap: '8px'
			});
			
			// Show all themes (except custom) with selection state
			const allThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom');
			allThemes.forEach(theme => {
				const isSelected = (settings.availableThemes as string[]).includes(theme.id);
				
					const pill = pillsWrapper.createDiv('theme-pill');
					pill.addClass('theme-pill');
					
					// Style based on selection state
					if (isSelected) {
						pill.setCssProps({
							backgroundColor: 'var(--interactive-accent)',
							color: 'var(--text-on-accent)',
							border: '1px solid var(--interactive-accent)'
						});
					} else {
						pill.setCssProps({
							backgroundColor: 'var(--background-secondary)',
							color: 'var(--text-muted)',
							border: '1px solid var(--background-modifier-border)'
						});
					}
					
					pill.createSpan({ text: theme.name });
					
				// Add selection indicator
				const indicator = pill.createSpan({ text: isSelected ? '✓' : '○' });
				indicator.setCssProps({
					fontSize: '10px',
					opacity: '0.8'
				});
				
				pill.addEventListener('click', () => {
					void (async () => {
						const currentThemes = settings.availableThemes as string[];
						let newThemes: string[];
						
						if (isSelected) {
							// Remove theme from selection
							newThemes = currentThemes.filter((id: string) => id !== theme.id);
						} else {
							// Add theme to selection
							newThemes = [...currentThemes, theme.id];
						}
						
						settings.availableThemes = newThemes as Array<Exclude<ThemeType, 'custom'>>;
						await this.plugin.saveData(settings);
						// Reload settings to ensure the plugin has the latest values
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Re-render to update pills
						if (this.mainContainer) {
							this.render(this.mainContainer);
						}
						
						// Apply changes immediately to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice(`Theme "${theme.name}" ${isSelected ? 'removed from' : 'added to'} available themes`);
						} catch (error) {
							new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
						}
					})();
				});
			});
			
			// Add custom themes input field
			const customThemesSection = themePillsContainer.createDiv('custom-themes-section');
			customThemesSection.setCssProps({
				marginTop: '15px',
				padding: '10px',
				backgroundColor: 'var(--background-secondary)',
				borderRadius: '6px',
				border: '1px solid var(--background-modifier-border)'
			});
			
			const customThemesLabel = customThemesSection.createEl('label', { 
				text: 'Custom themes (comma-separated):',
				cls: 'custom-themes-label'
			});
			customThemesLabel.setCssProps({
				display: 'block',
				fontSize: '12px',
				color: 'var(--text-muted)',
				marginBottom: '6px'
			});
			
			// Create input container with folder button
			const inputContainer = customThemesSection.createDiv('custom-themes-input-container');
			inputContainer.setCssProps({
				display: 'flex',
				gap: '6px',
				alignItems: 'center'
			});
			
			const customThemesInput = inputContainer.createEl('input', {
				type: 'text',
				placeholder: 'custom,obsidinite',
				value: settings.customThemes || '',
				attr: {
					spellcheck: 'false'
				}
			});
			customThemesInput.setCssProps({
				flex: '1',
				padding: '6px 8px',
				border: '1px solid var(--background-modifier-border)',
				borderRadius: '4px',
				backgroundColor: 'var(--background-primary)',
				color: 'var(--text-normal)',
				fontSize: '12px'
			});
			
			// Add folder button
			const folderButton = inputContainer.createEl('button', {
				cls: 'clickable-icon',
				attr: {
					'aria-label': 'Open themes folder'
				}
			});
			folderButton.setCssProps({
				padding: '4px',
				border: 'none',
				backgroundColor: 'transparent',
				color: 'var(--text-normal)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginTop: '2px'
			});
			
			// Add folder icon using Obsidian's icon system
			const folderIcon = folderButton.createDiv();
			setIcon(folderIcon, 'folder');
			
			// Add click handler for folder button
			folderButton.addEventListener('click', () => {
				// Open file explorer to the themes/custom directory
				// Path: go up two levels from vault (src/content) to project root, then down to src/themes/custom
				const themesPath = '../../src/themes/custom';
				// openWithDefaultApp is not available in Obsidian's App interface, but may exist in Electron
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
				void ((this.app as any).openWithDefaultApp?.(themesPath) ?? Promise.resolve()).catch((error: unknown) => {
					new Notice(`Failed to open themes folder: ${error instanceof Error ? error.message : String(error)}`);
				});
			});
			
			// Use debounced input like other text fields
			let timeoutId: number | null = null;
			customThemesInput.addEventListener('input', () => {
				// Update the value immediately for UI responsiveness
				settings.customThemes = customThemesInput.value.trim();
				void this.plugin.saveData(settings).then(() => {
					return (this.plugin as AstroModularPlugin).loadSettings();
				});
				
				// Clear existing timeout
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				
				// Debounce the configuration application
				timeoutId = window.setTimeout(() => {
					void this.applyCurrentConfiguration().then(() => {
						new Notice('Custom themes updated and applied to config.ts');
					}).catch((error: unknown) => {
						new Notice(`Failed to apply custom themes: ${error instanceof Error ? error.message : String(error)}`);
					});
				}, 1000); // 1 second debounce
			});
		});

		// Custom Theme Section group with heading
		const customThemeGroup = createSettingsGroup(container, 'Custom theme generation');

		// Generate custom theme toggle
		customThemeGroup.addSetting((setting) => {
			setting
				.setName('Generate custom theme')
				.setDesc('Enable to extract colors from your Obsidian theme and generate custom theme files')
				.addToggle(toggle => {
				toggle.setValue(settings.customThemeGenerationEnabled || false);
				toggle.onChange((value) => {
					void (async () => {
						settings.customThemeGenerationEnabled = value;
						
						if (value) {
							// Initialize custom theme settings if they don't exist
							if (!settings.themeColors) {
								settings.themeColors = {
									mode: 'simple',
									extractedColors: undefined,
									simpleColors: {
										accent: '#5865f2',
										background: '#1e1e1e'
									},
									lastExtracted: undefined
								};
							}
						}
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						
						// Re-render to show/hide custom theme options
						this.render(container);
					})();
				});
			});
		});

		// Show custom theme options when enabled
		if (settings.customThemeGenerationEnabled) {
			// Theme file name input (always visible when custom theme generation is enabled)
			customThemeGroup.addSetting((setting) => {
				setting
					.setName('Custom theme file name')
					.setDesc('Filename for the generated theme file (without .ts extension)')
					.addText(text => {
						text.setValue(settings.customThemeFile || 'custom');
						let timeoutId: number | null = null;
						text.onChange((value) => {
							if (timeoutId) {
								clearTimeout(timeoutId);
							}
							settings.customThemeFile = value;
							void this.plugin.saveData(settings);
							timeoutId = window.setTimeout(() => {
								void (async () => {
									await (this.plugin as AstroModularPlugin).loadSettings();
									await this.applyCurrentConfiguration();
								})();
							}, 1000);
						});
						text.inputEl.addEventListener('blur', () => {
							if (timeoutId) {
								clearTimeout(timeoutId);
								void (async () => {
									await (this.plugin as AstroModularPlugin).loadSettings();
									await this.applyCurrentConfiguration();
								})();
							}
						});
					});
			});

			// Extract from Obsidian button
			customThemeGroup.addSetting((setting) => {
				setting
					.setName('Extract from Obsidian theme')
					.setDesc('Extract colors from your currently active Obsidian theme')
					.addButton(button => {
						button.setButtonText('Extract colors');
						button.setCta();
						button.onClick(() => {
							void (async () => {
								try {
									const extractedColors = await ThemeColorExtractor.extractObsidianThemeColors();
									
									// Store extracted colors
									settings.themeColors.extractedColors = extractedColors;
									settings.themeColors.lastExtracted = new Date().toISOString();
									await this.plugin.saveData(settings);
									await (this.plugin as AstroModularPlugin).loadSettings();
									
									// Re-render to show extracted colors
									this.render(container);
									
									new Notice('Colors extracted successfully from Obsidian theme!');
								} catch (error) {
									new Notice(`Failed to extract colors: ${error instanceof Error ? error.message : String(error)}`);
								}
							})();
						});
					});
			});

			// Show last extracted timestamp - add as custom setting
			if (settings.themeColors.lastExtracted) {
				customThemeGroup.addSetting((setting) => {
					const lastExtracted = new Date(settings.themeColors.lastExtracted!).toLocaleString();
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
					const timestampEl = setting.settingEl.createEl('p', { 
						text: `Last extracted: ${lastExtracted}`,
						cls: 'theme-extraction-timestamp'
					});
					timestampEl.setCssProps({ color: 'var(--text-muted)' });
				});
			}

			// Color mode selector (Simple vs Advanced)
			customThemeGroup.addSetting((setting) => {
				setting
					.setName('Color editing mode')
					.setDesc('Choose how to edit your theme colors')
					.addDropdown(dropdown => {
						dropdown.addOption('simple', 'Simple (accent + background)');
						dropdown.addOption('advanced', 'Advanced (individual shades)');
						dropdown.setValue(settings.themeColors.mode);
						dropdown.onChange((value) => {
							void (async () => {
								settings.themeColors.mode = value as 'simple' | 'advanced';
								await this.plugin.saveData(settings);
								await (this.plugin as AstroModularPlugin).loadSettings();
								this.render(container);
							})();
						});
					});
			});

			// Color preview if colors are available - add as custom setting
			if (settings.themeColors.extractedColors) {
				customThemeGroup.addSetting((setting) => {
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
					if (settings.themeColors.extractedColors) {
						this.renderColorPreview(setting.settingEl, settings.themeColors.extractedColors);
					}
				});
			}

			// Color editing interface - add as custom setting
			if (settings.themeColors.extractedColors) {
				customThemeGroup.addSetting((setting) => {
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
					if (settings.themeColors.mode === 'simple') {
						this.renderSimpleColorEditor(setting.settingEl, settings);
					} else {
						this.renderAdvancedColorEditor(setting.settingEl, settings);
					}
				});
			}

			// Save to custom theme file
			customThemeGroup.addSetting((setting) => {
				setting
					.setName('Save to custom theme file')
					.setDesc('Generate a custom theme file from your extracted colors')
					.addButton(button => {
						button.setButtonText('Save theme file');
						button.setCta();
						button.onClick(() => {
							void (async () => {
								try {
									if (!settings.themeColors.extractedColors) {
										new Notice('No colors available to save. Please extract colors first.');
										return;
									}

									// Get the custom theme filename from settings
									const themeFileName = settings.customThemeFile || 'custom';
									
									// Generate theme file content with the custom theme name
									const themeContent = ThemeColorExtractor.generateThemeFileContent(settings.themeColors.extractedColors, themeFileName);
									
									// Save to custom theme file - use the custom filename
									const filePath = `../../src/themes/custom/${themeFileName}.ts`;
									await this.app.vault.adapter.write(filePath, themeContent);
									
									// Update settings with the custom theme file name
									settings.customThemeFile = themeFileName;
									await this.plugin.saveData(settings);
									
									// Apply theme and customThemeFile changes to config.ts
									try {
										const success = await (this.plugin as AstroModularPlugin).configManager.updateIndividualFeatures(settings);
										if (success) {
											new Notice(`${themeFileName}.ts saved successfully! Use the main theme dropdown to switch to "custom" if you want to use this theme.`);
										} else {
											new Notice('Theme file saved but failed to apply to config.ts');
										}
									} catch (error) {
										new Notice(`Theme file saved but failed to apply: ${error instanceof Error ? error.message : String(error)}`);
									}
								} catch (error) {
									new Notice(`Failed to save theme file: ${error instanceof Error ? error.message : String(error)}`);
								}
							})();
						});
					});
			});
		}

		// Typography group with heading
		const typographyGroup = createSettingsGroup(container, 'Typography');

		// Heading font dropdown
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Heading font')
				.setDesc('Font for headings and titles')
				.addDropdown(dropdown => {
					FONT_OPTIONS.forEach(font => {
						dropdown.addOption(font, font);
					});
					dropdown.setValue(settings.typography.headingFont);
					dropdown.onChange((value) => {
						void (async () => {
							settings.typography.headingFont = value;
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Apply only heading font change to config.ts (not all settings)
							try {
								const success = await (this.plugin as AstroModularPlugin).configManager.updateFontOnly('heading', value);
								if (success) {
									new Notice('Heading font updated and applied to config.ts');
								} else {
									new Notice('Failed to apply heading font change to config.ts');
								}
							} catch (error) {
								new Notice(`Failed to apply heading font change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Prose font dropdown
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Prose font')
				.setDesc('Font for body text and content')
				.addDropdown(dropdown => {
					FONT_OPTIONS.forEach(font => {
						dropdown.addOption(font, font);
					});
					dropdown.setValue(settings.typography.proseFont);
					dropdown.onChange((value) => {
						void (async () => {
							settings.typography.proseFont = value;
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Apply only prose font change to config.ts (not all settings)
							try {
								const success = await (this.plugin as AstroModularPlugin).configManager.updateFontOnly('prose', value);
								if (success) {
									new Notice('Prose font updated and applied to config.ts');
								} else {
									new Notice('Failed to apply prose font change to config.ts');
								}
							} catch (error) {
								new Notice(`Failed to apply prose font change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Mono font dropdown
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Monospace font')
				.setDesc('Font for code blocks and technical content')
				.addDropdown(dropdown => {
					FONT_OPTIONS.forEach(font => {
						dropdown.addOption(font, font);
					});
					dropdown.setValue(settings.typography.monoFont);
					dropdown.onChange((value) => {
						void (async () => {
							settings.typography.monoFont = value;
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Apply only monospace font change to config.ts (not all settings)
							try {
								const success = await (this.plugin as AstroModularPlugin).configManager.updateFontOnly('mono', value);
								if (success) {
									new Notice('Monospace font updated and applied to config.ts');
								} else {
									new Notice('Failed to apply monospace font change to config.ts');
								}
							} catch (error) {
								new Notice(`Failed to apply monospace font change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Font source dropdown
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Font source')
				.setDesc('How fonts are loaded')
				.addDropdown(dropdown => {
					// False positive: "Google Fonts" is a proper noun (product name) and should be capitalized
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					dropdown.addOption('local', 'Local (Google Fonts)');
					// False positive: "CDN" is an acronym and should be capitalized
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					dropdown.addOption('cdn', 'CDN (Custom)');
					dropdown.setValue(settings.typography.fontSource);
					dropdown.onChange((value) => {
						void (async () => {
							settings.typography.fontSource = value as 'local' | 'cdn';
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Re-render to show/hide custom inputs
							this.render(container);
							
							// Apply changes immediately to config.ts
							try {
								await this.applyCurrentConfiguration();
								new Notice(`Font source changed to ${value} and applied to config.ts`);
							} catch (error) {
								new Notice(`Failed to apply font source change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Font display dropdown
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Font display')
				.setDesc('Font display strategy')
				.addDropdown(dropdown => {
					dropdown.addOption('swap', 'Swap (recommended)');
					dropdown.addOption('fallback', 'Fallback');
					dropdown.addOption('optional', 'Optional');
					dropdown.setValue(settings.typography.fontDisplay || 'swap');
					dropdown.onChange((value) => {
						void (async () => {
							settings.typography.fontDisplay = value as 'swap' | 'fallback' | 'optional';
							await this.plugin.saveData(settings);
							await (this.plugin as AstroModularPlugin).loadSettings();
							
							// Apply changes immediately to config.ts
							try {
								await this.applyCurrentConfiguration();
								new Notice('Font display updated and applied to config.ts');
							} catch (error) {
								new Notice(`Failed to apply font display change: ${error instanceof Error ? error.message : String(error)}`);
							}
						})();
					});
				});
		});

		// Content Width
		typographyGroup.addSetting((setting) => {
			setting
				.setName('Content width')
				.setDesc('Maximum width for content (e.g., 45rem)')
				.addText(text => {
					text.setValue(settings.layout?.contentWidth || '45rem');
					let timeoutId: number | null = null;
					text.onChange((value) => {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
						if (!settings.layout) {
							settings.layout = { contentWidth: '45rem' };
						}
						settings.layout.contentWidth = value;
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

		// Custom font inputs (only show when CDN is selected)
		if (settings.typography.fontSource === 'cdn') {
			// Custom font URLs
		typographyGroup.addSetting((setting) => {
			setting
				// False positive: "URLs" is an acronym and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setName('Custom font URLs')
				// False positive: "Google Fonts" is a proper noun (product name) and should be capitalized
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setDesc('Comma-separated URLs for custom fonts (e.g., Google Fonts URL)')
				.addText(text => {
						text.setValue(settings.typography.customFonts?.urls || '');
						let timeoutId: number | null = null;
						text.onChange((value) => {
							if (timeoutId) {
								clearTimeout(timeoutId);
							}
							if (!settings.typography.customFonts) {
								settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
							}
							settings.typography.customFonts.urls = value;
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

			// Custom heading font name
			typographyGroup.addSetting((setting) => {
				setting
					.setName('Custom heading font name')
					.setDesc('Font family name for headings')
					.addText(text => {
						text.setValue(settings.typography.customFonts?.heading || '');
						let timeoutId: number | null = null;
						text.onChange((value) => {
							if (timeoutId) {
								clearTimeout(timeoutId);
							}
							if (!settings.typography.customFonts) {
								settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
							}
							settings.typography.customFonts.heading = value;
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

			// Custom Body Font Name
			typographyGroup.addSetting((setting) => {
				setting
					.setName('Custom body font name')
					.setDesc('Font family name for body text')
					.addText(text => {
						text.setValue(settings.typography.customFonts?.prose || '');
						let timeoutId: number | null = null;
						text.onChange((value) => {
							if (timeoutId) {
								clearTimeout(timeoutId);
							}
							if (!settings.typography.customFonts) {
								settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
							}
							settings.typography.customFonts.prose = value;
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

			// Custom Monospace Font Name
			typographyGroup.addSetting((setting) => {
				setting
					.setName('Custom monospace font name')
					.setDesc('Font family name for code')
					.addText(text => {
						text.setValue(settings.typography.customFonts?.mono || '');
						let timeoutId: number | null = null;
						text.onChange((value) => {
							if (timeoutId) {
								clearTimeout(timeoutId);
							}
							if (!settings.typography.customFonts) {
								settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
							}
							settings.typography.customFonts.mono = value;
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
		}
		}
	}

	/**
	 * Render color preview
	 */
	private renderColorPreview(container: HTMLElement, colors: { primary: ColorScale; highlight: ColorScale }): void {
		const previewSection = container.createDiv('color-preview-section');
		previewSection.createEl('h4', { text: 'Color preview' });
		
		const previewContainer = previewSection.createDiv('color-preview-container');
		previewContainer.setCssProps({
			display: 'flex',
			gap: '10px',
			marginTop: '10px'
		});

		// Show primary colors (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
		const primaryShades: Array<keyof ColorScale> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
		primaryShades.forEach(shade => {
			const colorValue = colors.primary[shade];
			if (colorValue) {
				const colorBox = previewContainer.createDiv('color-box');
				colorBox.setCssProps({
					width: '20px',
					height: '20px',
					backgroundColor: colorValue,
					border: '1px solid var(--background-modifier-border)',
					borderRadius: '3px'
				});
				colorBox.title = `Primary ${shade}: ${colorValue}`;
			}
		});

		// Show highlight colors (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
		const highlightShades: Array<keyof ColorScale> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
		highlightShades.forEach(shade => {
			const colorValue = colors.highlight[shade];
			if (colorValue) {
				const colorBox = previewContainer.createDiv('color-box');
				colorBox.setCssProps({
					width: '20px',
					height: '20px',
					backgroundColor: colorValue,
					border: '1px solid var(--background-modifier-border)',
					borderRadius: '3px'
				});
				colorBox.title = `Highlight ${shade}: ${colorValue}`;
			}
		});
	}

	/**
	 * Render simple color editor (accent + background)
	 */
	private renderSimpleColorEditor(container: HTMLElement, settings: AstroModularSettings): void {
		const simpleSection = container.createDiv('simple-color-inputs');
		simpleSection.setCssProps({ marginBottom: '20px' }); // Add spacing below the simple editor
		simpleSection.createEl('h4', { text: 'Simple color editor' });

		// Always initialize simple colors from extracted colors to ensure they're current
		const accentColor = settings.themeColors.extractedColors?.highlight?.[500] || '#5865f2';
		const backgroundColor = settings.themeColors.extractedColors?.primary?.[800] || '#1e1e1e';
		
		settings.themeColors.simpleColors = {
			accent: accentColor,
			background: backgroundColor
		};

		// Accent color
		const accentDiv = simpleSection.createDiv('simple-color-input');
		accentDiv.createEl('label', { text: 'Accent color:' });
		
		const accentTextInput = accentDiv.createEl('input', { 
			type: 'text', 
			value: settings.themeColors.simpleColors.accent 
		});
		accentTextInput.setCssProps({ fontFamily: 'var(--font-monospace)' });
		
		const accentColorPicker = accentDiv.createEl('input', { type: 'color' });
		accentColorPicker.value = settings.themeColors.simpleColors.accent;
		accentColorPicker.className = 'color-picker';
		
		accentTextInput.oninput = async () => {
			if (ThemeColorExtractor.isValidHexColor(accentTextInput.value) && settings.themeColors.simpleColors) {
				settings.themeColors.simpleColors.accent = accentTextInput.value;
				accentColorPicker.value = accentTextInput.value;
				await this.plugin.saveData(settings);
			}
		};
		
		accentColorPicker.onchange = async () => {
			if (settings.themeColors.simpleColors) {
				settings.themeColors.simpleColors.accent = accentColorPicker.value;
				accentTextInput.value = accentColorPicker.value;
				await this.plugin.saveData(settings);
			}
		};

		// Background color
		const backgroundDiv = simpleSection.createDiv('simple-color-input');
		backgroundDiv.createEl('label', { text: 'Background color:' });
		
		const backgroundTextInput = backgroundDiv.createEl('input', { 
			type: 'text', 
			value: settings.themeColors.simpleColors.background 
		});
		backgroundTextInput.setCssProps({ fontFamily: 'var(--font-monospace)' });
		
		const backgroundColorPicker = backgroundDiv.createEl('input', { type: 'color' });
		backgroundColorPicker.value = settings.themeColors.simpleColors.background;
		backgroundColorPicker.className = 'color-picker';
		
		backgroundTextInput.oninput = async () => {
			if (ThemeColorExtractor.isValidHexColor(backgroundTextInput.value) && settings.themeColors.simpleColors) {
				settings.themeColors.simpleColors.background = backgroundTextInput.value;
				backgroundColorPicker.value = backgroundTextInput.value;
				await this.plugin.saveData(settings);
			}
		};
		
		backgroundColorPicker.onchange = async () => {
			if (settings.themeColors.simpleColors) {
				settings.themeColors.simpleColors.background = backgroundColorPicker.value;
			}
			backgroundTextInput.value = backgroundColorPicker.value;
			await this.plugin.saveData(settings);
		};
	}

	/**
	 * Render advanced color editor (individual shades)
	 */
	private renderAdvancedColorEditor(container: HTMLElement, settings: AstroModularSettings): void {
		const advancedSection = container.createDiv('advanced-mode-section');
		advancedSection.createEl('h4', { text: 'Advanced color editor' });

		// Primary colors
		const primarySection = advancedSection.createDiv('color-scale-editor');
		primarySection.createEl('h5', { text: 'Primary colors' });
		
		const primaryShades: Array<keyof ColorScale> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
		primaryShades.forEach(shade => {
			const colorValue = settings.themeColors.extractedColors?.primary?.[shade];
			if (colorValue) {
				const settingItem = primarySection.createDiv('setting-item');
				settingItem.setCssProps({
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					marginBottom: '8px'
				});
				
				const label = settingItem.createDiv('setting-item-name');
				label.textContent = `${shade}:`;
				label.setCssProps({
					minWidth: '40px',
					fontSize: '12px',
					color: 'var(--text-muted)'
				});
				
				const control = settingItem.createDiv('setting-item-control');
				control.setCssProps({
					display: 'flex',
					gap: '8px',
					alignItems: 'center'
				});
				
				const textInput = control.createEl('input', { type: 'text', value: colorValue });
				textInput.setCssProps({
					width: '100px',
					fontFamily: 'var(--font-monospace)',
					fontSize: '12px'
				});
				
				const colorPicker = control.createEl('input', { type: 'color', value: colorValue });
				colorPicker.className = 'color-picker';
				
				textInput.oninput = async () => {
					if (ThemeColorExtractor.isValidHexColor(textInput.value)) {
						if (settings.themeColors.extractedColors?.primary) {
							settings.themeColors.extractedColors.primary[shade] = textInput.value;
						}
						colorPicker.value = textInput.value;
						await this.plugin.saveData(settings);
					}
				};
				
				colorPicker.onchange = async () => {
					if (settings.themeColors.extractedColors) {
						settings.themeColors.extractedColors.primary[shade] = colorPicker.value;
					}
					textInput.value = colorPicker.value;
					await this.plugin.saveData(settings);
				};
			}
		});

		// Highlight colors
		const highlightSection = advancedSection.createDiv('color-scale-editor');
		highlightSection.createEl('h5', { text: 'Highlight colors' });
		
		const highlightShades: Array<keyof ColorScale> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
		highlightShades.forEach(shade => {
			const colorValue = settings.themeColors.extractedColors?.highlight?.[shade];
			if (colorValue) {
				const settingItem = highlightSection.createDiv('setting-item');
				settingItem.setCssProps({
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					marginBottom: '8px'
				});
				
				const label = settingItem.createDiv('setting-item-name');
				label.textContent = `${shade}:`;
				label.setCssProps({
					minWidth: '40px',
					fontSize: '12px',
					color: 'var(--text-muted)'
				});
				
				const control = settingItem.createDiv('setting-item-control');
				control.setCssProps({
					display: 'flex',
					gap: '8px',
					alignItems: 'center'
				});
				
				const textInput = control.createEl('input', { type: 'text', value: colorValue });
				textInput.setCssProps({
					width: '100px',
					fontFamily: 'var(--font-monospace)',
					fontSize: '12px'
				});
				
				const colorPicker = control.createEl('input', { type: 'color', value: colorValue });
				colorPicker.className = 'color-picker';
				
				textInput.oninput = async () => {
					if (ThemeColorExtractor.isValidHexColor(textInput.value)) {
						if (settings.themeColors.extractedColors?.highlight) {
							settings.themeColors.extractedColors.highlight[shade] = textInput.value;
						}
						colorPicker.value = textInput.value;
						await this.plugin.saveData(settings);
					}
				};
				
				colorPicker.onchange = async () => {
					if (settings.themeColors.extractedColors) {
						settings.themeColors.extractedColors.highlight[shade] = colorPicker.value;
					}
					textInput.value = colorPicker.value;
					await this.plugin.saveData(settings);
				};
			}
		});
	}
}