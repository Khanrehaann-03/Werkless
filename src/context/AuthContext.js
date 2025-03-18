// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../config/firebase';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (userData) => {
      if (userData) {
        // Get additional user data from Firestore
        const userDoc = await firestore.collection('users').doc(userData.uid).get();
        const userProfile = userDoc.data();
        
        setUser({
          uid: userData.uid,
          email: userData.email,
          ...userProfile
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, userData) => {
    try {
      setIsLoading(true);
      const response = await auth.createUserWithEmailAndPassword(email, password);
      
      // Create user profile in Firestore
      await firestore.collection('users').doc(response.user.uid).set({
        name: userData.name,
        email,
        createdAt: new Date(),
        ...userData
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};