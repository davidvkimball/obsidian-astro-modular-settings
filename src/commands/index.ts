import { Plugin, Notice } from 'obsidian';
import { ObsidianApp } from '../types';
import { SetupWizardModal } from '../ui/SetupWizardModal';

export function registerCommands(plugin: Plugin) {
	// Open settings command
	plugin.addCommand({
		id: 'open-settings',
		name: 'Open Astro Modular Settings',
		icon: 'settings-2',
		callback: () => {
			// This will be handled by the settings tab
			(plugin.app as unknown as ObsidianApp).setting.open();
			(plugin.app as unknown as ObsidianApp).setting.openTabById(plugin.manifest.id);
		}
	});

	// Run setup wizard command
	plugin.addCommand({
		id: 'run-setup-wizard',
		name: 'Run setup wizard',
		icon: 'wand',
		callback: async () => {
			// Reload settings to ensure we have the latest values
			await plugin.loadData().then((data: any) => {
				Object.assign((plugin as any).settings, data);
			});
			const wizard = new SetupWizardModal(plugin.app, plugin as any);
			wizard.open();
		}
	});

	// Open config.ts command
	plugin.addCommand({
		id: 'open-config',
		name: 'Open config.ts',
		icon: 'wrench',
		callback: async () => {
			try {
				const fs = require('fs');
				const path = require('path');
				const { shell } = require('electron');
				
				// Get the actual vault path string from the adapter
				const vaultPath = (plugin.app.vault.adapter as any).basePath || (plugin.app.vault.adapter as any).path;
				const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
				const configPath = path.join(vaultPathString, '..', 'config.ts');
				
				if (fs.existsSync(configPath)) {
					// Use Electron's shell to open the file with the default editor
					shell.openPath(configPath);
				} else {
					new Notice(`Config file not found at: ${configPath}`);
				}
			} catch (error) {
				new Notice(`Error opening config file: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	});

	// Open terminal in project directory command
	plugin.addCommand({
		id: 'open-terminal',
		name: 'Open terminal in project directory',
		icon: 'terminal-square',
		callback: async () => {
			try {
				const { exec } = require('child_process');
				const path = require('path');
				
				// Get the actual vault path string from the adapter
				const vaultPath = (plugin.app.vault.adapter as any).basePath || (plugin.app.vault.adapter as any).path;
				const vaultPathString = typeof vaultPath === 'string' ? vaultPath : vaultPath.toString();
				// Project directory is two levels up from vault
				const projectPath = path.resolve(vaultPathString, '..', '..');
				
				const platform = process.platform;
				let command: string;
				
				if (platform === 'win32') {
					// Windows: Try Windows Terminal first, fallback to cmd
					// Check if wt.exe exists by trying it
					exec('where wt', (error: any) => {
						if (!error) {
							// Windows Terminal is available
							exec(`wt -d "${projectPath}"`, (execError: any) => {
								if (execError) {
									// Fallback to cmd
									exec(`cmd /k cd /d "${projectPath}"`, (cmdError: any) => {
										if (cmdError) {
											new Notice(`Error opening terminal: ${cmdError.message}`);
										}
									});
								}
							});
						} else {
							// Fallback to cmd
							exec(`cmd /k cd /d "${projectPath}"`, (cmdError: any) => {
								if (cmdError) {
									new Notice(`Error opening terminal: ${cmdError.message}`);
								}
							});
						}
					});
					return; // Early return since we handle Windows asynchronously
				} else if (platform === 'darwin') {
					// macOS: Use osascript to open Terminal.app
					command = `osascript -e 'tell application "Terminal" to do script "cd \\"${projectPath}\\" && bash"'`;
				} else {
					// Linux: Try common terminals
					// Try gnome-terminal first, then konsole, then xterm
					const terminals = [
						`gnome-terminal --working-directory="${projectPath}"`,
						`konsole --workdir "${projectPath}"`,
						`xterm -e "cd \\"${projectPath}\\" && bash"`
					];
					
					// Try each terminal until one works
					const tryTerminal = (index: number) => {
						if (index >= terminals.length) {
							new Notice('No supported terminal found. Please install gnome-terminal, konsole, or xterm.');
							return;
						}
						
						exec(`which ${terminals[index].split(' ')[0]}`, (error: any) => {
							if (!error) {
								exec(terminals[index], (execError: any) => {
									if (execError && index < terminals.length - 1) {
										tryTerminal(index + 1);
									} else if (execError) {
										new Notice(`Error opening terminal: ${execError.message}`);
									}
								});
							} else {
								tryTerminal(index + 1);
							}
						});
					};
					
					tryTerminal(0);
					return; // Early return since we handle Linux asynchronously
				}
				
				// Execute command for macOS
				if (command) {
					exec(command, (error: any) => {
						if (error) {
							new Notice(`Error opening terminal: ${error.message}`);
						}
					});
				}
			} catch (error) {
				new Notice(`Error opening terminal: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	});
}
