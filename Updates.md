# Update Log

## v1.0.1 - Bug Fixes & Player Permissions 🐛

- **Player Reordering & Drag-and-Drop Permissions**: Fixed an issue where FormApplication permission checks blocked non-GM players from dragging and dropping UI elements in the config window.
- **HTML5 Drag Handles**: Added `draggable="true"` attributes to configuration row elements so native browser drag-and-drop works for all users.
- **Sub-Tools Movement**: Fixed up/down movement buttons (`↑` `↓`) and drag-and-drop for main controls containing sub-tool accordions so sub-tools move cleanly alongside their parent control.
- **Settings Macro Ownership**: Updated automatically created settings macro and folder permissions (`ownership: { default: 3 }`) so non-GM players can view and execute the settings macro from the Macro Directory.
- **FilePicker Guard**: Added permission check before opening FilePicker when non-GM players create custom folder categories.

## v1.0.0 - Initial Release 🎉

- **Left Scene Controls Customization**: Reorder main scene control tools and sub-tools via drag & drop or move buttons. Hide unused main tools or individual sub-tools with a single eye-toggle.
- **Right Sidebar Tab Customization**: Reorder main sidebar tabs (Chat, Combat, Scenes, Actors, Items, Journal, etc.) and hide unused tabs seamlessly.
- **Right Sidebar Folders**: Create custom folder categories to organize right sidebar tabs into floating pop-out dropdown submenus.
- **Modern Dark UI**: Aesthetic theme matching Phil's module ecosystem with metallic gold accents (`#c5a059`), Signika typography, dark glassmorphism, and responsive micro-animations.
- **Automatic Settings Macro**: Automatically creates a dedicated `"Phils UI Tweaks"` folder in the Macro Directory with a `"Phils UI Tweaks Settings"` script macro featuring a custom black & white icon for quick settings access.
- **Foundry v12–v14 Compatibility**: Built for modern ApplicationV2 FormApplication architecture with clean compatibility warning handling.
