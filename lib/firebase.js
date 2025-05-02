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
  updateProfile,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBzEeKTCbhIg1zzi8sxD_cihx4pzPSPGHU",
  authDomain: "zenia-6b06c.firebaseapp.com",
  projectId: "zenia-6b06c",
  storageBucket: "zenia-6b06c.appspot.com",
  messagingSenderId: "1037526485037",
  appId: "1:1037526485037:web:e24a271c8acb4a6020d0a4",
  measurementId: "G-4F9PHGTXQY"
};

// Initialize Firebase safely (for SSR support)
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

//
// 📧 Email/Password Authentication
//
export const signUpWithEmail = async (email, password, displayName) => {
  if (!authInstance) throw new Error("Auth not initialized");

  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    const idToken = await userCredential.user.getIdToken();
    return { ...userCredential, idToken };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  if (!authInstance) throw new Error("Auth not initialized");

  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { ...userCredential, idToken };
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

//
// 🔵 Google Authentication
//
export const signInWithGoogle = async () => {
  if (!authInstance || !googleProviderInstance) throw new Error("Auth not initialized");

  try {
    const result = await signInWithPopup(authInstance, googleProviderInstance);
    const idToken = await result.user.getIdToken();
    return { ...result, idToken };
  } catch (error) {
    console.error("Google signin error:", error);
    throw error;
  }
};

//
// 📱 Phone Authentication
//
export const setupRecaptcha = (containerId) => {
  if (!authInstance || typeof window === "undefined") return null;

  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(authInstance, containerId, {
      size: "normal",
      callback: () => console.log("reCAPTCHA solved"),
      "expired-callback": () => {
        window.recaptchaVerifier.clear();
        setupRecaptcha(containerId);
      },
    });

    return window.recaptchaVerifier;
  } catch (error) {
    console.error("reCAPTCHA setup error:", error);
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber) => {
  if (!authInstance || typeof window === "undefined")
    throw new Error("Auth not initialized");

  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) throw new Error("reCAPTCHA not initialized");

    const confirmationResult = await signInWithPhoneNumber(authInstance, formattedPhone, appVerifier);
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
    const userCredential = await window.confirmationResult.confirm(code);
    delete window.confirmationResult;
    const idToken = await userCredential.user.getIdToken();
    return { ...userCredential, idToken };
  } catch (error) {
    console.error("Code verification error:", error);
    throw error;
  }
};

//
// 🔐 General Auth Utilities
//
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
