// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser,
  googleLoginUser as apiGoogleLoginUser,
  logoutUser as apiLogoutUser 
} from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check active session on app startup
  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await apiLoginUser(credentials);
    if (res && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRegisterUser(userData);
    if (res && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const googleLogin = async (idToken) => {
    const res = await apiGoogleLoginUser(idToken);
    if (res && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiLogoutUser();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
