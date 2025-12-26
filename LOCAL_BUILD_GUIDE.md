# Local Build Guide for SoupModMaker

This guide will help you build SoupModMaker executables on your local machine without relying on GitHub Actions.

## Prerequisites

You need:
- **Node.js 18.x** - Download from https://nodejs.org/
- **npm** - Comes with Node.js
- **Terminal** - You already have this!
- **VS Code** (optional but recommended)

## Quick Start (5 Steps)

### Step 1: Verify Node.js Installation

Open your Terminal and run:
```bash
node --version
npm --version
```

You should see versions like:
```
v18.x.x
9.x.x
```

If not, install Node.js 18.x from https://nodejs.org/

### Step 2: Install Project Dependencies

Navigate to your project folder and run:
```bash
cd /home/user/SoupModMakerBeta
npm run setup
```

This installs all dependencies for all packages in the monorepo.

### Step 3: Build the Core Package

The core package must be built first:
```bash
npm run build:core
```

This compiles the TypeScript code in the `core` folder.

### Step 4: Install Electron App Dependencies

```bash
cd electron-app
npm install
cd ..
```

This ensures the electron-app has all its dependencies.

### Step 5: Build the Executable

Now build the Electron app:
```bash
cd electron-app
npm run build
```

This will:
- Compile TypeScript
- Build the Vite frontend
- Package everything with electron-builder
- Create executables in `electron-app/release/`

## What You'll Get

After building, check the `electron-app/release/` folder:

**On Windows:**
- `SoupModMaker-Portable-0.1.0.exe` - Portable executable (no installation needed)

**On macOS:**
- `SoupModMaker-0.1.0-x64.dmg` - Intel Mac installer
- `SoupModMaker-0.1.0-arm64.dmg` - Apple Silicon installer

**On Linux:**
- `SoupModMaker-0.1.0-x64.AppImage` - Universal Linux executable
- `SoupModMaker-0.1.0-x64.deb` - Debian/Ubuntu package
- `SoupModMaker-0.1.0-x64.rpm` - Fedora/Red Hat package

## Development Mode (Faster Testing)

Instead of building executables every time, you can run in development mode:

```bash
cd electron-app
npm run dev
```

This starts:
- Vite dev server with hot reload
- Electron app in development mode

Changes to your code will automatically reload!

## Troubleshooting

### Error: "Cannot find module '@soupmodmaker/core'"

**Solution:** Build the core package first:
```bash
npm run build:core
```

### Error: "electron-builder not found"

**Solution:** Install electron-app dependencies:
```bash
cd electron-app
npm install
```

### Error: "7zip not found" or "ENOENT: 7za.exe"

**Solution (Windows):**
Install 7zip globally:
```bash
# Using Chocolatey
choco install 7zip -y

# Or download from https://www.7-zip.org/
```

**Solution (macOS):**
Install via Homebrew:
```bash
brew install p7zip
```

**Solution (Linux):**
```bash
sudo apt install p7zip-full  # Debian/Ubuntu
sudo yum install p7zip        # Fedora/RedHat
```

### Build is Slow

The first build takes longest (10-15 minutes). Subsequent builds are faster because:
- Dependencies are cached
- Only changed files are rebuilt

### Out of Memory Error

If you see "JavaScript heap out of memory":
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Using VS Code

### Opening the Project

1. Open VS Code
2. File → Open Folder
3. Select `SoupModMakerBeta` folder

### Recommended Extensions

VS Code will suggest installing:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### Running Tasks

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and type:
- "Tasks: Run Build Task" to build
- Or use the integrated terminal

### Integrated Terminal

- View → Terminal (or `` Ctrl+` ``)
- Run all commands from the integrated terminal

## Build Scripts Reference

From the root directory:

```bash
# Install all dependencies
npm run setup

# Build core package
npm run build:core

# Run tests
npm test

# Clean build artifacts
rm -rf core/dist electron-app/dist electron-app/release
```

From `electron-app/` directory:

```bash
# Development mode with hot reload
npm run dev

# Build executable (creates in release/ folder)
npm run build

# Build directory only (faster, no packaging)
npm run build:dir

# Preview production build
npm preview
```

## Creating Different Build Types

### Windows Only (Portable)
Already configured in `electron-app/package.json`:
```json
"win": {
  "target": [{"target": "portable", "arch": ["x64"]}]
}
```

### Windows Installer (NSIS)
Edit `electron-app/package.json`:
```json
"win": {
  "target": ["nsis", "portable"]
}
```

### 32-bit and 64-bit
```json
"win": {
  "target": [{"target": "portable", "arch": ["x64", "ia32"]}]
}
```

## Build Optimization

### Faster Builds During Development

Use `--dir` flag to skip packaging:
```bash
npm run build:dir
```

This creates an unpacked directory instead of executables.

### Smaller Executables

The current config already uses:
- `"compression": "store"` - No compression (faster)
- `"asar": false` - No ASAR archive (simpler)

For production releases, you can enable these for smaller files:
```json
"compression": "normal",
"asar": true
```

## Next Steps

1. **Build locally** - Follow steps 1-5 above
2. **Test the executable** - Run the file from `electron-app/release/`
3. **Make changes** - Edit code and rebuild
4. **Share executables** - Copy files from `release/` folder

## Getting Help

If you run into issues:

1. Check error messages carefully
2. Verify all prerequisites are installed
3. Try `npm run setup` again
4. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules electron-app/node_modules core/node_modules
   npm run setup
   ```

## Comparison: Local vs CI/CD

**Local Building Advantages:**
- Full control over environment
- Faster iteration (no waiting for CI)
- Easier debugging
- No GitHub Actions minutes used

**GitHub Actions Advantages:**
- Build for all platforms simultaneously
- Clean environment every time
- Automated on every release
- No local setup required

**Recommendation:** Get it working locally first, then revisit CI/CD later.

---

**Ready?** Start with Step 1 above and build your first executable! 🚀
