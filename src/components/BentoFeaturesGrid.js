import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DescriptionOutlined as DescriptionIcon,
  HomeWork as HomeWorkIcon,
  CalculateOutlined as CalculateIcon,
  ReceiptLongOutlined as ReceiptLongIcon,
  CameraAltOutlined as CameraAltIcon,
  Translate as LanguageIcon,
  PsychologyOutlined as PsychologyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { BentoGridItem, GlassmorphismCard } from './InteractiveComponents';

const BentoFeaturesGrid = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const coreModules = [
    {
      id: 'analysis',
      title: 'New Lease Analysis',
      description: 'Upload a lease document (PDF/TXT) or paste text to get an AI-powered breakdown of clauses, risks, and key terms in minutes.',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      link: '/analysis',
      span: 2,
      tall: true,
      gradient: true,
      stats: '98.5% Accuracy',
      features: ['Risk Detection', 'Plain Language', 'Instant Analysis'],
      color: '#667eea'
    },
    {
      id: 'tenant-matcher',
      title: 'Tenant Matcher',
      description: 'Upload property details or tenant preferences and let our AI pinpoint ideal matches.',
      icon: <HomeWorkIcon sx={{ fontSize: 40 }} />,
      link: '/real-estate-agent',
      span: 1,
      stats: '95% Match Rate',
      features: ['Smart Matching', 'Preference Analysis'],
      color: '#f093fb'
    },
    {
      id: 'calculator',
      title: 'Lease Calculator',
      description: 'Estimate costs, compare scenarios, and understand financial implications.',
      icon: <CalculateIcon sx={{ fontSize: 40 }} />,
      link: '/calculator',
      span: 1,
      stats: 'Save 40% Time',
      features: ['Cost Estimation', 'Scenario Comparison'],
      color: '#43e97b'
    },
    {
      id: 'expense-scanner',
      title: 'Expense Scanner',
      description: 'Upload receipts or invoices to automatically extract details and categorize expenses.',
      icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />,
      link: '/expenses',
      span: 1,
      tall: true,
      stats: '99% OCR Accuracy',
      features: ['Auto-Extract', 'Smart Categories', 'Export Ready'],
      color: '#ffa726'
    },
    {
      id: 'photo-inspector',
      title: 'Photo Inspector',
      description: 'Upload property photos to detect issues and estimate repair costs instantly.',
      icon: <CameraAltIcon sx={{ fontSize: 40 }} />,
      link: '/inspection',
      span: 2,
      stats: 'Instant Reports',
      features: ['Issue Detection', 'Cost Estimation', 'Annotated Reports'],
      color: '#42a5f5'
    },
  ];

  const advancedFeatures = [
    {
      title: 'Multi-language Support',
      description: '30+ languages supported',
      icon: <LanguageIcon />,
      color: '#ff6b9d'
    },
    {
      title: 'AI Security',
      description: 'Enterprise-grade encryption',
      icon: <SecurityIcon />,
      color: '#4facfe'
    },
    {
      title: 'Lightning Fast',
      description: '30-60 second analysis',
      icon: <SpeedIcon />,
      color: '#43e97b'
    },
    {
      title: 'Smart Learning',
      description: 'Continuously improving AI',
      icon: <PsychologyIcon />,
      color: '#f093fb'
    }
  ];

  const handleModuleClick = (link) => {
    if (link.startsWith('/')) {
      navigate(link);
    } else {
      window.location.href = link;
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
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
            Explore Our AI Modules
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Powerful AI tools designed to transform every aspect of your lease experience
          </Typography>
        </motion.div>
      </Box>

      {/* Main Bento Grid */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, mb: 8 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            gridAutoRows: 'minmax(200px, auto)',
          }}
        >
          {coreModules.map((module, index) => (
            <BentoGridItem
              key={module.id}
              span={isMobile ? 1 : module.span}
              tall={module.tall && !isMobile}
              gradient={module.gradient}
              index={index}
              onMouseEnter={() => setHoveredItem(module.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleModuleClick(module.link)}
              sx={{ cursor: 'pointer' }}
            >
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${module.color}22 0%, ${module.color}11 100%)`,
                    opacity: hoveredItem === module.id ? 1 : 0.5,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Header */}
                <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: module.color,
                      mb: 2,
                      width: 56,
                      height: 56,
                      '& svg': { fontSize: 28 }
                    }}
                  >
                    {module.icon}
                  </Avatar>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {module.title}
                  </Typography>

                  <Chip
                    icon={<StarIcon fontSize="small" />}
                    label={module.stats}
                    size="small"
                    sx={{
                      bgcolor: `${module.color}22`,
                      color: module.color,
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: module.color }
                    }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.6
                    }}
                  >
                    {module.description}
                  </Typography>

                  {/* Features list */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {module.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          borderColor: `${module.color}44`,
                          color: 'text.secondary',
                          '&:hover': {
                            borderColor: module.color,
                            bgcolor: `${module.color}11`,
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* CTA Button */}
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    borderColor: module.color,
                    color: module.color,
                    '&:hover': {
                      borderColor: module.color,
                      bgcolor: `${module.color}11`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    mt: 'auto'
                  }}
                >
                  Try {module.title}
                </Button>

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredItem === module.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${module.color}11 0%, transparent 100%)`,
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                  }}
                />
              </Box>
            </BentoGridItem>
          ))}
        </Box>
      </Box>

      {/* Advanced Features Section */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Beyond the Basics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced capabilities that set us apart from the competition
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {advancedFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphismCard>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: feature.color,
                      mx: 'auto',
                      mb: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Call-to-Action */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              maxWidth: 600,
              mx: 'auto',
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Experience the Future?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Join thousands who've transformed their lease experience with our AI-powered tools
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BentoFeaturesGrid;