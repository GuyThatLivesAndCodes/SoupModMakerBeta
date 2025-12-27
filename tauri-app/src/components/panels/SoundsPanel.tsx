/**
 * Sounds Panel - Upload and manage sound files
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
  VolumeUp as SoundIcon,
  PlayArrow as PlayIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Mic as CreateIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { open } from '@tauri-apps/plugin-dialog';

interface SoundsPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const SoundsPanel: React.FC<SoundsPanelProps> = ({ project, onUpdateProject }) => {
  const sounds = project.assets?.sounds || [];
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    sound: any;
  } | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    description: '',
    filePath: '',
  });
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    sound: any;
    newName: string;
  }>({ open: false, sound: null, newName: '' });

  const handleSelectFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Sounds',
          extensions: ['ogg', 'wav', 'mp3']
        }]
      });

      if (selected && typeof selected === 'string') {
        const fileName = selected.split(/[\\/]/).pop() || 'sound';
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

        setUploadData({
          ...uploadData,
          filePath: selected,
          name: uploadData.name || nameWithoutExt,
        });
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleUploadSound = () => {
    setAddMenuAnchor(null);
    setUploadDialog(true);
  };

  const handleCreateSound = () => {
    setAddMenuAnchor(null);
    alert('Sound Recorder coming soon! Will allow recording from microphone with basic editing.');
  };

  const handleUploadSubmit = () => {
    if (!uploadData.name || !uploadData.filePath) {
      alert('Please select a file and enter a name');
      return;
    }

    const newSound = {
      id: `sound_${Date.now()}`,
      name: uploadData.name,
      description: uploadData.description,
      filePath: uploadData.filePath,
      duration: '0:00', // TODO: Calculate actual duration
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        sounds: [...sounds, newSound],
      },
    });

    setUploadDialog(false);
    setUploadData({ name: '', description: '', filePath: '' });
  };

  const handleDeleteSound = (soundId: string) => {
    const updatedSounds = sounds.filter((s: any) => s.id !== soundId);
    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        sounds: updatedSounds,
      },
    });
    setContextMenu(null);
  };

  const handleDuplicateSound = (sound: any) => {
    const duplicated = {
      ...sound,
      id: `sound_${Date.now()}`,
      name: `${sound.name} (Copy)`,
      createdAt: Date.now(),
    };

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        sounds: [...sounds, duplicated],
      },
    });
    setContextMenu(null);
  };

  const handleRenameClick = (sound: any) => {
    setRenameDialog({
      open: true,
      sound,
      newName: sound.name,
    });
    setContextMenu(null);
  };

  const handleRenameSubmit = () => {
    if (!renameDialog.sound) return;

    const updatedSounds = sounds.map((s: any) =>
      s.id === renameDialog.sound.id ? { ...s, name: renameDialog.newName } : s
    );

    onUpdateProject({
      ...project,
      assets: {
        ...project.assets,
        sounds: updatedSounds,
      },
    });

    setRenameDialog({ open: false, sound: null, newName: '' });
  };

  const handleContextMenu = (event: React.MouseEvent, sound: any) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      sound,
    });
  };

  const handlePlaySound = (sound: any) => {
    // TODO: Implement sound playback
    console.log('Play sound:', sound);
    alert('Sound playback coming soon!');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Sounds ({sounds.length})
      </Typography>

      {sounds.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <SoundIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.5, mb: 1 }}>
            No sounds yet
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            Click + to upload or record sounds
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {sounds.map((sound: any) => (
              <Grid item xs={12} key={sound.id}>
                <Card
                  onContextMenu={(e) => handleContextMenu(e, sound)}
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SoundIcon sx={{ mr: 1, opacity: 0.7 }} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>
                        {sound.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e as any, sound);
                        }}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {sound.duration || '0:00'} • {sound.description || 'No description'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0, px: 2, pb: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePlaySound(sound)}
                    >
                      <PlayIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
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
        <MenuItem onClick={handleCreateSound}>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Record Sound</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUploadSound}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Sound</ListItemText>
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
        <MenuItem onClick={() => { alert('Sound editor coming soon!'); setContextMenu(null); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open Editor</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleRenameClick(contextMenu.sound)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleDuplicateSound(contextMenu.sound)}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => contextMenu && handleDeleteSound(contextMenu.sound.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Sound</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              fullWidth
              onClick={handleSelectFile}
            >
              {uploadData.filePath ? 'Change File' : 'Select Sound File (.ogg, .wav, .mp3)'}
            </Button>
            {uploadData.filePath && (
              <Typography variant="body2" color="success.main">
                Selected: {uploadData.filePath.split(/[\\/]/).pop()}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Sound Name"
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
            setUploadData({ name: '', description: '', filePath: '' });
          }}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained" disabled={!uploadData.filePath || !uploadData.name}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false, sound: null, newName: '' })}>
        <DialogTitle>Rename Sound</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Sound Name"
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
          <Button onClick={() => setRenameDialog({ open: false, sound: null, newName: '' })}>
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

export default SoundsPanel;
