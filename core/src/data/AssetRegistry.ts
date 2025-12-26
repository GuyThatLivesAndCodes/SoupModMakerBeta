/**
 * Asset Registry - Manages project assets (textures, sounds, models, etc.)
 */

import { Asset, AssetType } from '../types';
import * as path from 'path';

export class AssetRegistry {
  private assets: Map<string, Asset> = new Map();
  private assetsByType: Map<AssetType, Set<string>> = new Map();

  constructor() {
    // Initialize type sets
    const types: AssetType[] = ['texture', 'model', 'sound', 'lang', 'data', 'other'];
    for (const type of types) {
      this.assetsByType.set(type, new Set());
    }
  }

  /**
   * Register an asset
   */
  register(asset: Asset): void {
    // Add to main registry
    this.assets.set(asset.id, asset);

    // Add to type index
    const typeSet = this.assetsByType.get(asset.type);
    if (typeSet) {
      typeSet.add(asset.id);
    }

    console.log(`Registered asset: ${asset.id} (${asset.type})`);
  }

  /**
   * Unregister an asset
   */
  unregister(id: string): boolean {
    const asset = this.assets.get(id);
    if (!asset) {
      return false;
    }

    // Remove from main registry
    this.assets.delete(id);

    // Remove from type index
    const typeSet = this.assetsByType.get(asset.type);
    if (typeSet) {
      typeSet.delete(id);
    }

    console.log(`Unregistered asset: ${id}`);
    return true;
  }

  /**
   * Get asset by ID
   */
  get(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Get all assets
   */
  getAll(): Asset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get assets by type
   */
  getByType(type: AssetType): Asset[] {
    const ids = this.assetsByType.get(type);
    if (!ids) {
      return [];
    }

    return Array.from(ids)
      .map((id) => this.assets.get(id))
      .filter((asset): asset is Asset => asset !== undefined);
  }

  /**
   * Get relative path for asset in generated project
   */
  getPath(id: string, platform: string): string {
    const asset = this.assets.get(id);
    if (!asset) {
      throw new Error(`Asset not found: ${id}`);
    }

    // Platform-specific asset paths
    const basePath = this.getAssetBasePath(asset.type, platform);
    const fileName = path.basename(asset.filePath);

    return path.join(basePath, fileName);
  }

  /**
   * Get namespace path for asset (e.g., "modid:textures/blocks/stone")
   */
  getNamespacePath(id: string, namespace: string, platform: string): string {
    const asset = this.assets.get(id);
    if (!asset) {
      throw new Error(`Asset not found: ${id}`);
    }

    const relativePath = this.getPath(id, platform);
    const pathWithoutExt = relativePath.replace(/\.[^.]+$/, '');
    const normalized = pathWithoutExt.replace(/\\/g, '/');

    return `${namespace}:${normalized}`;
  }

  /**
   * Check if asset exists
   */
  has(id: string): boolean {
    return this.assets.has(id);
  }

  /**
   * Clear all assets
   */
  clear(): void {
    this.assets.clear();
    for (const typeSet of this.assetsByType.values()) {
      typeSet.clear();
    }
  }

  /**
   * Get base path for asset type in generated project
   */
  private getAssetBasePath(type: AssetType, platform: string): string {
    // Common paths for Forge/Fabric
    const resourcesBase = 'src/main/resources/assets';

    switch (type) {
      case 'texture':
        return path.join(resourcesBase, 'textures');

      case 'model':
        return path.join(resourcesBase, 'models');

      case 'sound':
        return path.join(resourcesBase, 'sounds');

      case 'lang':
        return path.join(resourcesBase, 'lang');

      case 'data':
        return 'src/main/resources/data';

      case 'other':
      default:
        return resourcesBase;
    }
  }

  /**
   * Import assets from directory
   */
  async importFromDirectory(directory: string, type: AssetType): Promise<number> {
    // This would scan a directory and register all assets
    // Implementation depends on file system access
    // Placeholder for now
    console.log(`Importing ${type} assets from ${directory}`);
    return 0;
  }

  /**
   * Export asset to file system
   */
  async exportAsset(id: string, outputPath: string): Promise<void> {
    const asset = this.assets.get(id);
    if (!asset) {
      throw new Error(`Asset not found: ${id}`);
    }

    // Copy asset file to output path
    // Implementation depends on file system access
    console.log(`Exporting asset ${id} to ${outputPath}`);
  }
}
