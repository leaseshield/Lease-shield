import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack, Chip, useTheme, Link } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import LanguageIcon from '@mui/icons-material/Translate';
import PsychologyIcon from '@mui/icons-material/PsychologyOutlined';
import { Link as RouterLink } from 'react-router-dom';

const Hero = ({ onPrimaryClick }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 }, background: (t) => t.palette.gradients.soft, borderRadius: 4 }}>
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
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: theme.shadows[8],
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
            }}>
              <Box
                component="video"
                aria-label="Product demonstration video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/video-poster.jpg"
                controls={false}
                sx={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
              >
                <track
                  kind="captions"
                  src="/product-video-en.vtt"
                  srcLang="en"
                  label="English captions"
                  default
                />
                <source src="/Product Launch Video_compressed.mp4" type="video/mp4" />
                <source src="/Product Launch Video.mp4" type="video/mp4" />
              </Box>
              <Link
                href="/product-video-transcript.txt"
                download
                sx={{ mt: 1, display: 'inline-block' }}
              >
                Download transcript
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;

