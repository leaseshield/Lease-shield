import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// Simple dev-only logging helpers
const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const devError = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let hasMounted = true; // Flag to track mounted status
    devLog("useAuthState: Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!hasMounted) return; // Prevent state update on unmounted component
        devLog("useAuthState: onAuthStateChanged fired.");
        if (user) {
          devLog("useAuthState: User found", user.uid);
          setUser(user);
        } else {
          devLog("useAuthState: No user found.");
          setUser(null);
        }
        devLog("useAuthState: Setting loading to false.");
        setLoading(false);
      },
      (error) => {
        if (!hasMounted) return; // Prevent state update on unmounted component
        devError("useAuthState: onAuthStateChanged error:", error);
        setError(error);
        devLog("useAuthState: Setting loading to false after error.");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      devLog("useAuthState: Cleaning up onAuthStateChanged listener.");
      hasMounted = false; // Set flag to false on unmount
      unsubscribe();
    };
  }, []);

  // Log state changes (optional, can be noisy)
  // useEffect(() => {\n  //   console.log(\`useAuthState: State updated - Loading: ${loading}, User UID: ${user?.uid}, Error: ${error}\`);\n  // }, [user, loading, error]);\n

  return { user, loading, error };
}; 