# Testing Guide - QuantumTask-Todo

## Version Control Setup

### Current Versions
- **v1.0.0** (Stable) - Main branch with drag-and-drop functionality
- **feature/glass-card-opacity** - Experimental branch with improved glass card opacity

## How to Test New Features

### Method 1: Load from Different Folder (Recommended for Side-by-Side Testing)

This method allows you to test both versions simultaneously.

1. **Create a test folder:**
   ```powershell
   # In your project directory
   cd D:\Codes\project
   git clone https://github.com/AtikRahat/QuantumTask-Todo.git QuantumTask-Test
   cd QuantumTask-Test
   git checkout feature/glass-card-opacity
   ```

2. **Load both versions in browser:**
   - Load stable version from: `D:\Codes\project\QuantumTask-Todo`
   - Load test version from: `D:\Codes\project\QuantumTask-Test`
   - Both will appear as separate extensions with their own data

3. **Compare:**
   - Open each as New Tab to see the visual differences
   - Create test tasks in both to compare readability

### Method 2: Switch Branches (Faster, Single Extension)

This method replaces the current extension with the new version.

1. **Test the new feature:**
   ```powershell
   # Switch to feature branch
   git checkout feature/glass-card-opacity
   ```

2. **Reload extension in browser:**
   - Go to `chrome://extensions` (or `edge://extensions`)
   - Click the **Reload** button under QuantumTask-Todo
   - Open a new tab to see changes

3. **If you like it - Merge to main:**
   ```powershell
   # Switch back to main
   git checkout main
   
   # Merge the feature
   git merge feature/glass-card-opacity
   
   # Push to GitHub
   git push
   
   # Tag the new version
   git tag -a v1.1.0 -m "Version 1.1.0 - Improved glass card opacity"
   git push origin v1.1.0
   ```

4. **If you don't like it - Revert to stable:**
   ```powershell
   # Switch back to main branch
   git checkout main
   
   # Reload extension in browser
   ```

### Method 3: Quick Test Without Git Commands

1. **Backup current CSS:**
   - Copy [style.css](style.css) to `style.css.backup`

2. **Test changes:**
   - Edit [style.css](style.css) directly
   - Reload extension in browser
   - Compare with backup

3. **Revert if needed:**
   - Restore from `style.css.backup`
   - Reload extension

## What Changed in feature/glass-card-opacity

### Visual Improvements:
- **Card opacity:** 8% → 15% (more visible against gradient)
- **Hover opacity:** 12% → 18% (better hover feedback)
- **Blur effect:** 14px → 20px (softer, more polished glass effect)

### Files Modified:
- [style.css](style.css) - Lines 11-13, 47-48

## Rolling Back to Specific Versions

### Revert to v1.0.0 (Stable):
```powershell
git checkout v1.0.0
# Or
git checkout main  # If v1.0.0 is still the latest on main
```

### Revert to Any Previous Commit:
```powershell
# View commit history
git log --oneline

# Checkout specific commit
git checkout <commit-hash>

# Create a new branch from that point (optional)
git checkout -b revert-to-working-version
```

## GitHub Workflow for Future Features

### Creating Feature Branches:
```powershell
# Always start from main
git checkout main
git pull

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit
git add .
git commit -m "Implement feature description"

# Push to GitHub
git push -u origin feature/your-feature-name
```

### Merging Approved Features:
```powershell
git checkout main
git merge feature/your-feature-name
git push

# Tag new version
git tag -a v1.x.x -m "Version description"
git push origin v1.x.x
```

### Deleting Merged Branches:
```powershell
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

## Emergency Rollback

If something breaks badly:

```powershell
# Hard reset to last stable version
git checkout main
git reset --hard v1.0.0

# Force push (use with caution!)
git push -f origin main
```

## Current Branch Status

Check which branch you're on:
```powershell
git branch  # Shows all branches, * marks current
git status  # Shows current branch and changes
```

Switch branches:
```powershell
git checkout main                        # Stable version
git checkout feature/glass-card-opacity  # Test version
```

## Tips

- **Always reload the extension** after switching branches
- **Clear browser cache** if changes don't appear (Ctrl+Shift+Delete)
- **Keep v1.0.0 tagged** as your safe fallback point
- **Test with real tasks** to see actual UI improvements
- **Use Pull Requests** on GitHub for code review before merging
