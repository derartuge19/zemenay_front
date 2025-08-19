"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Session = {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
} | null;

type AuthContextType = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthor: boolean;
  isEditor: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ user: any, error: any }>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [session, setSessionState] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Initialize API client token
          const { apiClient } = await import('@/lib/api-client');
          apiClient.setToken(token);
          
          // If we have a token, try to get the user profile
          const response = await fetch('http://localhost:3001/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for cookies
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setSessionState({
              access_token: token,
              user: userData
            });
          } else {
            // If the token is invalid, clear it
            localStorage.removeItem('access_token');
            setUser(null);
            setSessionState(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('access_token');
        setUser(null);
        setSessionState(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Role helpers
  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.role === 'author' || isAdmin; // Admins can also be authors
  const isEditor = user?.role === 'editor' || isAdmin; // Admins can also be editors

  const setSession = async (newSession: Session | null) => {
    setSessionState(newSession);
    
    // Import the apiClient
    const { apiClient } = await import('@/lib/api-client');
    
    if (newSession?.access_token) {
      localStorage.setItem('access_token', newSession.access_token);
      apiClient.setToken(newSession.access_token);
    } else {
      localStorage.removeItem('access_token');
      apiClient.setToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      });
      setUser(data.user);

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after registration
      const loginResult = await login(email, password);
      if (loginResult.error) {
        throw new Error('Registration successful but login failed');
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      localStorage.removeItem('access_token');
      setSession(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        isAuthor,
        isEditor,
        login,
        signUp,
        signOut,
        setSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
