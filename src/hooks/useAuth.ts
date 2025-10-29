import { useState, useEffect } from 'react';
import { doLogin } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true,
  });

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken');
    setAuthState({
      isAuthenticated: !!token,
      token,
      loading: false,
    });
  }, []);

  const login = async (baseURL: string, username: string, password: string) => {
    const token = await doLogin(baseURL, { username, password })

    if (!token?.length) {
      throw new Error('Login failed!');
    }

    localStorage.setItem('authToken', token);
    setAuthState({
      isAuthenticated: true,
      token,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}