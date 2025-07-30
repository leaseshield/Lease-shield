import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthState } from './hooks/useAuthState';
import { useUserProfile } from './context/UserProfileContext';
import ReactGA from 'react-ga4';
import { UserProfileProvider } from './context/UserProfileContext';
import { Box, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeaseAnalysis from './pages/LeaseAnalysis';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import LeaseCalculator from './pages/LeaseCalculator';
import LeaseManager from './pages/LeaseManager';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import TrialPage from './pages/TrialPage';
import BlogIndexPage from './pages/blog/BlogIndexPage';
import HowToSpotLeaseScams from './pages/blog/HowToSpotLeaseScams';
import UnderstandingCommonClauses from './pages/blog/UnderstandingCommonClauses';
import NegotiatingLeaseTerms from './pages/blog/NegotiatingLeaseTerms';
import LeaseRedFlags from './pages/blog/LeaseRedFlags';
import TenantRightsOverview from './pages/blog/TenantRightsOverview';
import UsingLeaseShieldAIEffectively from './pages/blog/UsingLeaseShieldAIEffectively';
import AdminPage from './pages/AdminPage';
import RealEstateAgentPage from './pages/RealEstateAgentPage';
import ExpenseScannerPage from './pages/ExpenseScannerPage';
import PhotoInspectionPage from './pages/PhotoInspectionPage';
import DashboardPage from './pages/DashboardPage';
import AIChat from './pages/AIChat';
import CompliancePage from './pages/CompliancePage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
    secondary: {
      main: '#10d9c4', // Electric teal accent
      light: '#4eddcf',
      dark: '#0bb5a3',
    },
    accent: {
      electric: '#00ff88', // Vibrant green for CTAs
      neon: '#ff006e', // Electric pink
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      aurora: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 50%, rgba(240, 147, 251, 0.05) 100%)',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Updated Protected route component
const ProtectedRoute = ({ children, requirePaid = false, requireAdmin = false }) => {
  const { user, loading: authLoading } = useAuthState();
  const location = useLocation();

  // Always call useUserProfile at the top level
  const { profile, loadingProfile } = useUserProfile() || { profile: null, loadingProfile: true }; 

  // Log initial state
  console.log(`ProtectedRoute (${location.pathname}): Start. AuthLoading=${authLoading}, ProfileLoading=${loadingProfile}, User? ${!!user}, RequirePaid=${requirePaid}, RequireAdmin=${requireAdmin}`);

  // 1. Wait for Firebase Auth initialization
  if (authLoading) {
    console.log(`ProtectedRoute (${location.pathname}): Auth loading...`);
    // Use CircularProgress for loading state
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Check if user is logged in (Auth is initialized now)
  if (!user) {
    console.log(`ProtectedRoute (${location.pathname}): No user after auth load. Redirecting to /login.`);
    return <Navigate to="/login" replace />;
  }

  // 3. Check if requireAdmin is true and user email matches
  if (requireAdmin && user.email !== 'leofratu@gmail.com') {
    console.log(`ProtectedRoute (${location.pathname}): Admin check failed (User: ${user.email}). Redirecting to /dashboard.`);
    // Redirect non-admins away, perhaps to the main dashboard or home
    return <Navigate to="/dashboard" replace />; 
  }
  console.log(`ProtectedRoute (${location.pathname}): Admin check passed or not required.`);

  // 4. If requirePaid is true, handle profile loading and tier check
  if (requirePaid) {
      console.log(`ProtectedRoute (${location.pathname}): Paid route check. ProfileLoading=${loadingProfile}, Tier=${profile?.subscriptionTier}`);
      // Wait for profile if it's still loading
      if (loadingProfile) {
         console.log(`ProtectedRoute (${location.pathname}): Paid route, profile loading...`);
         // Use CircularProgress for loading state
         return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress />
            </Box>
         );
      }
      // Profile loaded, check tier
      // Accept any paid-level tier (legacy 'paid', new 'pro', or 'commercial')
      const paidTiers = ['paid', 'pro', 'commercial'];
      if (!profile || !paidTiers.includes(profile.subscriptionTier)) {
         console.log(`ProtectedRoute (${location.pathname}): Paid route, profile check failed (Tier: ${profile?.subscriptionTier}). Redirecting to /pricing.`);
         return <Navigate to="/pricing" replace />;
      }
      console.log(`ProtectedRoute (${location.pathname}): Paid route check passed.`);
  }

  // 5. If we reach here, access is granted
  console.log(`ProtectedRoute (${location.pathname}): Access granted. Rendering children (User: ${user.uid}).`);
  return children;
};

// Component to handle conditional rendering/redirect for the /trial route
const TrialRouteHandler = () => {
  const { user, loading: authLoading } = useAuthState();
  const { profile, loadingProfile } = useUserProfile() || { profile: null, loadingProfile: true };

  console.log(`TrialRouteHandler: AuthLoading=${authLoading}, ProfileLoading=${loadingProfile}, User? ${!!user}, Tier=${profile?.subscriptionTier}`);

  if (authLoading || loadingProfile) {
    console.log("TrialRouteHandler: Waiting for auth/profile...");
    // Use CircularProgress for loading state
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect away only if user has a paid ('pro') or 'commercial' plan
  const tier = profile?.subscriptionTier;
  if (user && (tier === 'pro' || tier === 'commercial' || tier === 'paid')) { // Check for pro, commercial, and legacy paid
    console.log(`TrialRouteHandler: User is logged in with tier '${tier}', redirecting to dashboard.`);
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise (not logged in, or logged in with 'free' tier), show the TrialPage
  console.log(`TrialRouteHandler: Showing TrialPage (User? ${!!user}, Tier=${tier})`);
  return (
    <Layout showAuthButtons={true}>
      <TrialPage />
    </Layout>
  );
};

// --- Initialize Google Analytics --- 
const MEASUREMENT_ID = "G-Z9S1H13X0T"; // Your Measurement ID
ReactGA.initialize(MEASUREMENT_ID);
console.log("Google Analytics Initialized with ID:", MEASUREMENT_ID);
// --- End GA Init ---

// --- Component to Track Route Changes --- 
const RouteChangeTracker = () => {
  const location = useLocation();

  // Log the initial location when the component mounts
  useEffect(() => {
      console.log(`RouteChangeTracker: Initial location on mount: ${location.pathname}${location.search}`);
  }, []); // Empty dependency array runs only once on mount

  useEffect(() => {
    // Send pageview with path and title
    const pagePath = location.pathname + location.search;
    // Don't send GA event if path is just /index.html - it might be transitional
    if (pagePath !== '/index.html') {
        ReactGA.send({ hitType: "pageview", page: pagePath, title: document.title });
        console.log(`GA Pageview Sent: ${pagePath}`);
    } else {
        console.log(`GA Pageview Skipped for path: ${pagePath}`);
    }
  }, [location]);

  return null; // This component does not render anything
};
// --- End Route Change Tracker ---

function App() {
  // Log when App component mounts
  console.log("App component mounted.");

  // --- Backend Pinger --- 
  useEffect(() => {
    const pingBackend = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
      if (!apiUrl || apiUrl === 'http://localhost:8081') {
        // Don't ping if no deployed URL or if it's just localhost
        // console.log('Skipping backend ping for local development.');
        return; 
      }
      try {
        const response = await fetch(`${apiUrl}/api/ping`);
        if (response.ok) {
          // console.log('Backend ping successful');
        } else {
          console.warn('Backend ping failed:', response.status);
        }
      } catch (error) {
        console.error('Error pinging backend:', error);
      }
    };

    // Ping immediately on load (optional, helps wake it up initially)
    // pingBackend(); 

    // Set interval to ping every 7 minutes (420000 milliseconds)
    const intervalId = setInterval(pingBackend, 7 * 60 * 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []); // Empty dependency array ensures this runs only once on mount
  // --- End Backend Pinger ---

  return (
    <UserProfileProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <RouteChangeTracker />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <Layout showAuthButtons={true}>
                <LandingPage />
              </Layout>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={
               <Layout showAuthButtons={true}>
                  <Pricing />
               </Layout>
            } />
            <Route path="/trial" element={<TrialRouteHandler />} />
            
            {/* Public Blog Routes */}
            <Route path="/blog" element={
              <Layout showAuthButtons={true}>
                <BlogIndexPage />
              </Layout>
            } />
            <Route path="/blog/how-to-spot-lease-scams" element={
              <Layout showAuthButtons={true}>
                <HowToSpotLeaseScams />
              </Layout>
            } />
             <Route path="/blog/understanding-common-clauses" element={
              <Layout showAuthButtons={true}>
                <UnderstandingCommonClauses />
              </Layout>
            } />
             <Route path="/blog/negotiating-lease-terms" element={
              <Layout showAuthButtons={true}>
                <NegotiatingLeaseTerms />
              </Layout>
            } />
             <Route path="/blog/lease-red-flags" element={
              <Layout showAuthButtons={true}>
                <LeaseRedFlags />
              </Layout>
            } />
             <Route path="/blog/tenant-rights-overview" element={
              <Layout showAuthButtons={true}>
                <TenantRightsOverview />
              </Layout>
            } />
            <Route path="/blog/using-lease-shield-ai-effectively" element={
              <Layout showAuthButtons={true}>
                <UsingLeaseShieldAIEffectively />
              </Layout>
            } />
            {/* END Public Blog Routes */}
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <Layout>
                  <LeaseAnalysis />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analysis/:leaseId" element={
              <ProtectedRoute>
                <Layout>
                  <LeaseAnalysis />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/calculator" element={
              <ProtectedRoute>
                <Layout>
                  <LeaseCalculator />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/manager" element={
              <ProtectedRoute requirePaid={true}>
                <Layout>
                  <LeaseManager />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/real-estate-agent" element={
              <ProtectedRoute>
                <Layout>
                  <RealEstateAgentPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/expense-scanner" element={
              <ProtectedRoute>
                <Layout>
                  <ExpenseScannerPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/photo-inspection" element={
              <ProtectedRoute>
                <Layout>
                  <PhotoInspectionPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-chat" element={
              <ProtectedRoute>
                <Layout>
                  <AIChat />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/compliance" element={
              <ProtectedRoute requirePaid={true}>
                <Layout>
                  <CompliancePage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin Route - Protected by login, authorization checked inside AdminPage */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProfileProvider>
  );
}

export default App; 