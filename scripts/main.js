import { ControlsManager } from "./controls-manager.js";
import { SidebarManager } from "./sidebar-manager.js";
import { UITweaksConfig } from "./apps/ui-tweaks-config.js";

const MODULE_ID = "phils-foundry-ui-tweaks";

Hooks.once("init", () => {
    console.log("Phils UI Tweaks | Initializing...");

    // Register Module Settings
    game.settings.registerMenu(MODULE_ID, "uiTweaksConfig", {
        name: "PHILS_UI_TWEAKS.OpenConfig",
        label: "PHILS_UI_TWEAKS.OpenConfig",
        hint: "PHILS_UI_TWEAKS.OpenConfigHint",
        icon: "fas fa-sliders",
        type: UITweaksConfig,
        restricted: false
    });

    game.settings.register(MODULE_ID, "controlsConfig", {
        name: "Controls Config",
        scope: "client",
        config: false,
        type: Object,
        default: { order: [], hidden: [], toolsHidden: {}, toolsOrder: {}, folders: [] }
    });

    game.settings.register(MODULE_ID, "sidebarConfig", {
        name: "Sidebar Config",
        scope: "client",
        config: false,
        type: Object,
        default: { order: [], hidden: [], folders: [] }
    });

    // Initialize Managers
    ControlsManager.init();
    SidebarManager.init();
});

Hooks.once("ready", async () => {
    console.log("Phils UI Tweaks | Ready.");

    // Expose Public API
    window.PhilsUITweaks = {
        openConfig: () => {
            new UITweaksConfig().render(true);
        }
    };

    SidebarManager.applySidebarTweaks();
    
    // Delayed pass to catch late-registering third party module tabs
    setTimeout(() => {
        SidebarManager.applySidebarTweaks();
    }, 500);

    // Auto-create Macro in Macro Directory Folder (GM only)
    await createSettingsMacro();
});

/**
 * Creates a Macro folder and Settings Macro in the Foundry Macro Directory.
 */
async function createSettingsMacro() {
    if (!game.user.isGM) return;

    try {
        const folderName = "Phils UI Tweaks";
        let folder = game.folders.find(f => f.name === folderName && f.type === "Macro");

        if (!folder) {
            folder = await Folder.create({
                name: folderName,
                type: "Macro",
                color: "#c5a059"
            });
        }

        const macroName = "Phils UI Tweaks Settings";
        let macro = game.macros.find(m => m.name === macroName);
        const iconPath = "modules/phils-foundry-ui-tweaks/assets/macro-icon.png";

        if (!macro) {
            await Macro.create({
                name: macroName,
                type: "script",
                img: iconPath,
                command: "PhilsUITweaks.openConfig();",
                folder: folder?.id || null
            });
            console.log("Phils UI Tweaks | Settings macro created in Macro Directory.");
        } else {
            const updates = {};
            if (folder && macro.folder?.id !== folder.id) updates.folder = folder.id;
            if (macro.img !== iconPath) updates.img = iconPath;
            if (Object.keys(updates).length > 0) await macro.update(updates);
        }
    } catch (err) {
        console.error("Phils UI Tweaks | Error creating settings macro:", err);
    }
}
