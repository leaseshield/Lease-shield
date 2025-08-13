import React, { useEffect, useRef, useState, Suspense } from 'react';
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
  Link,
  CircularProgress
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
import BentoFeaturesGrid from '../components/BentoFeaturesGrid';
const InteractiveClauseAnalyzer = React.lazy(() => import('../components/InteractiveClauseAnalyzer'));
const Hero = React.lazy(() => import('../components/landing/Hero'));

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
    },
    // NEW Sixth Testimonial
    {
      name: "Emily Watson",
      role: "Real Estate Investor",
      avatar: "E",
      icon: <VerifiedIcon color="success"/>,
      content: "Managing multiple properties means reviewing lots of leases. Lease Shield AI has become an essential part of my workflow, saving me hours every week."
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
      link: "/expense-scanner"
    },
    {
      title: "Photo Inspector",
      description: "Upload property photos (walls, fixtures, roof) to detect issues and estimate repair costs—instantly producing annotated reports and budgets.",
      icon: <CameraAltIcon sx={{ fontSize: 40 }} color="primary" />,
      link: "/photo-inspection"
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
        <title>Lease Shield AI: Fast Lease Review & Legal Analysis</title>
        <meta 
          name="description" 
          content="Instantly analyze your lease, detect legal risks, and negotiate better terms using AI tools from Lease Shield." 
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Lease Shield AI: Fast Lease Review & Legal Analysis" />
        <meta property="og:description" content="Instantly analyze your lease, detect legal risks, and negotiate better terms using AI tools from Lease Shield." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://leaseshield.eu/" />
        {/* Canonical is handled globally in Layout */}
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
            "contentUrl": "https://leaseshield.eu/Product Launch Video_compressed.mp4",
            "embedUrl": "https://leaseshield.eu/Product Launch Video_compressed.mp4", // Or the URL of a page where the video is embedded if different
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

      {/* New Hero Section */}
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
            <CircularProgress />
          </Box>
        }
      >
        <Hero onPrimaryClick={handleGetStartedClick} />
      </Suspense>

      {/* Feature grid (Bento) */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <BentoFeaturesGrid />
        </Container>

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
                   <Typography variant="h2" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                     Meet Your AI Landlord Assistant
                   </Typography>
                   <Typography variant="h6" paragraph sx={{ mb: 3, color: 'text.secondary' /* Adjusted for light background */ }}>
                     Streamline tenant matching and property management with Lease Shield AI. Define your ideal tenant and let our AI find the best fit based on preferences and uploaded documents. Learn more about <Link component={RouterLink} to="/blog/tenant-rights-overview" color="primary" sx={{ textDecoration: 'underline', '&:hover': { opacity: 0.8 } }}>tenant rights</Link> and property management best practices.
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
                   {/* Decorative icon; hidden from assistive tech */}
                   <PersonSearchIcon aria-hidden="true" sx={{ fontSize: { xs: 150, md: 250 }, color: 'secondary.main', opacity: 0.8 }} />
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
        bgcolor: 'transparent',
      }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, background: theme.palette.gradients.soft, border: '1px solid', borderColor: theme.palette.divider }}>
           <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
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
                <Grid item xs={12} sm={6} md={4} key={metric.label} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%', width: '100%', maxWidth: 300 }}>
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
          </Paper>
        </Container>
      </Box>
      {/* END Landlord Graph */}

      {/* What is Lease Shield - Main Content Section */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 5, borderColor: theme.palette.divider }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What is Lease Shield AI?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Empowering renters with AI-driven lease review to understand your rights, identify red flags, and sign with confidence.
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                <strong>Who is Lease Shield for?</strong> Our AI lease review tool serves students renting their first apartment, families relocating to new cities, and real estate professionals who want to provide better service to their clients.
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                <strong>The Problems We Solve:</strong> Traditional lease review is time-consuming, expensive, and often inaccessible. Many renters sign agreements without fully understanding their rights or obligations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                <strong>How Lease Shield Works:</strong> Our AI has been specifically trained on thousands of lease agreements. Simply upload your rental agreement and receive a comprehensive analysis within minutes.
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                <strong>Advanced Features:</strong> Our system handles documents up to 700 pages long and supports over 30 languages, making it accessible to renters worldwide.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Chip 
              icon={<SecurityIcon />} 
              label="Your Rights Protected" 
              variant="outlined" 
              color="primary"
              size="medium"
            />
            <Chip 
              icon={<SpeedIcon />} 
              label="Results in Minutes" 
              variant="outlined" 
              color="primary"
              size="medium"
            />
            <Chip 
              icon={<GavelIcon />} 
              label="Legal Expertise" 
              variant="outlined" 
              color="primary"
              size="medium"
            />
            <Chip 
              icon={<LanguageIcon />} 
              label="30+ Languages" 
              variant="outlined" 
              color="primary"
              size="medium"
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStartedClick}
              sx={{
                borderRadius: '25px',
                px: 6,
                py: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              {user ? 'Analyze Your Lease' : 'Start Free Analysis'}
            </Button>
          </Box>
          </Paper>
        </Container>
      </Box>
      {/* END What is Lease Shield Section */}

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, mb: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
          Simple Steps to Clarity
        </Typography>
        <Grid container spacing={4}>
          {[ 
             { title: 'Upload Your Lease', desc: 'Securely upload your rental agreement in PDF format or paste the text directly. Our enterprise-grade encryption ensures your personal information remains confidential and protected throughout the analysis process.', icon: <UploadFileIcon sx={{ fontSize: 30 }}/> }, 
             { title: 'AI Analysis', desc: 'Our specialized AI, trained on thousands of lease agreements, meticulously reads every clause, identifying key terms, important dates, rent escalation schedules, and potential risks that could affect your tenancy rights.', icon: <PsychologyIcon sx={{ fontSize: 30 }}/> }, 
             { title: 'Understand Your Rights', desc: 'Receive a comprehensive report in plain language that explains complex legal terms, highlights potential red flags, and provides actionable recommendations to help you make informed decisions about your rental agreement.', icon: <ArticleOutlinedIcon sx={{ fontSize: 30 }}/> } 
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

      {/* --- START: Interactive AI Element (deferred for performance) --- */}
      <Box sx={{ minHeight: 1 }} id="interactive-ai">
        <DeferredInteractiveAnalyzer />
      </Box>
      {/* --- END: Interactive AI Element --- */}

      {/* --- START: New Lease Analysis Detail Section --- */}
      <Box 
        id="lease-analysis-detail" 
        sx={{ 
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 8, borderColor: theme.palette.divider }}>
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
        </Paper>
        </Container>
      </Box>
      {/* --- END: New Lease Analysis Detail Section --- */}

      {/* --- START: Tenant Matcher Detail Section --- */}
      <Box id="tenant-matcher-detail" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 8, borderColor: theme.palette.divider }}>
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
                        { text: "Automate outreach & track applicant status", icon: <UpcomingIcon color="disabled" aria-hidden="true" /> }
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
          </Paper>
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
              <Grid container spacing={2}>
                {[ 
                   { name: 'LeaseAnalyzer 1B', score: '98.5%', color: 'success.main' },
                   { name: 'Human Experts', score: '85%', color: 'warning.main' },
                   { name: 'ChatGPT-4', score: '17%', color: 'error.light' },
                   { name: 'Claude 3', score: '12%', color: 'error.dark' },
                ].map((item) => (
                  <Grid key={item.name} item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderColor: (theme) => theme.palette.divider,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
                        {item.score}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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
      <Box sx={{ py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 8, borderColor: theme.palette.divider }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
            The Lease Shield AI Advantage
          </Typography>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <List sx={{ '& .MuiListItem-root': { alignItems: 'flex-start', pb: 2 } }}>
                {
                  [
                     { title: "Specifically Trained AI", text: "Unlike general-purpose AI tools, Lease Shield has been specifically trained on thousands of rental agreements, understanding the unique legal language, common clauses, and potential issues that matter most to renters. This specialized training ensures superior accuracy in identifying risks and explaining your rights.", icon: <PsychologyIcon color="primary" /> },
                     { title: "Handles Complex Documents", text: "Confidently analyze even the most comprehensive lease agreements up to 700 pages long, including commercial leases, multi-property agreements, and complex residential contracts that would overwhelm other analysis tools.", icon: <DescriptionIcon color="primary" /> },
                     { title: "Deep Contextual Understanding", text: "Our AI goes far beyond simple keyword searching to grasp the true meaning, legal implications, and interconnected relationships between different clauses in your rental agreement, providing insights that protect your interests.", icon: <CompareIcon color="primary" /> },
                     { title: "Renter Rights Protection", text: "Every analysis prioritizes your protection as a tenant, specifically identifying potentially unfavorable terms, hidden fees, unusual restrictions, and clauses that could limit your rights or increase your financial obligations.", icon: <SecurityIcon color="primary" /> },
                     { title: "Global Accessibility", text: "Analyze lease agreements in over 30 languages with accurate translation and cultural understanding of local rental laws and practices, making our service accessible to renters worldwide.", icon: <LanguageIcon color="primary" /> }
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
          </Paper>
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
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                    minHeight: 160,
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
       <Box sx={{ py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 1, textAlign: 'center' }}>
             A Smarter Alternative
           </Typography>
           <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
             See how Lease Shield AI compares to traditional manual review.
           </Typography>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
            <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 8, borderColor: theme.palette.divider, background: theme.palette.gradients.soft }}>
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
            elevation={8}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              bgcolor: 'primary.dark',
              color: 'white',
              textAlign: 'center',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            }}
          >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to Understand Your Lease?
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands who use Lease Shield AI to analyze, understand, and negotiate better lease agreements. Check out our comprehensive <Link component={RouterLink} to="/blog" color="inherit" sx={{ textDecoration: 'underline', '&:hover': { opacity: 0.8 } }}>lease analysis guides</Link> for expert tips.
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
          {[ { q: "How accurate is the AI analysis?", a: "Our AI model is trained on thousands of lease agreements and achieves high accuracy in identifying standard lease terms and potential issues. However, we always recommend consulting with a legal professional for final decisions." }, { q: "Is my data secure?", a: "Yes, we take security seriously. Your documents are encrypted in transit and at rest using enterprise-grade security measures. We are compliant with industry standards for data protection.", icon: <LockIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5, color: 'text.secondary' }} /> }, { q: "What file formats are supported?", a: <>Currently we support PDF and direct text pasting. We're working on adding support for Word documents (.docx) and other formats. Visit our <Link component={RouterLink} to="/pricing" color="primary" sx={{ textDecoration: 'underline' }}>pricing page</Link> for more details.</>}, { q: "How long does the analysis take?", a: <>Most lease agreements are analyzed within 1-2 minutes. Extremely long or complex documents might take slightly longer. Learn more about <Link href="https://www.nolo.com/legal-encyclopedia/tenant-rights" target="_blank" rel="noopener noreferrer" color="primary" sx={{ textDecoration: 'underline' }}>tenant rights at Nolo.com</Link>, a trusted legal resource.</> } ].map((item, index) => (
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

      {/* Admin button hidden temporarily */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
              component={RouterLink} 
              to="/admin" 
              size="small" 
              variant="text"
              color="inherit" // Use subtle color
          >
              Admin Access
          </Button>
      </Box> */}
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

// Lazy-load the heavy interactive component only when visible
function DeferredInteractiveAnalyzer() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldRender) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={containerRef}>
      {shouldRender ? (
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <InteractiveClauseAnalyzer />
        </Suspense>
      ) : null}
    </div>
  );
}

export default LandingPage; 