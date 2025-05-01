"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from "react-icons/fi";
import { signInWithEmail, signUpWithEmail, sendPasswordResetEmail } from "@/lib/firebase";
import GoogleAuth from "@/components/GoogleAuth";
import PhoneSignIn from "@/components/PhoneSignIn";
import "@/styles/auth.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(resetEmail);
      alert("Password reset link sent to your email!");
      setShowReset(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {showReset ? (
          <div className="auth-form">
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">
                Email address
              </label>
              <div className="form-input-container">
                <FiMail className="form-icon" />
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              className="btn btn-primary"
            >
              Send Reset Link
            </button>

            <div className="auth-footer">
              <button
                onClick={() => setShowReset(false)}
                className="auth-link"
              >
                Back to {isLogin ? "login" : "signup"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <form className="auth-form" onSubmit={handleAuth}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="form-input-container">
                    <FiUser className="form-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className="form-input-container">
                  <FiMail className="form-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="form-input-container">
                  <FiLock className="form-icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                  />
                </div>
              </div>

              {isLogin && (
                <div className="remember-forgot">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="auth-link"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">Or continue with</span>
              <div className="divider-line"></div>
            </div>

            <div className="social-buttons">
              <GoogleAuth />
              <PhoneSignIn />
            </div>

            <div className="auth-footer">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="auth-link"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                <FiArrowRight className="auth-link-icon" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}