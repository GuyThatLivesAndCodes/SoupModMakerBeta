/**
 * Welcome Screen - Enhanced with templates, recent projects, and marketplace
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Add as NewIcon,
  FolderOpen as OpenIcon,
  Category as TemplateIcon,
  Store as MarketplaceIcon,
  AccessTime as ClockIcon,
  Code as CodeIcon,
  School as TutorialIcon,
  GitHub as GitHubIcon,
  ArrowBack as BackIcon,
  Extension as ExtensionIcon,
} from '@mui/icons-material';
import { RecentProject } from '@soupmodmaker/core';

interface WelcomeScreenProps {
  onNewProject?: (templateData?: any) => void;
  onOpenProject?: () => void;
  onProjectSelect?: (path: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNewProject,
  onOpenProject,
  onProjectSelect,
}) => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    try {
      // TODO: Implement recent projects with Tauri store
      setRecentProjects([]);
    } catch (error) {
      console.error('Error loading recent projects:', error);
    }
  };

  const handleNewProject = () => {
    if (onNewProject) {
      onNewProject();
    }
  };

  const handleOpenProject = () => {
    if (onOpenProject) {
      onOpenProject();
    }
  };

  const handleOpenRecent = async (path: string) => {
    if (onProjectSelect) {
      onProjectSelect(path);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'forge': return '#8B4513';
      case 'fabric': return '#D2B48C';
      case 'neoforge': return '#FF6347';
      default: return '#888';
    }
  };

  if (showTemplates) {
    return <TemplateGallery onBack={() => setShowTemplates(false)} onSelect={onProjectSelect || (() => {})} />;
  }

  if (showMarketplace) {
    return <PluginMarketplace onBack={() => setShowMarketplace(false)} />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        bgcolor: 'background.default',
        overflow: 'auto',
      }}
    >
      {/* Logo / Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          SoupModMaker
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7, mb: 1 }}>
          Modern Minecraft Mod & Plugin Creator
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          Create mods for multiple versions - fast, fun, and free
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={handleNewProject}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <NewIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">New Project</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={handleOpenProject}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <OpenIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6">Open Project</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={() => setShowTemplates(true)}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TemplateIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">Templates</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={() => setShowMarketplace(true)}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <MarketplaceIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">Marketplace</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ClockIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h5">Recent Projects</Typography>
          </Box>

          <Grid container spacing={2}>
            {recentProjects.slice(0, 6).map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleOpenRecent(project.path)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                      <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                          {project.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(project.lastOpened)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Chip
                        label={project.platform}
                        size="small"
                        sx={{
                          bgcolor: getPlatformColor(project.platform),
                          color: 'white',
                        }}
                      />
                      <Chip
                        label={project.minecraftVersion}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Getting Started (shown when no recent projects) */}
      {recentProjects.length === 0 && (
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Welcome to SoupModMaker!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Get started by creating a new project or exploring our templates.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<NewIcon />}
                onClick={handleNewProject}
              >
                Create New Project
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<TemplateIcon />}
                onClick={() => setShowTemplates(true)}
              >
                Browse Templates
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Features Footer */}
      <Box sx={{ mt: 'auto', pt: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          Multi-version support • Modern UI • Plugin-based architecture • Free and Open Source
        </Typography>
      </Box>
    </Box>
  );
};

// ============ TEMPLATE GALLERY ============

interface TemplateGalleryProps {
  onBack: () => void;
  onSelect: (templateData: any) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onBack, onSelect }) => {
  const templates = [
    {
      id: 'rpg-mod',
      name: 'RPG Adventure Mod',
      description: 'Complete RPG system with classes, skills, and quests',
      platform: 'forge',
      minecraftVersion: '1.20.4',
      icon: '⚔️',
      features: ['Custom Mobs', 'Quest System', 'Player Classes', 'Skill Trees'],
    },
    {
      id: 'tech-mod',
      name: 'Tech & Machinery',
      description: 'Industrial mod with machines, power systems, and automation',
      platform: 'forge',
      minecraftVersion: '1.20.4',
      icon: '⚙️',
      features: ['Machines', 'Power Grid', 'Pipes & Cables', 'Auto-crafting'],
    },
    {
      id: 'magic-mod',
      name: 'Magic & Spells',
      description: 'Magic system with spells, wands, and mystical creatures',
      platform: 'fabric',
      minecraftVersion: '1.20.4',
      icon: '✨',
      features: ['Spell System', 'Magic Items', 'Mana System', 'Enchantments'],
    },
    {
      id: 'dimension-mod',
      name: 'New Dimensions',
      description: 'Create custom dimensions with unique biomes and structures',
      platform: 'neoforge',
      minecraftVersion: '1.20.4',
      icon: '🌍',
      features: ['Custom Dimensions', 'Biomes', 'Structures', 'Portal System'],
    },
    {
      id: 'food-mod',
      name: 'Food & Farming',
      description: 'Expanded farming with new crops, foods, and cooking',
      platform: 'forge',
      minecraftVersion: '1.20.1',
      icon: '🍎',
      features: ['New Crops', 'Cooking System', 'Food Effects', 'Farming Tools'],
    },
    {
      id: 'simple-mod',
      name: 'Simple Starter',
      description: 'Basic template to start from scratch',
      platform: 'forge',
      minecraftVersion: '1.20.4',
      icon: '📦',
      features: ['Minimal Setup', 'Best Practices', 'Code Examples', 'Documentation'],
    },
  ];

  const handleUseTemplate = (template: any) => {
    // Create template data based on template type
    const templateData = createTemplateData(template);
    onSelect(templateData);
  };

  const createTemplateData = (template: any) => {
    const baseTemplate = {
      id: template.id,
      name: template.name,
      platform: template.platform,
      minecraftVersion: template.minecraftVersion,
    };

    // Create features based on template type
    switch (template.id) {
      case 'simple-mod':
        return {
          ...baseTemplate,
          features: [
            {
              id: 'feature_example_block',
              type: 'core.block',
              name: 'Example Block',
              enabled: true,
              data: {
                material: 'STONE',
                hardness: 3.0,
                resistance: 3.0,
                harvestLevel: 1,
                harvestTool: 'pickaxe',
              },
            },
            {
              id: 'feature_example_item',
              type: 'core.item',
              name: 'Example Item',
              enabled: true,
              data: {
                maxStackSize: 64,
                rarity: 'common',
              },
            },
          ],
          assets: {
            textures: [],
            models: [],
            sounds: [],
          },
        };

      case 'rpg-mod':
        return {
          ...baseTemplate,
          features: [
            {
              id: 'feature_sword_of_valor',
              type: 'core.item',
              name: 'Sword of Valor',
              enabled: true,
              data: {
                maxStackSize: 1,
                rarity: 'epic',
                attackDamage: 8,
                attackSpeed: 1.6,
              },
            },
            {
              id: 'feature_mana_crystal',
              type: 'core.item',
              name: 'Mana Crystal',
              enabled: true,
              data: {
                maxStackSize: 64,
                rarity: 'rare',
              },
            },
          ],
          assets: {
            textures: [],
            models: [],
            sounds: [],
          },
        };

      case 'food-mod':
        return {
          ...baseTemplate,
          features: [
            {
              id: 'feature_golden_apple_pie',
              type: 'core.item',
              name: 'Golden Apple Pie',
              enabled: true,
              data: {
                maxStackSize: 16,
                rarity: 'uncommon',
                food: {
                  hunger: 8,
                  saturation: 12.8,
                },
              },
            },
            {
              id: 'feature_cooking_table',
              type: 'core.block',
              name: 'Cooking Table',
              enabled: true,
              data: {
                material: 'WOOD',
                hardness: 2.5,
                resistance: 2.5,
              },
            },
          ],
          assets: {
            textures: [],
            models: [],
            sounds: [],
          },
        };

      default:
        return {
          ...baseTemplate,
          features: [],
          assets: {
            textures: [],
            models: [],
            sounds: [],
          },
        };
    }
  };

  return (
    <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">Project Templates</Typography>
          <Typography variant="body2" color="text.secondary">
            Start your mod from a pre-configured template
          </Typography>
        </Box>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                    {template.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={template.platform} size="small" />
                      <Chip label={template.minecraftVersion} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Includes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {template.features.map((feature, idx) => (
                    <Chip key={idx} label={feature} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ============ PLUGIN MARKETPLACE ============

interface PluginMarketplaceProps {
  onBack: () => void;
}

const PluginMarketplace: React.FC<PluginMarketplaceProps> = ({ onBack }) => {
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([]);

  useEffect(() => {
    loadInstalledPlugins();
  }, []);

  const loadInstalledPlugins = async () => {
    try {
      // TODO: Implement plugin management with Tauri store
      // For now, mark built-in plugins as installed
      setInstalledPlugins(['mob-maker', 'event-creator']);
    } catch (error) {
      console.error('Error loading installed plugins:', error);
    }
  };

  const plugins = [
    {
      id: 'mob-maker',
      name: 'Mob Maker',
      description: 'Create custom mobs with AI, animations, and behaviors',
      author: 'SoupModMaker Team',
      version: '1.0.0',
      category: 'content',
      downloads: 1250,
      rating: 4.8,
      builtin: true,
    },
    {
      id: 'event-creator',
      name: 'Event Creator',
      description: 'Visual event system with conditions and actions',
      author: 'SoupModMaker Team',
      version: '1.0.0',
      category: 'gameplay',
      downloads: 980,
      rating: 4.7,
      builtin: true,
    },
    {
      id: 'code-preview',
      name: 'Live Code Preview',
      description: 'See generated Java code in real-time as you make changes',
      author: 'SoupModMaker Team',
      version: '1.0.0',
      category: 'tools',
      downloads: 2100,
      rating: 4.9,
      builtin: false,
    },
    {
      id: 'texture-generator',
      name: 'AI Texture Generator',
      description: 'Generate block and item textures using AI',
      author: 'Community',
      version: '0.9.0',
      category: 'tools',
      downloads: 1540,
      rating: 4.5,
      builtin: false,
    },
    {
      id: 'recipe-creator',
      name: 'Recipe Creator',
      description: 'Visual crafting and smelting recipe editor',
      author: 'Community',
      version: '1.2.0',
      category: 'content',
      downloads: 890,
      rating: 4.6,
      builtin: false,
    },
    {
      id: 'world-gen',
      name: 'World Generation Designer',
      description: 'Create custom ore generation, structures, and features',
      author: 'Community',
      version: '1.1.0',
      category: 'world',
      downloads: 670,
      rating: 4.4,
      builtin: false,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content': return 'primary';
      case 'world': return 'success';
      case 'gameplay': return 'warning';
      case 'tools': return 'info';
      default: return 'default';
    }
  };

  const handleInstallPlugin = async (plugin: any) => {
    if (plugin.builtin) {
      alert('This plugin is built-in and already installed!');
      return;
    }

    alert('Plugin installation from marketplace coming soon!\n\nFor now, use Settings > Import Plugin to add custom plugins.');
  };

  return (
    <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">Plugin Marketplace</Typography>
          <Typography variant="body2" color="text.secondary">
            Extend SoupModMaker with community plugins
          </Typography>
        </Box>
      </Box>

      {/* Plugins Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {plugins.map((plugin) => {
          const isInstalled = installedPlugins.includes(plugin.id) || plugin.builtin;

          return (
            <Grid item xs={12} md={6} key={plugin.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                    <ExtensionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{plugin.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        v{plugin.version} • by {plugin.author}
                      </Typography>
                    </Box>
                    <Chip
                      label={plugin.category}
                      size="small"
                      color={getCategoryColor(plugin.category) as any}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plugin.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      ⭐ {plugin.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ⬇️ {plugin.downloads.toLocaleString()}
                    </Typography>
                    {plugin.builtin && (
                      <Chip label="Built-in" size="small" variant="outlined" />
                    )}
                    {isInstalled && !plugin.builtin && (
                      <Chip label="Installed" size="small" color="success" />
                    )}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant={isInstalled ? 'outlined' : 'contained'}
                    disabled={isInstalled}
                    onClick={() => handleInstallPlugin(plugin)}
                  >
                    {isInstalled ? 'Installed' : 'Install'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WelcomeScreen;
