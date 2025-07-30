import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { useUserProfile } from '../context/UserProfileContext';

export const useCommercialAnalytics = () => {
  const { user } = useAuthState();
  const { profile } = useUserProfile();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || profile?.subscriptionTier !== 'commercial') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = await user.getIdToken();
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
        const response = await fetch(`${apiUrl}/api/commercial/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, profile]);

  return { analytics, loading, error };
};
