import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import {
  CheckCircleOutline as CheckIcon,
  HighlightOff as CloseIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { AnimatedCounter } from './InteractiveComponents';

const InteractiveComparisonTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [hoveredRow, setHoveredRow] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, once: true });
  const [animationTriggered, setAnimationTriggered] = useState(false);

  const comparisonData = [
    { 
      feature: "Lease Term Extraction", 
      traditional: false, 
      leaseShield: true,
      description: "Automatically identify and extract key lease terms"
    },
    { 
      feature: "Legal Clause Summaries", 
      traditional: false, 
      leaseShield: true,
      description: "Plain language explanations of complex legal language"
    },
    { 
      feature: "Potential Risk Identification", 
      traditional: false, 
      leaseShield: true,
      description: "AI flags unusual or potentially problematic clauses"
    },
    { 
      feature: "Plain Language Explanations", 
      traditional: false, 
      leaseShield: true,
      description: "Convert legal jargon into understandable terms"
    },
    { 
      feature: "Handles Long Documents (~700 pages)", 
      traditional: false, 
      leaseShield: true,
      description: "Process extensive commercial leases efficiently"
    },
    { 
      feature: "AI Specialized for Leases", 
      traditional: false, 
      leaseShield: true,
      description: "Purpose-built AI trained on thousands of lease agreements"
    },
    { 
      feature: "Multilanguage Support", 
      traditional: false, 
      leaseShield: true,
      description: "Analyze leases in 30+ languages"
    },
    { 
      feature: "Response Time", 
      traditional: "Days to Weeks", 
      leaseShield: "30-60 seconds",
      isTime: true,
      description: "Speed of analysis and report delivery"
    },
    { 
      feature: "Cost", 
      traditional: "$200-500/hr", 
      leaseShield: "Less than $5 with unlimited scans",
      isCost: true,
      description: "Total cost for comprehensive lease analysis"
    }
  ];

  useEffect(() => {
    if (inView && !animationTriggered) {
      setTimeout(() => setAnimationTriggered(true), 500);
    }
  }, [inView, animationTriggered]);

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };

  const getIcon = (value, isLeaseShield = false) => {
    if (typeof value === 'boolean') {
      return value ? 
        <CheckIcon sx={{ color: isLeaseShield ? 'success.main' : 'success.light', fontSize: 28 }} /> : 
        <CloseIcon sx={{ color: 'error.main', fontSize: 28 }} />;
    }
    return null;
  };

  const getRowBackground = (index, isLeaseShield) => {
    if (hoveredRow === index) {
      return isLeaseShield 
        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)'
        : 'rgba(158, 158, 158, 0.05)';
    }
    return 'transparent';
  };

  return (
    <Box ref={ref} sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            The Aha! Moment
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            See how Lease Shield AI compares to traditional manual review. Watch the magic happen.
          </Typography>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'divider',
            background: 'background.paper',
          }}
        >
          {/* Header */}
          <Box sx={{ background: theme.palette.background.aurora, p: 2 }}>
            <Grid container sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Grid item md={5} />
              <Grid item md={3.5}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  align="center" 
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  Traditional Review
                </Typography>
              </Grid>
              <Grid item md={3.5}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  align="center" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ✨ Lease Shield AI
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Rows */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={animationTriggered ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                onMouseEnter={() => handleRowHover(index)}
                onMouseLeave={handleRowLeave}
                sx={{
                  transition: 'all 0.3s ease',
                  background: getRowBackground(index, false),
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  },
                }}
              >
                <Grid container sx={{ py: 2, px: 3 }} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: hoveredRow === index ? 'bold' : 'medium',
                          transition: 'font-weight 0.2s ease',
                        }}
                      >
                        {row.feature}
                      </Typography>
                      {hoveredRow === index && (
                        <Fade in={true}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {row.description}
                          </Typography>
                        </Fade>
                      )}
                    </Box>
                  </Grid>

                  {/* Traditional Column */}
                  <Grid item xs={6} md={3.5} align="center">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ 
                        opacity: hoveredRow === index ? 0.3 : 1,
                        filter: hoveredRow === index ? 'blur(2px)' : 'blur(0px)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.8rem', color: 'text.secondary', mb: 0.5 }}>
                        Traditional:
                      </Typography>
                      {getIcon(row.traditional) || (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {row.isTime && <TimeIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                          {row.isCost && <MoneyIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                          <Typography variant="body2" color="text.secondary" align="center">
                            {row.traditional}
                          </Typography>
                        </Box>
                      )}
                    </motion.div>
                  </Grid>

                  {/* Lease Shield AI Column */}
                  <Grid item xs={6} md={3.5} align="center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={animationTriggered ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    >
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.8rem', color: 'text.secondary', mb: 0.5 }}>
                        Lease Shield AI:
                      </Typography>
                      {getIcon(row.leaseShield, true) || (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {row.isTime && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <TimeIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            </motion.div>
                          )}
                          {row.isCost && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <MoneyIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            </motion.div>
                          )}
                          <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            align="center"
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {row.leaseShield}
                          </Typography>
                        </Box>
                      )}
                    </motion.div>
                  </Grid>
                </Grid>
                
                {index < comparisonData.length - 1 && (
                  <Divider sx={{ opacity: hoveredRow === index ? 0.3 : 1, transition: 'opacity 0.3s ease' }} />
                )}
              </Box>
            </motion.div>
          ))}

          {/* Footer with animated stats */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
            textAlign: 'center'
          }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    <AnimatedCounter end={98.5} suffix="%" decimals={1} trigger={animationTriggered} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy Rate
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    <AnimatedCounter end={60} suffix="s" trigger={animationTriggered} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Analysis Time
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    <AnimatedCounter end={99} suffix="%" trigger={animationTriggered} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cost Savings vs Traditional
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default InteractiveComparisonTable;