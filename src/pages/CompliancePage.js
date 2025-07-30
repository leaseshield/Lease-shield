import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ComplianceTemplateManager from '../components/ComplianceTemplateManager';

const CompliancePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Compliance Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload and manage your organization's "gold-standard" lease template. When you analyze new leases, they will be automatically checked against this template for deviations.
      </Typography>
      <ComplianceTemplateManager />
    </Container>
  );
};

export default CompliancePage;
