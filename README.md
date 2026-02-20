# Minimal New Tab To-Do

A lightweight browser extension that replaces the default new tab page with a minimal task manager.

## Features

- New tab override UI with greeting, live clock, and date
- Add, toggle, edit (double-click), and delete tasks
- Overdue rollover: older incomplete tasks are surfaced at the top with a ⚠ Overdue tag
- Local persistence using extension storage (`qn_tasks`)
- Keyboard-first controls

## Project Structure

- `manifest.json` — Manifest V3 config and new tab override
- `newtab.html` — Extension page shell
- `style.css` — Dark glassmorphism styling and animations
- `js/storage.js` — Storage adapter
- `js/tasks.js` — Task CRUD + rollover logic
- `js/ui.js` — Rendering and inline edit
- `js/shortcuts.js` — Keyboard shortcuts
- `js/app.js` — App bootstrap and event wiring
- `icons/` — Extension icons (16, 48, 128)

## Run (Load Unpacked)

### Chrome / Edge

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder (`QuantumTask-Todo`) containing `manifest.json`.
5. Open a new tab.

### Firefox (Temporary Add-on)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json`.
4. Open a new tab.

## Usage

- Add task: type in the input and press `Enter`
- Toggle complete: click the circle or press `Space` on focused task
- Edit task: double-click task text
- Delete task: click `✕` or press `Delete` / `Backspace` on focused task
- Focus input: press `N`
- Cancel edit: press `Escape`

## Verify Overdue Rollover

1. Add a task.
2. Open extension storage for `qn_tasks` and set the task `dateKey` to yesterday (`YYYY-MM-DD`).
3. Reload the new tab page.
4. Confirm task appears in **Overdue** with ⚠ tag, and `dateKey` updates to today.

## Notes

- Chrome/Edge are the primary target.
- Firefox is best-effort for this MVP.
