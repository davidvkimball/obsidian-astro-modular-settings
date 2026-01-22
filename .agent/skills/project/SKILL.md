---
name: project
description: Project-specific architecture, maintenance tasks, and unique conventions for Astro Modular Settings. Load when performing project-wide maintenance or working with the core architecture.
---

# Project Context

This skill provides the unique context and architectural details for the **Astro Modular Settings** repository.

## Purpose

To provide guidance on project-specific structures and tasks that differ from general Obsidian development patterns.

## When to Use

Load this skill when:
- Understanding the repository's unique architecture.
- Performing recurring maintenance tasks.
- Following project-specific coding conventions.

## Project Overview

- **Architecture**: Organized structure with main code in `src/main.ts` and modular tab-based settings.
- **Purpose**: setup and configuration management of the Astro Modular theme. Provides a setup wizard and preset configurations.
- **Key Features**: Setup wizard modal, tabbed settings interface (`TabRenderer`), external config management (`config.ts`) using markers.

## Important Details

- **Unorthodox Architecture**: Uses a setup wizard modal separate from the settings tab.
- **Config Management**: Uses comment markers like `// [CONFIG:THEME]` in `astro.config.ts`. Do not remove these.
- **SettingGroup API**: Uses backward-compatible implementation in `src/utils/settings-compat.ts`.

## Maintenance Tasks

- **Sync References**: Run the setup scripts (`scripts/setup-ref-links.*`) to update symlinks to the 6 core Obsidian projects.
- **Update Skills**: Use `node scripts/update-agents.mjs "Description"` after syncing or updating reference materials.

## Project-Specific Conventions

- **Tabbed Settings Structure**: Settings are organized into tabs (General, Site Info, Navigation, Config, Style, Features, Plugins, Advanced) using `TabRenderer` subclasses
- **Wizard Modal System**: Initial configuration uses a multi-step wizard modal (`SetupWizardModal`) with `BaseWizardStep` subclasses
- **Config File Marker System**: Uses comment markers in `config.ts` for safe updates (see `CONFIG_MARKERS.md`)
- **Plugin Integration Patterns**: Automatically configures external plugins based on content organization choice
- **SettingGroup Pattern**: Uses `createSettingsGroup()` utility for backward-compatible `SettingGroup` support
  - First group: NO heading (use `createSettingsGroup(containerEl)`)
  - Later groups: WITH headings (use `createSettingsGroup(containerEl, 'Group Name')`)
  - All settings must use `group.addSetting()` - never create divs directly on `containerEl` outside groups
  - Conditional visibility: Apply to `setting.settingEl`, not separate containers
  - **CRITICAL SPACING RULE**: When a settings group has NO heading, the LAST setting in that group MUST have bottom margin to create space before the next heading. Use `setting.settingEl.setCssProps({ marginBottom: 'var(--size-4-6)' })` on the last setting. This compensates for the lack of natural spacing that headings provide.