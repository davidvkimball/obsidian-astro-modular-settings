# Astro Modular Settings

Obsidian plugin for setup and configuration management of the [Astro Modular theme](https://github.com/davidvkimball/astro-modular). Provides a setup wizard, preset configurations, and automatic plugin settings management.

> [!NOTE]
> This plugin only works with a specific Astro blog template and is not a general-purpose Obsidian plugin.

## Features

- **Setup Wizard**: Onboarding with template selection (Standard, Compact, Minimal), theme picker (18+ themes), content organization (file/folder-based), and automatic plugin configuration
- **Settings Interface**: Quick config changes, feature toggles, plugin management, and advanced config editing
- **Templates**: Standard (full-featured), Compact (balanced), or Minimal (simple). Advanced users can edit config.ts directly or use settings for granular control
- **Themes**: Oxygen, Minimal, Atom, Ayu (3 variants), Catppuccin, Charcoal, Dracula, Everforest, Flexoki, Gruvbox, macOS, Nord, Obsidian, Rosé Pine, Sky, Solarized, Things

## Installation

### From BRAT
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin if you haven't already
2. Go to **Settings → Community plugins → BRAT → Beta Plugin List → Add Beta Plugin**
3. Enter the repository: `davidvkimball/obsidian-astro-modular-settings`
4. Enable the plugin in **Settings → Community plugins**

### Manual Installation
1. Download latest release from [GitHub](https://github.com/davidvkimball/obsidian-astro-modular-settings)
2. Extract to `.obsidian/plugins/astro-modular-settings/`
3. Reload Obsidian and enable in **Settings → Community plugins**

## Quick Start

1. Enable plugin in **Settings → Community plugins**
2. Click the rocket icon in ribbon or run command "Run Setup Wizard"
3. Follow wizard: choose template, theme, content organization, and let it configure plugins automatically
4. Access settings: **Settings → Plugin Options → Astro Modular Settings**

## Commands

Via Command Palette (`Ctrl/Cmd + P`):
- **Open Settings** - Plugin settings
- **Run Setup Wizard** - Launch wizard
- **Open config.ts** - Open Astro config file
- **Apply Current Configuration** - Apply settings to config
- **Toggle Wizard on Startup** - Enable/disable startup wizard

## Configuration

### Content Organization

**File-based (Default):**
```
posts/
├── my-post.md
└── attachments/image.jpg
```

**Folder-based:**
```
posts/
├── my-post/
│   ├── index.md
│   └── image.jpg
```

### Plugin Integration

Automatically configures:
- **Astro Composer**: Creation mode and index file name
- **Image Manager**: Property link format for images
- **Obsidian Settings**: Attachment location and subfolder name

### Config Markers

The plugin uses comment markers like `// [CONFIG:THEME]` in your `astro.config.ts` file. **Do not remove these markers**—they're essential for the plugin to function. See [CONFIG_MARKERS.md](CONFIG_MARKERS.md) for the complete list.

## Troubleshooting

- **Plugin not loading**: Ensure enabled in **Settings → Community plugins**, check for `main.js`, `manifest.json`, `styles.css`, reload Obsidian
- **Wizard not appearing**: Check "Run wizard on startup" setting, run manually via Command Palette
- **Config not applied**: Verify `astro.config.ts` exists and is valid, check console for errors
- **Missing plugins**: Install Astro Composer and Image Manager, use manual instructions in Plugin Settings tab
- **Theme not changing**: Ensure Astro dev server is running, restart after config changes
- **Missing markers**: Verify all `// [CONFIG:KEY]` markers are present, see [CONFIG_MARKERS.md](CONFIG_MARKERS.md)

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Production build
```

Project structure:
```
src/
├── main.ts, settings.ts, types.ts
├── commands/, ui/, utils/, presets/
```

See [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.
