import React, { useMemo, useState, useContext } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
  Link,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Link as MuiLink,
  ListSubheader
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  Description, 
  Calculate, 
  FolderShared,
  ChevronRight,
  HomeWork,
  ReceiptLong as ReceiptIcon,
  CameraAlt as CameraAltIcon,
  Chat as ChatIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthState } from '../hooks/useAuthState';
import { Helmet } from 'react-helmet-async';
import { ColorModeContext } from '../context/ColorModeContext';

const ColorModeToggle = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';
  return (
    <IconButton
      onClick={colorMode.toggleColorMode}
      color="inherit"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      sx={{ mx: 1 }}
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

const Layout = ({ children, showAuthButtons = false, maxWidth = 'lg' }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuthState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // --- Snackbar State --- 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Function to show snackbar (will be passed down)
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  // --- End Snackbar State ---

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showSnackbar('Successfully signed out', 'info');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      showSnackbar('Error signing out', 'error');
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Restructure menuItems into groups
  const menuGroups = [
    {
      title: 'Main',
      items: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      ]
    },
    {
       title: 'Lease Tools',
       items: [
         { text: 'Lease Analysis', icon: <Description />, path: '/analysis' },
         { text: 'Lease Calculator', icon: <Calculate />, path: '/calculator' },
         { text: 'AI Chat', icon: <ChatIcon />, path: '/ai-chat' },
       ]
    },
    {
       title: 'Property Tools',
       items: [
         { text: 'Tenant Matcher', icon: <HomeWork />, path: '/real-estate-agent' }, // Renamed slightly for clarity
         { text: 'Expense Scanner', icon: <ReceiptIcon />, path: '/expense-scanner' },
         { text: 'Photo Inspector', icon: <CameraAltIcon />, path: '/photo-inspection' },
       ]
    }
    // Add more groups here as needed
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Lease Shield AI
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Divider />
      {/* Update List rendering to handle groups */}
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        // Remove subheader prop if not using a single top-level one
      >
        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={group.title}> 
             {/* Add divider between groups, except before the first one */}
            {groupIndex > 0 && <Divider sx={{ my: 1 }} />}
            <ListSubheader component="div" disableSticky sx={{ bgcolor: 'transparent', lineHeight: '30px' /* Adjust styling */ }}>
              {group.title}
            </ListSubheader>
            {group.items.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ pl: 1 /* Indent items slightly */ }}>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path} 
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
  
  const location = useLocation();
  const canonicalUrl = useMemo(() => {
    const base = 'https://leaseshield.eu';
    return `${base}${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        {/* Optional hreflang example for English EU only; extend if more locales */}
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-us" href={canonicalUrl} />
      </Helmet>
      <AppBar position="sticky" elevation={0} sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(2,6,23,0.6)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'saturate(180%) blur(12px)'
      }}>
        <Toolbar sx={{ minHeight: 72 }}>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            Lease Shield AI
          </Typography>
          
          {/* Add Blog link here */}
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/blog"
            sx={{ 
              mx: 1, // Add some margin
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
            }}
          >
            Blog
          </Button>

          {/* Color mode toggle */}
          <ColorModeToggle />
          
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handleProfileMenuOpen}
                sx={{ marginRight: 1 }}
              >
                <Avatar 
                  alt={user.displayName || user.email} 
                  src={user.photoURL || ''} 
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/profile');
                }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/dashboard');
                }}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}>
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : showAuthButtons && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } 
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                component={RouterLink} 
                to="/register"
                sx={{ 
                  color: 'white',
                  borderRadius: 2
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
      
      <Container component="main" maxWidth={maxWidth} sx={{ flexGrow: 1, py: 4 }}>
        {/* Pass showSnackbar down to children */}
        {/* Use React.cloneElement to add props to children */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { showSnackbar: showSnackbar });
          }
          return child;
        })}
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
            {/* Left side - Company info and contact */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Lease Shield AI
              </Typography>
              
              {/* Contact Information */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <EmailIcon fontSize="small" color="action" />
               <MuiLink href="mailto:contact@leaseshield.eu" color="text.secondary" underline="hover" variant="body2">
                  contact@leaseshield.eu
                </MuiLink>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <PhoneIcon fontSize="small" color="action" />
                <MuiLink href="tel:+31201234567" color="text.secondary" underline="hover" variant="body2">
                  +31 (0) 20 123 4567
                </MuiLink>
              </Box>
              
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Lease Shield AI B.V.<br />
                    Science Park 123,<br />
                    1098 XG Amsterdam, Netherlands
                  </Typography>
                </Box>
              
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Lease Shield AI
              </Typography>
            </Box>
            
            {/* Right side - Links, Newsletter and Social Media */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
              {/* Newsletter mini-form */}
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 360 } }}>
                <input type="email" placeholder="Your email" aria-label="Email for newsletter" style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'transparent', color: 'inherit' }} />
                <Button variant="contained" size="small">Subscribe</Button>
              </Box>
              {/* Navigation Links */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Link href="#" color="inherit" underline="hover">Privacy</Link>
                <Link href="#" color="inherit" underline="hover">Terms</Link>
                <MuiLink component={RouterLink} to="/contact" color="inherit" underline="hover">Contact</MuiLink>
                <MuiLink component={RouterLink} to="/blog" color="inherit" underline="hover">Blog</MuiLink>
              </Box>
              
              {/* Social Media Links */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  href="https://www.facebook.com/leaseshield" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: '#1877F2' } }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  href="https://twitter.com/LeaseShieldAI" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: '#1DA1F2' } }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  href="https://instagram.com/leaseshield" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: '#E4405F' } }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton 
                  href="https://linkedin.com/company/lease-shield-ai" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: '#0077B5' } }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  href="https://www.youtube.com/@leaseshield" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: '#FF0000' } }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Snackbar Component */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom-center
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout; 