'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('AuthProvider - Initializing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - useEffect triggered');
    // Check for existing session
    const userCookie = Cookies.get('user');
    if (userCookie) {
      console.log('AuthProvider - User cookie found');
      setUser(JSON.parse(userCookie));
    } else {
      console.log('AuthProvider - No user cookie found');
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('AuthProvider - SignIn attempt');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('AuthProvider - SignIn response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Set cookie with user data and token
      Cookies.set('user', JSON.stringify(data.user), { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Save the token
      Cookies.set('token', data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      setUser(data.user);
      console.log('AuthProvider - User set after signIn:', data.user);
    } catch (error) {
      console.error('AuthProvider - SignIn error:', error);
      throw error;
    }
  };

  const signUp = async (username: string, password: string) => {
    console.log('AuthProvider - SignUp attempt');
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('AuthProvider - SignUp response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Set cookie with user data
      Cookies.set('user', JSON.stringify(data.user), { 
        expires: 7, // Cookie expires in 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      setUser(data.user);
      console.log('AuthProvider - User set after signUp:', data.user);
    } catch (error) {
      console.error('AuthProvider - SignUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('AuthProvider - SignOut called');
    Cookies.remove('user');
    Cookies.remove('token'); // Also remove the token on sign out
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.isAdmin || false
  };

  console.log('AuthProvider - Current state:', { user, loading });
  return (
    <AuthContext.Provider value={value}>
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