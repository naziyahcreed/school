import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuth,
  getHomePathForRole,
  login as apiLogin,
  normalizeSession,
  readStoredAuth,
  saveAuth,
} from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredAuth());
  const navigate = useNavigate();

  const login = useCallback(
    async (username, password) => {
      const result = await apiLogin(username, password);
      const next = normalizeSession({ token: result.access_token, user: result.user });
      if (!next?.user?.role) {
        throw new Error('Login failed — user profile missing. Try again or clear browser storage.');
      }
      saveAuth(next);
      setSession(next);
      navigate(getHomePathForRole(next.user.role), { replace: true });
      return next.user;
    },
    [navigate],
  );

  const logout = useCallback(() => {
    clearAuth();
    setSession(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: !!(session?.token && session?.user?.role),
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
