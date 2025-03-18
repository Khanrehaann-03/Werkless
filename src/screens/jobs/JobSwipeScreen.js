import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveJob, skipJob } from '../redux/actions/jobActions';
import Config from '../config';
import ErrorBoundary from '../components/ErrorBoundary';
import { jobsApi } from '../services/jobsApi';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const JobSwipeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobsExhausted, setJobsExhausted] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const userId = useSelector(state => state.auth.userId);
  const userPreferences = useSelector(state => state.preferences);
  
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  });

  // Load jobs when component mounts or when filters change
  useEffect(() => {
    fetchJobs();
  }, [userPreferences]);

  // Fetch more jobs when we're running low
  useEffect(() => {
    if (jobs.length > 0 && currentIndex >= jobs.length - 3 && !jobsExhausted && !loading) {
      loadMoreJobs();
    }
  }, [currentIndex, jobs.length]);

  const fetchJobs = async (reset = true) => {
    try {
      setLoading(true);
      setError(null);
      
      if (reset) {
        setPageNumber(1);
        setJobsExhausted(false);
      }
      
      const params = {
        page: reset ? 1 : pageNumber,
        limit: 10,
        ...constructQueryParams()
      };
      
      const response = await jobsApi.getJobs(params);
      
      if (response.data && response.data.jobs) {
        if (response.data.jobs.length === 0) {
          setJobsExhausted(true);
        } else {
          setJobs(reset ? response.data.jobs : [...jobs, ...response.data.jobs]);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreJobs = () => {
    if (!jobsExhausted && !loading) {
      setPageNumber(prevPage => prevPage + 1);
      fetchJobs(false);
    }
  };

  const constructQueryParams = () => {
    const { location, jobTypes, skills, salaryRange, remoteOnly } = userPreferences;
    
    return {
      location: location || undefined,
      jobTypes: jobTypes?.join(',') || undefined,
      skills: skills?.join(',') || undefined,
      minSalary: salaryRange?.min || undefined,
      maxSalary: salaryRange?.max || undefined,
      remote: remoteOnly || undefined
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false
    }).start();
  };

  const swipeRight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const currentJob = jobs[currentIndex];
    dispatch(saveJob(currentJob));
    
    try {
      // Track analytics
      analytics.track('Job_Liked', {
        jobId: currentJob.id,
        userId,
        jobTitle: currentJob.title,
        company: currentJob.company
      });
    } catch (err) {
      console.error('Analytics error:', err);
    }
    
    animateSwipe(SCREEN_WIDTH, () => nextCard());
  };
  
  const swipeLeft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentJob = jobs[currentIndex];
    dispatch(skipJob(currentJob.id));
    
    animateSwipe(-SCREEN_WIDTH, () => nextCard());
  };

  const animateSwipe = (direction, onComplete) => {
    Animated.timing(position, {
      toValue: { x: direction, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(onComplete);
  };

  const nextCard = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentIndex(0);
    fetchJobs();
  };

  const handleJobDetails = () => {
    if (jobs.length > 0 && currentIndex < jobs.length) {
      navigation.navigate('JobDetails', { job: jobs[currentIndex] });
    }
  };

  const renderCards = () => {
    if (loading && jobs.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Finding the perfect jobs for you...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (jobs.length === 0 || (currentIndex >= jobs.length && jobsExhausted)) {
      return (
        <View style={styles.endOfJobsContainer}>
          <MaterialIcons name="work-off" size={80} color="#cccccc" />
          <Text style={styles.endOfJobsText}>No jobs found</Text>
          <Text style={styles.endOfJobsSubText}>Try adjusting your search filters</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => navigation.navigate('Preferences')}>
            <Text style={styles.refreshButtonText}>Adjust Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentIndex >= jobs.length) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading more jobs...</Text>
        </View>
      );
    }

    const currentJob = jobs[currentIndex];
    const nextJob = jobs[currentIndex + 1];

    return (
      <View style={styles.cardContainer}>
        {/* Next card (shown underneath) */}
        {nextJob && (
          <View style={[styles.cardStyle, styles.nextCardStyle]}>
            <JobCard job={nextJob} />
          </View>
        )}

        {/* Current card (with swipe animation) */}
        <Animated.View
          style={[
            styles.cardStyle, 
            { 
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.nopeContainer, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>
          
          <JobCard job={currentJob} onPress={handleJobDetails} />
        </Animated.View>
      </View>
    );
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {renderCards()}
        
        {!loading && jobs.length > 0 && currentIndex < jobs.length && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={swipeLeft}>
              <AntDesign name="close" size={32} color="#ff6b6b" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.infoButton} onPress={handleJobDetails}>
              <Ionicons name="information-circle" size={28} color="#4b7bec" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={swipeRight}>
              <AntDesign name="heart" size={32} color="#26de81" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ErrorBoundary>
  );
};

const JobCard = ({ job, onPress }) => {
  const defaultLogo = 'https://via.placeholder.com/150?text=' + job.company.charAt(0);
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: job.logo || defaultLogo }} 
          style={styles.companyLogo}
          onError={(e) => { e.target.onerror = null; e.target.src = defaultLogo; }}
        />
        <View style={styles.cardHeaderText}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
        </View>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={18} color="#666" />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="money" size={18} color="#666" />
          <Text style={styles.detailText}>{job.salary || 'Salary not specified'}</Text>
        </View>
        
        {job.remote && (
          <View style={styles.detailRow}>
            <MaterialIcons name="laptop" size={18} color="#666" />
            <Text style={styles.detailText}>Remote</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.detailText}>Posted {job.posted}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText} numberOfLines={4}>{job.description}</Text>
      </View>
      
      <View style={styles.skillsContainer}>
        {job.skills && job.skills.slice(0, 4).map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skills && job.skills.length > 4 && (
          <View style={styles.skillBadge}>
            <Text style={styles.skillText}>+{job.skills.length - 4}</Text>
          </View>
        )}
      </View>
      
      <BlurView intensity={100} tint="light" style={styles.cardFooter}>
        <Text style={styles.footerText}>Tap for details</Text>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '85%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  nextCardStyle: {
    top: 10,
    opacity: 0.7
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    height: '100%',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  cardHeaderText: {
    flex: 1
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginTop: 3
  },
  jobDetails: {
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#444'
  },
  divider: {
    height: 1,
    backgroundColor: '#eee'
  },
  descriptionContainer: {
    padding: 15
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20
  },
  skillsContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  skillBadge: {
    backgroundColor: '#e9f5fe',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 3
  },
  skillText: {
    color: '#4b7bec',
    fontSize: 12
  },
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    color: '#4b7bec',
    fontWeight: '600'
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000,
    transform: [{ rotate: '30deg' }]
  },
  likeText: {
    borderWidth: 3,
    borderColor: '#26de81',
    color: '#26de81',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5
  },
  nopeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
    transform: [{ rotate: '-30deg' }]
  },
  nopeText: {
    borderWidth: 3,
    borderColor: '#ff6b6b',
    color: '#ff6b6b',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 15
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  infoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4b7bec',
    borderRadius: 20
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16
  },
  endOfJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  endOfJobsText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444'
  },
  endOfJobsSubText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  refreshButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4b7bec',
    borderRadius: 20
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16
  },
  loadingMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default JobSwipeScreen;