import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Chip,
  Fade,
  useTheme,
  CircularProgress
} from '@mui/material';
import { CheckCircleOutline, WarningAmberOutlined, ArrowForward, PsychologyOutlined, Style } from '@mui/icons-material';

const exampleClauses = [
  {
    id: 'auto_renewal',
    short: 'Auto-Renewal',
    text: 'This lease shall automatically renew for a successive period of one year, unless Tenant provides Landlord with written notice of termination no less than 90 days prior to the end of the term.',
    risk: 'High',
    explanation: 'This clause can trap you in a lease you intended to leave. The 90-day notice period is unusually long, making it easy to miss.'
  },
  {
    id: 'unrestricted_access',
    short: 'Landlord Access',
    text: 'The Landlord or its agents may enter the premises at any time, without notice or consequence, for purposes of inspection, maintenance, or showing to prospective tenants.',
    risk: 'High',
    explanation: 'This violates your right to quiet enjoyment. Landlords must typically provide reasonable notice (e.g., 24 hours) except in emergencies.'
  },
  {
    id: 'as_is',
    short: '"As-Is" Condition',
    text: 'The tenant agrees to accept the property in its current "as-is" condition, and waives any and all claims against the landlord for any defects or issues.',
    risk: 'Medium',
    explanation: 'This clause attempts to waive the landlord\'s "implied warranty of habitability," which is illegal in most jurisdictions. You cannot waive your right to a safe and livable home.'
  }
];

const InteractiveClauseAnalyzer = () => {
  const theme = useTheme();
  const [selectedClause, setSelectedClause] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectExample = (clause) => {
    // If the same clause is clicked again, do nothing
    if (selectedClause && selectedClause.id === clause.id) {
        return;
    }

    setSelectedClause(clause);
    setIsLoading(true);
    setAnalysis(null);
    
    setTimeout(() => {
      setAnalysis(clause);
      setIsLoading(false);
    }, 1200);
  };

  const renderAnalyzedText = (text, analysis) => {
    if (!analysis) return text;

    let highlightedText = text;
    const keywords = {
        auto_renewal: ["automatically renew", "90 days"],
        unrestricted_access: ["at any time", "without notice"],
        as_is: ["as-is", "waives any and all claims"]
    };

    if (analysis.id && keywords[analysis.id]) {
      keywords[analysis.id].forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span style="background-color: ${theme.palette.warning.light}; color: ${theme.palette.warning.contrastText}; padding: 2px 4px; border-radius: 4px;">$1</span>`);
      });
    }

    return <Typography 
      component="p" 
      dangerouslySetInnerHTML={{ __html: highlightedText }} 
      sx={{ 
        lineHeight: 1.7, 
        p: 2, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.100',
        borderRadius: 2,
        color: 'text.primary',
        fontSize: '0.95rem',
        border: `1px solid ${theme.palette.divider}`
      }} 
    />;
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        Experience the AI Difference—Instantly
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: '750px', mx: 'auto', mb: 5 }}>
        Click one of our example clauses below to see our AI analyze the risk in real-time. No sign-up required.
      </Typography>

      <Paper elevation={4} sx={{ 
        maxWidth: '800px', 
        mx: 'auto', 
        p: { xs: 2, md: 4 }, 
        borderRadius: 4,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyOutlined />
            Clause Risk Checker
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Typography variant="body1" sx={{ 
                alignSelf: 'center', 
                mr: 1, 
                color: 'text.secondary',
                fontWeight: 500
            }}>
                Select a clause to analyze:
            </Typography>
            {exampleClauses.map(clause => (
                <Chip
                    key={clause.id}
                    label={clause.short}
                    onClick={() => handleSelectExample(clause)}
                    variant={selectedClause && selectedClause.id === clause.id ? 'filled' : 'outlined'}
                    color="primary"
                    sx={{ 
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        ...(selectedClause && selectedClause.id === clause.id ? {
                            background: theme.palette.primary.gradient,
                            color: 'white',
                            '&:hover': {
                                background: theme.palette.primary.gradient,
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        } : {
                            '&:hover': {
                                borderColor: 'primary.main',
                                background: 'rgba(99, 102, 241, 0.08)',
                                transform: 'translateY(-1px)'
                            }
                        })
                    }}
                />
            ))}
        </Box>
        
        <Box sx={{ minHeight: '250px', position: 'relative' }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%' }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && !analysis && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Your analysis will appear here.
                </Typography>
            </Box>
          )}
          
          {analysis && (
              <Fade in={true}>
                  <Box sx={{ 
                      background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 50%, rgba(240,147,251,0.08) 100%)'
                          : 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 50%, rgba(240,147,251,0.05) 100%)',
                      borderRadius: 3,
                      p: 3,
                      border: `1px solid ${theme.palette.divider}`
                  }}>
                      <Typography variant="h6" sx={{ 
                          color: 'text.primary',
                          fontWeight: 'bold',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                      }}>
                          <Style color="primary" />
                          Analysis Result:
                      </Typography>
                      
                      <Box sx={{ mt: 2, mb: 3 }}>
                          {renderAnalyzedText(selectedClause.text, analysis)}
                      </Box>

                      <Chip 
                          icon={analysis.risk === 'High' ? <WarningAmberOutlined /> : <CheckCircleOutline />}
                          label={`Risk Level: ${analysis.risk}`} 
                          color={analysis.risk === 'High' ? 'error' : 'warning'} 
                          sx={{ 
                              mb: 3,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                  color: 'inherit'
                              }
                          }} 
                      />

                      <Typography variant="body1" sx={{ 
                          color: 'text.primary',
                          lineHeight: 1.6,
                          fontSize: '1rem'
                      }}>
                          <Typography component="span" sx={{ 
                              fontWeight: 'bold', 
                              color: 'primary.main',
                              mr: 0.5
                          }}>
                              Insight:
                          </Typography>
                          {analysis.explanation}
                      </Typography>
                  </Box>
              </Fade>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default InteractiveClauseAnalyzer; 