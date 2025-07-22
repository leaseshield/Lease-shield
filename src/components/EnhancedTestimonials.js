import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Avatar, 
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  VerifiedUserOutlined as VerifiedIcon,
  SchoolOutlined as StudentIcon,
  BusinessCenterOutlined as CommercialIcon,
  FormatQuote as QuoteIcon,
} from '@mui/material/icons-material';

const EnhancedTestimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tenant & First-Time Renter",
      avatar: "S",
      icon: <VerifiedIcon color="success"/>,
      content: "Lease Shield AI helped me understand my rental agreement in minutes. I found two clauses that needed negotiation before signing! As someone new to renting, this gave me the confidence I needed.",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      accentColor: "#ff6b9d"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      avatar: "M",
      icon: <VerifiedIcon color="success"/>,
      content: "We use Lease Shield AI to ensure our lease agreements are fair and transparent. It's improved tenant satisfaction significantly and reduced disputes by 40%.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accentColor: "#667eea"
    },
    {
      name: "Alex Rodriguez",
      role: "College Student",
      avatar: "A",
      icon: <StudentIcon color="action"/>,
      content: "As a student renting for the first time, this tool was invaluable. It explained everything clearly and made me feel much more confident about my housing decisions.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      accentColor: "#f093fb"
    },
    {
      name: "Priya Patel",
      role: "Real Estate Attorney",
      avatar: "P",
      icon: <VerifiedIcon color="success"/>,
      content: "This tool empowers clients to understand their leases before they need legal counsel. A great preventative legal resource that saves everyone time and money.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      accentColor: "#4facfe"
    },
    {
      name: "David Kim",
      role: "Small Business Owner (Commercial Lease)",
      avatar: "D",
      icon: <CommercialIcon color="action"/>,
      content: "Analyzed my complex commercial lease quickly and flagged several important points for discussion with the landlord. Saved me potential headaches and thousands in legal fees.",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      accentColor: "#43e97b"
    },
    {
      name: "Emily Watson",
      role: "Real Estate Investor",
      avatar: "E",
      icon: <VerifiedIcon color="success"/>,
      content: "Managing multiple properties means reviewing lots of leases. Lease Shield AI has become an essential part of my workflow, saving me hours every week.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      accentColor: "#fa709a"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trusted by Thousands
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Real stories from real users who've transformed their lease experience with AI
          </Typography>
        </motion.div>
      </Box>

      {/* Main Testimonial Display */}
      <Box sx={{ position: 'relative', maxWidth: 900, mx: 'auto', px: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
                background: currentTestimonial.gradient,
                minHeight: { xs: 300, md: 350 },
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Quote Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  opacity: 0.3,
                }}
              >
                <QuoteIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>

              <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  gap: { xs: 3, md: 4 },
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Avatar 
                      sx={{ 
                        width: { xs: 80, md: 100 }, 
                        height: { xs: 80, md: 100 },
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: currentTestimonial.accentColor,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 'bold',
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        flexShrink: 0
                      }}
                    >
                      {currentTestimonial.avatar}
                    </Avatar>
                  </motion.div>

                  {/* Content */}
                  <Box sx={{ flex: 1, color: 'white' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <Typography 
                        variant="h5" 
                        paragraph 
                        sx={{ 
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                          mb: 3,
                          fontSize: { xs: '1.1rem', md: '1.3rem' }
                        }}
                      >
                        "{currentTestimonial.content}"
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {currentTestimonial.icon}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {currentTestimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                            {currentTestimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </Box>
                </Box>
              </CardContent>

              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'translate(50%, -50%)',
                }}
              />
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <IconButton
          onClick={prevTestimonial}
          sx={{
            position: 'absolute',
            left: { xs: -20, md: -60 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 2,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          onClick={nextTestimonial}
          sx={{
            position: 'absolute',
            right: { xs: -20, md: -60 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 2,
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* Dots Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToTestimonial(index)}
            style={{
              width: currentIndex === index ? 40 : 12,
              height: 12,
              borderRadius: 6,
              border: 'none',
              background: currentIndex === index 
                ? testimonials[index].accentColor 
                : 'rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </Box>

      {/* Auto-play indicator */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        right: 20,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 1,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        px: 2,
        py: 1,
        borderRadius: 2,
        fontSize: '0.8rem',
        color: 'text.secondary'
      }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: isAutoPlaying ? 'success.main' : 'text.disabled',
            animation: isAutoPlaying ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
        Auto-playing
      </Box>
    </Box>
  );
};

export default EnhancedTestimonials;