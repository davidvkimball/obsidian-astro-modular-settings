import { BaseWizardStep } from './BaseWizardStep';

export class OptionalFeaturesStep extends BaseWizardStep {
	render(container: HTMLElement): void {
		const state = this.getState();
		
		container.innerHTML = `
			<div class="features-selection">
				<h2>Optional features</h2>
				<p>Enable or disable specific features for your site.</p>
				<div class="features-list">
					${this.renderFeatureToggle('profilePicture', 'Profile picture', 'Show profile picture in header', state, false)}
					${this.renderFeatureToggle('comments', 'Comments', 'Enable comment system', state, false)}
				</div>
			</div>
		`;

		this.setupEventHandlers(container);
	}

	private renderFeatureToggle(key: string, name: string, description: string, state: any, defaultValue: boolean = false): string {
		const isEnabled = state.selectedFeatures[key] !== undefined ? state.selectedFeatures[key] : defaultValue;
		return `
			<div class="feature-setting">
				<div class="feature-toggle">
					<input type="checkbox" id="feature-${key}" ${isEnabled ? 'checked' : ''}>
					<label for="feature-${key}" class="toggle-slider"></label>
					<div class="feature-label">
						<strong>${name}</strong>
						<p>${description}</p>
					</div>
				</div>
			</div>
		`;
	}

	private setupEventHandlers(container: HTMLElement): void {
		const state = this.getState();

		container.querySelectorAll('.feature-toggle input[type="checkbox"]').forEach(checkbox => {
			checkbox.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				const featureKey = target.id.replace('feature-', '');
				
				this.updateState({
					selectedFeatures: {
						...state.selectedFeatures,
						[featureKey]: target.checked
					}
				});
			});
		});
	}
}
