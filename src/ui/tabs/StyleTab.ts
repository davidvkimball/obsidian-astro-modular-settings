import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { THEME_OPTIONS, FONT_OPTIONS } from '../../types';
import { ThemeColorExtractor } from '../../utils/ThemeColorExtractor';

export class StyleTab extends TabRenderer {
	private mainContainer: HTMLElement | null = null;

	render(container: HTMLElement): void {
		container.empty();
		this.mainContainer = container; // Store reference to main container
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Colors' });

		// Theme selector
		new Setting(container)
			.setName('Theme')
			.setDesc('Choose your color theme')
			.addDropdown(dropdown => {
				THEME_OPTIONS.forEach(theme => {
					dropdown.addOption(theme.id, theme.name);
				});
				dropdown.setValue(settings.currentTheme);
				dropdown.onChange(async (value) => {
				settings.currentTheme = value as any;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Re-render to show/hide custom theme file field
				this.render(container);
				
				// Apply only theme change to config.ts (not all settings)
				try {
					const success = await (this.plugin as any).configManager.updateThemeOnly(value);
					if (success) {
						new Notice(`Theme changed to ${value} and applied to config.ts`);
					} else {
						new Notice(`Failed to apply theme change to config.ts`);
					}
				} catch (error) {
					new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
				}
				});
			});


		// Available themes customization
		new Setting(container)
			.setName('Customize available themes')
			.setDesc('Control which themes are shown to users in the theme selector')
			.addToggle(toggle => {
				const isCustomized = Array.isArray(settings.availableThemes);
				toggle.setValue(isCustomized);
				toggle.onChange(async (value) => {
					if (value) {
						// Enable customization - set to all themes except 'custom'
						const allThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom').map(theme => theme.id);
						settings.availableThemes = allThemes as any;
					} else {
						// Disable customization - set to "default"
						settings.availableThemes = 'default';
					}
					await this.plugin.saveData(settings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as any).loadSettings();
					
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
				});
			});

		// Show theme pills when customization is enabled
		if (Array.isArray(settings.availableThemes)) {
			const themePillsContainer = container.createDiv('theme-pills-container');
			themePillsContainer.style.marginTop = '10px';
			themePillsContainer.style.marginBottom = '20px';
			
			const pillsHeader = themePillsContainer.createEl('p', { 
				text: 'Available themes (click to toggle selection):',
				cls: 'theme-pills-header'
			});
			pillsHeader.style.fontSize = '14px';
			pillsHeader.style.marginBottom = '8px';
			pillsHeader.style.color = 'var(--text-muted)';
			
			const pillsWrapper = themePillsContainer.createDiv('theme-pills-wrapper');
			pillsWrapper.style.display = 'flex';
			pillsWrapper.style.flexWrap = 'wrap';
			pillsWrapper.style.gap = '8px';
			
			// Show all themes (except custom) with selection state
			const allThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom');
			allThemes.forEach(theme => {
				const isSelected = (settings.availableThemes as string[]).includes(theme.id);
				
					const pill = pillsWrapper.createDiv('theme-pill');
					pill.style.display = 'inline-flex';
					pill.style.alignItems = 'center';
					pill.style.padding = '4px 8px';
					pill.style.borderRadius = '12px';
					pill.style.fontSize = '12px';
					pill.style.gap = '6px';
				pill.style.cursor = 'pointer';
				pill.style.transition = 'all 0.2s ease';
				
				// Style based on selection state
				if (isSelected) {
					pill.style.backgroundColor = 'var(--interactive-accent)';
					pill.style.color = 'var(--text-on-accent)';
					pill.style.border = '1px solid var(--interactive-accent)';
				} else {
					pill.style.backgroundColor = 'var(--background-secondary)';
					pill.style.color = 'var(--text-muted)';
					pill.style.border = '1px solid var(--background-modifier-border)';
				}
					
					pill.createSpan({ text: theme.name });
					
				// Add selection indicator
				const indicator = pill.createSpan({ text: isSelected ? '✓' : '○' });
				indicator.style.fontSize = '10px';
				indicator.style.opacity = '0.8';
				
				pill.addEventListener('click', async () => {
						const currentThemes = settings.availableThemes as string[];
					let newThemes: string[];
					
					if (isSelected) {
						// Remove theme from selection
						newThemes = currentThemes.filter((id: string) => id !== theme.id);
					} else {
						// Add theme to selection
						newThemes = [...currentThemes, theme.id];
						}
						
						settings.availableThemes = newThemes as any;
						await this.plugin.saveData(settings);
						// Reload settings to ensure the plugin has the latest values
						await (this.plugin as any).loadSettings();
						
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
				});
			});
			
			// Add custom themes input field
			const customThemesSection = themePillsContainer.createDiv('custom-themes-section');
			customThemesSection.style.marginTop = '15px';
			customThemesSection.style.padding = '10px';
			customThemesSection.style.backgroundColor = 'var(--background-secondary)';
			customThemesSection.style.borderRadius = '6px';
			customThemesSection.style.border = '1px solid var(--background-modifier-border)';
			
			const customThemesLabel = customThemesSection.createEl('label', { 
				text: 'Custom themes (comma-separated):',
				cls: 'custom-themes-label'
			});
			customThemesLabel.style.display = 'block';
			customThemesLabel.style.fontSize = '12px';
			customThemesLabel.style.color = 'var(--text-muted)';
			customThemesLabel.style.marginBottom = '6px';
			
			// Create input container with folder button
			const inputContainer = customThemesSection.createDiv('custom-themes-input-container');
			inputContainer.style.display = 'flex';
			inputContainer.style.gap = '6px';
			inputContainer.style.alignItems = 'center';
			
			const customThemesInput = inputContainer.createEl('input', {
				type: 'text',
				placeholder: 'custom,obsidinite',
				value: settings.customThemes || '',
				attr: {
					spellcheck: 'false'
				}
			});
			customThemesInput.style.flex = '1';
			customThemesInput.style.padding = '6px 8px';
			customThemesInput.style.border = '1px solid var(--background-modifier-border)';
			customThemesInput.style.borderRadius = '4px';
			customThemesInput.style.backgroundColor = 'var(--background-primary)';
			customThemesInput.style.color = 'var(--text-normal)';
			customThemesInput.style.fontSize = '12px';
			
			// Add folder button
			const folderButton = inputContainer.createEl('button', {
				cls: 'clickable-icon',
				attr: {
					'aria-label': 'Open themes folder'
				}
			});
			folderButton.style.padding = '4px';
			folderButton.style.border = 'none';
			folderButton.style.backgroundColor = 'transparent';
			folderButton.style.color = 'var(--text-normal)';
			folderButton.style.display = 'flex';
			folderButton.style.alignItems = 'center';
			folderButton.style.justifyContent = 'center';
			folderButton.style.marginTop = '2px';
			
			// Add folder icon using Obsidian's icon system
			const folderIcon = folderButton.createDiv();
			folderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
			
			// Add click handler for folder button
			folderButton.addEventListener('click', async () => {
				try {
					// Open file explorer to the themes/custom directory
					// Path: go up two levels from vault (src/content) to project root, then down to src/themes/custom
					const themesPath = '../../src/themes/custom';
					await (this.app as any).openWithDefaultApp(themesPath);
				} catch (error) {
					new Notice(`Failed to open themes folder: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
			
			// Use debounced input like other text fields
			let timeoutId: number | null = null;
			customThemesInput.addEventListener('input', async () => {
				// Update the value immediately for UI responsiveness
				settings.customThemes = customThemesInput.value.trim();
				await this.plugin.saveData(settings);
				await (this.plugin as any).loadSettings();
				
				// Clear existing timeout
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				
				// Debounce the configuration application
				timeoutId = window.setTimeout(async () => {
					try {
						await this.applyCurrentConfiguration();
						new Notice('Custom themes updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply custom themes: ${error instanceof Error ? error.message : String(error)}`);
					}
				}, 1000); // 1 second debounce
			});
		}

		// Custom Theme Section
		const customThemeSection = container.createDiv('settings-section');

		// Generate custom theme toggle
		new Setting(customThemeSection)
			.setName('Generate custom theme')
			.setDesc('Enable to extract colors from your Obsidian theme and generate custom theme files')
			.addToggle(toggle => {
				toggle.setValue(settings.customThemeGenerationEnabled || false);
				toggle.onChange(async (value) => {
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
					await (this.plugin as any).loadSettings();
					
					// Re-render to show/hide custom theme options
					this.render(container);
				});
			});

		// Show custom theme options when enabled
		if (settings.customThemeGenerationEnabled) {
			// Theme file name input (always visible when custom theme generation is enabled)
			this.createTextSetting(
				customThemeSection,
				'Custom theme file name',
				'Filename for the generated theme file (without .ts extension)',
				settings.customThemeFile || 'custom',
				(value) => {
					settings.customThemeFile = value;
				}
			);

			// Extract from Obsidian button
			new Setting(customThemeSection)
				.setName('Extract from Obsidian Theme')
				.setDesc('Extract colors from your currently active Obsidian theme')
				.addButton(button => {
					button.setButtonText('Extract Colors');
					button.setCta();
					button.onClick(async () => {
						try {
							const extractedColors = await ThemeColorExtractor.extractObsidianThemeColors();
							
							// Store extracted colors
							settings.themeColors.extractedColors = extractedColors;
							settings.themeColors.lastExtracted = new Date().toISOString();
							await this.plugin.saveData(settings);
							await (this.plugin as any).loadSettings();
							
							// Re-render to show extracted colors
							this.render(container);
							
							new Notice('Colors extracted successfully from Obsidian theme!');
						} catch (error) {
							new Notice(`Failed to extract colors: ${error instanceof Error ? error.message : String(error)}`);
						}
					});
				});

			// Show last extracted timestamp
			if (settings.themeColors.lastExtracted) {
				const lastExtracted = new Date(settings.themeColors.lastExtracted).toLocaleString();
				customThemeSection.createEl('p', { 
					text: `Last extracted: ${lastExtracted}`,
					cls: 'theme-extraction-timestamp'
				}).style.color = 'var(--text-muted)';
			}

			// Color mode selector (Simple vs Advanced)
			new Setting(customThemeSection)
				.setName('Color editing mode')
				.setDesc('Choose how to edit your theme colors')
				.addDropdown(dropdown => {
					dropdown.addOption('simple', 'Simple (accent + background)');
					dropdown.addOption('advanced', 'Advanced (individual shades)');
					dropdown.setValue(settings.themeColors.mode);
					dropdown.onChange(async (value) => {
						settings.themeColors.mode = value as 'simple' | 'advanced';
						await this.plugin.saveData(settings);
						await (this.plugin as any).loadSettings();
						this.render(container);
					});
				});

			// Color preview if colors are available
			if (settings.themeColors.extractedColors) {
				this.renderColorPreview(customThemeSection, settings.themeColors.extractedColors);
			}

			// Color editing interface
			if (settings.themeColors.extractedColors) {
				if (settings.themeColors.mode === 'simple') {
					this.renderSimpleColorEditor(customThemeSection, settings);
				} else {
					this.renderAdvancedColorEditor(customThemeSection, settings);
				}
			}

			// Save to custom theme file
			new Setting(customThemeSection)
				.setName('Save to Custom Theme File')
				.setDesc('Generate a custom theme file from your extracted colors')
				.addButton(button => {
					button.setButtonText('Save Theme File');
					button.setCta();
					button.onClick(async () => {
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
								const success = await (this.plugin as any).configManager.updateIndividualFeatures(settings);
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
					});
			});
		}

		// Typography section
		const typographySection = container.createDiv('settings-section');
		typographySection.createEl('h3', { text: 'Typography' });

		// Heading font dropdown
		new Setting(typographySection)
			.setName('Heading Font')
			.setDesc('Font for headings and titles')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(settings.typography.headingFont);
				dropdown.onChange(async (value) => {
				settings.typography.headingFont = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Apply only heading font change to config.ts (not all settings)
				try {
					const success = await (this.plugin as any).configManager.updateFontOnly('heading', value);
					if (success) {
						new Notice('Heading font updated and applied to config.ts');
					} else {
						new Notice('Failed to apply heading font change to config.ts');
					}
				} catch (error) {
					new Notice(`Failed to apply heading font change: ${error instanceof Error ? error.message : String(error)}`);
				}
				});
			});

		// Prose font dropdown
		new Setting(typographySection)
			.setName('Prose Font')
			.setDesc('Font for body text and content')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(settings.typography.proseFont);
				dropdown.onChange(async (value) => {
				settings.typography.proseFont = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Apply only prose font change to config.ts (not all settings)
				try {
					const success = await (this.plugin as any).configManager.updateFontOnly('prose', value);
					if (success) {
						new Notice('Prose font updated and applied to config.ts');
					} else {
						new Notice('Failed to apply prose font change to config.ts');
					}
				} catch (error) {
					new Notice(`Failed to apply prose font change: ${error instanceof Error ? error.message : String(error)}`);
				}
				});
			});

		// Mono font dropdown
		new Setting(typographySection)
			.setName('Monospace Font')
			.setDesc('Font for code blocks and technical content')
			.addDropdown(dropdown => {
				FONT_OPTIONS.forEach(font => {
					dropdown.addOption(font, font);
				});
				dropdown.setValue(settings.typography.monoFont);
				dropdown.onChange(async (value) => {
				settings.typography.monoFont = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Apply only monospace font change to config.ts (not all settings)
				try {
					const success = await (this.plugin as any).configManager.updateFontOnly('mono', value);
					if (success) {
						new Notice('Monospace font updated and applied to config.ts');
					} else {
						new Notice('Failed to apply monospace font change to config.ts');
					}
				} catch (error) {
					new Notice(`Failed to apply monospace font change: ${error instanceof Error ? error.message : String(error)}`);
				}
				});
			});

		// Font source dropdown
		new Setting(typographySection)
			.setName('Font Source')
			.setDesc('How fonts are loaded')
			.addDropdown(dropdown => {
				dropdown.addOption('local', 'Local (Google Fonts)');
				dropdown.addOption('cdn', 'CDN (Custom)');
				dropdown.setValue(settings.typography.fontSource);
				dropdown.onChange(async (value) => {
				settings.typography.fontSource = value as any;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Re-render to show/hide custom inputs
				this.render(container);
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Font source changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply font source change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Font display dropdown
		new Setting(typographySection)
			.setName('Font Display')
			.setDesc('Font display strategy')
			.addDropdown(dropdown => {
				dropdown.addOption('swap', 'Swap (recommended)');
				dropdown.addOption('fallback', 'Fallback');
				dropdown.addOption('optional', 'Optional');
				dropdown.setValue(settings.typography.fontDisplay || 'swap');
				dropdown.onChange(async (value) => {
				settings.typography.fontDisplay = value as 'swap' | 'fallback' | 'optional';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice('Font display updated and applied to config.ts');
					} catch (error) {
						new Notice(`Failed to apply font display change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Custom font inputs (only show when CDN is selected)
		if (settings.typography.fontSource === 'cdn') {
			// Custom font URLs
			this.createTextSetting(
				typographySection,
				'Custom Font URLs',
				'Comma-separated URLs for custom fonts (e.g., Google Fonts URL)',
				settings.typography.customFonts?.urls || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
					}
					settings.typography.customFonts.urls = value;
				}
			);

			// Custom heading font name
			this.createTextSetting(
				typographySection,
				'Custom Heading Font Name',
				'Font family name for headings',
				settings.typography.customFonts?.heading || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
					}
					settings.typography.customFonts.heading = value;
				}
			);

			// Custom Body Font Name
			this.createTextSetting(
				typographySection,
				'Custom Body Font Name',
				'Font family name for body text',
				settings.typography.customFonts?.prose || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
					}
					settings.typography.customFonts.prose = value;
				}
			);

			// Custom Monospace Font Name
			this.createTextSetting(
				typographySection,
				'Custom Monospace Font Name',
				'Font family name for code',
				settings.typography.customFonts?.mono || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '', urls: '' };
					}
					settings.typography.customFonts.mono = value;
				}
			);
		}

		// Content Width
		this.createTextSetting(
			typographySection,
			'Content width',
			'Maximum width for content (e.g., 45rem)',
			settings.layout?.contentWidth || '45rem',
			(value) => {
				if (!settings.layout) {
					settings.layout = { contentWidth: '45rem' };
				}
				settings.layout.contentWidth = value;
			}
		);
	}

	/**
	 * Render color preview
	 */
	private renderColorPreview(container: HTMLElement, colors: any): void {
		const previewSection = container.createDiv('color-preview-section');
		previewSection.createEl('h4', { text: 'Color Preview' });
		
		const previewContainer = previewSection.createDiv('color-preview-container');
		previewContainer.style.display = 'flex';
		previewContainer.style.gap = '10px';
		previewContainer.style.marginTop = '10px';

		// Show primary colors (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
		const primaryShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
		primaryShades.forEach(shade => {
			const colorValue = colors.primary[shade as keyof typeof colors.primary];
			if (colorValue) {
				const colorBox = previewContainer.createDiv('color-box');
				colorBox.style.width = '20px';
				colorBox.style.height = '20px';
				colorBox.style.backgroundColor = colorValue;
				colorBox.style.border = '1px solid var(--background-modifier-border)';
				colorBox.style.borderRadius = '3px';
				colorBox.title = `Primary ${shade}: ${colorValue}`;
			}
		});

		// Show highlight colors (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
		const highlightShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
		highlightShades.forEach(shade => {
			const colorValue = colors.highlight[shade as keyof typeof colors.highlight];
			if (colorValue) {
				const colorBox = previewContainer.createDiv('color-box');
				colorBox.style.width = '20px';
				colorBox.style.height = '20px';
				colorBox.style.backgroundColor = colorValue;
				colorBox.style.border = '1px solid var(--background-modifier-border)';
				colorBox.style.borderRadius = '3px';
				colorBox.title = `Highlight ${shade}: ${colorValue}`;
			}
		});
	}

	/**
	 * Render simple color editor (accent + background)
	 */
	private renderSimpleColorEditor(container: HTMLElement, settings: any): void {
		const simpleSection = container.createDiv('simple-color-inputs');
		simpleSection.style.marginBottom = '20px'; // Add spacing below the simple editor
		simpleSection.createEl('h4', { text: 'Simple Color Editor' });

		// Always initialize simple colors from extracted colors to ensure they're current
		const accentColor = settings.themeColors.extractedColors?.highlight?.[500] || '#5865f2';
		const backgroundColor = settings.themeColors.extractedColors?.primary?.[800] || '#1e1e1e';
		
		console.log('Simple editor - accent color:', accentColor);
		console.log('Simple editor - background color:', backgroundColor);
		
		settings.themeColors.simpleColors = {
			accent: accentColor,
			background: backgroundColor
		};

		// Accent color
		const accentDiv = simpleSection.createDiv('simple-color-input');
		accentDiv.createEl('label', { text: 'Accent Color:' });
		
		const accentTextInput = accentDiv.createEl('input', { 
			type: 'text', 
			value: settings.themeColors.simpleColors.accent 
		});
		accentTextInput.style.fontFamily = 'var(--font-monospace)';
		
		const accentColorPicker = accentDiv.createEl('input', { type: 'color' });
		accentColorPicker.value = settings.themeColors.simpleColors.accent;
		accentColorPicker.className = 'color-picker';
		
		accentTextInput.oninput = async () => {
			if (ThemeColorExtractor.isValidHexColor(accentTextInput.value)) {
				settings.themeColors.simpleColors.accent = accentTextInput.value;
				accentColorPicker.value = accentTextInput.value;
				await this.plugin.saveData(settings);
			}
		};
		
		accentColorPicker.onchange = async () => {
			settings.themeColors.simpleColors.accent = accentColorPicker.value;
			accentTextInput.value = accentColorPicker.value;
			await this.plugin.saveData(settings);
		};

		// Background color
		const backgroundDiv = simpleSection.createDiv('simple-color-input');
		backgroundDiv.createEl('label', { text: 'Background Color:' });
		
		const backgroundTextInput = backgroundDiv.createEl('input', { 
			type: 'text', 
			value: settings.themeColors.simpleColors.background 
		});
		backgroundTextInput.style.fontFamily = 'var(--font-monospace)';
		
		const backgroundColorPicker = backgroundDiv.createEl('input', { type: 'color' });
		backgroundColorPicker.value = settings.themeColors.simpleColors.background;
		backgroundColorPicker.className = 'color-picker';
		
		backgroundTextInput.oninput = async () => {
			if (ThemeColorExtractor.isValidHexColor(backgroundTextInput.value)) {
				settings.themeColors.simpleColors.background = backgroundTextInput.value;
				backgroundColorPicker.value = backgroundTextInput.value;
				await this.plugin.saveData(settings);
			}
		};
		
		backgroundColorPicker.onchange = async () => {
			settings.themeColors.simpleColors.background = backgroundColorPicker.value;
			backgroundTextInput.value = backgroundColorPicker.value;
			await this.plugin.saveData(settings);
		};
	}

	/**
	 * Render advanced color editor (individual shades)
	 */
	private renderAdvancedColorEditor(container: HTMLElement, settings: any): void {
		const advancedSection = container.createDiv('advanced-mode-section');
		advancedSection.createEl('h4', { text: 'Advanced Color Editor' });

		// Primary colors
		const primarySection = advancedSection.createDiv('color-scale-editor');
		primarySection.createEl('h5', { text: 'Primary Colors' });
		
		const primaryShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
		primaryShades.forEach(shade => {
			const colorValue = settings.themeColors.extractedColors?.primary?.[shade];
			if (colorValue) {
				const settingItem = primarySection.createDiv('setting-item');
				settingItem.style.display = 'flex';
				settingItem.style.alignItems = 'center';
				settingItem.style.gap = '10px';
				settingItem.style.marginBottom = '8px';
				
				const label = settingItem.createDiv('setting-item-name');
				label.textContent = `${shade}:`;
				label.style.minWidth = '40px';
				label.style.fontSize = '12px';
				label.style.color = 'var(--text-muted)';
				
				const control = settingItem.createDiv('setting-item-control');
				control.style.display = 'flex';
				control.style.gap = '8px';
				control.style.alignItems = 'center';
				
				const textInput = control.createEl('input', { type: 'text', value: colorValue });
				textInput.style.width = '100px';
				textInput.style.fontFamily = 'var(--font-monospace)';
				textInput.style.fontSize = '12px';
				
				const colorPicker = control.createEl('input', { type: 'color', value: colorValue });
				colorPicker.className = 'color-picker';
				
				textInput.oninput = async () => {
					if (ThemeColorExtractor.isValidHexColor(textInput.value)) {
						settings.themeColors.extractedColors.primary[shade] = textInput.value;
						colorPicker.value = textInput.value;
						await this.plugin.saveData(settings);
					}
				};
				
				colorPicker.onchange = async () => {
					settings.themeColors.extractedColors.primary[shade] = colorPicker.value;
					textInput.value = colorPicker.value;
					await this.plugin.saveData(settings);
				};
			}
		});

		// Highlight colors
		const highlightSection = advancedSection.createDiv('color-scale-editor');
		highlightSection.createEl('h5', { text: 'Highlight Colors' });
		
		const highlightShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
		highlightShades.forEach(shade => {
			const colorValue = settings.themeColors.extractedColors?.highlight?.[shade];
			if (colorValue) {
				const settingItem = highlightSection.createDiv('setting-item');
				settingItem.style.display = 'flex';
				settingItem.style.alignItems = 'center';
				settingItem.style.gap = '10px';
				settingItem.style.marginBottom = '8px';
				
				const label = settingItem.createDiv('setting-item-name');
				label.textContent = `${shade}:`;
				label.style.minWidth = '40px';
				label.style.fontSize = '12px';
				label.style.color = 'var(--text-muted)';
				
				const control = settingItem.createDiv('setting-item-control');
				control.style.display = 'flex';
				control.style.gap = '8px';
				control.style.alignItems = 'center';
				
				const textInput = control.createEl('input', { type: 'text', value: colorValue });
				textInput.style.width = '100px';
				textInput.style.fontFamily = 'var(--font-monospace)';
				textInput.style.fontSize = '12px';
				
				const colorPicker = control.createEl('input', { type: 'color', value: colorValue });
				colorPicker.className = 'color-picker';
				
				textInput.oninput = async () => {
					if (ThemeColorExtractor.isValidHexColor(textInput.value)) {
						settings.themeColors.extractedColors.highlight[shade] = textInput.value;
						colorPicker.value = textInput.value;
						await this.plugin.saveData(settings);
					}
				};
				
				colorPicker.onchange = async () => {
					settings.themeColors.extractedColors.highlight[shade] = colorPicker.value;
					textInput.value = colorPicker.value;
					await this.plugin.saveData(settings);
				};
			}
		});
	}
}