import type { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ensureSeedUser, findUserByEmail, verifyPassword } from "@/lib/users";

type VirtualUser = { id: string; email: string; name: string };

/**
 * On serverless platforms (Vercel) the file-backed user store can't be
 * written to. As a fallback, we authorize the env-configured seed user
 * directly against SEED_USER_PASSWORD_PLAIN so the demo account keeps
 * working on every cold start.
 *
 * SEED_USER_PASSWORD_PLAIN holds the actual plaintext password, so a
 * plain string comparison is the correct check (NOT bcrypt.compare).
 */
async function authorizeSeedDirect(
  email: string,
  password: string,
): Promise<VirtualUser | null> {
  const seedEmail = process.env.SEED_USER_EMAIL;
  const seedPlain = process.env.SEED_USER_PASSWORD_PLAIN;
  if (!seedEmail || !seedPlain) return null;
  if (email.toLowerCase() !== seedEmail.toLowerCase()) return null;
  if (password !== seedPlain) return null;
  return {
    id: `usr_seed_${seedEmail.split("@")[0]}`,
    email: seedEmail,
    name: process.env.SEED_USER_NAME || seedEmail.split("@")[0],
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await ensureSeedUser();
        const user = await findUserByEmail(credentials.email);
        if (user) {
          const ok = await verifyPassword(user, credentials.password);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name };
        }
        // Fallback: serverless env-only seed user.
        return authorizeSeedDirect(credentials.email, credentials.password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (token.uid && session.user) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};