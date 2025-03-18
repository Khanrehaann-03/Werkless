// src/services/applicationService.js
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const submitApplication = async (jobData, coverLetter) => {
  try {
    const userId = auth().currentUser.uid;
    const timestamp = firestore.FieldValue.serverTimestamp();
    
    const applicationRef = await firestore().collection('applications').add({
      userId,
      jobId: jobData.id,
      jobTitle: jobData.title,
      company: jobData.company,
      location: jobData.location,
      coverLetter,
      status: 'applied',
      appliedDate: timestamp,
      lastUpdated: timestamp
    });
    
    return applicationRef.id;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const getUserApplications = async (status = 'all') => {
  try {
    const userId = auth().currentUser.uid;
    let query = firestore().collection('applications').where('userId', '==', userId);
    
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('appliedDate', 'desc').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      appliedDate: doc.data().appliedDate?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    await firestore().collection('applications').doc(applicationId).update({
      status: newStatus,
      lastUpdated: firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};