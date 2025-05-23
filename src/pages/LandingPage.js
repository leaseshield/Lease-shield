import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthState } from '../hooks/useAuthState';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Fade,
  Zoom,
  useMediaQuery,
  useTheme,
  Tooltip,
  Link
} from '@mui/material';
import {
  SecurityOutlined as SecurityIcon,
  SpeedOutlined as SpeedIcon,
  GavelOutlined as GavelIcon,
  WarningAmberOutlined as WarningIcon,
  CheckCircleOutline as CheckIcon,
  HighlightOff as CloseIcon,
  Translate as LanguageIcon,
  TrendingUp as AutoGraphIcon,
  PsychologyOutlined as PsychologyIcon,
  CalculateOutlined as CalculateIcon,
  ArticleOutlined as ArticleOutlinedIcon,
  DescriptionOutlined as DescriptionIcon,
  CompareArrows as CompareIcon,
  LockOutlined as LockIcon,
  BusinessCenterOutlined as CommercialIcon,
  SchoolOutlined as StudentIcon,
  VerifiedUserOutlined as VerifiedIcon,
  UploadFileOutlined as UploadFileIcon,
  Savings as SavingsIcon,
  HomeWork as HomeWorkIcon,
  Search as SearchIcon,
  FindInPageOutlined as FindInPageIcon,
  HandshakeOutlined as HandshakeIcon,
  GroupAddOutlined as GroupAddIcon,
  ReceiptLongOutlined as ReceiptLongIcon,
  CameraAltOutlined as CameraAltIcon,
  BuildOutlined as BuildIcon,
  AnalyticsOutlined as AnalyticsIcon,
  PersonSearch as PersonSearchIcon,
  Upcoming as UpcomingIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tenant",
      avatar: "S",
      icon: <VerifiedIcon color="success"/>,
      content: "Lease Shield AI helped me understand my rental agreement in minutes. I found two clauses that needed negotiation before signing!"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      avatar: "M",
      icon: <VerifiedIcon color="success"/>,
      content: "We use Lease Shield AI to ensure our lease agreements are fair and transparent. It's improved tenant satisfaction significantly."
    },
    {
      name: "Alex Rodriguez",
      role: "First-Time Renter",
      avatar: "A",
      icon: <StudentIcon color="action"/>,
      content: "As a student renting for the first time, this tool was invaluable. It explained everything clearly and made me feel much more confident."
    },
    {
      name: "Priya Patel",
      role: "Real Estate Attorney",
      avatar: "P",
      icon: <VerifiedIcon color="success"/>,
      content: "This tool empowers clients to understand their leases before they need legal counsel. A great preventative legal resource."
    },
    {
      name: "David Kim",
      role: "Small Business Owner (Commercial Lease)",
      avatar: "D",
      icon: <CommercialIcon color="action"/>,
      content: "Analyzed my complex commercial lease quickly and flagged several important points for discussion with the landlord. Saved me potential headaches."
    }
  ];

  // UPDATED: Core AI Modules/Features data
  const coreModules = [
    {
      title: "New Lease Analysis",
      description: "Upload a lease document (PDF/TXT) or paste text to get an AI-powered breakdown of clauses, risks, and key terms in minutes.",
      icon: <DescriptionIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "#lease-analysis-detail"
    },
    {
      title: "Tenant Matcher",
      description: "Upload property details or tenant preferences (files/text) and let our AI pinpoint ideal matches—streamlining your tenant search and reducing vacancy time.",
      icon: <HomeWorkIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "#tenant-matcher-detail"
    },
    {
      title: "Lease Calculator",
      description: "Estimate costs, compare scenarios, and understand the financial implications of different lease terms—right in your browser.",
      icon: <CalculateIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "/calculator"
    },
    {
      title: "Expense Scanner",
      description: "Upload receipts or invoices (PDF, JPG, PNG) to automatically extract details, categorize expenses, and prepare them for your ledger.",
      icon: <ReceiptLongIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "/expenses"
    },
    {
      title: "Photo Inspector",
      description: "Upload property photos (walls, fixtures, roof) to detect issues and estimate repair costs—instantly producing annotated reports and budgets.",
      icon: <CameraAltIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "/inspection"
    }
  ];

  // Advanced features
  const advancedFeatures = [
    {
      title: "Handles Long Leases (Up to 700 Pages)",
      description: "Analyze even the longest and most complex residential or commercial lease agreements thanks to our expansive 1 million token context window.",
      icon: <DescriptionIcon />
    },
    {
      title: "Multilanguage Support",
      description: "Process lease documents in over 30 languages with accurate translation and analysis",
      icon: <LanguageIcon />
    },
    {
      title: "Lease Manager Dashboard",
      description: "Organize and track all your properties, payments, and important dates in one place",
      icon: <ArticleOutlinedIcon />
    },
    {
      title: "Payment Calculator",
      description: "Calculate rent increases, deposits, prorated rent and other financial aspects of your lease",
      icon: <CalculateIcon />
    },
    {
      title: "Advanced Pattern Recognition",
      description: "Our AI identifies patterns across thousands of leases to spot potential issues others might miss",
      icon: <PsychologyIcon />
    },
    {
      title: "Trend Analysis",
      description: "Track market trends in rental terms and conditions to gain negotiating leverage",
      icon: <AutoGraphIcon sx={{ color: theme.palette.primary.main }} />
    },
  ];

  // Comparison table data
  const comparisonData = [
    { feature: "Lease Term Extraction", traditional: false, leaseShield: true },
    { feature: "Legal Clause Summaries", traditional: false, leaseShield: true },
    { feature: "Potential Risk Identification", traditional: false, leaseShield: true },
    { feature: "Plain Language Explanations", traditional: false, leaseShield: true },
    { feature: "Handles Long Documents (~700 pages)", traditional: false, leaseShield: true },
    { feature: "AI Specialized for Leases", traditional: false, leaseShield: true },
    { feature: "Multilanguage Support", traditional: false, leaseShield: true },
    { feature: "Response Time", traditional: "Days to Weeks", leaseShield: "30-60 seconds" },
    { feature: "Cost", traditional: "$200-500/hr", leaseShield: "Less then 5$ with unlimited scans" }
  ];

  // --- Button Click Handler ---
  const handleGetStartedClick = () => {
      if (user) {
          navigate('/analysis'); // Go to analysis if logged in
      } else {
          navigate('/register'); // Go to register if not logged in
      }
  };
  // --- End Button Click Handler ---

  // --- Schema Data --- 
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Lease Shield AI',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web-based',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'USD',
      'price': '5',
      'url': 'https://leaseshield.eu/pricing'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'reviewCount': '75',
      'bestRating': '5',
      'worstRating': '1'
    },
    'description': 'AI-powered lease analysis tool to help tenants and professionals understand rental agreements, identify risks, and review contracts quickly.',
    'featureList': [
      'Lease Analysis',
      'Tenant Matching',
      'Lease Calculator',
      'Expense Scanner',
      'Photo Inspector'
    ],
    'screenshot': 'https://leaseshield.eu/screenshot.jpg',
    'url': 'https://leaseshield.eu/',
    'author': {
      '@type': 'Organization',
      'name': 'Lease Shield AI',
      'url': 'https://leaseshield.eu/'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      // Map your FAQ data here
      {
        '@type': 'Question',
        'name': 'How accurate is the AI analysis?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our AI model is trained on thousands of lease agreements and achieves high accuracy in identifying standard lease terms and potential issues. However, we always recommend consulting with a legal professional for final decisions.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is my data secure?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, we take security seriously. Your documents are encrypted in transit and at rest using enterprise-grade security measures. We are compliant with industry standards for data protection.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What file formats are supported?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': "Currently we support PDF and direct text pasting. We're working on adding support for Word documents (.docx) and other formats."
        }
      },
      {
        '@type': 'Question',
        'name': 'How long does the analysis take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most lease agreements are analyzed within 1-2 minutes. Extremely long or complex documents might take slightly longer.'
        }
      }
    ]
  };
  // --- End Schema Data ---

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* REMOVE old Blog Link from top right */}
      {/* 
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button component={RouterLink} to="/blog" variant="text" color="inherit">
          Blog
        </Button>
      </Box>
      */}

      <Helmet>
        <title>Lease Shield AI: Advanced AI Lease Analyzer & Contract Review | Understand Your Rental Agreement</title>
        <meta 
          name="description" 
          content="Lease Shield AI uses advanced artificial intelligence to analyze your lease agreement in minutes. Understand complex clauses, identify risks, and review your rental contract like an expert. Get started free!" 
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Lease Shield AI: Advanced AI Lease Analyzer & Contract Review" />
        <meta property="og:description" content="Understand your lease agreement in minutes with AI-powered analysis. Identify risks, understand terms, and protect your rights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://leaseshield.eu" />
        <link rel="canonical" href="https://leaseshield.eu" />
        {/* Add JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(softwareApplicationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Lease Shield AI Product Demonstration",
            "description": "See how Lease Shield AI uses artificial intelligence to analyze lease agreements, identify risks, and help you understand complex legal documents quickly.",
            "thumbnailUrl": "https://leaseshield.eu/video-poster.jpg",
            "uploadDate": "2023-10-26T08:00:00+00:00", // Change to the actual upload date
            "duration": "PT1M30S", // Change to the actual video duration (e.g., PT1M30S for 1 minute 30 seconds)
            "contentUrl": "https://leaseshield.eu/Product Launch Video.mp4",
            "embedUrl": "https://leaseshield.eu/Product Launch Video.mp4", // Or the URL of a page where the video is embedded if different
            "publisher": {
              "@type": "Organization",
              "name": "Lease Shield AI",
              "logo": {
                "@type": "ImageObject",
                "url": "https://leaseshield.eu/logo512.png"
              }
            }
            // Potentially add transcript if available
            // "transcript": "Your video transcript here..."
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5, md: 8 },
            mb: { xs: 6, md: 10 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: '30px',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
              <Grid item xs={12} md={6} sx={{ borderRadius: 3 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                    lineHeight: 1.2
                  }}
                >
                  Understand Your Lease in Minutes, Not Days
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Lease Shield AI uses advanced artificial intelligence, specifically trained on legal documents, to analyze your rental agreement, identify potential issues, and explain complex terms in plain language.
                </Typography>
                <Typography
                  variant="subtitle1"
                  paragraph
                  sx={{
                    opacity: 0.85,
                    mb: 3,
                    fontWeight: 'medium',
                    fontSize: { xs: '0.9rem', md: '1.1rem' }
                  }}
                >
                  All-in-One AI Suite: Lease Analysis • Tenant Matching • Lease Calculator • Expense Scanner • Photo Inspector
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStartedClick}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: '25px',
                      boxShadow: theme.shadows[3],
                      transition: theme.transitions.create(['transform', 'box-shadow', 'background-color'], {
                        duration: theme.transitions.duration.short,
                        easing: theme.transitions.easing.easeInOut,
                      }),
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-3px)',
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    {user ? 'Analyze New Lease' : 'Get Started Free'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/blog"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 'bold',
                      fontSize: '1rem', // Match size roughly
                      px: 4, // Match padding roughly
                      py: 1.5, // Match padding roughly
                      borderRadius: '25px', // Match shape
                      transition: theme.transitions.create(['transform', 'box-shadow', 'background-color', 'border-color'], {
                        duration: theme.transitions.duration.short,
                        easing: theme.transitions.easing.easeInOut,
                      }),
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    View Blog
                  </Button>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                     icon={<DescriptionIcon fontSize="small" />} 
                     label="Handles long leases (~700 pages)" 
                     variant="outlined" 
                     size="small"
                     sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '.MuiChip-icon': { color: 'white' } }}
                   />
                  <Chip 
                     icon={<LanguageIcon fontSize="small" />} 
                     label="30+ languages" 
                     variant="outlined" 
                     size="small"
                     sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '.MuiChip-icon': { color: 'white' } }}
                   />
                   <Chip 
                     icon={<PsychologyIcon fontSize="small" />} 
                     label="Specialized AI" 
                     variant="outlined" 
                     size="small"
                     sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '.MuiChip-icon': { color: 'white' } }}
                   />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: 'center', position: 'relative' }}>
                 <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                   <Box
                     sx={{
                       bgcolor: 'rgba(255, 255, 255, 0.1)',
                       height: { xs: 250, sm: 350, md: 400 },
                       width: '100%',
                       maxWidth: 600,
                       borderRadius: '20px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       overflow: 'hidden',
                       position: 'relative',
                       mx: 'auto',
                     }}
                   >
                     <video
                       width="100%"
                       height="100%"
                       controls
                       autoPlay
                       muted
                       loop
                       playsInline
                       preload="auto"
                       poster="/video-poster.jpg"
                       style={{ objectFit: 'cover', borderRadius: '20px' }}
                       aria-label="Lease Shield AI product demonstration video"
                     >
                       <source src="/Product Launch Video.mp4" type="video/mp4" />
                       <track 
                         kind="captions" 
                         src="/captions.vtt" 
                         srcLang="en" 
                         label="English" 
                         default 
                       />
                       Your browser does not support the video tag.
                     </video>
                   </Box>
                 </Zoom>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Fade>

      {/* UPDATED Features Section -> Core AI Modules */}
      <Box id="features" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant={isMobile ? "h4" : "h3"} component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
             Explore Our AI Modules
          </Typography>
          <Grid container spacing={isMobile ? 3 : 4} justifyContent="center">
            {coreModules.map((module, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index} sx={{ display: 'flex' }}>
                <Fade in={true} timeout={500 * (index + 1)}>
                  <Card elevation={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, width: '100%', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1, p: { xs: 2, md: 3 } }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                         {module.icon}
                      </Avatar>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {module.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                       <Button 
                         variant="outlined"
                         color="primary"
                         size="small" 
                         href={module.link.startsWith('#') ? module.link : undefined}
                         component={!module.link.startsWith('#') ? RouterLink : undefined}
                         to={!module.link.startsWith('#') ? module.link : undefined}
                         aria-label={`Learn more about ${module.title}`}
                         sx={{
                           textTransform: 'none',
                           transition: theme.transitions.create(['background-color', 'transform'], { duration: theme.transitions.duration.short }),
                           '&:hover': {
                             backgroundColor: theme.palette.action.hover,
                             transform: 'scale(1.05)'
                           }
                         }}
                       >
                         Learn More About {module.title}
                       </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* AI Landlord Section (Now maybe Tenant Matcher focused or a separate section) */}
      {/* Keeping this section for now, but it overlaps with the new Tenant Matcher detail */}
      <Box 
         id="ai-landlord" 
         sx={{ 
           py: { xs: 6, md: 10 }, 
           bgcolor: 'background.default', // Changed from secondary.main to default background
           // color: 'secondary.contrastText' // Removed: Let text color inherit for light background
         }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
               <Zoom in={true} timeout={500}>
                 <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                   <Typography variant="h2" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                     Meet Your AI Landlord Assistant
                   </Typography>
                   <Typography variant="h6" paragraph sx={{ mb: 3, color: 'text.secondary' /* Adjusted for light background */ }}>
                     Streamline tenant matching and property management with Lease Shield AI. Define your ideal tenant and let our AI find the best fit based on preferences and uploaded documents.
                   </Typography>
                   <List dense>
                     <ListItem>
                       <ListItemIcon sx={{ color: 'primary.main' /* Explicit color */ }}><CheckIcon /></ListItemIcon>
                       <ListItemText primary="Automated Tenant Preference Matching" />
                     </ListItem>
                     <ListItem>
                       <ListItemIcon sx={{ color: 'primary.main' /* Explicit color */ }}><CheckIcon /></ListItemIcon>
                       <ListItemText primary="Document Analysis for Suitability" />
                     </ListItem>
                     <ListItem>
                       <ListItemIcon sx={{ color: 'primary.main' /* Explicit color */ }}><CheckIcon /></ListItemIcon>
                       <ListItemText primary="Reduces Vacancy Time" />
                     </ListItem>
                     <ListItem>
                       <ListItemIcon sx={{ color: 'primary.main' /* Explicit color */ }}><CheckIcon /></ListItemIcon>
                       <ListItemText primary="Objective, Data-Driven Insights" />
                     </ListItem>
                   </List>
                   <Button
                      variant="contained"
                      color="primary" // Changed back to primary (blue)
                      size="large"
                      component={RouterLink}
                      to="/real-estate-agent" // Link to the relevant page
                      sx={{
                        mt: 3,
                        transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], { duration: theme.transitions.duration.short }),
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'scale(1.03)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      Try Landlord Portal
                    </Button>
                 </Box>
               </Zoom>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={700}>
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                   {/* Placeholder for a graph or illustrative image - using an icon for now */}
                   <PersonSearchIcon sx={{ fontSize: { xs: 150, md: 250 }, color: 'secondary.main', /* Changed color */ opacity: 0.8 }} />
                 </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* END NEW SECTION */}

      {/* NEW: Landlord Efficiency Comparison Graph */}
      <Box sx={{ 
        py: { xs: 6, md: 8 }, 
        bgcolor: 'background.paper', /* Or background.default */
        borderRadius: theme.shape.borderRadius * 2 // Added this line
      }}>
        <Container maxWidth="lg">
           <Typography variant="h4" component="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
             Faster, More Accurate Tenant Matching
           </Typography>
           <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
              See how Lease Shield AI streamlines the process compared to traditional methods.
           </Typography>
           <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
             {/* Graph Representation */} 
             {[ 
                { label: 'Time to Find Suitable Tenant', traditional: 14, ai: 3, unit: 'days' },
                { label: 'Tenant Suitability Match Rate', traditional: 70, ai: 95, unit: '%' },
              ].map((metric, index) => (
                <Grid item xs={10} sm={5} md={4} key={metric.label}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>{metric.label}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, mt: 2, mb: 1 }}>
                      {/* Traditional Bar */} 
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <Tooltip title={`Traditional: ${metric.traditional}${metric.unit}`} placement="top">
                           <Zoom in={true} style={{ transitionDelay: `${100 * index + 300}ms` }}>
                             <Box
                                 aria-label={`Traditional: ${metric.traditional}${metric.unit}`}
                                 sx={{ 
                                   width: 40, 
                                   height: `${(metric.traditional / (metric.label.includes('Time') ? 20 : 100)) * 130}px`, // Scale height (adjust divisors)
                                   bgcolor: 'grey.400',
                                   borderRadius: '4px 4px 0 0',
                                   transition: 'height 0.5s ease-out'
                                 }} 
                             />
                           </Zoom>
                         </Tooltip>
                         <Typography variant="caption" sx={{ mt: 0.5 }}>Traditional</Typography>
                      </Box>
                      {/* AI Bar */} 
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <Tooltip title={`Lease Shield AI: ${metric.ai}${metric.unit}`} placement="top">
                           <Zoom in={true} style={{ transitionDelay: `${100 * index + 400}ms` }}>
                            <Box
                               aria-label={`Lease Shield AI: ${metric.ai}${metric.unit}`}
                               sx={{ 
                                 width: 40, 
                                 height: `${(metric.ai / (metric.label.includes('Time') ? 20 : 100)) * 130}px`, // Scale height (adjust divisors)
                                 bgcolor: 'primary.main', 
                                 borderRadius: '4px 4px 0 0',
                                 transition: 'height 0.5s ease-out'
                               }}
                            />
                           </Zoom>
                         </Tooltip>
                         <Typography variant="caption" sx={{ mt: 0.5 }}>Lease Shield AI</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                       {metric.label.includes('Time') ? 
                         `Reduce time by ~${Math.round(100 - (metric.ai / metric.traditional * 100))}%` : 
                         `Improve match rate by ~${Math.round(metric.ai - metric.traditional)}%` 
                       } 
                    </Typography>
                  </Paper>
                </Grid>
              ))}
           </Grid>
        </Container>
      </Box>
      {/* END Landlord Graph */}

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, mb: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
          Simple Steps to Clarity
        </Typography>
        <Grid container spacing={4}>
          {[ 
             { title: 'Upload', desc: 'Securely upload your lease document (PDF or text). Your data is encrypted and confidential.', icon: <UploadFileIcon sx={{ fontSize: 30 }}/> }, 
             { title: 'Analyze', desc: 'Our specialized AI reads every clause, identifying key terms, dates, and potential risks.', icon: <PsychologyIcon sx={{ fontSize: 30 }}/> }, 
             { title: 'Review', desc: 'Get a clear, summarized report in plain language, highlighting areas needing attention.', icon: <ArticleOutlinedIcon sx={{ fontSize: 30 }}/> } 
           ].map((step, index) => (
             <Grid item xs={12} md={4} key={step.title}>
               <Zoom in={true} style={{ transitionDelay: `${200 * index}ms` }}>
                 <Card elevation={0} sx={{ 
                    height: '100%', 
                    borderRadius: 3, 
                    textAlign: 'center', 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[800], // Subtle background
                    border: `1px solid ${theme.palette.divider}` // Subtle border
                  }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, margin: '0 auto 16px auto' }}>
                      {step.icon}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>{step.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                       {step.desc}
                    </Typography>
                 </Card>
               </Zoom>
             </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- START: New Lease Analysis Detail Section --- */}
      <Box 
        id="lease-analysis-detail" 
        sx={{ 
          py: { xs: 6, md: 10 }, 
          bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.light + '33' : theme.palette.primary.dark + '33', // Light tint of primary
          borderRadius: '20px' // Added this line
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
             {/* Image/Mockup Placeholder (Left Side) - Now using an icon */}
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={500}>
                 {/* Use an Icon instead of a blank Paper */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: 250, sm: 350, md: 400 } }}>
                     <DescriptionIcon aria-hidden="true" color="primary" sx={{ fontSize: { xs: 150, md: 200 }, opacity: 0.6 }} />
                 </Box>
              </Zoom>
            </Grid>
            {/* Text Content (Right Side) */}
            <Grid item xs={12} md={6}>
               <Fade in={true} timeout={700}>
                 <Box>
                   <Typography variant={isMobile ? "h4" : "h3"} component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                     Upload. Analyze. Understand.
                   </Typography>
                   <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 3 }}>
                     Get instant insights into your lease agreements. Our AI does the heavy lifting, so you don't have to.
                   </Typography>
                   <List dense sx={{ mb: 4 }}>
                     {[
                        // Use specific icons as requested
                        { text: "AI extracts key dates, clauses & escalation schedules", icon: <CheckIcon color="primary" /> },
                        { text: "Risk flags for unusual or unfavorable terms", icon: <WarningIcon color="warning" /> },
                        // Assuming DownloadIcon is imported or available, otherwise use another like ArticleOutlinedIcon
                        { text: "Download plain-language summary report", icon: <ArticleOutlinedIcon color="action" /> } 
                     ].map((item, index) => (
                        <ListItem key={index} disableGutters>
                           <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
                           <ListItemText primary={item.text} />
                        </ListItem>
                     ))}
                   </List>
                   <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleGetStartedClick} // Or navigate('/analysis') etc.
                      sx={{
                        borderRadius: '25px', px: 4, py: 1.5,
                        transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], { duration: theme.transitions.duration.short }),
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'scale(1.03)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      Analyze a Lease Now
                    </Button>
                 </Box>
               </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* --- END: New Lease Analysis Detail Section --- */}

      {/* --- START: Tenant Matcher Detail Section --- */}
      <Box id="tenant-matcher-detail" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
           {/* Reverse order for visual variation: Text Left, Image Right */}
          <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
             {/* Text Content (Left Side) */}
            <Grid item xs={12} md={6}>
               <Fade in={true} timeout={700}>
                 <Box>
                   <Typography variant={isMobile ? "h4" : "h3"} component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                     Find the Perfect Fit Faster.
                   </Typography>
                   <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 3 }}>
                     Leverage AI to match ideal tenants with your properties based on preferences, suitability analysis, and more.
                   </Typography>
                   <List dense sx={{ mb: 4 }}>
                     {[
                        // Use specific icons as requested
                        { text: "Match criteria from uploaded profiles or structured inputs", icon: <CheckIcon color="primary" /> },
                        { text: "Data-driven suitability score & recommendations", icon: <AnalyticsIcon color="primary" /> }, // Using AnalyticsIcon
                        { text: "Automate outreach & track applicant status (Coming Soon!)", icon: <UpcomingIcon color="disabled" /> } // Assuming UpcomingIcon or similar
                     ].map((item, index) => (
                        <ListItem key={index} disableGutters>
                           <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
                           <ListItemText primary={item.text} />
                        </ListItem>
                     ))}
                   </List>
                   <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      component={RouterLink}
                      to="/real-estate-agent" // Link to the relevant portal/page
                      sx={{
                        borderRadius: '25px', px: 4, py: 1.5,
                        transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], { duration: theme.transitions.duration.short }),
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'scale(1.03)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      Explore Tenant Matching
                    </Button>
                 </Box>
               </Fade>
            </Grid>
            {/* Image/Mockup Placeholder (Right Side) - Now using an icon */}
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={500}>
                 {/* Use an Icon instead of a blank Paper */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: 250, sm: 350, md: 400 } }}>
                     <PersonSearchIcon aria-hidden="true" color="secondary" sx={{ fontSize: { xs: 150, md: 200 }, opacity: 0.6 }} />
                 </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* --- END: Tenant Matcher Detail Section --- */}

      {/* --- Accuracy Comparison Section --- */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        py: { xs: 6, md: 8 },
        borderRadius: 3 // Added this line
      }}> { /* Use a slightly different background */}
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
            Leading Accuracy in Lease Analysis
          </Typography>
          <Grid container spacing={5} alignItems="center">
            {/* Bullet Points */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                On the Benchmark for identifying key lease clauses and risks:
              </Typography>
              <List dense>
                {[ 
                   { name: 'Lease Shield AI', score: '98.5%', color: 'success.main' },
                   { name: 'Human Experts', score: '85%', color: 'warning.main' },
                   { name: 'ChatGPT-4', score: '17%', color: 'error.light' },
                   { name: 'Claude 3', score: '12%', color: 'error.dark' },
                ].map((item) => (
                  <ListItem key={item.name}>
                     <ListItemIcon sx={{ minWidth: 35, color: item.color }}>
                       <CheckIcon />
                     </ListItemIcon>
                     <ListItemText 
                        primary={<Typography variant="h6" component="span">{item.name}</Typography>}
                        secondary={<Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: item.color }}>{item.score}</Typography>}
                     />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Simple Graph Representation */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 300, px: 2 }}>
                {[ 
                   { label: 'Claude 3', value: 12, color: '#d32f2f' }, // error.dark
                   { label: 'ChatGPT-4', value: 17, color: '#ef5350' }, // error.light
                   { label: 'Human Experts', value: 85, color: '#ffa726' }, // warning.main
                   { label: 'Lease Shield', value: 98.5, color: '#66bb6a' }, // success.main
                ].map((bar, index) => (
                   <Box key={bar.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1.5, flexGrow: 1 }}>
                      <Tooltip title={`${bar.label}: ${bar.value}%`} placement="top">
                        <Zoom in={true} style={{ transitionDelay: `${100 * index + 500}ms` }}>
                          <Box
                              aria-label={`${bar.label}: ${bar.value}%`}
                              sx={{
                                  width: '100%',
                                  maxWidth: '50px',
                                  height: `${bar.value * 2.5}px`, // Scale height based on value (adjust multiplier as needed)
                                  bgcolor: bar.color,
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.6s ease-out',
                                  mb: 1,
                                  mx: 'auto'
                              }}
                          />
                        </Zoom>
                      </Tooltip>
                       <Typography variant="caption" sx={{ textAlign: 'center' }}>{bar.label}</Typography>
                   </Box>
                ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* --- End Accuracy Comparison Section --- */}

      {/* --- Add Savings Info Box --- */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}> { /* Use medium width container */}
         <Paper 
            elevation={3} 
            sx={{
               p: { xs: 2, sm: 3 }, 
               borderRadius: 3, 
               bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],  /* Use a distinct background */
               display: 'flex', 
               alignItems: 'center', 
               gap: 2 
            }}
          >
            <SavingsIcon sx={{ fontSize: 50, color: 'secondary.main' }} /> { /* Add Savings Icon */}
            <Box>
               <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                   Significant Savings for Businesses
               </Typography>
               <Typography variant="body1">
                  On average, Lease Shield AI saves business owners around $500 per commercial lease agreement by identifying costly clauses early.
               </Typography>
            </Box>
         </Paper>
      </Container>
      {/* --- End Savings Info Box --- */}

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
            The Lease Shield AI Advantage
          </Typography>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <List sx={{ '& .MuiListItem-root': { alignItems: 'flex-start', pb: 2 } }}>
                {
                  [
                     { title: "Specifically Trained AI", text: "Unlike general AI, ours understands the nuances of lease agreements for superior accuracy.", icon: <PsychologyIcon color="primary" /> },
                     { title: "Handles Extreme Length", text: "Confidently analyze documents up to 700 pages long, far exceeding many other tools.", icon: <DescriptionIcon color="primary" /> },
                     { title: "Deep Contextual Understanding", text: "Goes beyond simple keyword searching to grasp the true meaning and implications of clauses.", icon: <CompareIcon color="primary" /> },
                     { title: "Tenant Protection Focus", text: "Our analysis prioritizes identifying potential risks and unfavorable terms for renters.", icon: <SecurityIcon color="primary" /> },
                     { title: "Multilingual Capabilities", text: "Analyze leases in over 30 languages with reliable translation and understanding.", icon: <LanguageIcon color="primary" /> }
                  ].map(item => (
                    <ListItem disableGutters key={item.title}>
                      <ListItemIcon sx={{ minWidth: 45, mt: 0.5 }} >{item.icon}</ListItemIcon>
                      <ListItemText 
                         primary={<Typography variant="h6" component="span" fontWeight={600}>{item.title}</Typography>} 
                         secondary={item.text} 
                      />
                    </ListItem>
                  ))
                }
              </List>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
               <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                 <Box sx={{ textAlign: 'center' }}>
                    <CompareIcon aria-hidden="true" sx={{ fontSize: 180, color: 'primary.light', opacity: 0.8 }} />
                 </Box>
               </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Advanced Features */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 1, textAlign: 'center' }}>
          Beyond the Basics
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
          Explore advanced capabilities for comprehensive lease management.
        </Typography>
        <Grid container spacing={3}>
          {advancedFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Zoom in={true} style={{ transitionDelay: `${150 * index + 300}ms` }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'flex-start',
                    borderRadius: 3,
                    height: '100%',
                    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
                        duration: theme.transitions.duration.short,
                        easing: theme.transitions.easing.easeInOut,
                    }),
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: theme.shadows[2],
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: theme.palette.primary.main, 
                      mr: 2,
                      color: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Comparison Section */}
       <Box sx={{ bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900], py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 1, textAlign: 'center' }}>
             A Smarter Alternative
           </Typography>
           <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
             See how Lease Shield AI compares to traditional manual review.
           </Typography>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
            <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, borderColor: theme.palette.divider }}>
              <Grid container sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Grid item md={4} />
                <Grid item md={4}>
                  <Typography variant="subtitle1" fontWeight="bold" align="center" color="text.secondary">Traditional Review</Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="subtitle1" fontWeight="bold" align="center" color="primary">Lease Shield AI</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2, display: { xs: 'none', md: 'block' } }} />
              
              {comparisonData.map((row, index) => (
                <React.Fragment key={index}>
                  <Grid container sx={{ py: { xs: 2, md: 1.5 } }} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1" sx={{ fontWeight: { xs: 'bold', md: 'normal' } }}>{row.feature}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} align="center">
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.8rem', color: 'text.secondary', mb: 0.5 }}>Traditional:</Typography>
                      {typeof row.traditional === 'boolean' ? (
                        row.traditional ? 
                          <CheckIcon sx={{ color: 'success.light' }} /> : 
                          <CloseIcon sx={{ color: 'error.light' }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">{row.traditional}</Typography>
                      )}
                    </Grid>
                     <Grid item xs={6} md={4} align="center">
                       <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.8rem', color: 'text.secondary', mb: 0.5 }}>Lease Shield AI:</Typography>
                       {typeof row.leaseShield === 'boolean' ? (
                        row.leaseShield ? 
                          <CheckIcon sx={{ color: 'success.main' }} /> : 
                          <CloseIcon sx={{ color: 'error.main' }} />
                      ) : (
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {row.leaseShield}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  {index < comparisonData.length - 1 && <Divider />} 
                </React.Fragment>
              ))}
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
          Trusted by Renters & Professionals
        </Typography>
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in={true} timeout={800} style={{ transitionDelay: `${150 * index + 300}ms` }}>
                <Card
                  elevation={0}
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    borderColor: theme.palette.divider,
                    p: 3,
                    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
                      duration: theme.transitions.duration.short,
                      easing: theme.transitions.easing.easeInOut,
                    }),
                    '&:hover': {
                      borderColor: theme.palette.secondary.light,
                      boxShadow: theme.shadows[2],
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <CardContent sx={{ p: 0, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1.5 }}>{testimonial.avatar}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>{testimonial.role}</Typography>
                      </Box>
                      {testimonial.icon}
                    </Box>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      "{testimonial.content}"
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
       <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'white',
              textAlign: 'center',
            }}
          >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to Understand Your Lease?
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands who use Lease Shield AI to analyze, understand, and negotiate better lease agreements.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStartedClick}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 5,
                  py: 1.5,
                  borderRadius: '25px',
                  transition: theme.transitions.create(['transform', 'box-shadow', 'background-color'], {
                    duration: theme.transitions.duration.short,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {user ? 'Analyze New Lease' : 'Get Started Free'}
              </Button>
           </Paper>
         </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mb: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        <Stack spacing={2}>
          {[ { q: "How accurate is the AI analysis?", a: "Our AI model is trained on thousands of lease agreements and achieves high accuracy in identifying standard lease terms and potential issues. However, we always recommend consulting with a legal professional for final decisions." }, { q: "Is my data secure?", a: "Yes, we take security seriously. Your documents are encrypted in transit and at rest using enterprise-grade security measures. We are compliant with industry standards for data protection.", icon: <LockIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5, color: 'text.secondary' }} /> }, { q: "What file formats are supported?", a: "Currently we support PDF and direct text pasting. We're working on adding support for Word documents (.docx) and other formats."}, { q: "How long does the analysis take?", a: "Most lease agreements are analyzed within 1-2 minutes. Extremely long or complex documents might take slightly longer." } ].map((item, index) => (
             <Fade in={true} timeout={600} style={{ transitionDelay: `${100 * index + 200}ms` }}>
               <Paper key={index} elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {item.q}
                    {item.icon}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">{item.a}</Typography>
               </Paper>
             </Fade>
          ))}
        </Stack>
      </Container>

      {/* --- Admin Login Button --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
              component={RouterLink} 
              to="/admin" 
              size="small" 
              variant="text"
              color="inherit" // Use subtle color
          >
              Admin Access
          </Button>
      </Box>
      {/* --- End Admin Login Button --- */}

      {/* --- Footer Update --- */}
      <Container maxWidth="lg" sx={{ py: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Lease Shield AI. All rights reserved.
        </Typography>
        {/* NEW Reminder Line */}
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
          Lease Shield AI now includes Lease Analysis, Tenant Matcher, Lease Calculator, Expense Scanner, and Photo Inspector—all in one secure platform.
        </Typography>
        {/* Add other footer links if needed */}
      </Container>
      {/* --- End Footer Update --- */}

    </Box>
  );
};

export default LandingPage; 