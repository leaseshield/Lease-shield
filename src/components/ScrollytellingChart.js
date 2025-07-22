import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { AnimatedCounter } from './InteractiveComponents';

const ScrollytellingChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.5, once: true });
  const [animationStage, setAnimationStage] = useState(0);

  const competitors = [
    { name: 'Manual Review', accuracy: 65, color: '#ff6b6b', delay: 0 },
    { name: 'Generic AI', accuracy: 72, color: '#ffa726', delay: 0.5 },
    { name: 'Legal Software', accuracy: 78, color: '#42a5f5', delay: 1 },
    { name: 'Lease Shield AI', accuracy: 98.5, color: '#4caf50', delay: 2, isOurs: true },
  ];

  useEffect(() => {
    if (!inView) return;

    const stages = [
      { delay: 0, stage: 1 }, // Show competitors
      { delay: 2500, stage: 2 }, // Show our bar
      { delay: 4000, stage: 3 }, // Highlight our superiority
    ];

    stages.forEach(({ delay, stage }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });
  }, [inView]);

  const getBarHeight = (accuracy) => {
    return (accuracy / 100) * 300; // Max height of 300px
  };

  return (
    <Box 
      ref={ref}
      sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 20%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f093fb 0%, transparent 50%)',
          animation: animationStage >= 2 ? 'float 6s ease-in-out infinite' : 'none',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-20px) scale(1.05)' },
          },
        }}
      />

      <Box sx={{ textAlign: 'center', mb: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Accuracy That Speaks for Itself
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Watch how our AI-powered analysis compares to traditional methods and competitors
          </Typography>
        </motion.div>
      </Box>

      {/* Chart Container */}
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Chart */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'end', 
            justifyContent: 'space-around',
            height: 350,
            mb: 3,
            position: 'relative'
          }}>
            {/* Y-axis labels */}
            <Box sx={{ 
              position: 'absolute', 
              left: -10, 
              top: 0, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'text.secondary',
              fontSize: '0.8rem'
            }}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </Box>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((value) => (
              <Box
                key={value}
                sx={{
                  position: 'absolute',
                  left: 20,
                  right: 0,
                  bottom: (value / 100) * 300,
                  height: 1,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  zIndex: 0,
                }}
              />
            ))}

            {competitors.map((competitor, index) => (
              <Box key={competitor.name} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                maxWidth: 120,
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Bar */}
                <Box sx={{ position: 'relative', height: 300, display: 'flex', alignItems: 'end' }}>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      (competitor.isOurs && animationStage >= 2) || (!competitor.isOurs && animationStage >= 1)
                        ? { height: getBarHeight(competitor.accuracy), opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ 
                      duration: competitor.isOurs ? 1.5 : 0.8, 
                      delay: competitor.delay,
                      ease: competitor.isOurs ? "easeOut" : "easeInOut"
                    }}
                    style={{
                      width: isMobile ? 40 : 60,
                      background: competitor.isOurs 
                        ? 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)'
                        : `linear-gradient(135deg, ${competitor.color} 0%, ${competitor.color}cc 100%)`,
                      borderRadius: '8px 8px 0 0',
                      position: 'relative',
                      filter: animationStage >= 3 && !competitor.isOurs ? 'brightness(0.6)' : 'brightness(1)',
                      transition: 'filter 0.5s ease',
                    }}
                  >
                    {/* Shine effect for our bar */}
                    {competitor.isOurs && animationStage >= 2 && (
                      <motion.div
                        initial={{ x: -100 }}
                        animate={{ x: 100 }}
                        transition={{ duration: 1, delay: 2.5 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '30%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transform: 'skewX(-10deg)',
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Accuracy percentage */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      (competitor.isOurs && animationStage >= 2) || (!competitor.isOurs && animationStage >= 1)
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.5 }
                    }
                    transition={{ 
                      duration: 0.5, 
                      delay: competitor.delay + 0.8
                    }}
                    style={{
                      position: 'absolute',
                      top: -40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: competitor.isOurs ? '#4caf50' : competitor.color,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: competitor.isOurs ? '1.1rem' : '0.9rem',
                      fontWeight: 'bold',
                      minWidth: 50,
                      textAlign: 'center',
                      boxShadow: competitor.isOurs && animationStage >= 3 
                        ? '0 0 20px rgba(76, 175, 80, 0.6)' 
                        : '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10,
                    }}
                  >
                    {competitor.isOurs ? (
                      <AnimatedCounter 
                        end={competitor.accuracy} 
                        suffix="%" 
                        decimals={1}
                        trigger={animationStage >= 2}
                      />
                    ) : (
                      `${competitor.accuracy}%`
                    )}
                  </motion.div>
                </Box>

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    (competitor.isOurs && animationStage >= 2) || (!competitor.isOurs && animationStage >= 1)
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.5, delay: competitor.delay + 1 }}
                >
                  <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                      mt: 2,
                      fontWeight: competitor.isOurs ? 'bold' : 'medium',
                      color: competitor.isOurs ? 'primary.main' : 'text.secondary',
                      fontSize: competitor.isOurs ? '1rem' : '0.85rem',
                    }}
                  >
                    {competitor.name}
                  </Typography>
                </motion.div>

                {/* Crown for our bar */}
                {competitor.isOurs && animationStage >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: -70,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '2rem',
                      zIndex: 10,
                    }}
                  >
                    👑
                  </motion.div>
                )}
              </Box>
            ))}
          </Box>

          {/* Bottom stats */}
          {animationStage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                pt: 3, 
                borderTop: '2px solid',
                borderColor: 'primary.light',
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
                borderRadius: 2,
                p: 3
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🎯 Why 98.5% Accuracy Matters
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                  Every percentage point in accuracy means fewer missed risks, better protection, 
                  and more confidence in your lease decisions. Our AI doesn't just analyze—it understands.
                </Typography>
              </Box>
            </motion.div>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ScrollytellingChart;