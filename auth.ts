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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { name, email, image } = user;
      console.log("Sign-in callback triggered"); // ⬅️ Cek apakah callback berjalan
      console.log("Account Provider:", account?.provider);
      console.log("User Info:", user);
      console.log("Profile Info:", profile);
      let userId = "";

      if (account?.provider === "github") {
        const { id, login, bio } = profile as any;

        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id,
            name,
            username: login,
            email,
            image,
            bio: bio || "",
          });
        }
        userId = id;
      }

      if (account?.provider === "google") {
        console.log("Google sign-in attempt for email:", email);
      
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_EMAIL_QUERY, { email });
      
        console.log("Existing User:", existingUser); // <-- Tambahkan ini
      
        if (!existingUser) {
          console.log("Creating new user in Sanity...");
          await writeClient.create({
            _type: "author",  
            name,
            email,
            image,
          });
        }
      }

      return true;
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
