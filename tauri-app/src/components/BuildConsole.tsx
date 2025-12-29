/**
 * Build Console - Shows Gradle build output in real-time
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  LinearProgress,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface BuildConsoleProps {
  open: boolean;
  onClose: () => void;
  buildOutput: string[];
  isBuilding: boolean;
  buildSuccess: boolean | null;
  onCopyJar?: () => void;
}

const BuildConsole: React.FC<BuildConsoleProps> = ({
  open,
  onClose,
  buildOutput,
  isBuilding,
  buildSuccess,
  onCopyJar,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [buildOutput]);

  return (
    <Dialog
      open={open}
      onClose={isBuilding ? undefined : onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isBuilding}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Build Console</Typography>
          {buildSuccess === true && <SuccessIcon color="success" />}
          {buildSuccess === false && <ErrorIcon color="error" />}
        </Box>
        {!isBuilding && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {isBuilding && <LinearProgress />}

      <DialogContent sx={{ p: 0 }}>
        <Box
          ref={outputRef}
          sx={{
            bgcolor: '#1e1e1e',
            color: '#d4d4d4',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.875rem',
            p: 2,
            height: 400,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {buildOutput.length === 0 ? (
            <Typography color="text.secondary">Waiting for build output...</Typography>
          ) : (
            buildOutput.map((line, index) => (
              <Box
                key={index}
                sx={{
                  color: line.includes('ERROR') || line.includes('FAILED')
                    ? '#f48771'
                    : line.includes('SUCCESS') || line.includes('BUILD SUCCESSFUL')
                    ? '#4ec9b0'
                    : line.includes('WARNING')
                    ? '#dcdcaa'
                    : '#d4d4d4',
                }}
              >
                {line}
              </Box>
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {buildSuccess === true && onCopyJar && (
          <Button onClick={onCopyJar} variant="contained" color="success">
            Save JAR File
          </Button>
        )}
        <Button onClick={onClose} disabled={isBuilding}>
          {isBuilding ? 'Building...' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuildConsole;
