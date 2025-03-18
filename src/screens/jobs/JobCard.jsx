// src/components/jobs/JobCard.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const JobCard = ({ job, onPress, horizontal = false }) => {
  const formatSalary = (min, max, currency = '$') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${currency}${min}k - ${currency}${max}k`;
    if (min) return `${currency}${min}k+`;
    return `Up to ${currency}${max}k`;
  };

  const getJobTypeBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return '#E3F2FD';
      case 'part-time':
        return '#FFF3E0';
      case 'contract':
        return '#E8F5E9';
      case 'freelance':
        return '#F3E5F5';
      default:
        return '#ECEFF1';
    }
  };

  const getJobTypeBadgeTextColor = (type) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return '#1565C0';
      case 'part-time':
        return '#EF6C00';
      case 'contract':
        return '#2E7D32';
      case 'freelance':
        return '#7B1FA2';
      default:
        return '#455A64';
    }
  };

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress}>
        <Image 
          source={{ uri: job.companyLogo || 'https://via.placeholder.com/50' }} 
          style={styles.horizontalLogo} 
        />
        <View style={styles.horizontalContent}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.companyName}</Text>
          <View style={styles.horizontalDetails}>
            <View style={styles.detailItem}>
              <Icon name="location-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="cash-outline" size={14} color="#666" />
              <Text style={styles.detailText}>
                {formatSalary(job.salaryMin, job.salaryMax)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.jobTypeBadge, 
          { backgroundColor: getJobTypeBadgeColor(job.jobType) }
        ]}>
          <Text style={[
            styles.jobTypeText, 
            { color: getJobTypeBadgeTextColor(job.jobType) }
          ]}>
            {job.jobType}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Image 
          source={{ uri: job.companyLogo || 'https://via.placeholder.com/50' }} 
          style={styles.logo} 
        />
        <View style={[
          styles.jobTypeBadge, 
          { backgroundColor: getJobTypeBadgeColor(job.jobType) }
        ]}>
          <Text style={[
            styles.jobTypeText, 
            { color: getJobTypeBadgeTextColor(job.jobType) }
          ]}>
            {job.jobType}
          </Text>
        </View>
      </View>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.companyName}>{job.companyName}</Text>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Icon name="location-outline" size={14} color="#666" />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="cash-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: 250,
    marginRight: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  horizontalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  horizontalLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'column',
    marginTop: 8,
  },
  horizontalDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  jobTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default JobCard;