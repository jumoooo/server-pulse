import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    roles?: string[];
  }
  interface Session {
    user: { id: string; roles: string[] } & DefaultSession["user"];
  }
}

/**
 * Vercel·스테이징·운영 등 배포 조건에서는 AUTH_SECRET 누락 시 즉시 실패.
 * 로컬 `NODE_ENV=development`에서는 경고 + 개발용 fallback 허용.
 * 비 Vercel 운영 서버는 `AUTH_STRICT=true` 로 강제할 수 있습니다.
 */
function resolveAuthSecret(): string {
  const fromEnv =
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "";

  if (fromEnv) {
    return fromEnv;
  }

  // Next 타입 정의에 "staging" 없음 — 커스텀 스테이징 호스트는 문자열로만 판별
  const nodeEnv = (process.env.NODE_ENV as string | undefined) ?? "development";
  const vercelEnv = process.env.VERCEL_ENV;
  const requireStrictSecret =
    process.env.AUTH_STRICT === "true" ||
    nodeEnv === "staging" ||
    vercelEnv === "production" ||
    vercelEnv === "preview" ||
    (nodeEnv === "production" && process.env.VERCEL === "1");

  if (requireStrictSecret) {
    throw new Error(
      "[auth] 배포/스테이징 환경에서는 AUTH_SECRET(또는 NEXTAUTH_SECRET)이 필수입니다. openssl rand -base64 32 로 생성해 .env / 호스트 시크릿에 설정하세요."
    );
  }

  console.warn(
    "[auth] AUTH_SECRET 없음 — 개발용 fallback secret을 사용합니다. 운영·Vercel·AUTH_STRICT 환경에서는 설정이 필수입니다."
  );
  return "dev-only-insecure-auth-secret";
}

const authSecret = resolveAuthSecret();

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { userRoles: { include: { role: true } } },
        });

        if (!user) return null;
        if (user.status !== "active") return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          roles: user.userRoles.map((ur) => ur.role.name),
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.roles = (user as { roles?: string[] }).roles ?? [];
      }
      return token;
    },
    session({ session, token }) {
      const t = token as { userId?: string; roles?: string[] };
      session.user.id = t.userId ?? "";
      session.user.roles = t.roles ?? [];
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        const roles = (auth?.user as { roles?: string[] } | undefined)?.roles ?? [];
        return roles.includes("admin");
      }

      return !!auth;
    },
  },
});
