import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

const COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Secure-authjs.session-token"
  : "authjs.session-token"

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isAdminPage = pathname.startsWith("/admin")
  const isOnboarding = pathname.startsWith("/onboarding")
  const isApiAuth = pathname.startsWith("/api/auth")

  console.log("[middleware]", { pathname, isAuthPage, isAdminPage, isOnboarding, isApiAuth })

  if (isApiAuth) return NextResponse.next()

  const rawCookie = req.cookies.get(COOKIE_NAME)?.value
  console.log("[middleware] cookie", { found: !!rawCookie, cookieName: COOKIE_NAME })

  let payload: Record<string, unknown> | null = null

  if (rawCookie) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      const { payload: decoded } = await jose.jwtVerify(rawCookie, secret)
      payload = decoded as Record<string, unknown>
      console.log("[middleware] token verified", { email: payload.email, role: payload.role })
    } catch (err) {
      console.log("[middleware] token invalid", err)
    }
  } else {
    console.log("[middleware] no cookie found")
  }

  if (isAuthPage && payload) {
    const isAdmin = payload.role === "ADMIN"
    console.log("[middleware] redirect auth page ->", isAdmin ? "/admin" : "/feed")
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/feed", req.url))
  }

  if (!payload && !isAuthPage) {
    console.log("[middleware] redirect to login (no auth)")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminPage && payload?.role !== "ADMIN") {
    console.log("[middleware] redirect non-admin from admin")
    return NextResponse.redirect(new URL("/feed", req.url))
  }

  if (isOnboarding && payload?.role === "ADMIN") {
    console.log("[middleware] redirect admin from onboarding")
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  console.log("[middleware] pass through")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
