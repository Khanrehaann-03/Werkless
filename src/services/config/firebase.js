// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWnQhbrEZ1S02Opsoz3hrThvzQ9LcH0l8",
  authDomain: "werkless.firebaseapp.com",
  projectId: "werkless",
  storageBucket: "werkless.firebasestorage.app",
  messagingSenderId: "500383030773",
  appId: "1:500383030773:web:3cb3707b05e13bc05a54bc",
  measurementId: "G-M5SR99WH9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };