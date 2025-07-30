import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import { useCommercialAnalytics } from '../hooks/useCommercialAnalytics';

const LeaseExpiryWidget = () => {
  const { analytics, loading, error } = useCommercialAnalytics();

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (!analytics || !analytics.upcomingExpiries) {
      return <Typography>No data available.</Typography>;
    }

    return (
      <>
        {analytics.upcomingExpiries.length > 0 ? analytics.upcomingExpiries.map((lease, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{lease.name}</Typography>
            <Typography variant="body2">{lease.date}</Typography>
          </Box>
        )) : <Typography variant="body2">No leases expiring soon.</Typography>}
      </>
    );
  };

  return (
    <Card>
      <CardHeader
        avatar={<EventIcon color="primary" />}
        title="Upcoming Lease Expirations"
        subheader="Leases ending within the next 90 days"
      />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default LeaseExpiryWidget;
