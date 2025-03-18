// src/Navigation.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import JobsScreen from './screens/JobsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import SavedJobsScreen from './screens/SavedJobsScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Import auth context
import { useAuth } from './hooks/useAuth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const JobsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="JobsList" component={JobsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Jobs') {
          iconName = focused ? 'briefcase' : 'briefcase-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        } else if (route.name === 'Saved') {
          iconName = focused ? 'bookmark' : 'bookmark-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#5C67DE',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Jobs" component={JobsStack} options={{ headerShown: false }} />
    <Tab.Screen name="Messages" component={MessagesScreen} />
    <Tab.Screen name="Saved" component={SavedJobsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;