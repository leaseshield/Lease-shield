import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { db } from '../firebase/config';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { user } = useAuthState();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    console.log("UserProfileContext: useEffect triggered.", { userId: user?.uid });
    let unsubscribe = () => {};

    if (user) {
      setLoadingProfile(true);
      const userRef = doc(db, 'users', user.uid);
      
      unsubscribe = onSnapshot(userRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            console.log("UserProfileContext: Profile snapshot received (exists):", profileData);
            setProfile(profileData);
          } else {
            console.log("UserProfileContext: No profile document found. Assuming default free tier.");
            setProfile({ subscriptionTier: 'free', freeScansUsed: 0 }); // Assume free default if not found
          }
          setLoadingProfile(false);
        }, 
        (error) => {
          console.error("UserProfileContext: Error in onSnapshot listener:", error);
          setProfile(null);
          setLoadingProfile(false);
        }
      );
    } else {
      // No user, clear profile
      console.log("UserProfileContext: No user logged in. Resetting profile.");
      setProfile(null);
      setLoadingProfile(false);
    }

    // Cleanup listener on component unmount or if user changes.
    return () => {
        console.log("UserProfileContext: Cleaning up profile listener.");
        unsubscribe();
    };
  }, [user]); // Re-run effect when user auth state changes

  return (
    <UserProfileContext.Provider value={{ profile, loadingProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext); 