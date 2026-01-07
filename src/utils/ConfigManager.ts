import { App } from 'obsidian';
import { AstroModularSettings, PresetTemplate } from '../types';
import { ConfigFileManager } from './config/ConfigFileManager';
import { ConfigPresetModifier } from './config/ConfigPresetModifier';
import * as standardPreset from '../presets/standard.json';
import * as minimalPreset from '../presets/minimal.json';
import * as compactPreset from '../presets/compact.json';

export class ConfigManager {
	private app: App;
	public fileManager: ConfigFileManager;
	private presetModifier: ConfigPresetModifier;

	constructor(app: App) {
		this.app = app;
		this.fileManager = new ConfigFileManager(app);
		this.presetModifier = new ConfigPresetModifier();
	}

	getConfigFileInfo() {
		return this.fileManager.getConfigFileInfo();
	}

	readConfig(): string {
		return this.fileManager.readConfig();
	}

	writeConfig(content: string): boolean {
		return this.fileManager.writeConfig(content);
	}

	applyPreset(preset: PresetTemplate): boolean {
		// Read the existing config file
		const currentConfig = this.readConfig();
		
		// Modify the existing config based on the preset
		const modifiedConfig = this.presetModifier.modifyConfigFromPreset(preset, currentConfig);
		
		const writeResult = this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	async detectAstroDevServer(): Promise<boolean> {
		return this.fileManager.detectAstroDevServer();
	}

	updateIndividualFeatures(settings: AstroModularSettings): boolean {
		// Read the existing config file
		const currentConfig = this.readConfig();
		
		// Modify the existing config based on individual features
		const modifiedConfig = this.presetModifier.modifyConfigFromFeatures(settings, currentConfig);
		
		const writeResult = this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	updateThemeOnly(theme: string): boolean {
		// Read the existing config file
		const currentConfig = this.readConfig();
		
		// Update only the theme setting
		const modifiedConfig = this.presetModifier.updateThemeInConfig(currentConfig, theme);
		
		const writeResult = this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	updateFontOnly(fontType: 'heading' | 'prose' | 'mono', fontName: string): boolean {
		// Read the existing config file
		const currentConfig = this.readConfig();
		
		// Update only the specific font setting
		const modifiedConfig = this.presetModifier.updateFontInConfig(currentConfig, fontType, fontName);
		
		const writeResult = this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	updateFeatureOnly(featureName: string, value: boolean): boolean {
		// Read the existing config file
		const currentConfig = this.readConfig();
		
		// Update only the specific feature setting
		const modifiedConfig = this.presetModifier.updateFeatureInConfig(currentConfig, featureName, value);
		
		const writeResult = this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	async triggerRebuild(): Promise<void> {
		// In a real implementation, you might:
		// 1. Send a signal to the Astro dev server
		// 2. Use the Shell Commands plugin to restart the dev server
		// 3. Show instructions to the user
		// Notice will be shown by the main setup completion
	}

	getTemplatePreset(templateId: string): PresetTemplate | null {
		try {
			// Return the appropriate preset based on template ID using embedded data
			switch (templateId) {
				case 'standard':
					return standardPreset as PresetTemplate;
				case 'minimal':
					return minimalPreset as PresetTemplate;
				case 'compact':
					return compactPreset as PresetTemplate;
				default:
					console.error(`Unknown template ID: ${templateId}`);
					return null;
			}
		} catch (error) {
			console.error('Error loading template preset:', error);
			return null;
		}
	}

	getTemplateConfig(templateName: string, settings: AstroModularSettings): Record<string, unknown> {
		// Expose template config from presetModifier for template switching
		return this.presetModifier.getTemplateConfig(templateName, settings);
	}
}
