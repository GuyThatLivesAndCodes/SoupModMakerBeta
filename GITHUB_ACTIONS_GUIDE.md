# GitHub Actions Quick Reference

This guide shows you how to use GitHub Actions to automatically build SoupModMaker executables.

## 🎯 What You Get

GitHub Actions will automatically create:
- **Windows**: `.exe` installer and portable executable
- **macOS**: `.dmg` installer for both Intel and Apple Silicon
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

**No need to install development tools!** Everything builds in the cloud.

## 🚀 Three Ways to Build

### 1️⃣ Automatic Build on Release (Recommended)

**Creates official releases with executables**

```bash
# Step 1: Update version in package.json
# Edit: package.json, electron-app/package.json, core/package.json
# Change version to "0.1.0" (or your version)

# Step 2: Commit changes
git add .
git commit -m "chore: bump version to 0.1.0"

# Step 3: Create and push tag
git tag v0.1.0
git push origin main
git push origin v0.1.0
```

**What happens:**
1. ✅ GitHub Actions detects the tag
2. ✅ Builds for Windows, macOS, and Linux in parallel
3. ✅ Creates a GitHub Release
4. ✅ Uploads all executables to the release

**Result:** Visit your [Releases page](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/releases) to download!

### 2️⃣ Manual Build (On-Demand)

**Build anytime without creating a release**

1. Go to your repository on GitHub
2. Click **"Actions"** tab (top menu)
3. Click **"Manual Build"** in the left sidebar
4. Click **"Run workflow"** button (top right)
5. Select platform:
   - **all** - Build for Windows, macOS, and Linux
   - **windows** - Windows only
   - **mac** - macOS only
   - **linux** - Linux only
6. Click green **"Run workflow"** button

**What happens:**
1. ✅ Builds start immediately
2. ✅ Takes 10-15 minutes per platform
3. ✅ Artifacts available for 30 days

**Download:**
1. Click on the workflow run (shows up in the list)
2. Scroll to **"Artifacts"** section at the bottom
3. Download:
   - `SoupModMaker-Windows` (if selected)
   - `SoupModMaker-macOS` (if selected)
   - `SoupModMaker-Linux` (if selected)

### 3️⃣ Automatic Build on Push

**Builds on every push to main/develop (for testing)**

This runs automatically when you push to `main` or `develop` branches.

**What happens:**
1. ✅ Tests run
2. ✅ Code compiles
3. ✅ Build artifacts created (kept for 7 days)

**Purpose:** Verify code builds correctly before release

## 📦 What Gets Built

### Windows (2 files per architecture)

| File | Size | Description |
|------|------|-------------|
| `SoupModMaker-Setup-0.1.0-x64.exe` | ~150MB | 64-bit installer with shortcuts |
| `SoupModMaker-Setup-0.1.0-ia32.exe` | ~140MB | 32-bit installer |
| `SoupModMaker-Portable-0.1.0.exe` | ~150MB | Portable (no install needed) |

**Features:**
- ✅ Desktop shortcut
- ✅ Start menu entry
- ✅ `.soup` file association
- ✅ Customizable install location

### macOS (4 files)

| File | Size | Description |
|------|------|-------------|
| `SoupModMaker-0.1.0-x64.dmg` | ~160MB | Intel Mac installer |
| `SoupModMaker-0.1.0-arm64.dmg` | ~160MB | Apple Silicon installer |
| `SoupModMaker-0.1.0-x64.zip` | ~150MB | Intel Mac archive |
| `SoupModMaker-0.1.0-arm64.zip` | ~150MB | Apple Silicon archive |

**Features:**
- ✅ Native for both Intel and Apple Silicon
- ✅ Drag-to-Applications installer
- ✅ Code signed (when configured)

### Linux (3 files)

| File | Size | Description |
|------|------|-------------|
| `SoupModMaker-0.1.0-x64.AppImage` | ~160MB | Universal (works everywhere) |
| `SoupModMaker-0.1.0-x64.deb` | ~150MB | Debian/Ubuntu package |
| `SoupModMaker-0.1.0-x64.rpm` | ~150MB | Fedora/Red Hat package |

**Install:**
```bash
# AppImage (recommended)
chmod +x SoupModMaker-*.AppImage
./SoupModMaker-*.AppImage

# Debian/Ubuntu
sudo dpkg -i SoupModMaker-*.deb

# Fedora/Red Hat
sudo rpm -i SoupModMaker-*.rpm
```

## ⏱️ Build Times

| Platform | Time | Runs On |
|----------|------|---------|
| Windows | ~12 min | Windows Server 2022 |
| macOS | ~15 min | macOS 13 (Ventura) |
| Linux | ~10 min | Ubuntu 22.04 |

**Total (all platforms):** ~15 minutes (parallel)

## 🔍 Monitoring Builds

### Check Build Status

1. Go to **Actions** tab
2. See current/recent builds
3. Click on a build to see details

### Build Status Icons

- 🟡 **Yellow dot** = In progress
- ✅ **Green check** = Success
- ❌ **Red X** = Failed

### If Build Fails

1. Click on the failed workflow
2. Click on the failed job
3. Expand the failed step
4. Read the error message
5. Fix in your code and push again

## 📥 Downloading Executables

### From Releases (Official)

```
https://github.com/YOUR_USERNAME/SoupModMakerBeta/releases
```

1. Find your version (e.g., `v0.1.0`)
2. Scroll to **Assets**
3. Download the file for your platform
4. Done!

### From Actions (Testing)

```
https://github.com/YOUR_USERNAME/SoupModMakerBeta/actions
```

1. Click on a completed workflow
2. Scroll to **Artifacts**
3. Click to download (auto-downloads as `.zip`)
4. Extract and use

**Note:** Artifacts expire after 7-30 days (depending on workflow)

## 🎨 Customizing Builds

### Change App Name

Edit `electron-app/package.json`:

```json
{
  "build": {
    "productName": "MyAwesomeModMaker"
  }
}
```

### Change App ID

```json
{
  "build": {
    "appId": "com.mycompany.myapp"
  }
}
```

### Add Icons

Place in `electron-app/public/`:
- `icon.ico` - Windows icon (256x256)
- `icon.icns` - macOS icon (512x512)
- `icon.png` - Linux icon (512x512)

### Platform-Specific Settings

```json
{
  "build": {
    "win": {
      "target": ["nsis", "portable"],
      "publisherName": "Your Name"
    },
    "mac": {
      "category": "public.app-category.developer-tools"
    },
    "linux": {
      "category": "Development"
    }
  }
}
```

## 🚨 Common Issues

### Build Succeeds but Artifact is Missing

**Problem:** Build completes but no executable in artifacts

**Solution:** Check the upload step succeeded. Sometimes large files fail to upload.

### Windows Defender Blocks Executable

**Problem:** "Windows protected your PC" message

**Solution:** This is normal for unsigned executables. Click "More info" → "Run anyway"

**Fix:** Code sign your app (requires certificate)

### macOS Won't Open App

**Problem:** "App can't be opened because it is from an unidentified developer"

**Solution:**
```bash
sudo xattr -cr /Applications/SoupModMaker.app
```

Or right-click app → Open → Confirm

### Linux AppImage Won't Execute

**Problem:** Double-click doesn't work

**Solution:**
```bash
chmod +x SoupModMaker-*.AppImage
./SoupModMaker-*.AppImage
```

### Artifacts Expired

**Problem:** "This artifact has expired and cannot be downloaded"

**Solution:**
- Run the workflow again, or
- Download from Releases (if it's a release build)

## 💡 Pro Tips

### 1. Test Before Release

Use "Manual Build" to test before creating a release tag.

### 2. Use Pre-Releases

For beta versions, create as pre-release:
```bash
git tag v0.1.0-beta.1
```

### 3. Build Only What You Need

Use "Manual Build" with specific platform to save time:
- Testing on Windows? Build only Windows
- Need to share with Mac user? Build only macOS

### 4. Download All Artifacts at Once

After workflow completes:
1. Click on the workflow run
2. Use the "Download all artifacts" button (if available)
3. Or download each individually

### 5. Keep Build Logs

If a build works, save the logs! They're useful for debugging future issues.

## 📋 Workflow Files Reference

| File | Purpose | Trigger |
|------|---------|---------|
| `.github/workflows/build.yml` | Test & verify | Push/PR to main/develop |
| `.github/workflows/release.yml` | Official releases | Push tag `v*.*.*` |
| `.github/workflows/manual-build.yml` | On-demand builds | Manual trigger |

## 🔗 Useful Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [electron-builder Docs](https://www.electron.build/)
- [Your Workflows](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/actions)
- [Your Releases](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/releases)

## 🎉 Quick Cheat Sheet

```bash
# Create a release
git tag v0.1.0 && git push origin v0.1.0

# Check all workflows
gh run list  # (requires GitHub CLI)

# Download latest artifact
gh run download  # (requires GitHub CLI)

# View workflow in browser
gh run view --web
```

---

**Questions?** Check [BUILDING.md](BUILDING.md) for detailed build instructions!

**Happy releasing!** 🚀
