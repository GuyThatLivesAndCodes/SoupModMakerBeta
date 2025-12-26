# Building SoupModMaker

This guide explains how to build SoupModMaker executables for Windows, macOS, and Linux.

## Table of Contents

- [Local Build](#local-build)
- [GitHub Actions Automated Build](#github-actions-automated-build)
- [Release Process](#release-process)
- [Build Outputs](#build-outputs)
- [Troubleshooting](#troubleshooting)

## Local Build

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Building from Source

```bash
# Clone the repository
git clone https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta.git
cd SoupModMakerBeta

# Install dependencies
npm run setup

# Build core library
npm run build:core

# Build executable for your platform
cd electron-app
npm run build
```

This will create executables in `electron-app/release/`:

- **Windows**: `SoupModMaker-Setup-{version}-{arch}.exe` (installer) and `SoupModMaker-Portable-{version}.exe` (portable)
- **macOS**: `SoupModMaker-{version}-{arch}.dmg` and `.zip`
- **Linux**: `SoupModMaker-{version}-{arch}.AppImage`, `.deb`, and `.rpm`

### Building for Specific Platform

```bash
# Build directory only (faster, no installer)
npm run build:dir

# Build for specific platform
electron-builder --win
electron-builder --mac
electron-builder --linux
```

## GitHub Actions Automated Build

SoupModMaker uses GitHub Actions to automatically build executables for all platforms!

### Automatic Builds

Three workflows are configured:

#### 1. **Build & Test** (`build.yml`)

Runs on every push and pull request to `main` or `develop` branches.

- Builds on Windows, macOS, and Linux
- Runs tests
- Creates build artifacts (kept for 7 days)

**Trigger**: Automatic on push/PR

#### 2. **Release Build** (`release.yml`)

Creates production executables when you create a release tag.

**Trigger**: Push a tag starting with `v` (e.g., `v0.1.0`)

```bash
# Create a release tag
git tag v0.1.0
git push origin v0.1.0
```

This will:
1. Build executables for Windows, macOS, and Linux
2. Upload artifacts
3. Create a GitHub Release with all executables attached

#### 3. **Manual Build** (`manual-build.yml`)

Allows you to manually trigger builds from GitHub UI.

**How to use:**
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Select **"Manual Build"** workflow
4. Click **"Run workflow"**
5. Choose platform:
   - `all` - Build for all platforms
   - `windows` - Windows only
   - `mac` - macOS only
   - `linux` - Linux only
6. Click **"Run workflow"**

**Artifacts**: Available for 30 days in the workflow run

### Downloading Built Executables

#### From GitHub Actions

1. Go to **Actions** tab in your repository
2. Click on a completed workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `SoupModMaker-Windows` - Windows executables
   - `SoupModMaker-macOS` - macOS executables
   - `SoupModMaker-Linux` - Linux executables

#### From GitHub Releases

1. Go to **Releases** page
2. Find your release (created by release workflow)
3. Download the appropriate file for your platform:
   - **Windows**: `.exe` files
   - **macOS**: `.dmg` or `.zip` files
   - **Linux**: `.AppImage`, `.deb`, or `.rpm` files

## Release Process

### Creating a Release with Executables

**Option 1: Using Git Tags (Recommended)**

```bash
# Update version in package.json files
# Then create and push tag
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will automatically:
1. Build for all platforms
2. Create a GitHub Release
3. Attach all executables to the release

**Option 2: Manual GitHub Release**

1. Click **"Releases"** → **"Create a new release"**
2. Create a tag (e.g., `v0.1.0`)
3. Wait for GitHub Actions to build
4. Executables will be automatically attached

**Option 3: Manual Build Workflow**

1. Run **"Manual Build"** workflow with `all` platforms
2. Download artifacts
3. Create release manually and upload files

### Version Numbering

Use semantic versioning:
- `v0.1.0` - First beta release
- `v0.2.0` - New features
- `v0.2.1` - Bug fixes
- `v1.0.0` - First stable release

## Build Outputs

### Windows

| File | Description | Size |
|------|-------------|------|
| `SoupModMaker-Setup-{version}-x64.exe` | 64-bit installer | ~150MB |
| `SoupModMaker-Setup-{version}-ia32.exe` | 32-bit installer | ~140MB |
| `SoupModMaker-Portable-{version}.exe` | Portable executable | ~150MB |

**Installer Features:**
- Custom installation directory
- Desktop shortcut
- Start menu shortcut
- `.soup` file association

### macOS

| File | Description | Size |
|------|-------------|------|
| `SoupModMaker-{version}-x64.dmg` | Intel Mac installer | ~160MB |
| `SoupModMaker-{version}-arm64.dmg` | Apple Silicon installer | ~160MB |
| `SoupModMaker-{version}-x64.zip` | Intel Mac archive | ~150MB |
| `SoupModMaker-{version}-arm64.zip` | Apple Silicon archive | ~150MB |

**Note:** macOS builds include both Intel and Apple Silicon versions.

### Linux

| File | Description | Size |
|------|-------------|------|
| `SoupModMaker-{version}-x64.AppImage` | Universal Linux app | ~160MB |
| `SoupModMaker-{version}-x64.deb` | Debian/Ubuntu package | ~150MB |
| `SoupModMaker-{version}-x64.rpm` | Fedora/Red Hat package | ~150MB |

**Installation:**

```bash
# AppImage (Universal)
chmod +x SoupModMaker-*.AppImage
./SoupModMaker-*.AppImage

# Debian/Ubuntu
sudo dpkg -i SoupModMaker-*.deb

# Fedora/Red Hat
sudo rpm -i SoupModMaker-*.rpm
```

## Build Configuration

Build settings are in `electron-app/package.json` under the `"build"` section.

### Key Settings

```json
{
  "build": {
    "appId": "com.soupmodmaker.app",
    "productName": "SoupModMaker",
    "compression": "normal",
    "asar": true,
    "fileAssociations": [
      {
        "ext": "soup",
        "name": "SoupModMaker Project"
      }
    ]
  }
}
```

### Adding Icons

Place icons in `electron-app/public/`:

- **Windows**: `icon.ico` (256x256)
- **macOS**: `icon.icns` (512x512)
- **Linux**: `icon.png` (512x512)

You can generate icons from a single PNG using [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder):

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./electron-app/public/
```

## Troubleshooting

### Build Fails on GitHub Actions

**Problem**: Build fails with "Out of memory"
**Solution**: GitHub Actions has memory limits. Try reducing `compression` in build config.

**Problem**: macOS code signing fails
**Solution**: macOS builds require code signing certificates. Set `hardenedRuntime: false` for unsigned builds.

### Local Build Issues

**Problem**: `electron-builder` not found
```bash
cd electron-app
npm install --save-dev electron-builder
```

**Problem**: Build fails with EACCES error
```bash
sudo chown -R $USER:$(id -gn $USER) ~/.config
```

**Problem**: Windows build on macOS/Linux
```bash
# Install wine for cross-platform builds
brew install wine-stable  # macOS
sudo apt install wine     # Linux

# Then build
electron-builder --win
```

### Executable Won't Run

**Windows**: "Windows protected your PC"
- Click "More info" → "Run anyway"
- This happens because the app is not code-signed

**macOS**: "App can't be opened because it is from an unidentified developer"
```bash
sudo xattr -cr /Applications/SoupModMaker.app
```

**Linux**: AppImage won't execute
```bash
chmod +x SoupModMaker-*.AppImage
```

## Advanced Build Options

### Cross-Platform Building

Build for all platforms from any OS (requires Docker):

```bash
# Build for all platforms
electron-builder -mwl

# Build for specific platforms
electron-builder --mac --win
electron-builder --linux
```

### Reducing Build Size

In `electron-app/package.json`:

```json
{
  "build": {
    "compression": "maximum",
    "asar": true,
    "files": [
      "dist/**/*",
      "!**/*.map",
      "!**/node_modules/**"
    ]
  }
}
```

### Auto-Update

GitHub Actions are configured for auto-update via `electron-updater`.

In your app:
```typescript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

## Continuous Deployment

For automatic releases on every version bump:

1. Update version in `package.json`
2. Commit changes
3. Create tag: `git tag v{version}`
4. Push: `git push && git push --tags`
5. GitHub Actions builds and releases automatically!

## Build Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies |
| `npm run build:core` | Build core library |
| `npm run build` | Build executable for current OS |
| `npm run build:dir` | Build directory only (no installer) |
| `electron-builder --win` | Build for Windows |
| `electron-builder --mac` | Build for macOS |
| `electron-builder --linux` | Build for Linux |
| `electron-builder -mwl` | Build for all platforms |

## Getting Help

- **Build issues**: Check the [GitHub Actions logs](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/actions)
- **electron-builder docs**: https://www.electron.build/
- **Open an issue**: https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/issues

---

**Happy building!** 🚀
