/**
 * ControlsManager
 * Handles left toolbar (SceneControls) filtering, reordering, and sub-tool customization.
 */
export class ControlsManager {
    static init() {
        Hooks.on("getSceneControlButtons", (controls) => {
            this.processControls(controls);
        });

        Hooks.on("renderSceneControls", (app, html) => {
            this.applyDOMTweaks(html);
        });
    }

    /**
     * Reorders and filters the scene controls list provided by Foundry.
     * Supports both Array format (v12) and Object/Record format (v14 ApplicationV2).
     * @param {Array|Object} controls - The scene controls provided by Foundry.
     */
    static processControls(controls) {
        if (!controls) return;
        try {
            const config = game.settings.get("phils-foundry-ui-tweaks", "controlsConfig") || {};
            const hiddenControls = new Set(config.hidden || []);
            const hiddenTools = config.toolsHidden || {};
            const toolsOrder = config.toolsOrder || {};
            const order = config.order || [];

            const processToolsForControl = (ctrl, ctrlName) => {
                if (!ctrl?.tools) return;

                const hiddenSet = new Set(hiddenTools[ctrlName] || []);
                const tOrder = toolsOrder[ctrlName] || [];

                if (Array.isArray(ctrl.tools)) {
                    if (hiddenSet.size > 0) {
                        ctrl.tools = ctrl.tools.filter(t => !hiddenSet.has(t?.name || t?.id));
                    }
                    if (tOrder.length > 0) {
                        ctrl.tools.sort((a, b) => {
                            const nameA = a?.name || a?.id;
                            const nameB = b?.name || b?.id;
                            const idxA = tOrder.indexOf(nameA);
                            const idxB = tOrder.indexOf(nameB);
                            if (idxA === -1 && idxB === -1) return 0;
                            if (idxA === -1) return 1;
                            if (idxB === -1) return -1;
                            return idxA - idxB;
                        });
                    }
                } else if (typeof ctrl.tools === "object") {
                    for (const tKey of Object.keys(ctrl.tools)) {
                        const tObj = ctrl.tools[tKey];
                        const tName = tObj?.name || tObj?.id || tKey;
                        if (hiddenSet.has(tName)) {
                            delete ctrl.tools[tKey];
                        }
                    }
                    if (tOrder.length > 0) {
                        const tEntries = Object.entries(ctrl.tools);
                        tEntries.sort(([kA, tA], [kB, tB]) => {
                            const nameA = tA?.name || tA?.id || kA;
                            const nameB = tB?.name || tB?.id || kB;
                            const idxA = tOrder.indexOf(nameA);
                            const idxB = tOrder.indexOf(nameB);
                            if (idxA === -1 && idxB === -1) return 0;
                            if (idxA === -1) return 1;
                            if (idxB === -1) return -1;
                            return idxA - idxB;
                        });
                        for (const k of Object.keys(ctrl.tools)) delete ctrl.tools[k];
                        for (const [k, v] of tEntries) ctrl.tools[k] = v;
                    }
                }
            };

            if (Array.isArray(controls)) {
                // 1. Filter hidden controls & inner tools (Array)
                for (let i = controls.length - 1; i >= 0; i--) {
                    const ctrl = controls[i];
                    if (!ctrl) continue;
                    const ctrlName = ctrl.name || ctrl.id;
                    if (hiddenControls.has(ctrlName)) {
                        controls.splice(i, 1);
                        continue;
                    }

                    processToolsForControl(ctrl, ctrlName);
                }

                // 2. Reorder array
                if (Array.isArray(order) && order.length > 0) {
                    controls.sort((a, b) => {
                        const nameA = a?.name || a?.id;
                        const nameB = b?.name || b?.id;
                        const indexA = order.indexOf(nameA);
                        const indexB = order.indexOf(nameB);
                        if (indexA === -1 && indexB === -1) return 0;
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    });
                }
            } else if (typeof controls === "object") {
                // 1. Filter hidden controls & inner tools (Object / Record in v14)
                for (const key of Object.keys(controls)) {
                    const ctrl = controls[key];
                    const ctrlName = ctrl?.name || ctrl?.id || key;
                    if (hiddenControls.has(ctrlName)) {
                        delete controls[key];
                        continue;
                    }

                    processToolsForControl(ctrl, ctrlName);
                }

                // 2. Reorder Object keys
                if (Array.isArray(order) && order.length > 0) {
                    const entries = Object.entries(controls);
                    entries.sort(([keyA, ctrlA], [keyB, ctrlB]) => {
                        const nameA = ctrlA?.name || ctrlA?.id || keyA;
                        const nameB = ctrlB?.name || ctrlB?.id || keyB;
                        const indexA = order.indexOf(nameA);
                        const indexB = order.indexOf(nameB);
                        if (indexA === -1 && indexB === -1) return 0;
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    });

                    for (const key of Object.keys(controls)) {
                        delete controls[key];
                    }
                    for (const [key, value] of entries) {
                        controls[key] = value;
                    }
                }
            }
        } catch (err) {
            console.error("Phils UI Tweaks | Error processing scene controls:", err);
        }
    }

    /**
     * Applies DOM-level reordering and hiding to rendered scene controls element.
     */
    static applyDOMTweaks(html) {
        try {
            const config = game.settings.get("phils-foundry-ui-tweaks", "controlsConfig") || {};
            const hiddenControls = new Set(config.hidden || []);
            const hiddenTools = config.toolsHidden || {};
            const toolsOrder = config.toolsOrder || {};
            const order = config.order || [];

            const root = html instanceof HTMLElement ? html : (html?.[0] || document.querySelector("#controls, #scene-controls"));
            if (!root) return;

            const controlButtons = Array.from(root.querySelectorAll("[data-control]"));
            if (controlButtons.length === 0) return;

            // 1. Hide / Show Main Controls
            controlButtons.forEach(btn => {
                const name = btn.dataset.control || btn.getAttribute("data-control");
                if (hiddenControls.has(name)) {
                    btn.style.display = "none";
                    btn.classList.add("ui-tweaks-hidden");
                } else {
                    btn.style.display = "";
                    btn.classList.remove("ui-tweaks-hidden");
                }
            });

            // 2. Physical DOM Reordering for Main Controls
            if (Array.isArray(order) && order.length > 0) {
                const parent = controlButtons[0]?.parentElement;
                if (parent) {
                    const sorted = [...controlButtons].sort((a, b) => {
                        const nameA = a.dataset.control || a.getAttribute("data-control");
                        const nameB = b.dataset.control || b.getAttribute("data-control");
                        const idxA = order.indexOf(nameA);
                        const idxB = order.indexOf(nameB);
                        if (idxA === -1 && idxB === -1) return 0;
                        if (idxA === -1) return 1;
                        if (idxB === -1) return -1;
                        return idxA - idxB;
                    });
                    sorted.forEach(btn => parent.appendChild(btn));
                }
            }

            // 3. Hide / Show & Reorder Sub-tools in DOM
            const subToolButtons = Array.from(root.querySelectorAll("[data-tool]"));
            const activeCtrl = ui.controls?.control ? (ui.controls.control.name || ui.controls.control.id) : (ui.controls?.activeControl);

            if (subToolButtons.length > 0) {
                subToolButtons.forEach(btn => {
                    const toolName = btn.dataset.tool || btn.getAttribute("data-tool");
                    if (activeCtrl && hiddenTools[activeCtrl]?.includes(toolName)) {
                        btn.style.display = "none";
                        btn.classList.add("ui-tweaks-hidden");
                    } else {
                        btn.style.display = "";
                        btn.classList.remove("ui-tweaks-hidden");
                    }
                });

                const subParent = subToolButtons[0]?.parentElement;
                if (subParent && activeCtrl && toolsOrder[activeCtrl]) {
                    const tOrder = toolsOrder[activeCtrl];
                    const sortedSubTools = [...subToolButtons].sort((a, b) => {
                        const nameA = a.dataset.tool || a.getAttribute("data-tool");
                        const nameB = b.dataset.tool || b.getAttribute("data-tool");
                        const idxA = tOrder.indexOf(nameA);
                        const idxB = tOrder.indexOf(nameB);
                        if (idxA === -1 && idxB === -1) return 0;
                        if (idxA === -1) return 1;
                        if (idxB === -1) return -1;
                        return idxA - idxB;
                    });
                    sortedSubTools.forEach(btn => subParent.appendChild(btn));
                }
            }
        } catch (err) {
            console.error("Phils UI Tweaks | Error applying DOM tweaks to scene controls:", err);
        }
    }
}
