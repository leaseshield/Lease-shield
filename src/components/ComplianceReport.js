import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Gavel as GavelIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, ReportProblem as ReportProblemIcon } from '@mui/icons-material';

const ComplianceReport = ({ report }) => {
  if (!report) return null;

  const { summary, deviations, missing_clauses } = report;

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader
        avatar={<GavelIcon color="primary" />}
        title="Compliance Report"
        subheader="Comparison against your master template"
      />
      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>{summary}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Deviations from Template</Typography>
        {deviations && deviations.length > 0 ? (
          <List dense>
            {deviations.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                <ListItemText primary={item.clause_title} secondary={item.description} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No deviations found.</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Missing Clauses</Typography>
        {missing_clauses && missing_clauses.length > 0 ? (
          <List dense>
            {missing_clauses.map((clause, index) => (
              <ListItem key={index}>
                <ListItemIcon><ReportProblemIcon color="error" /></ListItemIcon>
                <ListItemText primary={clause} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No missing clauses found.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceReport;
