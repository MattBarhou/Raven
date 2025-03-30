import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import client from "@/db/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    GitHub,
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id ?? user.sub; // Ensure `id` is always set
        token.sub = user.id ?? user.sub; // Store sub explicitly
        token.accessToken = account?.access_token; // Store access token (optional)
      }

      // Update user info when signing in with Discord
      if (account?.provider === "discord" && profile) {
        token.provider = "discord";
        // Store Discord-specific profile data if needed
        token.discordImage = profile.image_url || profile.avatar;
        token.discordName = profile.username || profile.global_name;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id; // Ensure `session.user.id` exists
      }

      // If signed in with Discord, use Discord profile info
      if (token.provider === "discord") {
        session.user.image = token.discordImage || session.user.image;
        session.user.name = token.discordName || session.user.name;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  basePath: "/api/auth",
  debug: true, // Keep debug logs for now to help troubleshoot
});
