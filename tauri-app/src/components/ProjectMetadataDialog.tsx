/**
 * Project Metadata Editor Dialog
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

interface ProjectMetadataDialogProps {
  open: boolean;
  project: any;
  onClose: () => void;
  onSave: (metadata: any) => void;
}

const ProjectMetadataDialog: React.FC<ProjectMetadataDialogProps> = ({
  open,
  project,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    modId: '',
    namespace: '',
    description: '',
    version: '',
    authors: [] as string[],
  });
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    if (project && open) {
      setFormData({
        name: project.metadata?.name || '',
        modId: project.metadata?.modId || '',
        namespace: project.metadata?.namespace || '',
        description: project.metadata?.description || '',
        version: project.metadata?.version || '1.0.0',
        authors: project.metadata?.authors || [],
      });
    }
  }, [project, open]);

  const handleSave = () => {
    onSave({
      ...project.metadata,
      ...formData,
    });
    onClose();
  };

  const handleAddAuthor = () => {
    if (newAuthor.trim() && !formData.authors.includes(newAuthor.trim())) {
      setFormData({
        ...formData,
        authors: [...formData.authors, newAuthor.trim()],
      });
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (author: string) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((a) => a !== author),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="The display name of your mod/plugin"
          />
          <TextField
            fullWidth
            label="Mod ID"
            value={formData.modId}
            onChange={(e) => setFormData({ ...formData, modId: e.target.value })}
            helperText="Unique identifier for your mod"
          />
          <TextField
            fullWidth
            label="Namespace"
            value={formData.namespace}
            onChange={(e) => setFormData({ ...formData, namespace: e.target.value })}
            helperText="Resource namespace (usually same as mod ID)"
          />
          <TextField
            fullWidth
            label="Version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            helperText="Current version (e.g., 1.0.0)"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            helperText="Brief description of your mod"
          />

          {/* Authors */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Authors
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                label="Add Author"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAuthor();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <IconButton color="primary" onClick={handleAddAuthor}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.authors.map((author) => (
                <Chip
                  key={author}
                  label={author}
                  onDelete={() => handleRemoveAuthor(author)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectMetadataDialog;
