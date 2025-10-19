import { App, Modal, Plugin } from 'obsidian';
import { WizardStateManager } from './WizardState';

export abstract class BaseWizardStep {
	protected app: App;
	protected modal: Modal;
	protected stateManager: WizardStateManager;
	protected plugin: Plugin;

	constructor(
		app: App,
		modal: Modal,
		stateManager: WizardStateManager,
		plugin: Plugin
	) {
		this.app = app;
		this.modal = modal;
		this.stateManager = stateManager;
		this.plugin = plugin;
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
