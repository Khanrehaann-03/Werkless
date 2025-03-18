// src/screens/CoverLetterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { generateCoverLetter } from '../services/aiService';
import Button from '../components/common/Button';
import { COLORS, SIZES } from '../constants/theme';

const CoverLetterScreen = ({ route, navigation }) => {
  const { jobData, userResume } = route.params;
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [editedCoverLetter, setEditedCoverLetter] = useState('');
  
  useEffect(() => {
    generateInitialCoverLetter();
  }, []);
  
  const generateInitialCoverLetter = async () => {
    try {
      setIsGenerating(true);
      const generatedLetter = await generateCoverLetter(userResume, jobData);
      setCoverLetter(generatedLetter);
      setEditedCoverLetter(generatedLetter);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setIsGenerating(false);
    }
  };
  
  const handleRegenerateLetter = () => {
    generateInitialCoverLetter();
  };
  
  const handleSaveLetter = async () => {
    // Save letter to user's profile
    // Navigate to application confirmation
    navigation.navigate('ApplicationConfirmation', {
      jobData,
      coverLetter: editedCoverLetter
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cover Letter</Text>
      <Text style={styles.subtitle}>
        {jobData.title} at {jobData.company}
      </Text>
      
      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating your personalized cover letter...</Text>
        </View>
      ) : (
        <ScrollView style={styles.letterContainer}>
          <TextInput
            style={styles.letterInput}
            multiline
            value={editedCoverLetter}
            onChangeText={setEditedCoverLetter}
            placeholder="Your cover letter will appear here"
          />
        </ScrollView>
      )}
      
      <View style={styles.buttonsContainer}>
        <Button 
          title="Regenerate" 
          onPress={handleRegenerateLetter} 
          containerStyle={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
          disabled={isGenerating}
        />
        <Button 
          title="Save & Apply" 
          onPress={handleSaveLetter} 
          disabled={isGenerating || !editedCoverLetter}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  letterContainer: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  letterInput: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default CoverLetterScreen;