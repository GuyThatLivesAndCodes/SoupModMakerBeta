/**
 * Editor Area - Main content editing area
 */

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BlockEditor from './editors/BlockEditor';

interface EditorAreaProps {
  project: any;
  selectedFeature: any;
  onUpdateFeature: (feature: any) => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({
  project,
  selectedFeature,
  onUpdateFeature,
}) => {
  if (!selectedFeature) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Feature Selected
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Select a feature from the sidebar or create a new one to get started
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Render appropriate editor based on feature type
  const renderEditor = () => {
    switch (selectedFeature.type) {
      case 'core.block':
        return (
          <BlockEditor
            feature={selectedFeature}
            project={project}
            onUpdate={onUpdateFeature}
          />
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography>
              Editor for {selectedFeature.type} is not yet implemented
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {renderEditor()}
    </Box>
  );
};

export default EditorArea;
