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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

interface TexturesPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const TexturesPanel: React.FC<TexturesPanelProps> = ({ project, onUpdateProject }) => {
  const textures = project.assets?.textures || [];

  const handleUploadTexture = async () => {
    // TODO: Implement texture upload using Tauri dialog
    console.log('Upload texture');
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
            Click + to upload textures
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {textures.map((texture: any) => (
              <Grid item xs={6} key={texture.id}>
                <Card>
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
                      onClick={() => handleDeleteTexture(texture.id)}
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
        onClick={handleUploadTexture}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default TexturesPanel;
