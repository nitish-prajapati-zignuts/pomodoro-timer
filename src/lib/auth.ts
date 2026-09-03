import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "Ancient Explorer",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Marcus Aurelius" },
        email: { label: "Email", type: "email", placeholder: "scholar@ancientpomodoro.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const name = credentials.name || credentials.email.split("@")[0] || "Ancient Scholar";
        const email = credentials.email.toLowerCase().trim();

        try {
          const db = await connectDB();
          if (db) {
            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                name,
                email,
                image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
              });
            }
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        } catch (e) {
          console.warn("[Auth] DB error during auth:", e);
        }

        // Return demo profile if DB unavailable
        return {
          id: `guest_${Buffer.from(email).toString("hex").slice(0, 12)}`,
          name,
          email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "ancient_pomodoro_super_secret_jwt_key_2026_secure",
};
