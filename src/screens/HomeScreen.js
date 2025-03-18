// src/screens/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import JobCard from '../components/jobs/JobCard';
import { getRecommendedJobs, getRecentJobs } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const recommended = await getRecommendedJobs();
        const recent = await getRecentJobs();
        
        setRecommendedJobs(recommended);
        setRecentJobs(recent);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const categories = [
    { id: 1, name: 'Design', icon: 'color-palette' },
    { id: 2, name: 'Development', icon: 'code-slash' },
    { id: 3, name: 'Marketing', icon: 'megaphone' },
    { id: 4, name: 'Finance', icon: 'cash' },
    { id: 5, name: 'Remote', icon: 'laptop' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}</Text>
            <Text style={styles.subtitle}>Find your dream job today</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitial}>{user?.firstName?.[0] || 'U'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Icon name={category.icon} size={24} color="#5C67DE" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        ) : (
          <FlatList
            data={recommendedJobs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <JobCard 
                job={item} 
                onPress={() => navigation.navigate('JobDetail', { jobId: item._id })}
              />
            )}
            style={styles.jobsList}
          />
        )}

        {/* Recent Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading recent jobs...</Text>
        ) : (
          <View style={styles.recentJobsContainer}>
            {recentJobs.slice(0, 3).map(job => (
              <JobCard 
                key={job._id} 
                job={job} 
                onPress={() => navigation.navigate('JobDetail', { jobId: job._id })}
                horizontal={true}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5C67DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDF0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: '#5C67DE',
  },
  jobsList: {
    paddingLeft: 20,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  recentJobsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;