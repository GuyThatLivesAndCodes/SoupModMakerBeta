/**
 * Editor Tab System - Manages multiple open feature editors in tabs
 */

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  ViewInAr as BlockIcon,
  Inventory as ItemIcon,
  Restaurant as RecipeIcon,
  Pets as MobIcon,
  EmojiEvents as EventIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import BlockEditorMultiPage from './editors/BlockEditorMultiPage';
import ItemEditor from './editors/ItemEditor';
import RecipeEditor from './editors/RecipeEditor';
import SourceFileEditor from './editors/SourceFileEditor';

interface EditorTab {
  id: string;
  type: 'feature' | 'source';
  feature?: any;
  sourceFile?: {
    path: string;
    content: string;
  };
  isDirty: boolean;
}

interface EditorTabSystemProps {
  project: any;
  onUpdateFeature: (feature: any) => void;
  onCloseTab?: (featureId: string) => void;
  openFeature?: any;
  openSourceFile?: { path: string; content: string };
}

const EditorTabSystem: React.FC<EditorTabSystemProps> = ({
  project,
  onUpdateFeature,
  onCloseTab,
  openFeature,
  openSourceFile,
}) => {
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // Open a new tab when openFeature changes
  React.useEffect(() => {
    if (openFeature) {
      setOpenTabs((prevTabs) => {
        const existingTabIndex = prevTabs.findIndex(
          (tab) => tab.type === 'feature' && tab.id === openFeature.id
        );

        if (existingTabIndex >= 0) {
          // Tab already open, just switch to it
          setCurrentTabIndex(existingTabIndex);
          return prevTabs;
        } else {
          // Open new tab
          const newTab: EditorTab = {
            id: openFeature.id,
            type: 'feature',
            feature: openFeature,
            isDirty: false,
          };
          setCurrentTabIndex(prevTabs.length);
          return [...prevTabs, newTab];
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFeature?.id]);

  // Open a new tab when openSourceFile changes
  React.useEffect(() => {
    if (openSourceFile) {
      setOpenTabs((prevTabs) => {
        const existingTabIndex = prevTabs.findIndex(
          (tab) => tab.type === 'source' && tab.sourceFile?.path === openSourceFile.path
        );

        if (existingTabIndex >= 0) {
          // Tab already open, just switch to it
          setCurrentTabIndex(existingTabIndex);
          return prevTabs;
        } else {
          // Open new tab
          const newTab: EditorTab = {
            id: `source_${openSourceFile.path}`,
            type: 'source',
            sourceFile: openSourceFile,
            isDirty: false,
          };
          setCurrentTabIndex(prevTabs.length);
          return [...prevTabs, newTab];
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSourceFile?.path]);

  // Close tabs for deleted features
  React.useEffect(() => {
    if (!project?.features) return;

    const featureIds = new Set(project.features.map((f: any) => f.id));
    const validTabs = openTabs.filter((tab) => featureIds.has(tab.id));

    if (validTabs.length !== openTabs.length) {
      setOpenTabs(validTabs);
      if (currentTabIndex >= validTabs.length) {
        setCurrentTabIndex(Math.max(0, validTabs.length - 1));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.features]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  const handleCloseTab = (tabIndex: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    const tabToClose = openTabs[tabIndex];

    // TODO: Check if tab is dirty and show confirmation

    const newTabs = openTabs.filter((_, index) => index !== tabIndex);
    setOpenTabs(newTabs);

    if (currentTabIndex >= newTabs.length) {
      setCurrentTabIndex(Math.max(0, newTabs.length - 1));
    }

    if (onCloseTab) {
      onCloseTab(tabToClose.id);
    }
  };

  const handleFeatureUpdate = (feature: any, isDirty: boolean = true) => {
    // Update the tab's dirty state
    setOpenTabs(
      openTabs.map((tab) =>
        tab.id === feature.id ? { ...tab, feature, isDirty } : tab
      )
    );

    onUpdateFeature(feature);
  };

  const handleSaveAndClose = (feature: any) => {
    onUpdateFeature(feature);
    const tabIndex = openTabs.findIndex((tab) => tab.id === feature.id);
    if (tabIndex >= 0) {
      handleCloseTab(tabIndex);
    }
  };

  const featureIcons: Record<string, React.ReactElement> = {
    'core.block': <BlockIcon fontSize="small" />,
    'core.item': <ItemIcon fontSize="small" />,
    'core.recipe': <RecipeIcon fontSize="small" />,
    'core.mob': <MobIcon fontSize="small" />,
    'core.event': <EventIcon fontSize="small" />,
  };

  if (openTabs.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ opacity: 0.3, mb: 1 }}>
          No feature selected
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.3 }}>
          Select a feature from the Features panel or create a new one
        </Typography>
      </Box>
    );
  }

  const currentTab = openTabs[currentTabIndex];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Tab Bar */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {openTabs.map((tab, index) => {
            const icon = tab.type === 'source'
              ? <CodeIcon fontSize="small" />
              : featureIcons[tab.feature?.type || 'core.block'];

            const label = tab.type === 'source'
              ? tab.sourceFile?.path.split('/').pop() || 'Source File'
              : tab.feature?.name || 'Untitled';

            return (
              <Tab
                key={tab.id}
                icon={icon}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {label}
                      {tab.isDirty && ' *'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleCloseTab(index, e)}
                      sx={{ ml: 0.5, p: 0.25 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                sx={{ textTransform: 'none' }}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {currentTab && (
          currentTab.type === 'source' && currentTab.sourceFile ? (
            <SourceFileEditor
              filePath={currentTab.sourceFile.path}
              content={currentTab.sourceFile.content}
              onEnableEdit={(path) => {
                console.log('Editing enabled for:', path);
                // TODO: Mark file as manually edited in project settings
              }}
            />
          ) : currentTab.feature ? (
            renderEditor(currentTab.feature, project, handleFeatureUpdate, handleSaveAndClose)
          ) : null
        )}
      </Box>
    </Box>
  );
};

function renderEditor(
  feature: any,
  project: any,
  onUpdate: (feature: any, isDirty?: boolean) => void,
  onSaveAndClose: (feature: any) => void
) {
  switch (feature.type) {
    case 'core.block':
      return (
        <BlockEditorMultiPage
          feature={feature}
          project={project}
          onUpdate={onUpdate}
          onSaveAndClose={onSaveAndClose}
        />
      );
    case 'core.item':
      return (
        <ItemEditor
          feature={feature}
          project={project}
          onUpdate={onUpdate}
          onSaveAndClose={onSaveAndClose}
        />
      );
    case 'core.recipe':
      return (
        <RecipeEditor
          feature={feature}
          project={project}
          onUpdate={onUpdate}
          onSaveAndClose={onSaveAndClose}
        />
      );
    default:
      return (
        <Box sx={{ p: 3 }}>
          <Typography>Editor for {feature.type} coming soon...</Typography>
        </Box>
      );
  }
}

export default EditorTabSystem;
