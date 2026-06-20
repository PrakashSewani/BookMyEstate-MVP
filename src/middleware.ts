import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminPage = pathname.startsWith("/admin");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isApiAuth = pathname.startsWith("/api/auth");

  if (isApiAuth) return NextResponse.next();

  // Logged in users on auth pages → redirect to appropriate home
  if (isAuthPage && isLoggedIn) {
    const isAdmin = req.auth?.user?.role === "ADMIN";
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/feed", req.url));
  }

  // Not logged in → redirect to login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Non-admin users trying to access admin → redirect to feed
  if (isAdminPage && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // Admin users don't need onboarding
  if (isOnboarding && req.auth?.user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
