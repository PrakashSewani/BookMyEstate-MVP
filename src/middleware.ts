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

  if (isApiAuth) return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  let payload: Record<string, unknown> | null = null

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      const { payload: decoded } = await jose.jwtVerify(token, secret)
      payload = decoded as Record<string, unknown>
    } catch {
      // invalid token
    }
  }

  if (isAuthPage && payload) {
    const isAdmin = payload.role === "ADMIN"
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/feed", req.url))
  }

  if (!payload && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminPage && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/feed", req.url))
  }

  if (isOnboarding && payload?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
