import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as SecureStor from 'expo-secure-store';

//JWT Token Management

const storeAuthToken = async (token) => {
    await SecureStore.setItemAsync('authToken', token);
};

const getAuthToken = async () => {
    return await SecureStore.getItemAsync('authToken');
};

const removeAuthToken = async () => {
    await SecureStore.deleteItemAsync('authToken');
};


//Email/Password Registeration

export const registerUser = async (EmailAuthCredential, sendPasswordResetEmail, userDate) => {
    try {
        //Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user profile in FireStore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: useCardAnimation.displayName || '',
            createdAt: new Date(),
            isPremium: false,
            // Profile fields
            phone: useData.phone || '',
            education: [],
            experience: [],
            skills: [],
            resumeUrl: null
        });

        //Store auth token
        const token = await user.getIdToken();
        await storeAuthToken(token);

        return { user, token };
    } catch (error) {
        console.error ("Registeration error:", error);
        throw error;
    }  
};


// Email/Password Login

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        await storeAuthToken(token);

        return { user, token };
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


// Google OAuth Login
export const loginWithGoogle = async (idToken) => {
    try {
        // Create Google Credential
        const credential = GoogleAuthProvider.credential(idToken);
        // Sign in with credential
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        // Check if user already exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.id));

        if (!userDoc.exists()) {
            //Create new user document for first-time Google sign-ins
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoUrl: user.photoUrl || '',
                createdAt: new Date(),
                isPremium: false,
                // Default empty profile fields
                education: [],
                experience: [],
                skills: [],
                resumeUrl: null
            });
        }

        // Store auth token
        const token = await user.getIdToken();
        await storeAuthToken(token);

        return { user, token };
    } catch (error) {
        console.error("Google login error:", error);
        throw error;
    }
};

// LinkedIn OAuth Login
export const loginWithLinkedIn = async (AccessTokenRequest, profileData) => {
    try {
        // Since Firebase doesn't natively support LinkedIn, we create a custom token approach

        const email = profileData.email;

        //this would typically require a backend endpoint to create a custom Firebase token
        // For now, We'll just store LinkedIn data in Firestore

        // Create/update LinkedIn user profile
        const linkedInId = profileData.id;
        await setDoc(doc(db, "linkedInUsers", linkedInId), {
            ...profileData,
            lastLogin: new Date()
        },{ merge: true });


        // For demo purposes, we're just storing the LinkedIn token
        await SecureStore.setItemAsync( 'linkedInToken', accessToken);

        return { success: true, profile: profileData };
    } catch (error) {
        console.error("LinkedIn login error:", error);
        throw error;
    }
};

// Password Reset
export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };
  

  // Logout
export const logoutUser = async () => {
    try {
      await signOut(auth);
      await removeAuthToken();
      await SecureStore.deleteItemAsync('linkedInToken');
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  
  // Get User Profile
export const getUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  };

  // Update User Profile
export const updateUserProfile = async (userId, userData) => {
    try {
      await updateDoc(doc(db, "users", userId), userData);
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // Check Authentication Status
export const checkAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
  };