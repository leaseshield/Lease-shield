import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
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
          Payment Successful
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {orderId ? `Order ID: ${orderId}` : 'Your payment was successful.'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Success;

