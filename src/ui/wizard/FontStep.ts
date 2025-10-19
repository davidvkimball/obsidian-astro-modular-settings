import { BaseWizardStep } from './BaseWizardStep';
import { FONT_OPTIONS } from '../../types';
import { Setting, DropdownComponent, TextComponent } from 'obsidian';

export class FontStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="font-selection">
				<h2>Choose your fonts</h2>
				<p>Select fonts for headings, body text, and code.</p>
			</div>
		`;

		// Create the font options container
		const fontOptions = container.querySelector('.font-selection')!.createDiv('font-options');

		// Helper function to create font dropdowns
		const createFontDropdown = (name: string, desc: string, currentValue: string, onChange: (value: string) => void) => {
			new Setting(fontOptions)
				.setName(name)
				.setDesc(desc)
				.addDropdown((dropdown: DropdownComponent) => {
					FONT_OPTIONS.forEach(font => {
						dropdown.addOption(font, font);
					});
					dropdown.setValue(currentValue)
						.onChange(onChange);
				});
		};

		// Create font dropdowns
		createFontDropdown('Heading Font', 'Font for headings and titles', 
			state.selectedTypography.headingFont, 
			(value: string) => this.updateTypographySetting('headingFont', value, state));

		createFontDropdown('Body Font', 'Font for body text and paragraphs', 
			state.selectedTypography.proseFont, 
			(value: string) => this.updateTypographySetting('proseFont', value, state));

		createFontDropdown('Monospace Font', 'Font for code blocks and inline code', 
			state.selectedTypography.monoFont, 
			(value: string) => this.updateTypographySetting('monoFont', value, state));

		// Font source dropdown
		new Setting(fontOptions)
			.setName('Font Source')
			.setDesc('Choose how fonts are loaded')
			.addDropdown((dropdown: DropdownComponent) => {
				dropdown.addOption('local', 'Local (Google Fonts)');
				dropdown.addOption('cdn', 'CDN (Custom)');
				dropdown.setValue(state.selectedTypography.fontSource)
					.onChange((value: string) => {
						this.updateTypographySetting('fontSource', value as 'local' | 'cdn', state);
						// Re-render to show/hide custom inputs
						this.render(container);
					});
			});

		// Custom font inputs (only show when CDN is selected)
		if (state.selectedTypography.fontSource === 'cdn') {
			new Setting(fontOptions)
				.setName('Custom Font URLs')
				.setDesc('Comma-separated URLs for custom fonts')
				.addText((text: TextComponent) => text
					.setValue(state.selectedTypography.customFonts?.urls || '')
					.setPlaceholder('https://fonts.googleapis.com/css2?family=Custom+Font:wght@400;600&display=swap')
					.onChange((value: string) => this.updateCustomFontSetting('urls', value, state)));

			new Setting(fontOptions)
				.setName('Custom Heading Font Name')
				.setDesc('Font family name for headings')
				.addText((text: TextComponent) => text
					.setValue(state.selectedTypography.customFonts?.heading || '')
					.setPlaceholder('Custom Heading Font')
					.onChange((value: string) => this.updateCustomFontSetting('heading', value, state)));

			new Setting(fontOptions)
				.setName('Custom Body Font Name')
				.setDesc('Font family name for body text')
				.addText((text: TextComponent) => text
					.setValue(state.selectedTypography.customFonts?.prose || '')
					.setPlaceholder('Custom Body Font')
					.onChange((value: string) => this.updateCustomFontSetting('prose', value, state)));

			new Setting(fontOptions)
				.setName('Custom Monospace Font Name')
				.setDesc('Font family name for code')
				.addText((text: TextComponent) => text
					.setValue(state.selectedTypography.customFonts?.mono || '')
					.setPlaceholder('Custom Monospace Font')
					.onChange((value: string) => this.updateCustomFontSetting('mono', value, state)));
		}
	}

	private updateTypographySetting(key: string, value: string, state: any): void {
		this.updateState({
			selectedTypography: {
				...state.selectedTypography,
				[key]: value
			}
		});
	}

	private updateCustomFontSetting(key: string, value: string, state: any): void {
		this.updateState({
			selectedTypography: {
				...state.selectedTypography,
				customFonts: {
					...state.selectedTypography.customFonts,
					[key]: value
				}
			}
		});
	}
}
