import { Plugin } from 'obsidian';

/**
 * Manages the ribbon icon lifecycle for the plugin.
 * Keeps a direct reference to the HTMLElement to avoid DOM querying.
 */
export class RibbonIconManager {
	private ribbonIcon?: HTMLElement;
	private contextMenuObserver?: MutationObserver;
	private plugin: Plugin;
	private onClick: () => void;

	constructor(plugin: Plugin, onClick: () => void) {
		this.plugin = plugin;
		this.onClick = onClick;
	}

	/**
	 * Shows the ribbon icon if not already visible.
	 */
	show(): void {
		if (this.ribbonIcon) {
			return; // Already showing
		}

		this.ribbonIcon = this.plugin.addRibbonIcon(
			'wand-sparkles',
			'Open wizard',
			this.onClick
		);
		this.ribbonIcon.setAttribute('data-astro-modular-settings-ribbon', 'true');

		// Remove CSS marker for hidden state
		document.body.removeAttribute('data-astro-modular-ribbon-removed');

		// Cleanup context menu observer when showing
		this.stopContextMenuObserver();
	}

	/**
	 * Hides and removes the ribbon icon.
	 */
	hide(): void {
		if (this.ribbonIcon) {
			this.ribbonIcon.remove();
			this.ribbonIcon = undefined;
		}

		// Set CSS marker to hide from context menus
		document.body.setAttribute('data-astro-modular-ribbon-removed', 'true');

		// Start observing for context menu appearances
		this.startContextMenuObserver();
	}

	/**
	 * Updates visibility based on the removeRibbonIcon setting.
	 */
	update(shouldHide: boolean): void {
		if (shouldHide) {
			this.hide();
		} else {
			this.show();
		}
	}

	/**
	 * Cleans up all resources.
	 */
	destroy(): void {
		this.stopContextMenuObserver();

		if (this.ribbonIcon) {
			this.ribbonIcon.remove();
			this.ribbonIcon = undefined;
		}

		document.body.removeAttribute('data-astro-modular-ribbon-removed');
	}

	/**
	 * Starts observing for context menus to remove our item when ribbon is hidden.
	 */
	private startContextMenuObserver(): void {
		if (this.contextMenuObserver) {
			return; // Already observing
		}

		this.contextMenuObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.addedNodes)) {
					if (node instanceof HTMLElement) {
						if (node.classList.contains('menu') || node.querySelector('.menu')) {
							this.removeFromContextMenu(node);
						}
					}
				}
			}
		});

		this.contextMenuObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	/**
	 * Stops the context menu observer.
	 */
	private stopContextMenuObserver(): void {
		if (this.contextMenuObserver) {
			this.contextMenuObserver.disconnect();
			this.contextMenuObserver = undefined;
		}
	}

	/**
	 * Removes our wizard item from a context menu.
	 */
	private removeFromContextMenu(menuElement: HTMLElement): void {
		const menuItems = menuElement.querySelectorAll('.menu-item');
		for (const item of Array.from(menuItems)) {
			const svg = item.querySelector('svg');
			if (svg) {
				const iconName = svg.getAttribute('data-lucide') ||
					svg.getAttribute('xmlns:lucide') ||
					(svg.classList.contains('lucide-wand-sparkles') ? 'wand-sparkles' : null);

				if (iconName === 'wand-sparkles') {
					const itemText = item.textContent?.toLowerCase() || '';
					if (itemText.includes('wizard') || itemText.includes('astro modular')) {
						item.remove();
					}
				}
			}
		}
	}
}
