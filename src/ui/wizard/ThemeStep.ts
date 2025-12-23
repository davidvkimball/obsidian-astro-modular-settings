import { BaseWizardStep } from './BaseWizardStep';
import { THEME_OPTIONS } from '../../types';

export class ThemeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		const isDarkMode = this.isObsidianDarkMode();
		
		// Filter out 'custom' theme from wizard - it's only for advanced users in settings
		const wizardThemes = THEME_OPTIONS.filter(theme => theme.id !== 'custom');
		
		const themeSelection = container.createDiv('theme-selection');
		themeSelection.createEl('h2', { text: 'Choose your theme' });
		themeSelection.createEl('p', { text: 'Select a color scheme that matches your style and content.' });
		
		const themeOptions = themeSelection.createDiv('theme-options');
		
		wizardThemes.forEach(theme => {
			const themeOption = themeOptions.createDiv('theme-option');
			if (state.selectedTheme === theme.id) {
				themeOption.addClass('selected');
			}
			themeOption.setAttribute('data-theme', theme.id);
			// Set dynamic background
			themeOption.setCssProps({
				background: isDarkMode ? theme.backgroundColorDark : theme.backgroundColorLight
			});
			
			const themePreview = themeOption.createDiv('theme-preview');
			// Set dynamic background
			themePreview.setCssProps({
				background: `linear-gradient(135deg, ${theme.previewColors.join(', ')})`
			});
			
			const previewContent = themePreview.createDiv('theme-preview-content');
			const previewText = previewContent.createDiv('preview-text');
			previewText.textContent = 'Sample text';
			const previewAccent = previewContent.createDiv('preview-accent');
			previewAccent.textContent = 'Accent';
			
			const themeInfo = themeOption.createDiv('theme-info');
			themeInfo.createEl('h3', { text: theme.name });
			
			// Add click handler
			themeOption.addEventListener('click', () => {
				this.updateState({ selectedTheme: theme.id });
				this.render(container);
			});
		});
	}

	private isObsidianDarkMode(): boolean {
		// Check if Obsidian is in dark mode by looking at the body class or CSS custom properties
		const body = document.body;
		const isDarkClass = body.classList.contains('theme-dark') || body.classList.contains('dark');
		
		// Also check CSS custom properties as a fallback
		const computedStyle = getComputedStyle(document.documentElement);
		const colorScheme = computedStyle.getPropertyValue('color-scheme').trim();
		const isDarkProperty = colorScheme === 'dark';
		
		// Check if the background is dark by looking at the primary background color
		const bgColor = computedStyle.getPropertyValue('--background-primary').trim();
		const isDarkBackground = Boolean(bgColor && (
			bgColor.includes('#') && parseInt(bgColor.slice(1, 3), 16) < 128 ||
			bgColor.includes('rgb') && bgColor.includes('0, 0, 0') ||
			bgColor.includes('hsl') && bgColor.includes('0, 0%, 0%')
		));
		
		return isDarkClass || isDarkProperty || isDarkBackground;
	}
}
