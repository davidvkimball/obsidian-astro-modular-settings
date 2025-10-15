# Astro Modular Settings

A comprehensive Obsidian plugin for easy setup and configuration management of the Astro Modular theme. This plugin provides a user-friendly setup wizard, preset configurations, and automatic plugin settings management to streamline your Astro Modular experience.

## Features

### 🚀 Setup Wizard
- **Welcome Screen**: Beautiful onboarding with Astro Modular branding
- **Template Selection**: Choose from Standard, Minimal, Compact, Documentation, or Custom templates
- **Theme Selection**: Visual theme picker with 18+ beautiful color schemes
- **Content Organization**: Choose between file-based or folder-based content structure
- **Feature Configuration**: Granular control over theme features (for custom templates)
- **Plugin Configuration**: Automatic setup of required Obsidian plugins
- **Smart Defaults**: Skip options with sensible defaults for quick setup

### ⚙️ Settings Interface
- **General Tab**: Basic plugin settings and current configuration overview
- **Quick Config**: Fast template, theme, and organization changes
- **Features Tab**: Toggle individual theme features on/off
- **Plugin Settings**: Manage Obsidian plugin configurations
- **Advanced Tab**: Direct config file editing and import/export

### 🎨 Preset Templates
- **Standard**: Full-featured blog with all options enabled
- **Minimal**: Clean, simple blog with minimal features
- **Compact**: Balanced setup for smaller sites
- **Documentation**: Optimized for technical documentation
- **Custom**: Granular control over every setting

### 🌈 Theme Support
- Oxygen (default) - Modern, clean design
- Minimal - Understated with high contrast
- Atom - Dark theme with vibrant accents
- Ayu - Three variants (light, mirage, dark)
- Catppuccin - Pastel color palette
- Charcoal - Dark, professional look
- Dracula - Dark theme with purple accents
- Everforest - Soft, warm colors
- Flexoki - Based on Material Design 3
- Gruvbox - Retro groove color scheme
- macOS - Native macOS appearance
- Nord - Arctic-inspired color palette
- Obsidian - Matches Obsidian's default theme
- Rosé Pine - All natural pine, faux fir, and winter
- Sky - Light, airy design
- Solarized - Precision colors for machines and people
- Things - Clean, minimal design

## Installation

### From Obsidian Community Plugins
1. Open Obsidian
2. Go to **Settings → Community plugins**
3. Click **Browse** and search for "Astro Modular Settings"
4. Click **Install** and then **Enable**

### Manual Installation
1. Download the latest release from [GitHub](https://github.com/astro-modular/obsidian-astro-modular-settings)
2. Extract the files to your vault's `.obsidian/plugins/astro-modular-settings/` folder
3. Reload Obsidian
4. Go to **Settings → Community plugins** and enable "Astro Modular Settings"

## Quick Start

### First Time Setup
1. **Enable the plugin** in **Settings → Community plugins**
2. **Click the rocket icon** in the left ribbon or run the command "Run Setup Wizard"
3. **Follow the wizard steps**:
   - Choose your template (Standard recommended for beginners)
   - Select your preferred theme
   - Pick content organization (file-based recommended)
   - Configure features (if using custom template)
   - Let the plugin configure your other plugins automatically
   - Review and complete setup

### Using the Settings
- **Access settings**: Go to **Settings → Plugin Options → Astro Modular Settings**
- **Quick changes**: Use the "Quick Config" tab for fast template/theme changes
- **Feature control**: Use the "Features" tab to toggle individual features
- **Plugin management**: Use the "Plugin Settings" tab to manage Obsidian plugins

## Commands

The plugin provides several commands accessible via the Command Palette (`Ctrl/Cmd + P`):

- **Astro Modular: Open Settings** - Open the plugin settings
- **Astro Modular: Run Setup Wizard** - Launch the setup wizard
- **Astro Modular: Open config.ts** - Open your Astro configuration file
- **Astro Modular: Apply Current Configuration** - Apply current settings to config
- **Astro Modular: Toggle Wizard on Startup** - Enable/disable startup wizard

## Configuration

### Content Organization

#### File-based (Default)
```
posts/
├── my-post.md
└── attachments/
    └── image.jpg
```

#### Folder-based
```
posts/
├── my-post/
│   ├── index.md
│   └── image.jpg
└── another-post/
    ├── index.md
    └── image.jpg
```

### Plugin Integration

The plugin automatically configures these Obsidian plugins:

- **Astro Composer**: Sets creation mode and index file name
- **Image Inserter**: Configures frontmatter format for images
- **Obsidian Settings**: Sets attachment location and subfolder name

### Configuration File

The plugin reads and writes to your `astro.config.ts` file. It preserves your existing configuration while applying the selected template and theme settings.

#### Config Marker System

The plugin uses a reliable marker-based system to update configuration values. Special comment markers like `// [CONFIG:THEME]` are placed before each configurable value in your `config.ts` file.

**Important**: Do not remove these markers! They are essential for the plugin to function correctly. If markers are missing, the plugin will show an error and refuse to update your configuration.

For a complete list of markers and troubleshooting, see [CONFIG_MARKERS.md](CONFIG_MARKERS.md).

## Troubleshooting

### Plugin Not Loading
- Ensure the plugin is enabled in **Settings → Community plugins**
- Check that you have the required files: `main.js`, `manifest.json`, `styles.css`
- Try reloading Obsidian (`Ctrl/Cmd + R`)

### Setup Wizard Not Appearing
- Check the "Run wizard on startup" setting in the General tab
- Ensure "Do not show this again" is not checked
- Manually run the wizard via the Command Palette

### Configuration Not Applied
- Verify your `astro.config.ts` file exists and is valid
- Check the console for any error messages
- Try manually applying configuration from the Quick Config tab

### Missing Plugins
- Install required plugins: Astro Composer, Image Inserter
- Use the "Show manual instructions" option in Plugin Settings tab
- Follow the step-by-step configuration guide

### Theme Not Changing
- Ensure your Astro dev server is running
- Check that the theme name is correct in your config
- Try restarting your Astro dev server after configuration changes

### Missing Config Markers Error
- Check that all `// [CONFIG:KEY]` markers are present in your `config.ts`
- Verify marker format is exactly `// [CONFIG:KEY]` (no typos)
- See [CONFIG_MARKERS.md](CONFIG_MARKERS.md) for complete marker list
- Restore from git if markers were accidentally removed

## Development

### Building from Source
```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build
```

### Project Structure
```
src/
├── main.ts              # Plugin entry point
├── settings.ts          # Settings interface
├── types.ts             # TypeScript definitions
├── commands/            # Command implementations
├── ui/                  # UI components
│   ├── SetupWizardModal.ts
│   └── SettingsTab.ts
├── utils/               # Utility functions
│   ├── ConfigManager.ts
│   └── PluginManager.ts
└── presets/             # Template presets
    ├── standard.json
    ├── minimal.json
    ├── compact.json
    └── documentation.json
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Support

- **Documentation**: [GitHub Wiki](https://github.com/astro-modular/obsidian-astro-modular-settings/wiki)
- **Issues**: [GitHub Issues](https://github.com/astro-modular/obsidian-astro-modular-settings/issues)
- **Discussions**: [GitHub Discussions](https://github.com/astro-modular/obsidian-astro-modular-settings/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the [Astro Modular](https://github.com/astro-modular) theme
- Inspired by the Obsidian community's need for easier theme configuration
- Thanks to all contributors and users who provide feedback

---

**Made with ❤️ for the Obsidian and Astro communities**