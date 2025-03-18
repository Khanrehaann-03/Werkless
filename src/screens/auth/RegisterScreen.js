// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const buttonScale = new Animated.Value(1);
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
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
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.displayName) newErrors.displayName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleRegister = async () => {
    if (!validate()) return;
    
    animateButton();
    setLoading(true);
    
    try {
      await registerUser(formData.email, formData.password, {
        displayName: formData.displayName
      });
      // Navigation will be handled by AuthNavigator
    } catch (error) {
      setErrors({
        ...errors,
        form: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Find your dream job with AI</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Display Name Input */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'displayName' && styles.inputContainerFocused,
            errors.displayName && styles.inputContainerError
          ]}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.displayName}
              onChangeText={(text) => handleChange('displayName', text)}
              autoCapitalize="words"
              onFocus={() => setFocusedInput('displayName')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          {errors.displayName && (
            <Text style={styles.errorText}>{errors.displayName}</Text>
          )}
          
          {/* Email Input */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'email' && styles.inputContainerFocused,
            errors.email && styles.inputContainerError
          ]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          
          {/* Password Input */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'password' && styles.inputContainerFocused,
            errors.password && styles.inputContainerError
          ]}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* Confirm Password Input */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'confirmPassword' && styles.inputContainerFocused,
            errors.confirmPassword && styles.inputContainerError
          ]}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          {/* Submit Button */}
          <Animated.View 
            style={{
              transform: [{ scale: buttonScale }]
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {errors.form && (
            <Text style={styles.formError}>{errors.form}</Text>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => {/* Implement Google Login */}}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.socialButton, styles.linkedinButton]}
              onPress={() => {/* Implement LinkedIn Login */}}
            >
              <Text style={styles.socialButtonText}>Continue with LinkedIn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text 
                style={styles.footerLink}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    padding: 24,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputContainerFocused: {
    borderColor: '#4B7BEC',
    shadowColor: '#4B7BEC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#FF5252',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#4B7BEC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formError: {
    color: '#FF5252',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    gap: 16,
  },
  socialButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  googleButton: {
    borderColor: '#DADCE0',
  },
  linkedinButton: {
    borderColor: '#0077B5',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    color: '#4B7BEC',
    fontWeight: '500',
  },
});

export default RegisterScreen;