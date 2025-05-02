"use client";

import { signInWithGoogle } from "@/lib/firebase";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import "@/styles/auth.css";

export default function GoogleAuth() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle(); // Firebase sign-in
      const idToken = await userCredential.user.getIdToken(); // Get Firebase ID token

      const result = await signIn("credentials", {
        idToken,
        redirect: false, // Avoid page reload
      });

      if (result?.ok) {
        toast.success("Signed in successfully with Google!");
        router.push("/");
      } else {
        toast.error("Failed to sign in with NextAuth.");
        console.error("NextAuth signIn result:", result);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <button onClick={handleGoogleLogin} className="btn btn-secondary">
      <FcGoogle style={{ marginRight: "0.5rem", height: "1.25rem", width: "1.25rem" }} />
      Google
    </button>
  );
}
