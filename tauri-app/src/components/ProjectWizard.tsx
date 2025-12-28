/**
 * Project Creation Wizard - Multi-step wizard for creating new projects
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import { FolderOpen as FolderIcon } from '@mui/icons-material';
import { open as openDialog } from '@tauri-apps/plugin-dialog';

interface ProjectWizardProps {
  open: boolean;
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ open, onClose, onCreate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectPath, setProjectPath] = useState<string>('');
  const [projectData, setProjectData] = useState({
    name: '',
    modId: '',
    namespace: '',
    description: '',
    version: '1.0.0',
    authors: '',
    platform: 'forge',
    minecraftVersion: '1.20.4',
  });

  const handleSelectDirectory = async () => {
    try {
      const selected = await openDialog({
        directory: true,
        multiple: false,
        title: 'Select Project Location',
      });

      if (selected && typeof selected === 'string') {
        setProjectPath(selected);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };

  const steps = ['Project Details', 'Platform Selection', 'Review'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Create project
      const authorsArray = projectData.authors
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      onCreate({
        name: projectData.name,
        modId: projectData.modId || projectData.name.toLowerCase().replace(/\s+/g, ''),
        namespace: projectData.namespace || projectData.name.toLowerCase().replace(/\s+/g, ''),
        description: projectData.description,
        version: projectData.version,
        authors: authorsArray.length > 0 ? authorsArray : ['You'],
        platform: projectData.platform,
        minecraftVersion: projectData.minecraftVersion,
        projectPath,
      });
      handleClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setProjectPath('');
    setProjectData({
      name: '',
      modId: '',
      namespace: '',
      description: '',
      version: '1.0.0',
      authors: '',
      platform: 'forge',
      minecraftVersion: '1.20.4',
    });
    onClose();
  };

  const canProceed = () => {
    if (activeStep === 0) {
      return projectData.name.trim().length > 0 && projectPath.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Alert severity="info">
              Choose where to save your project files
            </Alert>
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              onClick={handleSelectDirectory}
              fullWidth
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              {projectPath || 'Select Project Location'}
            </Button>
            <TextField
              fullWidth
              label="Project Name"
              value={projectData.name}
              onChange={(e) => {
                const name = e.target.value;
                const id = name.toLowerCase().replace(/\s+/g, '');
                setProjectData({
                  ...projectData,
                  name,
                  modId: id,
                  namespace: id,
                });
              }}
              required
              helperText="The display name of your mod/plugin"
            />
            <TextField
              fullWidth
              label="Mod ID"
              value={projectData.modId}
              onChange={(e) =>
                setProjectData({ ...projectData, modId: e.target.value })
              }
              helperText="Unique identifier (auto-generated from name)"
            />
            <TextField
              fullWidth
              label="Description"
              value={projectData.description}
              onChange={(e) =>
                setProjectData({ ...projectData, description: e.target.value })
              }
              multiline
              rows={3}
              helperText="Brief description of your mod"
            />
            <TextField
              fullWidth
              label="Authors"
              value={projectData.authors}
              onChange={(e) =>
                setProjectData({ ...projectData, authors: e.target.value })
              }
              helperText="Comma-separated list of authors"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Alert severity="info">
              Select the platform and Minecraft version for your mod
            </Alert>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={projectData.platform}
                label="Platform"
                onChange={(e) =>
                  setProjectData({ ...projectData, platform: e.target.value })
                }
              >
                <MenuItem value="forge">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Forge
                    <Chip label="Recommended" size="small" color="primary" />
                  </Box>
                </MenuItem>
                <MenuItem value="fabric">Fabric</MenuItem>
                <MenuItem value="neoforge">NeoForge</MenuItem>
                <MenuItem value="bukkit">Bukkit/Spigot</MenuItem>
                <MenuItem value="paper">Paper</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Minecraft Version</InputLabel>
              <Select
                value={projectData.minecraftVersion}
                label="Minecraft Version"
                onChange={(e) =>
                  setProjectData({ ...projectData, minecraftVersion: e.target.value })
                }
              >
                <MenuItem value="1.21.4">1.21.4</MenuItem>
                <MenuItem value="1.21.3">1.21.3</MenuItem>
                <MenuItem value="1.21.1">1.21.1</MenuItem>
                <MenuItem value="1.21.0">1.21.0</MenuItem>
                <MenuItem value="1.20.6">1.20.6</MenuItem>
                <MenuItem value="1.20.5">1.20.5</MenuItem>
                <MenuItem value="1.20.4">1.20.4 (Recommended)</MenuItem>
                <MenuItem value="1.20.2">1.20.2</MenuItem>
                <MenuItem value="1.20.1">1.20.1</MenuItem>
                <MenuItem value="1.19.4">1.19.4</MenuItem>
                <MenuItem value="1.19.2">1.19.2</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Version"
              value={projectData.version}
              onChange={(e) =>
                setProjectData({ ...projectData, version: e.target.value })
              }
              helperText="Your mod version (e.g., 1.0.0)"
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Alert severity="success">
              Review your project settings before creating
            </Alert>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Project Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {projectData.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Mod ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {projectData.modId}
              </Typography>
            </Box>
            {projectData.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {projectData.description}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Platform
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip label={projectData.platform} color="primary" />
                <Chip label={projectData.minecraftVersion} variant="outlined" />
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Version
              </Typography>
              <Typography variant="body1" gutterBottom>
                {projectData.version}
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={!canProceed()}
        >
          {activeStep === steps.length - 1 ? 'Create Project' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectWizard;
