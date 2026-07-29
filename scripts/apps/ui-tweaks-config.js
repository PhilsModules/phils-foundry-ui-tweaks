import { ControlsManager } from "../controls-manager.js";
import { SidebarManager } from "../sidebar-manager.js";

/**
 * UITweaksConfig App (ApplicationV2 / FormApplication)
 * Configuration UI for customizing scene controls (left toolbar) and sidebar tabs (right toolbar).
 */
export class UITweaksConfig extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "phils-ui-tweaks-config",
            classes: ["phils-ui-tweaks-app"],
            title: "PHILS_UI_TWEAKS.Title",
            template: "modules/phils-foundry-ui-tweaks/templates/ui-tweaks-config.hbs",
            width: 620,
            height: "auto",
            tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "left-controls" }],
            resizable: true,
            dragDrop: [{ dragSelector: ".drag-handle", dropSelector: ".ui-tweaks-list" }]
        });
    }

    getData() {
        const controlsConfig = game.settings.get("phils-foundry-ui-tweaks", "controlsConfig") || { order: [], hidden: [], toolsHidden: {}, toolsOrder: {} };
        const sidebarConfig = game.settings.get("phils-foundry-ui-tweaks", "sidebarConfig") || { order: [], hidden: [], folders: [] };

        const controlsList = this._getSceneControlsList(controlsConfig);
        const sidebarList = this._getSidebarTabsList(sidebarConfig);
        const sidebarFolders = sidebarConfig.folders || [];

        return {
            controlsList,
            sidebarList,
            sidebarFolders
        };
    }

    /**
     * Resolves human readable tab title.
     */
    _resolveTabTitle(tabName, fallbackTitle) {
        if (!tabName) return fallbackTitle || "";
        if (tabName === "collapse") {
            return game.i18n.has("PHILS_UI_TWEAKS.CollapseSidebar") 
                ? game.i18n.localize("PHILS_UI_TWEAKS.CollapseSidebar") 
                : "Seitenleiste einklappen";
        }

        const key = `SIDEBAR.Tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
        if (game.i18n.has(key)) return game.i18n.localize(key);
        
        const altKey = `DOCUMENT.${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
        if (game.i18n.has(altKey)) return game.i18n.localize(altKey);

        if (fallbackTitle && fallbackTitle !== tabName) return fallbackTitle;
        return tabName.charAt(0).toUpperCase() + tabName.slice(1);
    }

    /**
     * Resolves tab icon (FontAwesome class, SVG HTML, or Image URL).
     */
    _getTabIcon(tabName, element) {
        if (element) {
            // Check for <img> tag first
            const imgEl = element.querySelector("img") || (element.tagName === "IMG" ? element : null);
            if (imgEl) {
                const src = imgEl.getAttribute("src") || imgEl.src;
                if (src && src.trim().length > 0) {
                    return { icon: src, isImgIcon: true, isSvg: false };
                }
            }

            // Check for <svg> tag
            const svgEl = element.querySelector("svg") || (element.tagName === "SVG" ? element : null);
            if (svgEl) {
                const svgHtml = svgEl.outerHTML;
                if (svgHtml && svgHtml.trim().length > 0) {
                    return { icon: svgHtml, isImgIcon: false, isSvg: true };
                }
            }

            // Check for FontAwesome elements
            const candidates = Array.from(element.querySelectorAll("i, span, fa-icon, [class*='fa-']"));
            if (element.classList && (element.tagName === "I" || element.tagName === "SPAN")) {
                candidates.unshift(element);
            }

            for (const cand of candidates) {
                let cls = "";
                if (typeof cand.className === "string") {
                    cls = cand.className;
                } else if (cand.getAttribute) {
                    cls = cand.getAttribute("class") || "";
                }
                
                const parts = cls.trim().split(/\s+/);
                const hasFaPrefix = parts.some(p => p === "fa" || p === "fas" || p === "far" || p === "fab" || p === "fa-solid" || p === "fa-regular" || p === "fa-duotone");
                const hasFaIcon = parts.some(p => p.startsWith("fa-") && p !== "fa-solid" && p !== "fa-regular" && p !== "fa-duotone" && p !== "fa-light" && p !== "fa-thin");

                if (hasFaIcon || (hasFaPrefix && parts.length > 1)) {
                    return { icon: cls.trim(), isImgIcon: false, isSvg: false };
                }
            }
        }

        const cleanName = (tabName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

        const iconMap = {
            collapse: "fa-solid fa-caret-right",
            chat: "fa-solid fa-comments",
            combat: "fa-solid fa-swords",
            scenes: "fa-solid fa-map",
            actors: "fa-solid fa-users",
            items: "fa-solid fa-boxes-stacked",
            journal: "fa-solid fa-book-open",
            tables: "fa-solid fa-table-list",
            cards: "fa-solid fa-cards",
            playlists: "fa-solid fa-music",
            compendium: "fa-solid fa-atlas",
            macros: "fa-solid fa-code",
            macro: "fa-solid fa-code",
            settings: "fa-solid fa-gear",
            placeables: "fa-solid fa-shapes",
            placeable: "fa-solid fa-shapes",
            fanexuslayermanager: "fa-solid fa-layer-group",
            layermanager: "fa-solid fa-layer-group",
            fanexus: "fa-solid fa-layer-group",
            dicesonice: "fa-solid fa-dice-d20",
            archivistchat: "fa-solid fa-box-archive",
            archivist: "fa-solid fa-box-archive"
        };

        let fallback = iconMap[cleanName];
        if (!fallback) {
            for (const [key, val] of Object.entries(iconMap)) {
                if (cleanName.includes(key) || key.includes(cleanName)) {
                    fallback = val;
                    break;
                }
            }
        }

        fallback = fallback || "fa-solid fa-icons";
        const isImg = typeof fallback === "string" && (fallback.includes("/") || fallback.includes("."));
        return { icon: fallback, isImgIcon: isImg, isSvg: false };
    }

    /**
     * Builds list of Scene Controls for Left Toolbar config tab.
     */
    _getSceneControlsList(config) {
        const controlsList = [];
        const hiddenSet = new Set(config.hidden || []);
        const order = config.order || [];
        const toolsHiddenMap = config.toolsHidden || {};
        const toolsOrderMap = config.toolsOrder || {};

        if (ui.controls?.controls) {
            const rawControls = Array.isArray(ui.controls.controls) 
                ? ui.controls.controls 
                : (ui.controls.controls instanceof Map || ui.controls.controls instanceof Set 
                    ? Array.from(ui.controls.controls.values()) 
                    : (typeof ui.controls.controls === "object" ? Object.values(ui.controls.controls) : []));

            rawControls.forEach(c => {
                if (!c.name) return;

                const rawTools = c.tools ? (Array.isArray(c.tools) ? c.tools : (c.tools instanceof Map || c.tools instanceof Set ? Array.from(c.tools.values()) : (typeof c.tools === "object" ? Object.values(c.tools) : []))) : [];
                const parentHiddenTools = new Set(toolsHiddenMap[c.name] || []);
                const parentOrderTools = toolsOrderMap[c.name] || [];

                const toolsList = rawTools.map((t, idx) => {
                    const toolOrderIdx = parentOrderTools.indexOf(t.name);
                    return {
                        name: t.name,
                        title: t.title ? game.i18n.localize(t.title) : t.name,
                        icon: t.icon || "fa-solid fa-circle",
                        hidden: parentHiddenTools.has(t.name),
                        order: toolOrderIdx !== -1 ? toolOrderIdx : idx
                    };
                }).sort((a, b) => a.order - b.order);

                controlsList.push({
                    name: c.name,
                    title: c.title ? game.i18n.localize(c.title) : c.name,
                    icon: c.icon || "fa-solid fa-circle",
                    hidden: hiddenSet.has(c.name),
                    hasTools: toolsList.length > 0,
                    tools: toolsList
                });
            });
        }

        return controlsList.map((item, idx) => {
            const currentOrder = order.indexOf(item.name);
            return {
                ...item,
                order: currentOrder !== -1 ? currentOrder : idx
            };
        }).sort((a, b) => a.order - b.order);
    }

    /**
     * Builds list of Right Sidebar tabs for Config dialog.
     */
    _getSidebarTabsList(config) {
        const tabsList = [];
        const hiddenSet = new Set(config.hidden || []);
        const order = config.order || [];
        const folders = config.folders || [];

        const sidebarTabsBar = document.getElementById("sidebar-tabs") || document.querySelector("#sidebar-tabs");
        const sidebarEl = sidebarTabsBar?.closest("#sidebar") || document.getElementById("sidebar") || document;
        const collapseDomEl = sidebarEl?.querySelector?.('[data-action="collapse"], .collapse');

        if (sidebarTabsBar) {
            const allTabNodes = Array.from(sidebarTabsBar.querySelectorAll("button, a, [data-tab], [data-action]"));
            
            allTabNodes.forEach(el => {
                if (el.classList.contains("ui-tweaks-folder-wrapper") || 
                    el.classList.contains("ui-tweaks-folder-btn") || 
                    el.closest(".ui-tweaks-folder-btn") ||
                    el.classList.contains("collapse") ||
                    el.dataset?.action === "collapse" ||
                    el.getAttribute("data-action") === "collapse") return;

                let name = el.dataset.tab || el.getAttribute("data-tab");
                if (!name && el.dataset.action && el.dataset.action !== "tab") {
                    name = el.dataset.action;
                }
                
                if (!name || name === "tab" || name === "collapse" || tabsList.some(t => t.name === name)) return;

                let rawTitle = el.getAttribute("aria-label") || el.dataset.tooltip || el.getAttribute("title") || el.innerText || name;
                let title = this._resolveTabTitle(name, rawTitle);
                let iconData = this._getTabIcon(name, el);

                tabsList.push({ 
                    name, 
                    title, 
                    icon: iconData.icon, 
                    isImgIcon: iconData.isImgIcon, 
                    isSvg: iconData.isSvg,
                    isFolder: false 
                });
            });
        }

        if (ui.sidebar?.tabs) {
            Object.keys(ui.sidebar.tabs).forEach(tabName => {
                if (tabName !== "collapse" && !tabsList.some(t => t.name === tabName)) {
                    const domEl = sidebarTabsBar?.querySelector(`[data-tab="${tabName}"], [data-action="${tabName}"]`);
                    const title = this._resolveTabTitle(tabName, tabName);
                    const iconData = this._getTabIcon(tabName, domEl);
                    tabsList.push({ 
                        name: tabName, 
                        title, 
                        icon: iconData.icon, 
                        isImgIcon: iconData.isImgIcon, 
                        isSvg: iconData.isSvg,
                        isFolder: false 
                    });
                }
            });
        }

        if (tabsList.length === 0) {
            const defaults = ["chat", "combat", "scenes", "actors", "items", "journal", "tables", "cards", "macros", "playlists", "compendium", "settings"];
            defaults.forEach(name => {
                const title = this._resolveTabTitle(name, "");
                const iconData = this._getTabIcon(name, null);
                tabsList.push({ 
                    name, 
                    title, 
                    icon: iconData.icon, 
                    isImgIcon: iconData.isImgIcon, 
                    isSvg: iconData.isSvg,
                    isFolder: false 
                });
            });
        }

        // Include Folder items into sidebarList so they can be reordered in the main list
        folders.forEach(folder => {
            if (folder.id && !tabsList.some(t => t.name === folder.id)) {
                const isImgIcon = folder.icon && (folder.icon.includes("/") || folder.icon.includes("."));
                tabsList.push({
                    name: folder.id,
                    title: `${game.i18n.localize("PHILS_UI_TWEAKS.Folder") || 'Ordner'}: ${folder.name}`,
                    icon: folder.icon || "fa-solid fa-folder",
                    isFolder: true,
                    isImgIcon: isImgIcon,
                    folderId: folder.id
                });
            }
        });

        return tabsList.map((item, idx) => {
            const currentOrder = order.indexOf(item.name);
            const parentFolder = folders.find(f => f.tabs && f.tabs.includes(item.name));

            return {
                ...item,
                folderId: item.isFolder ? item.folderId : (parentFolder ? parentFolder.id : ""),
                hidden: hiddenSet.has(item.name),
                order: currentOrder !== -1 ? currentOrder : idx
            };
        }).sort((a, b) => a.order - b.order);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Subtool accordion toggles
        html.find('[data-action="toggle-tools"]').on("click", (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const parentRow = btn.closest(".ui-tweaks-row");
            const parentName = parentRow.data("name");
            const subcontainer = html.find(`.ui-tweaks-subtools-container[data-parent-control="${parentName}"]`);

            subcontainer.toggleClass("collapsed");
            btn.toggleClass("expanded");
        });

        // Folder creation button
        html.find('[data-action="create-sidebar-folder"]').on("click", async (e) => {
            e.preventDefault();
            this._promptCreateFolder();
        });

        // Folder deletion buttons
        html.find('[data-action="delete-sidebar-folder"]').on("click", async (e) => {
            e.preventDefault();
            const folderId = $(e.currentTarget).data("folder-id");
            this._deleteSidebarFolder(folderId);
        });

        // Up / Down row buttons
        html.find(".btn-move").on("click", (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const action = btn.data("action");
            const row = btn.closest(".ui-tweaks-row");

            if (action === "move-up") {
                const prev = row.prev(".ui-tweaks-row");
                if (prev.length) row.insertBefore(prev);
            } else if (action === "move-down") {
                const next = row.next(".ui-tweaks-row");
                if (next.length) row.insertAfter(next);
            }
        });

        // Reset button
        html.find('[data-action="reset"]').on("click", async (e) => {
            e.preventDefault();
            if (confirm(game.i18n.localize("PHILS_UI_TWEAKS.ResetConfirm") || "Reset UI tweaks?")) {
                await game.settings.set("phils-foundry-ui-tweaks", "controlsConfig", { order: [], hidden: [], toolsHidden: {}, toolsOrder: {} });
                await game.settings.set("phils-foundry-ui-tweaks", "sidebarConfig", { order: [], hidden: [], folders: [] });
                if (ui.controls) {
                    ui.controls.render(true);
                }
                SidebarManager.applySidebarTweaks();
                this.render(true);
            }
        });

        this._activateDragAndDrop(html);
    }

    /**
     * Prompts GM to create a new folder category.
     */
    async _promptCreateFolder() {
        const dialogContent = `
            <form class="ui-tweaks-dialog-form" autocomplete="off">
                <div class="form-group">
                    <label><i class="fa-solid fa-folder-plus"></i> Ordner-Name:</label>
                    <input type="text" name="folderName" placeholder="z. B. Kampf & Charaktere" autofocus required>
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-icons"></i> Icon (FontAwesome oder Bild-Pfad):</label>
                    <div class="file-picker-container">
                        <input type="text" name="folderIcon" id="folderIconInput" value="fa-solid fa-folder">
                        <button type="button" class="btn-browse-filepicker" id="btnBrowseIcon" title="Datei / Symbol auswählen (FilePicker)">
                            <i class="fa-solid fa-folder-open"></i>
                        </button>
                    </div>
                </div>
            </form>
        `;

        const d = new Dialog({
            title: "Neuen Ordner erstellen",
            content: dialogContent,
            buttons: {
                create: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Erstellen",
                    callback: async (html) => {
                        const name = html.find('input[name="folderName"]').val().trim();
                        const icon = html.find('input[name="folderIcon"]').val().trim() || "fa-solid fa-folder";
                        if (!name) return;

                        const sidebarConfig = game.settings.get("phils-foundry-ui-tweaks", "sidebarConfig") || { order: [], hidden: [], folders: [] };
                        const folders = sidebarConfig.folders || [];
                        const newId = `folder_${Date.now()}`;

                        folders.push({ id: newId, name, icon, tabs: [] });
                        sidebarConfig.folders = folders;
                        
                        if (!sidebarConfig.order.includes(newId)) {
                            sidebarConfig.order.unshift(newId);
                        }

                        await game.settings.set("phils-foundry-ui-tweaks", "sidebarConfig", sidebarConfig);
                        SidebarManager.applySidebarTweaks();
                        this.render(true);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Abbrechen"
                }
            },
            default: "create"
        }, {
            id: "phils-ui-tweaks-folder-dialog",
            classes: ["phils-ui-tweaks-app", "ui-tweaks-dialog"],
            width: 440
        });

        d.render(true);

        setTimeout(() => {
            const html = d.element;
            html.find("#btnBrowseIcon").on("click", (e) => {
                e.preventDefault();
                const input = html.find('#folderIconInput');
                const currentVal = input.val();
                new FilePicker({
                    type: "image",
                    current: currentVal && (currentVal.includes("/") || currentVal.includes(".")) ? currentVal : "",
                    callback: (path) => {
                        input.val(path);
                    }
                }).render(true);
            });
        }, 100);
    }

    /**
     * Deletes a folder category.
     */
    async _deleteSidebarFolder(folderId) {
        if (!folderId) return;
        const sidebarConfig = game.settings.get("phils-foundry-ui-tweaks", "sidebarConfig") || { order: [], hidden: [], folders: [] };
        sidebarConfig.folders = (sidebarConfig.folders || []).filter(f => f.id !== folderId);
        sidebarConfig.order = (sidebarConfig.order || []).filter(o => o !== folderId);

        await game.settings.set("phils-foundry-ui-tweaks", "sidebarConfig", sidebarConfig);
        SidebarManager.applySidebarTweaks();
        this.render(true);
    }

    _activateDragAndDrop(html) {
        let draggedRow = null;

        html.find(".ui-tweaks-list").on("dragstart", ".ui-tweaks-row", (e) => {
            draggedRow = e.currentTarget;
            e.originalEvent.dataTransfer.effectAllowed = "move";
            $(draggedRow).addClass("dragging");
        });

        html.find(".ui-tweaks-list").on("dragover", ".ui-tweaks-row", (e) => {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = "move";
            const targetRow = e.currentTarget;

            if (targetRow && targetRow !== draggedRow && targetRow.parentElement === draggedRow.parentElement) {
                const rect = targetRow.getBoundingClientRect();
                const next = (e.originalEvent.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                if (next) {
                    $(targetRow).after(draggedRow);
                } else {
                    $(targetRow).before(draggedRow);
                }
            }
        });

        html.find(".ui-tweaks-list").on("dragend", ".ui-tweaks-row", (e) => {
            $(draggedRow).removeClass("dragging");
            draggedRow = null;
        });
    }

    async _updateObject(event, formData) {
        try {
            // 1. Process Left Controls Form Data
            const controlsOrder = [];
            const controlsHidden = [];
            const toolsHiddenMap = {};
            const toolsOrderMap = {};

            this.element.find("#left-controls-list .main-control[data-name]").each((idx, el) => {
                const name = $(el).data("name");
                const hidden = $(el).find(`input[name="controls_hidden_${name}"]`).is(":checked");

                if (name && !controlsOrder.includes(name)) {
                    controlsOrder.push(name);
                    if (hidden) controlsHidden.push(name);
                }

                const subtoolsRow = this.element.find(`.ui-tweaks-subtools-container[data-parent-control="${name}"]`);
                if (subtoolsRow.length) {
                    const subHidden = [];
                    const subOrder = [];

                    subtoolsRow.find(".sub-tool[data-tool-name]").each((subIdx, subEl) => {
                        const toolName = $(subEl).data("tool-name");
                        const isToolHidden = $(subEl).find(`input[name="tool_hidden_${name}_${toolName}"]`).is(":checked");

                        if (toolName && !subOrder.includes(toolName)) {
                            subOrder.push(toolName);
                            if (isToolHidden) subHidden.push(toolName);
                        }
                    });

                    toolsHiddenMap[name] = subHidden;
                    toolsOrderMap[name] = subOrder;
                }
            });

            await game.settings.set("phils-foundry-ui-tweaks", "controlsConfig", {
                order: controlsOrder,
                hidden: controlsHidden,
                toolsHidden: toolsHiddenMap,
                toolsOrder: toolsOrderMap
            });

            // 2. Process Right Sidebar Form Data & Folders
            const sidebarOrder = [];
            const sidebarHidden = [];
            const currentSidebarConfig = game.settings.get("phils-foundry-ui-tweaks", "sidebarConfig") || {};
            const updatedSidebarFolders = (currentSidebarConfig.folders || []).map(f => ({ ...f, tabs: [] }));

            this.element.find("#right-sidebar-list .ui-tweaks-row[data-name]").each((idx, el) => {
                const name = $(el).data("name");
                const hidden = $(el).find(`input[name="sidebar_hidden_${name}"]`).is(":checked");
                const targetFolderId = $(el).find(`select[name="sidebar_folder_${name}"]`).val();

                if (name && !sidebarOrder.includes(name)) {
                    sidebarOrder.push(name);
                    if (hidden) sidebarHidden.push(name);

                    if (targetFolderId && !$(el).hasClass("folder-row")) {
                        const targetFolder = updatedSidebarFolders.find(f => f.id === targetFolderId);
                        if (targetFolder) {
                            targetFolder.tabs.push(name);
                        }
                    }
                }
            });

            currentSidebarConfig.order = sidebarOrder;
            currentSidebarConfig.hidden = sidebarHidden;
            currentSidebarConfig.folders = updatedSidebarFolders;

            await game.settings.set("phils-foundry-ui-tweaks", "sidebarConfig", currentSidebarConfig);

            // Instantly apply changes to DOM
            ControlsManager.applyDOMTweaks();
            SidebarManager.applySidebarTweaks();
            if (ui.controls) {
                ui.controls.render(true);
            }

            ui.notifications.info(game.i18n.localize("PHILS_UI_TWEAKS.SavedNotice") || "UI Tweaks saved.");

        } catch (err) {
            console.error("Phils UI Tweaks | Error saving settings:", err);
            ui.notifications.error("Failed to save UI Tweaks settings.");
        }
    }
}
