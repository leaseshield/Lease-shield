import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { useCommercialAnalytics } from '../hooks/useCommercialAnalytics';

const CommonClauseWidget = () => {
  const { analytics, loading, error } = useCommercialAnalytics();

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (!analytics || !analytics.commonClauses) {
      return <Typography>No data available.</Typography>;
    }

    return (
      <>
        {analytics.commonClauses.length > 0 ? analytics.commonClauses.map((clause, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{clause.name}</Typography>
            <Typography variant="body2" color="text.secondary">{clause.count} instances</Typography>
          </Box>
        )) : <Typography variant="body2">No common risky clauses found.</Typography>}
      </>
    );
  };

  return (
    <Card>
      <CardHeader
        avatar={<GavelIcon color="primary" />}
        title="Common Risky Clauses"
        subheader="Frequently identified non-standard clauses"
      />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default CommonClauseWidget;
