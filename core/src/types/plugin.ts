/**
 * Core Plugin System Types
 * These interfaces define the contract for all SoupModMaker plugins
 */

import { JSONSchema7 } from 'json-schema';

/**
 * Base plugin interface - all plugins must implement this
 */
export interface FeaturePlugin<TData = any> {
  /** Unique plugin identifier (e.g., "core.block") */
  id: string;

  /** Human-readable plugin name */
  name: string;

  /** Semantic version */
  version: string;

  /** Plugin description */
  description?: string;

  /** Other plugin IDs this plugin depends on */
  dependencies: string[];

  /** Minimum SoupModMaker core version required */
  minCoreVersion: string;

  /** JSON Schema defining the data structure for this feature */
  schema: JSONSchema7;

  /** Code generators for different platform/version combinations */
  generators: Map<string, CodeGenerator<TData>>;

  /** Lifecycle hooks */
  lifecycle?: {
    onActivate?: () => void | Promise<void>;
    onDeactivate?: () => void | Promise<void>;
  };

  /** Validation function for feature data */
  validate?: (data: TData) => ValidationResult;

  /** Default data for new instances of this feature */
  defaultData?: () => TData;
}

/**
 * Code generator interface - transforms feature data into platform-specific code
 */
export interface CodeGenerator<TData = any> {
  /** Platform identifier (e.g., "forge", "fabric") */
  platform: string;

  /** Minecraft version (e.g., "1.20.4", "1.19.2") */
  version: string;

  /** Generate code files from feature data */
  generate(data: TData, context: GenerationContext): Promise<GeneratedFile[]>;

  /** Check if this generator supports a specific capability */
  supportsCapability?(capability: string): boolean;
}

/**
 * Context provided during code generation
 */
export interface GenerationContext {
  /** Project settings */
  project: {
    name: string;
    modId: string;
    namespace: string;
    version: string;
    authors: string[];
  };

  /** Target platform and version */
  target: {
    platform: string;
    version: string;
  };

  /** Version abstraction layer for mappings */
  versionMapper: VersionMapper;

  /** Template engine for rendering templates */
  templateEngine: TemplateEngine;

  /** Asset registry */
  assets: AssetRegistry;

  /** Other features in the project (for cross-references) */
  features: Map<string, any>;
}

/**
 * Generated code file
 */
export interface GeneratedFile {
  /** Relative path from project root */
  path: string;

  /** File content */
  content: string;

  /** File type hint */
  type: 'java' | 'json' | 'yaml' | 'properties' | 'gradle' | 'text';

  /** Whether to overwrite if exists */
  overwrite?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code?: string;
}

/**
 * Version mapper - handles version-specific mappings
 */
export interface VersionMapper {
  /** Get version-specific value for a concept */
  map(concept: string, value: any, platform: string, version: string): string;

  /** Check if a feature is supported in this version */
  isSupported(feature: string, platform: string, version: string): boolean;

  /** Get import statements for a class/package */
  getImports(className: string, platform: string, version: string): string[];

  /** Get namespace/package for a type */
  getNamespace(type: string, platform: string, version: string): string;
}

/**
 * Template engine interface
 */
export interface TemplateEngine {
  /** Render a template with data */
  render(templatePath: string, data: any): Promise<string>;

  /** Register a helper function */
  registerHelper(name: string, fn: (...args: any[]) => any): void;

  /** Register a partial template */
  registerPartial(name: string, template: string): void;
}

/**
 * Asset registry
 */
export interface AssetRegistry {
  /** Register an asset (texture, sound, etc.) */
  register(asset: Asset): void;

  /** Get asset by ID */
  get(id: string): Asset | undefined;

  /** Get all assets of a specific type */
  getByType(type: AssetType): Asset[];

  /** Get relative path for asset in generated project */
  getPath(id: string, platform: string): string;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  filePath: string;
  metadata?: Record<string, any>;
}

export type AssetType = 'texture' | 'model' | 'sound' | 'lang' | 'data' | 'other';

/**
 * Plugin manifest (plugin.json)
 */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  minCoreVersion?: string;
  entryPoint: string;
  uiComponents?: {
    editor?: string;
    sidebar?: string;
  };
}
