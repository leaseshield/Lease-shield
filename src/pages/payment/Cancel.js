import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get('order_id');

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Payment Canceled
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {orderId ? `Order ID: ${orderId}` : 'The payment was canceled or failed.'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/pricing')}>
          Try Again
        </Button>
      </Box>
    </Container>
  );
};

export default Cancel;

