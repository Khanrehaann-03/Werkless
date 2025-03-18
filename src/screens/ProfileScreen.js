// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { getUserProfile, updateUserProfile, uploadResume } from '../services/profileService';
import { signOut } from '../services/authService';
import Button from '../components/common/Button';
import { COLORS, SIZES } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      if (profile.resumeUrl) {
        setResumeFile({ name: 'My Resume' });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        setResumeFile(result);
        
        // Upload the resume
        const resumeUrl = await uploadResume(result.uri, result.name);
        
        // Update user profile with resume URL
        await updateUserProfile({ resumeUrl });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by AuthNavigator
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileCard}>
        <Image 
          source={userProfile?.photoUrl ? { uri: userProfile.photoUrl } : require('../assets/default-avatar.png')} 
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userProfile?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{userProfile?.email}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resume</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickResume}>
          <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
          <Text style={styles.uploadText}>
            {resumeFile ? 'Change Resume' : 'Upload Resume'}
          </Text>
        </TouchableOpacity>
        
        {resumeFile && (
          <View style={styles.fileCard}>
            <Ionicons name="document-text-outline" size={24} color={COLORS.text} />
            <Text style={styles.fileName}>{resumeFile.name}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.settingText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.settingText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.settingText}>Subscription Plan</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Free</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Button 
        title="Sign Out" 
        onPress={handleSignOut}
        containerStyle={styles.signOutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  screenTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: `${COLORS.primary}10`,
    marginBottom: 16,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.text}10`,
    borderRadius: 12,
    padding: 12,
  },
  fileName: {
    marginLeft: 12,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.text}10`,
  },
  settingText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: SIZES.xSmall,
    color: COLORS.card,
    fontWeight: '600',
  },
  signOutButton: {
    margin: 16,
    marginBottom: 32,
    backgroundColor: '#FF3B30',
  },
});

export default ProfileScreen;