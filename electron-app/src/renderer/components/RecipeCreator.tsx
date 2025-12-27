/**
 * Recipe Creator Component
 * Create crafting, smelting, and other recipes
 */

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
  Tabs,
  Tab,
  Card,
  CardContent,
  Slider,
  IconButton,
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  Restaurant as RecipeIcon,
  Code as CodeIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  RecipeData,
  RecipeType,
  DEFAULT_RECIPE,
  DEFAULT_SHAPED_PATTERN,
  DEFAULT_COOKING_PROPERTIES,
  RECIPE_TYPE_NAMES,
  COMMON_ITEMS,
  RecipeIngredient,
} from '@soupmodmaker/core';

export const RecipeCreator: React.FC = () => {
  const [recipe, setRecipe] = useState<RecipeData>({
    ...DEFAULT_RECIPE,
    id: '',
    name: '',
    createdAt: new Date(),
    modifiedAt: new Date(),
    shapedPattern: { ...DEFAULT_SHAPED_PATTERN },
  } as RecipeData);

  const [gridHover, setGridHover] = useState<number | null>(null);

  const updateRecipe = (updates: Partial<RecipeData>) => {
    setRecipe({ ...recipe, ...updates, modifiedAt: new Date() });
  };

  const handleTypeChange = (newType: RecipeType) => {
    const updates: Partial<RecipeData> = { type: newType };

    if (newType === 'crafting_shaped') {
      updates.shapedPattern = { ...DEFAULT_SHAPED_PATTERN };
    } else if (newType === 'crafting_shapeless') {
      updates.shapelessIngredients = { ingredients: [] };
    } else if (['smelting', 'blasting', 'smoking', 'campfire_cooking'].includes(newType)) {
      updates.cookingProperties = { ...DEFAULT_COOKING_PROPERTIES };
    }

    updateRecipe(updates);
  };

  // Handle 3x3 crafting grid
  const handleGridClick = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const currentPattern = recipe.shapedPattern?.pattern || ['   ', '   ', '   '];
    const currentKey = recipe.shapedPattern?.key || {};

    // Prompt for item
    const item = prompt('Enter item ID (e.g., minecraft:iron_ingot) or leave empty to clear:');

    if (item === null) return; // Cancelled

    if (item === '') {
      // Clear the slot
      const newPattern = [...currentPattern];
      newPattern[row] = newPattern[row].substring(0, col) + ' ' + newPattern[row].substring(col + 1);
      updateRecipe({
        shapedPattern: {
          pattern: newPattern as [string, string, string],
          key: currentKey,
        },
      });
    } else {
      // Set the slot with a letter
      const usedLetters = new Set(Object.keys(currentKey));
      let letter = 'A';

      // Find if this item already has a letter
      for (const [key, ingredient] of Object.entries(currentKey)) {
        if (ingredient.item === item) {
          letter = key;
          break;
        }
      }

      // If not, find the next available letter
      if (!currentKey[letter] || currentKey[letter].item !== item) {
        while (usedLetters.has(letter)) {
          letter = String.fromCharCode(letter.charCodeAt(0) + 1);
        }
      }

      const newPattern = [...currentPattern];
      newPattern[row] = newPattern[row].substring(0, col) + letter + newPattern[row].substring(col + 1);

      const newKey = { ...currentKey };
      newKey[letter] = { item, isTag: item.startsWith('#'), count: 1 };

      updateRecipe({
        shapedPattern: {
          pattern: newPattern as [string, string, string],
          key: newKey,
        },
      });
    }
  };

  const saveRecipe = async () => {
    if (!recipe.name || !recipe.id) {
      alert('Please enter a name and ID for your recipe!');
      return;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('recipe:save', recipe);

      if (result.success) {
        alert(`Recipe "${recipe.name}" saved successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to save recipe: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert(`Error saving recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportRecipe = async () => {
    if (!recipe.name || !recipe.id) {
      alert('Please enter a name and ID for your recipe!');
      return;
    }

    const modId = prompt('Enter your mod ID (e.g., mymod):');
    if (!modId) return;

    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('recipe:export', recipe, modId);

      if (result.success) {
        alert(`Recipe exported successfully!\n\nLocation: ${result.path}`);
      } else {
        alert(`Failed to export recipe: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting recipe:', error);
      alert(`Error exporting recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Get item name for grid display
  const getItemDisplay = (item: string) => {
    return item.replace('minecraft:', '').replace(/_/g, ' ');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <RecipeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Recipe Creator</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={exportRecipe} sx={{ mr: 1 }}>
          Export Code
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveRecipe}>
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
              label="Recipe Name"
              value={recipe.name}
              onChange={(e) => updateRecipe({ name: e.target.value })}
              placeholder="e.g., Iron Pickaxe Recipe"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipe ID"
              value={recipe.id}
              onChange={(e) => updateRecipe({ id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="e.g., iron_pickaxe"
              helperText="Unique identifier (lowercase, underscores only)"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Recipe Type</InputLabel>
              <Select
                value={recipe.type}
                onChange={(e) => handleTypeChange(e.target.value as RecipeType)}
                label="Recipe Type"
              >
                {Object.entries(RECIPE_TYPE_NAMES).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Result Item"
              value={recipe.result.item}
              onChange={(e) =>
                updateRecipe({
                  result: { ...recipe.result, item: e.target.value },
                })
              }
              placeholder="e.g., minecraft:iron_pickaxe"
              helperText="The item this recipe creates"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Result Count"
              value={recipe.result.count}
              onChange={(e) =>
                updateRecipe({
                  result: { ...recipe.result, count: parseInt(e.target.value) || 1 },
                })
              }
              inputProps={{ min: 1, max: 64 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Shaped Crafting Pattern */}
      {recipe.type === 'crafting_shaped' && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Crafting Pattern (3x3 Grid)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click each slot to set the item. The pattern will be automatically compacted.
          </Typography>

          {/* 3x3 Grid */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Grid container spacing={1} sx={{ maxWidth: 300 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const pattern = recipe.shapedPattern?.pattern || ['   ', '   ', '   '];
                const letter = pattern[row][col];
                const ingredient = letter !== ' ' ? recipe.shapedPattern?.key[letter] : null;

                return (
                  <Grid item xs={4} key={index}>
                    <Card
                      sx={{
                        height: 90,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: gridHover === index ? 'action.hover' : 'background.paper',
                        border: 2,
                        borderColor: ingredient ? 'primary.main' : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'scale(1.05)',
                        },
                      }}
                      onClick={() => handleGridClick(index)}
                      onMouseEnter={() => setGridHover(index)}
                      onMouseLeave={() => setGridHover(null)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        {ingredient ? (
                          <>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {letter}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                              {getItemDisplay(ingredient.item)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Empty
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Pattern Key */}
          {recipe.shapedPattern && Object.keys(recipe.shapedPattern.key).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Pattern Key:
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(recipe.shapedPattern.key).map(([letter, ingredient]) => (
                  <Grid item xs={12} sm={6} md={4} key={letter}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="body2">
                          <strong>{letter}:</strong> {ingredient.item}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      )}

      {/* Cooking Properties (Furnace, etc.) */}
      {recipe.cookingProperties && ['smelting', 'blasting', 'smoking', 'campfire_cooking'].includes(recipe.type) && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Cooking Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Input Item"
                value={recipe.cookingProperties.ingredient.item}
                onChange={(e) =>
                  updateRecipe({
                    cookingProperties: {
                      ...recipe.cookingProperties!,
                      ingredient: {
                        ...recipe.cookingProperties!.ingredient,
                        item: e.target.value,
                      },
                    },
                  })
                }
                placeholder="e.g., minecraft:iron_ore"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Cooking Time: {(recipe.cookingProperties.cookingTime / 20).toFixed(1)}s ({recipe.cookingProperties.cookingTime} ticks)
              </Typography>
              <Slider
                value={recipe.cookingProperties.cookingTime}
                onChange={(_, value) =>
                  updateRecipe({
                    cookingProperties: {
                      ...recipe.cookingProperties!,
                      cookingTime: value as number,
                    },
                  })
                }
                min={20}
                max={600}
                step={20}
                marks={[
                  { value: 100, label: '5s' },
                  { value: 200, label: '10s' },
                  { value: 400, label: '20s' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Experience Reward"
                value={recipe.cookingProperties.experience}
                onChange={(e) =>
                  updateRecipe({
                    cookingProperties: {
                      ...recipe.cookingProperties!,
                      experience: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default RecipeCreator;
