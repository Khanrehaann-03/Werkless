import axios from 'axios';
import Config from '../config';
import { store } from '../redux/store';

// Create axios instance for job API interactions
const jobApiClient = axios.create({
  baseURL: Config.JOB_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add authorization interceptor
jobApiClient.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
jobApiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle rate limits, authentication errors, etc.
    if (error.response && error.response.status === 401) {
      // Handle unauthorized - could dispatch a logout action
      store.dispatch({ type: 'LOGOUT' });
    }
    
    return Promise.reject(error);
  }
);

export const jobsApi = {
  /**
   * Get jobs based on search parameters
   * @param {Object} params - Search parameters
   * @returns {Promise} API response
   */
  getJobs: (params) => {
    return jobApiClient.get('/jobs', { params });
  },
  
  /**
   * Get job details by ID
   * @param {string} jobId - Job ID
   * @returns {Promise} API response
   */
  getJobById: (jobId) => {
    return jobApiClient.get(`/jobs/${jobId}`);
  },
  
  /**
   * Mark a job as saved/liked
   * @param {Object} jobData - Job data to save
   * @returns {Promise} API response
   */
  saveJob: (jobData) => {
    return jobApiClient.post('/user/saved-jobs', jobData);
  },
  
  /**
   * Get user's saved jobs
   * @returns {Promise} API response
   */
  getSavedJobs: () => {
    return jobApiClient.get('/user/saved-jobs');
  },
  
  /**
   * Apply to a job
   * @param {string} jobId - Job ID
   * @param {Object} applicationData - Application data
   * @returns {Promise} API response
   */
  applyToJob: (jobId, applicationData) => {
    return jobApiClient.post(`/jobs/${jobId}/apply`, applicationData);
  },
  
  /**
   * Get recommended jobs based on user profile and history
   * @returns {Promise} API response
   */
  getRecommendedJobs: () => {
    return jobApiClient.get('/user/recommended-jobs');
  },
  
  /**
   * Report a job listing (inappropriate, scam, etc)
   * @param {string} jobId - Job ID
   * @param {Object} reportData - Report details
   * @returns {Promise} API response
   */
  reportJob: (jobId, reportData) => {
    return jobApiClient.post(`/jobs/${jobId}/report`, reportData);
  }
};

export default jobsApi;