export interface ParsedGiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactions: string;
	metadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

export class GiscusScriptParser {
	/**
	 * Parse a Giscus script tag and extract all data attributes
	 */
	static parseScript(scriptContent: string): ParsedGiscusConfig | null {
		try {
			// Remove any extra whitespace and normalize the script
			const normalizedScript = scriptContent.trim();
			
			// Check if it looks like a Giscus script
			if (!normalizedScript.includes('giscus.app/client.js')) {
				return null;
			}
			
			// Extract data attributes using regex
			const dataAttributes: Record<string, string> = {};
			
			// Match all data-* attributes
			const dataAttributeRegex = /data-([a-z-]+)="([^"]*)"/g;
			let match;
			
			while ((match = dataAttributeRegex.exec(normalizedScript)) !== null) {
				const [, attributeName, value] = match;
				dataAttributes[attributeName] = value;
			}
			
			// Map the attributes to our expected format
			// Only use defaults for truly required fields, leave optional ones empty if missing
			const config: ParsedGiscusConfig = {
				repo: dataAttributes['repo'] || '',
				repoId: dataAttributes['repo-id'] || '',
				category: dataAttributes['category'] || '',
				categoryId: dataAttributes['category-id'] || '',
				// Optional attributes - use empty string if not present (so they can be cleared)
				mapping: dataAttributes['mapping'] !== undefined ? dataAttributes['mapping'] : '',
				strict: dataAttributes['strict'] !== undefined ? dataAttributes['strict'] : '',
				reactions: dataAttributes['reactions-enabled'] !== undefined ? dataAttributes['reactions-enabled'] : '',
				metadata: dataAttributes['emit-metadata'] !== undefined ? dataAttributes['emit-metadata'] : '',
				inputPosition: dataAttributes['input-position'] !== undefined ? dataAttributes['input-position'] : '',
				theme: dataAttributes['theme'] !== undefined ? dataAttributes['theme'] : '',
				lang: dataAttributes['lang'] !== undefined ? dataAttributes['lang'] : '',
				loading: dataAttributes['loading'] !== undefined ? dataAttributes['loading'] : ''
			};
			
			// Validate that we have the essential fields
			if (!config.repo || !config.repoId) {
				return null;
			}
			
			return config;
		} catch (error) {
			console.error('Error parsing Giscus script:', error);
			return null;
		}
	}
	
	/**
	 * Validate that a script looks like a valid Giscus script
	 */
	static validateScript(scriptContent: string): { valid: boolean; error?: string } {
		const normalizedScript = scriptContent.trim();
		
		// Check if it contains the giscus script source
		if (!normalizedScript.includes('giscus.app/client.js')) {
			return { valid: false, error: 'Script must contain giscus.app/client.js' };
		}
		
		// Check if it has the basic structure
		if (!normalizedScript.includes('<script') || !normalizedScript.includes('</script>')) {
			return { valid: false, error: 'Script must be a valid HTML script tag' };
		}
		
		// Try to parse it
		const parsed = this.parseScript(scriptContent);
		if (!parsed) {
			return { valid: false, error: 'Could not parse Giscus configuration from script' };
		}
		
		// Check for required fields
		if (!parsed.repo) {
			return { valid: false, error: 'Repository (data-repo) is required' };
		}
		
		if (!parsed.repoId) {
			return { valid: false, error: 'Repository ID (data-repo-id) is required' };
		}
		
		return { valid: true };
	}
	
	/**
	 * Generate a sample Giscus script for placeholder text
	 */
	static getSampleScript(): string {
		return `<script src="https://giscus.app/client.js"
        data-repo="davidvkimball/astro-modular"
        data-repo-id="R_kgDOPllfKw"
        data-category="General"
        data-category-id="DIC_kwDOPllfK84CvUpx"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>`;
	}
}
