import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecrypt } from "jose"
import { hkdf } from "@panva/hkdf"

const COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Secure-authjs.session-token"
  : "authjs.session-token"

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""

function getDerivedEncryptionKey(keyMaterial: string, salt: string): Promise<Uint8Array> {
  return hkdf("sha256", keyMaterial, salt, `Auth.js Generated Encryption Key (${salt})`, 64)
}

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

  console.log("[middleware] auth secret", { found: !!AUTH_SECRET, length: AUTH_SECRET.length })

  let payload: Record<string, unknown> | null = null

  if (rawCookie) {
    try {
      const encryptionSecret = await getDerivedEncryptionKey(AUTH_SECRET, COOKIE_NAME)
      const { payload: decoded } = await jwtDecrypt(rawCookie, encryptionSecret, {
        keyManagementAlgorithms: ["dir"],
        contentEncryptionAlgorithms: ["A256CBC-HS512", "A256GCM"],
      })
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
