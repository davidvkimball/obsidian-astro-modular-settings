import { App, TFile } from 'obsidian';
import { ConfigFileInfo, ObsidianVaultAdapter } from '../../types';

export class ConfigFileManager {
	private app: App;
	private configPath: string;

	constructor(app: App) {
		this.app = app;
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		this.configPath = '../config.ts';
	}

	async getConfigFileInfo(): Promise<ConfigFileInfo> {
		// The main Astro config.ts file is one level up from vault (src/config.ts)
		// NOTE: This plugin accesses files outside the Obsidian vault to manage Astro configuration.
		// This is necessary for the plugin's core functionality of managing Astro Modular theme settings.
		
		// Try to access the file outside the vault using Node.js fs
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			// Check if the parent directory exists
			const parentDir = path.dirname(configPath);
			
			if (fs.existsSync(configPath)) {
				const content = fs.readFileSync(configPath, 'utf8');
				const stats = fs.statSync(configPath);
				return {
					exists: true,
					path: configPath,
					content: content,
					lastModified: new Date(stats.mtime),
					valid: true,
					errors: []
				};
			} else {
				return {
					exists: false,
					path: configPath,
					content: '',
					lastModified: new Date(),
					valid: false,
					errors: ['Config file not found']
				};
			}
		} catch (error) {
			return {
				exists: false,
				path: this.configPath,
				content: '',
				lastModified: new Date(),
				valid: false,
				errors: ['Cannot access file outside vault']
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
		
		// Try to write the file outside the vault using Node.js fs
		try {
			const fs = require('fs');
			const path = require('path');
			// Get the actual vault path string from the adapter
			const adapter = this.app.vault.adapter as ObsidianVaultAdapter;
			const vaultPath = adapter.basePath || adapter.path;
			
			// If vaultPath is an object, try to get the string value
			const vaultPathString = typeof vaultPath === 'string' ? vaultPath : (vaultPath ? String(vaultPath) : '');
			
			const configPath = path.join(vaultPathString, '..', 'config.ts');
			
			fs.writeFileSync(configPath, content, 'utf8');
			return true;
		} catch (error) {
			return false;
		}
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
}
