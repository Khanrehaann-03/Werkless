// src/screens/HomeScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressCircle from '../components/common/ProgressCircle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const user = {
    name: 'Alex',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    applicationStats: {
      applied: 56,
      responses: 68,
      interviews: 32
    }
  };

  const popularJobs = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Solutions',
      image: require('../assets/job-icon-1.png'),
      color: '#10B981'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Innovative Co',
      image: require('../assets/job-icon-2.png'),
      color: '#F59E0B'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hi, {user.name} 👋</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications" size={22} color={COLORS.text} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <ProgressCircle 
              percentage={user.applicationStats.applied} 
              label="Applied" 
              size={90} 
              color={COLORS.primary}
            />
          </View>
          <View style={styles.progressCircle}>
            <ProgressCircle 
              percentage={user.applicationStats.responses} 
              label="Responses" 
              size={90} 
              color="#10B981"
            />
          </View>
          <View style={styles.progressCircle}>
            <ProgressCircle 
              percentage={user.applicationStats.interviews} 
              label="Interviews" 
              size={90} 
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Popular Jobs Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Jobs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllJobs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Job Cards */}
        <View style={styles.jobCardContainer}>
          {popularJobs.map(job => (
            <Card 
              key={job.id} 
              style={[styles.jobCard, { borderLeftColor: job.color }]}
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            >
              <View style={styles.jobCardContent}>
                <Image source={job.image} style={styles.jobIcon} />
                <View style={styles.jobCardInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                </View>
              </View>
              <View style={styles.jobCardFooter}>
                <Button 
                  title="Start Applying" 
                  containerStyle={styles.startButton} 
                  textStyle={styles.startButtonText}
                  onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Recommended Jobs Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecommendedJobs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* More content can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  notificationBadge: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    top: 10,
    right: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  progressCircle: {
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
  jobCardContainer: {
    marginBottom: 24,
  },
  jobCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderRadius: 16,
  },
  jobCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  jobCardInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  jobCardFooter: {
    marginTop: 8,
  },
  startButton: {
    alignSelf: 'flex-end',
  },
  startButtonText: {
    fontSize: SIZES.small,
  },
});

export default HomeScreen;