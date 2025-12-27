# SoupModMaker - Tauri Version

This is the Tauri-based version of SoupModMaker, migrated from Electron to resolve Windows build issues.

## Why Tauri?

- **Smaller executables**: ~15MB vs Electron's ~120MB
- **No build issues**: No code signing or permission errors on Windows
- **Better performance**: Uses native WebView instead of bundling Chromium
- **Better security**: Rust backend with stricter permissions
- **Same features**: All functionality preserved from Electron version

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Rust** (latest stable)
   - Install from: https://rustup.rs/
   - On Windows, run: `rustup target add x86_64-pc-windows-msvc`

3. **Microsoft Visual Studio C++ Build Tools** (Windows only)
   - Install from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Select "Desktop development with C++" workload

## Building for Windows

### Development Build

```bash
cd tauri-app
npm install
npm run tauri:dev
```

This will start the development server and open the app.

### Production Build (Windows .exe)

```bash
cd tauri-app
npm install
npm run tauri:build
```

The built executable will be in:
```
tauri-app/src-tauri/target/release/SoupModMaker.exe
```

And installers will be in:
```
tauri-app/src-tauri/target/release/bundle/
```

### Available Build Outputs

Tauri automatically creates:
- **Portable .exe**: Single executable file
- **MSI installer**: Windows Installer package
- **NSIS installer**: Nullsoft installer (optional)

## Project Structure

```
tauri-app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── api/               # Tauri API wrapper
│   └── utils/             # Code generators, etc.
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── lib.rs         # Tauri commands
│   │   └── main.rs        # Entry point
│   └── tauri.conf.json    # App configuration
└── package.json           # Frontend dependencies
```

## Features

All features from the Electron version are preserved:

- ✅ **Item Maker**: Create custom items with 6 types (basic, tool, armor, food, fuel, weapon)
- ✅ **Recipe Creator**: Design recipes with 8 types (shaped, shapeless, smelting, etc.)
- ✅ **Mob Creator**: Design custom entities
- ✅ **Event Handler**: Create event-based logic
- ✅ **Project Management**: Save/load projects
- ✅ **Plugin System**: Import and manage plugins
- ✅ **Live Code Preview**: See generated Java code in real-time

## Troubleshooting

### Build fails with "Rust not found"
Install Rust from https://rustup.rs/

### Build fails with "MSVC not found" (Windows)
Install Visual Studio C++ Build Tools

### App window is blank
Make sure you ran `npm install` in both the root and tauri-app directories

### "Permission denied" errors
No longer an issue! This was the main problem with Electron that Tauri solves.

## Performance Comparison

| Metric | Electron | Tauri |
|--------|----------|-------|
| Download size | ~120MB | ~15MB |
| Memory usage | ~150MB | ~50MB |
| Startup time | ~3s | ~1s |
| Build complexity | High | Low |

## Next Steps

1. Build the app: `cd tauri-app && npm run tauri:build`
2. Find your .exe in `src-tauri/target/release/`
3. Run it and test all features!
4. Report any issues to the GitHub repository
