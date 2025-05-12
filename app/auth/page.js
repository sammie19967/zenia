"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { signInWithEmail, signUpWithEmail, sendPasswordResetEmail } from "@/lib/firebase";
import GoogleAuth from "@/components/GoogleAuth";
import PhoneSignIn from "@/components/PhoneSignIn";
import "@/styles/auth.css"; // Import the enhanced CSS

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const toastId = toast.loading(isLogin ? "Signing in..." : "Creating account...");

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmail(email, password);
        const idToken = await userCredential.user.getIdToken();

        const res = await signIn("credentials", {
          redirect: false,
          idToken,
        });

        if (res?.ok) {
          toast.success("Logged in successfully!", { id: toastId });
          router.push("/dashboard");
        } else {
          throw new Error(res?.error || "Login failed");
        }
      } else {
        // Signup
        const userCredential = await signUpWithEmail(email, password, name);
        toast.success("Account created! Please log in.", { id: toastId });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Sending reset link...");
    
    try {
      await sendPasswordResetEmail(resetEmail);
      toast.success("Password reset link sent!", { id: toastId });
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to send reset link", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {showReset ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              onClick={handleReset} 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="auth-footer">
              <button
                onClick={() => {
                  setShowReset(false);
                  setError("");
                }}
                className="auth-link"
                disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isLogin && (
                <div className="remember-forgot">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" disabled={isLoading} />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setShowReset(true);
                      setError("");
                    }}
                    className="auth-link"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign in" : "Sign up")}
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
                onClick={toggleAuthMode}
                className="auth-link"
                disabled={isLoading}
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