/**
 * Source Files Panel - Advanced file explorer showing generated project structure
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as FileIcon,
  Code as CodeIcon,
  ExpandMore as ExpandIcon,
  ChevronRight as CollapseIcon,
} from '@mui/icons-material';

interface SourceFilesPanelProps {
  project: any;
}

const SourceFilesPanel: React.FC<SourceFilesPanelProps> = ({ project }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  // Generate file structure based on project
  const generateFileStructure = () => {
    const modId = project.metadata?.modId || 'mymod';
    const namespace = project.metadata?.namespace || modId;

    return {
      name: 'project',
      type: 'folder',
      children: [
        {
          name: 'src',
          type: 'folder',
          children: [
            {
              name: 'main',
              type: 'folder',
              children: [
                {
                  name: 'java',
                  type: 'folder',
                  children: [
                    {
                      name: `com/${modId}`,
                      type: 'folder',
                      children: [
                        {
                          name: `${project.metadata?.name?.replace(/\s+/g, '') || 'MyMod'}.java`,
                          type: 'file',
                          content: generateMainModFile(),
                        },
                        {
                          name: 'blocks',
                          type: 'folder',
                          children: project.features
                            ?.filter((f: any) => f.type === 'core.block')
                            .map((f: any) => ({
                              name: `${f.name.replace(/\s+/g, '')}Block.java`,
                              type: 'file',
                              content: generateBlockFile(f),
                            })) || [],
                        },
                        {
                          name: 'items',
                          type: 'folder',
                          children: project.features
                            ?.filter((f: any) => f.type === 'core.item')
                            .map((f: any) => ({
                              name: `${f.name.replace(/\s+/g, '')}Item.java`,
                              type: 'file',
                              content: generateItemFile(f),
                            })) || [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'resources',
                  type: 'folder',
                  children: [
                    {
                      name: 'META-INF',
                      type: 'folder',
                      children: [
                        {
                          name: 'mods.toml',
                          type: 'file',
                          content: generateModsToml(),
                        },
                      ],
                    },
                    {
                      name: 'assets',
                      type: 'folder',
                      children: [
                        {
                          name: namespace,
                          type: 'folder',
                          children: [
                            {
                              name: 'textures',
                              type: 'folder',
                              children: [],
                            },
                            {
                              name: 'models',
                              type: 'folder',
                              children: [],
                            },
                            {
                              name: 'sounds',
                              type: 'folder',
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'build.gradle',
          type: 'file',
          content: generateBuildGradle(),
        },
        {
          name: 'gradle.properties',
          type: 'file',
          content: generateGradleProperties(),
        },
      ],
    };
  };

  const generateMainModFile = () => {
    const className = project.metadata?.name?.replace(/\s+/g, '') || 'MyMod';
    const modId = project.metadata?.modId || 'mymod';

    return `package com.${modId};

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Mod("${modId}")
public class ${className} {
    public static final String MOD_ID = "${modId}";
    private static final Logger LOGGER = LogManager.getLogger();

    public ${className}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::setup);
    }

    private void setup(final FMLCommonSetupEvent event) {
        LOGGER.info("${project.metadata?.name || 'My Mod'} is loading!");
    }
}`;
  };

  const generateBlockFile = (feature: any) => {
    const className = feature.name.replace(/\s+/g, '');
    const modId = project.metadata?.modId || 'mymod';

    return `package com.${modId}.blocks;

import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;

public class ${className}Block extends Block {
    public ${className}Block() {
        super(BlockBehaviour.Properties.of(Material.${feature.data?.material || 'STONE'})
            .strength(${feature.data?.hardness || 3.0}f, ${feature.data?.resistance || 3.0}f));
    }
}`;
  };

  const generateItemFile = (feature: any) => {
    const className = feature.name.replace(/\s+/g, '');
    const modId = project.metadata?.modId || 'mymod';

    return `package com.${modId}.items;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;

public class ${className}Item extends Item {
    public ${className}Item() {
        super(new Item.Properties()
            .stacksTo(${feature.data?.maxStackSize || 64})
            .rarity(Rarity.${feature.data?.rarity?.toUpperCase() || 'COMMON'}));
    }
}`;
  };

  const generateModsToml = () => {
    return `modLoader="javafml"
loaderVersion="[47,)"
license="${project.metadata?.license || 'All Rights Reserved'}"

[[mods]]
modId="${project.metadata?.modId || 'mymod'}"
version="${project.metadata?.version || '1.0.0'}"
displayName="${project.metadata?.name || 'My Mod'}"
description='''
${project.metadata?.description || 'A Minecraft mod created with SoupModMaker'}
'''
authors="${project.metadata?.authors?.join(', ') || 'You'}"

[[dependencies.${project.metadata?.modId || 'mymod'}]]
modId="forge"
mandatory=true
versionRange="[47,)"
ordering="NONE"
side="BOTH"

[[dependencies.${project.metadata?.modId || 'mymod'}]]
modId="minecraft"
mandatory=true
versionRange="[${project.targets?.[0]?.minecraftVersion || '1.20.4'}]"
ordering="NONE"
side="BOTH"`;
  };

  const generateBuildGradle = () => {
    return `plugins {
    id 'java'
    id 'net.minecraftforge.gradle' version '6.0+'
}

group = 'com.${project.metadata?.modId || 'mymod'}'
version = '${project.metadata?.version || '1.0.0'}'

java {
    toolchain.languageVersion = JavaLanguageVersion.of(${project.settings?.javaVersion || 17})
}

minecraft {
    mappings channel: 'official', version: '${project.targets?.[0]?.minecraftVersion || '1.20.4'}'
}

dependencies {
    minecraft 'net.minecraftforge:forge:${project.targets?.[0]?.minecraftVersion || '1.20.4'}-47.2.0'
}`;
  };

  const generateGradleProperties = () => {
    return `org.gradle.jvmargs=-Xmx3G
org.gradle.daemon=false
minecraft_version=${project.targets?.[0]?.minecraftVersion || '1.20.4'}
forge_version=47.2.0`;
  };

  const renderFileTree = (node: any, level: number = 0, path: string = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    if (node.type === 'folder') {
      return (
        <Box key={currentPath}>
          <ListItemButton
            onClick={() => toggleFolder(currentPath)}
            sx={{ pl: level * 2 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isExpanded ? <ExpandIcon /> : <CollapseIcon />}
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText
              primary={node.name}
              primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
            />
          </ListItemButton>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children?.map((child: any) =>
                renderFileTree(child, level + 1, currentPath)
              )}
            </List>
          </Collapse>
        </Box>
      );
    } else {
      return (
        <ListItemButton
          key={currentPath}
          onClick={() => setSelectedFile(currentPath)}
          selected={selectedFile === currentPath}
          sx={{ pl: (level + 1) * 2 }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <FileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={node.name}
            primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
          />
        </ListItemButton>
      );
    }
  };

  const getFileContent = (path: string): string => {
    const parts = path.split('/');
    let current: any = generateFileStructure();

    for (const part of parts) {
      if (current.children) {
        current = current.children.find((c: any) => c.name === part);
        if (!current) return '// File not found';
      } else {
        break;
      }
    }

    return current?.content || '// No content available';
  };

  const fileStructure = generateFileStructure();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
      {/* File Tree */}
      <Box
        sx={{
          width: 300,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1, fontSize: 18 }} />
            Source Files
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Generated project structure
          </Typography>
        </Box>
        <List dense>
          {fileStructure.children?.map((child: any) => renderFileTree(child, 0, 'project'))}
        </List>
      </Box>

      {/* File Viewer */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedFile ? (
          <>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
                {selectedFile}
              </Typography>
            </Box>
            <Box
              component="pre"
              sx={{
                flex: 1,
                m: 0,
                p: 2,
                overflow: 'auto',
                bgcolor: 'grey.900',
                color: 'grey.100',
                fontSize: '0.813rem',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            >
              {getFileContent(selectedFile)}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <CodeIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              Select a file to view its contents
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SourceFilesPanel;
