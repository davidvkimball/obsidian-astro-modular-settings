import { BaseWizardStep } from './BaseWizardStep';

export class ContentOrgStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const contentOrgSelection = container.createDiv('content-org-selection');
		contentOrgSelection.createEl('h2', { text: 'Content organization' });
		contentOrgSelection.createEl('p', { text: 'Choose how you want to organize your content and assets.' });
		
		const orgOptions = contentOrgSelection.createDiv('org-options');
		
		// File-based option
		const fileBasedOption = orgOptions.createDiv('org-option');
		if (state.selectedContentOrg === 'file-based') {
			fileBasedOption.addClass('selected');
		}
		fileBasedOption.setAttribute('data-org', 'file-based');
		
		const fileBasedHeader = fileBasedOption.createDiv('org-header');
		fileBasedHeader.createEl('h3', { text: 'File-based' });
		fileBasedHeader.createEl('span', { text: 'Default', cls: 'default-badge' });
		// False positive: Text is already in sentence case
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		fileBasedOption.createEl('p', { text: 'Single markdown files with images in attachments subfolder' });
		
		const fileBasedExample = fileBasedOption.createDiv('org-example');
		const fileBasedPre = fileBasedExample.createEl('pre');
		fileBasedPre.createEl('code', { text: 'posts/\n├── my-post.md\n└── attachments/\n    └── image.jpg' });
		
		// Folder-based option
		const folderBasedOption = orgOptions.createDiv('org-option');
		if (state.selectedContentOrg === 'folder-based') {
			folderBasedOption.addClass('selected');
		}
		folderBasedOption.setAttribute('data-org', 'folder-based');
		
		const folderBasedHeader = folderBasedOption.createDiv('org-header');
		folderBasedHeader.createEl('h3', { text: 'Folder-based' });
		folderBasedOption.createEl('p', { text: 'Each post gets its own folder with co-located assets' });
		
		const folderBasedExample = folderBasedOption.createDiv('org-example');
		const folderBasedPre = folderBasedExample.createEl('pre');
		folderBasedPre.createEl('code', { text: 'posts/\n├── my-post/\n│   ├── index.md\n│   └── image.jpg\n└── another-post/\n    ├── index.md\n    └── image.jpg' });
		
		// Add click handlers
		fileBasedOption.addEventListener('click', () => {
			this.updateState({ selectedContentOrg: 'file-based' });
			this.render(container);
		});
		
		folderBasedOption.addEventListener('click', () => {
			this.updateState({ selectedContentOrg: 'folder-based' });
			this.render(container);
		});
	}
}
