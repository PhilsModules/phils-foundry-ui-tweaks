# Update Log

## v1.2.0 - Pure Drag-and-Drop Assignment & Resizable UI 🚀

- **Pure Drag-and-Drop Folder Assignment**: Removed cluttery dropdown menus on tab rows! Simply drag tabs directly between the main section and folder cards to assign or unassign them.
- **Vertical Window Resizing**: You can now resize the configuration window downwards and upwards to fit as many toolbar items on screen as you like. The list automatically expands to fill the window.
- **Bi-Directional Auto-Scrolling**: Dragging items near the top or bottom edge of the configuration window now automatically and smoothly scrolls the list in both directions.
- **Clean & Streamlined Interface**: Tab rows feature a sleek, uncluttered design matching the scene controls toolbar.
- **Interactive Empty Dropzones**: Empty folder cards display helpful drop hints so you can drag tabs into them effortlessly.

## v1.1.1 - Localization Fix & Interface Improvements 🐛

- **Complete Multi-Language Support**: Fixed hardcoded toolbar labels and tooltips so sub-tools buttons, headers, and action buttons now translate seamlessly when switching between English and German.
- **Interface Tooltip Improvements**: Added proper localized tooltips for reordering and tool customization controls throughout the configuration window.

## v1.1.0 - Icon Scaling & Folder Submenu Customization 🎨

- **Perfectly Scaled Folder Icons**: Custom folder icons (such as those from icon packs like Game-Icons) now fill the sidebar buttons perfectly without appearing too small.
- **Automatic Icon Color Adaptation**: Custom folder icons automatically adapt to assigned folder colors, hover effects, and active highlights.
- **Clear Section Separation**: An elegant section divider in the settings window clearly separates main toolbar buttons from items tucked away in folder submenus.
- **Custom Ordering Inside Each Folder**: Items inside folder submenus are organized into dedicated folder cards and can be ordered individually for each pop-out menu.
- **Real-Time Dynamic Placement**: Assigning a folder to an item dynamically moves it into the matching folder section in real-time.

## v1.0.3 - Folder Editing & Custom Color Customization 🎨

- **Folder Editing**: Easily edit existing sidebar folder names and icons at any time directly in the configuration window using the edit button.
- **Custom Folder Colors**: Folders can now be assigned custom colors or set to standard Foundry VTT styling.
- **Color Selector & Presets**: The folder configuration dialog features a color picker, hex code input, and 7 quick color presets (Gold, Red, Orange, Green, Teal, Blue, Purple).
- **Dynamic Visual Badges & Glows**: Active and custom-colored folder icons, borders, pop-out dropdown glows, and configuration window previews reflect selected custom colors instantly.
- **Auto-Resizing Dialog Window**: Fixed folder configuration dialog sizing so buttons are never cut off when color options expand, with smooth dynamic scrolling when needed.
- **Theme Alignment**: Window headers, borders, tabs, and buttons are visually aligned with Phil's module ecosystem.

## v1.0.2 - Bug Fixes & Stability Improvements 🐛

- **Macro Folder Clean Start**: Resolved an issue where creating the settings macro folder could trigger unnecessary database updates and console warnings upon GM login.
- **Scene Controls Stability**: Improved compatibility for toolbar control detection across Foundry v12–v14, ensuring sub-tools filter and reorder reliably on all Foundry builds.
- **Instant UI Refresh**: Ensured toolbar and sidebar layout changes take effect immediately on screen as soon as settings are saved.

## v1.0.1 - Bug Fixes & Player Permissions 🐛

- **Player Drag-and-Drop Permissions**: Fixed an issue where permission checks prevented non-GM players from dragging and dropping UI elements in the config window.
- **Drag Handles**: Added native drag handles to configuration rows so drag-and-drop works seamlessly for all users.
- **Sub-Tools Movement**: Fixed up and down movement buttons and drag-and-drop for controls containing sub-tools so they move cleanly alongside their parent category.
- **Settings Macro Access**: Updated settings macro permissions so non-GM players can open and execute the settings macro from the Macro Directory.
- **FilePicker Guard**: Added a permission check before opening the file picker when non-GM players create custom folder categories.

## v1.0.0 - Initial Release 🎉

- **Left Scene Controls Customization**: Reorder main scene control tools and sub-tools via drag & drop or move buttons. Hide unused main tools or individual sub-tools with a single eye-toggle.
- **Right Sidebar Tab Customization**: Reorder main sidebar tabs (Chat, Combat, Scenes, Actors, Items, Journal, etc.) and hide unused tabs seamlessly.
- **Right Sidebar Folders**: Create custom folder categories to organize right sidebar tabs into floating pop-out dropdown submenus.
- **Modern Dark UI**: Aesthetic theme matching Phil's module ecosystem with metallic gold accents, Signika typography, dark glassmorphism, and responsive micro-animations.
- **Automatic Settings Macro**: Automatically creates a dedicated Phils UI Tweaks folder in the Macro Directory with a Phils UI Tweaks Settings script macro featuring a custom icon for quick settings access.
- **Foundry v12–v14 Compatibility**: Built for modern Foundry v12–v14 architecture with smooth compatibility.
