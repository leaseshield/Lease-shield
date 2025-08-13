import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const ApiUsage = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Typography variant="h3" component="h1" gutterBottom>
      API Usage
    </Typography>
    <Typography variant="body1" paragraph>
      Integrate Lease Shield into your own applications with our simple API.
    </Typography>
    <Typography variant="body1" paragraph>
      Access to the API is limited. To request an API key or discuss usage, please contact the owner at{' '}
      <Box component="span" sx={{ fontWeight: 'bold' }}>contact@leaseshield.eu</Box>.
    </Typography>
    <Typography variant="h6" gutterBottom>
      Example Request
    </Typography>
    <Paper sx={{ p: 2, bgcolor: 'grey.100', fontFamily: 'monospace', overflow: 'auto' }}>
      curl -H "X-API-KEY: demo-key" https://your-backend-url/api/public-info
    </Paper>
  </Container>
);

export default ApiUsage;
