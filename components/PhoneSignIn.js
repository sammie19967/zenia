"use client";

import { useState, useEffect } from "react";
import { setupRecaptcha, signInWithPhone, confirmPhoneCode } from "@/lib/firebase";
import { FiPhone } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "@/styles/auth.css";

export default function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Setup reCAPTCHA on first render
  useEffect(() => {
    setupRecaptcha("recaptcha-container");
  }, []);

  const handleSendCode = async () => {
    if (!phoneNumber.startsWith("+")) {
      toast.error("Please enter the phone number with country code (e.g., +2547XXXXXXX).");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithPhone(phoneNumber);
      setIsCodeSent(true);
      toast.success("Verification code sent!");
    } catch (error) {
      console.error("Phone verification error:", error);
      toast.error("Failed to send verification code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!verificationCode) {
      toast.error("Enter the verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmPhoneCode(verificationCode); // Firebase confirms the code
      const idToken = await result.user.getIdToken(); // Get Firebase ID token

      // Use NextAuth to sign in using the ID token
      const nextAuthResponse = await signIn("credentials", {
        idToken,
        redirect: false,
      });

      if (nextAuthResponse?.ok) {
        toast.success("Phone verified and signed in!");
        router.push("/");
      } else {
        toast.error("NextAuth sign-in failed.");
        console.error("NextAuth error:", nextAuthResponse);
      }
    } catch (error) {
      console.error("Code confirmation failed:", error);
      toast.error("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isCodeSent ? (
        <div className="phone-input-container">
          <div className="form-input-container" style={{ flexGrow: 1 }}>
            <FiPhone className="form-icon" />
            <input
              type="tel"
              placeholder="+2547XXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input phone-input"
              autoFocus
            />
          </div>
          <button
            onClick={handleSendCode}
            disabled={!phoneNumber || isLoading}
            className={`btn btn-primary phone-btn ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Sending..." : "Send SMS"}
          </button>
        </div>
      ) : (
        <div className="phone-input-container">
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="form-input phone-input"
          />
          <button
            onClick={handleConfirmCode}
            disabled={!verificationCode || isLoading}
            className={`btn btn-primary phone-btn ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      )}

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" className="recaptcha-container"></div>
    </div>
  );
}
