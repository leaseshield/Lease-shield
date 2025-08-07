import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack, Chip, useTheme, Link } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import LanguageIcon from '@mui/icons-material/Translate';
import PsychologyIcon from '@mui/icons-material/PsychologyOutlined';
import { Link as RouterLink } from 'react-router-dom';

const BackgroundDecor = () => (
  <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <Box sx={{
      position: 'absolute',
      top: -120,
      right: -120,
      width: 360,
      height: 360,
      borderRadius: '50%',
      filter: 'blur(60px)',
      background: 'radial-gradient(circle at 30% 30%, rgba(102,126,234,0.35), transparent 60%)'
    }} />
    <Box sx={{
      position: 'absolute',
      bottom: -140,
      left: -100,
      width: 420,
      height: 420,
      borderRadius: '50%',
      filter: 'blur(70px)',
      background: 'radial-gradient(circle at 70% 70%, rgba(240,147,251,0.35), transparent 60%)'
    }} />
  </Box>
);

const Hero = ({ onPrimaryClick }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
      <BackgroundDecor />
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Understand Your Lease in Minutes
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              AI trained on legal documents to analyze agreements, flag risks, and explain clauses in plain language.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <Button variant="contained" size="large" onClick={onPrimaryClick}>Start free</Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/pricing">View pricing</Button>
            </Stack>
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<DescriptionIcon fontSize="small" />} label="Handles 700+ page PDFs" size="small" />
              <Chip icon={<LanguageIcon fontSize="small" />} label="30+ languages" size="small" />
              <Chip icon={<PsychologyIcon fontSize="small" />} label="Specialized AI" size="small" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.shadows[8],
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
            }}>
              <Box component="video" src="/Product Launch Video_compressed.mp4" controls poster="/video-poster.jpg" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;

