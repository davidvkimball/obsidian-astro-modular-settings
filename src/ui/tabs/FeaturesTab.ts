import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class FeaturesTab extends TabRenderer {
	render(container: HTMLElement): void {
		container.empty();
		this.refreshSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Feature Configuration' });
		const description = settingsSection.createEl('p', { text: 'Enable or disable specific features for your site. Changes are applied to your config.ts file immediately when you toggle them.' });

		// Feature toggles
		const features = [
			{ key: 'commandPalette', name: 'Command palette', desc: 'Add a command palette to your site' },
			{ key: 'tableOfContents', name: 'Table of contents', desc: 'Show table of contents on pages' },
			{ key: 'readingTime', name: 'Reading time', desc: 'Display estimated reading time' },
			{ key: 'linkedMentions', name: 'Linked mentions', desc: 'Show linked mentions and backlinks' },
			{ key: 'graphView', name: 'Graph view', desc: 'Show graph view of post connections' },
			{ key: 'postNavigation', name: 'Post navigation', desc: 'Show next/previous post navigation' },
			{ key: 'scrollToTop', name: 'Scroll to top', desc: 'Show scroll to top button' },
			{ key: 'showSocialIconsInFooter', name: 'Social icons in footer', desc: 'Show social icons in footer' },
			{ key: 'profilePicture', name: 'Profile picture', desc: 'Show profile picture in header' },
			{ key: 'comments', name: 'Comments', desc: 'Enable comment system' }
		];

		features.forEach(feature => {
			const featureKey = feature.key as keyof typeof this.settings.features;
			const currentValue = this.settings.features[featureKey];
			const boolValue = typeof currentValue === 'boolean' ? currentValue : false;
			
			new Setting(container)
				.setName(feature.name)
				.setDesc(feature.desc)
				.addToggle(toggle => toggle
					.setValue(boolValue)
					.onChange(async (value) => {
						(this.settings.features as any)[featureKey] = value;
						await this.plugin.saveData(this.settings);
						
						// Apply changes immediately to config.ts
						try {
							await this.applyCurrentConfiguration();
							new Notice(`${feature.name} ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
						} catch (error) {
							new Notice(`Failed to apply ${feature.name} to config.ts: ${error instanceof Error ? error.message : String(error)}`);
						}
					}));
		});

		// Note about immediate application
		const noteSection = container.createDiv('settings-section');
		noteSection.createEl('p', { 
			text: 'All changes are applied to your config.ts file immediately when you toggle features.',
			cls: 'setting-item-description'
		});
	}
}