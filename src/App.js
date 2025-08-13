import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthState } from './hooks/useAuthState';
import { useUserProfile } from './context/UserProfileContext';
import ReactGA from 'react-ga4';
import { UserProfileProvider } from './context/UserProfileContext';
import { Box, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { getApiBaseUrl } from './utils/api';

// Pages
import Layout from './components/Layout';
import { ColorModeContext } from './context/ColorModeContext';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import buildTheme from './theme';
import { AppRoutes } from './routes';

const debugLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// Build theme dynamically based on color mode


// --- Initialize Google Analytics --- 
const MEASUREMENT_ID = "G-Z9S1H13X0T"; // Your Measurement ID
ReactGA.initialize(MEASUREMENT_ID);
debugLog("Google Analytics Initialized with ID:", MEASUREMENT_ID);
// --- End GA Init ---

// --- Component to Track Route Changes --- 
const RouteChangeTracker = () => {
  const location = useLocation();

  // Log the initial location when the component mounts
  useEffect(() => {
      debugLog(`RouteChangeTracker: Initial location on mount: ${location.pathname}${location.search}`);
  }, []); // Empty dependency array runs only once on mount

  useEffect(() => {
    // Send pageview with path and title
    const pagePath = location.pathname + location.search;
    // Don't send GA event if path is just /index.html - it might be transitional
    if (pagePath !== '/index.html') {
        ReactGA.send({ hitType: "pageview", page: pagePath, title: document.title });
        debugLog(`GA Pageview Sent: ${pagePath}`);
    } else {
        debugLog(`GA Pageview Skipped for path: ${pagePath}`);
    }
  }, [location]);

  return null; // This component does not render anything
};
// --- End Route Change Tracker ---

function App() {
  // Log when App component mounts
  debugLog("App component mounted.");
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
      let apiUrl;
      try {
        apiUrl = getApiBaseUrl();
      } catch {
        return;
      }
      if (!apiUrl || apiUrl === 'http://localhost:8081') {
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/ping`);
        if (!response.ok) {
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
          <RouteErrorBoundary>
            <AppRoutes />
          </RouteErrorBoundary>
        </Router>
      </ThemeProvider>
      </ColorModeContext.Provider>
    </UserProfileProvider>
  );
}

export default App; 