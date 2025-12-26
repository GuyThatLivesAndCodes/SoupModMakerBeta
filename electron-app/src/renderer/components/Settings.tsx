import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  IconButton,
  Chip,
  Divider,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Extension as ExtensionIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { PluginMetadata } from '@soupmodmaker/core';

export const Settings: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginMetadata[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { ipcRenderer } = window.require('electron');
      const appSettings = await ipcRenderer.invoke('settings:get');
      setSettings(appSettings);
      setPlugins(appSettings.installedPlugins || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleImportPlugin = async () => {
    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('plugin:import');

      if (result.success) {
        setMessage({ type: 'success', text: `Plugin "${result.plugin.name}" imported successfully! Restart the app to use it.` });
        await loadSettings();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to import plugin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleTogglePlugin = async (pluginId: string, enabled: boolean) => {
    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('plugin:toggle', pluginId, enabled);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        await loadSettings();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to toggle plugin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleRemovePlugin = async (pluginId: string) => {
    if (!confirm('Are you sure you want to remove this plugin?')) {
      return;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('plugin:remove', pluginId);

      if (result.success) {
        setMessage({ type: 'success', text: 'Plugin removed successfully! Restart the app to apply changes.' });
        await loadSettings();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to remove plugin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'content': return 'primary';
      case 'world': return 'success';
      case 'gameplay': return 'warning';
      case 'tools': return 'info';
      case 'integration': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Settings</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<RefreshIcon />} onClick={loadSettings}>
          Refresh
        </Button>
      </Box>

      {/* Message */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Plugin Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ExtensionIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">Plugin Management</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleImportPlugin}
          >
            Import Plugin
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          Manage plugins to extend SoupModMaker's functionality. Enable/disable plugins and restart the app to apply changes.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {plugins.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ExtensionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Plugins Installed
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click "Import Plugin" to add new features to SoupModMaker
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleImportPlugin}>
              Import Your First Plugin
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {plugins.map((plugin) => (
              <Grid item xs={12} md={6} key={plugin.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{plugin.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          v{plugin.version} • by {plugin.author}
                        </Typography>
                      </Box>
                      {plugin.category && (
                        <Chip
                          label={plugin.category}
                          size="small"
                          color={getCategoryColor(plugin.category) as any}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {plugin.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={plugin.enabled ? 'Enabled' : 'Disabled'}
                        size="small"
                        color={plugin.enabled ? 'success' : 'default'}
                      />
                      {plugin.installed && (
                        <Chip label="Installed" size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Switch
                      checked={plugin.enabled}
                      onChange={(e) => handleTogglePlugin(plugin.id, e.target.checked)}
                      color="primary"
                    />
                    <Typography variant="caption" sx={{ mr: 'auto' }}>
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePlugin(plugin.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* App Info */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About SoupModMaker
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Modern Minecraft Mod & Plugin Creator
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Version: 0.1.0
        </Typography>
      </Paper>
    </Box>
  );
};
