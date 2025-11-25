'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/admin';
import apiClient from '@/utils/admin/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    // Check for existing authentication by trying to fetch user data
    const checkAuth = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        if (isMounted && response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // User is not authenticated or session expired
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          // Add minimum loading time to prevent flickering
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 100);
        }
      }
    };
    
    // Add a small delay to prevent race conditions in development
    const timeoutId = setTimeout(checkAuth, 10);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookies
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token: null, // No longer using token in frontend
      login,
      logout,
      isLoading: isLoading || !isInitialized
    }}>
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