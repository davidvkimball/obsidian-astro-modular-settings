import { BaseWizardStep } from './BaseWizardStep';
import { setIcon } from 'obsidian';
import { NavigationItem } from '../../types';

// Type for elements with custom event handlers
interface ElementWithHandlers extends HTMLElement {
	_inputHandler?: (e: Event) => void;
	_clickHandler?: () => void;
	_removeHandler?: (e: MouseEvent) => void;
	_dragStartHandler?: (e: DragEvent) => void;
	_dragEndHandler?: (e: DragEvent) => void;
	_dragOverHandler?: (e: DragEvent) => void;
	_dragLeaveHandler?: (e: DragEvent) => void;
	_dropHandler?: (e: DragEvent) => void;
}

export class NavigationStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		const navigationSelection = container.createDiv('navigation-selection');
		navigationSelection.createEl('h2', { text: 'Navigation setup' });
		navigationSelection.createEl('p', { text: 'Configure your site navigation and social links.' });
		
		const navigationSections = navigationSelection.createDiv('navigation-sections');
		
		// Navigation Pages section
		const pagesSection = navigationSections.createDiv('nav-section');
		pagesSection.createEl('h3', { text: 'Navigation pages' });
		pagesSection.createEl('p', { text: 'Add pages to your main navigation menu. Leave URL empty to create dropdown-only parents.' });
		
		const pagesList = pagesSection.createDiv('nav-items');
		pagesList.id = 'pages-list';
		
		state.selectedNavigation.pages.forEach((page: NavigationItem, index: number) => {
			this.renderPageItem(pagesList, page, index);
		});
		
		// False positive: "+ Add page" is already in sentence case (the "+" is a UI convention)
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		const addPageBtn = pagesSection.createEl('button', { text: '+ Add page', cls: 'nav-add' });
		addPageBtn.id = 'add-page';
		
		// Social Links section
		const socialSection = navigationSections.createDiv('nav-section');
		socialSection.createEl('h3', { text: 'Social links' });
		socialSection.createEl('p', { text: 'Add social media links for your footer.' });
		
		const socialList = socialSection.createDiv('nav-items');
		socialList.id = 'social-list';
		
		state.selectedNavigation.social.forEach((social: { title: string; url: string; icon: string }, index: number) => {
			this.renderSocialItem(socialList, social, index);
		});
		
		// False positive: "+ Add social link" is already in sentence case (the "+" is a UI convention)
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		const addSocialBtn = socialSection.createEl('button', { text: '+ Add social link', cls: 'nav-add' });
		addSocialBtn.id = 'add-social';

		this.setupEventHandlers(container);
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
			// False positive: Placeholder text for input field
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			attr: { placeholder: 'Page Title', draggable: 'false' }
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
			text: '+ child',
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
			page.children.forEach((child: NavigationItem, childIndex: number) => {
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
			// False positive: Placeholder text for input field
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			attr: { placeholder: 'Child Title', draggable: 'false' }
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
			// False positive: Placeholder text for input field
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			attr: { placeholder: 'Social Title', draggable: 'false' }
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
			// False positive: Placeholder text for input field (kebab-case format)
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			attr: { placeholder: 'icon-name', draggable: 'false' }
		});
		iconInput.value = social.icon || '';
		
		const iconHelp = iconRow.createDiv('nav-icon-help');
		// False positive: "FontAwesome Brands" is a proper noun (product name)
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		iconHelp.createEl('small', { text: 'Icon names from FontAwesome Brands' });
	}

	private setupEventHandlers(container: HTMLElement): void {
		const state = this.getState();

		// Page handlers - work with selected navigation
		const pagesList = container.querySelector('#pages-list');
		if (pagesList) {
			const pagesInputHandler = (e: Event) => {
				const target = e.target as HTMLInputElement;
				if (target.classList.contains('nav-title')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					state.selectedNavigation.pages[index].title = target.value;
				} else if (target.classList.contains('nav-url')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					// If URL is empty, remove it (makes it dropdown-only). Otherwise, set it.
					if (target.value.trim() === '') {
						delete state.selectedNavigation.pages[index].url;
					} else {
						state.selectedNavigation.pages[index].url = target.value;
					}
				} else if (target.classList.contains('nav-child-title')) {
					const childItem = target.closest('.nav-child-item');
					const parentIndex = parseInt(childItem?.getAttribute('data-index') || '0');
					const childIndex = parseInt(childItem?.getAttribute('data-child-index') || '0');
					if (!state.selectedNavigation.pages[parentIndex].children) {
						state.selectedNavigation.pages[parentIndex].children = [];
					}
					if (!state.selectedNavigation.pages[parentIndex].children![childIndex]) {
						state.selectedNavigation.pages[parentIndex].children![childIndex] = { title: '', url: '' };
					}
					state.selectedNavigation.pages[parentIndex].children![childIndex].title = target.value;
				} else if (target.classList.contains('nav-child-url')) {
					const childItem = target.closest('.nav-child-item');
					const parentIndex = parseInt(childItem?.getAttribute('data-index') || '0');
					const childIndex = parseInt(childItem?.getAttribute('data-child-index') || '0');
					if (!state.selectedNavigation.pages[parentIndex].children) {
						state.selectedNavigation.pages[parentIndex].children = [];
					}
					if (!state.selectedNavigation.pages[parentIndex].children![childIndex]) {
						state.selectedNavigation.pages[parentIndex].children![childIndex] = { title: '', url: '' };
					}
					state.selectedNavigation.pages[parentIndex].children![childIndex].url = target.value;
				}
			};
			// Remove old handler if exists
			const pagesListWithHandlers = pagesList as ElementWithHandlers;
			if (pagesListWithHandlers._inputHandler) {
				pagesList.removeEventListener('input', pagesListWithHandlers._inputHandler);
			}
			pagesListWithHandlers._inputHandler = pagesInputHandler;
			pagesList.addEventListener('input', pagesInputHandler);
		}

		// Social handlers - work with selected navigation
		const socialList = container.querySelector('#social-list');
		if (socialList) {
			const socialInputHandler = (e: Event) => {
				const target = e.target as HTMLInputElement;
				if (target.classList.contains('nav-title') || target.classList.contains('nav-url') || target.classList.contains('nav-icon')) {
					const item = target.closest('.nav-item');
					const index = parseInt(item?.getAttribute('data-index') || '0');
					const field = target.classList.contains('nav-title') ? 'title' : 
								 target.classList.contains('nav-url') ? 'url' : 'icon';
					
					state.selectedNavigation.social[index][field] = target.value;
				}
			};
			// Remove old handler if exists
			const socialListWithHandlers = socialList as ElementWithHandlers;
			if (socialListWithHandlers._inputHandler) {
				socialList.removeEventListener('input', socialListWithHandlers._inputHandler);
			}
			socialListWithHandlers._inputHandler = socialInputHandler;
			socialList.addEventListener('input', socialInputHandler);
		}

		// Add page button
		const addPageBtn = container.querySelector('#add-page');
		if (addPageBtn) {
			const addPageHandler = () => {
				state.selectedNavigation.pages.push({ title: 'New Page', url: '/new-page' });
				this.render(container);
			};
			// Remove old handler if exists
			const addPageBtnWithHandlers = addPageBtn as ElementWithHandlers;
			if (addPageBtnWithHandlers._clickHandler) {
				addPageBtn.removeEventListener('click', addPageBtnWithHandlers._clickHandler);
			}
			addPageBtnWithHandlers._clickHandler = addPageHandler;
			addPageBtn.addEventListener('click', addPageHandler);
		}

		// Add social button
		const addSocialBtn = container.querySelector('#add-social');
		if (addSocialBtn) {
			const addSocialHandler = () => {
				state.selectedNavigation.social.push({ title: 'New Social', url: 'https://example.com', icon: '' });
				this.render(container);
			};
			// Remove old handler if exists
			const addSocialBtnWithHandlers = addSocialBtn as ElementWithHandlers;
			if (addSocialBtnWithHandlers._clickHandler) {
				addSocialBtn.removeEventListener('click', addSocialBtnWithHandlers._clickHandler);
			}
			addSocialBtnWithHandlers._clickHandler = addSocialHandler;
			addSocialBtn.addEventListener('click', addSocialHandler);
		}

		// Remove buttons and add child - work with selected navigation
		// Use event delegation to prevent duplicate handlers
		const removeHandler = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('nav-remove')) {
				e.preventDefault();
				e.stopPropagation();
				
				const index = parseInt(target.getAttribute('data-index') || '0');
				const isPage = target.closest('#pages-list');
				
				if (isPage) {
					state.selectedNavigation.pages.splice(index, 1);
				} else {
					state.selectedNavigation.social.splice(index, 1);
				}
				this.render(container);
			} else if (target.classList.contains('nav-child-remove')) {
				e.preventDefault();
				e.stopPropagation();
				
				const parentIndex = parseInt(target.getAttribute('data-index') || '0');
				const childIndex = parseInt(target.getAttribute('data-child-index') || '0');
				
				if (state.selectedNavigation.pages[parentIndex].children) {
					state.selectedNavigation.pages[parentIndex].children!.splice(childIndex, 1);
					if (state.selectedNavigation.pages[parentIndex].children!.length === 0) {
						delete state.selectedNavigation.pages[parentIndex].children;
					}
					// Hide children container if no children left
					const navItem = target.closest('.nav-item');
					const childrenContainer = navItem?.querySelector('.nav-children-container') as HTMLElement;
					if (childrenContainer && (!state.selectedNavigation.pages[parentIndex].children || state.selectedNavigation.pages[parentIndex].children!.length === 0)) {
						childrenContainer.setCssProps({ display: 'none' });
					}
				}
				this.render(container);
			} else if (target.classList.contains('nav-add-child')) {
				e.preventDefault();
				e.stopPropagation();
				
				const index = parseInt(target.getAttribute('data-index') || '0');
				
				if (!state.selectedNavigation.pages[index].children) {
					state.selectedNavigation.pages[index].children = [];
				}
				state.selectedNavigation.pages[index].children!.push({ title: 'New Child', url: '/new-child' });
				// Show the children container if it was hidden
				const navItem = target.closest('.nav-item');
				const childrenContainer = navItem?.querySelector('.nav-children-container') as HTMLElement;
				if (childrenContainer) {
					childrenContainer.setCssProps({ display: 'block' });
				}
				this.render(container);
			}
		};
		
		// Remove old handler if exists
		const containerWithHandlers = container as ElementWithHandlers;
		if (containerWithHandlers._removeHandler) {
			container.removeEventListener('click', containerWithHandlers._removeHandler);
		}
		containerWithHandlers._removeHandler = removeHandler;
		container.addEventListener('click', removeHandler);

		// Drag and drop functionality
		this.setupDragAndDrop(container);
	}

	private setupDragAndDrop(container: HTMLElement): void {
		const state = this.getState();
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

		const dropHandler = (e: DragEvent) => {
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
					if (isPage) {
						const draggedItem = state.selectedNavigation.pages.splice(draggedIndex, 1)[0];
						state.selectedNavigation.pages.splice(targetIndex, 0, draggedItem);
					} else if (isSocial) {
						const draggedItem = state.selectedNavigation.social.splice(draggedIndex, 1)[0];
						state.selectedNavigation.social.splice(targetIndex, 0, draggedItem);
					}
					this.render(container);
				}
			}
		};

		// Remove old handlers if they exist
		const containerWithHandlers = container as ElementWithHandlers;
		if (containerWithHandlers._dragStartHandler) {
			container.removeEventListener('dragstart', containerWithHandlers._dragStartHandler);
		}
		if (containerWithHandlers._dragEndHandler) {
			container.removeEventListener('dragend', containerWithHandlers._dragEndHandler);
		}
		if (containerWithHandlers._dragOverHandler) {
			container.removeEventListener('dragover', containerWithHandlers._dragOverHandler);
		}
		if (containerWithHandlers._dragLeaveHandler) {
			container.removeEventListener('dragleave', containerWithHandlers._dragLeaveHandler);
		}
		if (containerWithHandlers._dropHandler) {
			container.removeEventListener('drop', containerWithHandlers._dropHandler);
		}

		// Store handlers for later removal
		containerWithHandlers._dragStartHandler = dragStartHandler;
		containerWithHandlers._dragEndHandler = dragEndHandler;
		containerWithHandlers._dragOverHandler = dragOverHandler;
		containerWithHandlers._dragLeaveHandler = dragLeaveHandler;
		containerWithHandlers._dropHandler = dropHandler;

		// Add new handlers
		container.addEventListener('dragstart', dragStartHandler);
		container.addEventListener('dragend', dragEndHandler);
		container.addEventListener('dragover', dragOverHandler);
		container.addEventListener('dragleave', dragLeaveHandler);
		container.addEventListener('drop', dropHandler);
	}
}
