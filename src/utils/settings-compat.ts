/**
 * Compatibility utilities for settings
 * Provides backward compatibility for SettingGroup (requires API 1.11.0+)
 */
import { Setting, requireApiVersion } from 'obsidian';

/**
 * Type definition for SettingGroup constructor
 * Note: SettingGroup may exist at runtime in 1.11.0+ but may not be in TypeScript definitions
 */
type SettingGroupConstructor = new (containerEl: HTMLElement) => {
  setHeading?(heading: string): {
    addSetting(cb: (setting: Setting) => void): void;
  };
  addSetting(cb: (setting: Setting) => void): void;
};

/**
 * Interface that works with both SettingGroup and fallback container
 */
export interface SettingsContainer {
  addSetting(cb: (setting: Setting) => void): void;
}

/**
 * Creates a settings container that uses SettingGroup if available (API 1.11.0+),
 * otherwise falls back to creating a heading (if provided) and using the container directly.
 * 
 * Uses requireApiVersion('1.11.0') to check if SettingGroup is available.
 * 
 * @param containerEl - The container element for settings
 * @param heading - Optional heading text for the settings group. If omitted, no heading is created.
 * @returns A container that can be used to add settings
 */
export function createSettingsGroup(
  containerEl: HTMLElement,
  heading?: string
): SettingsContainer {
  // Check if SettingGroup is available (API 1.11.0+)
  if (requireApiVersion('1.11.0')) {
    // Use dynamic require() to access SettingGroup at runtime
    // This avoids TypeScript errors when SettingGroup isn't in type definitions
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const obsidian = require('obsidian') as { SettingGroup: SettingGroupConstructor };
    const SettingGroup = obsidian.SettingGroup;
    
    // Use SettingGroup - it's guaranteed to exist if requireApiVersion returns true
    const group = heading 
      ? new SettingGroup(containerEl).setHeading!(heading)
      : new SettingGroup(containerEl);
    
    return {
      addSetting(cb: (setting: Setting) => void) {
        group.addSetting(cb);
      }
    };
  } else {
    // Fallback: Create a heading manually (if provided) and use container directly
    if (heading) {
      new Setting(containerEl)
        .setHeading()
        .setName(heading);
    }
        
    return {
      addSetting(cb: (setting: Setting) => void) {
        const setting = new Setting(containerEl);
        cb(setting);
      }
    };
  }
}

