"use client";

import { useState, useEffect } from "react";
import { setupRecaptcha, signInWithPhone, confirmPhoneCode } from "@/lib/firebase";
import { FiPhone } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"; // ✅ Import router
import "@/styles/auth.css";

export default function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ✅ Init router

  useEffect(() => {
    setupRecaptcha("recaptcha-container");
  }, []);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await signInWithPhone(phoneNumber);
      setIsCodeSent(true);
      toast.success("Verification code sent to your phone.");
    } catch (error) {
      console.error("Phone auth error:", error);
      toast.error("Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    setIsLoading(true);
    try {
      await confirmPhoneCode(verificationCode);
      toast.success("Phone number verified!");
      router.push("/"); // ✅ Redirect on success
    } catch (error) {
      console.error("Code confirmation error:", error);
      toast.error("Invalid verification code.");
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
            />
          </div>
          <button
            onClick={handleSendCode}
            disabled={!phoneNumber || isLoading}
            className={`btn btn-primary phone-btn ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Sending..." : "SMS"}
          </button>
        </div>
      ) : (
        <div className="phone-input-container">
          <input
            type="text"
            placeholder="Verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="form-input phone-input"
          />
          <button
            onClick={handleConfirmCode}
            disabled={!verificationCode || isLoading}
            className={`btn btn-primary phone-btn ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      )}
      <div id="recaptcha-container" className="recaptcha-container"></div>
    </div>
  );
}
