import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { MobData, DEFAULT_MOB, AIGoal, LootDrop, MobBehavior } from '@soupmodmaker/core';

export const MobMaker: React.FC = () => {
  const [mob, setMob] = useState<MobData>({
    ...DEFAULT_MOB,
    name: '',
    id: '',
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as MobData);

  const updateMob = (updates: Partial<MobData>) => {
    setMob({ ...mob, ...updates, modifiedAt: new Date() });
  };

  const updateBehavior = (updates: Partial<MobBehavior>) => {
    setMob({
      ...mob,
      behavior: { ...mob.behavior, ...updates },
      modifiedAt: new Date(),
    });
  };

  const addAIGoal = () => {
    const newGoal: AIGoal = {
      priority: mob.aiGoals.length,
      type: 'wander',
      config: { speed: 1.0 },
    };
    updateMob({ aiGoals: [...mob.aiGoals, newGoal] });
  };

  const removeAIGoal = (index: number) => {
    const newGoals = mob.aiGoals.filter((_, i) => i !== index);
    updateMob({ aiGoals: newGoals });
  };

  const updateAIGoal = (index: number, updates: Partial<AIGoal>) => {
    const newGoals = [...mob.aiGoals];
    newGoals[index] = { ...newGoals[index], ...updates };
    updateMob({ aiGoals: newGoals });
  };

  const addLootDrop = () => {
    const newDrop: LootDrop = {
      item: 'minecraft:bone',
      minCount: 1,
      maxCount: 3,
      chance: 1.0,
      lootingMultiplier: 1,
    };
    updateMob({ drops: [...mob.drops, newDrop] });
  };

  const removeLootDrop = (index: number) => {
    const newDrops = mob.drops.filter((_, i) => i !== index);
    updateMob({ drops: newDrops });
  };

  const updateLootDrop = (index: number, updates: Partial<LootDrop>) => {
    const newDrops = [...mob.drops];
    newDrops[index] = { ...newDrops[index], ...updates };
    updateMob({ drops: newDrops });
  };

  const saveMob = async () => {
    if (!mob.name || !mob.id) {
      alert('Please enter a name and ID for your mob!');
      return;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('mob:save', mob);

      if (result.success) {
        alert(`Mob "${mob.name}" saved successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to save mob: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving mob:', error);
      alert(`Error saving mob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportMob = async () => {
    if (!mob.name || !mob.id) {
      alert('Please enter a name and ID for your mob!');
      return;
    }

    const modId = prompt('Enter your mod ID (e.g., mymod):');
    if (!modId) return;

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('mob:export', mob, modId);

      if (result.success) {
        alert(
          `Mob exported successfully!\n\nLocation: ${result.path}\n\nNote: Java code generation will be added in the next update. For now, the mob data has been saved.`
        );
      } else {
        alert(`Failed to export mob: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting mob:', error);
      alert(`Error exporting mob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PetsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Mob Maker</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={exportMob} sx={{ mr: 1 }}>
          Export Code
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveMob}>
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
              label="Mob Name"
              value={mob.name}
              onChange={(e) => updateMob({ name: e.target.value })}
              placeholder="e.g., Zombie Boss"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mob ID"
              value={mob.id}
              onChange={(e) => updateMob({ id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="e.g., zombie_boss"
              helperText="Unique identifier (lowercase, underscores only)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={mob.description || ''}
              onChange={(e) => updateMob({ description: e.target.value })}
              placeholder="Describe your mob..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Stats</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Health: {mob.health}</Typography>
              <Slider
                value={mob.health}
                onChange={(_, value) => updateMob({ health: value as number })}
                min={1}
                max={100}
                marks={[
                  { value: 1, label: '1' },
                  { value: 20, label: '20' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Damage: {mob.damage}</Typography>
              <Slider
                value={mob.damage}
                onChange={(_, value) => updateMob({ damage: value as number })}
                min={0}
                max={20}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Speed: {mob.speed.toFixed(2)}</Typography>
              <Slider
                value={mob.speed}
                onChange={(_, value) => updateMob({ speed: value as number })}
                min={0.1}
                max={1.0}
                step={0.05}
                marks={[
                  { value: 0.1, label: '0.1' },
                  { value: 0.25, label: '0.25' },
                  { value: 0.5, label: '0.5' },
                  { value: 1.0, label: '1.0' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Armor: {mob.armor}</Typography>
              <Slider
                value={mob.armor}
                onChange={(_, value) => updateMob({ armor: value as number })}
                min={0}
                max={20}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                ]}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Behavior */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Behavior</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Behavior Type</InputLabel>
                <Select
                  value={mob.behavior.type}
                  onChange={(e) => updateBehavior({ type: e.target.value as any })}
                  label="Behavior Type"
                >
                  <MenuItem value="passive">Passive</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="hostile">Hostile</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Attack Range"
                value={mob.behavior.attackRange}
                onChange={(e) => updateBehavior({ attackRange: parseFloat(e.target.value) })}
                inputProps={{ step: 0.5, min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mob.behavior.retaliate}
                    onChange={(e) => updateBehavior({ retaliate: e.target.checked })}
                  />
                }
                label="Retaliate when attacked"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* AI Goals */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">AI Goals ({mob.aiGoals.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {mob.aiGoals.map((goal, index) => (
              <ListItem key={index} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      type="number"
                      label="Priority"
                      value={goal.priority}
                      onChange={(e) => updateAIGoal(index, { priority: parseInt(e.target.value) })}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Goal Type</InputLabel>
                      <Select
                        value={goal.type}
                        onChange={(e) => updateAIGoal(index, { type: e.target.value as any })}
                        label="Goal Type"
                      >
                        <MenuItem value="melee_attack">Melee Attack</MenuItem>
                        <MenuItem value="ranged_attack">Ranged Attack</MenuItem>
                        <MenuItem value="wander">Wander</MenuItem>
                        <MenuItem value="look_at_player">Look at Player</MenuItem>
                        <MenuItem value="swim">Swim</MenuItem>
                        <MenuItem value="panic">Panic</MenuItem>
                        <MenuItem value="avoid_entity">Avoid Entity</MenuItem>
                        <MenuItem value="follow_player">Follow Player</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeAIGoal(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />} onClick={addAIGoal} variant="outlined" fullWidth>
            Add AI Goal
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Loot Drops */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Loot Drops ({mob.drops.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {mob.drops.map((drop, index) => (
              <ListItem key={index} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Item ID"
                      value={drop.item}
                      onChange={(e) => updateLootDrop(index, { item: e.target.value })}
                      placeholder="minecraft:diamond"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      type="number"
                      label="Min"
                      value={drop.minCount}
                      onChange={(e) => updateLootDrop(index, { minCount: parseInt(e.target.value) })}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      type="number"
                      label="Max"
                      value={drop.maxCount}
                      onChange={(e) => updateLootDrop(index, { maxCount: parseInt(e.target.value) })}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      type="number"
                      label="Chance"
                      value={drop.chance}
                      onChange={(e) => updateLootDrop(index, { chance: parseFloat(e.target.value) })}
                      inputProps={{ min: 0, max: 1, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeLootDrop(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />} onClick={addLootDrop} variant="outlined" fullWidth>
            Add Loot Drop
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Special Abilities */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Special Abilities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mob.immuneToFire}
                    onChange={(e) => updateMob({ immuneToFire: e.target.checked })}
                  />
                }
                label="Immune to Fire"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mob.canSwim}
                    onChange={(e) => updateMob({ canSwim: e.target.checked })}
                  />
                }
                label="Can Swim"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mob.canBreatheUnderwater}
                    onChange={(e) => updateMob({ canBreatheUnderwater: e.target.checked })}
                  />
                }
                label="Breathe Underwater"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mob.pushable}
                    onChange={(e) => updateMob({ pushable: e.target.checked })}
                  />
                }
                label="Pushable"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
