/**
 * Project data structures
 */

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
