/**
 * Settings Panel - Configure editor, plugins, and export settings
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';

interface SettingsPanelComponentProps {
  project: any;
  onUpdateProject: (project: any) => void;
}

const SettingsPanelComponent: React.FC<SettingsPanelComponentProps> = ({
  project,
  onUpdateProject,
}) => {
  const settings = project.settings || {};
  const plugins = project.plugins || [];

  const handleSettingChange = (category: string, key: string, value: any) => {
    onUpdateProject({
      ...project,
      settings: {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
      },
    });
  };

  const handlePluginToggle = (pluginId: string) => {
    const updatedPlugins = plugins.map((p: any) =>
      p.id === pluginId ? { ...p, enabled: !p.enabled } : p
    );
    onUpdateProject({
      ...project,
      plugins: updatedPlugins,
    });
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Settings
      </Typography>

      {/* Editor Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="body2" fontWeight={500}>Editor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Auto-save"
                secondary="Automatically save changes"
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              <Switch
                checked={settings.development?.autoSave !== false}
                onChange={(e) =>
                  handleSettingChange('development', 'autoSave', e.target.checked)
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Hot Reload"
                secondary="Auto-reload on changes"
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              <Switch
                checked={settings.development?.hotReload || false}
                onChange={(e) =>
                  handleSettingChange('development', 'hotReload', e.target.checked)
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Debug Mode"
                secondary="Show debug information"
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              <Switch
                checked={settings.development?.debug || false}
                onChange={(e) =>
                  handleSettingChange('development', 'debug', e.target.checked)
                }
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Export Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="body2" fontWeight={500}>Export</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Export Platform</InputLabel>
              <Select
                value={settings.export?.platform || 'forge'}
                onChange={(e) =>
                  handleSettingChange('export', 'platform', e.target.value)
                }
              >
                <MenuItem value="forge">Forge</MenuItem>
                <MenuItem value="fabric">Fabric</MenuItem>
                <MenuItem value="neoforge">NeoForge</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Output Directory"
              value={settings.build?.outputDir || 'build'}
              onChange={(e) =>
                handleSettingChange('build', 'outputDir', e.target.value)
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.export?.autoIncrementVersion || false}
                  onChange={(e) =>
                    handleSettingChange('export', 'autoIncrementVersion', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2">
                  Auto-increment version on export
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.build?.includeSources || false}
                  onChange={(e) =>
                    handleSettingChange('build', 'includeSources', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2">
                  Include sources in build
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.export?.includeJavadocs || false}
                  onChange={(e) =>
                    handleSettingChange('export', 'includeJavadocs', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2">
                  Include Javadocs
                </Typography>
              }
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Plugins */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="body2" fontWeight={500}>
            Plugins ({plugins.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {plugins.length === 0 ? (
            <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', py: 2 }}>
              No plugins installed
            </Typography>
          ) : (
            <List dense>
              {plugins.map((plugin: any) => (
                <ListItem key={plugin.id}>
                  <ListItemText
                    primary={plugin.name}
                    secondary={plugin.version || 'Unknown version'}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Switch
                    checked={plugin.enabled}
                    onChange={() => handlePluginToggle(plugin.id)}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Build Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="body2" fontWeight={500}>Build</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Java Version</InputLabel>
              <Select
                value={settings.javaVersion || 17}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    settings: {
                      ...settings,
                      javaVersion: e.target.value,
                    },
                  })
                }
              >
                <MenuItem value={8}>Java 8</MenuItem>
                <MenuItem value={11}>Java 11</MenuItem>
                <MenuItem value={17}>Java 17</MenuItem>
                <MenuItem value={21}>Java 21</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.build?.obfuscate || false}
                  onChange={(e) =>
                    handleSettingChange('build', 'obfuscate', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2">
                  Obfuscate code
                </Typography>
              }
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SettingsPanelComponent;
