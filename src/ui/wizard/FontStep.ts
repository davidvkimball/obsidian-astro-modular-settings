import { BaseWizardStep } from './BaseWizardStep';
import { FONT_OPTIONS } from '../../types';

export class FontStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="font-selection">
				<h2>Choose your fonts</h2>
				<p>Select fonts for headings, body text, and code.</p>
				<div class="font-options">
					<div class="font-setting">
						<label>Heading Font</label>
						<select id="heading-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${state.selectedTypography.headingFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Body Font</label>
						<select id="prose-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${state.selectedTypography.proseFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Monospace Font</label>
						<select id="mono-font">
							${FONT_OPTIONS.map(font => 
								`<option value="${font}" ${state.selectedTypography.monoFont === font ? 'selected' : ''}>${font}</option>`
							).join('')}
						</select>
					</div>
					<div class="font-setting">
						<label>Font Source</label>
						<select id="font-source">
							<option value="local" ${state.selectedTypography.fontSource === 'local' ? 'selected' : ''}>Local (Google Fonts)</option>
							<option value="cdn" ${state.selectedTypography.fontSource === 'cdn' ? 'selected' : ''}>CDN (Custom)</option>
						</select>
					</div>
					${state.selectedTypography.fontSource === 'cdn' ? `
						<div class="font-setting">
							<label>Custom Font URLs (comma-separated)</label>
							<input type="text" id="custom-fonts" placeholder="https://fonts.googleapis.com/css2?family=Custom+Font:wght@400;600&display=swap">
						</div>
						<div class="font-setting">
							<label>Heading Font Name</label>
							<input type="text" id="custom-heading-font" value="${state.selectedTypography.customFonts?.heading || ''}" placeholder="Custom Heading Font">
						</div>
						<div class="font-setting">
							<label>Body Font Name</label>
							<input type="text" id="custom-prose-font" value="${state.selectedTypography.customFonts?.prose || ''}" placeholder="Custom Body Font">
						</div>
						<div class="font-setting">
							<label>Monospace Font Name</label>
							<input type="text" id="custom-mono-font" value="${state.selectedTypography.customFonts?.mono || ''}" placeholder="Custom Monospace Font">
						</div>
					` : ''}
				</div>
			</div>
		`;

		// Add change handlers
		container.querySelector('#heading-font')?.addEventListener('change', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					headingFont: (e.target as HTMLSelectElement).value
				}
			});
		});
		container.querySelector('#prose-font')?.addEventListener('change', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					proseFont: (e.target as HTMLSelectElement).value
				}
			});
		});
		container.querySelector('#mono-font')?.addEventListener('change', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					monoFont: (e.target as HTMLSelectElement).value
				}
			});
		});
		container.querySelector('#font-source')?.addEventListener('change', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					fontSource: (e.target as HTMLSelectElement).value as 'local' | 'cdn'
				}
			});
			this.render(container); // Re-render to show/hide custom input
		});

		// Custom font name handlers
		container.querySelector('#custom-heading-font')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					customFonts: {
						...currentState.selectedTypography.customFonts,
						heading: (e.target as HTMLInputElement).value
					}
				}
			});
		});

		container.querySelector('#custom-prose-font')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					customFonts: {
						...currentState.selectedTypography.customFonts,
						prose: (e.target as HTMLInputElement).value
					}
				}
			});
		});

		container.querySelector('#custom-mono-font')?.addEventListener('input', (e) => {
			const currentState = this.getState();
			this.updateState({
				selectedTypography: {
					...currentState.selectedTypography,
					customFonts: {
						...currentState.selectedTypography.customFonts,
						mono: (e.target as HTMLInputElement).value
					}
				}
			});
		});
	}
}
