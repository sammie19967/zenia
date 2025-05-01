"use client";

import { signInWithGoogle } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import "@/styles/auth.css";

export default function GoogleAuth() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-secondary"
    >
      <FcGoogle style={{ marginRight: "0.5rem", height: "1.25rem", width: "1.25rem" }} />
      Google
    </button>
  );
}