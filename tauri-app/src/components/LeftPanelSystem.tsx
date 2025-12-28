/**
 * Left Panel System with tabs for Features, Textures, Models, Sounds, Settings
 */

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import {
  ViewInAr as FeaturesIcon,
  Image as TexturesIcon,
  Category as ModelsIcon,
  VolumeUp as SoundsIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import FeaturesPanel from './panels/FeaturesPanel';
import TexturesPanel from './panels/TexturesPanel';
import ModelsPanel from './panels/ModelsPanel';
import SoundsPanel from './panels/SoundsPanel';
import SettingsPanelComponent from './panels/SettingsPanelComponent';
import SourceFilesPanel from './panels/SourceFilesPanel';

const PANEL_WIDTH = 320;

interface LeftPanelSystemProps {
  project: any;
  selectedFeature: any;
  onSelectFeature: (feature: any) => void;
  onAddFeature: (type: string) => void;
  onUpdateFeature: (feature: any) => void;
  onDeleteFeature: (featureId: string) => void;
  onRenameFeature: (featureId: string, newName: string) => void;
  onDuplicateFeature?: (feature: any) => void;
  onUpdateProject: (project: any) => void;
  onOpenSourceFile?: (file: { path: string; content: string }) => void;
}

const LeftPanelSystem: React.FC<LeftPanelSystemProps> = ({
  project,
  selectedFeature,
  onSelectFeature,
  onAddFeature,
  onUpdateFeature,
  onDeleteFeature,
  onRenameFeature,
  onDuplicateFeature,
  onUpdateProject,
  onOpenSourceFile,
}) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Tab Headers */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 48,
          '& .MuiTab-root': {
            minHeight: 48,
            minWidth: 'auto',
            px: 2,
          },
        }}
      >
        <Tab
          icon={<FeaturesIcon fontSize="small" />}
          iconPosition="start"
          label="Features"
          sx={{ fontSize: '0.75rem' }}
        />
        <Tab
          icon={<TexturesIcon fontSize="small" />}
          iconPosition="start"
          label="Textures"
          sx={{ fontSize: '0.75rem' }}
        />
        <Tab
          icon={<ModelsIcon fontSize="small" />}
          iconPosition="start"
          label="Models"
          sx={{ fontSize: '0.75rem' }}
        />
        <Tab
          icon={<SoundsIcon fontSize="small" />}
          iconPosition="start"
          label="Sounds"
          sx={{ fontSize: '0.75rem' }}
        />
        <Tab
          icon={<CodeIcon fontSize="small" />}
          iconPosition="start"
          label="Source"
          sx={{ fontSize: '0.75rem' }}
        />
        <Tab
          icon={<SettingsIcon fontSize="small" />}
          iconPosition="start"
          label="Settings"
          sx={{ fontSize: '0.75rem' }}
        />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {currentTab === 0 && (
          <FeaturesPanel
            project={project}
            selectedFeature={selectedFeature}
            onSelectFeature={onSelectFeature}
            onAddFeature={onAddFeature}
            onDeleteFeature={onDeleteFeature}
            onRenameFeature={onRenameFeature}
            onDuplicateFeature={onDuplicateFeature}
          />
        )}
        {currentTab === 1 && (
          <TexturesPanel
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}
        {currentTab === 2 && (
          <ModelsPanel
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}
        {currentTab === 3 && (
          <SoundsPanel
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}
        {currentTab === 4 && (
          <SourceFilesPanel
            project={project}
            onOpenFile={onOpenSourceFile}
          />
        )}
        {currentTab === 5 && (
          <SettingsPanelComponent
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}
      </Box>
    </Box>
  );
};

export default LeftPanelSystem;
