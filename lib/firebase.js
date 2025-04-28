// lib/firebase.js - Improved version with phone auth fixes

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

// Initialize Firebase (safely for SSR)
let app;
let auth;
let googleProvider;
let analytics;

// Initialize only in browser environment
const initializeFirebase = () => {
  if (typeof window !== "undefined") {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      
      // Lazy load analytics only in browser
      if (process.env.NODE_ENV !== 'development') {
        import("firebase/analytics").then(({ getAnalytics }) => {
          analytics = getAnalytics(app);
        }).catch(err => console.log("Analytics failed to load:", err));
      }
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    return { app, auth, googleProvider };
  }
  return { app: null, auth: null, googleProvider: null };
};

// Initialize Firebase when this module is imported
const { auth: authInstance, googleProvider: googleProviderInstance } = initializeFirebase();

// Email/Password Authentication
export const signUpWithEmail = async (email, password, displayName) => {
  if (!authInstance) return null;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    // Add display name to the user profile
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    console.error("Email signup error:", error.code, error.message);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  if (!authInstance) return null;
  
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Email signin error:", error.code, error.message);
    throw error;
  }
};

// Google Authentication
export const signInWithGoogle = async () => {
  if (!authInstance || !googleProviderInstance) return null;
  
  try {
    const result = await signInWithPopup(authInstance, googleProviderInstance);
    return result.user;
  } catch (error) {
    console.error("Google signin error:", error.code, error.message);
    throw error;
  }
};

// Phone Authentication - Fixed Implementation
export const setupRecaptcha = (containerId) => {
  if (!authInstance || typeof window === "undefined") return null;
  
  try {
    // Clear any existing reCAPTCHA to avoid duplicates
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      } catch (e) {
        console.log("Failed to clear existing reCAPTCHA");
      }
    }
    
    // Create a new invisible reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(authInstance, containerId, {
      size: 'normal',
      callback: (response) => {
        // reCAPTCHA solved
        console.log("reCAPTCHA verified", response);
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log("reCAPTCHA expired");
        window.recaptchaVerifier.clear();
        setupRecaptcha(containerId);
      }
    });
    
    console.log("reCAPTCHA setup complete");
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("reCAPTCHA setup error:", error);
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber) => {
  if (!authInstance || typeof window === "undefined") return null;
  
  try {
    // Format the phone number - ensure it's in E.164 format
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      throw new Error("Phone number must start with '+' followed by country code (e.g., +1 for US)");
    }
    
    // Remove any non-digit characters except the leading +
    formattedPhone = '+' + formattedPhone.substring(1).replace(/\D/g, '');
    
    console.log("Attempting phone sign-in with:", formattedPhone);
    
    // Ensure we have a reCAPTCHA verifier
    if (!window.recaptchaVerifier) {
      throw new Error("reCAPTCHA verifier not initialized");
    }
    
    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(
      authInstance, 
      formattedPhone,
      window.recaptchaVerifier
    );
    
    // Store confirmation result
    window.confirmationResult = confirmationResult;
    console.log("SMS verification code sent successfully");
    return confirmationResult;
  } catch (error) {
    console.error("Phone sign-in error:", error.code, error.message);
    
    // If we get an invalid-app-credential error, Firebase might need domain verification
    if (error.code === 'auth/invalid-app-credential') {
      console.error("Your Firebase project may need domain verification in the Firebase Console");
    }
    
    // If we get captcha-check-failed, reset the reCAPTCHA
    if (error.code === 'auth/captcha-check-failed') {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    }
    
    throw error;
  }
};

export const confirmPhoneCode = async (code) => {
  if (typeof window === "undefined" || !window.confirmationResult) {
    throw new Error("No verification in progress. Please request a new code.");
  }
  
  try {
    const result = await window.confirmationResult.confirm(code);
    // Clear confirmationResult after successful verification
    delete window.confirmationResult;
    return result.user;
  } catch (error) {
    console.error("Code verification error:", error.code, error.message);
    throw error;
  }
};

// General Authentication Utilities
export const logOut = async () => {
  if (!authInstance) return null;
  
  try {
    await signOut(authInstance);
    return true;
  } catch (error) {
    console.error("Signout error:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  if (!authInstance) return null;
  return authInstance.currentUser;
};

export const authStateListener = (callback) => {
  if (!authInstance) return () => {};
  return onAuthStateChanged(authInstance, callback);
};

export { authInstance as auth };
export default app;