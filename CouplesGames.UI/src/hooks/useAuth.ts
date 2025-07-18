import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './../lib/firebase';
import { logger } from '../utils/logger';

// Custom hook for authentication state, with error handling and logging.
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const idToken = await user.getIdToken();
          setToken(idToken);
        } else {
          setToken(null);
        }
        setError(null);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        logger.error(errorObj, {
          component: 'useAuth',
          action: 'onAuthStateChanged'
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      setUser(null);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error(errorObj, {
        component: 'useAuth',
        action: 'logout'
      });
    }
  };

  return { user, loading, logout, token, error };
};
