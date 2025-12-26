/**
 * Main Application Component
 */

import React, { useState } from 'react';
import { Box } from '@mui/material';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

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
      {/* Title Bar / Toolbar */}
      <Toolbar
        currentProject={currentProject}
        onNewProject={() => {
          // Handle new project
          setCurrentProject({
            id: 'test',
            metadata: {
              name: 'My First Mod',
              modId: 'myfirstmod',
              version: '1.0.0',
              authors: ['You'],
            },
            features: [],
            targets: [
              { platform: 'forge', minecraftVersion: '1.20.4', primary: true },
            ],
          });
        }}
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
            {/* Sidebar */}
            <Sidebar
              project={currentProject}
              selectedFeature={selectedFeature}
              onSelectFeature={setSelectedFeature}
              onAddFeature={(type) => {
                const newFeature = {
                  id: `feature_${Date.now()}`,
                  type,
                  name: 'New ' + type,
                  data: {},
                  enabled: true,
                };
                setCurrentProject({
                  ...currentProject,
                  features: [...currentProject.features, newFeature],
                });
                setSelectedFeature(newFeature);
              }}
            />

            {/* Editor Area */}
            <EditorArea
              project={currentProject}
              selectedFeature={selectedFeature}
              onUpdateFeature={(updated) => {
                setCurrentProject({
                  ...currentProject,
                  features: currentProject.features.map((f: any) =>
                    f.id === updated.id ? updated : f
                  ),
                });
                setSelectedFeature(updated);
              }}
            />
          </>
        ) : (
          <WelcomeScreen
            onNewProject={() => {
              setCurrentProject({
                id: 'test',
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
                assets: [],
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
                  },
                  export: {
                    autoIncrementVersion: false,
                    includeJavadocs: false,
                  },
                },
                timestamps: {
                  created: Date.now(),
                  modified: Date.now(),
                },
              });
            }}
            onOpenProject={() => {
              // Handle open project
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;
