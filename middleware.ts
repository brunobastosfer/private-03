import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("sicredi_auth_token")?.value
  const isAuthPage =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/criar-conta" ||
    request.nextUrl.pathname === "/esqueceu-senha"

  // If trying to access protected page without token, redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If trying to access login page with token, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/home/:path*", "/criar-conta", "/esqueceu-senha"],
}
