# 🪟 Building SoupModMaker on Windows

This guide will help you build SoupModMaker as a Windows executable (.exe) file.

## 📋 Prerequisites

Before building, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Git** (optional) - [Download here](https://git-scm.com/)
3. **Windows 10/11** (64-bit)

## 🚀 Quick Build (Easiest Method)

### Option 1: Using Batch File (Recommended)

1. **Download or clone the repository**
   ```
   Download the ZIP and extract it, or:
   git clone https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta.git
   cd SoupModMakerBeta
   ```

2. **Double-click `build-windows.bat`**
   - This will automatically:
     - Install all dependencies
     - Build the core package
     - Build the electron app
     - Create the .exe file

3. **Wait for the build to complete**
   - This may take 5-10 minutes the first time
   - You'll see a success message when done

4. **Find your .exe file**
   - Location: `electron-app\release\SoupModMaker-Portable-0.1.0.exe`
   - Double-click to run!

### Option 2: Using PowerShell

1. **Open PowerShell** (Right-click Start → Windows PowerShell)

2. **Navigate to the project folder**
   ```powershell
   cd path\to\SoupModMakerBeta
   ```

3. **Run the build script**
   ```powershell
   powershell -ExecutionPolicy Bypass -File build-windows.ps1
   ```

4. **Wait for completion**
   - The script will show progress for each step
   - Your .exe will be in `electron-app\release\`

## 🔧 Manual Build (Advanced)

If the automatic scripts don't work, try building manually:

1. **Install dependencies**
   ```cmd
   npm install
   npm run setup
   ```

2. **Build the core package**
   ```cmd
   cd core
   npm run build
   cd ..
   ```

3. **Build the electron app**
   ```cmd
   cd electron-app
   npm run build:win
   ```

4. **Find your files**
   - Portable .exe: `electron-app\release\SoupModMaker-Portable-0.1.0.exe`
   - Installer .exe: `electron-app\release\SoupModMaker Setup 0.1.0.exe`

## 📦 Build Outputs

The build creates **TWO** versions:

1. **Portable Version** (Recommended for most users)
   - File: `SoupModMaker-Portable-0.1.0.exe`
   - No installation needed
   - Just double-click to run
   - Can run from USB drive

2. **Installer Version** (Traditional Windows installer)
   - File: `SoupModMaker Setup 0.1.0.exe`
   - Installs to Program Files
   - Creates desktop shortcut
   - Adds to Start Menu

## 🐛 Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

### "Permission denied" or access errors
- Run Command Prompt or PowerShell as Administrator
- Right-click → "Run as administrator"

### Build fails with "ENOENT" or file not found
- Make sure you're in the correct directory
- Delete `node_modules` folders and run `npm install` again

### "electron-builder" errors
- Try installing electron-builder globally:
  ```cmd
  npm install -g electron-builder
  ```

### 7zip errors
- The build script should handle this automatically
- If it fails, install 7-Zip: https://www.7-zip.org/

### Build takes forever or hangs
- First build can take 10-15 minutes
- Make sure you have stable internet connection
- Disable antivirus temporarily (may block npm)

## 💡 Tips

- **First build is slow**: Subsequent builds are much faster
- **Portable vs Installer**: Portable is easier to distribute
- **Testing**: The .exe works on any Windows 10/11 PC
- **Antivirus**: Windows Defender may flag unsigned .exe files as suspicious - this is normal

## 🆘 Still Having Issues?

If you're still stuck:

1. Check Node.js version: `node --version` (should be v18+)
2. Try deleting these folders and rebuilding:
   - `node_modules`
   - `core/node_modules`
   - `electron-app/node_modules`
   - `electron-app/dist`
   - `electron-app/dist-electron`
   - `electron-app/release`

3. Then run:
   ```cmd
   npm run setup
   build-windows.bat
   ```

## 📁 Project Structure

```
SoupModMakerBeta/
├── build-windows.bat        ← Click this to build!
├── build-windows.ps1         ← Or use PowerShell
├── core/                     ← Core libraries
├── electron-app/            ← Main application
│   └── release/             ← Your .exe files appear here!
└── plugins/                 ← Plugin system
```

## 🎉 Success!

Once built successfully, you'll have a working SoupModMaker.exe file that you can:
- Double-click to run
- Share with friends
- Distribute to users
- Run without internet

Enjoy creating Minecraft mods! 🎮
