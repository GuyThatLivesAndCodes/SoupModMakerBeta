import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  Chip,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  FlashOn as EventIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import {
  EventData,
  DEFAULT_EVENT,
  EventCondition,
  EventAction,
  MinecraftEventType,
  EVENT_TEMPLATES,
} from '@soupmodmaker/core';

export const EventCreator: React.FC = () => {
  const [event, setEvent] = useState<EventData>({
    ...DEFAULT_EVENT,
    name: '',
    id: '',
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as EventData);

  const [showTemplates, setShowTemplates] = useState(true);

  const updateEvent = (updates: Partial<EventData>) => {
    setEvent({ ...event, ...updates, modifiedAt: new Date() });
  };

  const loadTemplate = (templateKey: string) => {
    const template = EVENT_TEMPLATES[templateKey];
    setEvent({
      ...event,
      ...template,
      id: template.name?.toLowerCase().replace(/\s+/g, '_') || '',
      createdAt: new Date(),
      modifiedAt: new Date(),
    } as EventData);
    setShowTemplates(false);
  };

  const addCondition = () => {
    const newCondition: EventCondition = {
      type: 'specific_block',
      config: { block: 'minecraft:stone' },
      negate: false,
    };
    updateEvent({ conditions: [...event.conditions, newCondition] });
  };

  const removeCondition = (index: number) => {
    const newConditions = event.conditions.filter((_, i) => i !== index);
    updateEvent({ conditions: newConditions });
  };

  const updateCondition = (index: number, updates: Partial<EventCondition>) => {
    const newConditions = [...event.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    updateEvent({ conditions: newConditions });
  };

  const addAction = () => {
    const newAction: EventAction = {
      type: 'explosion',
      config: {
        power: 4,
        fire: false,
        breakBlocks: true,
        damageEntities: true,
        useEventLocation: true,
      },
    };
    updateEvent({ actions: [...event.actions, newAction] });
  };

  const removeAction = (index: number) => {
    const newActions = event.actions.filter((_, i) => i !== index);
    updateEvent({ actions: newActions });
  };

  const updateAction = (index: number, updates: Partial<EventAction>) => {
    const newActions = [...event.actions];
    newActions[index] = { ...newActions[index], ...updates };
    updateEvent({ actions: newActions });
  };

  const saveEvent = async () => {
    if (!event.name || !event.id) {
      alert('Please enter a name and ID for your event!');
      return;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('event:save', event);

      if (result.success) {
        alert(`Event "${event.name}" saved successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to save event: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Error saving event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportEvent = async () => {
    if (!event.name || !event.id) {
      alert('Please enter a name and ID for your event!');
      return;
    }

    const modId = prompt('Enter your mod ID (e.g., mymod):');
    if (!modId) return;

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('event:export', event, modId);

      if (result.success) {
        alert(
          `Event exported successfully!\n\nLocation: ${result.path}\n\nNote: Java code generation will be added in the next update. For now, the event data has been saved.`
        );
      } else {
        alert(`Failed to export event: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting event:', error);
      alert(`Error exporting event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderConditionConfig = (condition: EventCondition, index: number) => {
    switch (condition.type) {
      case 'specific_block':
        return (
          <TextField
            size="small"
            fullWidth
            label="Block ID"
            value={condition.config.block || ''}
            onChange={(e) =>
              updateCondition(index, {
                config: { ...condition.config, block: e.target.value },
              })
            }
            placeholder="minecraft:diamond_ore"
          />
        );
      case 'random_chance':
        return (
          <TextField
            size="small"
            fullWidth
            type="number"
            label="Chance (0.0 - 1.0)"
            value={condition.config.chance || 0.5}
            onChange={(e) =>
              updateCondition(index, {
                config: { ...condition.config, chance: parseFloat(e.target.value) },
              })
            }
            inputProps={{ min: 0, max: 1, step: 0.1 }}
          />
        );
      case 'player_gamemode':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Gamemode</InputLabel>
            <Select
              value={condition.config.gamemode || 'survival'}
              onChange={(e) =>
                updateCondition(index, {
                  config: { ...condition.config, gamemode: e.target.value },
                })
              }
            >
              <MenuItem value="survival">Survival</MenuItem>
              <MenuItem value="creative">Creative</MenuItem>
              <MenuItem value="adventure">Adventure</MenuItem>
              <MenuItem value="spectator">Spectator</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return <Typography variant="caption">Configure in advanced mode</Typography>;
    }
  };

  const renderActionConfig = (action: EventAction, index: number) => {
    switch (action.type) {
      case 'explosion':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                type="number"
                label="Power"
                value={action.config.power || 4}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, power: parseFloat(e.target.value) },
                  })
                }
                inputProps={{ min: 0, max: 10, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={action.config.fire || false}
                    onChange={(e) =>
                      updateAction(index, {
                        config: { ...action.config, fire: e.target.checked },
                      })
                    }
                  />
                }
                label="Create Fire"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={action.config.breakBlocks !== false}
                    onChange={(e) =>
                      updateAction(index, {
                        config: { ...action.config, breakBlocks: e.target.checked },
                      })
                    }
                  />
                }
                label="Break Blocks"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={action.config.damageEntities !== false}
                    onChange={(e) =>
                      updateAction(index, {
                        config: { ...action.config, damageEntities: e.target.checked },
                      })
                    }
                  />
                }
                label="Damage Entities"
              />
            </Grid>
          </Grid>
        );
      case 'spawn_entity':
        return (
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <TextField
                size="small"
                fullWidth
                label="Entity Type"
                value={action.config.entityType || 'minecraft:zombie'}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, entityType: e.target.value },
                  })
                }
                placeholder="minecraft:zombie"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                type="number"
                label="Count"
                value={action.config.count || 1}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, count: parseInt(e.target.value) },
                  })
                }
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        );
      case 'send_message':
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Message"
                value={action.config.message || ''}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, message: e.target.value },
                  })
                }
                placeholder="Hello, player!"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={action.config.type || 'chat'}
                  onChange={(e) =>
                    updateAction(index, {
                      config: { ...action.config, type: e.target.value },
                    })
                  }
                >
                  <MenuItem value="chat">Chat</MenuItem>
                  <MenuItem value="actionbar">Action Bar</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                label="Color"
                value={action.config.color || 'white'}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, color: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        );
      case 'give_item':
        return (
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <TextField
                size="small"
                fullWidth
                label="Item ID"
                value={action.config.item || 'minecraft:diamond'}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, item: e.target.value },
                  })
                }
                placeholder="minecraft:diamond"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                type="number"
                label="Count"
                value={action.config.count || 1}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, count: parseInt(e.target.value) },
                  })
                }
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        );
      case 'lightning':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={action.config.damage !== false}
                onChange={(e) =>
                  updateAction(index, {
                    config: { ...action.config, damage: e.target.checked },
                  })
                }
              />
            }
            label="Damage Entities"
          />
        );
      default:
        return <Typography variant="caption">Configure in advanced mode</Typography>;
    }
  };

  if (showTemplates) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Event Creator</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Choose a Template or Start from Scratch
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(EVENT_TEMPLATES).map(([key, template]) => (
            <Grid item xs={12} md={6} key={key}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={template.eventType} size="small" color="primary" />
                    <Chip label={`${template.conditions?.length || 0} conditions`} size="small" />
                    <Chip label={`${template.actions?.length || 0} actions`} size="small" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => loadTemplate(key)} startIcon={<CopyIcon />}>
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button variant="outlined" onClick={() => setShowTemplates(false)} fullWidth>
          Start from Scratch
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Event Creator</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={() => setShowTemplates(true)} sx={{ mr: 1 }}>
          Templates
        </Button>
        <Button variant="outlined" onClick={exportEvent} sx={{ mr: 1 }}>
          Export Code
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveEvent}>
          Save JSON
        </Button>
      </Box>

      {/* Basic Information */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Event Name"
              value={event.name}
              onChange={(e) => updateEvent({ name: e.target.value })}
              placeholder="e.g., Block Break Explosion"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Event ID"
              value={event.id}
              onChange={(e) => updateEvent({ id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="e.g., block_break_explosion"
              helperText="Unique identifier (lowercase, underscores only)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={event.description || ''}
              onChange={(e) => updateEvent({ description: e.target.value })}
              placeholder="Describe what this event does..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Event Type & Settings */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Event Type & Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={event.eventType}
                onChange={(e) => updateEvent({ eventType: e.target.value as MinecraftEventType })}
                label="Event Type"
              >
                <MenuItem value="block_break">Block Break</MenuItem>
                <MenuItem value="block_place">Block Place</MenuItem>
                <MenuItem value="block_interact">Block Interact</MenuItem>
                <MenuItem value="player_join">Player Join</MenuItem>
                <MenuItem value="player_quit">Player Quit</MenuItem>
                <MenuItem value="player_death">Player Death</MenuItem>
                <MenuItem value="player_interact">Player Interact</MenuItem>
                <MenuItem value="entity_spawn">Entity Spawn</MenuItem>
                <MenuItem value="entity_death">Entity Death</MenuItem>
                <MenuItem value="entity_damage">Entity Damage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={event.priority}
                onChange={(e) => updateEvent({ priority: e.target.value as any })}
                label="Priority"
              >
                <MenuItem value="lowest">Lowest</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="highest">Highest</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={event.cancelEvent}
                  onChange={(e) => updateEvent({ cancelEvent: e.target.checked })}
                />
              }
              label="Cancel Event"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Conditions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Conditions ({event.conditions.length})</Typography>
          <Typography variant="caption" sx={{ ml: 2, alignSelf: 'center' }}>
            All conditions must be met for actions to execute
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {event.conditions.map((condition, index) => (
              <ListItem
                key={index}
                sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1, flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Condition Type</InputLabel>
                      <Select
                        value={condition.type}
                        onChange={(e) => updateCondition(index, { type: e.target.value as any })}
                        label="Condition Type"
                      >
                        <MenuItem value="specific_block">Specific Block</MenuItem>
                        <MenuItem value="specific_entity">Specific Entity</MenuItem>
                        <MenuItem value="player_gamemode">Player Gamemode</MenuItem>
                        <MenuItem value="random_chance">Random Chance</MenuItem>
                        <MenuItem value="biome">Biome</MenuItem>
                        <MenuItem value="weather">Weather</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    {renderConditionConfig(condition, index)}
                  </Grid>
                  <Grid item xs={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={condition.negate}
                          onChange={(e) => updateCondition(index, { negate: e.target.checked })}
                          size="small"
                        />
                      }
                      label="NOT"
                      labelPlacement="top"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeCondition(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />} onClick={addCondition} variant="outlined" fullWidth>
            Add Condition
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Actions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Actions ({event.actions.length})</Typography>
          <Typography variant="caption" sx={{ ml: 2, alignSelf: 'center' }}>
            Actions to execute when conditions are met
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {event.actions.map((action, index) => (
              <ListItem
                key={index}
                sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1, flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Action Type</InputLabel>
                      <Select
                        value={action.type}
                        onChange={(e) => updateAction(index, { type: e.target.value as any })}
                        label="Action Type"
                      >
                        <MenuItem value="explosion">Explosion</MenuItem>
                        <MenuItem value="lightning">Lightning</MenuItem>
                        <MenuItem value="spawn_entity">Spawn Entity</MenuItem>
                        <MenuItem value="give_item">Give Item</MenuItem>
                        <MenuItem value="send_message">Send Message</MenuItem>
                        <MenuItem value="play_sound">Play Sound</MenuItem>
                        <MenuItem value="apply_effect">Apply Effect</MenuItem>
                        <MenuItem value="teleport_entity">Teleport Entity</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    {renderActionConfig(action, index)}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Delay (ms)"
                      value={action.delay || 0}
                      onChange={(e) => updateAction(index, { delay: parseInt(e.target.value) })}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton onClick={() => removeAction(index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />} onClick={addAction} variant="outlined" fullWidth>
            Add Action
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
