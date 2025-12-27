/**
 * Project Sidebar
 */

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  ViewInAr as BlockIcon,
  Inventory as ItemIcon,
  Restaurant as RecipeIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  project: any;
  selectedFeature: any;
  onSelectFeature: (feature: any) => void;
  onAddFeature: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  project,
  selectedFeature,
  onSelectFeature,
  onAddFeature,
}) => {
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);

  const featureIcons: Record<string, React.ReactElement> = {
    'core.block': <BlockIcon />,
    'core.item': <ItemIcon />,
    'core.recipe': <RecipeIcon />,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
            Project Structure
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Target Platforms */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{ opacity: 0.7, textTransform: 'uppercase', mb: 1 }}
          >
            Targets
          </Typography>
          {project.targets.map((target: any, idx: number) => (
            <Chip
              key={idx}
              label={`${target.platform} ${target.minecraftVersion}`}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
              color={target.primary ? 'primary' : 'default'}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Features List */}
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, textTransform: 'uppercase', mb: 1 }}
        >
          Features ({project.features.length})
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', pt: 0 }}>
        {project.features.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              No features yet
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              Click + to add features
            </Typography>
          </Box>
        ) : (
          project.features.map((feature: any) => (
            <ListItem key={feature.id} disablePadding>
              <ListItemButton
                selected={selectedFeature?.id === feature.id}
                onClick={() => onSelectFeature(feature)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {featureIcons[feature.type] || <BlockIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={feature.name}
                  secondary={feature.type.replace('core.', '')}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <IconButton size="small" edge="end">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      {/* Add Feature Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            onAddFeature('core.block');
            setAddMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Block</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onAddFeature('core.item');
            setAddMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <ItemIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Item</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onAddFeature('core.recipe');
            setAddMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <RecipeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Recipe</ListItemText>
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;
