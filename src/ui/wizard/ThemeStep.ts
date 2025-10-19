import { BaseWizardStep } from './BaseWizardStep';
import { THEME_OPTIONS, ThemeType } from '../../types';

export class ThemeStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		const isDarkMode = this.isObsidianDarkMode();
		
		container.innerHTML = `
			<div class="theme-selection">
				<h2>Choose your theme</h2>
				<p>Select a color scheme that matches your style and content.</p>
				<div class="theme-options">
					${THEME_OPTIONS.map(theme => `
						<div class="theme-option ${state.selectedTheme === theme.id ? 'selected' : ''}" 
							 data-theme="${theme.id}" 
							 style="background: ${isDarkMode ? theme.backgroundColorDark : theme.backgroundColorLight};">
							<div class="theme-preview" style="background: linear-gradient(135deg, ${theme.previewColors.join(', ')});">
								<div class="theme-preview-content">
									<div class="preview-text">Sample Text</div>
									<div class="preview-accent">Accent</div>
								</div>
							</div>
							<div class="theme-info">
								<h3>${theme.name}</h3>
							</div>
						</div>
					`).join('')}
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.theme-option').forEach(option => {
			option.addEventListener('click', () => {
				const theme = option.getAttribute('data-theme');
				if (theme) {
					this.updateState({ selectedTheme: theme as ThemeType });
					this.render(container);
				}
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
