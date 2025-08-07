import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Schedule as ScheduleIcon,
  Support as SupportIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Contact Lease Shield AI
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Get in touch with our team for support, partnerships, or any questions about our AI-powered lease analysis platform.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email Us
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Get direct support from our team
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                contact@leaseshield.eu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                support@leaseshield.eu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <PhoneIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Call Us
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Speak with our support team
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                +31 (0) 20 123 4567
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday, 9:00 - 17:00 CET
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <LocationIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Visit Us
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Our headquarters in Amsterdam
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Lease Shield AI B.V.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Science Park 123<br />
                1098 XG Amsterdam<br />
                Netherlands
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Business Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">Company Details</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lease Shield AI B.V.<br />
                      KvK: 12345678<br />
                      VAT: NL123456789B01
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ScheduleIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">Business Hours</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monday - Friday: 9:00 - 17:00 CET<br />
                      Weekend: Emergency support only<br />
                      Response time: Within 24 hours
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SupportIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">Support Channels</Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Email support (fastest response)<br />
                      • Phone support during business hours<br />
                      • In-app chat for registered users
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>🌐</Typography>
                  <Box>
                    <Typography variant="h6">Follow Us</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <IconButton 
                        href="https://twitter.com/LeaseShieldAI" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#1DA1F2' } }}
                      >
                        <TwitterIcon />
                      </IconButton>
                      <IconButton 
                        href="https://instagram.com/leaseshield" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#E4405F' } }}
                      >
                        <InstagramIcon />
                      </IconButton>
                      <IconButton 
                        href="https://linkedin.com/company/lease-shield-ai" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#0077B5' } }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Partnership and Press Inquiries */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Partnership Inquiries
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Interested in partnering with Lease Shield AI? We work with real estate agencies, 
              property management companies, and legal service providers.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              partnerships@leaseshield.eu
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Press & Media
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              For press inquiries, interviews, or media kits about Lease Shield AI and 
              our AI-powered lease analysis technology.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              press@leaseshield.eu
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;