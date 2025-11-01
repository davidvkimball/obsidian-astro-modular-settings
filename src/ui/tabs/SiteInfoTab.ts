import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class SiteInfoTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

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
		assetsSection.style.marginTop = '30px';
		assetsSection.style.paddingTop = '20px';
		assetsSection.style.borderTop = '2px solid var(--background-modifier-border)';
		assetsSection.createEl('h3', { text: 'Assets & Metadata' });

		// Open Graph Image
		const ogImageSetting = new Setting(assetsSection)
			.setName('Open Graph image')
			.setDesc('Path to your Open Graph image (placed in public/ folder)');
		
		const ogImageInputContainer = ogImageSetting.controlEl.createDiv();
		ogImageInputContainer.style.display = 'flex';
		ogImageInputContainer.style.gap = '6px';
		ogImageInputContainer.style.alignItems = 'center';
		
		const ogImageInput = ogImageInputContainer.createEl('input', {
			type: 'text',
			placeholder: '/open-graph.png',
			value: settings.siteInfo.ogImage || '/open-graph.png',
			attr: { spellcheck: 'false' }
		});
		ogImageInput.style.flex = '1';
		ogImageInput.style.padding = '6px 8px';
		ogImageInput.style.border = '1px solid var(--background-modifier-border)';
		ogImageInput.style.borderRadius = '4px';
		ogImageInput.style.backgroundColor = 'var(--background-primary)';
		ogImageInput.style.color = 'var(--text-normal)';
		ogImageInput.style.fontSize = '12px';
		
		const ogImageFolderButton = ogImageInputContainer.createEl('button', {
			cls: 'clickable-icon',
			attr: { 'aria-label': 'Open public folder' }
		});
		ogImageFolderButton.style.padding = '4px';
		ogImageFolderButton.style.border = 'none';
		ogImageFolderButton.style.backgroundColor = 'transparent';
		ogImageFolderButton.style.color = 'var(--text-normal)';
		ogImageFolderButton.style.display = 'flex';
		ogImageFolderButton.style.alignItems = 'center';
		ogImageFolderButton.style.justifyContent = 'center';
		ogImageFolderButton.style.marginTop = '2px';
		
		const ogImageFolderIcon = ogImageFolderButton.createDiv();
		ogImageFolderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
		
		ogImageFolderButton.addEventListener('click', async () => {
			try {
				const publicPath = '../../public';
				await (this.app as any).openWithDefaultApp(publicPath);
			} catch (error) {
				new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
			}
		});
		
		let ogImageTimeoutId: number | null = null;
		ogImageInput.addEventListener('input', async () => {
			if (ogImageTimeoutId) clearTimeout(ogImageTimeoutId);
			settings.siteInfo.ogImage = ogImageInput.value.trim() || '/open-graph.png';
			await this.plugin.saveData(settings);
			ogImageTimeoutId = window.setTimeout(async () => {
				await this.applyCurrentConfiguration();
			}, 1000);
		});
		
		ogImageInput.addEventListener('blur', async () => {
			if (ogImageTimeoutId) {
				clearTimeout(ogImageTimeoutId);
				await this.applyCurrentConfiguration();
			}
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
			async () => await this.applyCurrentConfiguration()
		);

		// Favicon
		const faviconSetting = new Setting(assetsSection)
			.setName('Favicon')
			.setDesc('Path to your favicon (placed in public/ folder). Only used when theme-adaptive favicon is disabled.');
		
		const faviconInputContainer = faviconSetting.controlEl.createDiv();
		faviconInputContainer.style.display = 'flex';
		faviconInputContainer.style.gap = '6px';
		faviconInputContainer.style.alignItems = 'center';
		
		const faviconInput = faviconInputContainer.createEl('input', {
			type: 'text',
			placeholder: '/favicon.png',
			value: settings.siteInfo.favicon || '/favicon.png',
			attr: { spellcheck: 'false' }
		});
		faviconInput.style.flex = '1';
		faviconInput.style.padding = '6px 8px';
		faviconInput.style.border = '1px solid var(--background-modifier-border)';
		faviconInput.style.borderRadius = '4px';
		faviconInput.style.backgroundColor = 'var(--background-primary)';
		faviconInput.style.color = 'var(--text-normal)';
		faviconInput.style.fontSize = '12px';
		
		const faviconFolderButton = faviconInputContainer.createEl('button', {
			cls: 'clickable-icon',
			attr: { 'aria-label': 'Open public folder' }
		});
		faviconFolderButton.style.padding = '4px';
		faviconFolderButton.style.border = 'none';
		faviconFolderButton.style.backgroundColor = 'transparent';
		faviconFolderButton.style.color = 'var(--text-normal)';
		faviconFolderButton.style.display = 'flex';
		faviconFolderButton.style.alignItems = 'center';
		faviconFolderButton.style.justifyContent = 'center';
		faviconFolderButton.style.marginTop = '2px';
		
		const faviconFolderIcon = faviconFolderButton.createDiv();
		faviconFolderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
		
		faviconFolderButton.addEventListener('click', async () => {
			try {
				const publicPath = '../../public';
				await (this.app as any).openWithDefaultApp(publicPath);
			} catch (error) {
				new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
			}
		});
		
		let faviconTimeoutId: number | null = null;
		faviconInput.addEventListener('input', async () => {
			if (faviconTimeoutId) clearTimeout(faviconTimeoutId);
			settings.siteInfo.favicon = faviconInput.value.trim() || '/favicon.png';
			await this.plugin.saveData(settings);
			faviconTimeoutId = window.setTimeout(async () => {
				await this.applyCurrentConfiguration();
			}, 1000);
		});
		
		faviconInput.addEventListener('blur', async () => {
			if (faviconTimeoutId) {
				clearTimeout(faviconTimeoutId);
				await this.applyCurrentConfiguration();
			}
		});

		// Theme-adaptive favicon toggle
		const faviconAdaptiveSetting = new Setting(assetsSection)
			.setName('Theme-adaptive favicon')
			.setDesc('If enabled, favicon switches between light and dark variants based on browser theme preference')
			.addToggle(toggle => toggle
				.setValue(settings.siteInfo.faviconThemeAdaptive ?? true)
				.onChange(async (value) => {
					settings.siteInfo.faviconThemeAdaptive = value;
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
					// Re-render to show/hide light/dark favicon fields
					this.render(container);
					new Notice(`Theme-adaptive favicon ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Light/Dark favicon fields (only shown when theme-adaptive is enabled)
		if (settings.siteInfo.faviconThemeAdaptive ?? true) {
			// Light theme favicon
			const faviconLightSetting = new Setting(assetsSection)
				.setName('Light theme favicon')
				.setDesc('Path to your light theme favicon (placed in public/ folder)');
			
			const faviconLightInputContainer = faviconLightSetting.controlEl.createDiv();
			faviconLightInputContainer.style.display = 'flex';
			faviconLightInputContainer.style.gap = '6px';
			faviconLightInputContainer.style.alignItems = 'center';
			
			const faviconLightInput = faviconLightInputContainer.createEl('input', {
				type: 'text',
				placeholder: '/favicon-light.png',
				value: settings.siteInfo.faviconLight || '/favicon-light.png',
				attr: { spellcheck: 'false' }
			});
			faviconLightInput.style.flex = '1';
			faviconLightInput.style.padding = '6px 8px';
			faviconLightInput.style.border = '1px solid var(--background-modifier-border)';
			faviconLightInput.style.borderRadius = '4px';
			faviconLightInput.style.backgroundColor = 'var(--background-primary)';
			faviconLightInput.style.color = 'var(--text-normal)';
			faviconLightInput.style.fontSize = '12px';
			
			const faviconLightFolderButton = faviconLightInputContainer.createEl('button', {
				cls: 'clickable-icon',
				attr: { 'aria-label': 'Open public folder' }
			});
			faviconLightFolderButton.style.padding = '4px';
			faviconLightFolderButton.style.border = 'none';
			faviconLightFolderButton.style.backgroundColor = 'transparent';
			faviconLightFolderButton.style.color = 'var(--text-normal)';
			faviconLightFolderButton.style.display = 'flex';
			faviconLightFolderButton.style.alignItems = 'center';
			faviconLightFolderButton.style.justifyContent = 'center';
			faviconLightFolderButton.style.marginTop = '2px';
			
			const faviconLightFolderIcon = faviconLightFolderButton.createDiv();
			faviconLightFolderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
			
			faviconLightFolderButton.addEventListener('click', async () => {
				try {
					const publicPath = '../../public';
					await (this.app as any).openWithDefaultApp(publicPath);
				} catch (error) {
					new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
			
			let faviconLightTimeoutId: number | null = null;
			faviconLightInput.addEventListener('input', async () => {
				if (faviconLightTimeoutId) clearTimeout(faviconLightTimeoutId);
				settings.siteInfo.faviconLight = faviconLightInput.value.trim() || '/favicon-light.png';
				await this.plugin.saveData(settings);
				faviconLightTimeoutId = window.setTimeout(async () => {
					await this.applyCurrentConfiguration();
				}, 1000);
			});
			
			faviconLightInput.addEventListener('blur', async () => {
				if (faviconLightTimeoutId) {
					clearTimeout(faviconLightTimeoutId);
					await this.applyCurrentConfiguration();
				}
			});

			// Dark theme favicon
			const faviconDarkSetting = new Setting(assetsSection)
				.setName('Dark theme favicon')
				.setDesc('Path to your dark theme favicon (placed in public/ folder)');
			
			const faviconDarkInputContainer = faviconDarkSetting.controlEl.createDiv();
			faviconDarkInputContainer.style.display = 'flex';
			faviconDarkInputContainer.style.gap = '6px';
			faviconDarkInputContainer.style.alignItems = 'center';
			
			const faviconDarkInput = faviconDarkInputContainer.createEl('input', {
				type: 'text',
				placeholder: '/favicon-dark.png',
				value: settings.siteInfo.faviconDark || '/favicon-dark.png',
				attr: { spellcheck: 'false' }
			});
			faviconDarkInput.style.flex = '1';
			faviconDarkInput.style.padding = '6px 8px';
			faviconDarkInput.style.border = '1px solid var(--background-modifier-border)';
			faviconDarkInput.style.borderRadius = '4px';
			faviconDarkInput.style.backgroundColor = 'var(--background-primary)';
			faviconDarkInput.style.color = 'var(--text-normal)';
			faviconDarkInput.style.fontSize = '12px';
			
			const faviconDarkFolderButton = faviconDarkInputContainer.createEl('button', {
				cls: 'clickable-icon',
				attr: { 'aria-label': 'Open public folder' }
			});
			faviconDarkFolderButton.style.padding = '4px';
			faviconDarkFolderButton.style.border = 'none';
			faviconDarkFolderButton.style.backgroundColor = 'transparent';
			faviconDarkFolderButton.style.color = 'var(--text-normal)';
			faviconDarkFolderButton.style.display = 'flex';
			faviconDarkFolderButton.style.alignItems = 'center';
			faviconDarkFolderButton.style.justifyContent = 'center';
			faviconDarkFolderButton.style.marginTop = '2px';
			
			const faviconDarkFolderIcon = faviconDarkFolderButton.createDiv();
			faviconDarkFolderIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>';
			
			faviconDarkFolderButton.addEventListener('click', async () => {
				try {
					const publicPath = '../../public';
					await (this.app as any).openWithDefaultApp(publicPath);
				} catch (error) {
					new Notice(`Failed to open public folder: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
			
			let faviconDarkTimeoutId: number | null = null;
			faviconDarkInput.addEventListener('input', async () => {
				if (faviconDarkTimeoutId) clearTimeout(faviconDarkTimeoutId);
				settings.siteInfo.faviconDark = faviconDarkInput.value.trim() || '/favicon-dark.png';
				await this.plugin.saveData(settings);
				faviconDarkTimeoutId = window.setTimeout(async () => {
					await this.applyCurrentConfiguration();
				}, 1000);
			});
			
			faviconDarkInput.addEventListener('blur', async () => {
				if (faviconDarkTimeoutId) {
					clearTimeout(faviconDarkTimeoutId);
					await this.applyCurrentConfiguration();
				}
			});
		}
	}
}
