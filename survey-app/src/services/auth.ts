import { setToken, removeToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api';

interface SignInResponse {
  token: string;
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

interface SignUpResponse {
  token: string;
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

export const authService = {
  async signIn(username: string, password: string): Promise<SignInResponse> {
    console.log('Attempting sign in with:', { username });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Sign in error:', error);
        throw new Error(error.error || 'Failed to sign in');
      }

      const data = await response.json();
      console.log('Sign in successful:', data);
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signUp(username: string, password: string): Promise<SignUpResponse> {
    console.log('Attempting sign up with:', { username });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Sign up error:', error);
        throw new Error(error.error || 'Failed to sign up');
      }

      const data = await response.json();
      console.log('Sign up successful:', data);
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    console.log('Attempting sign out');
    try {
      // First, call the backend to invalidate the session
      const response = await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Sign out error:', error);
        throw new Error(error.error || 'Failed to sign out');
      }

      // Then, clear all cookies on the frontend
      console.log('Clearing all cookies');
      removeToken();

      // Wait a brief moment to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
}; 