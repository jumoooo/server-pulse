import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  if (process.env.DEMO_MODE === "true") return NextResponse.next();

  const { auth } = NextAuth(authConfig);
  const authMiddleware = auth as unknown as (
    middlewareRequest: NextRequest,
    middlewareEvent: NextFetchEvent
  ) => ReturnType<typeof NextResponse.next> | Promise<Response>;

  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
