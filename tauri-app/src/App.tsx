/**
 * Main Application Component
 */

import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import EnhancedToolbar from './components/EnhancedToolbar';
import LeftPanelSystem from './components/LeftPanelSystem';
import EditorTabSystem from './components/EditorTabSystem';
import WelcomeScreen from './components/WelcomeScreen';
import { useAutoSave } from './hooks/useAutoSave';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showAutoSaveNotif, setShowAutoSaveNotif] = useState(false);

  // Auto-save functionality
  const { lastSaved, isSaving } = useAutoSave(currentProject, {
    enabled: currentProject !== null,
    interval: 300000, // 5 minutes
    onSaveSuccess: () => {
      setShowAutoSaveNotif(true);
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
    },
  });

  const createNewProject = () => {
    setCurrentProject({
      id: `project_${Date.now()}`,
      metadata: {
        name: 'My First Mod',
        modId: 'myfirstmod',
        namespace: 'myfirstmod',
        version: '1.0.0',
        authors: ['You'],
      },
      features: [],
      targets: [
        { platform: 'forge', minecraftVersion: '1.20.4', primary: true },
      ],
      assets: {
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
          platform: 'forge',
          autoIncrementVersion: false,
          includeJavadocs: false,
        },
      },
      timestamps: {
        created: Date.now(),
        modified: Date.now(),
      },
    });
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

  const handleSaveProject = () => {
    // TODO: Implement actual save logic using Tauri
    console.log('Saving project...', currentProject);
    setShowAutoSaveNotif(true);
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log('Exporting project...');
  };

  const handleExportAndTest = () => {
    // TODO: Implement export and test logic
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
        onOpenProject={() => {
          // TODO: Implement open project
          console.log('Open project');
        }}
        onSaveProject={handleSaveProject}
        onSaveAndClose={() => {
          handleSaveProject();
          setCurrentProject(null);
        }}
        onCloseProject={() => {
          // TODO: Check if dirty and show confirmation
          setCurrentProject(null);
        }}
        onExport={handleExport}
        onExportAndTest={handleExportAndTest}
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
              onSelectFeature={setSelectedFeature}
              onAddFeature={handleAddFeature}
              onUpdateFeature={handleUpdateFeature}
              onDeleteFeature={handleDeleteFeature}
              onRenameFeature={handleRenameFeature}
              onUpdateProject={setCurrentProject}
            />

            {/* Editor Tab System */}
            <EditorTabSystem
              project={currentProject}
              onUpdateFeature={handleUpdateFeature}
              openFeature={selectedFeature}
            />
          </>
        ) : (
          <WelcomeScreen
            onNewProject={createNewProject}
            onOpenProject={() => {
              // TODO: Implement open project
              console.log('Open project');
            }}
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
    </Box>
  );
};

export default App;
