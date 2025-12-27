/**
 * Application Toolbar
 */

import React from 'react';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  FolderOpen as OpenIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  PlayArrow as ExportIcon,
} from '@mui/icons-material';

interface ToolbarProps {
  currentProject: any;
  onNewProject: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentProject, onNewProject }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <MuiToolbar variant="dense" sx={{ minHeight: 48 }}>
        {/* App Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mr: 3,
          }}
        >
          SoupModMaker
        </Typography>

        {/* Actions */}
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={onNewProject}
          sx={{ mr: 1 }}
        >
          New
        </Button>

        <Button startIcon={<OpenIcon />} size="small" sx={{ mr: 1 }}>
          Open
        </Button>

        {currentProject && (
          <>
            <Button startIcon={<SaveIcon />} size="small" sx={{ mr: 1 }}>
              Save
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            {/* Project Name */}
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.7 }}>
              {currentProject.metadata.name}
            </Typography>

            <Button
              startIcon={<ExportIcon />}
              size="small"
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
            >
              Export
            </Button>

            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
