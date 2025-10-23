import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { THEME_OPTIONS, FONT_OPTIONS } from '../../types';

export class StyleTab extends TabRenderer {
	private mainContainer: HTMLElement | null = null;

	render(container: HTMLElement): void {
		container.empty();
		this.mainContainer = container; // Store reference to main container
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Style' });
		const description = settingsSection.createEl('p', { text: 'Configure your theme and typography settings. Changes are applied to your config.ts file immediately.' });

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
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice(`Theme changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

		// Custom theme file (only show when theme is 'custom')
		if (settings.currentTheme === 'custom') {
			this.createTextSetting(
				container,
				'Theme file',
				'Filename in src/themes/custom/ (without .ts extension)',
				settings.customThemeFile || 'custom',
				(value) => {
					settings.customThemeFile = value;
				}
			);
		}

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
						// Disable customization - set to "all"
						settings.availableThemes = 'all';
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
						new Notice(`Available themes ${value ? 'customized' : 'set to all'} and applied to config.ts`);
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
				text: 'Selected themes (click × to remove):',
				cls: 'theme-pills-header'
			});
			pillsHeader.style.fontSize = '14px';
			pillsHeader.style.marginBottom = '8px';
			pillsHeader.style.color = 'var(--text-muted)';
			
			const pillsWrapper = themePillsContainer.createDiv('theme-pills-wrapper');
			pillsWrapper.style.display = 'flex';
			pillsWrapper.style.flexWrap = 'wrap';
			pillsWrapper.style.gap = '8px';
			
			// Show each selected theme as a pill
			settings.availableThemes.forEach(themeId => {
				const theme = THEME_OPTIONS.find(t => t.id === themeId);
				if (theme) {
					const pill = pillsWrapper.createDiv('theme-pill');
					pill.style.display = 'inline-flex';
					pill.style.alignItems = 'center';
					pill.style.padding = '4px 8px';
					pill.style.backgroundColor = 'var(--interactive-accent)';
					pill.style.color = 'var(--text-on-accent)';
					pill.style.borderRadius = '12px';
					pill.style.fontSize = '12px';
					pill.style.gap = '6px';
					
					pill.createSpan({ text: theme.name });
					
					const removeBtn = pill.createEl('button', { text: '×' });
					removeBtn.style.background = 'none';
					removeBtn.style.border = 'none';
					removeBtn.style.color = 'inherit';
					removeBtn.style.cursor = 'pointer';
					removeBtn.style.fontSize = '14px';
					removeBtn.style.padding = '0';
					removeBtn.style.width = '16px';
					removeBtn.style.height = '16px';
					removeBtn.style.borderRadius = '50%';
					removeBtn.style.display = 'flex';
					removeBtn.style.alignItems = 'center';
					removeBtn.style.justifyContent = 'center';
					
					removeBtn.addEventListener('click', async () => {
						// Remove theme from array (we know it's an array because we're in this block)
						const currentThemes = settings.availableThemes as string[];
						const newThemes = currentThemes.filter((id: string) => id !== themeId);
						
						// Ensure at least one theme remains
						if (newThemes.length === 0) {
							new Notice('At least one theme must be available. Adding "oxygen" as default.');
							newThemes.push('oxygen');
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
							new Notice(`Theme "${theme.name}" removed from available themes`);
						} catch (error) {
							new Notice(`Failed to apply theme removal: ${error instanceof Error ? error.message : String(error)}`);
						}
					});
				}
			});
		}

		// Typography section
		const typographySection = container.createDiv('settings-section');
		typographySection.createEl('h3', { text: 'Typography' });
		typographySection.createEl('p', { text: 'Configure your font settings.' });

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
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice('Heading font updated and applied to config.ts');
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
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice('Prose font updated and applied to config.ts');
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
				
				// Apply changes immediately to config.ts
				try {
					await this.applyCurrentConfiguration();
						new Notice('Monospace font updated and applied to config.ts');
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
}