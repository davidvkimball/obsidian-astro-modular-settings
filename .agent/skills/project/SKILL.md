---
name: project
description: Project-specific architecture, maintenance tasks, and unique conventions for Astro Modular Settings.
---

# Astro Modular Settings Project Skill

Onboarding and configuration management for the Astro Modular theme. This plugin acts as the "control center" for the companion theme, managing a large set of CSS variables and specialized UI enhancements.

## Core Architecture

- **Theme Bridge**: Acts as the logical backend for the Astro Modular theme, toggling complex CSS states.
- **Complex UI**: Heavily dependent on custom UI elements and settings tabs (reflected in the 41KB `styles.css`).
- **Configuration Management**: Manages a wide array of modular settings that affect layout, typography, and color schemes.

## Project-Specific Conventions

- **Desktop Only**: Large portions of the UI are optimized for desktop use (specified in manifest).
- **CSS Variable Injection**: Systematically injects CSS variables and body classes to communicate with the theme.
- **Modular Pattern**: Settings are grouped into logical "modules" for onboarding ease.

## Key Files

- `src/main.ts`: Main registration and lifecycle for the settings manager.
- `manifest.json`: Configuration and Desktop-only constraint (`astro-modular-settings`).
- `styles.css`: Extensive styling for the onboarding wizard and settings UI.
- `CONFIG_MARKERS.md`: Reference documentation for configuration keys and theme interaction markers.

## Maintenance Tasks

- **Onboarding Flow**: Verify the "Setup Wizard" logic after major Obsidian updates.
- **CSS Variable Drift**: Ensure variables injected by the plugin match the latest expectations of the companion theme.
- **Marker Alignment**: Keep `CONFIG_MARKERS.md` synchronized with code changes.
