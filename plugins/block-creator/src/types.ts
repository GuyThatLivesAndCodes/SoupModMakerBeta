/**
 * Block plugin data types
 */

export interface BlockData {
  id: string;
  displayName: string;
  material: 'STONE' | 'DIRT' | 'WOOD' | 'METAL' | 'GLASS' | 'ICE';
  hardness: number;
  resistance: number;
  lightLevel: number;
  soundType: 'STONE' | 'WOOD' | 'GRAVEL' | 'GRASS' | 'METAL' | 'GLASS' | 'WOOL' | 'SAND';
  hasItem: boolean;
  creativeTab: string;
  requiresTool: boolean;
  toolType?: 'PICKAXE' | 'AXE' | 'SHOVEL' | 'HOE' | 'SWORD' | 'SHEARS';
  toolTier?: 'WOOD' | 'STONE' | 'IRON' | 'GOLD' | 'DIAMOND' | 'NETHERITE';
  textures?: {
    all?: string;
    top?: string;
    bottom?: string;
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
  drops?: {
    type: 'SELF' | 'CUSTOM' | 'NOTHING';
    itemId?: string;
    minCount?: number;
    maxCount?: number;
  };
}
