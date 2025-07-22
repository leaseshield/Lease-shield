import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Chip, 
  IconButton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Highlight as HighlightIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

// Custom Cursor Component
export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursor = (e) => {
      const target = e.target;
      setIsPointer(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.style.cursor === 'pointer'
      );
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', updateCursor);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 20,
        height: 20,
        background: isPointer 
          ? 'radial-gradient(circle, rgba(16, 217, 196, 0.8) 0%, rgba(16, 217, 196, 0.2) 70%)'
          : 'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(102, 126, 234, 0.2) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(${position.x - 10}px, ${position.y - 10}px) scale(${isPointer ? 1.5 : 1})`,
        transition: 'transform 0.15s ease-out, background 0.2s ease-out',
        mixBlendMode: 'multiply',
        display: { xs: 'none', md: 'block' }, // Only show on desktop
      }}
    />
  );
};

// Animated Counter Component
export const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  trigger = true 
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, trigger]);

  return (
    <Typography 
      component="span" 
      ref={countRef}
      sx={{ fontWeight: 'bold', color: 'primary.main' }}
    >
      {prefix}{Number(count).toFixed(decimals)}{suffix}
    </Typography>
  );
};

// AI Sandbox Component
export const AISandbox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeClause, setActiveClause] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const clauses = [
    {
      id: 'subletting',
      title: 'Subletting Clause',
      text: 'Tenant shall not sublet, assign, or transfer this lease without written consent from Landlord.',
      risk: 'medium',
      analysis: 'This clause restricts your ability to sublet. Consider negotiating for reasonable consent standard.',
      highlight: 'sublet, assign, or transfer'
    },
    {
      id: 'termination',
      title: 'Early Termination',
      text: 'Lease may be terminated by Landlord with 30 days notice for any breach of terms.',
      risk: 'high',
      analysis: 'Very broad termination clause. Request specific breach definitions and cure periods.',
      highlight: 'any breach of terms'
    },
    {
      id: 'deposit',
      title: 'Security Deposit',
      text: 'Security deposit of $2,000 shall be held by Landlord and returned within 30 days.',
      risk: 'low',
      analysis: 'Standard security deposit terms. Ensure you understand deduction conditions.',
      highlight: '$2,000'
    }
  ];

  const handleClauseClick = (clause) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setActiveClause(clause);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        p: 3,
        border: '1px solid rgba(102, 126, 234, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.background.aurora,
          opacity: 0.3,
          animation: 'aurora 8s ease-in-out infinite',
          '@keyframes aurora': {
            '0%, 100%': { transform: 'translateX(0) translateY(0)' },
            '25%': { transform: 'translateX(10px) translateY(-10px)' },
            '50%': { transform: 'translateX(-5px) translateY(5px)' },
            '75%': { transform: 'translateX(5px) translateY(10px)' },
          },
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          🤖 AI Lease Analyzer Demo
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click on any clause below to see our AI in action:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {clauses.map((clause) => (
            <motion.div
              key={clause.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Paper
                onClick={() => handleClauseClick(clause)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: activeClause?.id === clause.id ? 2 : 1,
                  borderColor: activeClause?.id === clause.id 
                    ? 'primary.main' 
                    : 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: 2,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {clause.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={clause.risk}
                    sx={{
                      bgcolor: getRiskColor(clause.risk),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                  {clause.text}
                </Typography>

                {activeClause?.id === clause.id && (
                  <Fade in={!isAnalyzing}>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HighlightIcon sx={{ color: 'primary.main', fontSize: 16, mr: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          AI Analysis:
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.primary' }}>
                        {clause.analysis}
                      </Typography>
                    </Box>
                  </Fade>
                )}

                {activeClause?.id === clause.id && isAnalyzing && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRightColor: 'transparent',
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                    </motion.div>
                    <Typography variant="caption" sx={{ color: 'primary.main' }}>
                      AI is analyzing this clause...
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          ))}
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', opacity: 0.7 }}>
          ✨ This is just a preview. Upload your real lease for complete analysis!
        </Typography>
      </Box>
    </Box>
  );
};

// Scroll-triggered Animation Hook
export const useScrollAnimation = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { ref, controls };
};

// Bento Grid Item Component
export const BentoGridItem = ({ 
  children, 
  span = 1, 
  tall = false, 
  gradient = false,
  index = 0,
  ...props 
}) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { delay: index * 0.1, duration: 0.6 }
        }
      }}
      style={{
        gridColumn: `span ${span}`,
        gridRow: tall ? 'span 2' : 'span 1',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          p: 3,
          borderRadius: 3,
          background: gradient 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)'
            : 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
          },
        }}
        {...props}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

// Glassmorphism Card Component
export const GlassmorphismCard = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        p: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.35)',
          transform: 'translateY(-5px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default {
  CustomCursor,
  AnimatedCounter,
  AISandbox,
  useScrollAnimation,
  BentoGridItem,
  GlassmorphismCard,
};