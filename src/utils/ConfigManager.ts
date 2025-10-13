import { App, TFile, Notice } from 'obsidian';
import { AstroModularSettings, ConfigFileInfo, PresetTemplate } from '../types';

export class ConfigManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		this.configPath = 'astro.config.ts';
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		const file = this.app.vault.getAbstractFileByPath(this.configPath) as TFile;
		
		if (!file) {
			return {
				exists: false,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: ['Config file not found']
			};
		}

		try {
			const content = await this.app.vault.read(file);
			const lastModified = new Date(file.stat.mtime);
			
			// Basic validation - check if it's a valid TypeScript file
			const valid = this.validateConfigContent(content);
			const errors = valid ? [] : ['Invalid TypeScript syntax or missing required exports'];

			return {
				exists: true,
				path: this.configPath,
				content,
				lastModified,
				valid,
				errors
			};
		} catch (error) {
			return {
				exists: true,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: [`Error reading file: ${error.message}`]
			};
		}
	}

	private validateConfigContent(content: string): boolean {
		// Basic validation - check for common Astro config patterns
		return content.includes('defineConfig') || 
			   content.includes('export default') ||
			   content.includes('astro/config');
	}

	async readConfig(): Promise<string> {
		const fileInfo = await this.getConfigFileInfo();
		return fileInfo.content;
	}

	async writeConfig(content: string): Promise<boolean> {
		try {
			await this.app.vault.create(this.configPath, content);
			new Notice('Configuration updated successfully');
			return true;
		} catch (error) {
			// If file exists, try to modify it
			try {
				await this.app.vault.modify(
					this.app.vault.getAbstractFileByPath(this.configPath) as TFile,
					content
				);
				new Notice('Configuration updated successfully');
				return true;
			} catch (modifyError) {
				new Notice(`Error updating configuration: ${modifyError.message}`);
				return false;
			}
		}
	}

	async applyPreset(preset: PresetTemplate): Promise<boolean> {
		const currentConfig = await this.readConfig();
		const newConfig = this.generateConfigFromPreset(preset, currentConfig);
		return await this.writeConfig(newConfig);
	}

	private generateConfigFromPreset(preset: PresetTemplate, currentConfig: string): string {
		// This is a simplified config generator
		// In a real implementation, you'd parse the existing config and merge changes
		const configTemplate = `import { defineConfig } from 'astro/config';
import astroModular from '@astro-modular/theme';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    astroModular({
      theme: '${preset.theme}',
      contentOrganization: '${preset.contentOrganization}',
      features: {
        commandPalette: ${preset.features.commandPalette},
        tableOfContents: ${preset.features.tableOfContents},
        readingTime: ${preset.features.readingTime},
        linkedMentions: ${preset.features.linkedMentions},
        comments: ${preset.features.comments},
      },
    }),
  ],
});`;

		return configTemplate;
	}

	async detectAstroDevServer(): Promise<boolean> {
		// Check if Astro dev server is running by looking for common indicators
		// This is a simplified check - in reality you'd need more sophisticated detection
		const packageJson = this.app.vault.getAbstractFileByPath('package.json');
		if (packageJson) {
			try {
				const content = await this.app.vault.read(packageJson as TFile);
				return content.includes('astro') && content.includes('dev');
			} catch {
				return false;
			}
		}
		return false;
	}

	async triggerRebuild(): Promise<void> {
		// In a real implementation, you might:
		// 1. Send a signal to the Astro dev server
		// 2. Use the Shell Commands plugin to restart the dev server
		// 3. Show instructions to the user
		new Notice('Configuration updated. Please restart your Astro dev server to see changes.');
	}
}
