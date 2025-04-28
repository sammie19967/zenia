"use client";

import { signInWithGoogle } from "@/lib/firebase";

export default function GoogleAuth() {
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google signed in user:", user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Sign in with Google</h2>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}
