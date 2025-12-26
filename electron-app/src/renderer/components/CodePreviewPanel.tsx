/**
 * Code Preview Panel - Shows generated code in real-time
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Button,
} from '@mui/material';
import {
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { MobData, EventData, ItemData } from '@soupmodmaker/core';
import { generateMobPreview, generateEventPreview, generateItemPreview, highlightJava } from '../utils/codeGenerator';

interface CodePreviewPanelProps {
  open: boolean;
  onClose: () => void;
  mobData?: MobData;
  eventData?: EventData;
  itemData?: ItemData;
  modId?: string;
}

export const CodePreviewPanel: React.FC<CodePreviewPanelProps> = ({
  open,
  onClose,
  mobData,
  eventData,
  itemData,
  modId = 'examplemod',
}) => {
  const [code, setCode] = useState<string>('');
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    if (mobData) {
      const generated = generateMobPreview(mobData, modId);
      setCode(generated);
      setHighlightedCode(highlightJava(generated));
    } else if (eventData) {
      const generated = generateEventPreview(eventData, modId);
      setCode(generated);
      setHighlightedCode(highlightJava(generated));
    } else if (itemData) {
      const generated = generateItemPreview(itemData, modId);
      setCode(generated);
      setHighlightedCode(highlightJava(generated));
    }
  }, [mobData, eventData, itemData, modId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const fileName = mobData
      ? `${mobData.id}Entity.java`
      : eventData
      ? `${eventData.id}Handler.java`
      : itemData
      ? `${itemData.id}Item.java`
      : 'code.java';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n').length;
  const chars = code.length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '60%', md: '50%' },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
          }}
        >
          <CodeIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Live Code Preview
          </Typography>
          <Tooltip title="Copy Code">
            <IconButton onClick={handleCopy} size="small">
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton onClick={handleDownload} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Code Display */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: '#1e1e1e',
            p: 2,
          }}
        >
          {code ? (
            <pre
              style={{
                margin: 0,
                fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#d4d4d4',
              }}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: '#888' }}>
              <CodeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">No data to preview</Typography>
              <Typography variant="body2">
                Fill in the form to see generated code
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer Stats */}
        {code && (
          <Box
            sx={{
              p: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              gap: 3,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Lines: {lines}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Characters: {chars}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Updates in real-time as you make changes
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CodePreviewPanel;
