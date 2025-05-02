// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { verifyIdToken } from "@/lib/firebaseClient";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Firebase",
      async authorize(credentials) {
        try {
          const { idToken } = credentials;
          const decoded = await verifyIdToken(idToken);
          const { uid, email, phone_number, name, picture, firebase } = decoded;

          await connectDB();

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
        } catch (error) {
          console.error("Error in authorize:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
