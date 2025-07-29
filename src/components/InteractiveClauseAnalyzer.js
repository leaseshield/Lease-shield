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
  IconButton,
  Tooltip
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
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (!text) return;
    setIsLoading(true);
    setAnalysis(null);
    
    // Find if the text matches an example for a more "accurate" demo
    const matchedExample = exampleClauses.find(c => c.text === text);
    
    setTimeout(() => {
      if (matchedExample) {
        setAnalysis(matchedExample);
      } else {
        // Generic analysis for custom text
        setAnalysis({
          risk: 'Medium',
          explanation: 'This seems like a standard clause, but our full analysis would provide a deeper breakdown of responsibilities and potential conflicts with local regulations.'
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  const selectExample = (clause) => {
    setText(clause.text);
    setAnalysis(null);
  };
  
  const renderAnalyzedText = () => {
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

    return <Typography component="p" dangerouslySetInnerHTML={{ __html: highlightedText }} sx={{ lineHeight: 1.7, p: 2, bgcolor: 'grey.100', borderRadius: 2 }} />;
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        Experience the AI Difference—Instantly
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: '750px', mx: 'auto', mb: 5 }}>
        Not sure what a clause means? Paste it below or try one of our examples to see our AI in action. No sign-up required.
      </Typography>

      <Paper elevation={4} sx={{ maxWidth: '800px', mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyOutlined />
            Clause Risk Checker
        </Typography>

        <TextField
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a single lease clause here..."
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1, color: 'text.secondary' }}>
                Or try an example:
            </Typography>
            {exampleClauses.map(clause => (
                <Chip
                    key={clause.id}
                    label={clause.short}
                    onClick={() => selectExample(clause)}
                    variant={text === clause.text ? 'filled' : 'outlined'}
                    color="secondary"
                />
            ))}
        </Box>
        
        <Button 
            variant="contained" 
            size="large" 
            onClick={handleAnalyze} 
            disabled={isLoading || !text}
            fullWidth
            endIcon={<ArrowForward />}
            sx={{ borderRadius: '25px', py: 1.5, mb: 3 }}
        >
            {isLoading ? 'Analyzing...' : 'Run Risk Analysis'}
        </Button>

        {analysis && (
            <Fade in={true}>
                <Box>
                    <Typography variant="h6">Analysis Result:</Typography>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        {renderAnalyzedText()}
                    </Box>

                    <Chip 
                        icon={analysis.risk === 'High' ? <WarningAmberOutlined /> : <CheckCircleOutline />}
                        label={`Risk Level: ${analysis.risk}`} 
                        color={analysis.risk === 'High' ? 'error' : 'warning'} 
                        sx={{ mb: 2 }} 
                    />

                    <Typography variant="body1">
                        <strong>Insight:</strong> {analysis.explanation}
                    </Typography>
                </Box>
            </Fade>
        )}
      </Paper>
    </Box>
  );
};

export default InteractiveClauseAnalyzer; 