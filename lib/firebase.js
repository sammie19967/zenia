import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (safely for SSR)
let app;
let auth;
let googleProvider;

const initializeFirebase = () => {
  if (typeof window !== "undefined") {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    return { app, auth, googleProvider };
  }
  return { app: null, auth: null, googleProvider: null };
};

const { auth: authInstance, googleProvider: googleProviderInstance } = initializeFirebase();

// Email/Password Authentication
export const signUpWithEmail = async (email, password, displayName) => {
  if (!authInstance) throw new Error("Auth not initialized");
  
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  if (!authInstance) throw new Error("Auth not initialized");
  
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  if (!authInstance) throw new Error("Auth not initialized");
  
  try {
    await firebaseSendPasswordResetEmail(authInstance, email);
    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// Google Authentication
export const signInWithGoogle = async () => {
  if (!authInstance || !googleProviderInstance) throw new Error("Auth not initialized");
  
  try {
    const result = await signInWithPopup(authInstance, googleProviderInstance);
    return result.user;
  } catch (error) {
    console.error("Google signin error:", error);
    throw error;
  }
};

// Phone Authentication
export const setupRecaptcha = (containerId) => {
  if (!authInstance || typeof window === "undefined") return null;
  
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(authInstance, containerId, {
      size: 'normal',
      callback: () => console.log("reCAPTCHA solved"),
      'expired-callback': () => {
        window.recaptchaVerifier.clear();
        setupRecaptcha(containerId);
      }
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("reCAPTCHA setup error:", error);
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber) => {
  if (!authInstance || typeof window === "undefined") throw new Error("Auth not initialized");
  
  try {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const appVerifier = window.recaptchaVerifier;
    
    if (!appVerifier) throw new Error("reCAPTCHA not initialized");
    
    const confirmationResult = await signInWithPhoneNumber(
      authInstance, 
      formattedPhone.replace(/\D/g, ''),
      appVerifier
    );
    
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Phone sign-in error:", error);
    throw error;
  }
};

export const confirmPhoneCode = async (code) => {
  if (!window.confirmationResult) throw new Error("No verification in progress");
  
  try {
    const result = await window.confirmationResult.confirm(code);
    delete window.confirmationResult;
    return result.user;
  } catch (error) {
    console.error("Code verification error:", error);
    throw error;
  }
};

// General Auth Utilities
export const logOut = async () => {
  if (!authInstance) throw new Error("Auth not initialized");
  
  try {
    await signOut(authInstance);
    return true;
  } catch (error) {
    console.error("Signout error:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return authInstance?.currentUser || null;
};

export const authStateListener = (callback) => {
  if (!authInstance) return () => {};
  return onAuthStateChanged(authInstance, callback);
};

export { authInstance as auth };