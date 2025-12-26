/**
 * Event system data types for SoupModMaker
 */

export interface EventData {
  // Basic Info
  name: string;
  id: string;
  description?: string;

  // Event Configuration
  eventType: MinecraftEventType;
  conditions: EventCondition[];
  actions: EventAction[];

  // Settings
  priority: EventPriority;
  cancelEvent: boolean;

  // Metadata
  createdAt: Date;
  modifiedAt: Date;
  author?: string;
  version: string;
}

/**
 * Minecraft event types
 */
export type MinecraftEventType =
  // Block Events
  | 'block_break'
  | 'block_place'
  | 'block_interact'
  | 'block_explode'
  | 'block_burn'
  | 'block_growth'

  // Player Events
  | 'player_join'
  | 'player_quit'
  | 'player_respawn'
  | 'player_death'
  | 'player_interact'
  | 'player_interact_entity'
  | 'player_right_click'
  | 'player_left_click'
  | 'player_jump'
  | 'player_sneak'
  | 'player_sprint'

  // Entity Events
  | 'entity_spawn'
  | 'entity_death'
  | 'entity_damage'
  | 'entity_target'
  | 'entity_interact'

  // Item Events
  | 'item_pickup'
  | 'item_drop'
  | 'item_use'
  | 'item_craft'
  | 'item_smelt'

  // World Events
  | 'world_load'
  | 'world_save'
  | 'world_tick'
  | 'weather_change'
  | 'thunder_strike'

  // Server Events
  | 'server_start'
  | 'server_stop'
  | 'command_execute';

export type EventPriority = 'lowest' | 'low' | 'normal' | 'high' | 'highest';

/**
 * Conditions that must be met for the event to trigger
 */
export interface EventCondition {
  type: ConditionType;
  config: Record<string, any>;
  negate: boolean;
}

export type ConditionType =
  // Block Conditions
  | 'specific_block'
  | 'block_tag'
  | 'block_at_location'

  // Entity Conditions
  | 'specific_entity'
  | 'entity_type'
  | 'entity_has_tag'
  | 'entity_health'
  | 'entity_on_fire'

  // Player Conditions
  | 'player_name'
  | 'player_gamemode'
  | 'player_has_item'
  | 'player_level'
  | 'player_permission'
  | 'player_sneaking'
  | 'player_sprinting'

  // Item Conditions
  | 'specific_item'
  | 'item_tag'
  | 'item_enchanted'
  | 'item_count'

  // World Conditions
  | 'world_name'
  | 'dimension'
  | 'biome'
  | 'weather'
  | 'time_of_day'
  | 'light_level'

  // Random
  | 'random_chance'
  | 'cooldown';

/**
 * Actions to execute when conditions are met
 */
export interface EventAction {
  type: ActionType;
  config: Record<string, any>;
  delay?: number;
}

export type ActionType =
  // World Actions
  | 'explosion'
  | 'lightning'
  | 'set_block'
  | 'break_block'
  | 'place_block'
  | 'set_weather'
  | 'set_time'

  // Entity Actions
  | 'spawn_entity'
  | 'kill_entity'
  | 'damage_entity'
  | 'heal_entity'
  | 'apply_effect'
  | 'remove_effect'
  | 'teleport_entity'
  | 'set_on_fire'

  // Player Actions
  | 'give_item'
  | 'remove_item'
  | 'set_gamemode'
  | 'give_experience'
  | 'set_health'
  | 'set_food'
  | 'send_message'
  | 'send_title'
  | 'play_sound'
  | 'spawn_particle'

  // Command Actions
  | 'run_command'
  | 'run_command_as_player'
  | 'run_console_command'

  // Advanced
  | 'execute_function'
  | 'set_variable'
  | 'conditional_action';

/**
 * Common event configurations
 */

// Block Break Event with Explosion
export interface BlockBreakExplosionEvent extends EventData {
  eventType: 'block_break';
  conditions: Array<{
    type: 'specific_block';
    config: { block: string };
    negate: false;
  }>;
  actions: Array<{
    type: 'explosion';
    config: {
      power: number;
      fire: boolean;
      breakBlocks: boolean;
    };
  }>;
}

// Player Join Welcome Event
export interface PlayerJoinWelcomeEvent extends EventData {
  eventType: 'player_join';
  actions: Array<{
    type: 'send_message';
    config: { message: string };
  } | {
    type: 'give_item';
    config: { item: string; count: number };
  }>;
}

/**
 * Action configurations
 */

export interface ExplosionActionConfig {
  power: number;
  fire: boolean;
  breakBlocks: boolean;
  damageEntities: boolean;
  x?: number;
  y?: number;
  z?: number;
  useEventLocation: boolean;
}

export interface SpawnEntityActionConfig {
  entityType: string;
  count: number;
  x?: number;
  y?: number;
  z?: number;
  useEventLocation: boolean;
  randomOffset: boolean;
  offsetRange?: number;
}

export interface GiveItemActionConfig {
  item: string;
  count: number;
  nbt?: string;
  enchantments?: Array<{
    id: string;
    level: number;
  }>;
}

export interface SendMessageActionConfig {
  message: string;
  type: 'chat' | 'actionbar' | 'title';
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface PlaySoundActionConfig {
  sound: string;
  volume: number;
  pitch: number;
  category: 'master' | 'music' | 'record' | 'weather' | 'block' | 'hostile' | 'neutral' | 'player' | 'ambient' | 'voice';
}

export interface ApplyEffectActionConfig {
  effect: string;
  duration: number;
  amplifier: number;
  showParticles: boolean;
  showIcon: boolean;
}

/**
 * Condition configurations
 */

export interface SpecificBlockConditionConfig {
  block: string;
  checkNBT?: boolean;
  nbt?: string;
}

export interface RandomChanceConditionConfig {
  chance: number; // 0.0 to 1.0
}

export interface PlayerHasItemConditionConfig {
  item: string;
  minCount?: number;
  checkNBT?: boolean;
  nbt?: string;
  consumeItem?: boolean;
}

/**
 * Default event configuration
 */
export const DEFAULT_EVENT: Partial<EventData> = {
  eventType: 'block_break',
  conditions: [],
  actions: [],
  priority: 'normal',
  cancelEvent: false,
  version: '1.0.0',
};

/**
 * Event templates for quick start
 */
export const EVENT_TEMPLATES: Record<string, Partial<EventData>> = {
  blockBreakExplosion: {
    name: 'Block Break Explosion',
    description: 'Create an explosion when a specific block is broken',
    eventType: 'block_break',
    conditions: [
      {
        type: 'specific_block',
        config: { block: 'minecraft:diamond_ore' },
        negate: false,
      },
    ],
    actions: [
      {
        type: 'explosion',
        config: {
          power: 4,
          fire: false,
          breakBlocks: true,
          damageEntities: true,
          useEventLocation: true,
        },
      },
    ],
  },

  playerJoinWelcome: {
    name: 'Player Join Welcome',
    description: 'Welcome message and starter items for new players',
    eventType: 'player_join',
    conditions: [],
    actions: [
      {
        type: 'send_message',
        config: {
          message: 'Welcome to the server!',
          type: 'chat',
          color: 'gold',
          bold: true,
        },
      },
      {
        type: 'give_item',
        config: {
          item: 'minecraft:bread',
          count: 16,
        },
        delay: 1000,
      },
    ],
  },

  lightningOnDeath: {
    name: 'Lightning on Death',
    description: 'Strike lightning at player location when they die',
    eventType: 'player_death',
    conditions: [],
    actions: [
      {
        type: 'lightning',
        config: {
          useEventLocation: true,
          damage: false,
        },
      },
      {
        type: 'send_message',
        config: {
          message: 'The heavens strike down!',
          type: 'title',
          color: 'red',
        },
      },
    ],
  },
};
