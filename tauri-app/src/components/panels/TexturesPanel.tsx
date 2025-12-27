/**
 * Textures Panel - Upload and manage textures
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
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
  TextField,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Palette as CreateIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface TexturesPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const TexturesPanel: React.FC<TexturesPanelProps> = ({ project, onUpdateProject }) => {
  const textures = project.assets?.textures || [];
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    texture: any;
  } | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    tags: [] as string[],
    description: '',
    filePath: '',
  });
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    texture: any;
    newName: string;
  }>({ open: false, texture: null, newName: '' });

  const handleUploadTexture = async () => {
    // TODO: Implement Tauri file picker
    console.log('Upload texture');
    setAddMenuAnchor(null);
    setUploadDialog(true);
  };

  const handleCreateTexture = () => {
    // TODO: Implement texture creator
    console.log('Create texture');
    setAddMenuAnchor(null);
    alert('Texture Creator coming soon!');
  };

  const handleUploadSubmit = () => {
    if (!uploadData.name) return;

    const newTexture = {
      id: `texture_${Date.now()}`,
      name: uploadData.name,
      tags: uploadData.tags,
      description: uploadData.description,
      filePath: uploadData.filePath,
      preview: null, // TODO: Load actual image
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        textures: [...textures, newTexture],
      },
    });

    setUploadDialog(false);
    setUploadData({ name: '', tags: [], description: '', filePath: '' });
  };

  const handleDeleteTexture = (textureId: string) => {
    const updatedTextures = textures.filter((t: any) => t.id !== textureId);
    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        textures: updatedTextures,
      },
    });
    setContextMenu(null);
  };

  const handleDuplicateTexture = (texture: any) => {
    const duplicated = {
      ...texture,
      id: `texture_${Date.now()}`,
      name: `${texture.name} (Copy)`,
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        textures: [...textures, duplicated],
      },
    });
    setContextMenu(null);
  };

  const handleRenameClick = (texture: any) => {
    setRenameDialog({
      open: true,
      texture,
      newName: texture.name,
    });
    setContextMenu(null);
  };

  const handleRenameSubmit = () => {
    if (!renameDialog.texture) return;

    const updatedTextures = textures.map((t: any) =>
      t.id === renameDialog.texture.id ? { ...t, name: renameDialog.newName } : t
    );

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        textures: updatedTextures,
      },
    });

    setRenameDialog({ open: false, texture: null, newName: '' });
  };

  const handleContextMenu = (event: React.MouseEvent, texture: any) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      texture,
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Textures ({textures.length})
      </Typography>

      {textures.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <UploadIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.5, mb: 1 }}>
            No textures yet
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            Click + to upload or create textures
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {textures.map((texture: any) => (
              <Grid item xs={6} key={texture.id}>
                <Card onContextMenu={(e) => handleContextMenu(e, texture)}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 80,
                      bgcolor: 'background.default',
                      backgroundImage: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px`,
                    }}
                  >
                    {texture.preview && (
                      <img
                        src={texture.preview}
                        alt={texture.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
                      />
                    )}
                  </CardMedia>
                  <CardActions sx={{ justifyContent: 'space-between', px: 1, py: 0.5 }}>
                    <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                      {texture.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e as any, texture);
                      }}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Add Button with Menu */}
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
        <MenuItem onClick={handleCreateTexture}>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Texture</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUploadTexture}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Texture</ListItemText>
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
        <MenuItem onClick={() => alert('Texture editor coming soon!')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open Editor</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRenameClick(contextMenu!.texture)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicateTexture(contextMenu!.texture)}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteTexture(contextMenu!.texture.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Texture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button variant="outlined" startIcon={<UploadIcon />} fullWidth>
              Select Texture File (.png)
            </Button>
            <TextField
              fullWidth
              label="Texture Name"
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
            <TextField
              fullWidth
              label="Tags (comma separated)"
              placeholder="block, stone, decorative"
              helperText="Add tags to organize your textures"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false, texture: null, newName: '' })}>
        <DialogTitle>Rename Texture</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Texture Name"
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
          <Button onClick={() => setRenameDialog({ open: false, texture: null, newName: '' })}>
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

export default TexturesPanel;
