import React, { useState } from 'react';
import { 
  Tooltip, 
  Typography, 
  Box, 
  IconButton,
  Paper,
  Fade,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpOutline as HelpIcon,
  Psychology as AIIcon,
  LightbulbOutlined as LightbulbIcon,
} from '@mui/icons-material';

const JargonBuster = ({ 
  term, 
  definition, 
  example = null, 
  children,
  variant = "inline", // "inline" or "icon"
  color = "primary"
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  // Predefined legal term definitions
  const legalTerms = {
    "indemnification": {
      definition: "A promise to cover someone else's losses or damages. In leases, this usually means the tenant agrees to pay for any problems they cause.",
      example: "If you accidentally flood your apartment and damage the unit below, you'd be responsible for those repair costs."
    },
    "subletting": {
      definition: "Renting out your rented space to someone else while you're still responsible for the lease. You become their landlord, but you're still the tenant to your landlord.",
      example: "If you rent an apartment but travel for work, you might sublet it to someone else for those months."
    },
    "security deposit": {
      definition: "Money you pay upfront that the landlord holds to cover any damages or unpaid rent. You should get it back if you leave the place in good condition.",
      example: "A $1,000 security deposit protects the landlord if you damage the walls or don't pay your last month's rent."
    },
    "lease term": {
      definition: "The specific length of time your rental agreement lasts. This sets when your lease starts and ends.",
      example: "A 12-month lease term means you're committed to renting for one full year."
    },
    "force majeure": {
      definition: "Fancy legal term for 'unforeseeable circumstances' like natural disasters or pandemics that make it impossible to fulfill the lease agreement.",
      example: "COVID-19 lockdowns were often considered force majeure events that prevented normal lease obligations."
    },
    "covenant": {
      definition: "A formal promise or agreement within your lease. It's basically a rule you must follow as part of your rental agreement.",
      example: "A covenant might require you to keep the property clean or not make noise after 10 PM."
    },
    "assignment": {
      definition: "Transferring your entire lease agreement to someone else. Unlike subletting, you're completely out of the picture once assignment is complete.",
      example: "If you get a job in another city, you might assign your lease to a friend who takes over all your responsibilities."
    },
    "habitability": {
      definition: "The legal requirement that rental properties must be safe and livable, with working plumbing, heating, and no health hazards.",
      example: "If your heat breaks in winter and the landlord won't fix it, they're violating habitability standards."
    }
  };

  const termData = legalTerms[term?.toLowerCase()] || { definition, example };

  const tooltipContent = (
    <Paper
      elevation={8}
      sx={{
        p: 2,
        maxWidth: 320,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        color: 'white',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <AIIcon sx={{ fontSize: 20, mr: 1, color: 'white' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
          AI Jargon Buster
        </Typography>
      </Box>

      {/* Term */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 1, 
          color: 'white',
          textTransform: 'capitalize'
        }}
      >
        {term}
      </Typography>

      {/* Definition */}
      <Typography 
        variant="body2" 
        sx={{ 
          lineHeight: 1.5, 
          mb: termData.example ? 1.5 : 0,
          color: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        {termData.definition}
      </Typography>

      {/* Example */}
      {termData.example && (
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <LightbulbIcon sx={{ fontSize: 16, mr: 0.5, color: '#FFD700' }} />
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
              Example:
            </Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}
          >
            {termData.example}
          </Typography>
        </Box>
      )}

      {/* AI Badge */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mt: 1.5,
        pt: 1.5,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          ✨ Powered by Lease Shield AI
        </Typography>
      </Box>
    </Paper>
  );

  if (variant === "icon") {
    return (
      <Tooltip
        title={tooltipContent}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'transparent',
              maxWidth: 'none',
            }
          }
        }}
      >
        <IconButton
          size="small"
          sx={{
            ml: 0.5,
            width: 20,
            height: 20,
            color: `${color}.main`,
            '&:hover': {
              bgcolor: `${color}.light`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
          onClick={() => setOpen(!open)}
        >
          <HelpIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    );
  }

  // Inline variant
  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            maxWidth: 'none',
          }
        }
      }}
    >
      <Box
        component="span"
        sx={{
          position: 'relative',
          cursor: 'help',
          borderBottom: `2px dotted ${theme.palette[color].main}`,
          '&:hover': {
            borderBottomStyle: 'solid',
            color: `${color}.main`,
          },
          transition: 'all 0.2s ease',
        }}
      >
        {children || term}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            background: theme.palette[color].main,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          ?
        </motion.div>
      </Box>
    </Tooltip>
  );
};

// Helper component for text with multiple jargon terms
export const JargonText = ({ children, terms = [] }) => {
  const theme = useTheme();
  
  if (!terms.length) return children;

  let processedText = children;
  
  terms.forEach((term, index) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    processedText = processedText.replace(regex, (match) => (
      `<jargon-${index}>${match}</jargon-${index}>`
    ));
  });

  const parts = processedText.split(/(<jargon-\d+>.*?<\/jargon-\d+>)/);
  
  return (
    <>
      {parts.map((part, index) => {
        const jargonMatch = part.match(/<jargon-(\d+)>(.*?)<\/jargon-\d+>/);
        if (jargonMatch) {
          const termIndex = parseInt(jargonMatch[1]);
          const termText = jargonMatch[2];
          return (
            <JargonBuster 
              key={index} 
              term={terms[termIndex]} 
              variant="inline"
            >
              {termText}
            </JargonBuster>
          );
        }
        return part;
      })}
    </>
  );
};

export default JargonBuster;