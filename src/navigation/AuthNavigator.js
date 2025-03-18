// src/navigation/AuthNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// App Screens
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { getUserData } from '../services/userService';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Handle user state changes
  const onAuthStateChanged = async (authUser) => {
    setUser(authUser);
    
    if (authUser) {
      // Get user data from Firestore
      const userProfile = await getUserData(authUser.uid);
      setUserData(userProfile);
      setOnboardingComplete(userProfile?.onboardingComplete || false);
    }
    
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Unauthenticated Flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : !onboardingComplete ? (
          // Onboarding Flow
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          // Authenticated Flow
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;