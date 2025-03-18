// src/services/jobService.js
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// API configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your job API key
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs'; // Using Adzuna as an example

// Fetch jobs from API
export const fetchJobs = async (page = 1, locationFilter = '', categoryFilter = '', keywordFilter = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/gb/search/${page}`, {
      params: {
        app_id: 'YOUR_APP_ID',
        app_key: API_KEY,
        results_per_page: 10,
        what: keywordFilter,
        where: locationFilter,
        category: categoryFilter,
        content_type: 'application/json',
      },
    });
    
    // Transform API response to our app's job format
    const transformedJobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary: job.salary_min ? `${job.salary_min}-${job.salary_max}` : 'Not specified',
      jobType: job.contract_time || 'Not specified',
      postedAt: new Date(job.created).toLocaleDateString(),
      url: job.redirect_url,
    }));
    
    return transformedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Save a job to user's saved jobs
export const saveJob = async (jobData) => {
  try {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('savedJobs')
      .doc(jobData.id)
      .set({
        ...jobData,
        savedAt: new Date(),
      });
    
    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobData, coverLetter) => {
  try {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('appliedJobs')
      .doc(jobData.id)
      .set({
        ...jobData,
        appliedAt: new Date(),
        coverLetter,
        status: 'applied',
      });
    
    return true;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

// Get user's saved jobs
export const getSavedJobs = async () => {
  try {
    const userId = auth().currentUser.uid;
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('savedJobs')
      .orderBy('savedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    throw error;
  }
};

// Get user's applied jobs
export const getAppliedJobs = async () => {
  try {
    const userId = auth().currentUser.uid;
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('appliedJobs')
      .orderBy('appliedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting applied jobs:', error);
    throw error;
  }
};