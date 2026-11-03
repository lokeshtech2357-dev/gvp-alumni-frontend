import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getStoredAuthToken, logoutUser } from '../services/api';

const AuthContext = createContext(null);

const getTokenExpiry = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(window.atob(payload));
    return Number.isFinite(claims.exp) ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser(token)
      .then((response) => {
        setUser(response.data);
        setSessionExpiresAt(getTokenExpiry(token));
      })
      .catch((error) => {
        if ([401, 403, 404].includes(error.response?.status)) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
        } else {
          console.error('Unable to verify the signed-in user:', error);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!sessionExpiresAt) return undefined;

    const expireSession = () => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      setSessionExpiresAt(null);
    };
    const delay = sessionExpiresAt - Date.now();
    if (delay <= 0) {
      expireSession();
      return undefined;
    }

    const timeoutId = window.setTimeout(expireSession, delay);
    return () => window.clearTimeout(timeoutId);
  }, [sessionExpiresAt]);

  const signIn = useCallback((authResponse) => {
    if (!authResponse?.user) {
      throw new Error('The authentication response did not contain a user.');
    }

    if (authResponse.user.role === 'guest' && authResponse.temporary === true) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setSessionExpiresAt(null);
    } else if (authResponse.token && authResponse.sessionOnly === true) {
      localStorage.removeItem('token');
      sessionStorage.setItem('token', authResponse.token);
      setSessionExpiresAt(getTokenExpiry(authResponse.token));
    } else if (authResponse.token) {
      sessionStorage.removeItem('token');
      localStorage.setItem('token', authResponse.token);
      setSessionExpiresAt(getTokenExpiry(authResponse.token));
    } else {
      throw new Error('The authentication response did not contain a token.');
    }

    setUser(authResponse.user);
  }, []);

  const signOut = useCallback(async () => {
    const token = getStoredAuthToken();
    try {
      if (token) await logoutUser(token);
    } catch (error) {
      console.error('Unable to revoke the server session during sign-out:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      setSessionExpiresAt(null);
      window.google?.accounts?.id?.disableAutoSelect();
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
