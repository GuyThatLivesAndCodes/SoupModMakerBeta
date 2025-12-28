/**
 * Main Application Component
 */

import React, { useState } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { join } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import EnhancedToolbar from './components/EnhancedToolbar';
import LeftPanelSystem from './components/LeftPanelSystem';
import EditorTabSystem from './components/EditorTabSystem';
import WelcomeScreen from './components/WelcomeScreen';
import { useAutoSave } from './hooks/useAutoSave';
import {
  createProjectOnDisk,
  loadProjectFromDisk,
  saveProjectToDisk,
  ProjectData,
} from './utils/projectFileSystem';
import {
  detectExternalEdits,
  syncAllFeaturesFromDisk,
  checkFeatureModified,
  syncFeatureFromDisk,
} from './utils/externalEditDetection';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [openSourceFile, setOpenSourceFile] = useState<{ path: string; content: string } | null>(null);
  const [showAutoSaveNotif, setShowAutoSaveNotif] = useState(false);
  const [externalEditDialog, setExternalEditDialog] = useState<{
    open: boolean;
    modifiedFiles: string[];
  }>({ open: false, modifiedFiles: [] });
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    details?: string;
  }>({ open: false, title: '', message: '', details: '' });

  // Auto-save functionality
  const { lastSaved, isSaving } = useAutoSave(currentProject, {
    enabled: currentProject !== null,
    interval: 300000, // 5 minutes
    onSaveSuccess: () => {
      setShowAutoSaveNotif(true);
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
      showError('Auto-save Failed', 'Failed to automatically save your project.', error);
    },
  });

  // Helper to show error dialog
  const showError = (title: string, message: string, details?: any) => {
    console.error(`${title}:`, message, details);
    setErrorDialog({
      open: true,
      title,
      message,
      details: details ? (typeof details === 'string' ? details : (details instanceof Error ? details.message : JSON.stringify(details, null, 2))) : undefined,
    });
  };

  const createNewProject = async (projectData?: any) => {
    // Reset state when creating new project
    setSelectedFeature(null);
    setOpenSourceFile(null);

    try {
      // Create project from wizard data or template data
      const metadata = {
        name: projectData?.name || 'My First Mod',
        modId: projectData?.modId || 'myfirstmod',
        namespace: projectData?.namespace || 'myfirstmod',
        description: projectData?.description || '',
        version: projectData?.version || '1.0.0',
        authors: projectData?.authors || ['You'],
        platform: projectData?.platform || 'forge',
        minecraftVersion: projectData?.minecraftVersion || '1.20.4',
      };

      const platform = projectData?.platform || 'forge';
      const minecraftVersion = projectData?.minecraftVersion || '1.20.4';

      const newProject: ProjectData = {
        id: `project_${Date.now()}`,
        metadata,
        features: projectData?.features || [],
        targets: [
          {
            platform,
            minecraftVersion,
            primary: true
          },
        ],
        assets: projectData?.assets || {
          textures: [],
          models: [],
          sounds: [],
        },
        plugins: [],
        settings: {
          javaVersion: 17,
          build: {
            outputDir: 'build',
            includeSources: false,
            obfuscate: false,
          },
          development: {
            hotReload: false,
            debug: true,
            autoSave: true,
          },
          export: {
            platform,
            autoIncrementVersion: false,
            includeJavadocs: false,
          },
        },
        timestamps: {
          created: Date.now(),
          modified: Date.now(),
        },
        manuallyEditedFiles: [],
      };

      // Create project directory path
      if (projectData?.projectPath) {
        const projectDirName = metadata.name.replace(/\s+/g, '');
        const projectPath = await join(projectData.projectPath, projectDirName);
        newProject.projectPath = projectPath;

        // Create project files on disk
        await createProjectOnDisk(projectPath, newProject);

        console.log(`Project created successfully at: ${projectPath}`);
      }

      setCurrentProject(newProject);
    } catch (error) {
      showError(
        'Failed to Create Project',
        'An error occurred while creating your project.',
        error
      );
    }
  };

  const handleAddFeature = (type: string) => {
    const featureNames: Record<string, string> = {
      'core.block': 'Block',
      'core.item': 'Item',
      'core.recipe': 'Recipe',
      'core.mob': 'Mob',
      'core.event': 'Event',
    };

    const newFeature = {
      id: `feature_${Date.now()}`,
      type,
      name: `New ${featureNames[type] || type.split('.')[1]}`,
      data: {},
      enabled: true,
    };

    setCurrentProject({
      ...currentProject,
      features: [...(currentProject.features || []), newFeature],
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });

    setSelectedFeature(newFeature);
  };

  const handleUpdateFeature = (updated: any) => {
    setCurrentProject({
      ...currentProject,
      features: currentProject.features.map((f: any) =>
        f.id === updated.id ? updated : f
      ),
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });
    setSelectedFeature(updated);
  };

  const handleDeleteFeature = (featureId: string) => {
    setCurrentProject({
      ...currentProject,
      features: currentProject.features.filter((f: any) => f.id !== featureId),
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });
    if (selectedFeature?.id === featureId) {
      setSelectedFeature(null);
    }
  };

  const handleRenameFeature = (featureId: string, newName: string) => {
    setCurrentProject({
      ...currentProject,
      features: currentProject.features.map((f: any) =>
        f.id === featureId ? { ...f, name: newName } : f
      ),
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });
  };

  const handleDuplicateFeature = (feature: any) => {
    const duplicated = {
      ...feature,
      id: `feature_${Date.now()}`,
      name: `${feature.name} (Copy)`,
    };

    setCurrentProject({
      ...currentProject,
      features: [...currentProject.features, duplicated],
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });

    // Select the duplicated feature
    setSelectedFeature(duplicated);
  };

  const handleSelectFeature = async (feature: any) => {
    if (!currentProject) {
      setSelectedFeature(feature);
      return;
    }

    try {
      // Check if this specific feature has been modified externally
      const isModified = await checkFeatureModified(currentProject, feature);
      if (isModified) {
        // Sync the feature from disk
        const syncedFeature = await syncFeatureFromDisk(currentProject, feature);
        if (syncedFeature) {
          // Update the feature in the project
          const updatedFeatures = currentProject.features.map((f: any) =>
            f.id === feature.id ? syncedFeature : f
          );

          setCurrentProject({
            ...currentProject,
            features: updatedFeatures,
            timestamps: {
              ...currentProject.timestamps,
              modified: Date.now(),
            },
          });

          // Show notification that external changes were detected
          setExternalEditDialog({
            open: true,
            modifiedFiles: [`Feature "${feature.name}" was updated from external edits`],
          });

          setSelectedFeature(syncedFeature);
          return;
        }
      }
    } catch (error) {
      showError(
        'Failed to Check External Edits',
        `Could not check if feature "${feature.name}" was modified externally.`,
        error
      );
    }

    // No external changes, just select the feature normally
    setSelectedFeature(feature);
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;

    try {
      if (currentProject.projectPath) {
        await saveProjectToDisk(currentProject);
        setShowAutoSaveNotif(true);
        console.log('Project saved successfully');
      } else {
        showError(
          'Cannot Save Project',
          'This project does not have a file location. Please create a new project with a location or open an existing project.',
          'Missing projectPath'
        );
      }
    } catch (error) {
      showError(
        'Failed to Save Project',
        'An error occurred while saving your project.',
        error
      );
    }
  };

  const handleOpenProject = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Open SoupModMaker Project',
      });

      if (selected && typeof selected === 'string') {
        // Reset state
        setSelectedFeature(null);
        setOpenSourceFile(null);

        // Load project from disk
        const loadedProject = await loadProjectFromDisk(selected);

        // Check for external edits
        const editResult = await detectExternalEdits(loadedProject);
        if (editResult.hasChanges) {
          // Show dialog and sync changes
          setExternalEditDialog({
            open: true,
            modifiedFiles: editResult.modifiedFiles,
          });

          // Sync features from disk
          const syncedFeatures = await syncAllFeaturesFromDisk(loadedProject);
          loadedProject.features = syncedFeatures;
          loadedProject.timestamps.modified = Date.now();
        }

        setCurrentProject(loadedProject);
        console.log(`Project loaded successfully from: ${selected}`);
      }
    } catch (error) {
      showError(
        'Failed to Open Project',
        'Could not open the selected project. Make sure the project folder contains a valid project.json file.',
        error
      );
    }
  };

  const handleUpdateMetadata = (metadata: any) => {
    setCurrentProject({
      ...currentProject,
      metadata,
      timestamps: {
        ...currentProject.timestamps,
        modified: Date.now(),
      },
    });
  };

  const handleExport = () => {
    // TODO: Implement export logic
    alert('Export functionality coming soon!\n\nThis will build your mod into a JAR file.');
    console.log('Exporting project...');
  };

  const handleExportAndTest = () => {
    // TODO: Implement export and test logic
    alert('Export & Test functionality coming soon!\n\nThis will build and launch Minecraft with your mod installed for testing.');
    console.log('Exporting and testing...');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Enhanced Toolbar */}
      <EnhancedToolbar
        currentProject={currentProject}
        onNewProject={createNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onSaveAndClose={async () => {
          await handleSaveProject();
          setSelectedFeature(null);
          setOpenSourceFile(null);
          setCurrentProject(null);
        }}
        onCloseProject={() => {
          // TODO: Check if dirty and show confirmation
          setSelectedFeature(null);
          setOpenSourceFile(null);
          setCurrentProject(null);
        }}
        onExport={handleExport}
        onExportAndTest={handleExportAndTest}
        onUpdateMetadata={handleUpdateMetadata}
        isDirty={false}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {currentProject ? (
          <>
            {/* Left Panel System */}
            <LeftPanelSystem
              project={currentProject}
              selectedFeature={selectedFeature}
              onSelectFeature={handleSelectFeature}
              onAddFeature={handleAddFeature}
              onUpdateFeature={handleUpdateFeature}
              onDeleteFeature={handleDeleteFeature}
              onRenameFeature={handleRenameFeature}
              onDuplicateFeature={handleDuplicateFeature}
              onUpdateProject={setCurrentProject}
              onOpenSourceFile={setOpenSourceFile}
            />

            {/* Editor Tab System */}
            <EditorTabSystem
              key={currentProject.id}
              project={currentProject}
              onUpdateFeature={handleUpdateFeature}
              openFeature={selectedFeature}
              openSourceFile={openSourceFile || undefined}
            />
          </>
        ) : (
          <WelcomeScreen
            onNewProject={createNewProject}
            onOpenProject={handleOpenProject}
          />
        )}
      </Box>

      {/* Auto-save notification */}
      <Snackbar
        open={showAutoSaveNotif}
        autoHideDuration={3000}
        onClose={() => setShowAutoSaveNotif(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowAutoSaveNotif(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Project saved successfully
        </Alert>
      </Snackbar>

      {/* External edit notification dialog */}
      <Dialog
        open={externalEditDialog.open}
        onClose={() => setExternalEditDialog({ open: false, modifiedFiles: [] })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>External Changes Detected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following files have been modified outside of SoupModMaker and have been synced:
          </DialogContentText>
          <Box
            component="ul"
            sx={{
              mt: 2,
              pl: 2,
              maxHeight: 200,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {externalEditDialog.modifiedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </Box>
          <DialogContentText sx={{ mt: 2 }}>
            Changes from external editors have been automatically loaded into SoupModMaker.
            You can continue working with the updated files.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setExternalEditDialog({ open: false, modifiedFiles: [] })}
            variant="contained"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error dialog */}
      <Dialog
        open={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, title: '', message: '', details: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>{errorDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDialog.message}</DialogContentText>
          {errorDialog.details && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                maxHeight: 200,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {errorDialog.details}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setErrorDialog({ open: false, title: '', message: '', details: '' })}
            variant="contained"
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
