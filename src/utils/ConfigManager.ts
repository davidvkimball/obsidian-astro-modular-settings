import { App, Notice } from 'obsidian';
import { AstroModularSettings, PresetTemplate } from '../types';
import { ConfigFileManager } from './config/ConfigFileManager';
import { ConfigPresetModifier } from './config/ConfigPresetModifier';
import * as standardPreset from '../presets/standard.json';
import * as minimalPreset from '../presets/minimal.json';
import * as compactPreset from '../presets/compact.json';

export class ConfigManager {
	private app: App;
	private fileManager: ConfigFileManager;
	private presetModifier: ConfigPresetModifier;

	constructor(app: App) {
		this.app = app;
		this.fileManager = new ConfigFileManager(app);
		this.presetModifier = new ConfigPresetModifier();
	}

	async getConfigFileInfo() {
		return this.fileManager.getConfigFileInfo();
	}

	async readConfig(): Promise<string> {
		return this.fileManager.readConfig();
	}

	async writeConfig(content: string): Promise<boolean> {
		return this.fileManager.writeConfig(content);
	}

	async applyPreset(preset: PresetTemplate): Promise<boolean> {
		// Read the existing config file
		const currentConfig = await this.readConfig();
		
		// Modify the existing config based on the preset
		const modifiedConfig = this.presetModifier.modifyConfigFromPreset(preset, currentConfig);
		
		const writeResult = await this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	async detectAstroDevServer(): Promise<boolean> {
		return this.fileManager.detectAstroDevServer();
	}

	async updateIndividualFeatures(settings: AstroModularSettings): Promise<boolean> {
		console.log('[ConfigManager] updateIndividualFeatures called');
		console.log('[ConfigManager] Settings optionalFeatures.comments:', settings.optionalFeatures?.comments ? {
			repo: settings.optionalFeatures.comments.repo,
			repoId: settings.optionalFeatures.comments.repoId,
			enabled: settings.optionalFeatures.comments.enabled
		} : 'MISSING');
		
		// Read the existing config file
		const currentConfig = await this.readConfig();
		console.log('[ConfigManager] Config file read, length:', currentConfig.length);
		
		// Modify the existing config based on individual features
		const modifiedConfig = this.presetModifier.modifyConfigFromFeatures(settings, currentConfig);
		console.log('[ConfigManager] Config modified, length:', modifiedConfig.length);
		console.log('[ConfigManager] Config changed:', currentConfig !== modifiedConfig);
		
		const writeResult = await this.writeConfig(modifiedConfig);
		console.log('[ConfigManager] Write result:', writeResult);
		
		return writeResult;
	}

	async updateThemeOnly(theme: string): Promise<boolean> {
		// Read the existing config file
		const currentConfig = await this.readConfig();
		
		// Update only the theme setting
		const modifiedConfig = this.presetModifier.updateThemeInConfig(currentConfig, theme);
		
		const writeResult = await this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	async updateFontOnly(fontType: 'heading' | 'prose' | 'mono', fontName: string): Promise<boolean> {
		// Read the existing config file
		const currentConfig = await this.readConfig();
		
		// Update only the specific font setting
		const modifiedConfig = this.presetModifier.updateFontInConfig(currentConfig, fontType, fontName);
		
		const writeResult = await this.writeConfig(modifiedConfig);
		
		return writeResult;
	}

	async updateFeatureOnly(featureName: string, value: boolean): Promise<boolean> {
		// Read the existing config file
		const currentConfig = await this.readConfig();
		
		// Update only the specific feature setting
		const modifiedConfig = this.presetModifier.updateFeatureInConfig(currentConfig, featureName, value);
		
		const writeResult = await this.writeConfig(modifiedConfig);
		
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

	getTemplateConfig(templateName: string, settings: AstroModularSettings): any {
		// Expose template config from presetModifier for template switching
		return this.presetModifier.getTemplateConfig(templateName, settings);
	}
}
