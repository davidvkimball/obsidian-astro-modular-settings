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
		const header = contentEl.createEl('h2', { text: 'Apply Template Preset' });
		header.style.marginTop = '0';

		// Warning message
		const warning = contentEl.createEl('p', { 
			text: 'Applying this template will change the following settings:' 
		});
		warning.style.marginBottom = '16px';

		// Changes list
		const changesList = contentEl.createEl('ul');
		changesList.style.marginBottom = '24px';
		changesList.style.paddingLeft = '20px';

		this.changes.forEach(change => {
			const listItem = changesList.createEl('li', { text: change });
			listItem.style.marginBottom = '4px';
		});

		// Question
		const question = contentEl.createEl('p', { 
			text: 'Do you want to apply this template?' 
		});
		question.style.fontWeight = 'bold';
		question.style.marginBottom = '24px';

		// Buttons container
		const buttonContainer = contentEl.createDiv('modal-button-container');
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '12px';
		buttonContainer.style.justifyContent = 'flex-end';

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
