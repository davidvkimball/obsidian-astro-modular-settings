import { Modal, App } from 'obsidian';

export class PresetWarningModal extends Modal {
	private onConfirm: () => void;
	private onCancel: () => void;
	private changes: string[];

	constructor(app: App, changes: string[], onConfirm: () => void, onCancel: () => void) {
		super(app);
		this.changes = changes;
		this.onConfirm = onConfirm;
		this.onCancel = onCancel;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Modal header
		const header = contentEl.createEl('h2', { text: 'Apply template preset' });
		header.addClass('preset-warning-modal-header');

		// Warning message
		const warning = contentEl.createEl('p', { 
			text: 'Applying this template will change the following settings:' 
		});
		warning.addClass('preset-warning-message');

		// Changes list
		const changesList = contentEl.createEl('ul');
		changesList.addClass('preset-warning-changes-list');

		this.changes.forEach(change => {
			const listItem = changesList.createEl('li', { text: change });
			listItem.addClass('preset-warning-list-item');
		});

		// Question
		const question = contentEl.createEl('p', { 
			text: 'Do you want to apply this template?' 
		});
		question.addClass('preset-warning-question');

		// Buttons container
		const buttonContainer = contentEl.createDiv('modal-button-container');

		// Cancel button
		const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelButton.className = 'mod-cta';
		cancelButton.addEventListener('click', () => {
			this.onCancel();
			this.close();
		});

		// Confirm button
		const confirmButton = buttonContainer.createEl('button', { text: 'Continue' });
		confirmButton.className = 'mod-warning';
		confirmButton.addEventListener('click', () => {
			this.onConfirm();
			this.close();
		});

		// Focus the confirm button
		confirmButton.focus();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
