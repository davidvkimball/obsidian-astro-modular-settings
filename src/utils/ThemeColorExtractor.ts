import { ThemeColors, SimpleThemeColors, ColorScale } from '../types';

export class ThemeColorExtractor {
	/**
	 * Extract colors from the currently active Obsidian theme
	 */
	static async extractObsidianThemeColors(): Promise<ThemeColors> {
		// Get computed styles from the document root
		const styles = getComputedStyle(document.body);
		
		// Extract primary colors (backgrounds and text)
		const primaryColors = this.extractPrimaryColors(styles);
		
		// Extract highlight/accent colors
		const highlightColors = this.extractHighlightColors(styles);
		
		return {
			primary: primaryColors,
			highlight: highlightColors
		};
	}

	/**
	 * Extract primary color scale from Obsidian theme
	 */
	private static extractPrimaryColors(styles: CSSStyleDeclaration): ColorScale {
		// Get multiple background colors to create a better scale
		const backgroundPrimary = this.getColorValue(styles, '--background-primary');
		const backgroundSecondary = this.getColorValue(styles, '--background-secondary');
		const backgroundModifierBorder = this.getColorValue(styles, '--background-modifier-border');
		
		// Determine if we're in a dark or light theme
		const backgroundRgb = this.hexToRgb(backgroundPrimary);
		const isDarkTheme = backgroundRgb ? (0.299 * backgroundRgb.r + 0.587 * backgroundRgb.g + 0.114 * backgroundRgb.b) / 255 < 0.5 : true;
		
		if (isDarkTheme) {
			// For dark themes, create a scale that goes from light to dark
			// Use backgroundSecondary as the main content color (700)
			// Use backgroundPrimary as the far background (900) - but make it darker like #1a1a1a
			return {
				50: this.lightenColor(backgroundSecondary, 95),   // Very light
				100: this.lightenColor(backgroundSecondary, 90),  // Light
				200: this.lightenColor(backgroundSecondary, 80),  // Light
				300: this.lightenColor(backgroundSecondary, 70),  // Medium light
				400: this.lightenColor(backgroundSecondary, 55),  // Medium
				500: this.lightenColor(backgroundSecondary, 40),  // Medium
				600: this.lightenColor(backgroundSecondary, 25),  // Medium dark
				700: backgroundSecondary,                          // Main content background
				800: this.darkenColor(backgroundPrimary, 20),     // Darker far background
				900: this.darkenColor(backgroundPrimary, 35),     // Very dark (like #1a1a1a)
				950: this.darkenColor(backgroundPrimary, 50),     // Darkest
			};
		} else {
			// For light themes, use the standard scale generation
			return this.createBetterColorScale(backgroundPrimary, true, isDarkTheme);
		}
	}

	/**
	 * Extract highlight color scale from Obsidian theme
	 */
	private static extractHighlightColors(styles: CSSStyleDeclaration): ColorScale {
		// Try multiple color sources in order of preference
		const baseColor = this.getColorValue(styles, '--text-accent') || 
						  this.getColorValue(styles, '--interactive-accent') ||
						  this.getColorValue(styles, '--text-a') ||
						  this.getColorValue(styles, '--text-link');
		
		const hoverColor = this.getColorValue(styles, '--text-accent-hover') || 
						   this.getColorValue(styles, '--text-a-hover') ||
						   baseColor;
		
		// Use the raw colors directly in the scale
		return {
			50: hoverColor,   // Hover/lighter variant
			100: hoverColor,  // Hover/lighter variant
			200: hoverColor,  // Hover/lighter variant
			300: baseColor,   // Base color
			400: baseColor,   // Base color
			500: baseColor,   // Base color
			600: baseColor,   // Base color
			700: baseColor,   // Base color
			800: baseColor,   // Base color
			900: baseColor,   // Base color
		};
	}


	/**
	 * Get color value from CSS custom property with fallback
	 */
	private static getColorValue(styles: CSSStyleDeclaration, property: string): string {
		const value = styles.getPropertyValue(property).trim();
		if (!value) {
			// Fallback colors if CSS variables are not available
			switch (property) {
				case '--background-primary':
					return '#1e1e1e';
				case '--background-secondary':
					return '#2d2d2d';
				case '--background-modifier-border':
					return '#3a3a3a';
				case '--text-normal':
					return '#dcddde';
				case '--text-muted':
					return '#72767d';
				case '--text-faint':
					return '#484b51';
				case '--text-accent':
					return '#708794';
				case '--ax1':
					return '#708794';
				case '--ax2':
					return '#889eaa';
				case '--ax3':
					return '#5a6d77';
				case '--text-accent-hover':
					return '#889eaa';
				case '--text-a':
					return '#f8c537';
				case '--text-a-hover':
					return '#f8c537';
				case '--text-link':
					return '#83a598';
				case '--interactive-accent':
					return '#5865f2';
				default:
					return '#666666';
			}
		}
		
		// Convert CSS color values to hex format
		return this.convertToHex(value);
	}

	/**
	 * Convert CSS color value to hex format
	 */
	private static convertToHex(colorValue: string): string {
		// If it's already a hex color, return as is
		if (colorValue.startsWith('#')) {
			return colorValue;
		}

		// Create a temporary element to compute the color
		const tempElement = document.createElement('div');
		tempElement.style.color = colorValue;
		document.body.appendChild(tempElement);
		
		const computedColor = getComputedStyle(tempElement).color;
		document.body.removeChild(tempElement);
		
		// Convert rgb/rgba to hex
		const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (rgbMatch) {
			const r = parseInt(rgbMatch[1]);
			const g = parseInt(rgbMatch[2]);
			const b = parseInt(rgbMatch[3]);
			return this.rgbToHex(r, g, b);
		}
		
		// Convert hsl to hex
		const hslMatch = colorValue.match(/hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/);
		if (hslMatch) {
			const h = parseInt(hslMatch[1]);
			const s = parseInt(hslMatch[2]);
			const l = parseInt(hslMatch[3]);
			return this.hslToHex(h, s, l);
		}
		
		// If we can't convert, return a fallback
		return '#666666';
	}


	/**
	 * Convert HSL to hex color
	 */
	private static hslToHex(h: number, s: number, l: number): string {
		const hNorm = h / 360;
		const sNorm = s / 100;
		const lNorm = l / 100;

		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		};

		let r, g, b;

		if (sNorm === 0) {
			r = g = b = lNorm; // achromatic
		} else {
			const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
			const p = 2 * lNorm - q;
			r = hue2rgb(p, q, hNorm + 1/3);
			g = hue2rgb(p, q, hNorm);
			b = hue2rgb(p, q, hNorm - 1/3);
		}

		return this.rgbToHex(
			Math.round(r * 255),
			Math.round(g * 255),
			Math.round(b * 255)
		);
	}

	/**
	 * Generate full color scale from simple colors
	 */
	static generateColorScaleFromSimple(accent: string, background: string): ThemeColors {
		return {
			primary: this.generatePrimaryScale(background),
			highlight: this.generateHighlightScale(accent)
		};
	}

	/**
	 * Generate primary color scale from background color
	 */
	private static generatePrimaryScale(baseColor: string): ColorScale {
		return {
			50: this.lightenColor(baseColor, 95),
			100: this.lightenColor(baseColor, 85),
			200: this.lightenColor(baseColor, 75),
			300: this.lightenColor(baseColor, 50),
			400: this.lightenColor(baseColor, 25),
			500: baseColor,
			600: this.darkenColor(baseColor, 15),
			700: this.darkenColor(baseColor, 30),
			800: this.darkenColor(baseColor, 45),
			900: this.darkenColor(baseColor, 60),
			950: this.darkenColor(baseColor, 75),
		};
	}

	/**
	 * Generate highlight color scale from accent color
	 */
	private static generateHighlightScale(baseColor: string): ColorScale {
		return {
			50: this.lightenColor(baseColor, 95),
			100: this.lightenColor(baseColor, 85),
			200: this.lightenColor(baseColor, 75),
			300: this.lightenColor(baseColor, 65),
			400: this.lightenColor(baseColor, 55),
			500: baseColor,
			600: this.darkenColor(baseColor, 10),
			700: this.darkenColor(baseColor, 20),
			800: this.darkenColor(baseColor, 30),
			900: this.darkenColor(baseColor, 40),
		};
	}

	/**
	 * Lighten a hex color by a percentage
	 */
	private static lightenColor(hex: string, percent: number): string {
		const rgb = this.hexToRgb(hex);
		if (!rgb) return hex;

		const { r, g, b } = rgb;
		const factor = percent / 100;
		
		return this.rgbToHex(
			Math.round(r + (255 - r) * factor),
			Math.round(g + (255 - g) * factor),
			Math.round(b + (255 - b) * factor)
		);
	}

	/**
	 * Darken a hex color by a percentage
	 */
	private static darkenColor(hex: string, percent: number): string {
		const rgb = this.hexToRgb(hex);
		if (!rgb) return hex;

		const { r, g, b } = rgb;
		const factor = percent / 100;
		
		return this.rgbToHex(
			Math.round(r * (1 - factor)),
			Math.round(g * (1 - factor)),
			Math.round(b * (1 - factor))
		);
	}

	/**
	 * Create a more aggressive lightening function for better contrast
	 */
	private static aggressiveLighten(hex: string, percent: number): string {
		const rgb = this.hexToRgb(hex);
		if (!rgb) return hex;

		const { r, g, b } = rgb;
		const factor = percent / 100;
		
		// Use a more aggressive lightening algorithm
		return this.rgbToHex(
			Math.round(Math.min(255, r + (255 - r) * factor * 1.2)),
			Math.round(Math.min(255, g + (255 - g) * factor * 1.2)),
			Math.round(Math.min(255, b + (255 - b) * factor * 1.2))
		);
	}

	/**
	 * Create a more aggressive darkening function for better contrast
	 */
	private static aggressiveDarken(hex: string, percent: number): string {
		const rgb = this.hexToRgb(hex);
		if (!rgb) return hex;

		const { r, g, b } = rgb;
		const factor = percent / 100;
		
		// Use a more aggressive darkening algorithm
		return this.rgbToHex(
			Math.round(Math.max(0, r * (1 - factor * 1.2))),
			Math.round(Math.max(0, g * (1 - factor * 1.2))),
			Math.round(Math.max(0, b * (1 - factor * 1.2)))
		);
	}

	/**
	 * Create a more sophisticated color scale that better matches theme expectations
	 */
	private static createBetterColorScale(baseColor: string, isPrimary: boolean = true, isDarkTheme: boolean = true): ColorScale {
		const rgb = this.hexToRgb(baseColor);
		if (!rgb) {
			// Fallback to simple scale if color parsing fails
			return this.generatePrimaryScale(baseColor);
		}

		const { r, g, b } = rgb;
		
		// Calculate luminance to determine if this is a light or dark color
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		const isDark = luminance < 0.5;

		if (isPrimary) {
			// Primary colors: create a scale from very light to very dark
			// Use more dramatic differences for better contrast between background shades
			return {
				50: isDark ? this.lightenColor(baseColor, 95) : this.darkenColor(baseColor, 95),
				100: isDark ? this.lightenColor(baseColor, 90) : this.darkenColor(baseColor, 90),
				200: isDark ? this.lightenColor(baseColor, 80) : this.darkenColor(baseColor, 80),
				300: isDark ? this.lightenColor(baseColor, 70) : this.darkenColor(baseColor, 70),
				400: isDark ? this.lightenColor(baseColor, 55) : this.darkenColor(baseColor, 55),
				500: isDark ? this.lightenColor(baseColor, 40) : this.darkenColor(baseColor, 40),
				600: isDark ? this.lightenColor(baseColor, 25) : this.darkenColor(baseColor, 25),
				700: baseColor,
				800: isDark ? this.darkenColor(baseColor, 20) : this.lightenColor(baseColor, 20),
				900: isDark ? this.darkenColor(baseColor, 35) : this.lightenColor(baseColor, 35),
				950: isDark ? this.darkenColor(baseColor, 50) : this.lightenColor(baseColor, 50),
			};
		} else {
			// Highlight colors: create a scale from very light to very dark
			// Adjust the scale based on whether we're in dark or light theme
			if (isDarkTheme) {
				// For dark themes, use the base color as the 500 shade (the vibrant one)
				// and create lighter and darker variations around it
				// Make the 400 shade much closer to the base color for better contrast
				return {
					50: this.lightenColor(baseColor, 95),   // Very light
					100: this.lightenColor(baseColor, 85),  // Light
					200: this.lightenColor(baseColor, 75),  // Light
					300: this.lightenColor(baseColor, 65),  // Medium light
					400: this.lightenColor(baseColor, 25),  // Much closer to base color
					500: baseColor,                         // 🎯 Use the vibrant base color as 500
					600: this.darkenColor(baseColor, 15),   // Medium dark
					700: this.darkenColor(baseColor, 30),   // Darker
					800: this.darkenColor(baseColor, 45),   // Very dark
					900: this.darkenColor(baseColor, 60),   // Darkest
				};
			} else {
				// For light themes, we want darker highlights for better contrast
				// Shift the scale so darker colors are more prominent
				return {
					50: this.lightenColor(baseColor, 60),   // Very light
					100: this.lightenColor(baseColor, 50),  // Light
					200: this.lightenColor(baseColor, 40),  // Light
					300: this.lightenColor(baseColor, 30),  // Medium light
					400: this.lightenColor(baseColor, 20),  // Medium light
					500: baseColor,                          // Base color
					600: this.darkenColor(baseColor, 20),   // Medium dark
					700: this.darkenColor(baseColor, 40),   // Dark
					800: this.darkenColor(baseColor, 60),   // Darker
					900: this.darkenColor(baseColor, 80),   // Very dark
				};
			}
		}
	}

	/**
	 * Convert hex color to RGB
	 */
	private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
		// Remove # if present
		hex = hex.replace('#', '');
		
		// Handle 3-digit hex
		if (hex.length === 3) {
			hex = hex.split('').map(char => char + char).join('');
		}
		
		// Handle 6-digit hex
		if (hex.length === 6) {
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			return { r, g, b };
		}
		
		return null;
	}

	/**
	 * Convert RGB to hex color
	 */
	private static rgbToHex(r: number, g: number, b: number): string {
		const toHex = (n: number) => {
			const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}

	/**
	 * Validate if a string is a valid hex color
	 */
	static isValidHexColor(color: string): boolean {
		return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
	}

	/**
	 * Generate theme file content from colors
	 */
	static generateThemeFileContent(colors: ThemeColors, themeName: string = 'custom'): string {
		const timestamp = new Date().toISOString();
		
		return `// Custom theme extracted from Obsidian
// Generated: ${timestamp}

export const ${themeName}Theme = {
  primary: {
    50: "${colors.primary[50]}",
    100: "${colors.primary[100]}",
    200: "${colors.primary[200]}",
    300: "${colors.primary[300]}",
    400: "${colors.primary[400]}",
    500: "${colors.primary[500]}",
    600: "${colors.primary[600]}",
    700: "${colors.primary[700]}",
    800: "${colors.primary[800]}",
    900: "${colors.primary[900]}",
    950: "${colors.primary[950]}"
  },
  highlight: {
    50: "${colors.highlight[50]}",
    100: "${colors.highlight[100]}",
    200: "${colors.highlight[200]}",
    300: "${colors.highlight[300]}",
    400: "${colors.highlight[400]}",
    500: "${colors.highlight[500]}",
    600: "${colors.highlight[600]}",
    700: "${colors.highlight[700]}",
    800: "${colors.highlight[800]}",
    900: "${colors.highlight[900]}"
  }
};
`;
	}
}
