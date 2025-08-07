import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Paper, Container, Breadcrumbs, Link as MuiLink, LinearProgress, Grid, List, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const BlogPostLayout = ({ children, title, description }) => {
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - el.offsetTop, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Helmet>
        <title>{title} | Lease Shield AI Blog</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </MuiLink>
        <MuiLink component={RouterLink} underline="hover" color="inherit" to="/blog">
          Blog
        </MuiLink>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 1, height: 6, borderRadius: 3 }} />
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box ref={contentRef} sx={{
              '& h2': { mt: 4, mb: 2, fontSize: '1.75rem', fontWeight: '600' },
              '& p': { mb: 2, lineHeight: 1.7 },
              '& strong': { fontWeight: 'bold' },
              '& pre': { p: 2, bgcolor: 'action.hover', borderRadius: 1, overflowX: 'auto' },
              '& code': { bgcolor: 'action.hover', px: 0.5, borderRadius: 0.5 },
              '& blockquote': { borderLeft: '4px solid', borderColor: 'divider', pl: 2, color: 'text.secondary', m: 0 }
            }}>
              <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 'bold' }}>
                {title}
              </Typography>
              {children}
            </Box>
          </Grid>
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="overline" color="text.secondary">On this page</Typography>
              <List dense>
                {Array.from((contentRef.current?.querySelectorAll('h2, h3') || [])).map((el, idx) => {
                  const text = el.textContent || `Section ${idx+1}`;
                  let id = el.getAttribute('id');
                  if (!id) {
                    id = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                    el.setAttribute('id', id);
                  }
                  return (
                    <ListItemButton key={id} href={`#${id}`} sx={{ pl: el.tagName === 'H3' ? 3 : 1.5 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={text} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BlogPostLayout; 