/**
 * Plugin Manager - Core of the plugin system
 * Handles plugin discovery, loading, and lifecycle management
 */

import { FeaturePlugin, PluginManifest, ValidationResult } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class PluginManager {
  private plugins: Map<string, FeaturePlugin> = new Map();
  private manifests: Map<string, PluginManifest> = new Map();
  private activatedPlugins: Set<string> = new Set();
  private pluginDirectories: string[] = [];

  constructor(pluginDirectories: string[] = []) {
    this.pluginDirectories = pluginDirectories;
  }

  /**
   * Add a plugin directory to scan
   */
  addPluginDirectory(directory: string): void {
    if (!this.pluginDirectories.includes(directory)) {
      this.pluginDirectories.push(directory);
    }
  }

  /**
   * Discover all plugins in registered directories
   */
  async discoverPlugins(): Promise<PluginManifest[]> {
    const discovered: PluginManifest[] = [];

    for (const directory of this.pluginDirectories) {
      try {
        const entries = await fs.readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const manifestPath = path.join(directory, entry.name, 'plugin.json');

            try {
              const manifestContent = await fs.readFile(manifestPath, 'utf-8');
              const manifest: PluginManifest = JSON.parse(manifestContent);

              // Validate manifest
              if (this.validateManifest(manifest)) {
                this.manifests.set(manifest.id, manifest);
                discovered.push(manifest);
              }
            } catch (error) {
              console.warn(`Failed to load plugin manifest from ${manifestPath}:`, error);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to scan plugin directory ${directory}:`, error);
      }
    }

    return discovered;
  }

  /**
   * Load a plugin by ID
   */
  async loadPlugin(pluginId: string): Promise<FeaturePlugin | null> {
    // Check if already loaded
    if (this.plugins.has(pluginId)) {
      return this.plugins.get(pluginId)!;
    }

    const manifest = this.manifests.get(pluginId);
    if (!manifest) {
      console.error(`Plugin manifest not found for: ${pluginId}`);
      return null;
    }

    // Load dependencies first
    if (manifest.dependencies) {
      for (const depId of manifest.dependencies) {
        if (!this.plugins.has(depId)) {
          await this.loadPlugin(depId);
        }
      }
    }

    // Find plugin directory
    let pluginDir: string | null = null;
    for (const directory of this.pluginDirectories) {
      const candidatePath = path.join(directory, pluginId);
      try {
        await fs.access(candidatePath);
        pluginDir = candidatePath;
        break;
      } catch {
        // Directory doesn't exist, continue
      }
    }

    if (!pluginDir) {
      console.error(`Plugin directory not found for: ${pluginId}`);
      return null;
    }

    try {
      // Load the plugin module
      const entryPoint = path.join(pluginDir, manifest.entryPoint);
      const pluginModule = await import(entryPoint);
      const plugin: FeaturePlugin = pluginModule.default || pluginModule;

      // Validate plugin implements interface
      if (!this.validatePlugin(plugin)) {
        console.error(`Plugin ${pluginId} does not implement FeaturePlugin interface`);
        return null;
      }

      // Register plugin
      this.plugins.set(pluginId, plugin);
      console.log(`Loaded plugin: ${plugin.name} (${plugin.version})`);

      return plugin;
    } catch (error) {
      console.error(`Failed to load plugin ${pluginId}:`, error);
      return null;
    }
  }

  /**
   * Load all discovered plugins
   */
  async loadAllPlugins(): Promise<void> {
    const manifestIds = Array.from(this.manifests.keys());

    // Sort by dependencies (topological sort)
    const sorted = this.topologicalSort(manifestIds);

    for (const pluginId of sorted) {
      await this.loadPlugin(pluginId);
    }
  }

  /**
   * Activate a plugin
   */
  async activatePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`Cannot activate plugin ${pluginId}: not loaded`);
      return false;
    }

    if (this.activatedPlugins.has(pluginId)) {
      return true; // Already activated
    }

    // Activate dependencies first
    for (const depId of plugin.dependencies) {
      if (!this.activatedPlugins.has(depId)) {
        const success = await this.activatePlugin(depId);
        if (!success) {
          console.error(`Failed to activate dependency ${depId} for plugin ${pluginId}`);
          return false;
        }
      }
    }

    // Call lifecycle hook
    if (plugin.lifecycle?.onActivate) {
      try {
        await plugin.lifecycle.onActivate();
      } catch (error) {
        console.error(`Error activating plugin ${pluginId}:`, error);
        return false;
      }
    }

    this.activatedPlugins.add(pluginId);
    console.log(`Activated plugin: ${plugin.name}`);
    return true;
  }

  /**
   * Activate all loaded plugins
   */
  async activateAllPlugins(): Promise<void> {
    for (const pluginId of this.plugins.keys()) {
      await this.activatePlugin(pluginId);
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivatePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    if (!this.activatedPlugins.has(pluginId)) {
      return true; // Already deactivated
    }

    // Check if any activated plugins depend on this
    for (const [otherId, otherPlugin] of this.plugins) {
      if (
        this.activatedPlugins.has(otherId) &&
        otherPlugin.dependencies.includes(pluginId)
      ) {
        console.error(
          `Cannot deactivate plugin ${pluginId}: ${otherId} depends on it`
        );
        return false;
      }
    }

    // Call lifecycle hook
    if (plugin.lifecycle?.onDeactivate) {
      try {
        await plugin.lifecycle.onDeactivate();
      } catch (error) {
        console.error(`Error deactivating plugin ${pluginId}:`, error);
        return false;
      }
    }

    this.activatedPlugins.delete(pluginId);
    console.log(`Deactivated plugin: ${plugin.name}`);
    return true;
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(pluginId: string): FeaturePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): FeaturePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all activated plugins
   */
  getActivatedPlugins(): FeaturePlugin[] {
    return Array.from(this.activatedPlugins)
      .map((id) => this.plugins.get(id))
      .filter((p): p is FeaturePlugin => p !== undefined);
  }

  /**
   * Check if a plugin is activated
   */
  isActivated(pluginId: string): boolean {
    return this.activatedPlugins.has(pluginId);
  }

  /**
   * Validate plugin manifest
   */
  private validateManifest(manifest: PluginManifest): boolean {
    if (!manifest.id || !manifest.name || !manifest.version || !manifest.entryPoint) {
      console.error('Invalid plugin manifest: missing required fields');
      return false;
    }

    // Validate semantic version
    const versionRegex = /^\d+\.\d+\.\d+/;
    if (!versionRegex.test(manifest.version)) {
      console.error(`Invalid plugin version: ${manifest.version}`);
      return false;
    }

    return true;
  }

  /**
   * Validate plugin implementation
   */
  private validatePlugin(plugin: any): plugin is FeaturePlugin {
    return (
      typeof plugin === 'object' &&
      typeof plugin.id === 'string' &&
      typeof plugin.name === 'string' &&
      typeof plugin.version === 'string' &&
      Array.isArray(plugin.dependencies) &&
      typeof plugin.schema === 'object' &&
      plugin.generators instanceof Map
    );
  }

  /**
   * Topological sort for dependency resolution
   */
  private topologicalSort(pluginIds: string[]): string[] {
    const visited = new Set<string>();
    const sorted: string[] = [];

    const visit = (id: string) => {
      if (visited.has(id)) return;

      const manifest = this.manifests.get(id);
      if (manifest?.dependencies) {
        for (const depId of manifest.dependencies) {
          if (pluginIds.includes(depId)) {
            visit(depId);
          }
        }
      }

      visited.add(id);
      sorted.push(id);
    };

    for (const id of pluginIds) {
      visit(id);
    }

    return sorted;
  }
}
