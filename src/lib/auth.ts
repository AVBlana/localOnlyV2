import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";

function assertEnv(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Google({
      clientId: assertEnv(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
      clientSecret: assertEnv(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
});

export async function getHostSession() {
  const session = await auth();

  if (!session?.user || session.user.role !== "HOST") {
    return null;
  }

  return session;
}


