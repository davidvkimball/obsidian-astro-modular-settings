import { App, Notice } from 'obsidian';
import { AstroModularSettings, PresetTemplate } from '../types';
import { ConfigFileManager } from './config/ConfigFileManager';
import { ConfigPresetModifier } from './config/ConfigPresetModifier';
import * as standardPreset from '../presets/standard.json';
import * as minimalPreset from '../presets/minimal.json';
import * as compactPreset from '../presets/compact.json';
import * as documentationPreset from '../presets/documentation.json';

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
		// Read the existing config file
		const currentConfig = await this.readConfig();
		
		// Modify the existing config based on individual features
		const modifiedConfig = this.presetModifier.modifyConfigFromFeatures(settings, currentConfig);
		
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
				case 'documentation':
					return documentationPreset as PresetTemplate;
				default:
					console.error(`Unknown template ID: ${templateId}`);
					return null;
			}
		} catch (error) {
			console.error('Error loading template preset:', error);
			return null;
		}
	}
}
