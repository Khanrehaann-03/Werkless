// src/screens/ApplicationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserApplications } from '../services/applicationService';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ApplicationsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('applied');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchApplications();
  }, [activeTab]);
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await getUserApplications(activeTab);
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#4CD964';
      case 'saved': return '#007AFF';
      case 'interview': return '#FF9500';
      case 'rejected': return '#FF3B30';
      default: return '#8E8E93';
    }
  };
  
  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() => navigation.navigate('ApplicationDetail', { applicationId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.companyName}>{item.company}</Text>
      <Text style={styles.dateApplied}>Applied on {new Date(item.appliedDate).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Applications</Text>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'applied' && styles.activeTab]}
          onPress={() => setActiveTab('applied')}
        >
          <Text style={[styles.tabText, activeTab === 'applied' && styles.activeTabText]}>Applied</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'interview' && styles.activeTab]}
          onPress={() => setActiveTab('interview')}
        >
          <Text style={[styles.tabText, activeTab === 'interview' && styles.activeTabText]}>Interviews</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No {activeTab} applications yet</Text>
          </View>
        }
      />
    </View>
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
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.xSmall,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  companyName: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  dateApplied: {
    fontSize: SIZES.xSmall,
    color: COLORS.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
});

export default ApplicationsScreen;