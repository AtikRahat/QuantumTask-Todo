# QuantumTask-Todo Development Guidelines

## Project Overview

**QuantumTask-Todo** is a Manifest V3 browser extension (Chrome/Edge/Firefox) that provides a minimal, elegant task management system as a new tab replacement with one-time auto-open on browser startup.

### Tech Stack
- **Vanilla JavaScript** (ES6 modules) - No build step required
- **Custom CSS** with glassmorphism design system
- **Chrome Storage API** with localStorage fallback
- **HTML5 Drag-and-Drop API** for task reordering
- **Google Fonts:** Inter (UI), DM Sans (task text)

### Architecture

```
QuantumTask-Todo/
├── manifest.json           # MV3 configuration, permissions, background worker
├── newtab.html            # Main UI shell
├── style.css              # Complete styling (368 lines)
├── js/
│   ├── app.js             # Bootstrap & lifecycle management
│   ├── storage.js         # Persistence layer (chrome.storage.local + fallback)
│   ├── tasks.js           # Domain logic (CRUD, rollover, reordering)
│   ├── ui.js              # DOM rendering & drag-and-drop
│   ├── shortcuts.js       # Keyboard event handling
│   └── background.js      # Service worker (one-time auto-open)
├── icons/                 # Extension icons (16/48/128 PNG)
├── .github/
│   └── copilot-instructions.md
├── README.md
├── TESTING_GUIDE.md
├── UI_IMPROVEMENTS.md
└── implimantation.md
```

---

## GitHub Workflow & Procedures

### Version Control Strategy

#### Branching Model

- **`main`** - Stable production-ready code, always deployable
- **`feature/*`** - Feature development branches (e.g., `feature/glass-card-opacity`)
- **`fix/*`** - Bug fix branches (e.g., `fix/storage-sync-issue`)
- **`experiment/*`** - Experimental work that may not be merged

#### Creating a New Feature

```bash
# Always start from main
git checkout main
git pull origin main

# Create feature branch with descriptive name
git checkout -b feature/your-feature-name

# Make changes, commit frequently with clear messages
git add .
git commit -m "descriptive commit message"

# Push feature branch to GitHub
git push -u origin feature/your-feature-name
```

#### Before Merging: Tag Current Stable Version

```bash
# Tag the current stable version before major changes
git tag -a v1.x.x -m "Version 1.x.x - Feature description"
git push origin v1.x.x
```

This creates a rollback point if new features cause issues.

#### Testing Feature Branches

**Method 1: Side-by-Side Testing (Recommended)**
```bash
# Clone to separate directory
cd D:\Codes\project
git clone https://github.com/AtikRahat/QuantumTask-Todo.git QuantumTask-Test
cd QuantumTask-Test
git checkout feature/your-feature-name

# Load both as separate extensions in browser
# Compare features side-by-side
```

**Method 2: Branch Switching**
```bash
# Test feature
git checkout feature/your-feature-name
# Reload extension in chrome://extensions

# Revert to stable
git checkout main
# Reload extension
```

See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for detailed testing procedures.

#### Merging Feature to Main

```bash
# Switch to main and ensure it's up to date
git checkout main
git pull origin main

# Merge feature branch
git merge feature/your-feature-name

# Resolve any conflicts (see below)

# Push merged changes
git push origin main

# Tag new version
git tag -a v1.x.x -m "Version 1.x.x - Feature description"
git push origin v1.x.x
```

#### Resolving Merge Conflicts

When conflicts occur (usually in `style.css` or `newtab.html`):

1. **Identify conflicts:**
   ```bash
   git status  # Shows "Unmerged paths"
   git diff <filename>  # Shows conflict markers
   ```

2. **Resolve manually:**
   - Open conflicted files
   - Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
   - Choose the correct code or combine both changes
   - Remove conflict markers

3. **Mark as resolved:**
   ```bash
   git add <filename>
   git commit -m "Merge feature-name into main - resolve conflicts"
   git push
   ```

#### Cleaning Up After Merge

```bash
# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name
```

#### Emergency Rollback

```bash
# Rollback to specific version tag
git checkout v1.0.0

# Or create new branch from that point
git checkout -b rollback-stable v1.0.0

# Force revert main (use with caution!)
git checkout main
git reset --hard v1.0.0
git push -f origin main
```

### Commit Message Standards

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature (e.g., "feat: Add drag-and-drop task reordering")
- `fix:` - Bug fix (e.g., "fix: Resolve storage sync conflict")
- `style:` - UI/CSS changes (e.g., "style: Increase task font size")
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation updates
- `test:` - Testing improvements
- `chore:` - Maintenance tasks (e.g., "chore: Update .gitignore")

**Good commit messages:**
- ✅ "feat: Implement glass card opacity improvements (#1)"
- ✅ "fix: Resolve merge conflict in style.css"
- ✅ "style: Add DM Sans font for better task readability"
- ✅ "docs: Add testing guide for version control workflow"

**Bad commit messages:**
- ❌ "update"
- ❌ "fixed stuff"
- ❌ "changes"

### Pull Request Best Practices

When creating PRs (recommended for team collaboration):

1. **Create from Feature Branch:**
   - Push feature branch to GitHub
   - Use GitHub web UI to create PR from `feature/*` → `main`

2. **PR Title & Description:**
   - Clear, descriptive title
   - List changes made
   - Reference UI_IMPROVEMENTS.md items if applicable
   - Include before/after screenshots for UI changes

3. **Review Checklist:**
   - [ ] Extension loads without errors
   - [ ] All features work as expected
   - [ ] No console errors
   - [ ] Responsive design works (900px, 1280px breakpoints)
   - [ ] Keyboard shortcuts functional
   - [ ] Storage persistence verified

4. **Merge Strategy:**
   - Use "Squash and merge" for cleaner history (multiple commits → 1)
   - Use "Merge commit" to preserve full history
   - Delete branch after successful merge

---

## Code Quality Standards

### Clean Code Principles

When reviewing or writing code, follow Uncle Bob's Clean Code principles:

#### Meaningful Names
- Use descriptive and unambiguous names
- Avoid abbreviations unless widely understood (e.g., `btn`, `id` are OK)
- Use pronounceable names and consistent conventions

**Examples:**
- ✅ `makeTaskItem()`, `renderTasks()`, `getRolledOverTasks()`
- ❌ `mkItm()`, `rnd()`, `gROT()`

#### Small Functions
- Functions should do ONE thing
- Aim for <20 lines per function
- No side effects
- Single level of abstraction

**Example:**
```javascript
// ✅ Good: Single responsibility
function makeTaskItem(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.done ? " done" : ""}`;
  // ... create structure
  return item;
}

// ❌ Bad: Multiple responsibilities
function makeTaskItemAndRenderAndSave(task) {
  // creates item, renders to DOM, and saves to storage
}
```

#### Single Responsibility Principle
- Each module has one reason to change
- `storage.js` - persistence only
- `tasks.js` - domain logic only
- `ui.js` - DOM manipulation only
- `app.js` - coordination only

#### DRY (Don't Repeat Yourself)
- Extract common logic into reusable functions
- Use CSS custom properties for repeated values
- Leverage ES6 modules for shared code

#### Error Handling
- Use try-catch for async operations (storage)
- Provide fallbacks (localStorage when chrome.storage fails)
- Fail gracefully with user-friendly defaults

### Project-Specific Standards

#### CSS
- Use CSS custom properties (`:root` variables)
- Follow existing naming: `--color-*`, `--space-*`, `--radius-*`
- Maintain glassmorphism aesthetic
- Support `prefers-reduced-motion`
- Test at 900px, default, 1280px breakpoints

**Example:**
```css
/* ✅ Good: Uses variables, follows pattern */
.task-item {
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--color-card);
}

/* ❌ Bad: Hardcoded values */
.task-item {
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
}
```

#### JavaScript
- Use ES6+ features (arrow functions, destructuring, modules)
- Prefer `const` over `let`, avoid `var`
- Use async/await for promises
- Add JSDoc comments for complex functions

**Example:**
```javascript
// ✅ Good: Clear, modern syntax
export async function saveTasks(tasks) {
  const data = { tasks, lastSaved: Date.now() };
  await save(DEFAULT_KEY, data);
}

// ❌ Bad: Old syntax, unclear
function saveTasks(tasks) {
  var data = { tasks: tasks, lastSaved: Date.now() };
  save(DEFAULT_KEY, data, function() { /* ... */ });
}
```

#### HTML
- Semantic HTML5 elements
- Proper ARIA labels for accessibility
- `aria-live` for dynamic content
- Maintain existing structure patterns

### Accessibility Requirements

- Keyboard navigation must work for all features
- Focus indicators must be visible (`:focus-visible`)
- Screen reader friendly (`aria-label`, `aria-live`)
- Support `prefers-reduced-motion`
- Color contrast meets WCAG AA standards

### Testing Checklist

Before committing/merging, verify:

- [ ] **Extension loads** without errors in chrome://extensions
- [ ] **All shortcuts work:** N, Enter, Escape, Space, Delete
- [ ] **Drag-and-drop** functions correctly
- [ ] **Storage persists** across browser restarts
- [ ] **Overdue rollover** logic works (see README verification steps)
- [ ] **Responsive** at 900px and 1280px breakpoints
- [ ] **No console errors** in DevTools
- [ ] **Reduced motion** mode works (System Settings → Accessibility)

### Performance Guidelines

- Minimize DOM manipulations (batch updates)
- Use event delegation where possible
- Avoid synchronous localStorage in loops
- Lazy-load heavy features if added
- Keep bundle size minimal (no unnecessary dependencies)

### Documentation Requirements

When adding features, update:

1. **UI_IMPROVEMENTS.md** - Mark checkbox for implemented features
2. **README.md** - Add usage instructions if user-facing
3. **TESTING_GUIDE.md** - Add testing steps for new features
4. **This file** - Update architecture if structure changes

---

## Review Style

When reviewing code (or self-reviewing):

- Be constructive and specific
- Suggest improvements with examples
- Reference Clean Code principles
- Test thoroughly before approving
- Ask: "Is this the simplest solution?"

**Review Checklist:**
- [ ] Code follows project conventions
- [ ] Functions are small and focused
- [ ] No magic numbers or hardcoded strings
- [ ] Proper error handling
- [ ] Accessibility considered
- [ ] Performance impact minimal
- [ ] Documentation updated

---

## Quick Reference

### Common Tasks

**Add new UI feature:**
1. Create `feature/feature-name` branch
2. Update HTML/CSS/JS files
3. Test thoroughly (reload extension)
4. Update UI_IMPROVEMENTS.md
5. Commit with clear message
6. Push and merge via GitHub

**Fix a bug:**
1. Create `fix/bug-description` branch
2. Identify root cause
3. Fix with minimal changes
4. Add regression test verification
5. Commit as `fix: description`
6. Merge to main quickly

**Update documentation:**
1. Edit on main branch for minor updates
2. Use feature branch for major rewrites
3. Commit as `docs: description`

### File Modification Guidelines

| File | When to Edit | What to Watch |
|------|-------------|---------------|
| `manifest.json` | Permissions, icons, worker | Version number, browser compatibility |
| `newtab.html` | Structure changes | Keep semantic, accessibility |
| `style.css` | All styling | Merge conflicts common, use variables |
| `js/tasks.js` | Business logic | Don't mix with UI code |
| `js/ui.js` | DOM updates | Keep pure (no storage calls) |
| `js/storage.js` | Persistence | Handle both chrome.storage & localStorage |

---

## Resources

- [TESTING_GUIDE.md](../TESTING_GUIDE.md) - Version control & testing procedures
- [UI_IMPROVEMENTS.md](../UI_IMPROVEMENTS.md) - Feature roadmap with checkboxes
- [README.md](../README.md) - User documentation & setup
- [Chrome Extension MV3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Clean Code (Book)](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

**Remember:** This is a minimal, elegant extension. Every feature added should enhance usability without adding complexity. When in doubt, keep it simple.
