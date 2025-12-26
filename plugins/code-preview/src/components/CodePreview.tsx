/**
 * Live Code Preview Component
 * Shows generated Java code in real-time as users make changes
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { MobData, EventData } from '@soupmodmaker/core';
import { ForgeMobGenerator } from '../../../mob-maker/src/generators/ForgeMobGenerator';
import { ForgeEventGenerator } from '../../../event-creator/src/generators/EventGenerator';
import { highlightJavaCode } from '../utils/CodeFormatter';

interface CodePreviewProps {
  /** Current mob data (if in Mob Maker) */
  mobData?: MobData;

  /** Current event data (if in Event Creator) */
  eventData?: EventData;

  /** Current mod ID */
  modId?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  mobData,
  eventData,
  modId = 'examplemod',
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  // Generate code whenever data changes
  useEffect(() => {
    generateCode();
  }, [mobData, eventData, modId]);

  // Highlight code whenever selected file changes
  useEffect(() => {
    if (selectedFile && generatedFiles[selectedFile]) {
      const highlighted = highlightJavaCode(generatedFiles[selectedFile]);
      setHighlightedCode(highlighted);
    }
  }, [selectedFile, generatedFiles]);

  const generateCode = () => {
    const files: Record<string, string> = {};

    if (mobData) {
      // Generate mob files
      const mobGen = new ForgeMobGenerator();
      const entityClass = mobGen.generateEntityClass(mobData, modId);
      const renderer = mobGen.generateRenderer(mobData, modId);
      const model = mobGen.generateModel(mobData, modId);
      const registration = mobGen.generateRegistration(mobData, modId);

      files[`${mobData.id}Entity.java`] = entityClass;
      files[`${mobData.id}Renderer.java`] = renderer;
      files[`${mobData.id}Model.java`] = model;
      files[`Registration.java`] = registration;
    }

    if (eventData) {
      // Generate event files
      const eventGen = new ForgeEventGenerator();
      const eventHandler = eventGen.generateEventHandler(eventData, modId);

      files[`${eventData.id}Handler.java`] = eventHandler;
    }

    setGeneratedFiles(files);

    // Auto-select first file
    const fileNames = Object.keys(files);
    if (fileNames.length > 0 && !selectedFile) {
      setSelectedFile(fileNames[0]);
    }
  };

  const handleCopyCode = () => {
    if (selectedFile && generatedFiles[selectedFile]) {
      navigator.clipboard.writeText(generatedFiles[selectedFile]);
      alert('Code copied to clipboard!');
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile && generatedFiles[selectedFile]) {
      const blob = new Blob([generatedFiles[selectedFile]], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAll = async () => {
    try {
      const { ipcRenderer } = window.require('electron');
      const { dialog } = window.require('electron').remote || window.require('@electron/remote');

      alert('Download all files functionality coming soon!\n\nFor now, download files individually or use the Export feature.');
    } catch (error) {
      console.error('Error downloading files:', error);
    }
  };

  const fileNames = Object.keys(generatedFiles);
  const hasContent = fileNames.length > 0;

  if (!mobData && !eventData) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
        <CodeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Content to Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a mob or event to see the generated code here
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CodeIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Live Code Preview</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={generateCode}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* File Selector */}
        {hasContent && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select File</InputLabel>
              <Select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                label="Select File"
              >
                {fileNames.map((fileName) => (
                  <MenuItem key={fileName} value={fileName}>
                    {fileName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Copy Code">
              <IconButton size="small" onClick={handleCopyCode}>
                <CopyIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download File">
              <IconButton size="small" onClick={handleDownloadFile}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadAll}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>

      {/* Code Display */}
      {hasContent && selectedFile && (
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: '#1e1e1e',
            p: 2,
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#d4d4d4',
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </Box>
      )}

      {/* Stats */}
      {hasContent && selectedFile && (
        <Box
          sx={{
            p: 1,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            gap: 3,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            File: {selectedFile}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Lines: {generatedFiles[selectedFile]?.split('\n').length || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Size: {new Blob([generatedFiles[selectedFile] || '']).size} bytes
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Generated: {fileNames.length} file{fileNames.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CodePreview;
