import { App, Modal } from 'obsidian';
import { ConfigManager } from '../../utils/ConfigManager';
import { PluginManager } from '../../utils/PluginManager';
import { WizardStateManager } from './WizardState';

export abstract class BaseWizardStep {
	protected app: App;
	protected modal: Modal;
	protected stateManager: WizardStateManager;
	protected configManager: ConfigManager;
	protected pluginManager: PluginManager;

	constructor(
		app: App,
		modal: Modal,
		stateManager: WizardStateManager,
		configManager: ConfigManager,
		pluginManager: PluginManager
	) {
		this.app = app;
		this.modal = modal;
		this.stateManager = stateManager;
		this.configManager = configManager;
		this.pluginManager = pluginManager;
	}

	abstract render(container: HTMLElement): void;

	protected nextStep(): void {
		this.stateManager.nextStep();
		this.modal.close();
		// The modal will re-render with the new step
	}

	protected previousStep(): void {
		this.stateManager.previousStep();
		this.modal.close();
		// The modal will re-render with the new step
	}

	protected updateState(updates: any): void {
		this.stateManager.updateState(updates);
	}

	protected getState() {
		return this.stateManager.getState();
	}
}
