/**
 * SoupModMaker Core
 * Plugin system and version abstraction layer
 */

// Types
export * from './types';

// Plugin System
export { PluginManager } from './plugin-system/PluginManager';

// Version Abstraction
export { VersionMapper } from './version-abstraction/VersionMapper';
export { TemplateEngine } from './version-abstraction/TemplateEngine';

// Data
export { AssetRegistry } from './data/AssetRegistry';
