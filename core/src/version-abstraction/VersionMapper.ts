/**
 * Version Mapper - Handles version-specific mappings and translations
 */

import { VersionMapping, ConceptMapping, ComplexMapping } from '../types';
import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';
import * as path from 'path';

export class VersionMapper {
  private mappings: Map<string, VersionMapping> = new Map();
  private mappingDirectory: string;

  constructor(mappingDirectory: string) {
    this.mappingDirectory = mappingDirectory;
  }

  /**
   * Load version mappings from directory
   */
  async loadMappings(platform: string, version: string): Promise<void> {
    const key = this.getMappingKey(platform, version);

    if (this.mappings.has(key)) {
      return; // Already loaded
    }

    const mappingPath = path.join(
      this.mappingDirectory,
      platform,
      `${version}.yaml`
    );

    try {
      const content = await fs.readFile(mappingPath, 'utf-8');
      const mapping = yaml.load(content) as VersionMapping;

      // Validate and set defaults
      mapping.platform = platform;
      mapping.version = version;
      mapping.capabilities = mapping.capabilities || {};
      mapping.mappings = mapping.mappings || {};
      mapping.imports = mapping.imports || {};
      mapping.namespaces = mapping.namespaces || {};

      this.mappings.set(key, mapping);
      console.log(`Loaded version mapping: ${platform} ${version}`);
    } catch (error) {
      console.error(`Failed to load mapping for ${platform} ${version}:`, error);
      throw error;
    }
  }

  /**
   * Map a concept to version-specific code
   */
  map(
    concept: string,
    value: any,
    platform: string,
    version: string
  ): string {
    const key = this.getMappingKey(platform, version);
    const mapping = this.mappings.get(key);

    if (!mapping) {
      throw new Error(`No mapping loaded for ${platform} ${version}`);
    }

    const conceptMapping = mapping.mappings[concept];
    if (!conceptMapping) {
      console.warn(`No mapping found for concept: ${concept}`);
      return String(value);
    }

    const mappedValue = conceptMapping.values[value];

    if (!mappedValue) {
      if (conceptMapping.default) {
        return this.resolveMapping(conceptMapping.default, value);
      }
      console.warn(`No mapping found for ${concept}.${value}`);
      return String(value);
    }

    return this.resolveMapping(mappedValue, value);
  }

  /**
   * Check if a feature is supported
   */
  isSupported(feature: string, platform: string, version: string): boolean {
    const key = this.getMappingKey(platform, version);
    const mapping = this.mappings.get(key);

    if (!mapping) {
      return false;
    }

    const capability = mapping.capabilities[feature];
    return capability?.supported ?? false;
  }

  /**
   * Get imports for a class
   */
  getImports(className: string, platform: string, version: string): string[] {
    const key = this.getMappingKey(platform, version);
    const mapping = this.mappings.get(key);

    if (!mapping) {
      return [];
    }

    return mapping.imports[className] || [];
  }

  /**
   * Get namespace for a type
   */
  getNamespace(type: string, platform: string, version: string): string {
    const key = this.getMappingKey(platform, version);
    const mapping = this.mappings.get(key);

    if (!mapping) {
      return '';
    }

    return mapping.namespaces[type] || '';
  }

  /**
   * Get full version mapping
   */
  getMapping(platform: string, version: string): VersionMapping | undefined {
    const key = this.getMappingKey(platform, version);
    return this.mappings.get(key);
  }

  /**
   * Get all loaded mappings
   */
  getAllMappings(): VersionMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * Resolve a mapping value (string or complex)
   */
  private resolveMapping(
    mappingValue: string | ComplexMapping,
    originalValue: any
  ): string {
    if (typeof mappingValue === 'string') {
      return mappingValue;
    }

    // Complex mapping with template
    let result = mappingValue.template;

    // Simple variable substitution
    if (mappingValue.context) {
      for (const [key, value] of Object.entries(mappingValue.context)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    }

    // Replace original value placeholder
    result = result.replace(/{{value}}/g, String(originalValue));

    return result;
  }

  /**
   * Generate mapping key
   */
  private getMappingKey(platform: string, version: string): string {
    return `${platform}:${version}`;
  }

  /**
   * Preload mappings for common versions
   */
  async preloadCommonMappings(): Promise<void> {
    const commonMappings = [
      { platform: 'forge', version: '1.20.4' },
      { platform: 'forge', version: '1.19.2' },
      { platform: 'fabric', version: '1.20.4' },
      { platform: 'fabric', version: '1.19.2' },
    ];

    for (const { platform, version } of commonMappings) {
      try {
        await this.loadMappings(platform, version);
      } catch (error) {
        console.warn(`Failed to preload ${platform} ${version}, will load on demand`);
      }
    }
  }
}
