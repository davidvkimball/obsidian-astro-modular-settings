import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class SiteInfoTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		this.refreshSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Site Information' });
		const description = settingsSection.createEl('p', { text: 'Configure your site metadata and basic information. Changes are applied to your config.ts file immediately.' });

		// Site URL
		this.createTextSetting(
			container,
			'Site URL',
			'Your site\'s base URL (e.g., https://yoursite.com)',
			this.settings.siteInfo.site,
			(value) => {
				this.settings.siteInfo.site = value;
			}
		);

		// Site Title
		this.createTextSetting(
			container,
			'Site Title',
			'Your site\'s title',
			this.settings.siteInfo.title,
			(value) => {
				this.settings.siteInfo.title = value;
			}
		);

		// Site Description
		this.createTextSetting(
			container,
			'Site Description',
			'A brief description of your site',
			this.settings.siteInfo.description,
			(value) => {
				this.settings.siteInfo.description = value;
			}
		);

		// Author Name
		this.createTextSetting(
			container,
			'Author Name',
			'Your name or the site author\'s name',
			this.settings.siteInfo.author,
			(value) => {
				this.settings.siteInfo.author = value;
			}
		);

		// Language
		this.createTextSetting(
			container,
			'Language',
			'Your site\'s primary language (ISO 639-1 code)',
			this.settings.siteInfo.language,
			(value) => {
				this.settings.siteInfo.language = value;
			}
		);
	}
}
