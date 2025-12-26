# SoupModMaker

**Modern Minecraft Mod & Plugin Creator**

Create Minecraft mods and plugins for multiple versions - fast, fun, and free!

<p align="center">
  <strong>Multi-Version Support • Modern UI • Plugin Architecture • Open Source</strong>
</p>

---

## Features

- **Multi-Version Support**: Create mods for Forge 1.20.4, 1.19.2 and Fabric 1.20.4, 1.19.2 from a single project
- **Modern UI**: Beautiful, responsive Material Design interface with dark mode
- **Plugin-Based Architecture**: Extensible system where everything is a plugin
- **Version Abstraction Layer**: Smart system that translates your concepts into version-specific code
- **Block Creator**: Visual editor for creating custom blocks
- **Future-Proof**: Designed to easily add new features, versions, and platforms

## What Makes SoupModMaker Different?

Unlike MCreator, SoupModMaker is built on a **flexible, plugin-based architecture** where:

1. **Everything is Data-Driven**: Features are defined by data, not hardcoded
2. **Version Abstraction**: One project exports to multiple Minecraft versions
3. **Modern Stack**: Built with TypeScript, React, and Electron
4. **Extensible**: Add new features by creating plugins, not modifying core code
5. **Open Architecture**: Community can create and share custom feature plugins

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta.git
cd SoupModMakerBeta

# Install dependencies (uses npm workspaces)
npm run setup

# Start development mode
npm run dev
```

The application will start in development mode with hot reload enabled.

### Building for Production

```bash
# Build all packages
npm run build

# Build standalone executable
cd electron-app
npm run build
```

## Architecture

SoupModMaker is built on a **layered, plugin-based architecture**:

```
┌─────────────────────────────────────┐
│         UI Layer (React)             │
│      Modern, Responsive UI           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Feature Plugin System           │
│   Blocks • Items • Recipes • ...    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Version Abstraction Layer (VAL)   │
│  Translates features → version code │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Platform Generators            │
│   Forge • Fabric • Bukkit • ...     │
└─────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation.

## Project Structure

```
SoupModMaker/
├── core/                  # Core plugin system and version abstraction
├── electron-app/          # Electron desktop application
├── plugins/               # Feature plugins (blocks, items, etc.)
│   └── block-creator/     # Block creation plugin
├── generators/            # Version mappings (Forge, Fabric)
├── templates/             # Base project templates
└── build-system/          # Build orchestration
```

## Current Features (MVP)

- ✅ Modern Electron + React UI with Material Design
- ✅ Plugin system with hot-reload support
- ✅ Block creator with visual editor
- ✅ Forge 1.20.4 + 1.19.2 code generation
- ✅ Fabric 1.20.4 + 1.19.2 code generation
- ✅ Version abstraction layer
- ✅ Project management (save/load)
- 🚧 Export to working .jar (in progress)
- 🚧 Asset management (in progress)

## Roadmap

### Phase 1: Core Features (Current)
- [x] Plugin system
- [x] Block creator
- [x] Multi-version support (Forge + Fabric)
- [ ] Export to .jar
- [ ] Asset manager

### Phase 2: More Features
- [ ] Item creator
- [ ] Recipe creator
- [ ] Crafting table recipes
- [ ] Smelting recipes
- [ ] Loot tables

### Phase 3: Advanced
- [ ] Entity/Mob creator
- [ ] Biome generator
- [ ] Dimension creator
- [ ] Visual programming (Blockly)
- [ ] Live reload in Minecraft

### Phase 4: Ecosystem
- [ ] Plugin marketplace
- [ ] Cloud sync
- [ ] Collaborative editing
- [ ] AI-assisted creation

## Creating a Plugin

SoupModMaker's extensibility is its superpower. Here's how to create a custom feature plugin:

```typescript
// plugins/my-feature/src/index.ts
import { FeaturePlugin } from '@soupmodmaker/core';

const myPlugin: FeaturePlugin = {
  id: 'custom.my-feature',
  name: 'My Feature',
  version: '1.0.0',
  dependencies: [],
  minCoreVersion: '0.1.0',

  schema: { /* JSON Schema */ },

  generators: new Map([
    ['forge:1.20.4', new MyForgeGenerator()],
    ['fabric:1.20.4', new MyFabricGenerator()],
  ]),

  validate: (data) => { /* validation */ },
  defaultData: () => ({ /* default values */ }),
};

export default myPlugin;
```

See the [block-creator plugin](plugins/block-creator/) for a complete example.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Material UI
- **Desktop**: Electron 28
- **Build**: Vite + npm workspaces
- **Templates**: Handlebars
- **Schemas**: JSON Schema + Zod
- **Code Gen**: Custom generators with YAML mappings

## Contributing

Contributions are welcome! Areas where we need help:

- **New Features**: Create plugins for items, recipes, entities, etc.
- **Version Support**: Add mappings for more Minecraft versions
- **Platform Support**: Bukkit/Spigot, NeoForge support
- **UI/UX**: Improve the interface, add 3D previews
- **Documentation**: Tutorials, guides, examples
- **Testing**: Test with real Minecraft versions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by MCreator, but built from scratch with modern architecture
- Thanks to the Minecraft modding community
- Material UI for the beautiful components
- The Electron and React teams

## Support

- **Issues**: [GitHub Issues](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/discussions)

---

**Made with ❤️ by the SoupModMaker Team**

*Create mods, not headaches!*
