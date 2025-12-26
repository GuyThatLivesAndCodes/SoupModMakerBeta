/**
 * Fabric Block Generator
 * Generates Fabric-specific block code
 */

import { CodeGenerator, GenerationContext, GeneratedFile } from '@soupmodmaker/core';
import { BlockData } from '../types';

export class FabricBlockGenerator implements CodeGenerator<BlockData> {
  constructor(
    public platform: string,
    public version: string
  ) {}

  async generate(data: BlockData, context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    const { project } = context;

    // Package name
    const packageName = `com.${project.authors[0]?.toLowerCase().replace(/\s+/g, '') || 'example'}.${project.modId}`;

    // Class names
    const blockClassName = this.toPascalCase(data.id) + 'Block';

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

    // Generate language file entry
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
    imports.add('net.minecraft.block.Block');
    imports.add('net.fabricmc.fabric.api.object.builder.v1.block.FabricBlockSettings');

    // Map material
    const materialCode = versionMapper.map('block.material', data.material, this.platform, this.version);

    // Map sound type
    const soundTypeCode = versionMapper.map('block.soundType', data.soundType, this.platform, this.version);

    // Build settings
    let settings = materialCode;

    if (data.hardness !== undefined) {
      settings += `.strength(${data.hardness}f, ${data.resistance}f)`;
    }

    if (data.soundType) {
      settings += `.sounds(${soundTypeCode})`;
    }

    if (data.lightLevel > 0) {
      settings += `.luminance(${data.lightLevel})`;
    }

    const content = `package ${packageName}.block;

${Array.from(imports).map(imp => `import ${imp};`).join('\n')}

public class ${className} extends Block {
    public ${className}() {
        super(${settings});
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
    const { project } = context;

    // Fabric uses a different registration approach
    const content = `// Add to your mod initializer:

public static final Block ${this.toUpperSnakeCase(data.id)} =
    Registry.register(Registries.BLOCK, new Identifier("${project.modId}", "${data.id}"),
        new ${blockClassName}());

${data.hasItem ? `public static final Item ${this.toUpperSnakeCase(data.id)}_ITEM =
    Registry.register(Registries.ITEM, new Identifier("${project.modId}", "${data.id}"),
        new BlockItem(${this.toUpperSnakeCase(data.id)}, new Item.Settings()));` : ''}
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
