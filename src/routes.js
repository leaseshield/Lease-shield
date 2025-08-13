import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/Layout';
import { useAuthState } from './hooks/useAuthState';
import { useUserProfile } from './context/UserProfileContext';

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
const PaymentSuccess = lazy(() => import('./pages/payment/Success'));
const PaymentCancel = lazy(() => import('./pages/payment/Cancel'));

const ProtectedRoute = ({ children, requirePaid = false, requireAdmin = false }) => {
  const { user, loading: authLoading } = useAuthState();
  const location = useLocation();
  const { profile, loadingProfile } = useUserProfile();
  const debugLog = (...args) => { if (process.env.NODE_ENV === 'development') console.log(...args); };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requirePaid) {
    if (loadingProfile) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    const tier = profile?.subscriptionTier;
    if (!['paid', 'pro', 'commercial'].includes(tier)) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return children;
};

const TrialRouteHandler = () => {
  const { user, loading: authLoading } = useAuthState();
  const { profile, loadingProfile } = useUserProfile();
  const debugLog = (...args) => { if (process.env.NODE_ENV === 'development') console.log(...args); };

  if (authLoading || loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user && profile?.subscriptionTier) {
    return <Navigate to="/dashboard" replace />;
  }

  return <TrialPage />;
};

export const AppRoutes = () => (
  <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}><CircularProgress /></Box>}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout showAuthButtons={true}><LandingPage /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Layout showAuthButtons={true}><Pricing /></Layout>} />
      <Route path="/contact" element={<Layout showAuthButtons={true}><Contact /></Layout>} />
      <Route path="/trial" element={<TrialRouteHandler />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard2" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute><Layout><LeaseAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/analysis/:leaseId" element={<ProtectedRoute><Layout><LeaseAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/calculator" element={<ProtectedRoute><Layout><LeaseCalculator /></Layout></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute requirePaid={true}><Layout><LeaseManager /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/agent" element={<ProtectedRoute requirePaid={true}><Layout><RealEstateAgentPage /></Layout></ProtectedRoute>} />
      <Route path="/scan-expense" element={<ProtectedRoute requirePaid={true}><Layout><ExpenseScannerPage /></Layout></ProtectedRoute>} />
      <Route path="/inspect-photos" element={<ProtectedRoute requirePaid={true}><Layout><PhotoInspectionPage /></Layout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Layout><AIChat /></Layout></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute requireAdmin={true}><Layout><CompliancePage /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Layout><AdminPage /></Layout></ProtectedRoute>} />

      {/* Blog routes */}
      <Route path="/blog" element={<Layout><BlogIndexPage /></Layout>} />
      <Route path="/blog/how-to-spot-lease-scams" element={<Layout><HowToSpotLeaseScams /></Layout>} />
      <Route path="/blog/understanding-common-clauses" element={<Layout><UnderstandingCommonClauses /></Layout>} />
      <Route path="/blog/negotiating-lease-terms" element={<Layout><NegotiatingLeaseTerms /></Layout>} />
      <Route path="/blog/lease-red-flags" element={<Layout><LeaseRedFlags /></Layout>} />
      <Route path="/blog/tenant-rights-overview" element={<Layout><TenantRightsOverview /></Layout>} />
      <Route path="/blog/using-lease-shield-ai-effectively" element={<Layout><UsingLeaseShieldAIEffectively /></Layout>} />
      <Route path="/blog/understand-lease-in-60-seconds" element={<Layout><UnderstandLeaseIn60Seconds /></Layout>} />
      <Route path="/blog/commercial-lease-5-key-differences" element={<Layout><CommercialLease5KeyDifferences /></Layout>} />
      <Route path="/blog/ultimate-move-in-checklist" element={<Layout><UltimateMoveInChecklist /></Layout>} />

      {/* Payment routes */}
      <Route path="/payment/success" element={<Layout><PaymentSuccess /></Layout>} />
      <Route path="/payment/cancel" element={<Layout><PaymentCancel /></Layout>} />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  </Suspense>
);
