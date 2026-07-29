/**
 * SidebarManager
 * Handles right toolbar (Sidebar Tabs) filtering, reordering, and folder grouping.
 */
export class SidebarManager {
    static init() {
        Hooks.on("renderSidebar", (app, html) => {
            this.applySidebarTweaks();
        });

        // Global click listener to close open folder dropdowns when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".ui-tweaks-folder-wrapper")) {
                document.querySelectorAll(".ui-tweaks-folder-wrapper.open").forEach(w => w.classList.remove("open"));
            }
        });
    }

    /**
     * Helper to extract a tab identifier from a DOM element.
     */
    static getTabName(el) {
        if (!el || el.classList.contains("ui-tweaks-folder-btn") || el.classList.contains("collapse")) return null;
        const action = el.dataset?.action || el.getAttribute("data-action");
        if (action === "collapse") return null;

        return el.dataset?.tab || el.getAttribute("data-tab") || (action && action !== "tab" ? action : null);
    }

    /**
     * Applies reordering, visibility hiding, and folder submenus to sidebar tabs.
     */
    static applySidebarTweaks() {
        try {
            const sidebarTabsContainer = document.getElementById("sidebar-tabs") || document.querySelector("#sidebar-tabs");
            if (!sidebarTabsContainer) return;

            const config = game.settings.get("phils-foundry-ui-tweaks", "sidebarConfig") || { order: [], hidden: [], folders: [] };
            const hiddenTabs = new Set(config.hidden || []);
            const order = config.order || [];
            const folders = config.folders || [];

            // 1. Query ALL tab buttons inside #sidebar-tabs (root + folder dropdowns)
            const allNodes = Array.from(sidebarTabsContainer.querySelectorAll("button, a, [data-tab], [data-action]"));
            const tabElements = allNodes.filter(el => {
                const name = this.getTabName(el);
                return !!name && !el.closest(".ui-tweaks-folder-btn");
            });

            if (tabElements.length === 0) return;

            // 2. Hide / Show
            tabElements.forEach((tabEl) => {
                const tabName = this.getTabName(tabEl);
                if (!tabName) return;

                if (hiddenTabs.has(tabName)) {
                    tabEl.style.display = "none";
                    tabEl.classList.add("ui-tweaks-hidden");
                } else {
                    tabEl.style.display = "";
                    tabEl.classList.remove("ui-tweaks-hidden");
                }
            });

            // 3. Process Folders (Group assigned tabs into pop-out submenus)
            this.processSidebarFolders(sidebarTabsContainer, tabElements, folders);

            // Ensure collapse element is inside sidebarTabsContainer
            const sidebarEl = sidebarTabsContainer.closest("#sidebar") || document.getElementById("sidebar") || document;
            const collapseWrapper = Array.from(sidebarTabsContainer.children).find(child => 
                child.dataset?.action === "collapse" ||
                child.getAttribute("data-action") === "collapse" ||
                child.classList.contains("collapse") ||
                child.querySelector?.('[data-action="collapse"], .collapse')
            ) || sidebarEl.querySelector?.('[data-action="collapse"], .collapse');

            if (collapseWrapper && collapseWrapper.parentElement !== sidebarTabsContainer) {
                sidebarTabsContainer.appendChild(collapseWrapper);
            }

            // 4. Physical DOM Reordering for main-bar elements
            if (Array.isArray(order) && order.length > 0) {
                const sortedElements = Array.from(sidebarTabsContainer.children).sort((a, b) => {
                    let nameA = this.getTabName(a) || (a.id ? a.id.replace("ui-tweaks-folder-", "") : "");
                    let nameB = this.getTabName(b) || (b.id ? b.id.replace("ui-tweaks-folder-", "") : "");
                    
                    let idxA = order.indexOf(nameA);
                    let idxB = order.indexOf(nameB);

                    // Resolve folder position via its first child tab
                    if (idxA === -1 && a.classList.contains("ui-tweaks-folder-wrapper")) {
                        const folderId = a.id.replace("ui-tweaks-folder-", "");
                        const folderObj = folders.find(f => f.id === folderId);
                        if (folderObj && folderObj.tabs && folderObj.tabs.length > 0) {
                            const firstChildIdx = order.indexOf(folderObj.tabs[0]);
                            if (firstChildIdx !== -1) idxA = firstChildIdx;
                        }
                    }

                    if (idxB === -1 && b.classList.contains("ui-tweaks-folder-wrapper")) {
                        const folderId = b.id.replace("ui-tweaks-folder-", "");
                        const folderObj = folders.find(f => f.id === folderId);
                        if (folderObj && folderObj.tabs && folderObj.tabs.length > 0) {
                            const firstChildIdx = order.indexOf(folderObj.tabs[0]);
                            if (firstChildIdx !== -1) idxB = firstChildIdx;
                        }
                    }

                    if (idxA === -1 && idxB === -1) return 0;
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                });

                // Append sorted tab/folder/collapse elements to container
                sortedElements.forEach((el) => {
                    sidebarTabsContainer.appendChild(el);
                });
            }

        } catch (err) {
            console.error("Phils UI Tweaks | Error applying sidebar tweaks:", err);
        }
    }

    /**
     * Groups tabs into custom folder pop-out submenus in the sidebar.
     */
    static processSidebarFolders(container, tabElements, folders) {
        const assignedTabNames = new Set();
        (folders || []).forEach(f => {
            if (f.tabs) f.tabs.forEach(t => assignedTabNames.add(t));
        });

        // 1. Move any tab elements NOT assigned to a folder back to the root container
        tabElements.forEach(tabEl => {
            const tabName = this.getTabName(tabEl);
            if (!assignedTabNames.has(tabName) && tabEl.parentElement !== container) {
                container.appendChild(tabEl);
            }
        });

        // 2. Clean up removed folder wrappers
        const existingFolderIds = new Set((folders || []).map(f => `ui-tweaks-folder-${f.id}`));
        container.querySelectorAll(".ui-tweaks-folder-wrapper").forEach(el => {
            if (!existingFolderIds.has(el.id)) {
                const dropdown = el.querySelector(".ui-tweaks-folder-dropdown");
                if (dropdown) {
                    Array.from(dropdown.children).forEach(child => container.appendChild(child));
                }
                el.remove();
            }
        });

        if (!folders || folders.length === 0) return;

        // 3. Process each folder
        folders.forEach((folder) => {
            if (!folder.id || !folder.tabs || folder.tabs.length === 0) {
                const emptyWrapper = container.querySelector(`#ui-tweaks-folder-${folder.id}`);
                if (emptyWrapper) {
                    const dropdown = emptyWrapper.querySelector(".ui-tweaks-folder-dropdown");
                    if (dropdown) Array.from(dropdown.children).forEach(child => container.appendChild(child));
                    emptyWrapper.remove();
                }
                return;
            }

            let wrapper = container.querySelector(`#ui-tweaks-folder-${folder.id}`);
            if (!wrapper) {
                wrapper = document.createElement("div");
                wrapper.id = `ui-tweaks-folder-${folder.id}`;
                wrapper.className = "ui-tweaks-folder-wrapper";
                
                const isImg = folder.icon && (folder.icon.includes("/") || folder.icon.includes("."));
                const iconHtml = isImg 
                    ? `<img src="${folder.icon}" style="width: 18px; height: 18px; object-fit: contain; pointer-events: none;" />` 
                    : `<i class="${folder.icon || 'fa-solid fa-folder'}"></i>`;
                
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "item ui-control plain icon ui-tweaks-folder-btn";
                btn.title = folder.name || "Ordner";
                btn.innerHTML = iconHtml;

                const dropdown = document.createElement("div");
                dropdown.className = "ui-tweaks-folder-dropdown";

                let hoverTimer = null;

                wrapper.addEventListener("mouseenter", () => {
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                    wrapper.classList.add("hover-open");
                });

                wrapper.addEventListener("mouseleave", () => {
                    hoverTimer = setTimeout(() => {
                        wrapper.classList.remove("hover-open");
                    }, 250);
                });

                // Optional click on folder icon activates its first assigned tab
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const firstTab = dropdown.querySelector("button, a, [data-tab]");
                    if (firstTab) firstTab.click();
                });
                wrapper.appendChild(btn);
                wrapper.appendChild(dropdown);
                container.appendChild(wrapper);
            }

            const dropdown = wrapper.querySelector(".ui-tweaks-folder-dropdown");
            let hasActiveChild = false;

            folder.tabs.forEach((tabName) => {
                const tabEl = tabElements.find(el => this.getTabName(el) === tabName);
                if (tabEl) {
                    if (tabEl.classList.contains("active")) hasActiveChild = true;
                    dropdown.appendChild(tabEl);
                }
            });

            const folderBtn = wrapper.querySelector(".ui-tweaks-folder-btn");
            if (folderBtn) {
                if (hasActiveChild) folderBtn.classList.add("active", "highlight");
                else folderBtn.classList.remove("active", "highlight");
            }
        });
    }
}
