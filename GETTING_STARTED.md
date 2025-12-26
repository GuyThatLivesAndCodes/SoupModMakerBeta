# Getting Started with SoupModMaker

Welcome to SoupModMaker! This guide will help you create your first Minecraft mod in minutes.

## Installation

### Step 1: Prerequisites

Make sure you have:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Step 2: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta.git
cd SoupModMakerBeta

# Install all dependencies
npm run setup
```

This will install dependencies for all packages using npm workspaces.

### Step 3: Start Development

```bash
# Start the application in development mode
npm run dev
```

The SoupModMaker window will open automatically!

## Creating Your First Mod

### 1. Create a New Project

1. Click **"New Project"** on the welcome screen
2. A demo project will be created automatically

### 2. Add Your First Block

1. Click the **"+"** button in the sidebar
2. Select **"Block"** from the menu
3. A new block will be created

### 3. Configure the Block

In the Block Editor, you can configure:

- **Block ID**: Unique identifier (e.g., `diamond_lamp`)
- **Display Name**: Name shown in game (e.g., `Diamond Lamp`)
- **Material**: Base material (Stone, Wood, Metal, etc.)
- **Hardness**: How long it takes to break (0-50)
- **Blast Resistance**: Resistance to explosions (0-100)
- **Light Level**: Light emitted (0-15)
- **Sound Type**: Sound when walking/breaking
- **Creative Tab**: Which creative tab to appear in

Example configuration:
```
Block ID: diamond_lamp
Display Name: Diamond Lamp
Material: Metal
Hardness: 3.0
Blast Resistance: 6.0
Light Level: 15
Sound Type: Metal
Creative Tab: Decorations
```

### 4. Export Your Mod

1. Click **"Export"** in the toolbar
2. Select target platform and version:
   - Forge 1.20.4
   - Forge 1.19.2
   - Fabric 1.20.4
   - Fabric 1.19.2
3. Click **"Export"**
4. Your mod will be compiled to a `.jar` file!

### 5. Test in Minecraft

1. Copy the generated `.jar` file to your Minecraft `mods/` folder
2. Launch Minecraft with Forge/Fabric
3. Your block will be in the game!

## Project Structure

When you create a project, here's what you're working with:

```
My First Mod/
├── Metadata
│   ├── Name: My First Mod
│   ├── Mod ID: myfirstmod
│   └── Version: 1.0.0
│
├── Targets (Platforms & Versions)
│   ├── Forge 1.20.4 (Primary)
│   └── Fabric 1.20.4
│
└── Features
    ├── Block: Diamond Lamp
    ├── Block: Ruby Ore
    └── Item: Ruby Gem
```

## Understanding Features

**Features** are the building blocks of your mod:

- **Blocks**: Custom blocks (ores, lamps, decorative blocks)
- **Items**: Custom items (tools, food, materials)
- **Recipes**: Crafting recipes, smelting, etc.
- **And more!** (coming soon)

Each feature is **independent** and can be:
- Enabled/disabled
- Configured separately
- Exported to any supported version

## Multi-Version Support

The magic of SoupModMaker is **multi-version support**:

1. **Create once**: Design your block with the visual editor
2. **Export anywhere**: Generate code for multiple Minecraft versions
3. **No rewriting**: The same block works in 1.20.4 and 1.19.2

### How It Works

SoupModMaker uses a **Version Abstraction Layer** (VAL):

```
Your Block Data (Material: METAL)
        ↓
VAL translates based on version
        ↓
Forge 1.20.4: BlockBehaviour.Properties.of().mapColor(MapColor.METAL)
Forge 1.19.2: Block.Properties.of(Material.METAL).mapColor(MapColor.METAL)
Fabric 1.20.4: FabricBlockSettings.create().mapColor(MapColor.IRON_GRAY)
```

You just pick "Metal" - we handle the version differences!

## Adding More Blocks

To create multiple blocks:

1. Click **"+"** in the sidebar
2. Select **"Block"**
3. Configure the new block
4. Repeat!

All blocks will be included when you export.

## Saving Your Project

Your project is automatically saved as you work. To save manually:

1. Click **"Save"** in the toolbar
2. Choose a location
3. Your project is saved as a `.soup` file

## Opening Projects

To open a saved project:

1. Click **"Open"** in the toolbar
2. Select your `.soup` file
3. Continue working!

## Next Steps

Now that you've created your first mod, try:

1. **Add more blocks** with different properties
2. **Experiment with light levels** to create lamps
3. **Try different materials** to see how they behave
4. **Export to multiple versions** to test compatibility

## Tips & Tricks

### Block IDs
- Always lowercase
- Use underscores, not spaces
- Be descriptive: `ruby_ore` not `ro`

### Material Choice
- **Stone**: Hard, requires pickaxe
- **Wood**: Flammable, medium hardness
- **Metal**: Very hard, requires pickaxe
- **Glass**: Transparent, fragile

### Light Levels
- 0 = No light
- 15 = Maximum light (like a torch)
- 7-10 = Dim ambient light
- 14 = Bright like glowstone

### Hardness Values
- Stone: 1.5
- Iron Block: 5.0
- Obsidian: 50.0
- Bedrock: -1 (unbreakable, but we cap at 50)

## Troubleshooting

### Application won't start
```bash
# Clear node modules and reinstall
rm -rf node_modules */node_modules
npm run setup
```

### Build fails
- Make sure you have Node.js 18+
- Check that all dependencies installed correctly
- Try running `npm run build:core` first

### Mod doesn't show in Minecraft
- Check that your Minecraft version matches the export target
- Ensure the mod is in the `mods/` folder
- Check the Minecraft log for errors

## Getting Help

- **Documentation**: See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- **Issues**: [GitHub Issues](https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta/issues)
- **Community**: Join our discussions!

## What's Next?

Check out:
- [ARCHITECTURE.md](ARCHITECTURE.md) - How SoupModMaker works internally
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- Plugin development guide (coming soon)

Happy modding! 🎮
