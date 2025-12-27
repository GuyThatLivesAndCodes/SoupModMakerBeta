/**
 * Recipe-related type definitions
 */

export type RecipeType =
  | 'crafting_shaped'
  | 'crafting_shapeless'
  | 'smelting'
  | 'blasting'
  | 'smoking'
  | 'campfire_cooking'
  | 'smithing'
  | 'stonecutting';

/**
 * Recipe ingredient (can be item ID or tag)
 */
export interface RecipeIngredient {
  /** Item ID or tag (e.g., "minecraft:iron_ingot" or "#minecraft:logs") */
  item: string;

  /** Is this a tag? */
  isTag: boolean;

  /** Count required */
  count: number;
}

/**
 * Recipe result
 */
export interface RecipeResult {
  /** Output item ID */
  item: string;

  /** Output count */
  count: number;
}

/**
 * Shaped crafting pattern (3x3 grid)
 */
export interface ShapedCraftingPattern {
  /** Pattern rows (each string is one row, each character is one slot) */
  pattern: [string, string, string];

  /** Map of characters to ingredients */
  key: Record<string, RecipeIngredient>;
}

/**
 * Shapeless crafting ingredients
 */
export interface ShapelessCraftingIngredients {
  /** List of ingredients (order doesn't matter) */
  ingredients: RecipeIngredient[];
}

/**
 * Cooking recipe properties (furnace, blast furnace, smoker, campfire)
 */
export interface CookingProperties {
  /** Input ingredient */
  ingredient: RecipeIngredient;

  /** Cooking time in ticks (200 ticks = 10 seconds) */
  cookingTime: number;

  /** Experience gained */
  experience: number;
}

/**
 * Smithing recipe properties
 */
export interface SmithingProperties {
  /** Template item (e.g., netherite upgrade template) */
  template: RecipeIngredient;

  /** Base item to upgrade */
  base: RecipeIngredient;

  /** Addition item (e.g., netherite ingot) */
  addition: RecipeIngredient;
}

/**
 * Stonecutting recipe properties
 */
export interface StonecuttingProperties {
  /** Input ingredient */
  ingredient: RecipeIngredient;

  /** Output count (usually more than 1) */
  count: number;
}

/**
 * Main recipe data structure
 */
export interface RecipeData {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Description */
  description?: string;

  /** Recipe type */
  type: RecipeType;

  /** Result item */
  result: RecipeResult;

  /** Shaped crafting pattern (if type is crafting_shaped) */
  shapedPattern?: ShapedCraftingPattern;

  /** Shapeless ingredients (if type is crafting_shapeless) */
  shapelessIngredients?: ShapelessCraftingIngredients;

  /** Cooking properties (if type is smelting/blasting/smoking/campfire) */
  cookingProperties?: CookingProperties;

  /** Smithing properties (if type is smithing) */
  smithingProperties?: SmithingProperties;

  /** Stonecutting properties (if type is stonecutting) */
  stonecuttingProperties?: StonecuttingProperties;

  /** Recipe group (for organization in recipe book) */
  group?: string;

  /** Custom properties */
  customProperties?: {
    /** Show notification when recipe is unlocked */
    showNotification: boolean;

    /** Recipe unlock requirements (advancement IDs) */
    unlockRequirements: string[];
  };

  /** Timestamps */
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Default recipe data
 */
export const DEFAULT_RECIPE: Partial<RecipeData> = {
  type: 'crafting_shaped',
  result: {
    item: '',
    count: 1,
  },
  customProperties: {
    showNotification: false,
    unlockRequirements: [],
  },
};

/**
 * Default shaped pattern (empty 3x3 grid)
 */
export const DEFAULT_SHAPED_PATTERN: ShapedCraftingPattern = {
  pattern: ['   ', '   ', '   '],
  key: {},
};

/**
 * Default cooking properties
 */
export const DEFAULT_COOKING_PROPERTIES: CookingProperties = {
  ingredient: {
    item: '',
    isTag: false,
    count: 1,
  },
  cookingTime: 200, // 10 seconds
  experience: 0.1,
};

/**
 * Default smithing properties
 */
export const DEFAULT_SMITHING_PROPERTIES: SmithingProperties = {
  template: {
    item: 'minecraft:netherite_upgrade_smithing_template',
    isTag: false,
    count: 1,
  },
  base: {
    item: '',
    isTag: false,
    count: 1,
  },
  addition: {
    item: '',
    isTag: false,
    count: 1,
  },
};

/**
 * Recipe type display names
 */
export const RECIPE_TYPE_NAMES: Record<RecipeType, string> = {
  crafting_shaped: 'Shaped Crafting',
  crafting_shapeless: 'Shapeless Crafting',
  smelting: 'Furnace Smelting',
  blasting: 'Blast Furnace',
  smoking: 'Smoker',
  campfire_cooking: 'Campfire Cooking',
  smithing: 'Smithing Table',
  stonecutting: 'Stonecutter',
};

/**
 * Common vanilla items for quick selection
 */
export const COMMON_ITEMS = {
  materials: [
    'minecraft:stick',
    'minecraft:iron_ingot',
    'minecraft:gold_ingot',
    'minecraft:diamond',
    'minecraft:emerald',
    'minecraft:netherite_ingot',
    'minecraft:string',
    'minecraft:leather',
    'minecraft:paper',
  ],
  blocks: [
    'minecraft:cobblestone',
    'minecraft:stone',
    'minecraft:oak_planks',
    'minecraft:iron_block',
    'minecraft:gold_block',
    'minecraft:diamond_block',
  ],
  ores: [
    'minecraft:iron_ore',
    'minecraft:gold_ore',
    'minecraft:diamond_ore',
    'minecraft:coal_ore',
    'minecraft:copper_ore',
  ],
  food: [
    'minecraft:wheat',
    'minecraft:sugar',
    'minecraft:egg',
    'minecraft:milk_bucket',
    'minecraft:cocoa_beans',
  ],
};

/**
 * Common item tags
 */
export const COMMON_TAGS = [
  '#minecraft:logs',
  '#minecraft:planks',
  '#minecraft:wool',
  '#minecraft:stone_crafting_materials',
  '#forge:ingots/iron',
  '#forge:ingots/gold',
  '#forge:gems/diamond',
];
