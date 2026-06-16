import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db.user.findUnique({ where: { email: user.email } });
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      await db.user.upsert({
        where: { providerAccountId: account.providerAccountId },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          image: user.image,
          providerAccountId: account.providerAccountId,
        },
      });

      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
