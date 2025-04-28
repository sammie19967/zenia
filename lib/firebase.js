// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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