// /lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
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
let app;
let auth;
let googleProvider;
let analytics;

// Check if we're in the browser environment before initializing
if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    
    // Only import and initialize analytics in browser environment
    import("firebase/analytics").then(({ getAnalytics }) => {
      analytics = getAnalytics(app);
    }).catch(error => {
      console.error("Analytics failed to load:", error);
    });
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

// Email/Password Authentication
export const signUpWithEmail = async (email, password, displayName) => {
  if (!auth) return null;
  
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
  if (!auth) return null;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Google Authentication
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) return null;
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Phone (SMS) Authentication
export const setupRecaptcha = (elementId) => {
  if (!auth || typeof window === "undefined") return null;
  
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
  if (!auth || typeof window === "undefined") return null;
  
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
  if (typeof window === "undefined" || !window.confirmationResult) return null;
  
  try {
    const result = await window.confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// General Authentication Utilities
export const logOut = async () => {
  if (!auth) return null;
  
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  if (!auth) return null;
  return auth.currentUser;
};

export const authStateListener = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default app;