// src/screens/auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { loginUser, loginWithGoogle } from '../../services/authService';
import { LinearGradient } from 'expo-linear-gradient';

// Required for Google OAuth flow
WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const buttonScale = new Animated.Value(1);
  
  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });
  
  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Handle Google authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);
  
  // Email/Password login
  const handleLogin = async () => {
    if (!email || !password) {
      // Show inline validation instead of alert
      return;
    }
    
    animateButton();
    
    try {
      setLoading(true);
      await loginUser(email, password);
      // Navigation will be handled by the AuthNavigator based on auth state
    } catch (error) {
      // Show inline error
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Google login
  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);
      await loginWithGoogle(idToken);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.subGreeting}>Sign in to continue</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={[
          styles.inputContainer,
          focusedInput === 'email' && styles.inputContainerFocused
        ]}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#8A8A8E"
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
        
        <View style={[
          styles.inputContainer,
          focusedInput === 'password' && styles.inputContainerFocused
        ]}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#8A8A8E"
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => promptAsync()}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../../assets/google-icon.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleLinkedInLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../../assets/linkedin-icon.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: '#8A8A8E',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  inputContainerFocused: {
    borderColor: '#4CD964', // Green accent color
  },
  inputLabel: {
    fontSize: 12,
    color: '#8A8A8E',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4CD964',
  },
  loginButton: {
    backgroundColor: '#4CD964',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    fontSize: 14,
    color: '#8A8A8E',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 15,
    color: '#8A8A8E',
    marginRight: 4,
  },
  signupText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CD964',
  },
});