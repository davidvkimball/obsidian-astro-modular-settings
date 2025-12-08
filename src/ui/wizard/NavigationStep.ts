import { BaseWizardStep } from './BaseWizardStep';
import { setIcon } from 'obsidian';

export class NavigationStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="navigation-selection">
				<h2>Navigation setup</h2>
				<p>Configure your site navigation and social links.</p>
				
				<div class="navigation-sections">
					<div class="nav-section">
						<h3>Navigation Pages</h3>
						<p>Add pages to your main navigation menu. Leave URL empty to create dropdown-only parents.</p>
						<div class="nav-items" id="pages-list">
							${state.selectedNavigation.pages.map((page: any, index: number) => {
								const hasChildren = page.children && page.children.length > 0;
								return `
								<div class="nav-item" data-index="${index}" draggable="true">
									<div class="nav-item-content">
										<div class="nav-item-fields">
											<input type="text" class="nav-title" placeholder="Page Title" value="${page.title || ''}" draggable="false">
											<input type="text" class="nav-url" placeholder="/page-url (leave empty for dropdown-only)" value="${page.url || ''}" draggable="false">
										</div>
										<div class="nav-item-actions">
											<button class="nav-add-child" data-index="${index}" title="Add child page">+ Child</button>
											<button class="nav-remove mod-warning" data-index="${index}" data-icon="trash" title="Remove" aria-label="Remove"></button>
										</div>
									</div>
									<div class="nav-children-container" data-parent-index="${index}" ${!hasChildren ? 'style="display: none;"' : ''}>
										<div class="nav-children-label">Child Pages:</div>
										<div class="nav-children" data-parent-index="${index}">
											${hasChildren ? page.children.map((child: any, childIndex: number) => `
												<div class="nav-child-item" data-index="${index}" data-child-index="${childIndex}">
													<div class="nav-item-fields">
														<input type="text" class="nav-child-title" placeholder="Child Title" value="${child.title || ''}" draggable="false">
														<input type="text" class="nav-child-url" placeholder="/child-url" value="${child.url || ''}" draggable="false">
													</div>
													<button class="nav-child-remove mod-warning" data-index="${index}" data-child-index="${childIndex}" data-icon="trash" title="Remove" aria-label="Remove"></button>
												</div>
											`).join('') : ''}
										</div>
									</div>
								</div>
							`;
							}).join('')}
						</div>
						<button class="nav-add" id="add-page">+ Add Page</button>
					</div>
					
					<div class="nav-section">
						<h3>Social Links</h3>
						<p>Add social media links for your footer.</p>
						<div class="nav-items" id="social-list">
							${state.selectedNavigation.social.map((social: any, index: number) => `
								<div class="nav-item" data-index="${index}" draggable="true">
									<div class="nav-item-content">
										<div class="nav-item-fields">
											<input type="text" class="nav-title" placeholder="Social Title" value="${social.title}" draggable="false">
											<input type="text" class="nav-url" placeholder="https://example.com" value="${social.url}" draggable="false">
										</div>
										<button class="nav-remove mod-warning" data-index="${index}" data-icon="trash" title="Remove" aria-label="Remove"></button>
									</div>
									<div class="nav-icon-row">
										<input type="text" class="nav-icon" placeholder="icon-name" value="${social.icon || ''}" draggable="false">
										<div class="nav-icon-help">
											<small>Icon names from FontAwesome Brands</small>
										</div>
									</div>
								</div>
							`).join('')}
						</div>
						<button class="nav-add" id="add-social">+ Add Social Link</button>
					</div>
				</div>
			</div>
		`;

		// Set icons on remove buttons - use setTimeout to ensure DOM is ready
		setTimeout(() => {
			container.querySelectorAll('button[data-icon="trash"]').forEach((button) => {
				// Clear any text content first
				button.textContent = '';
				setIcon(button as HTMLElement, 'trash');
			});
		}, 0);

		this.setupEventHandlers(container);
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
			if ((pagesList as any)._inputHandler) {
				pagesList.removeEventListener('input', (pagesList as any)._inputHandler);
			}
			(pagesList as any)._inputHandler = pagesInputHandler;
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
			if ((socialList as any)._inputHandler) {
				socialList.removeEventListener('input', (socialList as any)._inputHandler);
			}
			(socialList as any)._inputHandler = socialInputHandler;
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
			if ((addPageBtn as any)._clickHandler) {
				addPageBtn.removeEventListener('click', (addPageBtn as any)._clickHandler);
			}
			(addPageBtn as any)._clickHandler = addPageHandler;
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
			if ((addSocialBtn as any)._clickHandler) {
				addSocialBtn.removeEventListener('click', (addSocialBtn as any)._clickHandler);
			}
			(addSocialBtn as any)._clickHandler = addSocialHandler;
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
						childrenContainer.style.display = 'none';
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
					childrenContainer.style.display = 'block';
				}
				this.render(container);
			}
		};
		
		// Remove old handler if exists
		if ((container as any)._removeHandler) {
			container.removeEventListener('click', (container as any)._removeHandler);
		}
		(container as any)._removeHandler = removeHandler;
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

		const dropHandler = (e: DragEvent) => {
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
}
