'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TokenAuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const TokenAuthContext = createContext<TokenAuthContextType | undefined>(undefined);

export function TokenAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check token on mount
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');
      
      if (storedToken && storedUsername) {
        setToken(storedToken);
        setUsername(storedUsername);
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const uname = username.trim().toLowerCase();
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', uname);
      setToken(data.token);
      setUsername(uname);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const uname = username.trim().toLowerCase();
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', uname);
      setToken(data.token);
      setUsername(uname);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  return (
    <TokenAuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </TokenAuthContext.Provider>
  );
}

export function useTokenAuth() {
  const context = useContext(TokenAuthContext);
  if (!context) {
    throw new Error('useTokenAuth must be used within TokenAuthProvider');
  }
  return context;
}
