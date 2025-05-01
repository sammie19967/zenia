"use client";

import { signInWithGoogle } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // ✅ Import toast
import "@/styles/auth.css";

export default function GoogleAuth() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully with Google!"); // ✅ Success toast
      router.push("/");
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign-in failed. Please try again."); // ✅ Error toast
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
