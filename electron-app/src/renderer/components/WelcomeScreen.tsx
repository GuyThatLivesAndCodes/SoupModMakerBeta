/**
 * Welcome Screen
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as NewIcon,
  FolderOpen as OpenIcon,
  School as TutorialIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

interface WelcomeScreenProps {
  onNewProject: () => void;
  onOpenProject: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNewProject,
  onOpenProject,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        bgcolor: 'background.default',
      }}
    >
      {/* Logo / Title */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          SoupModMaker
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7, mb: 1 }}>
          Modern Minecraft Mod & Plugin Creator
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          Create mods for multiple versions - fast, fun, and free
        </Typography>
      </Box>

      {/* Action Cards */}
      <Grid container spacing={3} sx={{ maxWidth: 800 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={onNewProject}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <NewIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                New Project
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Start creating a new mod or plugin from scratch
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={onOpenProject}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <OpenIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Open Project
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Continue working on an existing project
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TutorialIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tutorials
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Learn how to create amazing mods
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <GitHubIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                GitHub
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Contribute to the project
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          Multi-version support • Modern UI • Plugin-based architecture • Free and Open Source
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
