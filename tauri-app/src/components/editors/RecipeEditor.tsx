/**
 * Recipe Editor - Placeholder for now, will be enhanced later
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface RecipeEditorProps {
  feature: any;
  project: any;
  onUpdate: (feature: any, isDirty?: boolean) => void;
  onSaveAndClose: (feature: any) => void;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({
  feature,
  onSaveAndClose,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {feature.name || 'New Recipe'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => onSaveAndClose(feature)}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => onSaveAndClose(feature)}
          >
            Save & Close
          </Button>
        </Box>
      </Paper>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography variant="body1" sx={{ opacity: 0.5 }}>
          Recipe Editor - Coming Soon
        </Typography>
      </Box>
    </Box>
  );
};

export default RecipeEditor;
