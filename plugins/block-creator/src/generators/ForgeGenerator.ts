/**
 * Forge Block Generator
 * Generates Forge-specific block code
 */

import { CodeGenerator, GenerationContext, GeneratedFile } from '@soupmodmaker/core';
import { BlockData } from '../types';

export class ForgeBlockGenerator implements CodeGenerator<BlockData> {
  constructor(
    public platform: string,
    public version: string
  ) {}

  async generate(data: BlockData, context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    const { project, versionMapper } = context;

    // Package name
    const packageName = `com.${project.authors[0]?.toLowerCase().replace(/\s+/g, '') || 'example'}.${project.modId}`;
    const blockPackage = `${packageName}.block`;
    const itemPackage = `${packageName}.item`;

    // Class names
    const blockClassName = this.toPascalCase(data.id) + 'Block';
    const registryClassName = 'ModBlocks';

    // Generate block class
    files.push(await this.generateBlockClass(data, context, packageName, blockClassName));

    // Generate block registration
    files.push(await this.generateRegistration(data, context, packageName, blockClassName));

    // Generate blockstate JSON
    files.push(this.generateBlockstateJson(data, project.modId));

    // Generate block model JSON
    files.push(this.generateBlockModelJson(data, project.modId));

    // Generate item model JSON (if has item)
    if (data.hasItem) {
      files.push(this.generateItemModelJson(data, project.modId));
    }

    // Generate language file entry (we'll append to existing or create new)
    files.push(this.generateLangEntry(data, project.modId));

    return files;
  }

  private async generateBlockClass(
    data: BlockData,
    context: GenerationContext,
    packageName: string,
    className: string
  ): Promise<GeneratedFile> {
    const { versionMapper } = context;
    const imports: Set<string> = new Set();

    // Get required imports
    imports.add('net.minecraft.world.level.block.Block');
    imports.add('net.minecraft.world.level.block.state.BlockBehaviour');

    // Map material
    const materialCode = versionMapper.map('block.material', data.material, this.platform, this.version);

    // Map sound type
    const soundTypeCode = versionMapper.map('block.soundType', data.soundType, this.platform, this.version);

    // Build properties
    let properties = materialCode;

    if (data.hardness !== undefined) {
      properties += `.strength(${data.hardness}f, ${data.resistance}f)`;
    }

    if (data.soundType) {
      properties += `.sound(${soundTypeCode})`;
    }

    if (data.lightLevel > 0) {
      properties += `.lightLevel((state) -> ${data.lightLevel})`;
    }

    if (data.requiresTool) {
      // Already in material mapping for METAL, but can be explicit
      if (!data.material.includes('METAL')) {
        properties += `.requiresCorrectToolForDrops()`;
      }
    }

    const content = `package ${packageName}.block;

${Array.from(imports).map(imp => `import ${imp};`).join('\n')}

public class ${className} extends Block {
    public ${className}() {
        super(${properties});
    }
}
`;

    return {
      path: `src/main/java/${packageName.replace(/\./g, '/')}/block/${className}.java`,
      content,
      type: 'java'
    };
  }

  private async generateRegistration(
    data: BlockData,
    context: GenerationContext,
    packageName: string,
    blockClassName: string
  ): Promise<GeneratedFile> {
    const { project, versionMapper } = context;

    // This would ideally be merged into an existing ModBlocks class
    // For now, we'll generate a standalone registration snippet
    const content = `// Add to your ModBlocks class:

public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, "${project.modId}");

public static final RegistryObject<Block> ${this.toUpperSnakeCase(data.id)} =
    BLOCKS.register("${data.id}", ${blockClassName}::new);

${data.hasItem ? `// Add to your ModItems class:
public static final RegistryObject<Item> ${this.toUpperSnakeCase(data.id)} =
    ITEMS.register("${data.id}", () -> new BlockItem(ModBlocks.${this.toUpperSnakeCase(data.id)}.get(),
        new Item.Properties()));` : ''}
`;

    return {
      path: `REGISTRATION_${data.id.toUpperCase()}.txt`,
      content,
      type: 'text',
      overwrite: true
    };
  }

  private generateBlockstateJson(data: BlockData, modId: string): GeneratedFile {
    const content = JSON.stringify({
      variants: {
        '': {
          model: `${modId}:block/${data.id}`
        }
      }
    }, null, 2);

    return {
      path: `src/main/resources/assets/${modId}/blockstates/${data.id}.json`,
      content,
      type: 'json'
    };
  }

  private generateBlockModelJson(data: BlockData, modId: string): GeneratedFile {
    const textures: Record<string, string> = {};

    if (data.textures?.all) {
      textures.all = `${modId}:block/${data.textures.all}`;
    } else {
      if (data.textures?.top) textures.up = `${modId}:block/${data.textures.top}`;
      if (data.textures?.bottom) textures.down = `${modId}:block/${data.textures.bottom}`;
      if (data.textures?.north) textures.north = `${modId}:block/${data.textures.north}`;
      if (data.textures?.south) textures.south = `${modId}:block/${data.textures.south}`;
      if (data.textures?.east) textures.east = `${modId}:block/${data.textures.east}`;
      if (data.textures?.west) textures.west = `${modId}:block/${data.textures.west}`;
    }

    const content = JSON.stringify({
      parent: 'minecraft:block/cube_all',
      textures: Object.keys(textures).length > 0 ? textures : {
        all: `${modId}:block/${data.id}`
      }
    }, null, 2);

    return {
      path: `src/main/resources/assets/${modId}/models/block/${data.id}.json`,
      content,
      type: 'json'
    };
  }

  private generateItemModelJson(data: BlockData, modId: string): GeneratedFile {
    const content = JSON.stringify({
      parent: `${modId}:block/${data.id}`
    }, null, 2);

    return {
      path: `src/main/resources/assets/${modId}/models/item/${data.id}.json`,
      content,
      type: 'json'
    };
  }

  private generateLangEntry(data: BlockData, modId: string): GeneratedFile {
    const content = `"block.${modId}.${data.id}": "${data.displayName}"`;

    return {
      path: `LANG_ENTRY_${data.id}.txt`,
      content,
      type: 'text'
    };
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[_\s-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private toUpperSnakeCase(str: string): string {
    return str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '')
      .replace(/[_\s-]+/g, '_')
      .toUpperCase();
  }
}
