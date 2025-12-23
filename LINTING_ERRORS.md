PS C:\\Users\\david\\Development\\obsidian-astro-modular-settings> npm run lint



> astro-modular-settings@0.3.9 lint

> node scripts/lint-wrapper.mjs





C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\.ref\\obsidian-api\\canvas.d.ts

&nbsp; 0:0  error  Parsing error: "parserOptions.project" has been provided for @typescript-eslint/parser.

The file was not found in any of the provided project(s): .ref\\obsidian-api\\canvas.d.ts



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\.ref\\obsidian-api\\obsidian.d.ts

&nbsp; 0:0  error  Parsing error: "parserOptions.project" has been provided for @typescript-eslint/parser.

The file was not found in any of the provided project(s): .ref\\obsidian-api\\obsidian.d.ts



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\.ref\\obsidian-api\\publish.d.ts

&nbsp; 0:0  error  Parsing error: "parserOptions.project" has been provided for @typescript-eslint/parser.

The file was not found in any of the provided project(s): .ref\\obsidian-api\\publish.d.ts



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\commands\\index.ts

&nbsp;  1:18  error  'Notice' is defined but never used                                                                                        @typescript-eslint/no-unused-vars

&nbsp;  9:3   error  The command name should not include the plugin name, the plugin name is already shown next to the command name in the UI  obsidianmd/commands/no-plugin-name-in-command-name

&nbsp;  9:9   error  Use sentence case for UI text                                                                                             obsidianmd/ui/sentence-case

&nbsp; 25:40  error  Unexpected any. Specify a different type                                                                                  @typescript-eslint/no-explicit-any

&nbsp; 26:30  error  Unexpected any. Specify a different type                                                                                  @typescript-eslint/no-explicit-any

&nbsp; 26:35  error  Unsafe member access .settings on an `any` value                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 28:52  error  Unsafe argument of type `any` assigned to a parameter of type `AstroModularPlugin`                                        @typescript-eslint/no-unsafe-argument

&nbsp; 28:62  error  Unexpected any. Specify a different type                                                                                  @typescript-eslint/no-explicit-any



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\main.ts

&nbsp;   1:18  error  'Notice' is defined but never used                                                                                                      @typescript-eslint/no-unused-vars

&nbsp;   1:26  error  'setIcon' is defined but never used                                                                                                     @typescript-eslint/no-unused-vars

&nbsp;  36:58  error  Use sentence case for UI text                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  52:46  error  Promise returned in function argument where a void return was expected                                                                  @typescript-eslint/no-misused-promises

&nbsp;  96:3   error  Unsafe assignment of an `any` value                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 181:58  error  Use sentence case for UI text                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 210:36  error  Creating and attaching "style" elements is not allowed. For loading CSS, use a "styles.css" file instead, which Obsidian loads for you  obsidianmd/no-forbidden-elements



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\types.ts

&nbsp; 304:17  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

&nbsp; 329:20  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

&nbsp; 357:27  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\PresetWarningModal.ts

&nbsp; 20:51  error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 21:3   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 27:3   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 31:3   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 32:3   error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 36:4   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 43:3   error  Avoid setting styles directly via `element.style.fontWeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 44:3   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 48:3   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 49:3   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 50:3   error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\SettingsTab.ts

&nbsp;  2:10  error  'SetupWizardModal' is defined but never used                                       @typescript-eslint/no-unused-vars

&nbsp;  3:10  error  'PresetWarningModal' is defined but never used                                     @typescript-eslint/no-unused-vars

&nbsp; 81:37  error  Promise returned in function argument where a void return was expected             @typescript-eslint/no-misused-promises

&nbsp; 88:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                         @typescript-eslint/await-thenable

&nbsp; 94:47  error  Unexpected any. Specify a different type                                           @typescript-eslint/no-explicit-any

&nbsp; 94:52  error  Unsafe member access .then on an `any` value                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 95:5   error  This assertion is unnecessary since it does not change the type of the expression  @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 95:48  error  Unexpected any. Specify a different type                                           @typescript-eslint/no-explicit-any



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\SetupWizardModal.ts

&nbsp;  65:2   error  Promise-returning method provided where a void return was expected by extended/implemented type 'Modal'                                                                     @typescript-eslint/no-misused-promises

&nbsp; 110:9   error  'state' is assigned a value but never used                                                                                                                                  @typescript-eslint/no-unused-vars

&nbsp; 140:3   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                             @microsoft/sdl/no-inner-html

&nbsp; 149:3   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                             @microsoft/sdl/no-inner-html

&nbsp; 165:4   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                                                                                                  @typescript-eslint/await-thenable

&nbsp; 170:9   error  'state' is assigned a value but never used                                                                                                                                  @typescript-eslint/no-unused-vars

&nbsp; 181:38  error  Promise returned in function argument where a void return was expected                                                                                                      @typescript-eslint/no-misused-promises

&nbsp; 195:38  error  Promise returned in function argument where a void return was expected                                                                                                      @typescript-eslint/no-misused-promises

&nbsp; 203:11  error  Use sentence case for UI text                                                                                                                                               obsidianmd/ui/sentence-case

&nbsp; 206:42  error  Promise returned in function argument where a void return was expected                                                                                                      @typescript-eslint/no-misused-promises

&nbsp; 233:4   error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 234:38  error  Promise returned in function argument where a void return was expected                                                                                                      @typescript-eslint/no-misused-promises

&nbsp; 328:3   error  Unsafe return of a value of type `any`                                                                                                                                      @typescript-eslint/no-unsafe-return



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\common\\TabRenderer.ts

&nbsp;  20:3   error  Unsafe return of a value of type `any`                                  @typescript-eslint/no-unsafe-return

&nbsp;  20:26  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  20:31  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp;  20:59  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  20:64  error  Unsafe member access .data on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp;  28:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  28:26  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp;  28:42  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  28:47  error  Unsafe member access .configManager on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp;  34:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp;  34:27  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  34:32  error  Unsafe member access .configManager on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 105:36  error  Promise returned in function argument where a void return was expected  @typescript-eslint/no-misused-promises

&nbsp; 113:43  error  Promise returned in function argument where a void return was expected  @typescript-eslint/no-misused-promises



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\AdvancedTab.ts

&nbsp;  11:9    error  'settingsSection' is assigned a value but never used                                                                                                                               @typescript-eslint/no-unused-vars

&nbsp;  16:13   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp;  33:13   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  33:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp;  33:51   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp;  33:56   error  Unsafe member access .configManager on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp;  41:13   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  41:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp;  41:51   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp;  41:56   error  Unsafe member access .configManager on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp;  54:25   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  55:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  55:47   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  56:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  56:48   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  57:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  57:54   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  58:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  58:49   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  59:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  59:51   error  Unsafe member access .siteInfo on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  63:25   error  Unsafe member access .faviconThemeAdaptive on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp;  64:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  64:63   error  Unsafe member access .faviconThemeAdaptive on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp;  66:25   error  Unsafe member access .defaultOgImageAlt on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp;  67:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  67:60   error  Unsafe member access .defaultOgImageAlt on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp;  72:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  72:55   error  Unsafe member access .defaultOgImageAlt on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp;  76:25   error  Unsafe member access .navigation on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  77:26   error  Unsafe member access .navigation on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  78:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  78:51   error  Unsafe member access .navigation on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  80:26   error  Unsafe member access .navigation on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  81:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  81:52   error  Unsafe member access .navigation on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  86:25   error  Unsafe member access .currentTheme on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp;  87:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  87:46   error  Unsafe member access .currentTheme on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp;  91:25   error  Unsafe member access .typography on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  92:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  92:55   error  Unsafe member access .typography on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  93:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  93:54   error  Unsafe member access .typography on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  94:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  94:56   error  Unsafe member access .typography on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  95:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  95:53   error  Unsafe member access .typography on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  99:25   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 103:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 103:57   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 104:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 104:55   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 108:25   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 109:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 109:54   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 110:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 110:57   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 111:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 111:64   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 112:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 112:52   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 113:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 113:57   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 114:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 114:51   error  Unsafe member access .postOptions on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 118:25   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 119:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 119:63   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 120:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 120:59   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 124:25   error  Unsafe member access .footer on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 125:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 125:66   error  Unsafe member access .footer on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 129:25   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 130:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 130:57   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 144:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 144:56   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 145:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 145:60   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 146:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 146:57   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 148:26   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 149:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 151:27   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 155:26   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 156:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 158:27   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 162:26   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 163:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 165:27   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 168:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 170:27   error  Unsafe member access .commandPalette on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 176:25   error  Unsafe member access .theme on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 177:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 177:32   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                  @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 177:46   error  Unsafe member access .theme on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 177:55   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 181:25   error  Unsafe member access .site on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 182:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 182:47   error  Unsafe member access .site on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 184:25   error  Unsafe member access .title on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 185:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 185:48   error  Unsafe member access .title on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 187:25   error  Unsafe member access .description on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 188:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 188:54   error  Unsafe member access .description on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 190:25   error  Unsafe member access .author on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 191:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 191:49   error  Unsafe member access .author on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 193:25   error  Unsafe member access .language on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 194:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 194:51   error  Unsafe member access .language on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 206:13   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 206:29   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 206:34   error  Unsafe member access .triggerSettingsRefresh on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 216:13   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 219:20   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 225:13   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 225:30   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 225:46   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 225:51   error  Unsafe member access .configManager on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 226:44   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 237:27   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 238:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 238:71   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 243:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 243:66   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 249:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 249:71   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 250:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 250:85   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 254:69   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 255:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 255:110  error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 259:27   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 260:9    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 260:85   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 264:8    error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 264:50   error  Unsafe member access .config on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 277:14   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 277:30   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 277:35   error  Unsafe member access .loadSettings on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 295:20   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 300:35   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 307:6    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 308:6    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 309:6    error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 310:6    error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 320:71   error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 322:46   error  Promise returned in function argument where a void return was expected                                                                                                             @typescript-eslint/no-misused-promises

&nbsp; 341:23   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 341:28   error  Unsafe member access .settings on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 346:13   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 346:29   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 346:34   error  Unsafe member access .loadSettings on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 357:13   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 357:29   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 357:34   error  Unsafe member access .triggerSettingsRefresh on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 412:12   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 422:14   error  'error' is defined but never used                                                                                                                                                  @typescript-eslint/no-unused-vars

&nbsp; 432:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 432:15   error  A `require()` style import is forbidden                                                                                                                                            @typescript-eslint/no-require-imports

&nbsp; 432:15   error  'require' is not defined                                                                                                                                                           no-undef

&nbsp; 433:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 433:17   error  A `require()` style import is forbidden                                                                                                                                            @typescript-eslint/no-require-imports

&nbsp; 433:17   error  'require' is not defined                                                                                                                                                           no-undef

&nbsp; 434:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 434:22   error  A `require()` style import is forbidden                                                                                                                                            @typescript-eslint/no-require-imports

&nbsp; 434:22   error  'require' is not defined                                                                                                                                                           no-undef

&nbsp; 437:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 437:49   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 437:54   error  Unsafe member access .basePath on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 437:93   error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 437:98   error  Unsafe member access .path on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 438:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 438:72   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 438:82   error  Unsafe member access .toString on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 439:10   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 439:23   error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 439:28   error  Unsafe member access .join on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 441:8    error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 441:11   error  Unsafe member access .existsSync on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 443:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                              @typescript-eslint/no-unsafe-call

&nbsp; 443:11   error  Unsafe member access .openPath on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\ConfigTab.ts

&nbsp;  12:9    error  'settingsSection' is assigned a value but never used                                                                                                                             @typescript-eslint/no-unused-vars

&nbsp;  25:46   error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                           @typescript-eslint/no-unsafe-argument

&nbsp;  25:55   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  29:7    error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises

&nbsp;  36:15   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  36:31   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  36:36   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp;  39:15   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  39:47   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  39:52   error  Unsafe member access .settings on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  42:15   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  42:37   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  42:53   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  42:58   error  Unsafe member access .configManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  43:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  43:30   error  Unsafe member access .currentTemplate on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp;  45:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  45:34   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  46:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  46:31   error  Unsafe member access .currentTheme on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp;  47:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  47:45   error  Unsafe member access .contentOrganization on an `any` value                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  48:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  77:40   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  78:46   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  81:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  81:45   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  84:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  84:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  84:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 105:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 105:45   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 108:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 108:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 108:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 133:13   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 133:29   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 133:34   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 150:3    error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator               @typescript-eslint/no-floating-promises

&nbsp; 153:69   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 155:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 155:31   error  Unsafe member access .contentOrganization on an `any` value                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 156:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 156:30   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 156:46   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 156:51   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 163:35   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 164:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 164:32   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 165:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 165:33   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 165:65   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 167:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 167:49   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 167:81   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 168:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 168:75   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 168:95   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 169:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 169:49   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 169:69   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 171:35   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 172:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 172:60   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 172:80   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 172:98   error  Unsafe member access .settingsMatch on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 184:25   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 184:45   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 192:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 197:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 200:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 202:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 202:29   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 202:49   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 208:26   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 208:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 214:23   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 216:23   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 232:32   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 234:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 234:35   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 237:5    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 238:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 239:5    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 248:20   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 252:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 252:34   error  Unsafe member access .contentOrganization on an `any` value                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 272:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 272:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 272:44   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 272:49   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 275:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 275:35   error  Unsafe member access .contentOrganization on an `any` value                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 287:18   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 296:20   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 299:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 299:34   error  Unsafe member access .contentOrganization on an `any` value                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 319:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 319:33   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 319:49   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 319:54   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 323:39   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 327:6    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 328:6    error  Avoid setting styles directly via `element.style.lineHeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 331:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 331:20   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 331:33   error  Unsafe member access .split on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 334:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 334:12   error  Unsafe member access .forEach on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 347:8    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 348:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 349:8    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 350:8    error  Avoid setting styles directly via `element.style.fontWeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 355:9    error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 356:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 358:19   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 359:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 366:9    error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 367:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 369:19   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 370:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 379:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 407:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 407:36   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 407:41   error  Unsafe member access .settings on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 410:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 410:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 410:42   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 410:47   error  Unsafe member access .configManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 411:42   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 417:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 417:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 417:42   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 417:47   error  Unsafe member access .configManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 420:12   error  Unsafe member access .currentTemplate on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 425:22   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 426:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 426:37   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 427:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 427:43   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 428:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 428:13   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 428:38   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 428:66   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 429:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 429:13   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 430:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 430:13   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 434:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 435:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 435:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 435:61   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 436:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 436:14   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 436:44   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 440:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 441:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 441:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 441:66   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 442:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 442:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 442:80   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 446:17   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 446:64   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 447:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 447:14   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 447:58   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 447:105  error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 455:22   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 456:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 456:13   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 457:17   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 458:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 458:29   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 458:64   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 459:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 459:33   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 459:72   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 460:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 460:30   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 460:66   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 461:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 462:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 463:25   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 465:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 466:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 467:25   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 469:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 470:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 471:25   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 476:23   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 477:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 477:14   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 478:18   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 479:24   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 485:22   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 486:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 486:13   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 487:17   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 488:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 489:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 490:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 492:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 493:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 494:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 496:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 497:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 498:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 500:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 501:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 502:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 504:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 505:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 506:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 512:22   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 513:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 513:13   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 514:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 515:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 515:34   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 515:71   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 516:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 516:33   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 516:69   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 517:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 517:31   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 517:65   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 518:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 518:26   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 518:55   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 519:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 519:36   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 519:75   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 520:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 520:45   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 520:93   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 521:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 521:41   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 521:85   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 522:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 523:18   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 524:25   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 526:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 527:18   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 528:6    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 528:30   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 528:73   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 529:6    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 529:36   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 529:85   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 530:6    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 530:31   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 530:75   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 531:6    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 531:40   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 531:93   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 533:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 533:24   error  Unsafe member access .postOptions on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 538:22   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 539:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 539:13   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 540:17   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 541:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 541:36   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 541:74   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 542:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 542:36   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 542:74   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 543:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 543:27   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 543:56   error  Unsafe member access .navigation on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 549:22   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 550:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 550:13   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 550:45   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 550:80   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 554:22   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 555:13   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 556:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 556:30   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 557:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 557:26   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 562:22   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 563:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 563:13   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 564:17   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 565:5    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 565:45   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 565:88   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 568:4    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 568:13   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 568:63   error  Unsafe member access .footer on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 568:106  error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 580:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 580:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 580:42   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 580:47   error  Unsafe member access .configManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 581:42   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 586:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 586:36   error  Unsafe member access .config on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 592:17   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 606:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 606:46   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 606:51   error  Unsafe member access \[key] on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 607:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 607:25   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 607:35   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 607:47   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 607:52   error  Unsafe member access \[key] on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 609:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 612:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 620:18   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 621:19   error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 622:113  error  Unsafe member access .features on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\FeaturesTab.ts

&nbsp;   10:9    error  'settingsSection' is assigned a value but never used                                                                                                                                    @typescript-eslint/no-unused-vars

&nbsp;   16:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;   21:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;   25:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;   36:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;   36:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;   36:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;   43:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;   54:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;   54:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;   54:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;   72:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;   72:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;   72:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;   87:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;   91:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  105:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  105:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  105:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  123:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  123:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  123:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  138:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  154:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  154:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  154:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  171:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  171:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  171:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  186:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  186:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  186:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  201:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  201:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  201:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  211:24   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  212:25   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  213:25   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  220:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  220:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  220:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  229:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  230:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp;  231:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  236:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  240:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  259:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  259:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  259:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  274:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  306:40   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  323:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  323:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  323:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  339:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  339:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  339:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  355:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  355:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  355:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  371:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  371:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  371:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  377:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  378:42   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  404:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  405:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  420:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  420:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  420:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  437:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  437:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  437:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  454:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  454:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  454:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  470:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  470:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  470:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  486:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  486:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  486:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  494:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  495:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp;  496:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  501:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  525:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  525:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  525:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  540:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  573:21   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  582:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  582:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  582:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  599:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  599:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  599:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  613:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  629:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  629:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  629:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  658:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  701:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  741:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  742:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp;  743:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  748:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  793:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  793:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  793:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  810:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  810:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  810:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  828:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  828:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  828:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  846:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  846:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  846:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  860:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  891:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  891:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  891:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  905:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  965:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  965:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  965:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  978:38   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp;  985:5    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  985:61   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  986:5    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  986:58   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  989:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp;  989:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp;  989:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1001:22   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 1010:5    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1010:57   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1011:5    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1011:54   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1014:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1014:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1014:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1028:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 1045:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1045:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1045:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1054:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1055:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1056:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1061:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 1070:72   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1071:9    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1071:30   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1071:67   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1072:9    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1072:36   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1083:9    error  'profileSetting' is assigned a value but never used                                                                                                                                     @typescript-eslint/no-unused-vars

&nbsp; 1087:15   error  Unsafe argument of type `any` assigned to a parameter of type `boolean`                                                                                                                 @typescript-eslint/no-unsafe-argument

&nbsp; 1089:15   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1090:20   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1091:16   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1091:37   error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1091:70   error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1091:89   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1093:15   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1096:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1096:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1096:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1116:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1117:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 1121:3    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 1122:3    error  Avoid setting styles directly via `element.style.gridTemplateColumns`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 1123:3    error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties                  obsidianmd/no-static-styles-assignment

&nbsp; 1124:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1131:4    error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1131:20   error  Unsafe member access .image on an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 1133:21   error  Unsafe member access .image on an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 1138:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1138:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1138:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1149:4    error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1149:20   error  Unsafe member access .alt on an `any` value                                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 1151:21   error  Unsafe member access .alt on an `any` value                                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 1156:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1156:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1156:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1170:15   error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1170:31   error  Unsafe member access .size on an `any` value                                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 1172:22   error  Unsafe member access .size on an `any` value                                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 1175:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1175:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1175:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1184:4    error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1184:20   error  Unsafe member access .url on an `any` value                                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 1186:21   error  Unsafe member access .url on an `any` value                                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 1191:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1191:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1191:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1204:15   error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1204:31   error  Unsafe member access .placement on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 1206:22   error  Unsafe member access .placement on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 1209:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1209:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1209:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1221:15   error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                  @typescript-eslint/no-unsafe-argument

&nbsp; 1221:31   error  Unsafe member access .style on an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 1223:22   error  Unsafe member access .style on an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 1226:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1226:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1226:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1231:66   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1233:9    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1233:30   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1233:78   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1233:109  error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1234:9    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1234:37   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1234:71   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1253:9    error  'commentsSetting' is assigned a value but never used                                                                                                                                    @typescript-eslint/no-unused-vars

&nbsp; 1255:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 1257:15   error  Unsafe argument of type `any` assigned to a parameter of type `boolean`                                                                                                                 @typescript-eslint/no-unsafe-argument

&nbsp; 1260:15   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1263:20   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1264:16   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1264:408  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1267:15   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1270:20   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1271:16   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1271:179  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1274:15   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1277:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1277:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1277:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1297:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1298:3    error  Avoid setting styles directly via `element.style.paddingLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 1302:3    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 1303:3    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 1304:3    error  Avoid setting styles directly via `element.style.background`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1305:3    error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 1306:3    error  Avoid setting styles directly via `element.style.borderLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1309:3    error  Avoid setting styles directly via `element.style.margin`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties               obsidianmd/no-static-styles-assignment

&nbsp; 1310:3    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 1311:3    error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties                obsidianmd/no-static-styles-assignment

&nbsp; 1312:3    error  Avoid setting styles directly via `element.style.whiteSpace`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1315:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                         @microsoft/sdl/no-inner-html

&nbsp; 1321:5    error  Avoid setting styles directly via `element.style.textDecoration`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 1324:5    error  Avoid setting styles directly via `element.style.textDecoration`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 1330:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 1331:13   error  Use sentence case for UI text                                                                                                                                                           obsidianmd/ui/sentence-case

&nbsp; 1355:3    error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties                obsidianmd/no-static-styles-assignment

&nbsp; 1356:3    error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1357:3    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 1358:3    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 1359:3    error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties               obsidianmd/no-static-styles-assignment

&nbsp; 1360:3    error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 1361:3    error  Avoid setting styles directly via `element.style.background`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 1362:3    error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties                obsidianmd/no-static-styles-assignment

&nbsp; 1363:3    error  Avoid setting styles directly via `element.style.resize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties               obsidianmd/no-static-styles-assignment

&nbsp; 1366:3    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1366:29   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1366:79   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1370:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 1371:3    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 1382:11   error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1382:37   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1382:85   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1382:116  error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1385:19   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1386:15   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1386:190  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1388:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1388:15   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1389:19   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1403:7    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1408:19   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1409:15   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1409:407  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1409:426  error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1411:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1411:15   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1411:52   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1415:19   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1416:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1416:15   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1416:32   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1418:5    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1418:14   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1422:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1422:27   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1422:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1435:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                         @microsoft/sdl/no-inner-html

&nbsp; 1441:12   error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1441:38   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1441:86   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1441:117  error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1444:23   error  Unsafe member access .rawScript on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 1445:23   error  Unsafe member access .repo on an `any` value                                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 1446:23   error  Unsafe member access .repoId on an `any` value                                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 1447:23   error  Unsafe member access .category on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1448:23   error  Unsafe member access .categoryId on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 1449:23   error  Unsafe member access .mapping on an `any` value                                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 1450:23   error  Unsafe member access .strict on an `any` value                                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 1451:23   error  Unsafe member access .reactions on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 1452:23   error  Unsafe member access .metadata on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1453:23   error  Unsafe member access .inputPosition on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 1454:23   error  Unsafe member access .theme on an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 1455:23   error  Unsafe member access .lang on an `any` value                                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 1456:23   error  Unsafe member access .loading on an `any` value                                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 1458:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1458:23   error  Unsafe member access .enabled on an `any` value                                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 1461:20   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1462:16   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1462:179  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1464:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1464:15   error  Unsafe member access .optionalFeatures on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 1467:20   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1468:16   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1468:408  error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1470:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1470:15   error  Unsafe member access .postOptions on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1474:20   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1475:7    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1475:16   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1475:33   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1477:6    error  Unsafe assignment of an `any` value                                                                                                                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 1477:15   error  Unsafe member access .features on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 1482:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                                   @typescript-eslint/no-unsafe-call

&nbsp; 1482:28   error  Unexpected any. Specify a different type                                                                                                                                                @typescript-eslint/no-explicit-any

&nbsp; 1482:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 1498:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                         @microsoft/sdl/no-inner-html

&nbsp; 1510:4    error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                      @typescript-eslint/no-floating-promises

&nbsp; 1513:42   error  Promise returned in function argument where a void return was expected                                                                                                                  @typescript-eslint/no-misused-promises

&nbsp; 1519:37   error  Promise returned in function argument where a void return was expected                                                                                                                  @typescript-eslint/no-misused-promises

&nbsp; 1530:3    error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                      @typescript-eslint/no-floating-promises



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\GeneralTab.ts

&nbsp;  1:19  error  'Notice' is defined but never used                                                  @typescript-eslint/no-unused-vars

&nbsp; 20:13  error  Use sentence case for UI text                                                       obsidianmd/ui/sentence-case

&nbsp; 39:44  error  Use sentence case for UI text                                                       obsidianmd/ui/sentence-case

&nbsp; 51:20  error  Use sentence case for UI text                                                       obsidianmd/ui/sentence-case

&nbsp; 55:47  error  Unexpected any. Specify a different type                                            @typescript-eslint/no-explicit-any

&nbsp; 56:37  error  Unexpected any. Specify a different type                                            @typescript-eslint/no-explicit-any

&nbsp; 56:42  error  Unsafe member access .settings on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 58:52  error  Unsafe argument of type `any` assigned to a parameter of type `AstroModularPlugin`  @typescript-eslint/no-unsafe-argument

&nbsp; 58:67  error  Unexpected any. Specify a different type                                            @typescript-eslint/no-explicit-any

&nbsp; 83:26  error  Unexpected any. Specify a different type                                            @typescript-eslint/no-explicit-any

&nbsp; 83:31  error  Unsafe member access .updateRibbonIcon on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp; 84:13  error  Unsafe call of a(n) `any` typed value                                               @typescript-eslint/no-unsafe-call

&nbsp; 84:29  error  Unexpected any. Specify a different type                                            @typescript-eslint/no-explicit-any

&nbsp; 84:34  error  Unsafe member access .updateRibbonIcon on an `any` value                            @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\NavigationTab.ts

&nbsp;  15:9    error  'settingsSection' is assigned a value but never used                                                                                                                             @typescript-eslint/no-unused-vars

&nbsp;  23:13   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  29:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  30:43   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  31:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  31:30   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  31:47   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  36:84   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  37:113  error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  47:24   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  47:24   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  47:29   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  47:50   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  50:95   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  51:92   error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  55:11   error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  74:13   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  77:21   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  93:13   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp;  99:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 100:46   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 104:88   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 105:93   error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 110:83   error  Unsafe member access .icon on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 130:13   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 133:21   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 146:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 147:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 148:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 153:13   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 165:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 165:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 165:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 182:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 182:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 182:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 197:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 197:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 197:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 218:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 225:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 238:6    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 239:6    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 241:6    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 242:6    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 250:5    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 251:5    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 266:5    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 267:5    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 296:21   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 296:26   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 297:47   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 297:61   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 297:66   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 298:45   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 298:59   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 298:64   error  Unsafe member access .\_dragEndHandler on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 299:46   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 299:60   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 299:65   error  Unsafe member access .\_dragOverHandler on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 300:47   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 300:61   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 300:66   error  Unsafe member access .\_dragLeaveHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 301:42   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 301:56   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 301:61   error  Unsafe member access .\_dropHandler on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 305:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 305:22   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 306:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 306:22   error  Unsafe member access .\_dragEndHandler on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 307:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 307:22   error  Unsafe member access .\_dragOverHandler on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 308:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 308:22   error  Unsafe member access .\_dragLeaveHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 309:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 309:22   error  Unsafe member access .\_dropHandler on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 316:38   error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises

&nbsp; 406:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 406:28   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 406:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 414:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 414:28   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 414:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 434:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 434:28   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 434:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 441:7    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 457:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 457:27   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 457:32   error  Unsafe member access .loadSettings on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 464:6    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 478:42   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: MouseEvent) => any`                                                                       @typescript-eslint/no-unsafe-argument

&nbsp; 478:56   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 478:61   error  Unsafe member access .\_removeHandler on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 480:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 480:22   error  Unsafe member access .\_removeHandler on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 481:39   error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises

&nbsp; 491:42   error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\PluginsTab.ts

&nbsp;  10:9    error  'settingsSection' is assigned a value but never used                                                                                                                             @typescript-eslint/no-unused-vars

&nbsp;  14:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  14:30   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  14:46   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  14:51   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  21:35   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  22:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  22:32   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  23:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  23:33   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  23:65   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  25:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  25:49   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  25:81   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  26:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  26:75   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  26:95   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  27:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  27:49   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  27:69   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  29:35   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  30:10   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  30:60   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  30:80   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  30:98   error  Unsafe member access .settingsMatch on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  42:41   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  50:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  55:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  58:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  60:5    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  60:45   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  66:26   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  66:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  72:23   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  74:23   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  87:10   error  'statusP' is assigned a value but never used                                                                                                                                     @typescript-eslint/no-unused-vars

&nbsp;  90:32   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  92:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  92:35   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  95:5    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp;  96:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp;  97:5    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 106:20   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 130:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 130:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 130:44   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 130:49   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 133:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 133:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 133:51   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 133:56   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 138:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 139:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 139:36   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 140:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 140:37   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 140:69   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 141:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 141:53   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 141:85   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 142:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 142:79   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 142:99   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 143:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 143:53   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 143:73   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 144:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 145:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 145:64   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 145:84   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 145:102  error  Unsafe member access .settingsMatch on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 155:30   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 155:50   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 162:9    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 166:9    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 168:9    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 170:9    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp; 170:34   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 170:54   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 176:30   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 176:43   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 182:27   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 184:27   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 199:36   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 201:32   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 201:39   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 204:9    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 205:9    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 206:9    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 217:18   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 226:20   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 249:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 249:33   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 249:49   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 249:54   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 253:39   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 257:6    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 258:6    error  Avoid setting styles directly via `element.style.lineHeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 261:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 261:20   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 261:33   error  Unsafe member access .split on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 264:7    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 264:13   error  Unsafe member access .forEach on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 277:8    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 278:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 279:8    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 280:8    error  Avoid setting styles directly via `element.style.fontWeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 285:9    error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 286:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 288:19   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 289:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 296:9    error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 297:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 299:19   error  This assertion is unnecessary since it does not change the type of the expression                                                                                                @typescript-eslint/no-unnecessary-type-assertion

&nbsp; 300:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 309:8    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\SiteInfoTab.ts

&nbsp;  10:9    error  'settingsSection' is assigned a value but never used                                                                                                                                @typescript-eslint/no-unused-vars

&nbsp;  71:3    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp;  72:3    error  Avoid setting styles directly via `element.style.paddingTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp;  73:3    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp;  77:13   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp;  81:3    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  82:3    error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp;  83:3    error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties   obsidianmd/no-static-styles-assignment

&nbsp;  84:3    error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp;  85:3    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp;  92:3    error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp;  93:3    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  94:3    error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp;  95:3    error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp;  96:3    error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp;  97:3    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp;  98:3    error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp;  99:3    error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties   obsidianmd/no-static-styles-assignment

&nbsp; 102:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                     @microsoft/sdl/no-inner-html

&nbsp; 104:48   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 108:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 108:24   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 108:29   error  Unsafe member access .openWithDefaultApp on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 117:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 117:16   error  A `require()` style import is forbidden                                                                                                                                             @typescript-eslint/no-require-imports

&nbsp; 117:16   error  'require' is not defined                                                                                                                                                            no-undef

&nbsp; 118:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 118:18   error  A `require()` style import is forbidden                                                                                                                                             @typescript-eslint/no-require-imports

&nbsp; 118:18   error  'require' is not defined                                                                                                                                                            no-undef

&nbsp; 121:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 121:50   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 121:55   error  Unsafe member access .basePath on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 121:94   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 121:99   error  Unsafe member access .path on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 122:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 122:73   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 122:83   error  Unsafe member access .toString on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 125:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 125:30   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 125:35   error  Unsafe member access .join on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 126:11   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 126:24   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 126:29   error  Unsafe member access .join on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 129:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 129:13   error  Unsafe member access .existsSync on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 130:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 130:9    error  Unsafe member access .mkdirSync on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 134:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 134:8    error  Unsafe member access .copyFileSync on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 165:36   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 173:7    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 174:7    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 175:7    error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 176:7    error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties   obsidianmd/no-static-styles-assignment

&nbsp; 188:47   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 197:15   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 197:20   error  A `require()` style import is forbidden                                                                                                                                             @typescript-eslint/no-require-imports

&nbsp; 197:20   error  'require' is not defined                                                                                                                                                            no-undef

&nbsp; 198:15   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 198:22   error  A `require()` style import is forbidden                                                                                                                                             @typescript-eslint/no-require-imports

&nbsp; 198:22   error  'require' is not defined                                                                                                                                                            no-undef

&nbsp; 201:15   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 201:43   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 201:48   error  Unsafe member access .path on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 203:34   error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                              @typescript-eslint/no-unsafe-argument

&nbsp; 207:25   error  'Buffer' is not defined                                                                                                                                                             no-undef

&nbsp; 209:16   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 209:55   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 209:60   error  Unsafe member access .basePath on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 209:99   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 209:104  error  Unsafe member access .path on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 210:16   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 210:78   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 210:88   error  Unsafe member access .toString on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 211:16   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 211:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 211:40   error  Unsafe member access .join on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 212:16   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 212:29   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 212:34   error  Unsafe member access .join on an `any` value                                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 214:15   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 214:18   error  Unsafe member access .existsSync on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 215:11   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 215:14   error  Unsafe member access .mkdirSync on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 218:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 218:13   error  Unsafe member access .writeFileSync on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 237:13   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 238:13   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 245:43   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 266:16   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 273:13   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 280:43   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 285:9    error  'faviconAdaptiveSetting' is assigned a value but never used                                                                                                                         @typescript-eslint/no-unused-vars

&nbsp; 294:12   error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 294:28   error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 294:33   error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 306:14   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 313:49   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 320:14   error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 327:48   error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\tabs\\StyleTab.ts

&nbsp;  15:9   error  'settingsSection' is assigned a value but never used                                                                                                                                @typescript-eslint/no-unused-vars

&nbsp;  32:5   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp;  32:38  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp;  35:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp;  35:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp;  35:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  42:12  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp;  42:28  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp;  42:44  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp;  42:49  error  Unsafe member access .configManager on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp;  66:7   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp;  66:47  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp;  73:12  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp;  73:28  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp;  73:33  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  93:4   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp;  94:4   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 100:4   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 101:4   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 102:4   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 105:4   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 106:4   error  Avoid setting styles directly via `element.style.flexWrap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 107:4   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 115:6   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 116:6   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 117:6   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 118:6   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 119:6   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 120:6   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 121:5   error  Avoid setting styles directly via `element.style.cursor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 122:5   error  Avoid setting styles directly via `element.style.transition`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 126:6   error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 127:6   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 128:6   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 130:6   error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 131:6   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 132:6   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 139:5   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 140:5   error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 142:36  error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 154:7   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 154:47  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 157:13  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 157:29  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 157:34  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 176:4   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 177:4   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 178:4   error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 179:4   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 180:4   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 186:4   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 187:4   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 188:4   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 189:4   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 193:4   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 194:4   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 195:4   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 205:4   error  Avoid setting styles directly via `element.style.flex`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties             obsidianmd/no-static-styles-assignment

&nbsp; 206:4   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 207:4   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 208:4   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 209:4   error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 210:4   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 211:4   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 220:4   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 221:4   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 222:4   error  Avoid setting styles directly via `element.style.backgroundColor`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 223:4   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 224:4   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 225:4   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 226:4   error  Avoid setting styles directly via `element.style.justifyContent`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties   obsidianmd/no-static-styles-assignment

&nbsp; 227:4   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 231:4   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                     @microsoft/sdl/no-inner-html

&nbsp; 234:43  error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 239:12  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 239:25  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 239:30  error  Unsafe member access .openWithDefaultApp on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 247:48  error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 251:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 251:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 251:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 259:35  error  Promise returned in function argument where a void return was expected                                                                                                              @typescript-eslint/no-misused-promises

&nbsp; 297:12  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 297:28  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 297:33  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 319:14  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 322:27  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 332:14  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 332:30  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 332:35  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 347:5   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 364:13  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 364:29  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 364:34  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 385:14  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 388:27  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 413:15  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 413:31  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 413:47  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 413:52  error  Unsafe member access .configManager on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 439:13  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 450:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 450:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 450:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 454:12  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 454:28  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 454:44  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 454:49  error  Unsafe member access .configManager on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 468:13  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 479:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 479:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 479:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 483:12  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 483:28  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 483:44  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 483:49  error  Unsafe member access .configManager on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 497:13  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 508:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 508:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 508:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 512:12  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 512:28  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 512:44  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 512:49  error  Unsafe member access .configManager on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 526:13  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 529:33  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 530:31  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 533:5   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 533:47  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 536:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 536:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 536:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 553:13  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 564:11  error  Unsafe call of a(n) `any` typed value                                                                                                                                               @typescript-eslint/no-unsafe-call

&nbsp; 564:27  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 564:32  error  Unsafe member access .loadSettings on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 653:61  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 655:41  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 658:3   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 659:3   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 660:3   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 665:10  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 665:30  error  Unsafe member access .primary on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 668:5   error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 669:5   error  Avoid setting styles directly via `element.style.height`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 670:5   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 671:5   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 672:5   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 680:10  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 680:30  error  Unsafe member access .highlight on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 683:5   error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 684:5   error  Avoid setting styles directly via `element.style.height`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 685:5   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 686:5   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 687:5   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 696:68  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 698:3   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 699:40  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 702:9   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 702:32  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 703:9   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 703:36  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 705:12  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 706:4   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 707:4   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 712:39  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 716:4   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 716:20  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 718:3   error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 721:3   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 721:38  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 726:14  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 733:13  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 740:43  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 744:4   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 744:20  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 746:3   error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 749:3   error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 749:42  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 754:14  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 761:13  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 770:70  error  Unexpected any. Specify a different type                                                                                                                                            @typescript-eslint/no-explicit-any

&nbsp; 772:42  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 776:41  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 780:10  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 780:32  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 783:5   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 784:5   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 785:5   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 786:5   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 790:5   error  Avoid setting styles directly via `element.style.minWidth`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 791:5   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 792:5   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 795:5   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 796:5   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 797:5   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 799:65  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 800:5   error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 801:5   error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 802:5   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 804:68  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 809:16  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 816:15  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 825:43  error  Use sentence case for UI text                                                                                                                                                       obsidianmd/ui/sentence-case

&nbsp; 829:10  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 829:32  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 832:5   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 833:5   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 834:5   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 835:5   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 839:5   error  Avoid setting styles directly via `element.style.minWidth`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 840:5   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 841:5   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 844:5   error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 845:5   error  Avoid setting styles directly via `element.style.gap`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties              obsidianmd/no-static-styles-assignment

&nbsp; 846:5   error  Avoid setting styles directly via `element.style.alignItems`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 848:65  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 849:5   error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties            obsidianmd/no-static-styles-assignment

&nbsp; 850:5   error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 851:5   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 853:68  error  Unsafe assignment of an `any` value                                                                                                                                                 @typescript-eslint/no-unsafe-assignment

&nbsp; 858:16  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 865:15  error  Unsafe member access .themeColors on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\BaseWizardStep.ts

&nbsp; 36:33  error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp; 37:33  error  Unsafe argument of type `any` assigned to a parameter of type `Partial<WizardState>`  @typescript-eslint/no-unsafe-argument



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\ContentOrgStep.ts

&nbsp; 8:3  error  Do not write to DOM directly using innerHTML/outerHTML property  @microsoft/sdl/no-inner-html



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\DeploymentStep.ts

&nbsp; 7:3  error  Do not write to DOM directly using innerHTML/outerHTML property  @microsoft/sdl/no-inner-html



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\FinalizeStep.ts

&nbsp; 15:3   error  Do not write to DOM directly using innerHTML/outerHTML property  @microsoft/sdl/no-inner-html

&nbsp; 35:61  error  Unsafe member access .title on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 38:59  error  Unsafe member access .site on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 53:9   error  'state' is assigned a value but never used                       @typescript-eslint/no-unused-vars

&nbsp; 60:10  error  Unsafe call of a(n) `any` typed value                            @typescript-eslint/no-unsafe-call

&nbsp; 60:26  error  Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any

&nbsp; 60:31  error  Unsafe member access .saveData on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 60:56  error  Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any

&nbsp; 60:61  error  Unsafe member access .settings on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 63:10  error  Unsafe call of a(n) `any` typed value                            @typescript-eslint/no-unsafe-call

&nbsp; 63:26  error  Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any

&nbsp; 63:31  error  Unsafe member access .loadSettings on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 66:10  error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 66:37  error  Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any

&nbsp; 66:42  error  Unsafe member access .settings on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 67:10  error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 67:32  error  Unsafe call of a(n) `any` typed value                            @typescript-eslint/no-unsafe-call

&nbsp; 67:48  error  Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any

&nbsp; 67:53  error  Unsafe member access .configManager on an `any` value            @typescript-eslint/no-unsafe-member-access

&nbsp; 68:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 68:20  error  Unsafe member access .currentTemplate on an `any` value          @typescript-eslint/no-unsafe-member-access

&nbsp; 70:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 70:24  error  Unsafe member access .features on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 71:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 71:21  error  Unsafe member access .currentTheme on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 72:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 72:35  error  Unsafe member access .contentOrganization on an `any` value      @typescript-eslint/no-unsafe-member-access

&nbsp; 73:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\FontStep.ts

&nbsp;   9:3   error  Do not write to DOM directly using innerHTML/outerHTML property         @microsoft/sdl/no-inner-html

&nbsp;  35:4   error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  35:29  error  Unsafe member access .headingFont on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  39:4   error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  39:29  error  Unsafe member access .proseFont on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp;  43:4   error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  43:29  error  Unsafe member access .monoFont on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp;  48:13  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  51:33  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  52:31  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  53:23  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  53:48  error  Unsafe member access .fontSource on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp;  62:32  error  Unsafe member access .fontSource on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp;  64:14  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  65:14  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  67:16  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  67:41  error  Unsafe member access .customFonts on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  72:14  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  75:16  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  75:41  error  Unsafe member access .customFonts on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  76:22  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  80:14  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  83:16  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  83:41  error  Unsafe member access .customFonts on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  84:22  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  88:14  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  91:16  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp;  91:41  error  Unsafe member access .customFonts on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  92:22  error  Use sentence case for UI text                                           obsidianmd/ui/sentence-case

&nbsp;  97:69  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 100:4   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 107:69  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 110:4   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 112:5   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 113:41  error  Unsafe member access .customFonts on an `any` value                     @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\NavigationStep.ts

&nbsp;   8:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  18:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  18:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  18:35   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  18:52   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  19:15   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  19:34   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  19:51   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  24:88   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  25:117  error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  35:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  35:28   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  35:33   error  Unsafe member access .children on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  35:54   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  38:99   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  39:96   error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  43:15   error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  48:11   error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  57:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  57:10   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  57:35   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  57:55   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  61:92   error  Unsafe member access .title on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  62:97   error  Unsafe member access .url on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  67:87   error  Unsafe member access .icon on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  73:11   error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 104:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 110:39   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 112:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 118:36   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 119:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 121:36   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 121:65   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 122:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 122:61   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 124:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 124:60   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 129:36   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 130:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 132:36   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 132:65   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 133:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 133:61   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 135:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 135:60   error  Unsafe member access \[childIndex] on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 139:22   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 139:27   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 140:44   error  Unsafe argument of type `any` assigned to a parameter of type `EventListenerOrEventListenerObject`                                                                               @typescript-eslint/no-unsafe-argument

&nbsp; 140:58   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 140:63   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 142:18   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 142:23   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 157:31   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 161:23   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 161:28   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 162:45   error  Unsafe argument of type `any` assigned to a parameter of type `EventListenerOrEventListenerObject`                                                                               @typescript-eslint/no-unsafe-argument

&nbsp; 162:60   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 162:65   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 164:19   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 164:24   error  Unsafe member access .\_inputHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 172:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 172:30   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 176:23   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 176:28   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 177:45   error  Unsafe argument of type `any` assigned to a parameter of type `EventListenerOrEventListenerObject`                                                                               @typescript-eslint/no-unsafe-argument

&nbsp; 177:60   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 177:65   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 179:19   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 179:24   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 187:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 187:30   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 191:25   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 191:30   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 192:47   error  Unsafe argument of type `any` assigned to a parameter of type `EventListenerOrEventListenerObject`                                                                               @typescript-eslint/no-unsafe-argument

&nbsp; 192:64   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 192:69   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 194:21   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 194:26   error  Unsafe member access .\_clickHandler on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 210:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 210:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 212:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 212:31   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 222:34   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 223:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 223:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 223:60   error  Unsafe member access .splice on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 224:35   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 224:64   error  Unsafe member access .length on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 225:39   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 230:58   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 230:114  error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 230:143  error  Unsafe member access .length on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 231:7    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 241:35   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 242:31   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 244:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 244:30   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 244:53   error  Unsafe member access .push on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 249:6    error  Avoid setting styles directly via `element.style.display`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 256:21   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 256:26   error  Unsafe member access .\_removeHandler on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 257:43   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: MouseEvent) => any`                                                                       @typescript-eslint/no-unsafe-argument

&nbsp; 257:57   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 257:62   error  Unsafe member access .\_removeHandler on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 259:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 259:22   error  Unsafe member access .\_removeHandler on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 275:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 282:5    error  Avoid setting styles directly via `element.style.opacity`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 295:6    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 296:6    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 298:6    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 299:6    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 307:5    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 308:5    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 323:5    error  Avoid setting styles directly via `element.style.borderTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 324:5    error  Avoid setting styles directly via `element.style.borderBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 328:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 328:27   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 328:52   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 328:82   error  Unsafe member access \[0] on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 329:7    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 329:32   error  Unsafe member access .pages on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 331:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 331:27   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 331:52   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 331:83   error  Unsafe member access \[0] on an `any` value                                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 332:7    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 332:32   error  Unsafe member access .social on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 340:21   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 340:26   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 341:47   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 341:61   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 341:66   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 342:45   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 342:59   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 342:64   error  Unsafe member access .\_dragEndHandler on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 343:46   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 343:60   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 343:65   error  Unsafe member access .\_dragOverHandler on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 344:47   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 344:61   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 344:66   error  Unsafe member access .\_dragLeaveHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 345:42   error  Unsafe argument of type `any` assigned to a parameter of type `(this: HTMLElement, ev: DragEvent) => any`                                                                        @typescript-eslint/no-unsafe-argument

&nbsp; 345:56   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 345:61   error  Unsafe member access .\_dropHandler on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp; 349:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 349:22   error  Unsafe member access .\_dragStartHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 350:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 350:22   error  Unsafe member access .\_dragEndHandler on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 351:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 351:22   error  Unsafe member access .\_dragOverHandler on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 352:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 352:22   error  Unsafe member access .\_dragLeaveHandler on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 353:17   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 353:22   error  Unsafe member access .\_dropHandler on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\OptionalFeaturesStep.ts

&nbsp;   8:3   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                    @microsoft/sdl/no-inner-html

&nbsp;  25:75  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp;  26:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  26:27  error  Unsafe member access .selectedOptionalFeatures on an `any` value                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  27:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  27:33  error  Unsafe member access .selectedOptionalFeatures on an `any` value                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  37:15  error  Unsafe argument of type `any` assigned to a parameter of type `boolean`                                                                                                            @typescript-eslint/no-unsafe-argument

&nbsp;  42:7   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  43:7   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  45:8   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  45:68  error  Unsafe member access .profilePicture on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp;  63:16  error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                             @typescript-eslint/no-unsafe-argument

&nbsp;  63:32  error  Unsafe member access \[name] on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  68:23  error  Promise returned in function argument where a void return was expected                                                                                                             @typescript-eslint/no-misused-promises

&nbsp;  69:24  error  Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                             @typescript-eslint/no-unsafe-argument

&nbsp;  69:40  error  Unsafe member access \[name] on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  90:51  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp;  90:63  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp;  94:4   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  96:5   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp;  96:65  error  Unsafe member access .profilePicture on an `any` value                                                                                                                             @typescript-eslint/no-unsafe-member-access

&nbsp;  96:81  error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 101:69  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 102:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 102:27  error  Unsafe member access .selectedOptionalFeatures on an `any` value                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 103:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 103:34  error  Unsafe member access .selectedOptionalFeatures on an `any` value                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 112:7   error  'commentsToggle' is assigned a value but never used                                                                                                                                @typescript-eslint/no-unused-vars

&nbsp; 117:13  error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 120:21  error  Unsafe argument of type `any` assigned to a parameter of type `boolean`                                                                                                            @typescript-eslint/no-unsafe-argument

&nbsp; 125:8   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 126:8   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 128:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 128:63  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 143:3   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 144:3   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 145:3   error  Avoid setting styles directly via `element.style.background`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 146:3   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 147:3   error  Avoid setting styles directly via `element.style.borderLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 150:3   error  Avoid setting styles directly via `element.style.margin`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 151:3   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 152:3   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 153:3   error  Avoid setting styles directly via `element.style.whiteSpace`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 156:3   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                    @microsoft/sdl/no-inner-html

&nbsp; 162:5   error  Avoid setting styles directly via `element.style.textDecoration`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 165:5   error  Avoid setting styles directly via `element.style.textDecoration`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 171:13  error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 172:13  error  Use sentence case for UI text                                                                                                                                                      obsidianmd/ui/sentence-case

&nbsp; 196:3   error  Avoid setting styles directly via `element.style.width`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 197:3   error  Avoid setting styles directly via `element.style.fontFamily`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 198:3   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 199:3   error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties         obsidianmd/no-static-styles-assignment

&nbsp; 200:3   error  Avoid setting styles directly via `element.style.border`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 201:3   error  Avoid setting styles directly via `element.style.borderRadius`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 202:3   error  Avoid setting styles directly via `element.style.background`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 203:3   error  Avoid setting styles directly via `element.style.color`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties           obsidianmd/no-static-styles-assignment

&nbsp; 204:3   error  Avoid setting styles directly via `element.style.resize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties          obsidianmd/no-static-styles-assignment

&nbsp; 207:3   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 207:37  error  Unsafe member access .rawScript on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 211:3   error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 212:3   error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties        obsidianmd/no-static-styles-assignment

&nbsp; 221:11  error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 221:67  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 223:6   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 225:7   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 226:50  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 240:8   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 252:5   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                    @microsoft/sdl/no-inner-html

&nbsp; 259:12  error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 259:68  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 263:7   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 265:8   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 266:51  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 280:9   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 289:5   error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                    @microsoft/sdl/no-inner-html

&nbsp; 293:38  error  Promise returned in function argument where a void return was expected                                                                                                             @typescript-eslint/no-misused-promises

&nbsp; 296:3   error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                 @typescript-eslint/no-floating-promises

&nbsp; 299:51  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 299:63  error  Unexpected any. Specify a different type                                                                                                                                           @typescript-eslint/no-explicit-any

&nbsp; 303:4   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 305:5   error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment

&nbsp; 305:59  error  Unsafe member access .comments on an `any` value                                                                                                                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 305:69  error  Unsafe assignment of an `any` value                                                                                                                                                @typescript-eslint/no-unsafe-assignment



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\PluginConfigStep.ts

&nbsp;   5:2    error  Promise-returning method provided where a void return was expected by extended/implemented type 'BaseWizardStep'                                                                 @typescript-eslint/no-misused-promises

&nbsp;  10:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  10:30   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  10:46   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  10:51   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  12:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                                  @microsoft/sdl/no-inner-html

&nbsp;  18:9    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  18:9    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  18:22   error  Unsafe member access .map on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  18:35   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp;  19:38   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  20:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  20:35   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  21:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  21:36   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  21:68   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  23:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  23:52   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  23:84   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  24:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  24:78   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  24:98   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  25:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  25:52   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  25:72   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  27:38   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  28:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  28:63   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  28:83   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  28:101  error  Unsafe member access .settingsMatch on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  31:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp;  31:43   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  31:63   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  38:26   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  40:26   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  63:29   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  63:49   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  78:26   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  78:46   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp;  89:22   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp;  91:35   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  91:135  error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp;  91:142  error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  95:9    error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 112:76   error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises

&nbsp; 135:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 135:27   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 135:43   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 135:48   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 138:12   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 138:34   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 138:50   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 138:55   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 143:7    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 143:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 143:35   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 143:49   error  Unsafe member access .map on an `any` value                                                                                                                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 143:62   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 144:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 145:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 145:36   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 146:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 146:37   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 146:69   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 147:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 147:53   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 147:85   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 148:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 148:79   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 148:99   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 149:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 149:53   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 149:73   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 150:39   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 151:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 151:64   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 151:84   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 151:102  error  Unsafe member access .settingsMatch on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 154:14   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 154:44   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 154:64   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 160:27   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 162:27   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 183:30   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 183:50   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 196:27   error  Unsafe member access .installed on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 196:47   error  Unsafe member access .enabled on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 207:24   error  Unsafe member access .name on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 209:37   error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 209:137  error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 209:144  error  Unsafe member access .outOfSyncContentTypes on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 213:10   error  Unsafe member access .join on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 223:17   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 231:76   error  Promise returned in function argument where a void return was expected                                                                                                           @typescript-eslint/no-misused-promises

&nbsp; 254:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 254:32   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 254:48   error  Unexpected any. Specify a different type                                                                                                                                         @typescript-eslint/no-explicit-any

&nbsp; 254:53   error  Unsafe member access .pluginManager on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 257:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 257:23   error  A `require()` style import is forbidden                                                                                                                                          @typescript-eslint/no-require-imports

&nbsp; 257:23   error  'require' is not defined                                                                                                                                                         no-undef

&nbsp; 258:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 258:30   error  Unsafe construction of a(n) `any` typed value                                                                                                                                    @typescript-eslint/no-unsafe-call

&nbsp; 259:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 259:22   error  Unsafe member access .titleEl on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 259:38   error  Use sentence case for UI text                                                                                                                                                    obsidianmd/ui/sentence-case

&nbsp; 262:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 262:24   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 262:41   error  Unsafe member access .contentEl on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 263:5    error  Avoid setting styles directly via `element.style.padding`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties       obsidianmd/no-static-styles-assignment

&nbsp; 263:16   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 264:5    error  Avoid setting styles directly via `element.style.lineHeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 264:16   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 267:11   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 267:19   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 267:32   error  Unsafe member access .split on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 270:6    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 270:12   error  Unsafe member access .forEach on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 275:7    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 275:18   error  Unsafe member access .createEl on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 281:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 281:18   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 281:29   error  Unsafe member access .createEl on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 282:7    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 282:10   error  Unsafe member access .setText on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 283:7    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties     obsidianmd/no-static-styles-assignment

&nbsp; 283:10   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 284:7    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 284:10   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 285:7    error  Avoid setting styles directly via `element.style.fontSize`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties      obsidianmd/no-static-styles-assignment

&nbsp; 285:10   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 286:7    error  Avoid setting styles directly via `element.style.fontWeight`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 286:10   error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 290:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 290:23   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 290:34   error  Unsafe member access .createEl on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 292:10   error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 293:10   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 298:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 305:9    error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 305:23   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 305:34   error  Unsafe member access .createEl on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 307:10   error  Avoid setting styles directly via `element.style.marginLeft`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties    obsidianmd/no-static-styles-assignment

&nbsp; 308:10   error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 313:9    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 322:13   error  Unsafe assignment of an `any` value                                                                                                                                              @typescript-eslint/no-unsafe-assignment

&nbsp; 322:17   error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 322:28   error  Unsafe member access .createEl on an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 323:7    error  Avoid setting styles directly via `element.style.marginBottom`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp; 323:9    error  Unsafe member access .style on an `any` value                                                                                                                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 325:26   error  Unsafe argument of type `any` assigned to a parameter of type `HTMLElement`                                                                                                      @typescript-eslint/no-unsafe-argument

&nbsp; 329:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                            @typescript-eslint/no-unsafe-call

&nbsp; 329:22   error  Unsafe member access .open on an `any` value                                                                                                                                     @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\TemplateStep.ts

&nbsp;   9:3    error  Do not write to DOM directly using innerHTML/outerHTML property                                                                                                               @microsoft/sdl/no-inner-html

&nbsp;  61:14   error  Use sentence case for UI text                                                                                                                                                 obsidianmd/ui/sentence-case

&nbsp;  71:5    error  Avoid setting styles directly via `element.style.marginTop`. Use CSS classes for better theming and maintainability. Use the `setCssProps` function to change CSS properties  obsidianmd/no-static-styles-assignment

&nbsp;  78:9    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp;  78:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp;  78:42   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp;  78:47   error  Unsafe member access .configManager on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  79:42   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  79:68   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  86:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp;  86:37   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp;  92:9    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp;  92:36   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp;  92:41   error  Unsafe member access .settings on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp;  95:9    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp;  95:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp;  95:42   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp;  95:47   error  Unsafe member access .configManager on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  96:42   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 102:9    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 102:26   error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 102:42   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp; 102:47   error  Unsafe member access .configManager on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 108:22   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 109:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 109:37   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 110:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 110:43   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 111:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 111:13   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 111:38   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 111:66   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 112:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 112:13   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 113:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 113:13   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 117:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 118:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 118:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 118:61   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 119:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 119:14   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 119:44   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 123:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 124:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 124:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 124:66   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 125:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 125:14   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 125:80   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 129:17   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 129:64   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 130:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 130:14   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 130:58   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 130:105  error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 137:22   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 138:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 138:13   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 139:17   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 140:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 140:29   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 140:64   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 141:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 141:33   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 141:72   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 142:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 142:30   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 142:66   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 143:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 144:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 145:25   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 147:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 148:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 149:25   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 151:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 152:18   error  Unsafe member access .commandPalette on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 153:25   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 157:23   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 158:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 158:14   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 159:18   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 160:24   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 166:22   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 167:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 167:13   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 168:17   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 169:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 170:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 171:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 173:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 174:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 175:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 177:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 178:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 179:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 181:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 182:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 183:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 185:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 186:18   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 187:25   error  Unsafe member access .homeOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 193:22   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 194:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 194:13   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 195:17   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 196:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 196:34   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 196:71   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 197:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 197:33   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 197:69   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 198:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 198:31   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 198:65   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 199:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 199:26   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 199:55   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 200:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 200:36   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 200:75   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 201:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 201:45   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 201:93   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 202:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 202:41   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 202:85   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 203:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 204:18   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 205:25   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 207:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 208:18   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 209:6    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 209:30   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 209:73   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 210:6    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 210:36   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 210:85   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 211:6    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 211:31   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 211:75   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 212:6    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 212:40   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 212:93   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 214:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 214:24   error  Unsafe member access .postOptions on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 219:22   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 220:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 220:13   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 221:17   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 222:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 222:36   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 222:74   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 223:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 223:36   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 223:74   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 224:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 224:27   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 224:56   error  Unsafe member access .navigation on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 230:22   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 231:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 231:13   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 231:45   error  Unsafe member access .tableOfContents on an `any` value                                                                                                                       @typescript-eslint/no-unsafe-member-access

&nbsp; 231:80   error  Unsafe member access .config on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 235:22   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 236:13   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 237:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 237:30   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 238:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 238:26   error  Unsafe member access .optionalContentTypes on an `any` value                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 243:22   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 244:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 244:13   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 245:17   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 246:5    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 246:45   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 246:88   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 249:4    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 249:13   error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 249:63   error  Unsafe member access .footer on an `any` value                                                                                                                                @typescript-eslint/no-unsafe-member-access

&nbsp; 249:106  error  Unsafe member access .features on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 256:9    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 256:25   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp; 256:30   error  Unsafe member access .loadSettings on an `any` value                                                                                                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 264:9    error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 264:39   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp; 264:44   error  Unsafe member access .settingsTab on an `any` value                                                                                                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 265:41   error  Unsafe member access .display on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 266:4    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 266:16   error  Unsafe member access .display on an `any` value                                                                                                                               @typescript-eslint/no-unsafe-member-access

&nbsp; 273:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 273:15   error  A `require()` style import is forbidden                                                                                                                                       @typescript-eslint/no-require-imports

&nbsp; 273:15   error  'require' is not defined                                                                                                                                                      no-undef

&nbsp; 274:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 274:17   error  A `require()` style import is forbidden                                                                                                                                       @typescript-eslint/no-require-imports

&nbsp; 274:17   error  'require' is not defined                                                                                                                                                      no-undef

&nbsp; 275:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 275:22   error  A `require()` style import is forbidden                                                                                                                                       @typescript-eslint/no-require-imports

&nbsp; 275:22   error  'require' is not defined                                                                                                                                                      no-undef

&nbsp; 278:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 278:49   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp; 278:54   error  Unsafe member access .basePath on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 278:93   error  Unexpected any. Specify a different type                                                                                                                                      @typescript-eslint/no-explicit-any

&nbsp; 278:98   error  Unsafe member access .path on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 279:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 279:72   error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 279:82   error  Unsafe member access .toString on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 280:10   error  Unsafe assignment of an `any` value                                                                                                                                           @typescript-eslint/no-unsafe-assignment

&nbsp; 280:23   error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 280:28   error  Unsafe member access .join on an `any` value                                                                                                                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 282:8    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 282:11   error  Unsafe member access .existsSync on an `any` value                                                                                                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 284:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 284:11   error  Unsafe member access .openPath on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access

&nbsp; 287:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 287:8    error  Unsafe member access .writeFileSync on an `any` value                                                                                                                         @typescript-eslint/no-unsafe-member-access

&nbsp; 288:5    error  Unsafe call of a(n) `any` typed value                                                                                                                                         @typescript-eslint/no-unsafe-call

&nbsp; 288:11   error  Unsafe member access .openPath on an `any` value                                                                                                                              @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\ThemeStep.ts

&nbsp; 12:3  error  Do not write to DOM directly using innerHTML/outerHTML property  @microsoft/sdl/no-inner-html



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\WelcomeStep.ts

&nbsp;  7:3   error  Do not write to DOM directly using innerHTML/outerHTML property  @microsoft/sdl/no-inner-html

&nbsp; 21:72  error  Unsafe member access .site on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 25:74  error  Unsafe member access .title on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 29:80  error  Unsafe member access .description on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 33:75  error  Unsafe member access .author on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 37:77  error  Unsafe member access .language on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 52:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 61:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 70:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 79:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment

&nbsp; 88:5   error  Unsafe assignment of an `any` value                              @typescript-eslint/no-unsafe-assignment



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\ui\\wizard\\WizardState.ts

&nbsp;   2:10   error  'AstroModularSettings' is defined but never used                     @typescript-eslint/no-unused-vars

&nbsp;  13:20   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  14:22   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  15:20   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  16:22   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  17:28   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  32:9    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  32:31   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp;  32:36   error  Unsafe member access .settings on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  36:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  36:31   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp;  37:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  37:28   error  Unsafe member access .currentTheme on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp;  38:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  38:33   error  Unsafe member access .contentOrganization on an `any` value          @typescript-eslint/no-unsafe-member-access

&nbsp;  39:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  39:31   error  Unsafe member access .siteInfo on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp;  40:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  40:33   error  Unsafe member access .navigation on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp;  41:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp;  43:44   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp; 116:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 118:19   error  Unsafe member access .features on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 121:11   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 121:53   error  Computed name \[settings.currentTemplate] resolves to an `any` value  @typescript-eslint/no-unsafe-member-access

&nbsp; 121:62   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 124:18   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 125:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 125:29   error  Unsafe member access .profilePicture on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 125:55   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 127:18   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 128:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 128:29   error  Unsafe member access .comments on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 128:49   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 131:5    error  Unsafe return of a value of type `any`                               @typescript-eslint/no-unsafe-return

&nbsp; 133:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 133:33   error  Unsafe member access .typography on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 136:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 136:24   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 137:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 137:22   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 138:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 138:20   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 139:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 139:21   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 140:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 140:20   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 141:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 141:26   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 142:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 142:22   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 145:12   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 145:39   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 146:12   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 146:40   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 152:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 152:36   error  Unsafe member access .provider on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 153:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 153:37   error  Unsafe member access .rawScript on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 154:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 154:32   error  Unsafe member access .repo on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 155:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 155:34   error  Unsafe member access .repoId on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 156:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 156:36   error  Unsafe member access .category on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 157:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 157:38   error  Unsafe member access .categoryId on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 158:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 158:35   error  Unsafe member access .mapping on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 159:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 159:34   error  Unsafe member access .strict on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 160:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 160:37   error  Unsafe member access .reactions on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 161:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 161:36   error  Unsafe member access .metadata on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 162:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 162:41   error  Unsafe member access .inputPosition on an `any` value                @typescript-eslint/no-unsafe-member-access

&nbsp; 163:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 163:33   error  Unsafe member access .theme on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 164:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 164:32   error  Unsafe member access .lang on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 165:8    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 165:35   error  Unsafe member access .loading on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 172:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 172:35   error  Unsafe member access .provider on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 173:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 173:36   error  Unsafe member access .rawScript on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 174:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 174:31   error  Unsafe member access .repo on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 175:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 175:33   error  Unsafe member access .repoId on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 176:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 176:35   error  Unsafe member access .category on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 177:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 177:37   error  Unsafe member access .categoryId on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 178:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 178:34   error  Unsafe member access .mapping on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 179:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 179:33   error  Unsafe member access .strict on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 180:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 180:36   error  Unsafe member access .reactions on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 181:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 181:35   error  Unsafe member access .metadata on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 182:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 182:40   error  Unsafe member access .inputPosition on an `any` value                @typescript-eslint/no-unsafe-member-access

&nbsp; 183:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 183:32   error  Unsafe member access .theme on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 184:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 184:31   error  Unsafe member access .lang on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 185:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 185:34   error  Unsafe member access .loading on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 191:33   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 197:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 197:33   error  Unsafe member access .deployment on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 198:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 198:33   error  Unsafe member access .runWizardOnStartup on an `any` value           @typescript-eslint/no-unsafe-member-access

&nbsp; 240:9    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 240:36   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp; 240:41   error  Unsafe member access .settings on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 243:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 243:42   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 244:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 244:39   error  Unsafe member access .currentTheme on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 245:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 245:44   error  Unsafe member access .contentOrganization on an `any` value          @typescript-eslint/no-unsafe-member-access

&nbsp; 246:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 246:42   error  Unsafe member access .siteInfo on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 247:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 247:44   error  Unsafe member access .navigation on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 248:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 248:44   error  Unsafe member access .typography on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 249:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 249:44   error  Unsafe member access .deployment on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 250:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 250:44   error  Unsafe member access .runWizardOnStartup on an `any` value           @typescript-eslint/no-unsafe-member-access

&nbsp; 253:42   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp; 277:9    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 277:51   error  Computed name \[settings.currentTemplate] resolves to an `any` value  @typescript-eslint/no-unsafe-member-access

&nbsp; 277:60   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 280:16   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 281:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 281:27   error  Unsafe member access .profilePicture on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 281:53   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 283:16   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 284:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 284:27   error  Unsafe member access .comments on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 284:47   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 287:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 292:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 292:23   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 293:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 293:21   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 294:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 294:19   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 295:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 295:20   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 296:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 296:19   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 297:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 297:25   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 298:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 298:21   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 301:11   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 301:38   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 302:11   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 302:39   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 308:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 308:35   error  Unsafe member access .provider on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 309:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 309:36   error  Unsafe member access .rawScript on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 310:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 310:31   error  Unsafe member access .repo on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 311:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 311:33   error  Unsafe member access .repoId on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 312:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 312:35   error  Unsafe member access .category on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 313:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 313:37   error  Unsafe member access .categoryId on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 314:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 314:34   error  Unsafe member access .mapping on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 315:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 315:33   error  Unsafe member access .strict on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 316:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 316:36   error  Unsafe member access .reactions on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 317:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 317:35   error  Unsafe member access .metadata on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 318:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 318:40   error  Unsafe member access .inputPosition on an `any` value                @typescript-eslint/no-unsafe-member-access

&nbsp; 319:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 319:32   error  Unsafe member access .theme on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 320:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 320:31   error  Unsafe member access .lang on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 321:7    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 321:34   error  Unsafe member access .loading on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 328:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 328:34   error  Unsafe member access .provider on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 329:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 329:35   error  Unsafe member access .rawScript on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 330:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 330:30   error  Unsafe member access .repo on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 331:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 331:32   error  Unsafe member access .repoId on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 332:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 332:34   error  Unsafe member access .category on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 333:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 333:36   error  Unsafe member access .categoryId on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 334:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 334:33   error  Unsafe member access .mapping on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 335:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 335:32   error  Unsafe member access .strict on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 336:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 336:35   error  Unsafe member access .reactions on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 337:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 337:34   error  Unsafe member access .metadata on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 338:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 338:39   error  Unsafe member access .inputPosition on an `any` value                @typescript-eslint/no-unsafe-member-access

&nbsp; 339:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 339:31   error  Unsafe member access .theme on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 340:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 340:30   error  Unsafe member access .lang on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 341:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 341:33   error  Unsafe member access .loading on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 347:31   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 356:9    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 356:36   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp; 356:41   error  Unsafe member access .settings on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 359:9    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 359:37   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 361:12   error  Unsafe member access .currentTemplate on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 362:12   error  Unsafe member access .currentTheme on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 363:12   error  Unsafe member access .contentOrganization on an `any` value          @typescript-eslint/no-unsafe-member-access

&nbsp; 364:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 364:12   error  Unsafe member access .siteInfo on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 365:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 365:12   error  Unsafe member access .navigation on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 366:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 366:12   error  Unsafe member access .features on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 367:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 367:12   error  Unsafe member access .typography on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 368:3    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 368:12   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 369:12   error  Unsafe member access .deployment on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 370:12   error  Unsafe member access .runWizardOnStartup on an `any` value           @typescript-eslint/no-unsafe-member-access

&nbsp; 376:17   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 377:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 377:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 377:74   error  Unsafe member access .graphView on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 381:17   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 382:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 382:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 382:79   error  Unsafe member access .linkedMentions on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 383:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 383:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 383:93   error  Unsafe member access .linkedMentionsCompact on an `any` value        @typescript-eslint/no-unsafe-member-access

&nbsp; 387:17   error  Unsafe member access .commandPalette on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 387:77   error  Unsafe member access .quickActions on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 388:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 388:14   error  Unsafe member access .commandPalette on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 389:18   error  Unsafe member access .commandPalette on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 390:37   error  Unsafe member access .quickActions on an `any` value                 @typescript-eslint/no-unsafe-member-access

&nbsp; 398:10   error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 398:27   error  Unsafe call of a(n) `any` typed value                                @typescript-eslint/no-unsafe-call

&nbsp; 398:43   error  Unexpected any. Specify a different type                             @typescript-eslint/no-explicit-any

&nbsp; 398:48   error  Unsafe member access .configManager on an `any` value                @typescript-eslint/no-unsafe-member-access

&nbsp; 399:41   error  Unsafe member access .config on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 401:24   error  Unsafe member access .config on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 402:6    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 402:15   error  Unsafe member access .tableOfContents on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 402:47   error  Unsafe member access .tableOfContents on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 402:82   error  Unsafe member access .config on an `any` value                       @typescript-eslint/no-unsafe-member-access

&nbsp; 408:16   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 409:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 409:13   error  Unsafe member access .features on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 409:48   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 413:16   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 414:4    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 414:13   error  Unsafe member access .features on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 414:42   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 417:18   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 418:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 418:406  error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 418:430  error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 419:25   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 420:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 420:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 420:51   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 423:5    error  Unsafe assignment of an `any` value                                  @typescript-eslint/no-unsafe-assignment

&nbsp; 423:14   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 423:54   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 425:28   error  Unsafe member access .postOptions on an `any` value                  @typescript-eslint/no-unsafe-member-access

&nbsp; 425:59   error  Unsafe member access .optionalFeatures on an `any` value             @typescript-eslint/no-unsafe-member-access

&nbsp; 430:12   error  Unsafe member access .optionalContentTypes on an `any` value         @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\ConfigManager.ts

&nbsp;   1:15  error  'Notice' is defined but never used        @typescript-eslint/no-unused-vars

&nbsp; 124:75  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\PluginManager.ts

&nbsp;   2:88  error  'ObsidianAppSettings' is defined but never used                         @typescript-eslint/no-unused-vars

&nbsp;  14:32  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  14:37  error  Unsafe member access .plugins on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp;  28:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  38:61  error  Unsafe argument of type `any` assigned to a parameter of type `Plugin`  @typescript-eslint/no-unsafe-argument

&nbsp;  47:66  error  Unsafe argument of type `any` assigned to a parameter of type `Plugin`  @typescript-eslint/no-unsafe-argument

&nbsp;  55:5   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  55:60  error  Unsafe argument of type `any` assigned to a parameter of type `Plugin`  @typescript-eslint/no-unsafe-argument

&nbsp;  67:41  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  67:46  error  Unsafe member access .plugins on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp;  73:32  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  73:37  error  Unsafe member access .plugins on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp;  87:42  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp;  87:47  error  Unsafe member access .config on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 133:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 133:38  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 133:43  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 141:37  error  Unsafe member access .contentTypes on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 146:12  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 146:26  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 146:41  error  Unsafe member access .contentTypes on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 146:64  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 147:7   error  Unsafe return of a value of type `any`                                  @typescript-eslint/no-unsafe-return

&nbsp; 147:16  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 147:26  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 147:29  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 152:23  error  Unsafe member access .enabled on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 153:24  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 166:24  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 166:62  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 167:25  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 176:24  error  Unsafe member access .pagesCreationMode on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 177:25  error  Unsafe member access .pagesCreationMode on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 186:38  error  Unsafe member access .customContentTypes on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 188:13  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 188:26  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 188:41  error  Unsafe member access .customContentTypes on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 188:70  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 189:8   error  Unsafe return of a value of type `any`                                  @typescript-eslint/no-unsafe-return

&nbsp; 189:17  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 189:27  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 189:30  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 191:36  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 192:23  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 226:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 226:38  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 226:43  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 232:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 232:40  error  Unsafe member access .frontmatter on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 248:59  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 270:4   error  'totalConfigurations' is assigned a value but never used                @typescript-eslint/no-unused-vars

&nbsp; 281:52  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 283:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 283:28  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 284:32  error  Unsafe member access .attachmentLocation on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 285:21  error  Unsafe member access .subfolderName on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 289:12  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 289:34  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 290:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 290:15  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 291:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 291:15  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 294:20  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 295:12  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 295:16  error  Unsafe member access .setting on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 299:49  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 299:54  error  Unsafe member access .config on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 304:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 304:30  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 304:35  error  Unsafe member access .saveConfig on an `any` value                      @typescript-eslint/no-unsafe-member-access

&nbsp; 313:57  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 315:33  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 315:38  error  Unsafe member access .plugins on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 316:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 323:29  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 328:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 328:47  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 329:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 329:34  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 332:37  error  Unsafe member access .contentTypes on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 336:46  error  Unsafe member access .contentTypes on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 338:13  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 338:26  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 338:39  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 338:53  error  Unsafe member access .toLowerCase on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 339:41  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

&nbsp; 340:8   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 340:20  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 347:5   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 347:20  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 350:5   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 350:20  error  Unsafe member access .pagesCreationMode on an `any` value               @typescript-eslint/no-unsafe-member-access

&nbsp; 353:38  error  Unsafe member access .customContentTypes on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 354:46  error  Unsafe member access .customContentTypes on an `any` value              @typescript-eslint/no-unsafe-member-access

&nbsp; 357:14  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 357:27  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 357:39  error  Unsafe member access .folder on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp; 357:53  error  Unsafe member access .toLowerCase on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 359:9   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 359:20  error  Unsafe member access .creationMode on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 367:4   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 367:19  error  Unsafe member access .indexFileName on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 367:44  error  Unsafe member access .indexFileName on an `any` value                   @typescript-eslint/no-unsafe-member-access

&nbsp; 370:35  error  Unsafe member access .saveSettings on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 371:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 371:31  error  Unsafe member access .saveSettings on an `any` value                    @typescript-eslint/no-unsafe-member-access

&nbsp; 379:57  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 381:33  error  Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any

&nbsp; 381:38  error  Unsafe member access .plugins on an `any` value                         @typescript-eslint/no-unsafe-member-access

&nbsp; 382:10  error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 384:51  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 387:29  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 388:6   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 388:26  error  Unsafe member access .settings on an `any` value                        @typescript-eslint/no-unsafe-member-access

&nbsp; 388:70  error  Unsafe member access .valueFormat on an `any` value                     @typescript-eslint/no-unsafe-member-access

&nbsp; 392:11  error  Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call

&nbsp; 392:31  error  Unsafe member access .saveSettings on an `any` value                    @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\ThemeColorExtractor.ts

&nbsp;   1:23  error  'SimpleThemeColors' is defined but never used                       @typescript-eslint/no-unused-vars

&nbsp;  30:9   error  'backgroundModifierBorder' is assigned a value but never used       @typescript-eslint/no-unused-vars

&nbsp; 413:27  error  `substr` is deprecated. A legacy feature for browser compatibility  @typescript-eslint/no-deprecated

&nbsp; 414:27  error  `substr` is deprecated. A legacy feature for browser compatibility  @typescript-eslint/no-deprecated

&nbsp; 415:27  error  `substr` is deprecated. A legacy feature for browser compatibility  @typescript-eslint/no-deprecated



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\config\\ConfigFileManager.ts

&nbsp;  21:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  21:15  error  A `require()` style import is forbidden                                                 @typescript-eslint/no-require-imports

&nbsp;  21:15  error  'require' is not defined                                                                no-undef

&nbsp;  22:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  22:17  error  A `require()` style import is forbidden                                                 @typescript-eslint/no-require-imports

&nbsp;  22:17  error  'require' is not defined                                                                no-undef

&nbsp;  30:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  30:23  error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  30:28  error  Unsafe member access .join on an `any` value                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  33:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  33:10  error  'parentDir' is assigned a value but never used                                          @typescript-eslint/no-unused-vars

&nbsp;  33:22  error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  33:27  error  Unsafe member access .dirname on an `any` value                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  35:8   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  35:11  error  Unsafe member access .existsSync on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  36:11  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  36:21  error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  36:24  error  Unsafe member access .readFileSync on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  37:11  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  37:19  error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  37:22  error  Unsafe member access .statSync on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  40:6   error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  41:6   error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  42:29  error  Unsafe argument of type `any` assigned to a parameter of type `string | number | Date`  @typescript-eslint/no-unsafe-argument

&nbsp;  42:35  error  Unsafe member access .mtime on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  49:6   error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  56:12  error  'error' is defined but never used                                                       @typescript-eslint/no-unused-vars

&nbsp;  83:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  83:15  error  A `require()` style import is forbidden                                                 @typescript-eslint/no-require-imports

&nbsp;  83:15  error  'require' is not defined                                                                no-undef

&nbsp;  84:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  84:17  error  A `require()` style import is forbidden                                                 @typescript-eslint/no-require-imports

&nbsp;  84:17  error  'require' is not defined                                                                no-undef

&nbsp;  92:10  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp;  92:23  error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  92:28  error  Unsafe member access .join on an `any` value                                            @typescript-eslint/no-unsafe-member-access

&nbsp;  94:4   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp;  94:7   error  Unsafe member access .writeFileSync on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp; 108:62  error  Avoid casting to 'TFile'. Use an 'instanceof TFile' check to safely narrow the type     obsidianmd/no-tfile-tfolder-cast

&nbsp; 117:51  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any

&nbsp; 126:17  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any

&nbsp; 129:10  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 132:11  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 137:11  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 142:11  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 147:11  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 152:11  error  Unsafe member access .siteInfo on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 157:11  error  Unsafe member access .faviconThemeAdaptive on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp; 162:11  error  Unsafe member access .defaultOgImageAlt on an `any` value                               @typescript-eslint/no-unsafe-member-access

&nbsp; 168:11  error  Unsafe member access .currentTheme on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 176:12  error  Unsafe member access .availableThemes on an `any` value                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 180:5   error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 180:12  error  Unsafe member access .availableThemes on an `any` value                                 @typescript-eslint/no-unsafe-member-access

&nbsp; 180:45  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any

&nbsp; 188:11  error  Unsafe member access .customThemes on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp; 192:10  error  Unsafe member access .typography on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 195:11  error  Unsafe member access .typography on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 200:11  error  Unsafe member access .typography on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 205:11  error  Unsafe member access .typography on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 210:11  error  Unsafe member access .typography on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 214:10  error  Unsafe member access .navigation on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 222:81  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any

&nbsp; 224:17  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any

&nbsp; 259:13  error  Unsafe member access \[fieldName] on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 265:12  error  Unsafe member access .children on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 279:9   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp; 279:14  error  Unsafe member access .children on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp; 296:14  error  Unsafe assignment of an `any` value                                                     @typescript-eslint/no-unsafe-assignment

&nbsp; 311:6   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp; 311:13  error  Unsafe member access .navigation on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 317:7   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp; 317:14  error  Unsafe member access .navigation on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 340:5   error  Unsafe call of a(n) `any` typed value                                                   @typescript-eslint/no-unsafe-call

&nbsp; 340:12  error  Unsafe member access .navigation on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp; 349:10  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 354:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 360:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 368:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 377:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 385:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 391:11  error  Unsafe member access .postOptions on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 397:10  error  Unsafe member access .optionalContentTypes on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp; 401:11  error  Unsafe member access .optionalContentTypes on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp; 406:11  error  Unsafe member access .optionalContentTypes on an `any` value                            @typescript-eslint/no-unsafe-member-access

&nbsp; 410:10  error  Unsafe member access .footer on an `any` value                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 414:11  error  Unsafe member access .footer on an `any` value                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 418:10  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 422:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 427:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 432:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 436:10  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 439:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 444:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 449:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 454:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 458:10  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 461:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 466:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 471:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 475:10  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 478:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 483:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 488:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 493:11  error  Unsafe member access .commandPalette on an `any` value                                  @typescript-eslint/no-unsafe-member-access

&nbsp; 499:11  error  Unsafe member access .site on an `any` value                                            @typescript-eslint/no-unsafe-member-access

&nbsp; 504:11  error  Unsafe member access .title on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp; 509:11  error  Unsafe member access .description on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 514:11  error  Unsafe member access .author on an `any` value                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 519:11  error  Unsafe member access .language on an `any` value                                        @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\config\\ConfigPresetModifier.ts

&nbsp;   14:52   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;   14:58   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;   16:63   error  Unsafe argument of type `any` assigned to a parameter of type `AstroModularSettings`  @typescript-eslint/no-unsafe-argument

&nbsp;   73:9    error  Unsafe assignment of an `any` value                                                   @typescript-eslint/no-unsafe-assignment

&nbsp;   80:10   error  'themeMatch' is assigned a value but never used                                       @typescript-eslint/no-unused-vars

&nbsp;  135:22   error  Unsafe member access .layout on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  138:76   error  Unsafe member access .layout on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  143:22   error  Unsafe member access .optionalContentTypes on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp;  144:23   error  Unsafe member access .optionalContentTypes on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp;  147:83   error  Unsafe member access .optionalContentTypes on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp;  150:23   error  Unsafe member access .optionalContentTypes on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp;  153:75   error  Unsafe member access .optionalContentTypes on an `any` value                          @typescript-eslint/no-unsafe-member-access

&nbsp;  159:22   error  Unsafe member access .featureButton on an `any` value                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  162:69   error  Unsafe member access .featureButton on an `any` value                                 @typescript-eslint/no-unsafe-member-access

&nbsp;  168:22   error  Unsafe member access .footer on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  170:23   error  Unsafe member access .footer on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  173:65   error  Unsafe member access .footer on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  177:23   error  Unsafe member access .footer on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  180:91   error  Unsafe member access .footer on an `any` value                                        @typescript-eslint/no-unsafe-member-access

&nbsp;  186:22   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  188:23   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  191:66   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  196:23   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  199:84   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  204:23   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  207:85   error  Unsafe member access .navigation on an `any` value                                    @typescript-eslint/no-unsafe-member-access

&nbsp;  213:22   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  215:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  218:74   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  223:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  226:77   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  231:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  234:83   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  239:22   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  242:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  245:79   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  248:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  251:79   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  254:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  257:85   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  260:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  263:77   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  270:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  273:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  276:97   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  279:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  282:82   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  285:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  288:84   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  295:23   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  298:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  301:91   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  304:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  307:98   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  310:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  313:96   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  316:24   error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  319:100  error  Unsafe member access .commandPalette on an `any` value                                @typescript-eslint/no-unsafe-member-access

&nbsp;  327:22   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  329:23   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  330:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  333:88   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  336:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  339:83   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  345:23   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  346:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  349:87   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  352:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  355:83   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  361:23   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  362:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  365:83   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  368:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  371:79   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  377:23   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  378:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  381:79   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  384:24   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  387:75   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  393:23   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  396:84   error  Unsafe member access .homeOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  402:22   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  404:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  407:83   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  420:24   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  423:69   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  429:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  430:24   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  433:90   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  436:24   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  439:104  error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  445:22   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  447:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  450:84   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  454:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  457:98   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  461:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  464:113  error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  468:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  471:87   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  475:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  478:106  error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  484:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  487:108  error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  490:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  493:99   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  496:23   error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  499:112  error  Unsafe member access .postOptions on an `any` value                                   @typescript-eslint/no-unsafe-member-access

&nbsp;  661:42   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;  662:44   error  Unsafe member access .title on an `any` value                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  663:13   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  664:31   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  666:13   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  666:30   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  669:15   error  Unsafe call of a(n) `any` typed value                                                 @typescript-eslint/no-unsafe-call

&nbsp;  669:15   error  Unsafe call of a(n) `any` typed value                                                 @typescript-eslint/no-unsafe-call

&nbsp;  669:20   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  669:41   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;  670:56   error  Unsafe member access .title on an `any` value                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  670:79   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  672:8    error  Unsafe member access .join on an `any` value                                          @typescript-eslint/no-unsafe-member-access

&nbsp;  760:6    error  Unsafe assignment of an `any` value                                                   @typescript-eslint/no-unsafe-assignment

&nbsp;  760:61   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;  851:11   error  'escapedContent' is assigned a value but never used                                   @typescript-eslint/no-unused-vars

&nbsp;  909:44   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;  910:46   error  Unsafe member access .title on an `any` value                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  911:15   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  912:33   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  914:15   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  914:32   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  917:17   error  Unsafe call of a(n) `any` typed value                                                 @typescript-eslint/no-unsafe-call

&nbsp;  917:17   error  Unsafe call of a(n) `any` typed value                                                 @typescript-eslint/no-unsafe-call

&nbsp;  917:22   error  Unsafe member access .children on an `any` value                                      @typescript-eslint/no-unsafe-member-access

&nbsp;  917:43   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp;  918:58   error  Unsafe member access .title on an `any` value                                         @typescript-eslint/no-unsafe-member-access

&nbsp;  918:81   error  Unsafe member access .url on an `any` value                                           @typescript-eslint/no-unsafe-member-access

&nbsp;  920:10   error  Unsafe member access .join on an `any` value                                          @typescript-eslint/no-unsafe-member-access

&nbsp; 1172:82   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp; 1172:87   error  Unsafe member access .wordCount on an `any` value                                     @typescript-eslint/no-unsafe-member-access

&nbsp; 1180:71   error  Unexpected any. Specify a different type                                              @typescript-eslint/no-explicit-any

&nbsp; 1180:76   error  Unsafe member access .tags on an `any` value                                          @typescript-eslint/no-unsafe-member-access



C:\\Users\\david\\Development\\obsidian-astro-modular-settings\\src\\utils\\config\\ConfigTemplateManager.ts

&nbsp; 31:75  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any



✖ 2808 problems (2808 errors, 0 warnings)

&nbsp; 265 errors and 0 warnings potentially fixable with the `--fix` option.

