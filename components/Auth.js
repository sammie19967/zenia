// components/Auth.js
"use client";
import { useState, useEffect } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  setupRecaptcha,
  signInWithPhone,
  confirmPhoneCode,
  logOut,
  getCurrentUser,
  authStateListener
} from '../lib/firebase';

export default function Auth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [phoneConfirmation, setPhoneConfirmation] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark as client-side after mounting
    setIsClient(true);
    
    // Listen for auth state changes
    const unsubscribe = authStateListener((currentUser) => {
      setUser(currentUser);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Don't render authentication UI until client-side code is running
  if (!isClient) {
    return <div>Loading authentication...</div>;
  }
  
  // 1. Email/Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.displayName.value;
    
    try {
      setError(null);
      await signUpWithEmail(email, password, displayName);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 2. Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      setError(null);
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 3. Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 4. Phone Authentication (Step 1: Send code)
  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    const phoneNumber = e.target.phone.value;
    
    try {
      setError(null);
      // Make sure to have a div with id="recaptcha-container" in your JSX
      setupRecaptcha('recaptcha-container');
      await signInWithPhone(phoneNumber);
      setPhoneConfirmation(true);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 5. Phone Authentication (Step 2: Verify code)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    
    try {
      setError(null);
      await confirmPhoneCode(code);
      setPhoneConfirmation(false);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 6. Sign Out
  const handleSignOut = async () => {
    try {
      setError(null);
      await logOut();
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="auth-container">
      {error && <div className="error-message">{error}</div>}
      
      {user ? (
        <div>
          <h2>Welcome, {user.displayName || user.email || user.phoneNumber}</h2>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          {/* Email/Password Sign Up Form */}
          <form onSubmit={handleEmailSignUp}>
            <h3>Sign Up with Email</h3>
            <input type="text" name="displayName" placeholder="Display Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
          
          {/* Email/Password Sign In Form */}
          <form onSubmit={handleEmailSignIn}>
            <h3>Sign In with Email</h3>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
          
          {/* Google Sign In Button */}
          <div>
            <h3>Sign In with Google</h3>
            <button onClick={handleGoogleSignIn}>Continue with Google</button>
          </div>
          
          {/* Phone Authentication */}
          {!phoneConfirmation ? (
            <form onSubmit={handlePhoneSignIn}>
              <h3>Sign In with Phone</h3>
              <input type="tel" name="phone" placeholder="+1234567890" required />
              <div id="recaptcha-container"></div>
              <button type="submit">Send Verification Code</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <h3>Enter Verification Code</h3>
              <input type="text" name="code" placeholder="123456" required />
              <button type="submit">Verify Code</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}