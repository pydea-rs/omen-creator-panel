import { useState, useEffect } from 'react';

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

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    const token = data.token || data.access_token;

    if (!token) {
      throw new Error('No token received from server');
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