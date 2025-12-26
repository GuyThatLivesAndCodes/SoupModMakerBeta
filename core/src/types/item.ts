/**
 * Item-related type definitions
 */

export type ItemType = 'basic' | 'tool' | 'armor' | 'food' | 'fuel' | 'weapon';
export type ToolType = 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'custom';
export type ArmorType = 'helmet' | 'chestplate' | 'leggings' | 'boots';
export type ToolTier = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'custom';

/**
 * Tool properties for tool items
 */
export interface ToolProperties {
  /** Tool type */
  type: ToolType;

  /** Tool tier/material */
  tier: ToolTier;

  /** Custom tier properties (only for custom tier) */
  customTier?: {
    durability: number;
    miningSpeed: number;
    attackDamage: number;
    enchantability: number;
    repairMaterial?: string;
  };

  /** Attack damage bonus */
  attackDamage: number;

  /** Attack speed */
  attackSpeed: number;

  /** Durability/Max uses */
  durability: number;

  /** Mining level (0=wood, 1=stone, 2=iron, 3=diamond, 4=netherite) */
  miningLevel: number;

  /** Mining speed multiplier */
  miningSpeed: number;

  /** Enchantability */
  enchantability: number;
}

/**
 * Armor properties for armor items
 */
export interface ArmorProperties {
  /** Armor slot */
  slot: ArmorType;

  /** Armor material */
  material: 'leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'custom';

  /** Custom material properties */
  customMaterial?: {
    durability: number;
    enchantability: number;
    toughness: number;
    knockbackResistance: number;
    repairMaterial?: string;
  };

  /** Defense points */
  defense: number;

  /** Toughness */
  toughness: number;

  /** Knockback resistance */
  knockbackResistance: number;

  /** Durability */
  durability: number;

  /** Enchantability */
  enchantability: number;
}

/**
 * Food properties for consumable items
 */
export interface FoodProperties {
  /** Hunger points restored */
  nutrition: number;

  /** Saturation modifier */
  saturation: number;

  /** Can always eat (even when full) */
  alwaysEdible: boolean;

  /** Fast eating (like dried kelp) */
  fastFood: boolean;

  /** Eating time in ticks */
  eatingTime: number;

  /** Effects applied when eaten */
  effects: Array<{
    effect: string;
    duration: number;
    amplifier: number;
    probability: number;
  }>;

  /** Is this item meat? */
  isMeat: boolean;
}

/**
 * Fuel properties for burnable items
 */
export interface FuelProperties {
  /** Burn time in ticks (200 ticks = 1 item smelted) */
  burnTime: number;
}

/**
 * Item rarity
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic';

/**
 * Main item data structure
 */
export interface ItemData {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Description/lore */
  description?: string;

  /** Item type */
  type: ItemType;

  /** Tool properties (if tool/weapon) */
  toolProperties?: ToolProperties;

  /** Armor properties (if armor) */
  armorProperties?: ArmorProperties;

  /** Food properties (if food) */
  foodProperties?: FoodProperties;

  /** Fuel properties (if fuel) */
  fuelProperties?: FuelProperties;

  /** Max stack size */
  maxStackSize: number;

  /** Max damage/durability (0 = unstackable/tools) */
  maxDamage: number;

  /** Rarity */
  rarity: ItemRarity;

  /** Is fireproof */
  fireproof: boolean;

  /** Creative tabs */
  creativeTabs: string[];

  /** Texture path */
  texture?: string;

  /** Custom properties */
  customProperties?: {
    /** Glow in inventory */
    hasGlint: boolean;

    /** Can be repaired in anvil */
    repairable: boolean;

    /** Repair material */
    repairMaterial?: string;

    /** Custom tooltip lines */
    tooltip: string[];

    /** NBT data */
    nbt?: Record<string, any>;
  };

  /** Timestamps */
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Default item data
 */
export const DEFAULT_ITEM: Partial<ItemData> = {
  type: 'basic',
  maxStackSize: 64,
  maxDamage: 0,
  rarity: 'common',
  fireproof: false,
  creativeTabs: ['misc'],
  customProperties: {
    hasGlint: false,
    repairable: true,
    tooltip: [],
  },
};

/**
 * Default tool properties
 */
export const DEFAULT_TOOL_PROPERTIES: ToolProperties = {
  type: 'pickaxe',
  tier: 'iron',
  attackDamage: 2,
  attackSpeed: -2.8,
  durability: 250,
  miningLevel: 2,
  miningSpeed: 6.0,
  enchantability: 14,
};

/**
 * Default armor properties
 */
export const DEFAULT_ARMOR_PROPERTIES: ArmorProperties = {
  slot: 'helmet',
  material: 'iron',
  defense: 2,
  toughness: 0,
  knockbackResistance: 0,
  durability: 165,
  enchantability: 9,
};

/**
 * Default food properties
 */
export const DEFAULT_FOOD_PROPERTIES: FoodProperties = {
  nutrition: 4,
  saturation: 0.3,
  alwaysEdible: false,
  fastFood: false,
  eatingTime: 32,
  effects: [],
  isMeat: false,
};

/**
 * Tool tier presets
 */
export const TOOL_TIERS: Record<ToolTier, Partial<ToolProperties>> = {
  wood: {
    durability: 59,
    miningSpeed: 2.0,
    attackDamage: 0,
    enchantability: 15,
    miningLevel: 0,
  },
  stone: {
    durability: 131,
    miningSpeed: 4.0,
    attackDamage: 1,
    enchantability: 5,
    miningLevel: 1,
  },
  iron: {
    durability: 250,
    miningSpeed: 6.0,
    attackDamage: 2,
    enchantability: 14,
    miningLevel: 2,
  },
  gold: {
    durability: 32,
    miningSpeed: 12.0,
    attackDamage: 0,
    enchantability: 22,
    miningLevel: 0,
  },
  diamond: {
    durability: 1561,
    miningSpeed: 8.0,
    attackDamage: 3,
    enchantability: 10,
    miningLevel: 3,
  },
  netherite: {
    durability: 2031,
    miningSpeed: 9.0,
    attackDamage: 4,
    enchantability: 15,
    miningLevel: 4,
  },
  custom: {
    durability: 250,
    miningSpeed: 6.0,
    attackDamage: 2,
    enchantability: 14,
    miningLevel: 2,
  },
};

/**
 * Armor material presets
 */
export const ARMOR_MATERIALS: Record<string, { helmet: number; chestplate: number; leggings: number; boots: number; durability: number; enchantability: number; toughness: number }> = {
  leather: {
    helmet: 1,
    chestplate: 3,
    leggings: 2,
    boots: 1,
    durability: 55,
    enchantability: 15,
    toughness: 0,
  },
  chainmail: {
    helmet: 2,
    chestplate: 5,
    leggings: 4,
    boots: 1,
    durability: 165,
    enchantability: 12,
    toughness: 0,
  },
  iron: {
    helmet: 2,
    chestplate: 6,
    leggings: 5,
    boots: 2,
    durability: 165,
    enchantability: 9,
    toughness: 0,
  },
  gold: {
    helmet: 2,
    chestplate: 5,
    leggings: 3,
    boots: 1,
    durability: 77,
    enchantability: 25,
    toughness: 0,
  },
  diamond: {
    helmet: 3,
    chestplate: 8,
    leggings: 6,
    boots: 3,
    durability: 363,
    enchantability: 10,
    toughness: 2,
  },
  netherite: {
    helmet: 3,
    chestplate: 8,
    leggings: 6,
    boots: 3,
    durability: 407,
    enchantability: 15,
    toughness: 3,
  },
};
