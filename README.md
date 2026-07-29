<div align="center">

# Phil's UI Tweaks 🛠️

![Foundry v14 Compatible](https://img.shields.io/badge/Foundry-v14-brightgreen?style=flat-square) ![Foundry v12 Compatible](https://img.shields.io/badge/Foundry-v12-green?style=flat-square) ![License](https://img.shields.io/badge/License-GPLv3-blue?style=flat-square)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)](https://github.com/PhilsModules/phils-foundry-ui-tweaks/releases) [![Patreon](https://img.shields.io/badge/SUPPORT-Patreon-ff424d?style=flat-square&logo=patreon)](https://www.patreon.com/PhilsModules)

<br>

**Take full control of your Foundry VTT user interface — customize, reorder, hide, and group toolbar buttons into folders with a sleek Modern Dark UI.**
<br>

_Übernimm die volle Kontrolle über deine Foundry VTT Benutzeroberfläche — Anpassen, Umsortieren, Ausblenden und Ordner-Kategorien im Modern Dark UI Design._

<br>

<a href="#-english-instructions"><img src="https://img.shields.io/badge/%20-English_Instructions-black?style=for-the-badge&logo=united-kingdom&logoColor=white" alt="English Instructions"></a> <a href="#-deutsche-anleitung"><img src="https://img.shields.io/badge/%20-Deutsche_Anleitung-black?style=for-the-badge&logo=germany&logoColor=red" alt="Deutsche Anleitung"></a> <a href="Updates.md"><img src="https://img.shields.io/badge/%20-Update_Logs-black?style=for-the-badge&logo=clock&logoColor=white" alt="Updates"></a>

</div>

<br>

---

<br>

# <img src="https://flagcdn.com/48x36/gb.png" width="28" height="21" alt="EN"> English Instructions

**A complete UI customization system for Foundry VTT (v12 – v14).**

Designed to give every Game Master and Player complete freedom over their screen layout. Clean up cluttered toolbars, hide tools you never use, reorder buttons to your liking, and group sidebar tabs into sleek pop-out folder submenus.

---

## 🌟 Key Features

### 🛠️ Left Scene Controls Customization
- **Reorder Main Controls:** Drag & drop or use the arrow buttons to arrange tools (Token Controls, Drawing Tools, Walls, Lighting, Notes, etc.) in any order.
- **Sub-Tools Accordion:** Expand any main tool to customize its inner sub-tools (e.g. Select, Ruler, Circle, Rectangle under Drawing Tools).
- **Hide Unused Tools:** Hide entire main tool categories or individual sub-tools with a single eye-toggle.

### 📚 Right Sidebar Tab Customization
- **Reorder Sidebar Tabs:** Arrange tabs (Chat, Combat, Scenes, Actors, Items, Journal, Compendiums, Settings) to fit your personal workflow.
- **Hide Unused Tabs:** Hide any sidebar tabs you don't need on your screen.
- **Custom Folder Categories:** Create custom folders (e.g. "Combat & Characters") to group multiple sidebar tabs into a single button. Hovering or clicking the folder button reveals a smooth floating pop-out dropdown menu!

### 🎨 Modern Dark Glassmorphic Design
- Matches the elegant visual design system of Phil's module ecosystem.

### 👥 Per-User Customization
- Settings are saved per client (`scope: "client"`). Every player and Game Master can customize their own UI layout independently without affecting anyone else!

### ⚙️ Automatic Macro Creation
- Automatically creates a dedicated **"Phils UI Tweaks"** folder in your Macro Directory with a **"Phils UI Tweaks Settings"** script macro (complete with a custom black & white icon) for instant 1-click access to settings.

---

## 📦 Super Easy Installation (Step-by-Step)

Follow these simple steps to install the module in your Foundry VTT setup:

1. **Open Foundry VTT** and go to the main setup screen.
2. Click on the **Add-on Modules** tab at the top.
3. Click the **Install Module** button at the bottom left.
4. In the window that opens, scroll down to the bottom field named **Manifest URL**.
5. Copy and paste the following URL into the Manifest URL field:
    ```text
    https://github.com/PhilsModules/phils-foundry-ui-tweaks/releases/latest/download/module.json
    ```
6. Click **Install**.
7. Launch your world, go to **Game Settings** -> **Manage Modules**, and enable **Phils UI Tweaks**!

---

## 🚀 How to Use (Beginner's Guide)

### 1. Opening the Configuration Window
- **Option A (Settings):** Go to the right sidebar -> **Game Settings** tab -> **Configure Settings** -> **Module Settings** -> Click **Phils UI Tweaks**.
- **Option B (Macro):** Open your **Macro Directory** (or Macro Bar), open the **Phils UI Tweaks** folder, and click **Phils UI Tweaks Settings**.

### 2. Customizing Left Scene Controls
1. Open the **Left Controls (Scene Controls)** tab.
2. **Reorder:** Click and drag the grip icon `⋮⋮` or click the `↑` `↓` arrow buttons to move tools up or down.
3. **Hide/Show:** Click the eye icon `👁` next to any tool to hide or show it on your screen.
4. **Customize Sub-tools:** Click the **Tools** button on any category to expand its inner sub-tools, where you can reorder or hide individual sub-tools.

### 3. Customizing Right Sidebar & Creating Folders
1. Open the **Right Sidebar (Sidebar Tabs)** tab.
2. **Create a Folder:** Click the golden **`+ Create Folder Category`** button at the top, type a name (e.g. "Combat & Actors"), and click **Create**.
3. **Assign Tabs to Folders:** On any tab row (e.g. *Actors* or *Encounter Tracker*), select your new folder from the dropdown menu.
4. **Reorder Folders & Tabs:** Drag or use `↑` `↓` arrows to position folders and remaining tabs anywhere in the list.
5. **Save Changes:** Click the golden **Save Settings** button at the bottom!

---

## 🎮 Macro API Support

You can open the settings window using the following script command in any Foundry macro:

```javascript
PhilsUITweaks.openConfig();
```

<br>

---

<br>

# <img src="https://flagcdn.com/48x36/de.png" width="28" height="21" alt="DE"> Deutsche Anleitung

**Ein vollständiges System zur Anpassung der Benutzeroberfläche für Foundry VTT (v12 – v14).**

Entwickelt, um jedem Spielleiter und Spieler die maximale Kontrolle über sein Bildschirm-Layout zu geben. Räume überfüllte Werkzeugleisten auf, blende ungenutzte Buttons aus, sortiere Elemente nach deinen Wünschen und fasst Seitenleisten-Tabs in schicken Ausklapp-Ordnern zusammen.

---

## 🌟 Hauptfunktionen

### 🛠️ Anpassen der linken Szene-Steuerung
- **Hauptwerkzeuge umsortieren:** Ziehe Werkzeuge (Token-Steuerung, Zeichnungen, Wände, Beleuchtung, Notizen etc.) per Drag & Drop oder nutze die Pfeil-Buttons `↑` `↓`, um die Reihenfolge beliebig anzupassen.
- **Unterwerkzeuge-Akkordeon:** Klappe jedes Hauptwerkzeug auf, um dessen Unterwerkzeuge (z. B. Auswählen, Lineal, Kreis, Rechteck bei den Zeichenwerkzeugen) individuell anzupassen.
- **Ungenutzte Werkzeuge ausblenden:** Blende ganze Kategorien oder einzelne Unterwerkzeuge mit einem Klick auf das Auge-Symbol aus.

### 📚 Anpassen der rechten Seitenleiste (Sidebar)
- **Reiter umsortieren:** Ordne deine Seitenleisten-Tabs (Chat, Begegnungen, Szenen, Akteure, Gegenstände, Journal, Kompendien, Einstellungen) nach deinen eigenen Vorlieben an.
- **Ungenutzte Reiter ausblenden:** Blende Tabs aus, die du im Spiel nicht benötigst.
- **Eigene Ordner-Kategorien:** Erstelle eigene Ordner (z. B. "Kampf & Charaktere"), um mehrere Seitenleisten-Tabs in einem einzigen Icon zusammenzufassen. Ein Klick oder Hovern auf den Ordner öffnet ein elegantes Ausklapp-Untermenü!

### 🎨 Modern Dark Glassmorphic Design
- Fügt sich nahtlos in das Design-System von Phils Modulen ein.

### 👥 Nutzer-bezogene Einstellungen
- Jede Einstellung wird pro Client gespeichert (`scope: "client"`). Jeder Spieler und der Spielleiter können ihre eigene Oberfläche individuell anpassen, ohne die Ansicht anderer zu verändern!

### ⚙️ Automatisches Einstellungen-Makro
- Erstellt beim Spielstart automatisch einen Ordner **"Phils UI Tweaks"** im Makro-Verzeichnis mit dem Skript-Makro **"Phils UI Tweaks Settings"** (inklusive eigenem Schwarz-Weiß-Icon) für den Schnellzugriff auf die Einstellungen.

---

## 📦 Kinderleichte Installation (Schritt für Schritt)

Folge dieser einfachen Anleitung, um das Modul in deiner Foundry VTT Installation zu installieren:

1. **Öffne Foundry VTT** auf dem Hauptbildschirm (Setup).
2. Klicke oben auf den Reiter **Add-on Modules** (Zusatzmodule).
3. Klicke unten links auf den Button **Install Module** (Modul installieren).
4. Scroll in dem sich öffnenden Fenster ganz nach unten zum Feld **Manifest URL**.
5. Kopiere die folgende Adresse und füge sie in das Feld ein:
    ```text
    https://github.com/PhilsModules/phils-foundry-ui-tweaks/releases/latest/download/module.json
    ```
6. Klicke auf **Install** (Installieren).
7. Starte deine Welt, gehe zu **Spieleinstellungen** -> **Module verwalten** und aktiviere **Phils UI Tweaks**!

---

## 🚀 Erste Schritte (Anleitung für Einsteiger)

### 1. Das Konfigurationsfenster öffnen
- **Möglichkeit A (Einstellungen):** Rechte Seitenleiste -> Reiter **Spieleinstellungen** -> **Einstellungen anpassen** -> **Modul-Einstellungen** -> Klicke auf **Phils UI Tweaks**.
- **Möglichkeit B (Makro):** Öffne dein **Makro-Verzeichnis** (oder die Makroleiste), öffne den Ordner **Phils UI Tweaks** und klicke auf **Phils UI Tweaks Settings**.

### 2. Linke Leiste (Szene-Steuerung) anpassen
1. Wähle den Reiter **Linke Leiste (Szene-Steuerung)**.
2. **Umsortieren:** Halte das Griff-Symbol `⋮⋮` gedrückt und ziehe das Werkzeug nach oben/unten oder nutze die Pfeile `↑` `↓`.
3. **Ausblenden:** Klicke auf das Auge-Symbol `👁` neben einem Werkzeug, um es auf dem Bildschirm aus- oder einzublenden.
4. **Unterwerkzeuge:** Klicke auf den Button **Werkzeuge** bei einer Kategorie, um deren Unterwerkzeuge aufzuklappen und einzeln anzupassen.

### 3. Rechte Leiste anpassen & Ordner erstellen
1. Wähle den Reiter **Rechte Leiste (Sidebar-Tabs)**.
2. **Ordner erstellen:** Klicke oben auf den goldenen Button **`+ Neue Ordner-Kategorie erstellen`**, gib einen Namen ein (z. B. "Kampf & Charaktere") und klicke auf **Erstellen**.
3. **Tabs zuweisen:** Wähle bei einem Tab (z. B. *Akteure* oder *Begegnungs-Tracker*) im Dropdown-Menü deinen neuen Ordner aus.
4. **Ordner & Tabs ordnen:** Ziehe Ordner und verbleibende Tabs mit den Pfeilen `↑` `↓` an die gewünschte Stelle in der Liste.
5. **Speichern:** Klicke unten auf den goldenen Button **Einstellungen speichern**!

---

## 🎮 Makro-Unterstützung

Du kannst das Einstellungsfenster auch über folgenden Befehl in einem eigenen Makro öffnen:

```javascript
PhilsUITweaks.openConfig();
```

<br>

---

<br>

## 📜 License

This module uses a dual license structure.

- **Code:** GNU GPLv3
- **Assets:** CC BY-NC-ND 4.0

See `LICENSE` file for details.

<br>

<div align="center">
    <h2>❤️ Support the Development</h2>
    <p>If you enjoy this module and want to support open source development for Foundry VTT check out my Patreon.</p>
    <p>Gefällt dir das Modul? Unterstütze die Weiterentwicklung auf Patreon.</p>
    <a href="https://www.patreon.com/PhilsModules">
        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="200" />
    </a>
    <br><br>
    <p><i>Made with ❤️ for the Foundry VTT Community</i></p>
</div>
