"use client";
import { useState } from "react";
import { signUpWithEmail, signInWithEmail } from "@/lib/firebase";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const user = await signUpWithEmail(email, password, "Your Display Name");
      console.log("Signed up user:", user);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignin = async () => {
    try {
      const user = await signInWithEmail(email, password);
      console.log("Signed in user:", user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Email/Password Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleSignin}>Sign In</button>
    </div>
  );
}
