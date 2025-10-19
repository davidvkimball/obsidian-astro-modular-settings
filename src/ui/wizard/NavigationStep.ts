import { BaseWizardStep } from './BaseWizardStep';

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
						<p>Add pages to your main navigation menu.</p>
						<div class="nav-items" id="pages-list">
							${state.selectedNavigation.pages.map((page: any, index: number) => `
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
						</div>
						<button class="nav-add" id="add-social">+ Add Social Link</button>
					</div>
				</div>
			</div>
		`;

		this.setupEventHandlers(container);
	}

	private setupEventHandlers(container: HTMLElement): void {
		const state = this.getState();

		// Page handlers - work with selected navigation
		container.querySelector('#pages-list')?.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.classList.contains('nav-title') || target.classList.contains('nav-url')) {
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = target.classList.contains('nav-title') ? 'title' : 'url';
				
				state.selectedNavigation.pages[index][field] = target.value;
			}
		});

		// Social handlers - work with selected navigation
		container.querySelector('#social-list')?.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.classList.contains('nav-title') || target.classList.contains('nav-url') || target.classList.contains('nav-icon')) {
				const item = target.closest('.nav-item');
				const index = parseInt(item?.getAttribute('data-index') || '0');
				const field = target.classList.contains('nav-title') ? 'title' : 
							 target.classList.contains('nav-url') ? 'url' : 'icon';
				
				state.selectedNavigation.social[index][field] = target.value;
			}
		});

		// Add page button
		container.querySelector('#add-page')?.addEventListener('click', () => {
			state.selectedNavigation.pages.push({ title: 'New Page', url: '/new-page' });
			this.render(container);
		});

		// Add social button
		container.querySelector('#add-social')?.addEventListener('click', () => {
			state.selectedNavigation.social.push({ title: 'New Social', url: 'https://example.com', icon: '' });
			this.render(container);
		});

		// Remove buttons - work with selected navigation
		container.addEventListener('click', (e) => {
			const target = e.target as HTMLButtonElement;
			if (target.classList.contains('nav-remove')) {
				const index = parseInt(target.getAttribute('data-index') || '0');
				const isPage = target.closest('#pages-list');
				
				if (isPage) {
					state.selectedNavigation.pages.splice(index, 1);
				} else {
					state.selectedNavigation.social.splice(index, 1);
				}
				this.render(container);
			}
		});

		// Drag and drop functionality
		this.setupDragAndDrop(container);
	}

	private setupDragAndDrop(container: HTMLElement): void {
		const state = this.getState();
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
		container.addEventListener('drop', (e) => {
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
		});
	}
}
