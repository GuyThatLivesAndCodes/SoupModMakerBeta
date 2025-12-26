# Contributing to SoupModMaker

Thank you for your interest in contributing to SoupModMaker! This document provides guidelines and information for contributors.

## Ways to Contribute

### 1. Create Feature Plugins

The easiest way to contribute is by creating new feature plugins!

- Item creator
- Recipe editor
- Entity/Mob creator
- Biome generator
- Command creator
- GUI creator

See the [block-creator plugin](plugins/block-creator/) as a reference.

### 2. Add Version Support

Help us support more Minecraft versions:

- Add version mappings in `generators/`
- Test with actual Minecraft installations
- Document any version-specific quirks

Priority versions:
- Forge 1.16.5
- Forge 1.12.2
- Fabric 1.18.2
- NeoForge 1.20.x

### 3. Improve UI/UX

- Design new components
- Add 3D block previews
- Improve editor interfaces
- Create themes
- Add animations

### 4. Documentation

- Write tutorials
- Create video guides
- Improve API documentation
- Translate to other languages

### 5. Bug Fixes

- Fix reported issues
- Improve error handling
- Add validation
- Write tests

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Code editor (VS Code recommended)

### Setup Steps

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/SoupModMakerBeta.git
cd SoupModMakerBeta

# Add upstream remote
git remote add upstream https://github.com/GuyThatLivesAndCodes/SoupModMakerBeta.git

# Install dependencies
npm run setup

# Start development
npm run dev
```

### Project Structure

```
SoupModMaker/
├── core/                  # Core plugin system (TypeScript)
│   ├── src/
│   │   ├── plugin-system/
│   │   ├── version-abstraction/
│   │   └── data/
│   └── package.json
│
├── electron-app/          # Desktop app (Electron + React)
│   ├── src/
│   │   ├── main/          # Electron main process
│   │   ├── renderer/      # React components
│   │   └── shared/
│   └── package.json
│
├── plugins/               # Feature plugins
│   └── block-creator/     # Example plugin
│       ├── src/
│       │   ├── generators/
│       │   ├── schema.json
│       │   └── index.ts
│       ├── plugin.json
│       └── package.json
│
└── generators/            # Version mappings
    ├── forge/
    └── fabric/
```

## Creating a Feature Plugin

### Step 1: Plugin Structure

```bash
mkdir -p plugins/my-feature/src/generators
cd plugins/my-feature
```

### Step 2: Create plugin.json

```json
{
  "id": "custom.my-feature",
  "name": "My Feature",
  "version": "1.0.0",
  "description": "Description of your feature",
  "dependencies": [],
  "minCoreVersion": "0.1.0",
  "entryPoint": "dist/index.js"
}
```

### Step 3: Create package.json

```json
{
  "name": "@soupmodmaker/plugin-my-feature",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@soupmodmaker/core": "*"
  }
}
```

### Step 4: Define Data Schema

Create `src/schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "My Feature",
  "required": ["id", "name"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9_]+$"
    },
    "name": {
      "type": "string"
    }
  }
}
```

### Step 5: Implement Plugin

Create `src/index.ts`:

```typescript
import { FeaturePlugin } from '@soupmodmaker/core';
import { MyForgeGenerator } from './generators/ForgeGenerator';
import schema from './schema.json';

const myPlugin: FeaturePlugin = {
  id: 'custom.my-feature',
  name: 'My Feature',
  version: '1.0.0',
  dependencies: [],
  minCoreVersion: '0.1.0',

  schema: schema as any,

  generators: new Map([
    ['forge:1.20.4', new MyForgeGenerator('forge', '1.20.4')],
  ]),

  validate: (data) => ({
    valid: true,
  }),

  defaultData: () => ({
    id: 'my_feature',
    name: 'My Feature',
  }),
};

export default myPlugin;
```

### Step 6: Create Generator

Create `src/generators/ForgeGenerator.ts`:

```typescript
import { CodeGenerator, GenerationContext, GeneratedFile } from '@soupmodmaker/core';

export class MyForgeGenerator implements CodeGenerator {
  constructor(
    public platform: string,
    public version: string
  ) {}

  async generate(data: any, context: GenerationContext): Promise<GeneratedFile[]> {
    // Generate Java code, JSON files, etc.
    return [
      {
        path: 'src/main/java/.../MyClass.java',
        content: '// Generated Java code',
        type: 'java'
      }
    ];
  }
}
```

### Step 7: Build and Test

```bash
npm run build
# Plugin will be auto-discovered by the main app
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for objects
- Use meaningful variable names
- Add JSDoc comments for public APIs

```typescript
/**
 * Generate code for a feature
 * @param data - Feature data
 * @param context - Generation context
 * @returns Generated files
 */
async generate(data: any, context: GenerationContext): Promise<GeneratedFile[]> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Props should have TypeScript interfaces
- Use Material UI components
- Keep components focused and small

```typescript
interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ value, onChange }) => {
  // Component implementation
};
```

### File Organization

- One component per file
- Group related files in folders
- Use index.ts for exports
- Keep imports organized

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --workspace=core
```

### Writing Tests

Use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest';
import { PluginManager } from '../src/plugin-system/PluginManager';

describe('PluginManager', () => {
  it('should load plugins', async () => {
    const manager = new PluginManager();
    // Test implementation
  });
});
```

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/my-awesome-feature
```

### 2. Make Changes

- Write code
- Add tests
- Update documentation

### 3. Commit

Use conventional commits:

```bash
git commit -m "feat: add item creator plugin"
git commit -m "fix: resolve block texture loading issue"
git commit -m "docs: update plugin creation guide"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

### 4. Push and Create PR

```bash
git push origin feature/my-awesome-feature
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots for UI changes
- Reference to related issues
- Tests results

### 5. Code Review

- Address review comments
- Keep the PR focused
- Update as needed

## Adding Version Mappings

To add support for a new Minecraft version:

### 1. Create Mapping File

Create `generators/forge/1.18.2.yaml`:

```yaml
platform: forge
version: 1.18.2
loaderVersion: "40.0.0"
javaVersion: 17

capabilities:
  block:
    supported: true

mappings:
  block.material:
    values:
      STONE: "Block.Properties.of(Material.STONE)"
      # ... more mappings

imports:
  Block: ["net.minecraft.world.level.block.Block"]
  # ... more imports

namespaces:
  block: "net.minecraft.world.level.block"
```

### 2. Test Thoroughly

- Test code generation
- Verify imports are correct
- Test in actual Minecraft
- Document any issues

### 3. Update Documentation

- Add version to README
- Update version list
- Note any limitations

## Community Guidelines

- Be respectful and constructive
- Help others learn
- Share knowledge
- Give credit where due
- Follow the code of conduct

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Join our community chat

Thank you for contributing to SoupModMaker! 🎉
