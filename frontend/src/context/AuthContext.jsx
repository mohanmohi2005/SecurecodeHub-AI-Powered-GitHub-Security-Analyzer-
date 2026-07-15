import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Get the backend API URL from env, default to local port 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const savedUser = localStorage.getItem('securecodehub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('securecodehub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('securecodehub_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Try a different email.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('securecodehub_user');
  };

  const deleteAccount = async (userId) => {
    try {
      await axios.delete(`${API_URL}/delete-account/${userId}`);
      logout();
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete account.';
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
