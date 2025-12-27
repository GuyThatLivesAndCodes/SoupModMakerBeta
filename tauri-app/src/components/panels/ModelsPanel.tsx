/**
 * Models Panel - Upload and manage 3D models
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
  ViewInAr as ModelIcon,
} from '@mui/icons-material';

interface ModelsPanelProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const ModelsPanel: React.FC<ModelsPanelProps> = ({ project, onUpdateProject }) => {
  const models = project.assets?.models || [];

  const handleUploadModel = async () => {
    // TODO: Implement model upload using Tauri dialog
    console.log('Upload model');
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
            Click + to upload models (.json, .obj)
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {models.map((model: any) => (
              <Grid item xs={12} key={model.id}>
                <Card>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ModelIcon sx={{ mr: 1, opacity: 0.7 }} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500 }}>
                        {model.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {model.type || 'JSON'} • {model.size || 'Unknown size'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteModel(model.id)}
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
        onClick={handleUploadModel}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ModelsPanel;
