// lib/firebaseClient.js
import { adminAuth } from "./firebaseAdmin";

export async function verifyIdToken(idToken) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    throw new Error("Invalid token");
  }
}
