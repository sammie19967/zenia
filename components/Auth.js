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
  const [isClient, setIsClient] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [phoneConfirmation, setPhoneConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Mark as client-side after mounting
    setIsClient(true);
    
    // Listen for auth state changes
    const unsubscribe = authStateListener((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Reset verification state when user is logged in
        setPhoneConfirmation(false);
        setVerificationId(null);
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Don't render authentication UI until client-side code is running
  if (!isClient) {
    return <div>Loading authentication...</div>;
  }
  
  // Reset all auth states and errors
  const resetAuthState = () => {
    setError(null);
    setLoading(false);
  };
  
  // 1. Email/Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    resetAuthState();
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.displayName.value;
    
    try {
      await signUpWithEmail(email, password, displayName);
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };
  
  // 2. Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    resetAuthState();
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Google Sign In
  const handleGoogleSignIn = async () => {
    resetAuthState();
    setLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };
  
  // 4. Phone Authentication - Step 1: Send verification code
  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    resetAuthState();
    setLoading(true);
    
    try {
      // Set up reCAPTCHA first
      await setupRecaptcha('recaptcha-container');
      
      // Then send verification code
      await signInWithPhone(phoneNumber);
      
      // If successful, show verification code input
      setPhoneConfirmation(true);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };
  
  // 5. Phone Authentication - Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    resetAuthState();
    setLoading(true);
    
    try {
      await confirmPhoneCode(verificationCode);
      setPhoneConfirmation(false);
    } catch (err) {
      setError(err.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };
  
  // 6. Cancel phone verification
  const handleCancelPhoneVerification = () => {
    setPhoneConfirmation(false);
    setVerificationCode('');
    setPhoneNumber('');
    setError(null);
  };
  
  // 7. Sign Out
  const handleSignOut = async () => {
    resetAuthState();
    setLoading(true);
    
    try {
      await logOut();
    } catch (err) {
      setError(err.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container max-w-md mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-2 mb-4">
          <p>Loading...</p>
        </div>
      )}
      
      {user ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="text-xl font-bold">Welcome, {user.displayName || user.email || user.phoneNumber}</h2>
          <p className="text-sm">You are now signed in.</p>
          <button 
            onClick={handleSignOut}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          {!phoneConfirmation ? (
            <>
              {/* Email/Password Sign Up Form */}
              <form onSubmit={handleEmailSignUp} className="mb-6">
                <h3 className="text-xl font-bold mb-2">Sign Up with Email</h3>
                <div className="mb-2">
                  <input 
                    type="text" 
                    name="displayName" 
                    placeholder="Display Name" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="mb-2">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="mb-2">
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="w-full p-2 border rounded" 
                    required 
                    minLength="6"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={loading}
                >
                  Sign Up
                </button>
              </form>
              
              {/* Email/Password Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="mb-6">
                <h3 className="text-xl font-bold mb-2">Sign In with Email</h3>
                <div className="mb-2">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="mb-2">
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={loading}
                >
                  Sign In
                </button>
              </form>
              
              {/* Google Sign In Button */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Sign In with Google</h3>
                <button 
                  onClick={handleGoogleSignIn} 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={loading}
                >
                  Continue with Google
                </button>
              </div>
              
              {/* Phone Authentication - Step 1 */}
              <form onSubmit={handlePhoneSignIn} className="mb-6">
                <h3 className="text-xl font-bold mb-2">Sign In with Phone</h3>
                <div className="mb-2">
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 8900" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Format: +[country code][phone number] (e.g., +1 for US)
                  </p>
                </div>
                
                {/* reCAPTCHA container */}
                <div id="recaptcha-container" className="mb-2"></div>
                
                <button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={loading || !phoneNumber.startsWith('+')}
                >
                  Send Verification Code
                </button>
              </form>
            </>
          ) : (
            /* Phone Authentication - Step 2 */
            <form onSubmit={handleVerifyCode} className="mb-6">
              <h3 className="text-xl font-bold mb-2">Enter Verification Code</h3>
              <p className="mb-2 text-sm">We sent a verification code to {phoneNumber}</p>
              
              <div className="mb-2">
                <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code" 
                  className="w-full p-2 border rounded" 
                  required 
                  maxLength="6"
                  pattern="[0-9]{6}"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
                  disabled={loading || verificationCode.length !== 6}
                >
                  Verify Code
                </button>
                
                <button 
                  type="button"
                  onClick={handleCancelPhoneVerification}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}