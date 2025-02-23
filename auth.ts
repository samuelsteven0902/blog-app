import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY, AUTHOR_BY_EMAIL_QUERY } from "./sanity/lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
      checks: ["none"],
      
    })
  ],
  callbacks: {
      async signIn({ user, account, profile }) {
        console.log("🔹 signIn callback triggered");
        console.log("User:", user);
        console.log("Account:", account);
        console.log("Profile:", profile);
    
        if (account?.provider === "google") {
          console.log("✅ Google sign-in detected for:", user.email);
    
          const existingUser = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_EMAIL_QUERY, { email: user.email });
    
          console.log("Existing User in DB:", existingUser);
    
          if (!existingUser) {
            console.log("🆕 Creating new user in Sanity...");
            await writeClient.create({
              _type: "author",
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
        }
    
        // Cek apakah login berhasil atau tidak
        console.log("✅ Allowing sign-in...");
        return true; // <-- Pastikan ini tidak `false`
      },
    
    async jwt({ token, account, profile }) {
      if (account && profile) {
        let user;

        if (account.provider === "github") {
          user = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
              id: profile?.id,
            });
        }

        if (account.provider === "google") {
          user = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_EMAIL_QUERY, {
              email: profile?.email,
            });
        }

        token.id = user?._id;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
