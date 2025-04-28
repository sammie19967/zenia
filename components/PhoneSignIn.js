"use client"; // Next.js App Router

import { useEffect, useState } from "react";
import { setupRecaptcha, signInWithPhone, confirmPhoneCode } from "@/lib/firebase";

export default function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  useEffect(() => {
    setupRecaptcha("recaptcha-container"); // recaptcha container id
  }, []);

  const handleSendCode = async () => {
    try {
      await signInWithPhone(phoneNumber);
      setIsCodeSent(true);
      alert("Verification code sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleConfirmCode = async () => {
    try {
      const user = await confirmPhoneCode(verificationCode);
      console.log("User signed in:", user);
      alert("Phone authentication successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Phone Number Login</h2>
      <div>
        <input 
          type="text" 
          placeholder="Enter phone number (+2547XXXXXXX)" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {!isCodeSent && <button onClick={handleSendCode}>Send Code</button>}
      </div>

      {isCodeSent && (
        <div>
          <input 
            type="text" 
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleConfirmCode}>Verify Code</button>
        </div>
      )}

      {/* Recaptcha must have an element */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
