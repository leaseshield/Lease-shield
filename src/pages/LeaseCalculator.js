import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  CalculateOutlined, 
  TrendingUp, 
  CompareArrows,
  AttachMoney,
  Home,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';

const LeaseCalculator = ({ showSnackbar }) => {
  const [calculatorType, setCalculatorType] = useState('rent');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [leaseTermMonths, setLeaseTermMonths] = useState('12');
  const [moveInDate, setMoveInDate] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  // New state variables for enhanced features
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [utilities, setUtilities] = useState({
    electricity: '',
    water: '',
    gas: '',
    internet: '',
    trash: ''
  });
  const [moveInCosts, setMoveInCosts] = useState({
    firstMonthRent: '',
    lastMonthRent: '',
    applicationFee: '',
    petDeposit: '',
    parkingFee: '',
    otherFees: ''
  });
  const [comparisonLeases, setComparisonLeases] = useState([
    { name: 'Current Option', rent: '', deposit: '', term: '12', utilities: '' },
    { name: 'Alternative 1', rent: '', deposit: '', term: '12', utilities: '' },
    { name: 'Alternative 2', rent: '', deposit: '', term: '12', utilities: '' }
  ]);
  const [breakEvenAnalysis, setBreakEvenAnalysis] = useState({
    currentRent: '',
    newRent: '',
    movingCosts: '',
    currentDeposit: '',
    newDeposit: ''
  });

  const handleCalculate = () => {
    let result = {};
    
    switch (calculatorType) {
      case 'rent':
        const annualRent = parseFloat(monthlyRent) * 12;
        const totalLeaseTerm = parseFloat(monthlyRent) * parseInt(leaseTermMonths);
        
        result = {
          monthlyRent: parseFloat(monthlyRent).toFixed(2),
          annualRent: annualRent.toFixed(2),
          totalLeaseTerm: totalLeaseTerm.toFixed(2)
        };
        break;
        
      case 'prorated':
        if (moveInDate) {
          const date = new Date(moveInDate);
          const month = date.getMonth();
          const day = date.getDate();
          
          // Get days in month
          const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();
          const remainingDays = daysInMonth - day + 1;
          
          const proratedRent = (parseFloat(monthlyRent) / daysInMonth) * remainingDays;
          
          result = {
            fullMonthlyRent: parseFloat(monthlyRent).toFixed(2),
            moveInDate: moveInDate,
            daysInMonth: daysInMonth,
            remainingDays: remainingDays,
            proratedRent: proratedRent.toFixed(2)
          };
        }
        break;
        
      case 'deposit':
        const depositPercentage = (parseFloat(securityDeposit) / parseFloat(monthlyRent) * 100).toFixed(1);
        result = {
          monthlyRent: parseFloat(monthlyRent).toFixed(2),
          securityDeposit: parseFloat(securityDeposit).toFixed(2),
          depositPercentage: depositPercentage
        };
        break;

      case 'income-ratio':
        const monthlyRentNum = parseFloat(monthlyRent);
        const monthlyIncomeNum = parseFloat(monthlyIncome);
        const annualIncomeNum = parseFloat(annualIncome);
        
        const rentToIncomeRatio = ((monthlyRentNum / monthlyIncomeNum) * 100).toFixed(1);
        const annualRatio = ((annualRent / annualIncomeNum) * 100).toFixed(1);
        
        result = {
          monthlyRent: monthlyRentNum.toFixed(2),
          monthlyIncome: monthlyIncomeNum.toFixed(2),
          annualIncome: annualIncomeNum.toFixed(2),
          rentToIncomeRatio: rentToIncomeRatio,
          annualRatio: annualRatio,
          isAffordable: parseFloat(rentToIncomeRatio) <= 30
        };
        break;

      case 'utilities':
        const totalUtilities = Object.values(utilities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
        const rentWithUtilities = parseFloat(monthlyRent) + totalUtilities;
        
        result = {
          monthlyRent: parseFloat(monthlyRent).toFixed(2),
          utilities: utilities,
          totalUtilities: totalUtilities.toFixed(2),
          rentWithUtilities: rentWithUtilities.toFixed(2),
          utilitiesPercentage: ((totalUtilities / parseFloat(monthlyRent)) * 100).toFixed(1)
        };
        break;

      case 'move-in':
        const totalMoveInCosts = Object.values(moveInCosts).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
        
        result = {
          moveInCosts: moveInCosts,
          totalMoveInCosts: totalMoveInCosts.toFixed(2),
          breakdown: Object.entries(moveInCosts).map(([key, value]) => ({
            name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            value: parseFloat(value) || 0
          })).filter(item => item.value > 0)
        };
        break;

      case 'comparison':
        const leaseComparisons = comparisonLeases.map(lease => {
          const rent = parseFloat(lease.rent) || 0;
          const deposit = parseFloat(lease.deposit) || 0;
          const term = parseInt(lease.term) || 12;
          const utilities = parseFloat(lease.utilities) || 0;
          
          return {
            name: lease.name,
            monthlyCost: rent + utilities,
            totalCost: (rent + utilities) * term + deposit,
            costPerMonth: ((rent + utilities) * term + deposit) / term,
            depositPercentage: rent > 0 ? ((deposit / rent) * 100).toFixed(1) : 0
          };
        });
        
        result = {
          comparisons: leaseComparisons,
          bestValue: leaseComparisons.reduce((best, current) => 
            current.costPerMonth < best.costPerMonth ? current : best
          )
        };
        break;

      case 'break-even':
        const currentRent = parseFloat(breakEvenAnalysis.currentRent);
        const newRent = parseFloat(breakEvenAnalysis.newRent);
        const movingCosts = parseFloat(breakEvenAnalysis.movingCosts);
        const currentDeposit = parseFloat(breakEvenAnalysis.currentDeposit);
        const newDeposit = parseFloat(breakEvenAnalysis.newDeposit);
        
        const monthlySavings = currentRent - newRent;
        const totalMovingCosts = movingCosts + (newDeposit - currentDeposit);
        const breakEvenMonths = monthlySavings > 0 ? (totalMovingCosts / monthlySavings) : 0;
        
        result = {
          currentRent: currentRent.toFixed(2),
          newRent: newRent.toFixed(2),
          monthlySavings: monthlySavings.toFixed(2),
          totalMovingCosts: totalMovingCosts.toFixed(2),
          breakEvenMonths: breakEvenMonths.toFixed(1),
          isWorthIt: monthlySavings > 0 && breakEvenMonths < 24
        };
        break;
        
      default:
        break;
    }
    
    setCalculationResult(result);
    setShowResult(true);
  };

  const renderCalculator = () => {
    switch (calculatorType) {
      case 'rent':
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Lease Term</InputLabel>
                  <Select
                    value={leaseTermMonths}
                    label="Lease Term"
                    onChange={(e) => setLeaseTermMonths(e.target.value)}
                  >
                    <MenuItem value={6}>6 Months</MenuItem>
                    <MenuItem value={12}>12 Months</MenuItem>
                    <MenuItem value={18}>18 Months</MenuItem>
                    <MenuItem value={24}>24 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'prorated':
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Move-in Date"
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'deposit':
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Security Deposit"
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'income-ratio':
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Annual Income"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'utilities':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Monthly Utility Costs</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Electricity"
                  type="number"
                  value={utilities.electricity}
                  onChange={(e) => setUtilities({...utilities, electricity: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Water"
                  type="number"
                  value={utilities.water}
                  onChange={(e) => setUtilities({...utilities, water: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Gas"
                  type="number"
                  value={utilities.gas}
                  onChange={(e) => setUtilities({...utilities, gas: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Internet"
                  type="number"
                  value={utilities.internet}
                  onChange={(e) => setUtilities({...utilities, internet: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Trash"
                  type="number"
                  value={utilities.trash}
                  onChange={(e) => setUtilities({...utilities, trash: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'move-in':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Move-in Costs</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Month's Rent"
                  type="number"
                  value={moveInCosts.firstMonthRent}
                  onChange={(e) => setMoveInCosts({...moveInCosts, firstMonthRent: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Month's Rent"
                  type="number"
                  value={moveInCosts.lastMonthRent}
                  onChange={(e) => setMoveInCosts({...moveInCosts, lastMonthRent: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Application Fee"
                  type="number"
                  value={moveInCosts.applicationFee}
                  onChange={(e) => setMoveInCosts({...moveInCosts, applicationFee: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pet Deposit"
                  type="number"
                  value={moveInCosts.petDeposit}
                  onChange={(e) => setMoveInCosts({...moveInCosts, petDeposit: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parking Fee"
                  type="number"
                  value={moveInCosts.parkingFee}
                  onChange={(e) => setMoveInCosts({...moveInCosts, parkingFee: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Other Fees"
                  type="number"
                  value={moveInCosts.otherFees}
                  onChange={(e) => setMoveInCosts({...moveInCosts, otherFees: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'comparison':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Compare Lease Options</Typography>
            {comparisonLeases.map((lease, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary>
                  <Typography variant="subtitle1">{lease.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Monthly Rent"
                        type="number"
                        value={lease.rent}
                        onChange={(e) => {
                          const newLeases = [...comparisonLeases];
                          newLeases[index].rent = e.target.value;
                          setComparisonLeases(newLeases);
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Security Deposit"
                        type="number"
                        value={lease.deposit}
                        onChange={(e) => {
                          const newLeases = [...comparisonLeases];
                          newLeases[index].deposit = e.target.value;
                          setComparisonLeases(newLeases);
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Lease Term</InputLabel>
                        <Select
                          value={lease.term}
                          label="Lease Term"
                          onChange={(e) => {
                            const newLeases = [...comparisonLeases];
                            newLeases[index].term = e.target.value;
                            setComparisonLeases(newLeases);
                          }}
                        >
                          <MenuItem value={6}>6 Months</MenuItem>
                          <MenuItem value={12}>12 Months</MenuItem>
                          <MenuItem value={18}>18 Months</MenuItem>
                          <MenuItem value={24}>24 Months</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Monthly Utilities"
                        type="number"
                        value={lease.utilities}
                        onChange={(e) => {
                          const newLeases = [...comparisonLeases];
                          newLeases[index].utilities = e.target.value;
                          setComparisonLeases(newLeases);
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );

      case 'break-even':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Break-even Analysis</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Monthly Rent"
                  type="number"
                  value={breakEvenAnalysis.currentRent}
                  onChange={(e) => setBreakEvenAnalysis({...breakEvenAnalysis, currentRent: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Monthly Rent"
                  type="number"
                  value={breakEvenAnalysis.newRent}
                  onChange={(e) => setBreakEvenAnalysis({...breakEvenAnalysis, newRent: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Moving Costs"
                  type="number"
                  value={breakEvenAnalysis.movingCosts}
                  onChange={(e) => setBreakEvenAnalysis({...breakEvenAnalysis, movingCosts: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Security Deposit"
                  type="number"
                  value={breakEvenAnalysis.currentDeposit}
                  onChange={(e) => setBreakEvenAnalysis({...breakEvenAnalysis, currentDeposit: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Security Deposit"
                  type="number"
                  value={breakEvenAnalysis.newDeposit}
                  onChange={(e) => setBreakEvenAnalysis({...breakEvenAnalysis, newDeposit: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!showResult || !calculationResult) return null;
    
    switch (calculatorType) {
      case 'rent':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rent Calculation Results</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.monthlyRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Annual Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.annualRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total for Lease Term:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.totalLeaseTerm}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
        
      case 'prorated':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Prorated Rent Results</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Full Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.fullMonthlyRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Move-in Date:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{new Date(calculationResult.moveInDate).toLocaleDateString()}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Days in Month:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{calculationResult.daysInMonth}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Remaining Days:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{calculationResult.remainingDays}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Prorated Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ${calculationResult.proratedRent}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
        
      case 'deposit':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Security Deposit Analysis</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.monthlyRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Security Deposit:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.securityDeposit}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Percentage of Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{calculationResult.depositPercentage}%</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  {parseFloat(calculationResult.depositPercentage) > 200 ? (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This security deposit is more than twice the monthly rent, which may be excessive in some jurisdictions.
                    </Alert>
                  ) : parseFloat(calculationResult.depositPercentage) < 100 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      This security deposit is less than one month's rent, which is lower than the typical amount.
                    </Alert>
                  ) : (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      This security deposit is within the typical range (1-2 months' rent).
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 'income-ratio':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rent-to-Income Ratio Analysis</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Monthly Rent-to-Income Ratio: {calculationResult.rentToIncomeRatio}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(parseFloat(calculationResult.rentToIncomeRatio), 100)} 
                  sx={{ height: 10, borderRadius: 5 }}
                  color={parseFloat(calculationResult.rentToIncomeRatio) <= 30 ? "success" : 
                         parseFloat(calculationResult.rentToIncomeRatio) <= 40 ? "warning" : "error"}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">0%</Typography>
                  <Typography variant="caption">30% (Recommended)</Typography>
                  <Typography variant="caption">50% (Maximum)</Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.monthlyRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Income:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.monthlyIncome}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Annual Income:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.annualIncome}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                {calculationResult.isAffordable ? (
                  <Alert severity="success" icon={<CheckCircle />}>
                    This rent is affordable! Your rent-to-income ratio is within the recommended 30% guideline.
                  </Alert>
                ) : (
                  <Alert severity="warning" icon={<Warning />}>
                    This rent may be challenging to afford. Consider looking for more affordable options or increasing your income.
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        );

      case 'utilities':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Housing Cost Analysis</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Base Monthly Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.monthlyRent}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Utilities:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.totalUtilities}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Monthly Cost:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ${calculationResult.rentWithUtilities}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Utilities as % of Rent:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{calculationResult.utilitiesPercentage}%</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Utility Breakdown:</Typography>
                {Object.entries(calculationResult.utilities).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </Typography>
                    <Typography variant="body2">${parseFloat(value) || 0}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        );

      case 'move-in':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Move-in Cost Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="h4" color="primary" gutterBottom>
                Total Move-in Cost: ${calculationResult.totalMoveInCosts}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Cost Breakdown:</Typography>
                {calculationResult.breakdown.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.name}:
                    </Typography>
                    <Typography variant="body2">${item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  Make sure you have these funds available before signing your lease. Some landlords may require payment in cashier's check or money order.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        );

      case 'comparison':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Lease Comparison Results</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Option</TableCell>
                      <TableCell align="right">Monthly Cost</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                      <TableCell align="right">Cost/Month</TableCell>
                      <TableCell align="right">Deposit %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {calculationResult.comparisons.map((lease, index) => (
                      <TableRow key={index} sx={lease.name === calculationResult.bestValue.name ? { backgroundColor: 'success.light' } : {}}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {lease.name}
                            {lease.name === calculationResult.bestValue.name && (
                              <Chip label="Best Value" size="small" color="success" sx={{ ml: 1 }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">${lease.monthlyCost}</TableCell>
                        <TableCell align="right">${lease.totalCost}</TableCell>
                        <TableCell align="right">${lease.costPerMonth}</TableCell>
                        <TableCell align="right">{lease.depositPercentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>{calculationResult.bestValue.name}</strong> offers the best value with the lowest cost per month over the lease term.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        );

      case 'break-even':
        return (
          <Card sx={{ mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Break-even Analysis Results</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Savings:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" color={parseFloat(calculationResult.monthlySavings) > 0 ? "success.main" : "error.main"}>
                    ${calculationResult.monthlySavings}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Moving Costs:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">${calculationResult.totalMovingCosts}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Break-even Time:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {calculationResult.breakEvenMonths} months
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                {calculationResult.isWorthIt ? (
                  <Alert severity="success" icon={<CheckCircle />}>
                    Moving appears to be financially beneficial! You'll break even in {calculationResult.breakEvenMonths} months.
                  </Alert>
                ) : parseFloat(calculationResult.monthlySavings) <= 0 ? (
                  <Alert severity="error" icon={<Warning />}>
                    Moving would increase your monthly costs. Consider staying put or finding a more affordable option.
                  </Alert>
                ) : (
                  <Alert severity="warning" icon={<Info />}>
                    The break-even period is quite long ({calculationResult.breakEvenMonths} months). Consider if the move is worth the upfront costs.
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Advanced Lease Calculators | Rent, Income Ratio, Comparison | Lease Shield AI</title>
        <meta 
          name="description" 
          content="Comprehensive lease calculators including rent-to-income ratio, utility costs, move-in costs, lease comparison, and break-even analysis. Make informed rental decisions with Lease Shield AI." 
        />
      </Helmet>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Advanced Lease Calculator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Use our comprehensive suite of lease calculators to make informed rental decisions. Calculate rent affordability, compare lease options, and analyze all costs associated with renting.
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Calculator Type</InputLabel>
            <Select
              value={calculatorType}
              label="Calculator Type"
              onChange={(e) => {
                setCalculatorType(e.target.value);
                setShowResult(false);
              }}
            >
              <MenuItem value="rent">Basic Rent Calculator</MenuItem>
              <MenuItem value="prorated">Prorated Rent Calculator</MenuItem>
              <MenuItem value="deposit">Security Deposit Calculator</MenuItem>
              <MenuItem value="income-ratio">Rent-to-Income Ratio</MenuItem>
              <MenuItem value="utilities">Total Housing Cost (with Utilities)</MenuItem>
              <MenuItem value="move-in">Move-in Cost Calculator</MenuItem>
              <MenuItem value="comparison">Lease Comparison Tool</MenuItem>
              <MenuItem value="break-even">Break-even Analysis</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {renderCalculator()}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<CalculateOutlined />}
            onClick={handleCalculate}
            disabled={
              (calculatorType === 'rent' && !monthlyRent) ||
              (calculatorType === 'prorated' && (!monthlyRent || !moveInDate)) ||
              (calculatorType === 'deposit' && (!monthlyRent || !securityDeposit)) ||
              (calculatorType === 'income-ratio' && (!monthlyRent || (!monthlyIncome && !annualIncome))) ||
              (calculatorType === 'utilities' && !monthlyRent) ||
              (calculatorType === 'move-in' && !moveInCosts.firstMonthRent) ||
              (calculatorType === 'comparison' && !comparisonLeases.some(lease => lease.rent)) ||
              (calculatorType === 'break-even' && (!breakEvenAnalysis.currentRent || !breakEvenAnalysis.newRent))
            }
          >
            Calculate
          </Button>
        </Box>
      </Paper>
      
      {renderResults()}
    </Box>
  );
};

export default LeaseCalculator; 