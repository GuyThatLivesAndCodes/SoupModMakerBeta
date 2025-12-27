/**
 * Multi-Page Block Editor with Texture/Sound/Model configuration
 */

import React, { useState } from 'react';
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
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Image as TextureIcon,
  VolumeUp as SoundIcon,
} from '@mui/icons-material';

interface BlockEditorMultiPageProps {
  feature: any;
  project: any;
  onUpdate: (feature: any, isDirty?: boolean) => void;
  onSaveAndClose: (feature: any) => void;
}

const STEPS = ['Textures & Model', 'Block Properties', 'Behavior', 'Advanced'];

const BlockEditorMultiPage: React.FC<BlockEditorMultiPageProps> = ({
  feature,
  project,
  onUpdate,
  onSaveAndClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [localFeature, setLocalFeature] = useState(feature);
  const data = localFeature.data || {};

  const handleChange = (field: string, value: any) => {
    const updated = {
      ...localFeature,
      data: {
        ...data,
        [field]: value,
      },
    };
    setLocalFeature(updated);
    onUpdate(updated, true);
  };

  const handleSave = () => {
    onUpdate(localFeature, false);
  };

  const handleSaveAndCloseClick = () => {
    onSaveAndClose(localFeature);
  };

  const handleCloseWithoutSave = () => {
    // TODO: Show confirmation if dirty
    onSaveAndClose(feature); // Close with original feature
  };

  const textures = project.assets?.textures || [];
  const sounds = project.assets?.sounds || [];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header with Save/Close buttons */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {localFeature.name || 'New Block'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleCloseWithoutSave}
          >
            Close without Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAndCloseClick}
          >
            Save & Close
          </Button>
        </Box>
      </Paper>

      {/* Stepper */}
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Stepper activeStep={currentStep}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {currentStep === 0 && (
          <Grid container spacing={3}>
            {/* Texture Configuration */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Texture Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Texture Type</InputLabel>
                <Select
                  value={data.textureType || 'all_sides'}
                  onChange={(e) => handleChange('textureType', e.target.value)}
                >
                  <MenuItem value="all_sides">Same on All Sides</MenuItem>
                  <MenuItem value="top_bottom_sides">Top/Bottom/Sides</MenuItem>
                  <MenuItem value="per_face">Per Face</MenuItem>
                  <MenuItem value="log">Log Style</MenuItem>
                  <MenuItem value="custom_model">Custom Model</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {data.textureType === 'all_sides' && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Select Texture
                </Typography>
                <Grid container spacing={1}>
                  {textures.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ opacity: 0.5 }}>
                        No textures uploaded. Go to Textures panel to upload.
                      </Typography>
                    </Grid>
                  ) : (
                    textures.map((texture: any) => (
                      <Grid item xs={2} key={texture.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: 2,
                            borderColor:
                              data.texture === texture.id
                                ? 'primary.main'
                                : 'transparent',
                          }}
                          onClick={() => handleChange('texture', texture.id)}
                        >
                          <CardMedia
                            component="div"
                            sx={{
                              height: 60,
                              bgcolor: 'background.default',
                              backgroundImage: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px`,
                            }}
                          >
                            {texture.preview && (
                              <img
                                src={texture.preview}
                                alt={texture.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  imageRendering: 'pixelated',
                                }}
                              />
                            )}
                          </CardMedia>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Grid>
            )}

            {data.textureType === 'top_bottom_sides' && (
              <>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption">Top</Typography>
                  {/* Texture selector for top */}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption">Bottom</Typography>
                  {/* Texture selector for bottom */}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption">Sides</Typography>
                  {/* Texture selector for sides */}
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Sound Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sound Type</InputLabel>
                <Select
                  value={data.soundType || 'STONE'}
                  onChange={(e) => handleChange('soundType', e.target.value)}
                >
                  <MenuItem value="STONE">Stone (Preset)</MenuItem>
                  <MenuItem value="WOOD">Wood (Preset)</MenuItem>
                  <MenuItem value="GRAVEL">Gravel (Preset)</MenuItem>
                  <MenuItem value="GRASS">Grass (Preset)</MenuItem>
                  <MenuItem value="METAL">Metal (Preset)</MenuItem>
                  <MenuItem value="GLASS">Glass (Preset)</MenuItem>
                  <MenuItem value="CUSTOM">Custom Sounds</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {data.soundType === 'CUSTOM' && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Custom Sounds
                </Typography>
                {sounds.length === 0 ? (
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    No sounds uploaded. Go to Sounds panel to upload.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Break Sound</InputLabel>
                        <Select
                          value={data.breakSound || ''}
                          onChange={(e) => handleChange('breakSound', e.target.value)}
                        >
                          {sounds.map((sound: any) => (
                            <MenuItem key={sound.id} value={sound.id}>
                              {sound.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Step Sound</InputLabel>
                        <Select
                          value={data.stepSound || ''}
                          onChange={(e) => handleChange('stepSound', e.target.value)}
                        >
                          {sounds.map((sound: any) => (
                            <MenuItem key={sound.id} value={sound.id}>
                              {sound.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Place Sound</InputLabel>
                        <Select
                          value={data.placeSound || ''}
                          onChange={(e) => handleChange('placeSound', e.target.value)}
                        >
                          {sounds.map((sound: any) => (
                            <MenuItem key={sound.id} value={sound.id}>
                              {sound.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        )}

        {currentStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Basic Properties
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
                </Select>
              </FormControl>
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
          </Grid>
        )}

        {currentStep === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Block Behavior
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

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.canBeWaterlogged || false}
                    onChange={(e) => handleChange('canBeWaterlogged', e.target.checked)}
                  />
                }
                label="Can Be Waterlogged"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.isTransparent || false}
                    onChange={(e) => handleChange('isTransparent', e.target.checked)}
                  />
                }
                label="Transparent"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.canProvidePower || false}
                    onChange={(e) => handleChange('canProvidePower', e.target.checked)}
                  />
                }
                label="Can Provide Redstone Power"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.isFlammable || false}
                    onChange={(e) => handleChange('isFlammable', e.target.checked)}
                  />
                }
                label="Flammable"
              />
            </Grid>
          </Grid>
        )}

        {currentStep === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Advanced Settings
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Advanced configuration options coming soon...
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Navigation Footer */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: 0,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          startIcon={<BackIcon />}
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Chip label={`Step ${currentStep + 1} of ${STEPS.length}`} />
        <Button
          endIcon={<NextIcon />}
          onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === STEPS.length - 1}
        >
          Next
        </Button>
      </Paper>
    </Box>
  );
};

export default BlockEditorMultiPage;
