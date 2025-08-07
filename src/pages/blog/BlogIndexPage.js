import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Box
} from '@mui/material';

// Define blog posts data (replace with dynamic fetching later if needed)
const blogPosts = [
  {
    slug: 'understand-lease-in-60-seconds',
    title: 'That 70-Page Lease Agreement? Understand It in 60 Seconds.',
    excerpt: 'Use Lease Shield AI to decode clauses, spot risks, and protect your rights — faster than making a coffee.'
  },
  {
    slug: 'commercial-lease-5-key-differences',
    title: 'Not Just a Bigger Apartment: 5 Key Differences in a Commercial Lease',
    excerpt: 'Commercial leases are complex. Learn about NNN, use clauses, subletting rights, and more before you sign.'
  },
  {
    slug: 'ultimate-move-in-checklist',
    title: 'The Ultimate Move-In Checklist: How to Document Your Rental and Protect Your Deposit',
    excerpt: 'Document everything on move-in with photos, tests, and an AI-annotated report to secure your deposit.'
  },
  {
    slug: 'using-lease-shield-ai-effectively',
    title: 'How to Use Lease Shield AI Effectively',
    excerpt: 'Tips for uploading documents, interpreting analysis reports, understanding scores, and leveraging AI...'
  },
  {
    slug: 'how-to-spot-lease-scams',
    title: 'How to Spot Common Rental Lease Scams',
    excerpt: 'Protect yourself from rental scams by learning common tactics scammers use...',
  },
  {
    slug: 'understanding-common-clauses',
    title: 'Decoding Your Lease: Understanding Common Clauses',
    excerpt: 'A detailed breakdown of common rental lease clauses like rent, security deposit, maintenance, pets, subletting...'
  },
  {
    slug: 'negotiating-lease-terms',
    title: 'Tips for Negotiating Your Lease Terms',
    excerpt: 'Learn effective strategies for negotiating specific terms in your rental lease before signing...',
  },
  {
    slug: 'lease-red-flags',
    title: 'Red Flags to Watch For in a Lease Agreement',
    excerpt: 'Learn to identify potential red flags and concerning clauses in a rental lease...',
  },
  {
    slug: 'tenant-rights-overview',
    title: 'Know Your Rights: A Basic Overview for Tenants',
    excerpt: 'Understand fundamental tenant rights related to privacy, repairs, security deposits...',
  },
];

const BlogIndexPage = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Helmet>
        <title>Lease Shield AI Blog | Tips for Tenants & Lease Analysis</title>
        <meta 
          name="description" 
          content="Read articles on understanding leases, spotting scams, negotiating terms, and tenant rights from Lease Shield AI."
        />
      </Helmet>
      <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 4, fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 'bold' }}>
        Lease Shield AI Blog
      </Typography>
      <Grid container spacing={3}>
        {blogPosts.map((post, idx) => (
          <Grid item xs={12} sm={6} md={4} key={post.slug}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
            <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
              <CardActionArea component={RouterLink} to={`/blog/${post.slug}`} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image="/images/document-analysis.svg"
                  alt={post.title}
                  sx={{ objectFit: 'contain', bgcolor: 'action.hover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.excerpt}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label="Lease" />
                    <Chip size="small" label="Guides" variant="outlined" />
                    <Box sx={{ ml: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">5 min read</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogIndexPage; 