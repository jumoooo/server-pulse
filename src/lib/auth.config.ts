import type { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    roles?: string[];
  }

  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        const roles = auth?.user?.roles ?? [];
        return roles.includes("admin");
      }

      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        const mutableToken = token as {
          userId?: string;
          roles?: string[];
        };
        mutableToken.userId = user.id;
        mutableToken.roles = user.roles ?? [];
      }

      return token;
    },
    session({ session, token }) {
      const sessionToken = token as {
        userId?: string;
        roles?: string[];
      };
      session.user.id = sessionToken.userId ?? "";
      session.user.roles = sessionToken.roles ?? [];
      return session;
    },
  },
};
