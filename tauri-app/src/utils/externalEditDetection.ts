/**
 * External Edit Detection and Synchronization
 * Detects when files have been modified outside SoupModMaker and syncs changes
 */

import { readTextFile, stat } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { ProjectData } from './projectFileSystem';

export interface FileModificationInfo {
  path: string;
  lastModified: number;
  hash?: string;
}

export interface ExternalEditResult {
  hasChanges: boolean;
  modifiedFiles: string[];
  updatedFeatures?: any[];
}

/**
 * Check if a file has been modified externally
 */
export async function checkFileModified(
  filePath: string,
  lastKnownModified: number
): Promise<boolean> {
  try {
    const fileStats = await stat(filePath);
    const currentModified = fileStats.mtime ? new Date(fileStats.mtime).getTime() : 0;
    return currentModified > lastKnownModified;
  } catch (error) {
    console.error(`Error checking file modification for ${filePath}:`, error);
    return false;
  }
}

/**
 * Detect all external edits to a project
 */
export async function detectExternalEdits(
  project: ProjectData
): Promise<ExternalEditResult> {
  if (!project.projectPath) {
    return { hasChanges: false, modifiedFiles: [] };
  }

  const modifiedFiles: string[] = [];
  const projectModified = project.timestamps.modified;

  try {
    // Check project.json
    const projectJsonPath = await join(project.projectPath, 'project.json');
    const projectJsonModified = await checkFileModified(projectJsonPath, projectModified);
    if (projectJsonModified) {
      modifiedFiles.push(projectJsonPath);
    }

    // Check feature source files
    for (const feature of project.features) {
      const filePath = await getFeatureSourcePath(project, feature);
      if (filePath) {
        const isModified = await checkFileModified(filePath, projectModified);
        if (isModified) {
          modifiedFiles.push(filePath);
        }
      }
    }

    // Check build files
    const buildFiles = ['build.gradle', 'gradle.properties', 'src/main/resources/META-INF/mods.toml'];
    for (const buildFile of buildFiles) {
      const filePath = await join(project.projectPath, buildFile);
      const isModified = await checkFileModified(filePath, projectModified);
      if (isModified) {
        modifiedFiles.push(filePath);
      }
    }

    return {
      hasChanges: modifiedFiles.length > 0,
      modifiedFiles,
    };
  } catch (error) {
    console.error('Error detecting external edits:', error);
    return { hasChanges: false, modifiedFiles: [] };
  }
}

/**
 * Get the source file path for a feature
 */
async function getFeatureSourcePath(
  project: ProjectData,
  feature: any
): Promise<string | null> {
  if (!project.projectPath) return null;

  const { modId } = project.metadata;
  const packagePath = `com/${modId}`;
  const className = feature.name.replace(/\s+/g, '');

  try {
    if (feature.type === 'core.block') {
      return await join(
        project.projectPath,
        `src/main/java/${packagePath}/blocks/${className}Block.java`
      );
    } else if (feature.type === 'core.item') {
      return await join(
        project.projectPath,
        `src/main/java/${packagePath}/items/${className}Item.java`
      );
    }
  } catch (error) {
    console.error('Error building feature source path:', error);
  }

  return null;
}

/**
 * Parse a Java block file to extract feature data
 */
export async function parseBlockFile(filePath: string): Promise<any | null> {
  try {
    const content = await readTextFile(filePath);
    const data: any = {};

    // Extract material
    const materialMatch = content.match(/Material\.(\w+)/);
    if (materialMatch) {
      data.material = materialMatch[1];
    }

    // Extract hardness and resistance
    const strengthMatch = content.match(/\.strength\(([\d.]+)f,\s*([\d.]+)f\)/);
    if (strengthMatch) {
      data.hardness = parseFloat(strengthMatch[1]);
      data.resistance = parseFloat(strengthMatch[2]);
    }

    // Extract requires tool
    const requiresToolMatch = content.match(/\.requiresCorrectToolForDrops\(\)/);
    if (requiresToolMatch) {
      data.requiresTool = true;
    }

    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error('Error parsing block file:', error);
    return null;
  }
}

/**
 * Parse a Java item file to extract feature data
 */
export async function parseItemFile(filePath: string): Promise<any | null> {
  try {
    const content = await readTextFile(filePath);
    const data: any = {};

    // Extract max stack size
    const stackMatch = content.match(/\.stacksTo\((\d+)\)/);
    if (stackMatch) {
      data.maxStackSize = parseInt(stackMatch[1], 10);
    }

    // Extract rarity
    const rarityMatch = content.match(/\.rarity\(Rarity\.(\w+)\)/);
    if (rarityMatch) {
      data.rarity = rarityMatch[1].toLowerCase();
    }

    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error('Error parsing item file:', error);
    return null;
  }
}

/**
 * Sync external changes back into a feature
 */
export async function syncFeatureFromDisk(
  project: ProjectData,
  feature: any
): Promise<any | null> {
  const filePath = await getFeatureSourcePath(project, feature);
  if (!filePath) return null;

  try {
    let parsedData: any | null = null;

    if (feature.type === 'core.block') {
      parsedData = await parseBlockFile(filePath);
    } else if (feature.type === 'core.item') {
      parsedData = await parseItemFile(filePath);
    }

    if (parsedData) {
      return {
        ...feature,
        data: {
          ...feature.data,
          ...parsedData,
        },
      };
    }
  } catch (error) {
    console.error('Error syncing feature from disk:', error);
  }

  return null;
}

/**
 * Sync all features from disk
 */
export async function syncAllFeaturesFromDisk(
  project: ProjectData
): Promise<any[]> {
  const updatedFeatures: any[] = [];

  for (const feature of project.features) {
    const synced = await syncFeatureFromDisk(project, feature);
    if (synced) {
      updatedFeatures.push(synced);
    } else {
      updatedFeatures.push(feature);
    }
  }

  return updatedFeatures;
}

/**
 * Check if a specific feature has been modified externally
 */
export async function checkFeatureModified(
  project: ProjectData,
  feature: any
): Promise<boolean> {
  const filePath = await getFeatureSourcePath(project, feature);
  if (!filePath) return false;

  return await checkFileModified(filePath, project.timestamps.modified);
}
