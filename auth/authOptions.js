import { getServerSession } from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminDb } from "@/lib/firebaseAdmin"; // your initialized admin app
import { verifyIdToken } from "@/lib/firebaseClient"; // your Firebase token verifier

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        token: { label: "Firebase ID Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const user = await verifyIdToken(credentials.token);
          if (user) {
            return { id: user.uid, email: user.email, name: user.name || "", image: user.picture || null };
          }
          return null;
        } catch (err) {
          console.error("Firebase verification error", err);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user.uid;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
