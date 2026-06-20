import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[auth:authorize] called", { email: credentials?.email, hasPassword: !!credentials?.password });
        if (!credentials?.email || !credentials?.password) {
          console.log("[auth:authorize] missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) {
          console.log("[auth:authorize] user not found");
          return null;
        }
        console.log("[auth:authorize] user found", { id: user.id, email: user.email, role: user.role });

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) {
          console.log("[auth:authorize] password mismatch");
          return null;
        }

        console.log("[auth:authorize] success");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("[auth:jwt]", { trigger, hadUser: !!user, email: token.email });
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[auth:session]", { email: token.email, role: token.role });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
