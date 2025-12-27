/**
 * Item Maker Component
 * Create custom items, tools, armor, and food
 */

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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Diamond as ItemIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import {
  ItemData,
  ItemType,
  DEFAULT_ITEM,
  DEFAULT_TOOL_PROPERTIES,
  DEFAULT_ARMOR_PROPERTIES,
  DEFAULT_FOOD_PROPERTIES,
  TOOL_TIERS,
  ARMOR_MATERIALS,
  ToolTier,
  ArmorType,
} from '@soupmodmaker/core';
import { CodePreviewPanel } from './CodePreviewPanel';

export const ItemMaker: React.FC = () => {
  const [item, setItem] = useState<ItemData>({
    ...DEFAULT_ITEM,
    id: '',
    name: '',
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as ItemData);

  const [codePreviewOpen, setCodePreviewOpen] = useState(false);

  const updateItem = (updates: Partial<ItemData>) => {
    setItem({ ...item, ...updates, modifiedAt: new Date() });
  };

  const handleTypeChange = (newType: ItemType) => {
    const updates: Partial<ItemData> = { type: newType };

    // Set appropriate defaults based on type
    if (newType === 'tool' || newType === 'weapon') {
      updates.toolProperties = { ...DEFAULT_TOOL_PROPERTIES };
      updates.maxStackSize = 1;
      updates.maxDamage = DEFAULT_TOOL_PROPERTIES.durability;
    } else if (newType === 'armor') {
      updates.armorProperties = { ...DEFAULT_ARMOR_PROPERTIES };
      updates.maxStackSize = 1;
      updates.maxDamage = DEFAULT_ARMOR_PROPERTIES.durability;
    } else if (newType === 'food') {
      updates.foodProperties = { ...DEFAULT_FOOD_PROPERTIES };
      updates.maxStackSize = 64;
      updates.maxDamage = 0;
    } else {
      updates.toolProperties = undefined;
      updates.armorProperties = undefined;
      updates.foodProperties = undefined;
      updates.maxStackSize = 64;
      updates.maxDamage = 0;
    }

    updateItem(updates);
  };

  const handleToolTierChange = (tier: ToolTier) => {
    if (!item.toolProperties) return;

    const tierData = TOOL_TIERS[tier];
    updateItem({
      toolProperties: {
        ...item.toolProperties,
        tier,
        ...tierData,
      },
      maxDamage: tierData.durability || 250,
    });
  };

  const handleArmorMaterialChange = (material: string) => {
    if (!item.armorProperties) return;

    const materialData = ARMOR_MATERIALS[material];
    const slot = item.armorProperties.slot;

    updateItem({
      armorProperties: {
        ...item.armorProperties,
        material: material as any,
        defense: materialData[slot],
        durability: materialData.durability,
        enchantability: materialData.enchantability,
        toughness: materialData.toughness,
      },
      maxDamage: materialData.durability,
    });
  };

  const saveItem = async () => {
    if (!item.name || !item.id) {
      alert('Please enter a name and ID for your item!');
      return;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('item:save', item);

      if (result.success) {
        alert(`Item "${item.name}" saved successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to save item: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert(`Error saving item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportItem = async () => {
    if (!item.name || !item.id) {
      alert('Please enter a name and ID for your item!');
      return;
    }

    const modId = prompt('Enter your mod ID (e.g., mymod):');
    if (!modId) return;

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('item:export', item, modId);

      if (result.success) {
        alert(`Item exported successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to export item: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting item:', error);
      alert(`Error exporting item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ItemIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Item Maker</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<CodeIcon />}
          onClick={() => setCodePreviewOpen(true)}
          sx={{ mr: 1 }}
        >
          View Code
        </Button>
        <Button variant="outlined" onClick={exportItem} sx={{ mr: 1 }}>
          Export Code
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveItem}>
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
              label="Item Name"
              value={item.name}
              onChange={(e) => updateItem({ name: e.target.value })}
              placeholder="e.g., Ruby Sword"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Item ID"
              value={item.id}
              onChange={(e) => updateItem({ id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="e.g., ruby_sword"
              helperText="Unique identifier (lowercase, underscores only)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={item.description || ''}
              onChange={(e) => updateItem({ description: e.target.value })}
              placeholder="Describe your item..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Item Type</InputLabel>
              <Select
                value={item.type}
                onChange={(e) => handleTypeChange(e.target.value as ItemType)}
                label="Item Type"
              >
                <MenuItem value="basic">Basic Item</MenuItem>
                <MenuItem value="tool">Tool (Pickaxe, Axe, Shovel, Hoe)</MenuItem>
                <MenuItem value="weapon">Weapon (Sword)</MenuItem>
                <MenuItem value="armor">Armor</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="fuel">Fuel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Rarity</InputLabel>
              <Select
                value={item.rarity}
                onChange={(e) => updateItem({ rarity: e.target.value as any })}
                label="Rarity"
              >
                <MenuItem value="common">Common (White)</MenuItem>
                <MenuItem value="uncommon">Uncommon (Yellow)</MenuItem>
                <MenuItem value="rare">Rare (Cyan)</MenuItem>
                <MenuItem value="epic">Epic (Purple)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tool Properties */}
      {(item.type === 'tool' || item.type === 'weapon') && item.toolProperties && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {item.type === 'weapon' ? 'Weapon' : 'Tool'} Properties
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tool Type</InputLabel>
                  <Select
                    value={item.toolProperties.type}
                    onChange={(e) =>
                      updateItem({
                        toolProperties: { ...item.toolProperties!, type: e.target.value as any },
                      })
                    }
                    label="Tool Type"
                  >
                    <MenuItem value="sword">Sword</MenuItem>
                    <MenuItem value="pickaxe">Pickaxe</MenuItem>
                    <MenuItem value="axe">Axe</MenuItem>
                    <MenuItem value="shovel">Shovel</MenuItem>
                    <MenuItem value="hoe">Hoe</MenuItem>
                    <MenuItem value="custom">Custom Tool</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Material/Tier</InputLabel>
                  <Select
                    value={item.toolProperties.tier}
                    onChange={(e) => handleToolTierChange(e.target.value as ToolTier)}
                    label="Material/Tier"
                  >
                    <MenuItem value="wood">Wood</MenuItem>
                    <MenuItem value="stone">Stone</MenuItem>
                    <MenuItem value="iron">Iron</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="diamond">Diamond</MenuItem>
                    <MenuItem value="netherite">Netherite</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Attack Damage: {item.toolProperties.attackDamage}</Typography>
                <Slider
                  value={item.toolProperties.attackDamage}
                  onChange={(_, value) =>
                    updateItem({
                      toolProperties: { ...item.toolProperties!, attackDamage: value as number },
                    })
                  }
                  min={0}
                  max={20}
                  step={0.5}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Attack Speed: {item.toolProperties.attackSpeed}</Typography>
                <Slider
                  value={item.toolProperties.attackSpeed}
                  onChange={(_, value) =>
                    updateItem({
                      toolProperties: { ...item.toolProperties!, attackSpeed: value as number },
                    })
                  }
                  min={-3.5}
                  max={4}
                  step={0.1}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Durability"
                  value={item.toolProperties.durability}
                  onChange={(e) =>
                    updateItem({
                      toolProperties: {
                        ...item.toolProperties!,
                        durability: parseInt(e.target.value),
                      },
                      maxDamage: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Mining Speed"
                  value={item.toolProperties.miningSpeed}
                  onChange={(e) =>
                    updateItem({
                      toolProperties: {
                        ...item.toolProperties!,
                        miningSpeed: parseFloat(e.target.value),
                      },
                    })
                  }
                  inputProps={{ step: 0.5 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Armor Properties */}
      {item.type === 'armor' && item.armorProperties && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Armor Properties</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Armor Slot</InputLabel>
                  <Select
                    value={item.armorProperties.slot}
                    onChange={(e) => {
                      const slot = e.target.value as ArmorType;
                      const material = item.armorProperties!.material;
                      const materialData = ARMOR_MATERIALS[material];
                      updateItem({
                        armorProperties: {
                          ...item.armorProperties!,
                          slot,
                          defense: materialData[slot],
                        },
                      });
                    }}
                    label="Armor Slot"
                  >
                    <MenuItem value="helmet">Helmet</MenuItem>
                    <MenuItem value="chestplate">Chestplate</MenuItem>
                    <MenuItem value="leggings">Leggings</MenuItem>
                    <MenuItem value="boots">Boots</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Material</InputLabel>
                  <Select
                    value={item.armorProperties.material}
                    onChange={(e) => handleArmorMaterialChange(e.target.value)}
                    label="Material"
                  >
                    <MenuItem value="leather">Leather</MenuItem>
                    <MenuItem value="chainmail">Chainmail</MenuItem>
                    <MenuItem value="iron">Iron</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="diamond">Diamond</MenuItem>
                    <MenuItem value="netherite">Netherite</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Defense Points"
                  value={item.armorProperties.defense}
                  onChange={(e) =>
                    updateItem({
                      armorProperties: {
                        ...item.armorProperties!,
                        defense: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Toughness"
                  value={item.armorProperties.toughness}
                  onChange={(e) =>
                    updateItem({
                      armorProperties: {
                        ...item.armorProperties!,
                        toughness: parseFloat(e.target.value),
                      },
                    })
                  }
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Durability"
                  value={item.armorProperties.durability}
                  onChange={(e) =>
                    updateItem({
                      armorProperties: {
                        ...item.armorProperties!,
                        durability: parseInt(e.target.value),
                      },
                      maxDamage: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Food Properties */}
      {item.type === 'food' && item.foodProperties && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Food Properties</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Nutrition: {item.foodProperties.nutrition}</Typography>
                <Slider
                  value={item.foodProperties.nutrition}
                  onChange={(_, value) =>
                    updateItem({
                      foodProperties: { ...item.foodProperties!, nutrition: value as number },
                    })
                  }
                  min={1}
                  max={20}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Saturation: {item.foodProperties.saturation.toFixed(1)}
                </Typography>
                <Slider
                  value={item.foodProperties.saturation}
                  onChange={(_, value) =>
                    updateItem({
                      foodProperties: { ...item.foodProperties!, saturation: value as number },
                    })
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                  ]}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.foodProperties.alwaysEdible}
                      onChange={(e) =>
                        updateItem({
                          foodProperties: {
                            ...item.foodProperties!,
                            alwaysEdible: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Always Edible"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.foodProperties.fastFood}
                      onChange={(e) =>
                        updateItem({
                          foodProperties: { ...item.foodProperties!, fastFood: e.target.checked },
                        })
                      }
                    />
                  }
                  label="Fast Food"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.foodProperties.isMeat}
                      onChange={(e) =>
                        updateItem({
                          foodProperties: { ...item.foodProperties!, isMeat: e.target.checked },
                        })
                      }
                    />
                  }
                  label="Is Meat"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* General Properties */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">General Properties</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Stack Size"
                value={item.maxStackSize}
                onChange={(e) => updateItem({ maxStackSize: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 64 }}
                disabled={item.type === 'tool' || item.type === 'armor' || item.type === 'weapon'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={item.fireproof}
                    onChange={(e) => updateItem({ fireproof: e.target.checked })}
                  />
                }
                label="Fireproof (like Netherite)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={item.customProperties?.hasGlint || false}
                    onChange={(e) =>
                      updateItem({
                        customProperties: {
                          ...item.customProperties!,
                          hasGlint: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Enchanted Glint"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Code Preview Panel */}
      <CodePreviewPanel
        open={codePreviewOpen}
        onClose={() => setCodePreviewOpen(false)}
        itemData={item}
        modId="examplemod"
      />
    </Box>
  );
};

export default ItemMaker;
