// src/screens/SubscriptionScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { COLORS, SIZES } from '../constants/theme';

const SubscriptionScreen = () => {
  const handleSubscribe = (plan) => {
    // Implement subscription logic with in-app purchases
    console.log(`Subscribing to ${plan} plan`);
  };
  
  const PlanFeature = ({ included, text }) => (
    <View style={styles.featureRow}>
      <Ionicons 
        name={included ? "checkmark-circle" : "close-circle"} 
        size={20} 
        color={included ? COLORS.primary : COLORS.textTertiary} 
      />
      <Text style={[styles.featureText, !included && styles.disabledFeature]}>
        {text}
      </Text>
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>Upgrade to unlock premium features</Text>
      
      <View style={styles.planCard}>
        <View style={styles.currentPlanBadge}>
          <Text style={styles.currentPlanText}>CURRENT</Text>
        </View>
        <Text style={styles.planTitle}>Free</Text>
        <Text style={styles.planPrice}>$0/month</Text>
        
        <View style={styles.featuresContainer}>
          <PlanFeature included={true} text="5 job applications per month" />
          <PlanFeature included={true} text="Basic cover letter generation" />
          <PlanFeature included={true} text="Job search and save" />
          <PlanFeature included={false} text="Multiple cover letter versions" />
          <PlanFeature included={false} text="ATS optimization reports" />
          <PlanFeature included={false} text="Priority application support" />
        </View>
      </View>
      
      <View style={[styles.planCard, styles.premiumCard]}>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>RECOMMENDED</Text>
        </View>
        <Text style={styles.planTitle}>Premium</Text>
        <Text style={styles.planPrice}>$9.99/month</Text>
        
        <View style={styles.featuresContainer}>
          <PlanFeature included={true} text="Unlimited job applications" />
          <PlanFeature included={true} text="Advanced AI cover letter generation" />
          <PlanFeature included={true} text="Multiple cover letter versions" />
          <PlanFeature included={true} text="ATS optimization reports" />
          <PlanFeature included={true} text="Job alerts and notifications" />
          <PlanFeature included={true} text="Priority application support" />
        </View>
        
        <Button 
          title="Subscribe Now" 
          onPress={() => handleSubscribe('premium')}
          containerStyle={styles.subscribeButton}
        />
      </View>
      
      <Text style={styles.termsText}>
        Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period. You can manage your subscriptions in your Account Settings.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  screenTitle: {
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
  planCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  premiumCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  planTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  disabledFeature: {
    color: COLORS.textTertiary,
  },
  subscribeButton: {
    marginTop: 8,
  },
  termsText: {
    fontSize: SIZES.xSmall,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default SubscriptionScreen;