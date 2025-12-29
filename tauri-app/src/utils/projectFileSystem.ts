/**
 * Project File System Manager
 * Handles reading and writing project files to disk
 */

import { writeTextFile, readTextFile, exists, mkdir, readDir } from '@tauri-apps/plugin-fs';
import { join, dirname } from '@tauri-apps/api/path';

export interface ProjectMetadata {
  name: string;
  modId: string;
  namespace: string;
  description?: string;
  version: string;
  authors: string[];
  platform: string;
  minecraftVersion: string;
}

export interface ProjectData {
  id: string;
  metadata: ProjectMetadata;
  features: any[];
  targets: any[];
  assets: {
    textures: any[];
    models: any[];
    sounds: any[];
  };
  plugins: any[];
  settings: any;
  timestamps: {
    created: number;
    modified: number;
  };
  projectPath?: string;
  manuallyEditedFiles?: string[];
}

/**
 * Create a new project on disk with full directory structure
 */
export async function createProjectOnDisk(
  projectPath: string,
  projectData: ProjectData
): Promise<void> {
  try {
    // Check if project directory already exists
    const projectExists = await exists(projectPath);
    if (projectExists) {
      // Check if it has a project.json
      const projectJsonPath = await join(projectPath, 'project.json');
      const projectJsonExists = await exists(projectJsonPath);
      if (projectJsonExists) {
        throw new Error(
          'A project already exists at this location.\n\n' +
          'Please choose a different name or location, or open the existing project instead.'
        );
      }
    }

    // Create main project directory
    await mkdir(projectPath, { recursive: true });

    // Create directory structure
    const directories = [
      'src/main/java',
      'src/main/resources/META-INF',
      `src/main/resources/assets/${projectData.metadata.namespace}/textures/block`,
      `src/main/resources/assets/${projectData.metadata.namespace}/textures/item`,
      `src/main/resources/assets/${projectData.metadata.namespace}/models/block`,
      `src/main/resources/assets/${projectData.metadata.namespace}/models/item`,
      `src/main/resources/assets/${projectData.metadata.namespace}/sounds`,
    ];

    for (const dir of directories) {
      const fullPath = await join(projectPath, dir);
      await mkdir(fullPath, { recursive: true });
    }

    // Write project.json (SoupModMaker metadata)
    const projectJsonPath = await join(projectPath, 'project.json');
    await writeTextFile(projectJsonPath, JSON.stringify(projectData, null, 2));

    // Generate and write source files
    await generateSourceFiles(projectPath, projectData);

    // Generate and write build files
    await generateBuildFiles(projectPath, projectData);

    console.log('Project created successfully at:', projectPath);
  } catch (error) {
    console.error('Error creating project on disk:', error);
    throw error;
  }
}

/**
 * Load an existing project from disk
 */
export async function loadProjectFromDisk(projectPath: string): Promise<ProjectData> {
  try {
    const projectJsonPath = await join(projectPath, 'project.json');
    const projectJsonExists = await exists(projectJsonPath);

    if (!projectJsonExists) {
      throw new Error(
        'No project.json found in the selected directory.\n\n' +
        'Make sure you selected a valid SoupModMaker project folder.'
      );
    }

    const projectJson = await readTextFile(projectJsonPath);

    let projectData: ProjectData;
    try {
      projectData = JSON.parse(projectJson);
    } catch (parseError) {
      throw new Error(
        'The project.json file is corrupted or invalid.\n\n' +
        'Please check the file format or try creating a new project.'
      );
    }

    // Validate required fields
    if (!projectData.metadata || !projectData.metadata.name) {
      throw new Error(
        'The project.json file is missing required metadata.\n\n' +
        'This may not be a valid SoupModMaker project.'
      );
    }

    projectData.projectPath = projectPath;

    return projectData;
  } catch (error) {
    console.error('Error loading project from disk:', error);
    throw error;
  }
}

/**
 * Save project data to disk
 */
export async function saveProjectToDisk(projectData: ProjectData): Promise<void> {
  if (!projectData.projectPath) {
    throw new Error('Project path not set');
  }

  try {
    // Update timestamps
    projectData.timestamps.modified = Date.now();

    // Write project.json
    const projectJsonPath = await join(projectData.projectPath, 'project.json');
    await writeTextFile(projectJsonPath, JSON.stringify(projectData, null, 2));

    // Regenerate source files (skip manually edited ones)
    await generateSourceFiles(projectData.projectPath, projectData);

    console.log('Project saved successfully');
  } catch (error) {
    console.error('Error saving project to disk:', error);
    throw error;
  }
}

/**
 * Generate all source files for the project
 */
async function generateSourceFiles(
  projectPath: string,
  projectData: ProjectData
): Promise<void> {
  const { metadata, features, manuallyEditedFiles = [] } = projectData;
  const modId = metadata.modId;
  const className = metadata.name.replace(/\s+/g, '');

  // Package path
  const packagePath = `com/${modId}`;

  // Generate main mod class
  const mainClassPath = await join(
    projectPath,
    `src/main/java/${packagePath}/${className}.java`
  );

  if (!manuallyEditedFiles.includes(mainClassPath)) {
    await mkdir(await dirname(mainClassPath), { recursive: true });
    const mainClassContent = generateMainModClass(metadata, className);
    await writeTextFile(mainClassPath, mainClassContent);
  }

  // Generate block classes
  const blocks = features.filter((f) => f.type === 'core.block');
  for (const block of blocks) {
    const blockClassName = block.name.replace(/\s+/g, '');
    const blockPath = await join(
      projectPath,
      `src/main/java/${packagePath}/blocks/${blockClassName}Block.java`
    );

    if (!manuallyEditedFiles.includes(blockPath)) {
      await mkdir(await dirname(blockPath), { recursive: true });
      const blockContent = generateBlockClass(modId, block);
      await writeTextFile(blockPath, blockContent);
    }
  }

  // Generate item classes
  const items = features.filter((f) => f.type === 'core.item');
  for (const item of items) {
    const itemClassName = item.name.replace(/\s+/g, '');
    const itemPath = await join(
      projectPath,
      `src/main/java/${packagePath}/items/${itemClassName}Item.java`
    );

    if (!manuallyEditedFiles.includes(itemPath)) {
      await mkdir(await dirname(itemPath), { recursive: true });
      const itemContent = generateItemClass(modId, item);
      await writeTextFile(itemPath, itemContent);
    }
  }
}

/**
 * Generate build configuration files
 */
async function generateBuildFiles(
  projectPath: string,
  projectData: ProjectData
): Promise<void> {
  const { metadata, settings } = projectData;

  // Generate mods.toml
  const modsTomlPath = await join(
    projectPath,
    'src/main/resources/META-INF/mods.toml'
  );
  const modsTomlContent = generateModsToml(metadata);
  await writeTextFile(modsTomlPath, modsTomlContent);

  // Generate build.gradle
  const buildGradlePath = await join(projectPath, 'build.gradle');
  const buildGradleContent = generateBuildGradle(metadata, settings);
  await writeTextFile(buildGradlePath, buildGradleContent);

  // Generate gradle.properties
  const gradlePropsPath = await join(projectPath, 'gradle.properties');
  const gradlePropsContent = generateGradleProperties(metadata);
  await writeTextFile(gradlePropsPath, gradlePropsContent);
}

/**
 * Code generation functions
 */

function generateMainModClass(metadata: ProjectMetadata, className: string): string {
  return `package com.${metadata.modId};

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Mod("${metadata.modId}")
public class ${className} {
    public static final String MOD_ID = "${metadata.modId}";
    private static final Logger LOGGER = LogManager.getLogger();

    public ${className}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::setup);
    }

    private void setup(final FMLCommonSetupEvent event) {
        LOGGER.info("${metadata.name} is loading!");
    }
}
`;
}

function generateBlockClass(modId: string, block: any): string {
  const className = block.name.replace(/\s+/g, '');
  return `package com.${modId}.blocks;

import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;

public class ${className}Block extends Block {
    public ${className}Block() {
        super(BlockBehaviour.Properties.of(Material.${block.data?.material || 'STONE'})
            .strength(${block.data?.hardness || 3.0}f, ${block.data?.resistance || 3.0}f));
    }
}
`;
}

function generateItemClass(modId: string, item: any): string {
  const className = item.name.replace(/\s+/g, '');
  return `package com.${modId}.items;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;

public class ${className}Item extends Item {
    public ${className}Item() {
        super(new Item.Properties()
            .stacksTo(${item.data?.maxStackSize || 64})
            .rarity(Rarity.${item.data?.rarity?.toUpperCase() || 'COMMON'}));
    }
}
`;
}

function generateModsToml(metadata: ProjectMetadata): string {
  return `modLoader="javafml"
loaderVersion="[47,)"
license="${metadata.description || 'All Rights Reserved'}"

[[mods]]
modId="${metadata.modId}"
version="${metadata.version}"
displayName="${metadata.name}"
description='''
${metadata.description || 'A Minecraft mod created with SoupModMaker'}
'''
authors="${metadata.authors.join(', ')}"

[[dependencies.${metadata.modId}]]
modId="forge"
mandatory=true
versionRange="[47,)"
ordering="NONE"
side="BOTH"

[[dependencies.${metadata.modId}]]
modId="minecraft"
mandatory=true
versionRange="[${metadata.minecraftVersion}]"
ordering="NONE"
side="BOTH"
`;
}

function generateBuildGradle(metadata: ProjectMetadata, settings: any): string {
  return `plugins {
    id 'java'
    id 'net.minecraftforge.gradle' version '6.0+'
}

group = 'com.${metadata.modId}'
version = '${metadata.version}'

java {
    toolchain.languageVersion = JavaLanguageVersion.of(${settings?.javaVersion || 17})
}

minecraft {
    mappings channel: 'official', version: '${metadata.minecraftVersion}'
}

dependencies {
    minecraft 'net.minecraftforge:forge:${metadata.minecraftVersion}-47.2.0'
}
`;
}

function generateGradleProperties(metadata: ProjectMetadata): string {
  return `org.gradle.jvmargs=-Xmx3G
org.gradle.daemon=false
minecraft_version=${metadata.minecraftVersion}
forge_version=47.2.0
`;
}
