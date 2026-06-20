import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
    const isAdminPage = pathname.startsWith("/admin")
    const isOnboarding = pathname.startsWith("/onboarding")
    const isApiAuth = pathname.startsWith("/api/auth")

    if (isApiAuth) return NextResponse.next()

    if (isAuthPage && token) {
      const isAdmin = token.role === "ADMIN"
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/feed", req.url))
    }

    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/feed", req.url))
    }

    if (isOnboarding && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
