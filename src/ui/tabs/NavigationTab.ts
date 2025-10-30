import { Setting, Notice } from 'obsidian';
import { TabRenderer } from '../common/TabRenderer';

export class NavigationTab extends TabRenderer {
	private saveTimeoutId: number | null = null;
	private listenersAttached: boolean = false;

	render(container: HTMLElement): void {
		// Clear the container and reset listeners flag
		container.empty();
		this.listenersAttached = false;
		const settings = this.getSettings();

		// Settings section header
		const settingsSection = container.createDiv('settings-section');

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
		socialSection.createEl('p', { text: 'Add or remove social media links.' });

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


		// Navigation Options section
		const navOptionsSection = container.createDiv('settings-section');
		navOptionsSection.style.marginTop = '30px';
		navOptionsSection.style.paddingTop = '20px';
		navOptionsSection.style.borderTop = '2px solid var(--background-modifier-border)';
		navOptionsSection.createEl('h3', { text: 'Navigation Options' });

		// Show navigation toggle
		new Setting(navOptionsSection)
			.setName('Show navigation')
			.setDesc('Display navigation menu on your site')
			.addToggle(toggle => toggle
				.setValue(settings.navigation.showNavigation ?? true)
				.onChange(async (value) => {
				settings.navigation.showNavigation = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				await this.applyCurrentConfiguration();
					new Notice(`Navigation ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Navigation style dropdown
		new Setting(navOptionsSection)
			.setName('Navigation style')
			.setDesc('Choose between minimal or traditional navigation style')
			.addDropdown(dropdown => dropdown
				.addOption('traditional', 'Traditional')
				.addOption('minimal', 'Minimal')
				.setValue(settings.navigation.style || 'traditional')
				.onChange(async (value) => {
				settings.navigation.style = value as 'minimal' | 'traditional';
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				await this.applyCurrentConfiguration();
					new Notice(`Navigation style changed to ${value} and applied to config.ts`);
				}));

		// Show mobile menu toggle
		new Setting(navOptionsSection)
			.setName('Show mobile menu')
			.setDesc('Display mobile navigation menu on smaller screens')
			.addToggle(toggle => toggle
				.setValue(settings.navigation.showMobileMenu ?? true)
				.onChange(async (value) => {
				settings.navigation.showMobileMenu = value;
				await this.plugin.saveData(settings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				await this.applyCurrentConfiguration();
					new Notice(`Mobile menu ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
				}));

		// Setup event delegation for input fields and remove buttons
		// This must be done AFTER all DOM elements are created
		this.setupEventDelegation(container);
		
		// Drag and drop functionality
		this.setupDragAndDrop(container);
	}

	private setupDragAndDrop(container: HTMLElement): void {
		let draggedElement: HTMLElement | null = null;

		// Create handlers
		const dragStartHandler = (e: DragEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				draggedElement = target;
				target.style.opacity = '0.5';
			}
		};

		const dragEndHandler = (e: DragEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.style.opacity = '1';
				draggedElement = null;
			}
		};

		const dragOverHandler = (e: DragEvent) => {
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
		};

		const dragLeaveHandler = (e: DragEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.style.borderTop = 'none';
				target.style.borderBottom = 'none';
			}
		};

		const dropHandler = async (e: DragEvent) => {
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
					const currentSettings = this.getSettings();
					if (isPage) {
						const newPages = [...currentSettings.navigation.pages];
						const draggedItem = newPages.splice(draggedIndex, 1)[0];
						newPages.splice(targetIndex, 0, draggedItem);
						
						currentSettings.navigation.pages = newPages;
					} else if (isSocial) {
						const newSocial = [...currentSettings.navigation.social];
						const draggedItem = newSocial.splice(draggedIndex, 1)[0];
						newSocial.splice(targetIndex, 0, draggedItem);
						
						currentSettings.navigation.social = newSocial;
					}
					
					// Save changes
					await this.plugin.saveData(currentSettings);
					await this.applyCurrentConfiguration();
					
					// Re-render to update data indices and visual order
					this.render(container);
				}
			}
		};

		// Remove old handlers if they exist
		if ((container as any)._dragStartHandler) {
			container.removeEventListener('dragstart', (container as any)._dragStartHandler);
			container.removeEventListener('dragend', (container as any)._dragEndHandler);
			container.removeEventListener('dragover', (container as any)._dragOverHandler);
			container.removeEventListener('dragleave', (container as any)._dragLeaveHandler);
			container.removeEventListener('drop', (container as any)._dropHandler);
		}

		// Store handlers for later removal
		(container as any)._dragStartHandler = dragStartHandler;
		(container as any)._dragEndHandler = dragEndHandler;
		(container as any)._dragOverHandler = dragOverHandler;
		(container as any)._dragLeaveHandler = dragLeaveHandler;
		(container as any)._dropHandler = dropHandler;

		// Add new handlers
		container.addEventListener('dragstart', dragStartHandler);
		container.addEventListener('dragend', dragEndHandler);
		container.addEventListener('dragover', dragOverHandler);
		container.addEventListener('dragleave', dragLeaveHandler);
		container.addEventListener('drop', dropHandler);
	}

	private setupEventDelegation(container: HTMLElement): void {
		const settings = this.getSettings();
		
		// Find the lists
		const pagesList = container.querySelector('#pages-list');
		const socialList = container.querySelector('#social-list');
		
		// Debug logging
		console.log('Setting up event delegation:', {
			pagesList: pagesList ? 'found' : 'NOT FOUND',
			socialList: socialList ? 'found' : 'NOT FOUND'
		});
		
		// Handle input changes for pages
		if (pagesList) {
			pagesList.addEventListener('input', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.classList.contains('nav-title') || target.classList.contains('nav-url')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					const field = target.classList.contains('nav-title') ? 'title' : 'url';
					
					settings.navigation.pages[index][field] = target.value;
					this.debouncedSave();
				}
			});
		}

		// Handle input changes for social links
		if (socialList) {
			socialList.addEventListener('input', (e) => {
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
		}

		// Handle remove button clicks - use event delegation on container
		// This is more reliable than attaching to each button
		const removeHandler = async (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-remove')) {
				e.preventDefault();
				e.stopPropagation();
				
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const isPage = item?.closest('#pages-list');
				const currentSettings = this.getSettings(); // Get fresh settings
				
				if (isPage) {
					currentSettings.navigation.pages.splice(index, 1);
				} else {
					currentSettings.navigation.social.splice(index, 1);
				}
				
				await this.plugin.saveData(currentSettings);
				// Reload settings to ensure the plugin has the latest values
				await (this.plugin as any).loadSettings();
				await this.applyCurrentConfiguration();
				this.render(container); // Re-render to update indices
			}
		};
		
		// Remove any existing remove handler to prevent duplicates
		container.removeEventListener('click', (container as any)._removeHandler);
		// Store the handler so we can remove it later
		(container as any)._removeHandler = removeHandler;
		container.addEventListener('click', removeHandler);
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