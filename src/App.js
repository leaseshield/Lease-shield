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
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { ColorModeContext } from './context/ColorModeContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LeaseAnalysis = lazy(() => import('./pages/LeaseAnalysis'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LeaseCalculator = lazy(() => import('./pages/LeaseCalculator'));
const LeaseManager = lazy(() => import('./pages/LeaseManager'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Pricing = lazy(() => import('./pages/Pricing'));
const TrialPage = lazy(() => import('./pages/TrialPage'));
const BlogIndexPage = lazy(() => import('./pages/blog/BlogIndexPage'));
const HowToSpotLeaseScams = lazy(() => import('./pages/blog/HowToSpotLeaseScams'));
const UnderstandingCommonClauses = lazy(() => import('./pages/blog/UnderstandingCommonClauses'));
const NegotiatingLeaseTerms = lazy(() => import('./pages/blog/NegotiatingLeaseTerms'));
const LeaseRedFlags = lazy(() => import('./pages/blog/LeaseRedFlags'));
const TenantRightsOverview = lazy(() => import('./pages/blog/TenantRightsOverview'));
const UsingLeaseShieldAIEffectively = lazy(() => import('./pages/blog/UsingLeaseShieldAIEffectively'));
const UnderstandLeaseIn60Seconds = lazy(() => import('./pages/blog/UnderstandLeaseIn60Seconds'));
const CommercialLease5KeyDifferences = lazy(() => import('./pages/blog/CommercialLease5KeyDifferences'));
const UltimateMoveInChecklist = lazy(() => import('./pages/blog/UltimateMoveInChecklist'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RealEstateAgentPage = lazy(() => import('./pages/RealEstateAgentPage'));
const ExpenseScannerPage = lazy(() => import('./pages/ExpenseScannerPage'));
const PhotoInspectionPage = lazy(() => import('./pages/PhotoInspectionPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AIChat = lazy(() => import('./pages/AIChat'));
const CompliancePage = lazy(() => import('./pages/CompliancePage'));
const Contact = lazy(() => import('./pages/Contact'));

// Build theme dynamically based on color mode
const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366F1',
      light: '#8B5CF6',
      dark: '#4F46E5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
    secondary: {
      main: '#10D9C4',
      light: '#4EDDCF',
      dark: '#0BB5A3',
    },
    accent: {
      electric: '#00FF88',
      neon: '#FF006E',
    },
    background: {
      default: mode === 'dark' ? '#0B1020' : '#F8FAFC',
      paper: mode === 'dark' ? '#0F172A' : '#FFFFFF',
      aurora: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 50%, rgba(240, 147, 251, 0.05) 100%)',
    },
    text: {
      primary: mode === 'dark' ? '#E5E7EB' : '#1F2937',
      secondary: mode === 'dark' ? '#94A3B8' : '#4B5563',
    },
    divider: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(2,6,23,0.12)',
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      soft: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(240,147,251,0.12) 100%)',
    }
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.25 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(12px)',
          backgroundColor: mode === 'dark' ? 'rgba(2,6,23,0.6)' : 'rgba(255,255,255,0.6)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 24px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 36px rgba(0,0,0,0.12)' }
        }
      }
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiContainer: { styleOverrides: { root: { scrollBehavior: 'smooth' } } },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 50%, rgba(240, 147, 251, 0.03) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              fontWeight: 600,
              color: '#6366F1',
              borderBottom: '2px solid rgba(99, 102, 241, 0.2)'
            }
          },
          '& .MuiTableBody-root': {
            '& .MuiTableRow-root': {
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              }
            }
          }
        }
      }
    }
  }
});

// Updated Protected route component
const ProtectedRoute = ({ children, requirePaid = false, requireAdmin = false }) => {
  const { user, loading: authLoading } = useAuthState();
  const location = useLocation();
  const { profile, loadingProfile } = useUserProfile();

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
  if (requireAdmin && user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
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
  const { profile, loadingProfile } = useUserProfile();

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
  const [mode, setMode] = React.useState(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ls-color-mode') : null;
    return stored === 'dark' || stored === 'light' ? stored : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const colorMode = React.useMemo(() => ({
    mode,
    toggleColorMode: () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        try { window.localStorage.setItem('ls-color-mode', next); } catch {}
        return next;
      });
    }
  }), [mode]);
  const theme = React.useMemo(() => buildTheme(mode), [mode]);

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
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <RouteChangeTracker />
          <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}><CircularProgress /></Box>}>
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
            <Route path="/contact" element={
               <Layout showAuthButtons={true}>
                  <Contact />
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
            <Route path="/blog/understand-lease-in-60-seconds" element={
              <Layout showAuthButtons={true}>
                <UnderstandLeaseIn60Seconds />
              </Layout>
            } />
            <Route path="/blog/commercial-lease-5-key-differences" element={
              <Layout showAuthButtons={true}>
                <CommercialLease5KeyDifferences />
              </Layout>
            } />
            <Route path="/blog/ultimate-move-in-checklist" element={
              <Layout showAuthButtons={true}>
                <UltimateMoveInChecklist />
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
                <Layout maxWidth={false}>
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
          </Suspense>
        </Router>
      </ThemeProvider>
      </ColorModeContext.Provider>
    </UserProfileProvider>
  );
}

export default App; 