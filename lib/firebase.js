// /lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzEeKTCbhIg1zzi8sxD_cihx4pzPSPGHU",
  authDomain: "zenia-6b06c.firebaseapp.com",
  projectId: "zenia-6b06c",
  storageBucket: "zenia-6b06c.firebasestorage.app",
  messagingSenderId: "1037526485037",
  appId: "1:1037526485037:web:e24a271c8acb4a6020d0a4",
  measurementId: "G-4F9PHGTXQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Email/Password Authentication
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add display name to the user profile
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Phone (SMS) Authentication
export const setupRecaptcha = (elementId) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    window.recaptchaVerifier.render();
    return window.recaptchaVerifier;
  } catch (error) {
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
  try {
    const verifier = recaptchaVerifier || window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    throw error;
  }
};

export const confirmPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// General Authentication Utilities
export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default app;