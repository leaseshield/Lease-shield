import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Shield as ShieldIcon } from '@mui/icons-material';
import { useCommercialAnalytics } from '../hooks/useCommercialAnalytics';

const PortfolioRiskWidget = () => {
  const { analytics, loading, error } = useCommercialAnalytics();

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (!analytics) {
      return <Typography>No data available.</Typography>;
    }

    const { averageRiskScore, riskiestLeases } = analytics;

    return (
      <>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3">{averageRiskScore}</Typography>
          <Typography variant="subtitle1" color="text.secondary">Average Risk Score</Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Top Riskiest Leases</Typography>
        {riskiestLeases.length > 0 ? riskiestLeases.map((lease, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">{lease.name}</Typography>
            <Typography variant="body2" color="error">{lease.score}</Typography>
          </Box>
        )) : <Typography variant="body2">No risky leases found.</Typography>}
      </>
    );
  };

  return (
    <Card>
      <CardHeader
        avatar={<ShieldIcon color="primary" />}
        title="Portfolio Risk Overview"
        subheader="Aggregated risk across all leases"
      />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PortfolioRiskWidget;
