// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import JobSwipeScreen from '../screens/JobSwipeScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import CoverLetterScreen from '../screens/CoverLetterScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ApplicationDetailScreen from '../screens/ApplicationDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import StatsScreen from '../screens/StatsScreen';

import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create individual stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
  </Stack.Navigator>
);

const JobsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="JobSwipe" component={JobSwipeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    <Stack.Screen name="CoverLetter" component={CoverLetterScreen} options={{ title: 'Cover Letter' }} />
  </Stack.Navigator>
);

const ApplicationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Applications" component={ApplicationsScreen} options={{ title: 'My Applications' }} />
    <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} options={{ title: 'Application Details' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
    <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Subscription Plans' }} />
    <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'My Stats' }} />
  </Stack.Navigator>
);

// Main tab navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Applications') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Applications" component={ApplicationsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;