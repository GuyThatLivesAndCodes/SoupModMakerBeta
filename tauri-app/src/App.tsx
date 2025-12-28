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
  const [openSourceFile, setOpenSourceFile] = useState<{ path: string; content: string } | null>(null);
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

  const createNewProject = (projectData?: any) => {
    // Reset state when creating new project
    setSelectedFeature(null);
    setOpenSourceFile(null);

    // Create project from wizard data or template data
    const metadata = {
      name: projectData?.name || 'My First Mod',
      modId: projectData?.modId || 'myfirstmod',
      namespace: projectData?.namespace || 'myfirstmod',
      description: projectData?.description || '',
      version: projectData?.version || '1.0.0',
      authors: projectData?.authors || ['You'],
    };

    const platform = projectData?.platform || 'forge';
    const minecraftVersion = projectData?.minecraftVersion || '1.20.4';

    setCurrentProject({
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

  const handleSaveProject = () => {
    // TODO: Implement actual save logic using Tauri
    console.log('Saving project...', currentProject);
    setShowAutoSaveNotif(true);
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
        onOpenProject={() => {
          // TODO: Implement open project
          alert('Open Project functionality coming soon!\n\nThis will allow you to browse and open existing projects.');
          console.log('Open project');
        }}
        onSaveProject={handleSaveProject}
        onSaveAndClose={() => {
          handleSaveProject();
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
              onSelectFeature={setSelectedFeature}
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
              deletedFeatureId={selectedFeature?.id}
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
