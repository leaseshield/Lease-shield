import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let hasMounted = true; // Flag to track mounted status
    console.log("useAuthState: Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!hasMounted) return; // Prevent state update on unmounted component
        console.log("useAuthState: onAuthStateChanged fired.");
        if (user) {
          console.log("useAuthState: User found", user.uid);
          setUser(user);
        } else {
          console.log("useAuthState: No user found.");
          setUser(null);
        }
        console.log("useAuthState: Setting loading to false.");
        setLoading(false);
      },
      (error) => {
        if (!hasMounted) return; // Prevent state update on unmounted component
        console.error("useAuthState: onAuthStateChanged error:", error);
        setError(error);
        console.log("useAuthState: Setting loading to false after error.");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      console.log("useAuthState: Cleaning up onAuthStateChanged listener.");
      hasMounted = false; // Set flag to false on unmount
      unsubscribe();
    };
  }, []);

  // Log state changes (optional, can be noisy)
  // useEffect(() => {\n  //   console.log(\`useAuthState: State updated - Loading: ${loading}, User UID: ${user?.uid}, Error: ${error}\`);\n  // }, [user, loading, error]);\n

  return { user, loading, error };
}; 