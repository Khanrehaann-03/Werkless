// src/screens/JobDetailScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { COLORS, SIZES } from '../constants/theme';

const JobDetailScreen = ({ navigation, route }) => {
  // In a real app, you'd fetch job details based on jobId
  const jobId = route.params?.jobId;
  
  const jobDetail = {
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    description: 'Efficient and effective training for tech roles. Join our innovative and adaptive team.',
    lessons: 22,
    duration: '42h 25min',
    image: require('../assets/job-detail-image.png'),
    classmates: [
      { id: '1', image: require('../assets/avatar-1.png') },
      { id: '2', image: require('../assets/avatar-2.png') },
      { id: '3', image: require('../assets/avatar-3.png') },
      { id: '4', image: require('../assets/avatar-4.png') },
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Info</Text>
          <Image 
            source={require('../assets/profile-pic.png')} 
            style={styles.profilePic} 
          />
        </View>

        {/* Job Title */}
        <Text style={styles.jobTitle}>{jobDetail.title}</Text>

        {/* Job Image */}
        <View style={styles.imageContainer}>
          <Image source={jobDetail.image} style={styles.jobImage} />
        </View>

        {/* Job Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="book-outline" size={18} color={COLORS.text} />
            <Text style={styles.statText}>{jobDetail.lessons} Lessons</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={18} color={COLORS.text} />
            <Text style={styles.statText}>{jobDetail.duration}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>
            Efficient And Effective Training For Gaming, Casino And Sportsbook Businesses
          </Text>
          <Text style={styles.descriptionText}>
            Join our innovative and adaptive team.
          </Text>
        </View>

        {/* Classmates Section */}
        <View style={styles.classmatesContainer}>
          <Text style={styles.classmatesTitle}>Classmates</Text>
          <View style={styles.avatarContainer}>
            {jobDetail.classmates.map(classmate => (
              <Image 
                key={classmate.id} 
                source={classmate.image} 
                style={styles.avatar} 
              />
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <Button 
          title="Apply Now" 
          containerStyle={styles.applyButton} 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  jobTitle: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  jobImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 8,
    color: COLORS.text,
    fontSize: SIZES.small,
  },
  shareButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  classmatesContainer: {
    marginBottom: 32,
  },
  classmatesTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: -12,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  applyButton: {
    marginBottom: 32,
  },
});

export default JobDetailScreen;