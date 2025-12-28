/**
 * Enhanced Toolbar with workspace management actions
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  FolderOpen as OpenIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PlayArrow as TestIcon,
  GetApp as ExportIcon,
  MoreVert as MoreIcon,
  FiberManualRecord as DotIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import ProjectMetadataDialog from './ProjectMetadataDialog';

interface EnhancedToolbarProps {
  currentProject: any;
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAndClose: () => void;
  onCloseProject: () => void;
  onExport: () => void;
  onExportAndTest: () => void;
  onUpdateMetadata?: (metadata: any) => void;
  isDirty?: boolean;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  currentProject,
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveAndClose,
  onCloseProject,
  onExport,
  onExportAndTest,
  onUpdateMetadata,
  isDirty = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar variant="dense">
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, mr: 3 }}>
          SoupModMaker
        </Typography>

        {currentProject ? (
          <>
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
              {currentProject.metadata?.name || 'Untitled Project'}
              {isDirty && ' •'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              <Button
                color="inherit"
                size="small"
                startIcon={<SaveIcon />}
                onClick={onSaveProject}
              >
                Save
              </Button>

              <Button
                color="inherit"
                size="small"
                startIcon={<SaveIcon />}
                onClick={onSaveAndClose}
              >
                Save & Close
              </Button>

              <Button
                color="inherit"
                size="small"
                startIcon={<CloseIcon />}
                onClick={onCloseProject}
              >
                Close
              </Button>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Button
                color="inherit"
                size="small"
                startIcon={<ExportIcon />}
                onClick={onExport}
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Export
              </Button>

              <Button
                color="inherit"
                size="small"
                startIcon={<TestIcon />}
                onClick={onExportAndTest}
                variant="contained"
                sx={{ bgcolor: 'primary.dark' }}
              >
                Export & Test
              </Button>
            </Box>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={onNewProject}
            >
              New Project
            </Button>
            <Button
              color="inherit"
              size="small"
              startIcon={<OpenIcon />}
              onClick={onOpenProject}
            >
              Open Project
            </Button>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { setShowMetadataDialog(true); handleMenuClose(); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Project Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onNewProject(); handleMenuClose(); }}>
            <ListItemText>New Project</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onOpenProject(); handleMenuClose(); }}>
            <ListItemIcon>
              <OpenIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Open Project</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onSaveProject(); handleMenuClose(); }}>
            <ListItemIcon>
              <SaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Save Project</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onExport(); handleMenuClose(); }}>
            <ListItemIcon>
              <ExportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
        </Menu>

        {/* Project Metadata Dialog */}
        {currentProject && (
          <ProjectMetadataDialog
            open={showMetadataDialog}
            project={currentProject}
            onClose={() => setShowMetadataDialog(false)}
            onSave={(metadata) => {
              if (onUpdateMetadata) {
                onUpdateMetadata(metadata);
              }
            }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default EnhancedToolbar;
