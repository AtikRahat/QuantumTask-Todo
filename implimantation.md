# Minimal New Tab To-Do — Implementation

## Goal

Build a minimal Manifest V3 browser extension that replaces the default new tab page with a clean to-do list, optimized for fast daily use with local persistence and keyboard-first actions.

## Scope

- MV3 extension with `chrome_url_overrides.newtab` pointing to `newtab.html`.
- Required files: `manifest.json`, `newtab.html`, `style.css`, `js/storage.js`, `js/tasks.js`, `js/ui.js`, `js/shortcuts.js`, `js/app.js`.
- Overdue rollover on load: incomplete tasks from earlier dates move to today and are marked Overdue.
- Keyboard shortcuts: `N`, `Enter`, `Escape`, `Delete/Backspace`, `Space`.
- Placeholder icons: 16, 48, 128 PNG.

## File Plan

- `manifest.json`: metadata, new tab override, storage permission, icons.
- `newtab.html`: header (greeting/clock/date), task input, list container.
- `style.css`: dark glassmorphism theme tokens, animations, responsive layout.
- `js/storage.js`: load/save adapter (`qn_tasks`) with storage fallback strategy.
- `js/tasks.js`: CRUD + rollover logic + persistence calls.
- `js/ui.js`: render Overdue + Today sections, inline edit, visual states.
- `js/shortcuts.js`: keyboard handling and focused-task actions.
- `js/app.js`: app bootstrap, listeners, module wiring.
- `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`.

## Implementation Steps

1. Scaffold folders/files and establish module imports from `newtab.html`.
2. Add `manifest.json` with MV3, `chrome_url_overrides`, icons, and permissions.
3. Build `newtab.html` shell and semantic containers for input/list sections.
4. Implement design system and animations in `style.css`.
5. Build persistence adapter in `js/storage.js`.
6. Implement task model and CRUD + rollover in `js/tasks.js`.
7. Implement rendering and inline edit flows in `js/ui.js`.
8. Implement keyboard shortcut behaviors in `js/shortcuts.js`.
9. Wire startup flow in `js/app.js` (load, rollover, render, events).
10. Add placeholder icons and run manual verification.

## Verification

1. Chrome/Edge: load unpacked extension and open a new tab to confirm override.
2. Add task via input + Enter; confirm it appears immediately.
3. Toggle completion; verify checked state and completion styling.
4. Double-click task text, edit inline, confirm on Enter, cancel on Escape.
5. Delete task using button and keyboard delete path.
6. Reopen new tab; verify data persistence.
7. Manually set a task `dateKey` to yesterday in storage; reload and verify Overdue placement + date normalization.
8. Optional Firefox: temporary add-on load and smoke-check new tab behavior.

## Notes

- Prioritize Chrome/Edge behavior for first pass.
- Keep Firefox support best-effort in MVP.
- Keep implementation minimal: no extra pages, frameworks, or non-requested features.
