/**
 * Version Abstraction Layer types
 */

/**
 * Version mapping configuration
 */
export interface VersionMapping {
  /** Platform identifier */
  platform: string;

  /** Minecraft version */
  version: string;

  /** Platform loader version info */
  loaderVersion?: string;

  /** Java version required */
  javaVersion: number;

  /** Feature capabilities */
  capabilities: Record<string, FeatureCapability>;

  /** Concept mappings (e.g., materials, sounds, etc.) */
  mappings: Record<string, ConceptMapping>;

  /** Import mappings for common classes */
  imports: Record<string, string[]>;

  /** Namespace/package mappings */
  namespaces: Record<string, string>;

  /** Template base path */
  templateBasePath: string;
}

/**
 * Feature capability definition
 */
export interface FeatureCapability {
  /** Whether this feature is supported */
  supported: boolean;

  /** Deprecation info if applicable */
  deprecated?: {
    since: string;
    alternative?: string;
    message?: string;
  };

  /** Version-specific notes */
  notes?: string;

  /** Sub-capabilities */
  capabilities?: Record<string, boolean>;
}

/**
 * Concept mapping (e.g., block materials)
 */
export interface ConceptMapping {
  /** Mapping values */
  values: Record<string, ConceptMappingValue>;

  /** Default value if key not found */
  default?: ConceptMappingValue;
}

export type ConceptMappingValue = string | ComplexMapping;

export interface ComplexMapping {
  /** Code template */
  template: string;

  /** Required imports */
  imports?: string[];

  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Minecraft version info
 */
export interface MinecraftVersion {
  /** Version string (e.g., "1.20.4") */
  version: string;

  /** Release type */
  type: 'release' | 'snapshot' | 'old_beta' | 'old_alpha';

  /** Release date */
  releaseDate: Date;

  /** Major protocol version */
  protocolVersion: number;

  /** Whether this version is supported */
  supported: boolean;
}

/**
 * Platform version info
 */
export interface PlatformVersion {
  platform: string;
  minecraftVersion: string;
  loaderVersion: string;
  supported: boolean;
  recommended: boolean;
}
