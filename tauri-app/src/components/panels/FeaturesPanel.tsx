/**
 * Features Panel - Shows all features with + button and context menu
 */

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewInAr as BlockIcon,
  Inventory as ItemIcon,
  Restaurant as RecipeIcon,
  Pets as MobIcon,
  EmojiEvents as EventIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';

interface FeaturesPanelProps {
  project: any;
  selectedFeature: any;
  onSelectFeature: (feature: any) => void;
  onAddFeature: (type: string) => void;
  onDeleteFeature: (featureId: string) => void;
  onRenameFeature: (featureId: string, newName: string) => void;
  onDuplicateFeature?: (feature: any) => void;
}

// Feature type
interface AvailableFeature {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  comingSoon: boolean;
  requiresExporter: string[];
}

// All available features
const AVAILABLE_FEATURES: AvailableFeature[] = [
  {
    id: 'core.block',
    name: 'Block',
    icon: <BlockIcon />,
    category: 'Core',
    comingSoon: false,
    requiresExporter: [],
  },
  {
    id: 'core.item',
    name: 'Item',
    icon: <ItemIcon />,
    category: 'Core',
    comingSoon: false,
    requiresExporter: [],
  },
  {
    id: 'core.recipe',
    name: 'Recipe',
    icon: <RecipeIcon />,
    category: 'Core',
    comingSoon: false,
    requiresExporter: [],
  },
  {
    id: 'core.mob',
    name: 'Mob/Entity',
    icon: <MobIcon />,
    category: 'Core',
    comingSoon: false,
    requiresExporter: [],
  },
  {
    id: 'core.event',
    name: 'Event Handler',
    icon: <EventIcon />,
    category: 'Core',
    comingSoon: false,
    requiresExporter: [],
  },
  {
    id: 'advanced.dimension',
    name: 'Dimension',
    icon: <BlockIcon />,
    category: 'Advanced',
    comingSoon: true,
    requiresExporter: [],
  },
  {
    id: 'advanced.biome',
    name: 'Biome',
    icon: <BlockIcon />,
    category: 'Advanced',
    comingSoon: true,
    requiresExporter: [],
  },
];

const FeaturesPanel: React.FC<FeaturesPanelProps> = ({
  project,
  selectedFeature,
  onSelectFeature,
  onAddFeature,
  onDeleteFeature,
  onRenameFeature,
  onDuplicateFeature,
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    feature: any;
  } | null>(null);
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    feature: any;
    newName: string;
  }>({ open: false, feature: null, newName: '' });

  const featureIcons: Record<string, React.ReactElement> = {
    'core.block': <BlockIcon />,
    'core.item': <ItemIcon />,
    'core.recipe': <RecipeIcon />,
    'core.mob': <MobIcon />,
    'core.event': <EventIcon />,
  };

  const handleContextMenu = (event: React.MouseEvent, feature: any) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            feature,
          }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleOpenEditor = () => {
    if (contextMenu) {
      onSelectFeature(contextMenu.feature);
      handleCloseContextMenu();
    }
  };

  const handleDelete = () => {
    if (contextMenu) {
      onDeleteFeature(contextMenu.feature.id);
      handleCloseContextMenu();
    }
  };

  const handleRenameClick = () => {
    if (contextMenu) {
      setRenameDialog({
        open: true,
        feature: contextMenu.feature,
        newName: contextMenu.feature.name,
      });
      handleCloseContextMenu();
    }
  };

  const handleRenameSubmit = () => {
    if (renameDialog.feature) {
      onRenameFeature(renameDialog.feature.id, renameDialog.newName);
      setRenameDialog({ open: false, feature: null, newName: '' });
    }
  };

  const handleDuplicate = () => {
    if (contextMenu && onDuplicateFeature) {
      onDuplicateFeature(contextMenu.feature);
      handleCloseContextMenu();
    }
  };

  const isFeatureAvailable = (feature: typeof AVAILABLE_FEATURES[0]) => {
    // Check if coming soon
    if (feature.comingSoon) return false;

    // Check if exporter supports it
    const primaryTarget = project.targets?.find((t: any) => t.primary);
    if (feature.requiresExporter.length > 0 && primaryTarget) {
      if (!feature.requiresExporter.includes(primaryTarget.platform)) {
        return false;
      }
    }

    // Check if plugin is enabled (future feature)
    // TODO: Check plugin status

    return true;
  };

  const getFeatureStatus = (feature: typeof AVAILABLE_FEATURES[0]) => {
    if (feature.comingSoon) return 'Coming Soon';

    const primaryTarget = project.targets?.find((t: any) => t.primary);
    if (feature.requiresExporter.length > 0 && primaryTarget) {
      if (!feature.requiresExporter.includes(primaryTarget.platform)) {
        return `Not available for ${primaryTarget.platform}`;
      }
    }

    return null;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Features List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Features ({project.features?.length || 0})
        </Typography>

        {project.features?.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.5, mb: 1 }}>
              No features yet
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              Click + to add features
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ p: 0 }}>
            {project.features?.map((feature: any) => (
              <ListItem
                key={feature.id}
                disablePadding
                onContextMenu={(e) => handleContextMenu(e, feature)}
              >
                <ListItemButton
                  selected={selectedFeature?.id === feature.id}
                  onClick={() => onSelectFeature(feature)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {featureIcons[feature.type] || <BlockIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.name}
                    secondary={feature.type.split('.')[1]}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContextMenu(e as any, feature);
                    }}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add Feature Button */}
      <Fab
        color="primary"
        size="medium"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={() => setAddDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Add Feature Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Feature</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
            Select a feature to add to your mod
          </Typography>

          <List>
            {AVAILABLE_FEATURES.map((feature) => {
              const available = isFeatureAvailable(feature);
              const status = getFeatureStatus(feature);

              return (
                <React.Fragment key={feature.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      disabled={!available}
                      onClick={() => {
                        if (available) {
                          onAddFeature(feature.id);
                          setAddDialogOpen(false);
                        }
                      }}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon sx={{ opacity: available ? 1 : 0.3 }}>
                        {feature.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.name}
                        secondary={feature.category}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500,
                          sx: { opacity: available ? 1 : 0.5 }
                        }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      {status && (
                        <Chip
                          label={status}
                          size="small"
                          sx={{ opacity: 0.7 }}
                          color={feature.comingSoon ? 'warning' : 'default'}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  {feature.category === 'Core' && AVAILABLE_FEATURES[AVAILABLE_FEATURES.indexOf(feature) + 1]?.category !== 'Core' && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleOpenEditor}>
          <ListItemIcon>
            <OpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open Editor</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRenameClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false, feature: null, newName: '' })}>
        <DialogTitle>Rename Feature</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Feature Name"
            fullWidth
            value={renameDialog.newName}
            onChange={(e) => setRenameDialog({ ...renameDialog, newName: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialog({ open: false, feature: null, newName: '' })}>
            Cancel
          </Button>
          <Button onClick={handleRenameSubmit} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeaturesPanel;
