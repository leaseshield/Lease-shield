import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, LinearProgress, Grid } from '@mui/material';
import { Gavel as GavelIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, ReportProblem as ReportProblemIcon } from '@mui/icons-material';

const ComplianceReport = ({ report }) => {
  if (!report) return null;

  const { summary, deviations, missing_clauses, compliance_score } = report;

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader
        avatar={<GavelIcon color="primary" />}
        title="Compliance Report"
        subheader="Comparison against your master template"
      />
      <CardContent>
        {/* Score gauge */}
        {typeof compliance_score === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Compliance Score</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ minWidth: 48 }}><Typography variant="h5" sx={{ fontWeight: 'bold' }}>{compliance_score}</Typography></Box>
              <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, compliance_score))} sx={{ flex: 1, height: 10, borderRadius: 5 }} />
            </Box>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>{summary}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Deviations from Template</Typography>
        {deviations && deviations.length > 0 ? (
          <Grid container spacing={1}>
            {deviations.map((item, index) => (
              <Grid item xs={12} key={index}>
                <List dense>
                  <ListItem>
                    <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                    <ListItemText primary={item.clause_title} secondary={item.description} />
                    {item.severity && <Chip size="small" color={item.severity === 'high' ? 'error' : item.severity === 'medium' ? 'warning' : 'default'} label={item.severity} />}
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
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
