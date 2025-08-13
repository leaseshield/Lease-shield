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
  Chat as ChatIcon,
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
      stats: 'Save 40% Time',
      features: ['Cost Estimation', 'Scenario Comparison'],
      color: '#43e97b'
    },
    {
      id: 'expense-scanner',
      title: 'Expense Scanner',
      description: 'Upload receipts or invoices to automatically extract details and categorize expenses.',
      icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />,
      link: '/expense-scanner',
      stats: '99% OCR Accuracy',
      features: ['Auto-Extract', 'Smart Categories', 'Export Ready'],
      color: '#ffa726'
    },
    {
      id: 'photo-inspector',
      title: 'Photo Inspector',
      description: 'Upload property photos to detect issues and estimate repair costs instantly.',
      icon: <CameraAltIcon sx={{ fontSize: 40 }} />,
      link: '/photo-inspection',
      stats: 'Instant Reports',
      features: ['Issue Detection', 'Cost Estimation', 'Annotated Reports'],
      color: '#42a5f5'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Get instant answers to your lease questions with our conversational assistant.',
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      link: '/chat',
      stats: '24/7 Assistant',
      features: ['Instant Answers', 'Lease Guidance'],
      color: '#ab47bc'
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
      <Box sx={{ maxWidth: 1060, mx: 'auto', px: 2, mb: 8 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            justifyItems: 'stretch',
            alignItems: 'stretch'
          }}
        >
          {coreModules.map((module, index) => (
            <BentoGridItem
              key={module.id}
              index={index}
              onMouseEnter={() => setHoveredItem(module.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleModuleClick(module.link)}
              sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', borderRadius: 3 }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Avatar sx={{ bgcolor: module.color, width: 48, height: 48, mb: 1 }}>
                  {module.icon}
                </Avatar>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {module.title}
                </Typography>
                <Chip icon={<StarIcon fontSize="small" />} label={module.stats} size="small" sx={{ bgcolor: `${module.color}22`, color: module.color, '& .MuiChip-icon': { color: module.color } }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6, wordBreak: 'break-word' }}>
                {module.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                {module.features.map((feature, idx) => (
                  <Chip key={idx} label={feature} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                ))}
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3,
            maxWidth: 800,
            mx: 'auto'
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
              <GlassmorphismCard sx={{ borderRadius: 5 }}>
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
              borderRadius: 6,
              background: (theme) => theme.palette.gradients.soft,
              border: '1px solid rgba(102, 126, 234, 0.25)',
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
                background: (theme) => theme.palette.gradients.primary,
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