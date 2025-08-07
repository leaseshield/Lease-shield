import React, { useState, useEffect } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { useUserProfile } from '../context/UserProfileContext'; // Import the user profile hook
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
    Dashboard as DashboardIcon,
    Description as DescriptionIcon,
    CameraAlt as CameraAltIcon,
    ReceiptLong as ReceiptLongIcon,
    Calculate as CalculateIcon,
    PersonSearch as PersonSearchIcon,
    BarChart as BarChartIcon, // Icon for analytics
    Gavel as GavelIcon // Icon for compliance
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Import the new commercial widgets
import PortfolioRiskWidget from '../components/PortfolioRiskWidget';
import CommonClauseWidget from '../components/CommonClauseWidget';
import LeaseExpiryWidget from '../components/LeaseExpiryWidget';

const DashboardPage = () => {
  const { user } = useAuthState();
  const { profile, loadingProfile } = useUserProfile(); // Get user profile and loading state
  const [leases, setLeases] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return; 
      }

      setLoading(true);
      setError('');

      try {
        // Fetch Leases
        const leasesQuery = query(
          collection(db, 'leases'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const leaseSnapshot = await getDocs(leasesQuery);
        const leaseData = leaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeases(leaseData);

        // Fetch Inspections
        const inspectionsQuery = query(
          collection(db, 'inspections'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const inspectionSnapshot = await getDocs(inspectionsQuery);
        const inspectionData = inspectionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInspections(inspectionData);

        // Fetch Expenses
        const expensesQuery = query(
          collection(db, 'expenses'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const expenseSnapshot = await getDocs(expensesQuery);
        const expenseData = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExpenses(expenseData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Combined loading state
  if (loading || loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
     return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
             <Alert severity="info">Please log in to view your dashboard.</Alert>
         </Container>
     );
  }

  const isCommercial = profile?.subscriptionTier === 'commercial';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ mr: 1 }} /> Dashboard Overview
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* KPI Header */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Total Analyses</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{leases.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Inspections</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{inspections.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Expenses</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{expenses.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" component={Link} to="/analysis" startIcon={<DescriptionIcon />}>
          Analyze New Lease
        </Button>
        <Button variant="contained" component={Link} to="/photo-inspection" startIcon={<CameraAltIcon />}>
          Start New Inspection
        </Button>
        <Button variant="contained" component={Link} to="/expense-scanner" startIcon={<ReceiptLongIcon />}>
          Scan New Expense
        </Button>
        <Button variant="contained" component={Link} to="/calculator" startIcon={<CalculateIcon />}>
          Lease Calculator
        </Button>
        <Button variant="contained" component={Link} to="/tenant-matcher" startIcon={<PersonSearchIcon />}>
          Tenant Matcher
        </Button>
        {isCommercial && (
          <Button variant="outlined" component={Link} to="/compliance" startIcon={<GavelIcon />}>
            Manage Compliance
          </Button>
        )}
      </Box>

      {/* --- Commercial Analytics Section --- */}
      {isCommercial && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon sx={{ mr: 1 }} /> Commercial Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <PortfolioRiskWidget />
            </Grid>
            <Grid item xs={12} md={4}>
              <CommonClauseWidget />
            </Grid>
            <Grid item xs={12} md={4}>
              <LeaseExpiryWidget />
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Leases Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <Card>
            <CardHeader 
                avatar={<DescriptionIcon />} 
                title="Recent Lease Analyses" 
            />
            <CardContent>
              {leases.length > 0 ? (
                <List dense>
                  {leases.slice(0, 5).map(lease => (
                    <ListItem key={lease.id} secondaryAction={<span>{lease.analysis?.score || 'N/A'}</span>}>
                      <ListItemText 
                          primary={lease.fileName || 'Lease Analysis'}
                          secondary={`Analyzed: ${lease.createdAt?.toDate().toLocaleDateString() || 'Unknown'}`}
                      />
                    </ListItem>
                  ))}
                  {leases.length > 5 && <ListItem><ListItemText primary="...and more" /></ListItem>}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No lease analyses found.</Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>

        {/* Inspections Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader avatar={<CameraAltIcon />} title="Recent Inspections" />
            <CardContent>
              {inspections.length > 0 ? (
                 <List dense>
                    {inspections.slice(0, 5).map(inspection => (
                      <ListItem key={inspection.id} secondaryAction={<span>{inspection.repairEstimate?.totalEstimatedCost ? `$${inspection.repairEstimate.totalEstimatedCost.toFixed(2)}` : 'N/A'}</span>}>
                        <ListItemText 
                            primary={`Inspection (${inspection.results?.length || 0} photos)`}
                            secondary={`Inspected: ${inspection.createdAt?.toDate().toLocaleDateString() || 'Unknown'}`}
                        />
                      </ListItem>
                    ))}
                    {inspections.length > 5 && <ListItem><ListItemText primary="...and more" /></ListItem>}
                 </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No inspections found.</Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>

        {/* Expenses Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card>
            <CardHeader avatar={<ReceiptLongIcon />} title="Recent Expenses" />
            <CardContent>
               {expenses.length > 0 ? (
                 <List dense>
                   {expenses.slice(0, 5).map(expense => (
                     <ListItem key={expense.id} secondaryAction={<span>{expense.extractedData?.amount ? `$${expense.extractedData.amount.toFixed(2)}` : 'N/A'}</span>}>
                       <ListItemText 
                           primary={expense.extractedData?.vendor || expense.fileName || 'Expense'}
                           secondary={`Date: ${expense.extractedData?.date || expense.createdAt?.toDate().toLocaleDateString() || 'Unknown'}`}
                       />
                     </ListItem>
                   ))}
                   {expenses.length > 5 && <ListItem><ListItemText primary="...and more" /></ListItem>}
                 </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No expenses found.</Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 