// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, checkAuth } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize - check if user is logged in via token in AsyncStorage
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const userData = await checkAuth(storedToken);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        // Invalid token or other error, clear storage
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const loginUser = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user } = await login(email, password);
      
      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const registerUser = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user } = await register(userData);
      
      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update user profile
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    loginUser,
    registerUser,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};