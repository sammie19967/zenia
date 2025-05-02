// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth } from "firebase-admin/auth";
import { cert } from "firebase-admin/app";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

let firebaseAdmin;
try {
  const admin = await import("firebase-admin");
  if (!admin.apps.length) admin.initializeApp(firebaseAdminConfig);
  firebaseAdmin = admin;
} catch (err) {
  console.error("Firebase Admin Init Error:", err);
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Firebase",
      async authorize(credentials) {
        const { idToken } = credentials;

        const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
        const { uid, email, phone_number, name, picture, firebase } = decoded;

        await connectToDB();

        let user = await User.findOne({ uid });
        if (!user) {
          user = await User.create({
            uid,
            email,
            phoneNumber: phone_number,
            provider: firebase.sign_in_provider,
            name,
            image: picture,
          });
        }

        return { id: user._id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
