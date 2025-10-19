import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';
import { THEME_OPTIONS, FONT_OPTIONS } from '../../types';

export class StyleTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
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
					
					// Apply changes immediately to config.ts
					try {
						await this.applyCurrentConfiguration();
						new Notice(`Theme changed to ${value} and applied to config.ts`);
					} catch (error) {
						new Notice(`Failed to apply theme change: ${error instanceof Error ? error.message : String(error)}`);
					}
				});
			});

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

		// Custom font inputs (only show when CDN is selected)
		if (settings.typography.fontSource === 'cdn') {
			// Custom font URLs
			this.createTextSetting(
				typographySection,
				'Custom Font URLs',
				'Comma-separated font URLs',
				settings.typography.customFonts?.heading || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '' };
					}
					settings.typography.customFonts.heading = value;
				}
			);

			// Custom heading font name
			this.createTextSetting(
				typographySection,
				'Custom Heading Font Name',
				'Name of the custom heading font',
				settings.typography.customFonts?.heading || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '' };
					}
					settings.typography.customFonts.heading = value;
				}
			);

			// Custom prose font name
			this.createTextSetting(
				typographySection,
				'Custom Prose Font Name',
				'Name of the custom prose font',
				settings.typography.customFonts?.prose || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '' };
					}
					settings.typography.customFonts.prose = value;
				}
			);

			// Custom mono font name
			this.createTextSetting(
				typographySection,
				'Custom Monospace Font Name',
				'Name of the custom monospace font',
				settings.typography.customFonts?.mono || '',
				(value) => {
					if (!settings.typography.customFonts) {
						settings.typography.customFonts = { heading: '', prose: '', mono: '' };
					}
					settings.typography.customFonts.mono = value;
				}
			);
		}
	}
}