import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class NavigationTab extends TabRenderer {
	private saveTimeoutId: number | null = null;

	render(container: HTMLElement): void {
		container.empty();
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');
		const header = settingsSection.createEl('h2', { text: 'Navigation' });
		const description = settingsSection.createEl('p', { text: 'Configure your site navigation pages and social links. Changes are applied to your config.ts file immediately.' });

		// Navigation pages section
		const pagesSection = container.createDiv('settings-section');
		pagesSection.createEl('h3', { text: 'Navigation Pages' });
		pagesSection.createEl('p', { text: 'Add or remove pages from your main navigation menu.' });

		// Display existing pages using innerHTML like the wizard
		const pagesList = pagesSection.createDiv('nav-items');
		pagesList.id = 'pages-list';
		pagesList.innerHTML = `
			${settings.navigation.pages.map((page: any, index: number) => `
				<div class="nav-item" data-index="${index}" draggable="true">
					<div class="nav-item-content">
						<div class="nav-item-fields">
							<input type="text" class="nav-title" placeholder="Page Title" value="${page.title}" draggable="false">
							<input type="text" class="nav-url" placeholder="/page-url" value="${page.url}" draggable="false">
						</div>
						<button class="nav-remove mod-warning" data-index="${index}">Remove</button>
					</div>
				</div>
			`).join('')}
		`;

		// Add page button
		new Setting(pagesSection)
			.setName('Add Page')
			.setDesc('Add a new page to your navigation')
				.addButton(button => button
					.setButtonText('+ Add Page')
					.setCta()
					.onClick(async () => {
						settings.navigation.pages.push({ title: 'New Page', url: '/new-page' });
						await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration();
						this.render(container); // Re-render
					}));

		// Social links section
		const socialSection = container.createDiv('settings-section');
		socialSection.createEl('h3', { text: 'Social Links' });
		socialSection.createEl('p', { text: 'Configure your social media links in the footer.' });

		// Display existing social links using innerHTML like the wizard
		const socialList = socialSection.createDiv('nav-items');
		socialList.id = 'social-list';
		socialList.innerHTML = `
			${settings.navigation.social.map((social: any, index: number) => `
				<div class="nav-item" data-index="${index}" draggable="true">
					<div class="nav-item-content">
						<div class="nav-item-fields">
							<input type="text" class="nav-title" placeholder="Social Title" value="${social.title}" draggable="false">
							<input type="text" class="nav-url" placeholder="https://example.com" value="${social.url}" draggable="false">
						</div>
						<button class="nav-remove mod-warning" data-index="${index}">Remove</button>
					</div>
					<div class="nav-icon-row">
						<input type="text" class="nav-icon" placeholder="icon-name" value="${social.icon || ''}" draggable="false">
						<div class="nav-icon-help">
							<small>Icon names from FontAwesome Brands</small>
						</div>
					</div>
				</div>
			`).join('')}
		`;

		// Add social link button
		new Setting(socialSection)
			.setName('Add Social Link')
			.setDesc('Add a new social media link')
				.addButton(button => button
					.setButtonText('+ Add Social Link')
					.setCta()
					.onClick(async () => {
						settings.navigation.social.push({ title: 'New Social', url: 'https://example.com', icon: '' });
						await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration();
						this.render(container); // Re-render
					}));


		// Setup event delegation for input fields and remove buttons
		this.setupEventDelegation(container);
		
		// Drag and drop functionality - EXACT copy from wizard
		this.setupDragAndDrop(container);
	}

	private setupDragAndDrop(container: HTMLElement): void {
		let draggedElement: HTMLElement | null = null;

		// Drag start
		container.addEventListener('dragstart', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				draggedElement = target;
				target.style.opacity = '0.5';
			}
		});

		// Drag end
		container.addEventListener('dragend', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.style.opacity = '1';
				draggedElement = null;
			}
		});

		// Drag over
		container.addEventListener('dragover', (e) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item') && draggedElement && target !== draggedElement) {
				const rect = target.getBoundingClientRect();
				const midpoint = rect.top + rect.height / 2;
				
				if (e.clientY < midpoint) {
					target.style.borderTop = '2px solid var(--interactive-accent)';
					target.style.borderBottom = 'none';
				} else {
					target.style.borderBottom = '2px solid var(--interactive-accent)';
					target.style.borderTop = 'none';
				}
			}
		});

		// Drag leave
		container.addEventListener('dragleave', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.style.borderTop = 'none';
				target.style.borderBottom = 'none';
			}
		});

		// Drop
		container.addEventListener('drop', async (e) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			
			if (target.classList.contains('nav-item') && draggedElement) {
				const targetIndex = parseInt(target.getAttribute('data-index') || '0');
				const draggedIndex = parseInt(draggedElement.getAttribute('data-index') || '0');
				const isPage = target.closest('#pages-list');
				const isSocial = target.closest('#social-list');
				
				// Clear visual indicators
				target.style.borderTop = 'none';
				target.style.borderBottom = 'none';
				
				if (targetIndex !== draggedIndex) {
					const settings = this.getSettings();
					if (isPage) {
						const newPages = [...settings.navigation.pages];
						const draggedItem = newPages.splice(draggedIndex, 1)[0];
						newPages.splice(targetIndex, 0, draggedItem);
						
						settings.navigation.pages = newPages;
					} else if (isSocial) {
						const newSocial = [...settings.navigation.social];
						const draggedItem = newSocial.splice(draggedIndex, 1)[0];
						newSocial.splice(targetIndex, 0, draggedItem);
						
						settings.navigation.social = newSocial;
					}
					
					// Save changes
					await this.plugin.saveData(settings);
					await this.applyCurrentConfiguration();
					
					// Re-render to update data indices and visual order
					this.render(container);
				}
			}
		});
	}

	private setupEventDelegation(container: HTMLElement): void {
		const settings = this.getSettings();
		
		// Handle input changes for pages
		container.querySelector('#pages-list')?.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.classList.contains('nav-title') || target.classList.contains('nav-url')) {
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = target.classList.contains('nav-title') ? 'title' : 'url';
				
				settings.navigation.pages[index][field] = target.value;
				this.debouncedSave();
			}
		});

		// Handle input changes for social links
		container.querySelector('#social-list')?.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.classList.contains('nav-title') || target.classList.contains('nav-url') || target.classList.contains('nav-icon')) {
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = target.classList.contains('nav-title') ? 'title' : 
							 target.classList.contains('nav-url') ? 'url' : 'icon';
				
				settings.navigation.social[index][field] = target.value;
				this.debouncedSave();
			}
		});

		// Handle remove button clicks
		container.addEventListener('click', async (e) => {
			const target = e.target as HTMLButtonElement;
			if (target.classList.contains('nav-remove')) {
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const isPage = item?.closest('#pages-list');
				
				if (isPage) {
					settings.navigation.pages.splice(index, 1);
				} else {
					settings.navigation.social.splice(index, 1);
				}
				
				await this.plugin.saveData(settings);
				await this.applyCurrentConfiguration();
				this.render(container); // Re-render to update indices
			}
		});
	}

	private debouncedSave(): void {
		// Clear existing timeout
		if (this.saveTimeoutId) {
			clearTimeout(this.saveTimeoutId);
		}
		
		// Set new timeout
		this.saveTimeoutId = window.setTimeout(async () => {
			await this.plugin.saveData(this.getSettings());
			await this.applyCurrentConfiguration(false); // No notification for drag and drop
		}, 1000); // 1 second debounce
	}
}