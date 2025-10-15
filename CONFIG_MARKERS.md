# Config Markers Reference

This document explains the marker system used by the Astro Modular Settings Obsidian plugin to reliably update configuration values in `config.ts`.

## What Are Config Markers?

Config markers are special comment lines in `config.ts` that look like this:
```typescript
// [CONFIG:THEME]
theme: "oxygen",
```

These markers allow the plugin to find and update specific configuration values without using fragile regex patterns.

## Why Do They Exist?

- **100% Reliable**: No more regex fragility or ambiguous matches
- **Easy to Maintain**: Simple string replacement instead of complex patterns
- **Clear Intent**: Markers show which values are plugin-managed
- **Debuggable**: Easy to see what the plugin is changing
- **Minimal Impact**: Just adds comments, doesn't change config structure

## Complete List of Markers

### Site Information
- `CONFIG:SITE_URL` - Site URL
- `CONFIG:SITE_TITLE` - Site title
- `CONFIG:SITE_DESCRIPTION` - Site description
- `CONFIG:SITE_AUTHOR` - Author name
- `CONFIG:SITE_LANGUAGE` - Site language

### Global Settings
- `CONFIG:THEME` - Theme selection
- `CONFIG:FONT_SOURCE` - Font source (local/cdn)
- `CONFIG:FONT_BODY` - Body font family
- `CONFIG:FONT_HEADING` - Heading font family
- `CONFIG:FONT_MONO` - Monospace font family
- `CONFIG:LAYOUT_CONTENT_WIDTH` - Content width
- `CONFIG:FOOTER_ENABLED` - Footer enabled state
- `CONFIG:FOOTER_SHOW_SOCIAL_ICONS` - Footer social icons
- `CONFIG:SCROLL_TO_TOP` - Scroll to top button
- `CONFIG:DARK_MODE_TOGGLE_BUTTON` - Dark mode toggle location
- `CONFIG:DEPLOYMENT_PLATFORM` - Deployment platform

### Command Palette
- `CONFIG:COMMAND_PALETTE_ENABLED` - Enable/disable command palette
- `CONFIG:COMMAND_PALETTE_SHORTCUT` - Keyboard shortcut
- `CONFIG:COMMAND_PALETTE_PLACEHOLDER` - Search placeholder text
- `CONFIG:COMMAND_PALETTE_SEARCH_POSTS` - Search posts
- `CONFIG:COMMAND_PALETTE_SEARCH_PAGES` - Search pages
- `CONFIG:COMMAND_PALETTE_SEARCH_PROJECTS` - Search projects
- `CONFIG:COMMAND_PALETTE_SEARCH_DOCS` - Search docs
- `CONFIG:COMMAND_PALETTE_SECTIONS_QUICK_ACTIONS` - Quick actions section
- `CONFIG:COMMAND_PALETTE_SECTIONS_PAGES` - Pages section
- `CONFIG:COMMAND_PALETTE_SECTIONS_SOCIAL` - Social section

### Profile Picture
- `CONFIG:PROFILE_PICTURE_ENABLED` - Enable/disable profile picture
- `CONFIG:PROFILE_PICTURE_IMAGE` - Image path
- `CONFIG:PROFILE_PICTURE_ALT` - Alt text
- `CONFIG:PROFILE_PICTURE_SIZE` - Size (sm/md/lg)
- `CONFIG:PROFILE_PICTURE_URL` - Link URL
- `CONFIG:PROFILE_PICTURE_PLACEMENT` - Placement (footer/header)
- `CONFIG:PROFILE_PICTURE_STYLE` - Style (circle/square/none)

### Navigation
- `CONFIG:NAVIGATION_SHOW_NAVIGATION` - Show/hide navigation
- `CONFIG:NAVIGATION_STYLE` - Navigation style (minimal/traditional)
- `CONFIG:NAVIGATION_SHOW_MOBILE_MENU` - Show/hide mobile menu
- `CONFIG:NAVIGATION_PAGES` - Navigation pages array
- `CONFIG:NAVIGATION_SOCIAL` - Social links array

### Optional Content Types
- `CONFIG:OPTIONAL_CONTENT_TYPES_PROJECTS` - Enable/disable projects
- `CONFIG:OPTIONAL_CONTENT_TYPES_DOCS` - Enable/disable docs

### Home Options
- `CONFIG:HOME_OPTIONS_FEATURED_POST_ENABLED` - Show/hide featured post
- `CONFIG:HOME_OPTIONS_FEATURED_POST_TYPE` - Featured post type (latest/featured)
- `CONFIG:HOME_OPTIONS_FEATURED_POST_SLUG` - Featured post slug
- `CONFIG:HOME_OPTIONS_RECENT_POSTS_ENABLED` - Show/hide recent posts
- `CONFIG:HOME_OPTIONS_RECENT_POSTS_COUNT` - Number of recent posts
- `CONFIG:HOME_OPTIONS_PROJECTS_ENABLED` - Show/hide featured projects
- `CONFIG:HOME_OPTIONS_PROJECTS_COUNT` - Number of projects
- `CONFIG:HOME_OPTIONS_DOCS_ENABLED` - Show/hide featured docs
- `CONFIG:HOME_OPTIONS_DOCS_COUNT` - Number of docs
- `CONFIG:HOME_OPTIONS_BLURB_PLACEMENT` - Blurb placement (above/below/none)

### Post Options
- `CONFIG:POST_OPTIONS_POSTS_PER_PAGE` - Posts per page
- `CONFIG:POST_OPTIONS_READING_TIME` - Show/hide reading time
- `CONFIG:POST_OPTIONS_WORD_COUNT` - Show/hide word count
- `CONFIG:POST_OPTIONS_TABLE_OF_CONTENTS` - Show/hide TOC
- `CONFIG:POST_OPTIONS_TAGS` - Show/hide tags
- `CONFIG:POST_OPTIONS_LINKED_MENTIONS_ENABLED` - Enable/disable linked mentions
- `CONFIG:POST_OPTIONS_LINKED_MENTIONS_COMPACT` - Compact linked mentions
- `CONFIG:POST_OPTIONS_GRAPH_VIEW_ENABLED` - Enable/disable graph view
- `CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_SIDEBAR` - Show graph in sidebar
- `CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_IN_COMMAND_PALETTE` - Show graph in command palette
- `CONFIG:POST_OPTIONS_GRAPH_VIEW_MAX_NODES` - Maximum graph nodes
- `CONFIG:POST_OPTIONS_GRAPH_VIEW_SHOW_ORPHANED_POSTS` - Show orphaned posts
- `CONFIG:POST_OPTIONS_POST_NAVIGATION` - Show/hide post navigation
- `CONFIG:POST_OPTIONS_SHOW_POST_CARD_COVER_IMAGES` - Post card cover images
- `CONFIG:POST_OPTIONS_POST_CARD_ASPECT_RATIO` - Post card aspect ratio
- `CONFIG:POST_OPTIONS_CUSTOM_POST_CARD_ASPECT_RATIO` - Custom aspect ratio
- `CONFIG:POST_OPTIONS_COMMENTS_ENABLED` - Enable/disable comments

## What Happens If Markers Are Removed?

If you remove or modify the config markers, the plugin will:

1. **Detect missing markers** during configuration updates
2. **Show an error message** listing which markers are missing
3. **Refuse to update** the configuration to prevent corruption
4. **Return the original config** unchanged

## How to Restore Missing Markers

If markers are missing, you have two options:

### Option 1: Restore from Git
If you have the markers in a previous commit:
```bash
git checkout HEAD~1 -- src/config.ts
```

### Option 2: Add Markers Manually
Add the missing markers before the corresponding configuration values. For example:
```typescript
// [CONFIG:THEME]
theme: "oxygen",
```

## Best Practices

1. **Never remove markers** - They're essential for plugin functionality
2. **Don't modify marker format** - Keep the exact `// [CONFIG:KEY]` format
3. **Keep markers close to values** - Place them immediately before the configuration line
4. **Test after changes** - Run the plugin to ensure markers work correctly

## Troubleshooting

### Plugin Shows "Missing Markers" Error
- Check that all required markers are present
- Verify marker format is exactly `// [CONFIG:KEY]`
- Ensure markers are placed before the configuration values

### Configuration Not Updating
- Verify the marker exists in your config.ts
- Check that the marker format is correct
- Look for typos in the marker name

### Plugin Crashes
- Check for syntax errors in config.ts
- Verify all braces and brackets are balanced
- Ensure no invalid characters in marker names

## Support

If you encounter issues with the marker system:

1. Check this documentation first
2. Verify all markers are present and correctly formatted
3. Test with a fresh config.ts from the theme repository
4. Report issues with specific error messages and config.ts content
