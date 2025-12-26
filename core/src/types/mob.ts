/**
 * Mob/Entity data types for SoupModMaker
 */

export interface MobData {
  // Basic Info
  name: string;
  id: string;
  description?: string;

  // Entity Properties
  health: number;
  damage: number;
  speed: number;
  knockbackResistance: number;
  armor: number;
  armorToughness: number;
  followRange: number;

  // Behavior
  behavior: MobBehavior;
  aiGoals: AIGoal[];

  // Spawning
  spawnConditions: SpawnConditions;

  // Visual
  modelType: 'vanilla' | 'custom' | 'blockbench';
  modelPath?: string;
  texture: string;
  width: number;
  height: number;
  scale: number;

  // Drops
  drops: LootDrop[];
  experience: number;

  // Sounds
  sounds: MobSounds;

  // Misc
  immuneToFire: boolean;
  canSwim: boolean;
  canBreatheUnderwater: boolean;
  pushable: boolean;

  // Metadata
  createdAt: Date;
  modifiedAt: Date;
  author?: string;
  version: string;
}

export interface MobBehavior {
  type: 'passive' | 'neutral' | 'hostile';
  attackSpeed: number;
  attackRange: number;
  retreatDistance?: number;
  retaliate: boolean;
}

export interface AIGoal {
  priority: number;
  type: AIGoalType;
  config: Record<string, any>;
}

export type AIGoalType =
  | 'melee_attack'
  | 'ranged_attack'
  | 'avoid_entity'
  | 'follow_player'
  | 'wander'
  | 'look_at_player'
  | 'swim'
  | 'panic'
  | 'tempt'
  | 'breed'
  | 'follow_parent'
  | 'leap_at_target'
  | 'door_interact'
  | 'break_door'
  | 'flee_sun'
  | 'restrict_sun';

export interface SpawnConditions {
  biomes: string[];
  minLightLevel: number;
  maxLightLevel: number;
  minGroupSize: number;
  maxGroupSize: number;
  spawnWeight: number;
  spawnHeight: {
    min: number;
    max: number;
  };
  requiresSky: boolean;
  allowedBlocks: string[];
}

export interface LootDrop {
  item: string;
  minCount: number;
  maxCount: number;
  chance: number;
  lootingMultiplier: number;
  condition?: LootCondition;
}

export interface LootCondition {
  type: 'killed_by_player' | 'on_fire' | 'random_chance';
  value?: any;
}

export interface MobSounds {
  ambient?: string;
  hurt?: string;
  death?: string;
  step?: string;
  attack?: string;
}

/**
 * Default mob configuration
 */
export const DEFAULT_MOB: Partial<MobData> = {
  health: 20,
  damage: 2,
  speed: 0.25,
  knockbackResistance: 0,
  armor: 0,
  armorToughness: 0,
  followRange: 32,
  behavior: {
    type: 'passive',
    attackSpeed: 1.0,
    attackRange: 2.0,
    retaliate: false,
  },
  aiGoals: [
    { priority: 0, type: 'swim', config: {} },
    { priority: 1, type: 'wander', config: { speed: 1.0 } },
    { priority: 2, type: 'look_at_player', config: { range: 8.0 } },
  ],
  spawnConditions: {
    biomes: ['plains', 'forest'],
    minLightLevel: 0,
    maxLightLevel: 15,
    minGroupSize: 1,
    maxGroupSize: 4,
    spawnWeight: 10,
    spawnHeight: { min: 60, max: 255 },
    requiresSky: false,
    allowedBlocks: ['grass_block', 'dirt'],
  },
  modelType: 'vanilla',
  width: 0.6,
  height: 1.8,
  scale: 1.0,
  drops: [],
  experience: 5,
  sounds: {},
  immuneToFire: false,
  canSwim: true,
  canBreatheUnderwater: false,
  pushable: true,
  version: '1.0.0',
};
