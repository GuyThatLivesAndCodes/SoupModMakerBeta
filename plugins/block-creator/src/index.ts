/**
 * Block Creator Plugin
 * Main plugin entry point
 */

import { FeaturePlugin } from '@soupmodmaker/core';
import { BlockData } from './types';
import { ForgeBlockGenerator } from './generators/ForgeGenerator';
import { FabricBlockGenerator } from './generators/FabricGenerator';
import blockSchema from './schema.json';

const blockPlugin: FeaturePlugin<BlockData> = {
  id: 'core.block',
  name: 'Block Creator',
  version: '0.1.0',
  description: 'Create custom blocks for Minecraft mods',
  dependencies: [],
  minCoreVersion: '0.1.0',

  schema: blockSchema as any,

  generators: new Map([
    ['forge:1.20.4', new ForgeBlockGenerator('forge', '1.20.4')],
    ['forge:1.19.2', new ForgeBlockGenerator('forge', '1.19.2')],
    ['fabric:1.20.4', new FabricBlockGenerator('fabric', '1.20.4')],
    ['fabric:1.19.2', new FabricBlockGenerator('fabric', '1.19.2')],
  ]),

  lifecycle: {
    onActivate: async () => {
      console.log('Block Creator plugin activated');
    },
    onDeactivate: async () => {
      console.log('Block Creator plugin deactivated');
    },
  },

  validate: (data: BlockData) => {
    const errors: Array<{ field: string; message: string }> = [];

    if (!data.id || !/^[a-z0-9_]+$/.test(data.id)) {
      errors.push({
        field: 'id',
        message: 'ID must be lowercase letters, numbers, and underscores only',
      });
    }

    if (!data.displayName) {
      errors.push({
        field: 'displayName',
        message: 'Display name is required',
      });
    }

    if (data.hardness < 0 || data.hardness > 50) {
      errors.push({
        field: 'hardness',
        message: 'Hardness must be between 0 and 50',
      });
    }

    if (data.lightLevel < 0 || data.lightLevel > 15) {
      errors.push({
        field: 'lightLevel',
        message: 'Light level must be between 0 and 15',
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },

  defaultData: () => ({
    id: 'my_block',
    displayName: 'My Block',
    material: 'STONE',
    hardness: 1.5,
    resistance: 6.0,
    lightLevel: 0,
    soundType: 'STONE',
    hasItem: true,
    creativeTab: 'BUILDING_BLOCKS',
    requiresTool: false,
  }),
};

export default blockPlugin;
