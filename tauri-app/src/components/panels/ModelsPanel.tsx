/**
 * Models Panel - Upload and manage 3D models
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ViewInAr as ModelIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Build as CreateIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { open } from '@tauri-apps/plugin-dialog';

interface ModelsPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const ModelsPanel: React.FC<ModelsPanelProps> = ({ project, onUpdateProject }) => {
  const models = project.assets?.models || [];
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    model: any;
  } | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    description: '',
    filePath: '',
    type: '',
  });
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    model: any;
    newName: string;
  }>({ open: false, model: null, newName: '' });

  const handleSelectFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Models',
          extensions: ['json', 'obj', 'fbx', 'gltf']
        }]
      });

      if (selected && typeof selected === 'string') {
        const fileName = selected.split(/[\\/]/).pop() || 'model';
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        const ext = fileName.split('.').pop()?.toUpperCase() || 'JSON';

        setUploadData({
          ...uploadData,
          filePath: selected,
          name: uploadData.name || nameWithoutExt,
          type: ext,
        });
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleUploadModel = () => {
    setAddMenuAnchor(null);
    setUploadDialog(true);
  };

  const handleCreateModel = () => {
    setAddMenuAnchor(null);
    alert('Model Creator coming soon!');
  };

  const handleUploadSubmit = () => {
    if (!uploadData.name || !uploadData.filePath) {
      alert('Please select a file and enter a name');
      return;
    }

    const newModel = {
      id: `model_${Date.now()}`,
      name: uploadData.name,
      description: uploadData.description,
      filePath: uploadData.filePath,
      type: uploadData.type,
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        models: [...models, newModel],
      },
    });

    setUploadDialog(false);
    setUploadData({ name: '', description: '', filePath: '', type: '' });
  };

  const handleDeleteModel = (modelId: string) => {
    const updatedModels = models.filter((m: any) => m.id !== modelId);
    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        models: updatedModels,
      },
    });
    setContextMenu(null);
  };

  const handleDuplicateModel = (model: any) => {
    const duplicated = {
      ...model,
      id: `model_${Date.now()}`,
      name: `${model.name} (Copy)`,
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        models: [...models, duplicated],
      },
    });
    setContextMenu(null);
  };

  const handleRenameClick = (model: any) => {
    setRenameDialog({
      open: true,
      model,
      newName: model.name,
    });
    setContextMenu(null);
  };

  const handleRenameSubmit = () => {
    if (!renameDialog.model) return;

    const updatedModels = models.map((m: any) =>
      m.id === renameDialog.model.id ? { ...m, name: renameDialog.newName } : m
    );

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        models: updatedModels,
      },
    });

    setRenameDialog({ open: false, model: null, newName: '' });
  };

  const handleContextMenu = (event: React.MouseEvent, model: any) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      model,
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Models ({models.length})
      </Typography>

      {models.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <ModelIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.5, mb: 1 }}>
            No models yet
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            Click + to upload or create models
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {models.map((model: any) => (
              <Grid item xs={12} key={model.id}>
                <Card
                  onContextMenu={(e) => handleContextMenu(e, model)}
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ModelIcon sx={{ mr: 1, opacity: 0.7 }} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>
                        {model.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e as any, model);
                        }}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {model.type || 'JSON'} • {model.description || 'No description'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Add Button */}
      <Fab
        color="primary"
        size="medium"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={(e) => setAddMenuAnchor(e.currentTarget)}
      >
        <AddIcon />
      </Fab>

      {/* Add Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
      >
        <MenuItem onClick={handleCreateModel}>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Model</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUploadModel}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Model</ListItemText>
        </MenuItem>
      </Menu>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => { alert('Model editor coming soon!'); setContextMenu(null); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open Editor</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleRenameClick(contextMenu.model)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleDuplicateModel(contextMenu.model)}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => contextMenu && handleDeleteModel(contextMenu.model.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Model</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              fullWidth
              onClick={handleSelectFile}
            >
              {uploadData.filePath ? 'Change File' : 'Select Model File (.json, .obj, .fbx, .gltf)'}
            </Button>
            {uploadData.filePath && (
              <Typography variant="body2" color="success.main">
                Selected: {uploadData.filePath.split(/[\\/]/).pop()}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Model Name"
              value={uploadData.name}
              onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setUploadDialog(false);
            setUploadData({ name: '', description: '', filePath: '', type: '' });
          }}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained" disabled={!uploadData.filePath || !uploadData.name}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false, model: null, newName: '' })}>
        <DialogTitle>Rename Model</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Model Name"
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
          <Button onClick={() => setRenameDialog({ open: false, model: null, newName: '' })}>
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

export default ModelsPanel;
