# SoupModMaker Architecture

## Core Philosophy
**"Everything is a Plugin, Everything is Data-Driven"**

SoupModMaker is built on a flexible, extensible architecture where features are plugins that stack on top of a robust abstraction layer. This ensures stability while allowing easy updates and additions.

## 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (React)                      │
│           Modern, Responsive, Plugin-Aware               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Feature Plugin System                       │
│  ┌─────────────┬──────────────┬───────────────┐        │
│  │   Blocks    │    Items     │   Recipes     │  ...   │
│  │   Plugin    │    Plugin    │    Plugin     │        │
│  └─────────────┴──────────────┴───────────────┘        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│           Version Abstraction Layer (VAL)                │
│     Translates abstract features → version code          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Platform Generators                         │
│  ┌─────────┬─────────┬─────────┬─────────┐             │
│  │  Forge  │ Fabric  │  Bukkit │  Paper  │    ...      │
│  └─────────┴─────────┴─────────┴─────────┘             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Build System Integration                    │
│            Gradle/Maven + JDK Management                 │
└─────────────────────────────────────────────────────────┘
```

## 📦 Feature Plugin System

### Plugin Structure
Every feature is a self-contained plugin with:

```typescript
interface FeaturePlugin {
  // Plugin metadata
  id: string;                    // e.g., "core.block"
  name: string;                  // e.g., "Block Creator"
  version: string;               // Semantic versioning
  dependencies: string[];        // Other plugin IDs

  // UI Integration
  uiComponents: {
    editor: React.ComponentType;    // Main editor UI
    sidebar?: React.ComponentType;  // Sidebar widget
    menuItems?: MenuItem[];         // Menu contributions
  };

  // Data Schema (JSON Schema)
  schema: JSONSchema;            // Defines what data this feature stores

  // Code Generation
  generators: {
    [platformVersion: string]: CodeGenerator;
  };

  // Lifecycle hooks
  onActivate?: () => void;
  onDeactivate?: () => void;
  validate?: (data: any) => ValidationResult;
}
```

### Example: Block Plugin Data
```json
{
  "featureType": "block",
  "id": "diamond_lamp",
  "displayName": "Diamond Lamp",
  "properties": {
    "material": "METAL",
    "hardness": 3.0,
    "resistance": 3.0,
    "lightLevel": 15,
    "hasItem": true
  },
  "textures": {
    "all": "assets/diamond_lamp.png"
  }
}
```

## 🔄 Version Abstraction Layer (VAL)

The VAL is the magic that makes multi-version support possible.

### Concept
Instead of hardcoding version-specific code, we:
1. **Define abstract concepts** (e.g., "Block", "Item", "Recipe")
2. **Map to version-specific implementations** via templates
3. **Use capability detection** to handle missing features

### Abstraction Mapping Example

```typescript
interface VersionMapping {
  version: string;              // "1.20.4", "1.19.2", etc.
  platform: string;             // "forge", "fabric"

  // Feature capabilities
  capabilities: {
    [featureId: string]: {
      supported: boolean;
      mappings: Record<string, any>;
    };
  };

  // Template paths
  templates: {
    baseProject: string;
    [featureType: string]: string;
  };

  // Code generation utilities
  imports: ImportMapper;
  namespaces: NamespaceMapper;
}
```

### Example Mapping: Block Material

```yaml
# mappings/forge/1.20.4.yaml
block.material:
  STONE: "BlockBehaviour.Properties.of().mapColor(MapColor.STONE)"
  METAL: "BlockBehaviour.Properties.of().mapColor(MapColor.METAL).requiresCorrectToolForDrops()"

# mappings/forge/1.19.2.yaml
block.material:
  STONE: "Block.Properties.of(Material.STONE)"
  METAL: "Block.Properties.of(Material.METAL).requiresCorrectToolForDrops()"

# mappings/fabric/1.20.4.yaml
block.material:
  STONE: "FabricBlockSettings.create().mapColor(MapColor.STONE_GRAY)"
  METAL: "FabricBlockSettings.create().mapColor(MapColor.IRON_GRAY).requiresTool()"
```

## 🎯 Target Platform Support (Initial)

### Forge
- **1.20.4** (Latest stable)
- **1.19.2** (Popular modding version)

### Fabric
- **1.20.4** (Latest)
- **1.19.2** (Popular)

### Future Extensions
- NeoForge 1.20.x
- Forge 1.16.5, 1.12.2
- Bukkit/Spigot plugins
- Fabric 1.18.2

## 📁 Project Structure

```
SoupModMaker/
├── electron-app/                  # Electron application
│   ├── package.json
│   ├── src/
│   │   ├── main/                  # Main process (Node.js)
│   │   │   ├── index.ts
│   │   │   ├── project-manager.ts
│   │   │   └── build-system.ts
│   │   ├── renderer/              # Renderer process (React)
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── Editor/
│   │   │   │   ├── Sidebar/
│   │   │   │   └── Toolbar/
│   │   │   └── plugins/           # UI for plugins
│   │   └── shared/                # Shared code
│   │       ├── types/
│   │       └── utils/
│   └── public/
│
├── core/                          # Core plugin system
│   ├── package.json
│   ├── src/
│   │   ├── plugin-system/
│   │   │   ├── PluginManager.ts
│   │   │   ├── PluginLoader.ts
│   │   │   └── PluginRegistry.ts
│   │   ├── version-abstraction/
│   │   │   ├── VersionMapper.ts
│   │   │   ├── CapabilityDetector.ts
│   │   │   └── TemplateEngine.ts
│   │   └── data/
│   │       └── Project.ts
│
├── plugins/                       # Feature plugins
│   ├── block-creator/
│   │   ├── package.json
│   │   ├── plugin.json            # Plugin manifest
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── BlockEditor.tsx    # UI component
│   │   │   ├── schema.json        # Data schema
│   │   │   └── generators/
│   │   │       ├── forge-1.20.4.ts
│   │   │       ├── forge-1.19.2.ts
│   │   │       ├── fabric-1.20.4.ts
│   │   │       └── fabric-1.19.2.ts
│   │   └── templates/
│   │       └── ...
│   ├── item-creator/
│   ├── recipe-creator/
│   └── ...
│
├── generators/                    # Platform code generators
│   ├── forge/
│   │   ├── 1.20.4/
│   │   │   ├── mappings.yaml
│   │   │   └── templates/
│   │   └── 1.19.2/
│   ├── fabric/
│   │   ├── 1.20.4/
│   │   └── 1.19.2/
│   └── common/
│       └── utils/
│
├── templates/                     # Base project templates
│   ├── forge/
│   │   ├── 1.20.4/
│   │   │   ├── build.gradle
│   │   │   ├── gradle.properties
│   │   │   └── src/
│   │   └── 1.19.2/
│   └── fabric/
│
└── build-system/                  # Build orchestration
    ├── gradle-wrapper/
    ├── jdk-manager/
    └── export-manager/
```

## 🔌 Plugin Lifecycle

1. **Discovery**: PluginManager scans `plugins/` directory
2. **Loading**: Plugins loaded based on dependency order
3. **Registration**: Features register with FeatureRegistry
4. **Activation**: UI components mounted, generators registered
5. **Runtime**: User creates/edits features
6. **Generation**: Data → Code via Version Abstraction Layer
7. **Export**: Build system compiles final mod

## 🚀 Code Generation Flow

```
User creates Block in UI
        ↓
Block data saved (JSON)
        ↓
User exports mod (Forge 1.20.4)
        ↓
PluginManager asks BlockPlugin for generator
        ↓
BlockPlugin returns Forge-1.20.4 generator
        ↓
Generator + VAL → Java code
        ↓
TemplateEngine fills base project
        ↓
BuildSystem compiles with Gradle
        ↓
Output: working .jar file
```

## 🎨 Modern UI Features

- **Material Design 3** (Material UI React)
- **Dark/Light themes** with system detection
- **Project explorer** with drag-and-drop
- **Live preview** where possible
- **Multi-tab editor** for different features
- **Asset manager** for textures/sounds
- **Build output console** with syntax highlighting
- **Version selector** per project

## 🔧 Extensibility Points

### Adding a New Feature
1. Create plugin in `plugins/new-feature/`
2. Define data schema
3. Create UI component
4. Implement generators for supported platforms
5. Plugin auto-discovered on restart

### Adding a New Version
1. Add mappings in `generators/platform/version/`
2. Add base template
3. Update capability matrix
4. Test with existing features

### Adding a New Platform
1. Create generator in `generators/new-platform/`
2. Implement CodeGenerator interface
3. Add templates
4. Update UI to show new platform option

## 📊 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 28+
- **UI Framework**: Material UI (MUI)
- **Code Editor**: Monaco Editor
- **State Management**: Zustand or Redux Toolkit
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Templates**: Handlebars
- **YAML**: js-yaml for mappings
- **Schema Validation**: Ajv (JSON Schema)

## 🎯 MVP Deliverables

1. ✅ Working Electron app with modern UI
2. ✅ Plugin system with hot-reload support
3. ✅ Block creator plugin
4. ✅ Forge 1.20.4 + 1.19.2 support
5. ✅ Fabric 1.20.4 + 1.19.2 support
6. ✅ Export to working .jar
7. ✅ Project save/load
8. ✅ Asset management

## 🔮 Future Enhancements

- Visual programming (Blockly)
- Recipe creator
- Item creator
- Entity/Mob creator
- Biome generator
- Live reload in Minecraft
- Marketplace for community plugins
- Cloud project sync
- Collaborative editing
- AI-assisted mod creation

---

**This architecture ensures:**
- 🎯 Easy to add new features (just add a plugin)
- 🎯 Easy to support new versions (just add mappings)
- 🎯 Easy to support new platforms (just add generators)
- 🎯 Maintainable codebase (clear separation of concerns)
- 🎯 Extensible by community (plugin API)
