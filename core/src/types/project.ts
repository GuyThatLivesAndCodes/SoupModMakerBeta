/**
 * Project data structures
 */

import { MobData } from './mob';
import { EventData } from './event';

export interface Project {
  /** Unique project ID */
  id: string;

  /** Project metadata */
  metadata: ProjectMetadata;

  /** Target platforms and versions */
  targets: ProjectTarget[];

  /** Features/elements in this project */
  features: ProjectFeature[];

  /** Project settings */
  settings: ProjectSettings;

  /** Asset references */
  assets: string[];

  /** Creation and modification timestamps */
  timestamps: {
    created: number;
    modified: number;
  };

  /** Content data */
  content: ProjectContent;

  /** Plugin configuration */
  plugins: PluginConfiguration;
}

export interface ProjectMetadata {
  /** Display name of the mod/plugin */
  name: string;

  /** Mod ID (lowercase, no spaces) */
  modId: string;

  /** Namespace for resources */
  namespace: string;

  /** Version (semantic versioning) */
  version: string;

  /** Description */
  description?: string;

  /** Authors */
  authors: string[];

  /** License */
  license?: string;

  /** Homepage URL */
  homepage?: string;

  /** Source code URL */
  sourceUrl?: string;

  /** Issue tracker URL */
  issuesUrl?: string;
}

export interface ProjectTarget {
  /** Platform type */
  platform: 'forge' | 'fabric' | 'neoforge' | 'bukkit' | 'paper' | 'spigot';

  /** Minecraft version */
  minecraftVersion: string;

  /** Platform-specific loader version */
  loaderVersion?: string;

  /** Whether this is the primary target */
  primary: boolean;

  /** Platform-specific settings */
  settings?: Record<string, any>;
}

export interface ProjectFeature {
  /** Unique feature instance ID */
  id: string;

  /** Type of feature (plugin ID) */
  type: string;

  /** Display name */
  name: string;

  /** Feature-specific data */
  data: any;

  /** Whether this feature is enabled */
  enabled: boolean;

  /** Tags for organization */
  tags?: string[];
}

export interface ProjectSettings {
  /** Java version to target */
  javaVersion: 8 | 11 | 17 | 21;

  /** Build settings */
  build: {
    /** Output directory */
    outputDir: string;

    /** Whether to include sources jar */
    includeSources: boolean;

    /** Whether to obfuscate */
    obfuscate: boolean;
  };

  /** Development settings */
  development: {
    /** Enable hot reload if supported */
    hotReload: boolean;

    /** Debug mode */
    debug: boolean;
  };

  /** Export settings */
  export: {
    /** Auto-increment version on export */
    autoIncrementVersion: boolean;

    /** Include javadocs */
    includeJavadocs: boolean;
  };
}

/**
 * Project file format (.soup file)
 */
export interface ProjectFile {
  version: string; // SoupModMaker file format version
  project: Project;
}

/**
 * Project content (mobs, events, items, blocks, etc.)
 */
export interface ProjectContent {
  mobs: MobData[];
  events: EventData[];
  blocks: any[];  // BlockData - to be implemented
  items: any[];   // ItemData - to be implemented
  biomes: any[];  // BiomeData - to be implemented
  dimensions: any[]; // DimensionData - to be implemented
}

/**
 * Plugin configuration for the project
 */
export interface PluginConfiguration {
  /** List of enabled plugin IDs */
  enabled: string[];

  /** Plugin-specific settings */
  settings: Record<string, any>;
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  enabled: boolean;
  installed: boolean;
  dependencies?: string[];
  minAppVersion?: string;
  category?: PluginCategory;
  filePath?: string;
}

export type PluginCategory =
  | 'content'      // Mobs, items, blocks
  | 'world'        // Biomes, structures, dimensions
  | 'gameplay'     // Events, mechanics
  | 'tools'        // Utilities, generators
  | 'integration'; // Third-party integrations

/**
 * App-wide settings
 */
export interface AppSettings {
  // Appearance
  theme: 'light' | 'dark' | 'system';

  // Recent projects
  recentProjects: RecentProject[];
  lastOpenedProject?: string;

  // Plugins
  installedPlugins: PluginMetadata[];
  pluginDirectory: string;

  // Editor preferences
  autoSave: boolean;
  autoSaveInterval: number; // in seconds

  // Code generation
  defaultPlatform: 'forge' | 'fabric' | 'neoforge';
  defaultMinecraftVersion: string;
  javaPackagePrefix: string;
}

/**
 * Recent project entry
 */
export interface RecentProject {
  name: string;
  path: string;
  lastOpened: Date;
  minecraftVersion: string;
  platform: string;
}

/**
 * Default values
 */
export const DEFAULT_PROJECT_CONTENT: ProjectContent = {
  mobs: [],
  events: [],
  blocks: [],
  items: [],
  biomes: [],
  dimensions: [],
};

export const DEFAULT_PLUGIN_CONFIG: PluginConfiguration = {
  enabled: [],
  settings: {},
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  recentProjects: [],
  installedPlugins: [],
  pluginDirectory: '',
  autoSave: true,
  autoSaveInterval: 300, // 5 minutes
  defaultPlatform: 'forge',
  defaultMinecraftVersion: '1.20.4',
  javaPackagePrefix: 'com.example',
};
