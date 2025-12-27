/**
 * Sounds Panel - Upload and manage sound files
 */

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  VolumeUp as SoundIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

interface SoundsPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const SoundsPanel: React.FC<SoundsPanelProps> = ({ project, onUpdateProject }) => {
  const sounds = project.assets?.sounds || [];

  const handleUploadSound = async () => {
    // TODO: Implement sound upload using Tauri dialog
    console.log('Upload sound');
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
  };

  const handlePlaySound = (sound: any) => {
    // TODO: Implement sound playback
    console.log('Play sound:', sound);
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
            Click + to upload sound files (.ogg)
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {sounds.map((sound: any) => (
              <Grid item xs={12} key={sound.id}>
                <Card>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SoundIcon sx={{ mr: 1, opacity: 0.7 }} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>
                        {sound.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {sound.duration || '0:00'} • {sound.size || 'Unknown size'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePlaySound(sound)}
                    >
                      <PlayIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSound(sound.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Fab
        color="primary"
        size="medium"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={handleUploadSound}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default SoundsPanel;
