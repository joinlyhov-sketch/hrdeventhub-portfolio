import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const landingRoute = "/";
const authRoutes = [
  "/login",
  "/register",
  "/sign-up",
  "/forget-Password",
  "/reset-password",
  "/verify-otp",
];
import { env } from "./libs/env";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: env?.NEXTAUTH_SECRET });
  const isLoggedIn = Boolean(token);
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isLandingRoute = nextUrl.pathname === landingRoute;

  if (!isLoggedIn && !isAuthRoute && !isLandingRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  if (isLoggedIn && (isAuthRoute || isLandingRoute)) {
    return NextResponse.redirect(new URL("/group", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|api/auth).*)",
  ],
};