import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GitHub from "next-auth/providers/github";
import client from "@/db/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [GitHub],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? user.sub; // Ensure `id` is always set
        token.sub = user.id ?? user.sub; // Store sub explicitly
        token.accessToken = account?.access_token; // Store access token (optional)
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id; // Ensure `session.user.id` exists
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug logs
});
