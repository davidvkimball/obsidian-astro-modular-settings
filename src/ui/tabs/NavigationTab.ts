import { Setting, Notice, setIcon } from 'obsidian';
import { AstroModularPlugin, NavigationItem } from '../../types';
import { TabRenderer } from '../common/TabRenderer';
import { createSettingsGroup } from '../../utils/settings-compat';

export class NavigationTab extends TabRenderer {
	private saveTimeoutId: number | null = null;
	private listenersAttached: boolean = false;

	render(container: HTMLElement): void {
		// Clear the container and reset listeners flag
		container.empty();
		this.listenersAttached = false;
		const settings = this.getSettings();

		// Navigation pages section
		const pagesSection = container.createDiv('settings-section');
		
		// Navigation Pages heading
		new Setting(pagesSection)
			.setHeading()
			.setName('Navigation pages')
			.setDesc('Add or remove pages from your main navigation menu.');

		// Display existing pages using programmatic DOM creation
		const pagesList = pagesSection.createDiv('nav-items');
		pagesList.id = 'pages-list';
		
		settings.navigation.pages.forEach((page, index) => {
			this.renderPageItem(pagesList, page, index);
		});

		// Add page button
		new Setting(pagesSection)
			.setName('Add page')
			.setDesc('Add a new page to your navigation')
				.addButton(button => button
					// "+ Add page" is a button label, keep as is
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setButtonText('+ Add page')
					.setCta()
					.onClick(async () => {
						settings.navigation.pages.push({ title: 'New Page', url: '/new-page' });
						await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration(false);
						new Notice('Navigation page added and applied to config.ts');
						this.render(container); // Re-render
					}));

		// Social links section
		const socialSection = container.createDiv('settings-section');
		
		// Social Links heading
		new Setting(socialSection)
			.setHeading()
			.setName('Social links')
			.setDesc('Add or remove social media links.');

		// Display existing social links using programmatic DOM creation
		const socialList = socialSection.createDiv('nav-items');
		socialList.id = 'social-list';
		
		settings.navigation.social.forEach((social, index) => {
			this.renderSocialItem(socialList, social, index);
		});

		// Add social link button
		new Setting(socialSection)
			.setName('Add social link')
			.setDesc('Add a new social media link')
				.addButton(button => button
					// "+ Add social link" is a button label, keep as is
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setButtonText('+ Add social link')
					.setCta()
					.onClick(async () => {
						settings.navigation.social.push({ title: 'New Social', url: 'https://example.com', icon: '' });
						await this.plugin.saveData(settings);
						await this.applyCurrentConfiguration(false);
						new Notice('Social link added and applied to config.ts');
						this.render(container); // Re-render
					}));


		// Navigation Options group with heading
		const navOptionsGroup = createSettingsGroup(container, 'Navigation options');

		// Show navigation toggle
		navOptionsGroup.addSetting((setting) => {
			setting
				.setName('Show navigation')
				.setDesc('Display navigation menu on your site')
				.addToggle(toggle => toggle
					.setValue(settings.navigation.showNavigation ?? true)
					.onChange(async (value) => {
						settings.navigation.showNavigation = value;
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Navigation ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

		// Navigation style dropdown
		navOptionsGroup.addSetting((setting) => {
			setting
				.setName('Navigation style')
				.setDesc('Choose between minimal or traditional navigation style')
				.addDropdown(dropdown => dropdown
					.addOption('traditional', 'Traditional')
					.addOption('minimal', 'Minimal')
					.setValue(settings.navigation.style || 'traditional')
					.onChange(async (value) => {
						settings.navigation.style = value as 'minimal' | 'traditional';
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Navigation style changed to ${value} and applied to config.ts`);
					}));
		});

		// Show mobile menu toggle
		navOptionsGroup.addSetting((setting) => {
			setting
				.setName('Show mobile menu')
				.setDesc('Display mobile navigation menu on smaller screens')
				.addToggle(toggle => toggle
					.setValue(settings.navigation.showMobileMenu ?? true)
					.onChange(async (value) => {
						settings.navigation.showMobileMenu = value;
						await this.plugin.saveData(settings);
						await (this.plugin as AstroModularPlugin).loadSettings();
						await this.applyCurrentConfiguration();
						new Notice(`Mobile menu ${value ? 'enabled' : 'disabled'} and applied to config.ts`);
					}));
		});

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
				target.setCssProps({ opacity: '0.5' });
			}
		};

		const dragEndHandler = (e: DragEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.setCssProps({ opacity: '1' });
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
					target.setCssProps({
						borderTop: '2px solid var(--interactive-accent)',
						borderBottom: 'none'
					});
				} else {
					target.setCssProps({
						borderBottom: '2px solid var(--interactive-accent)',
						borderTop: 'none'
					});
				}
			}
		};

		const dragLeaveHandler = (e: DragEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-item')) {
				target.setCssProps({
					borderTop: 'none',
					borderBottom: 'none'
				});
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
				target.setCssProps({
					borderTop: 'none',
					borderBottom: 'none'
				});
				
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
		interface ContainerWithHandlers extends HTMLElement {
			_dragStartHandler?: (ev: DragEvent) => void;
			_dragEndHandler?: (ev: DragEvent) => void;
			_dragOverHandler?: (ev: DragEvent) => void;
			_dragLeaveHandler?: (ev: DragEvent) => void;
			_dropHandler?: (ev: DragEvent) => void;
			_removeHandler?: (ev: MouseEvent) => void;
		}
		const containerWithHandlers = container as ContainerWithHandlers;
		
		if (containerWithHandlers._dragStartHandler) {
			container.removeEventListener('dragstart', containerWithHandlers._dragStartHandler);
			container.removeEventListener('dragend', containerWithHandlers._dragEndHandler!);
			container.removeEventListener('dragover', containerWithHandlers._dragOverHandler!);
			container.removeEventListener('dragleave', containerWithHandlers._dragLeaveHandler!);
			container.removeEventListener('drop', containerWithHandlers._dropHandler!);
		}

		// Store handlers for later removal
		containerWithHandlers._dragStartHandler = dragStartHandler;
		containerWithHandlers._dragEndHandler = dragEndHandler;
		containerWithHandlers._dragOverHandler = dragOverHandler;
		containerWithHandlers._dragLeaveHandler = dragLeaveHandler;
		containerWithHandlers._dropHandler = dropHandler;

		// Add new handlers
		if (containerWithHandlers._dragStartHandler) {
			container.addEventListener('dragstart', containerWithHandlers._dragStartHandler);
		}
		if (containerWithHandlers._dragEndHandler) {
			container.addEventListener('dragend', containerWithHandlers._dragEndHandler);
		}
		if (containerWithHandlers._dragOverHandler) {
			container.addEventListener('dragover', containerWithHandlers._dragOverHandler);
		}
		if (containerWithHandlers._dragLeaveHandler) {
			container.addEventListener('dragleave', containerWithHandlers._dragLeaveHandler);
		}
		if (containerWithHandlers._dropHandler) {
			container.addEventListener('drop', containerWithHandlers._dropHandler);
		}
	}

	private setupEventDelegation(container: HTMLElement): void {
		const settings = this.getSettings();
		
		// Find the lists
		const pagesList = container.querySelector('#pages-list');
		const socialList = container.querySelector('#social-list');
		
		// Handle input changes for pages
		if (pagesList) {
			pagesList.addEventListener('input', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.classList.contains('nav-title')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					settings.navigation.pages[index].title = target.value;
					this.debouncedSave();
				} else if (target.classList.contains('nav-url')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					// If URL is empty, remove it (makes it dropdown-only). Otherwise, set it.
					if (target.value.trim() === '') {
						delete settings.navigation.pages[index].url;
					} else {
						settings.navigation.pages[index].url = target.value;
					}
					this.debouncedSave();
				} else if (target.classList.contains('nav-child-title')) {
					const childItem = target.closest('.nav-child-item');
					const parentIndex = parseInt(childItem?.getAttribute('data-index') || '0');
					const childIndex = parseInt(childItem?.getAttribute('data-child-index') || '0');
					if (!settings.navigation.pages[parentIndex].children) {
						settings.navigation.pages[parentIndex].children = [];
					}
					if (!settings.navigation.pages[parentIndex].children[childIndex]) {
						settings.navigation.pages[parentIndex].children[childIndex] = { title: '', url: '' };
					}
					settings.navigation.pages[parentIndex].children[childIndex].title = target.value;
					this.debouncedSave();
				} else if (target.classList.contains('nav-child-url')) {
					const childItem = target.closest('.nav-child-item');
					const parentIndex = parseInt(childItem?.getAttribute('data-index') || '0');
					const childIndex = parseInt(childItem?.getAttribute('data-child-index') || '0');
					if (!settings.navigation.pages[parentIndex].children) {
						settings.navigation.pages[parentIndex].children = [];
					}
					if (!settings.navigation.pages[parentIndex].children[childIndex]) {
						settings.navigation.pages[parentIndex].children[childIndex] = { title: '', url: '' };
					}
					settings.navigation.pages[parentIndex].children[childIndex].url = target.value;
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

		// Handle remove button clicks and add child button - use event delegation on container
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
					await this.plugin.saveData(currentSettings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration(false);
					new Notice('Navigation page removed and applied to config.ts');
					this.render(container); // Re-render to update indices
				} else {
					currentSettings.navigation.social.splice(index, 1);
					await this.plugin.saveData(currentSettings);
					// Reload settings to ensure the plugin has the latest values
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration(false);
					new Notice('Social link removed and applied to config.ts');
					this.render(container); // Re-render to update indices
				}
			} else if (target.classList.contains('nav-child-remove')) {
				e.preventDefault();
				e.stopPropagation();
				
				const parentIndex = parseInt(target.getAttribute('data-index') || '0');
				const childIndex = parseInt(target.getAttribute('data-child-index') || '0');
				const currentSettings = this.getSettings();
				
				if (currentSettings.navigation.pages[parentIndex].children) {
					currentSettings.navigation.pages[parentIndex].children.splice(childIndex, 1);
					// Remove children array if empty
					if (currentSettings.navigation.pages[parentIndex].children.length === 0) {
						delete currentSettings.navigation.pages[parentIndex].children;
					}
					await this.plugin.saveData(currentSettings);
					await (this.plugin as AstroModularPlugin).loadSettings();
					await this.applyCurrentConfiguration(false);
					new Notice('Child page removed and applied to config.ts');
					// Hide children container if no children left
					const navItem = target.closest('.nav-item');
					const childrenContainer = navItem?.querySelector('.nav-children-container') as HTMLElement | null;
					if (childrenContainer && (!currentSettings.navigation.pages[parentIndex].children || currentSettings.navigation.pages[parentIndex].children.length === 0)) {
						childrenContainer.setCssProps({ display: 'none' });
					}
					this.render(container);
				}
			} else if (target.classList.contains('nav-add-child')) {
				e.preventDefault();
				e.stopPropagation();
				
				const index = parseInt(target.getAttribute('data-index') || '0');
				const currentSettings = this.getSettings();
				
				if (!currentSettings.navigation.pages[index].children) {
					currentSettings.navigation.pages[index].children = [];
				}
				currentSettings.navigation.pages[index].children.push({ title: 'New Child', url: '/new-child' });
				await this.plugin.saveData(currentSettings);
				await (this.plugin as AstroModularPlugin).loadSettings();
				await this.applyCurrentConfiguration(false);
				new Notice('Child page added and applied to config.ts');
				// Show the children container if it was hidden
				const navItem = target.closest('.nav-item');
				const childrenContainer = navItem?.querySelector('.nav-children-container') as HTMLElement;
				if (childrenContainer) {
					childrenContainer.setCssProps({ display: 'block' });
				}
				this.render(container);
				// Re-set icons after render (including new child buttons)
				setTimeout(() => {
					container.querySelectorAll('button[data-icon="trash"]').forEach((button) => {
						button.textContent = '';
						setIcon(button as HTMLElement, 'trash');
					});
				}, 0);
			}
		};
		
		// Remove any existing remove handler to prevent duplicates
		interface ContainerWithHandlers extends HTMLElement {
			_removeHandler?: (ev: MouseEvent) => void;
		}
		const containerWithHandlers = container as ContainerWithHandlers;
		if (containerWithHandlers._removeHandler) {
			container.removeEventListener('click', containerWithHandlers._removeHandler);
		}
		// Store the handler so we can remove it later
		containerWithHandlers._removeHandler = removeHandler;
		container.addEventListener('click', containerWithHandlers._removeHandler);
	}

	private debouncedSave(): void {
		// Clear existing timeout
		if (this.saveTimeoutId) {
			clearTimeout(this.saveTimeoutId);
		}
		
		// Set new timeout
		this.saveTimeoutId = window.setTimeout(() => {
			void this.plugin.saveData(this.getSettings());
			void this.applyCurrentConfiguration(false); // No notification for drag and drop
		}, 1000); // 1 second debounce
	}
	
	private renderPageItem(container: HTMLElement, page: NavigationItem, index: number): void {
		const hasChildren = page.children && page.children.length > 0;
		
		const navItem = container.createDiv('nav-item');
		navItem.setAttribute('data-index', index.toString());
		navItem.setAttribute('draggable', 'true');
		
		const itemContent = navItem.createDiv('nav-item-content');
		const itemFields = itemContent.createDiv('nav-item-fields');
		
		const titleInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-title',
			attr: { placeholder: 'Page title', draggable: 'false' }
		});
		titleInput.value = page.title || '';
		
		const urlInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-url',
			attr: { placeholder: '/page-url (leave empty for dropdown-only)', draggable: 'false' }
		});
		urlInput.value = page.url || '';
		
		const itemActions = itemContent.createDiv('nav-item-actions');
		itemActions.createEl('button', {
			// "+ Child" is a button label, keep as is
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			text: '+ Child',
			cls: 'nav-add-child',
			attr: { 'data-index': index.toString(), title: 'Add child page' }
		});
		
		const removeBtn = itemActions.createEl('button', {
			cls: 'nav-remove mod-warning',
			attr: { 'data-index': index.toString(), 'data-icon': 'trash', title: 'Remove', 'aria-label': 'Remove' }
		});
		setIcon(removeBtn, 'trash');
		
		const childrenContainer = navItem.createDiv('nav-children-container');
		childrenContainer.setAttribute('data-parent-index', index.toString());
		if (!hasChildren) {
			childrenContainer.setCssProps({ display: 'none' });
		}
		
		childrenContainer.createDiv('nav-children-label').textContent = 'Child pages:';
		const childrenDiv = childrenContainer.createDiv('nav-children');
		childrenDiv.setAttribute('data-parent-index', index.toString());
		
		if (hasChildren && page.children) {
			page.children.forEach((child, childIndex) => {
				this.renderChildItem(childrenDiv, child, index, childIndex);
			});
		}
	}
	
	private renderChildItem(container: HTMLElement, child: NavigationItem, parentIndex: number, childIndex: number): void {
		const childItem = container.createDiv('nav-child-item');
		childItem.setAttribute('data-index', parentIndex.toString());
		childItem.setAttribute('data-child-index', childIndex.toString());
		
		const itemFields = childItem.createDiv('nav-item-fields');
		
		const titleInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-child-title',
			attr: { placeholder: 'Child title', draggable: 'false' }
		});
		titleInput.value = child.title || '';
		
		const urlInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-child-url',
			attr: { placeholder: '/child-url', draggable: 'false' }
		});
		urlInput.value = child.url || '';
		
		const removeBtn = childItem.createEl('button', {
			cls: 'nav-child-remove mod-warning',
			attr: {
				'data-index': parentIndex.toString(),
				'data-child-index': childIndex.toString(),
				'data-icon': 'trash',
				title: 'Remove',
				'aria-label': 'Remove'
			}
		});
		setIcon(removeBtn, 'trash');
	}
	
	private renderSocialItem(container: HTMLElement, social: { title: string; url: string; icon: string }, index: number): void {
		const navItem = container.createDiv('nav-item');
		navItem.setAttribute('data-index', index.toString());
		navItem.setAttribute('draggable', 'true');
		
		const itemContent = navItem.createDiv('nav-item-content');
		const itemFields = itemContent.createDiv('nav-item-fields');
		
		const titleInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-title',
			attr: { placeholder: 'Social title', draggable: 'false' }
		});
		titleInput.value = social.title || '';
		
		const urlInput = itemFields.createEl('input', {
			type: 'text',
			cls: 'nav-url',
			attr: { placeholder: 'https://example.com', draggable: 'false' }
		});
		urlInput.value = social.url || '';
		
		const removeBtn = itemContent.createEl('button', {
			cls: 'nav-remove mod-warning',
			attr: { 'data-index': index.toString(), 'data-icon': 'trash', title: 'Remove', 'aria-label': 'Remove' }
		});
		setIcon(removeBtn, 'trash');
		
		const iconRow = navItem.createDiv('nav-icon-row');
		const iconInput = iconRow.createEl('input', {
			type: 'text',
			cls: 'nav-icon',
			attr: { placeholder: 'Icon name', draggable: 'false' }
		});
		iconInput.value = social.icon || '';
		
		const iconHelp = iconRow.createDiv('nav-icon-help');
		// False positive: "FontAwesome Brands" is a proper noun (product name) and should be capitalized
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		iconHelp.createEl('small', { text: 'Icon names from FontAwesome Brands' });
	}
}