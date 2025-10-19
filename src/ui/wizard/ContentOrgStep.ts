import { BaseWizardStep } from './BaseWizardStep';
import { ContentOrganizationType } from '../../types';

export class ContentOrgStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="content-org-selection">
				<h2>Content organization</h2>
				<p>Choose how you want to organize your content and assets.</p>
				<div class="org-options">
					<div class="org-option ${state.selectedContentOrg === 'file-based' ? 'selected' : ''}" 
						 data-org="file-based">
						<div class="org-header">
							<h3>File-based</h3>
							<span class="default-badge">Default</span>
						</div>
						<p>Single markdown files with images in attachments subfolder</p>
						<div class="org-example">
							<pre><code>posts/
├── my-post.md
└── attachments/
    └── image.jpg</code></pre>
						</div>
					</div>
					<div class="org-option ${state.selectedContentOrg === 'folder-based' ? 'selected' : ''}" 
						 data-org="folder-based">
						<div class="org-header">
							<h3>Folder-based</h3>
						</div>
						<p>Each post gets its own folder with co-located assets</p>
						<div class="org-example">
							<pre><code>posts/
├── my-post/
│   ├── index.md
│   └── image.jpg
└── another-post/
    ├── index.md
    └── image.jpg</code></pre>
						</div>
					</div>
				</div>
			</div>
		`;

		// Add click handlers
		container.querySelectorAll('.org-option').forEach(option => {
			option.addEventListener('click', () => {
				const org = option.getAttribute('data-org');
				if (org) {
					this.updateState({ selectedContentOrg: org as ContentOrganizationType });
					this.render(container);
				}
			});
		});
	}
}
