/**
 * Block Editor Component
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Slider,
  Grid,
  Divider,
} from '@mui/material';

interface BlockEditorProps {
  feature: any;
  project: any;
  onUpdate: (feature: any) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  feature,
  project,
  onUpdate,
}) => {
  const data = feature.data || {};

  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...feature,
      data: {
        ...data,
        [field]: value,
      },
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 3,
      }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Block Editor
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
          Configure your custom block properties
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Block ID"
              value={data.id || ''}
              onChange={(e) => handleChange('id', e.target.value)}
              helperText="Lowercase, no spaces (e.g., diamond_lamp)"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Display Name"
              value={data.displayName || ''}
              onChange={(e) => handleChange('displayName', e.target.value)}
              helperText="Name shown in game"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Material & Sound
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select
                value={data.material || 'STONE'}
                onChange={(e) => handleChange('material', e.target.value)}
              >
                <MenuItem value="STONE">Stone</MenuItem>
                <MenuItem value="DIRT">Dirt</MenuItem>
                <MenuItem value="WOOD">Wood</MenuItem>
                <MenuItem value="METAL">Metal</MenuItem>
                <MenuItem value="GLASS">Glass</MenuItem>
                <MenuItem value="ICE">Ice</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sound Type</InputLabel>
              <Select
                value={data.soundType || 'STONE'}
                onChange={(e) => handleChange('soundType', e.target.value)}
              >
                <MenuItem value="STONE">Stone</MenuItem>
                <MenuItem value="WOOD">Wood</MenuItem>
                <MenuItem value="GRAVEL">Gravel</MenuItem>
                <MenuItem value="GRASS">Grass</MenuItem>
                <MenuItem value="METAL">Metal</MenuItem>
                <MenuItem value="GLASS">Glass</MenuItem>
                <MenuItem value="WOOL">Wool</MenuItem>
                <MenuItem value="SAND">Sand</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Properties
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Hardness: {data.hardness || 1.5}</Typography>
            <Slider
              value={data.hardness || 1.5}
              onChange={(_, v) => handleChange('hardness', v)}
              min={0}
              max={50}
              step={0.5}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Blast Resistance: {data.resistance || 6.0}
            </Typography>
            <Slider
              value={data.resistance || 6.0}
              onChange={(_, v) => handleChange('resistance', v)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Light Level: {data.lightLevel || 0}</Typography>
            <Slider
              value={data.lightLevel || 0}
              onChange={(_, v) => handleChange('lightLevel', v)}
              min={0}
              max={15}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Creative Tab</InputLabel>
              <Select
                value={data.creativeTab || 'BUILDING_BLOCKS'}
                onChange={(e) => handleChange('creativeTab', e.target.value)}
              >
                <MenuItem value="BUILDING_BLOCKS">Building Blocks</MenuItem>
                <MenuItem value="DECORATIONS">Decorations</MenuItem>
                <MenuItem value="REDSTONE">Redstone</MenuItem>
                <MenuItem value="TRANSPORTATION">Transportation</MenuItem>
                <MenuItem value="MISC">Miscellaneous</MenuItem>
                <MenuItem value="FOOD">Food & Drinks</MenuItem>
                <MenuItem value="TOOLS">Tools & Utilities</MenuItem>
                <MenuItem value="COMBAT">Combat</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Options
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={data.hasItem !== false}
                  onChange={(e) => handleChange('hasItem', e.target.checked)}
                />
              }
              label="Has Item Form"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={data.requiresTool || false}
                  onChange={(e) => handleChange('requiresTool', e.target.checked)}
                />
              }
              label="Requires Tool"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Preview (placeholder) */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Preview
        </Typography>
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            3D preview coming soon
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlockEditor;
