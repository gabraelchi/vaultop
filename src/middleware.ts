import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"

export function middleware(req: NextRequest){

  const token = req.cookies.get("token")?.value
  const pathname = req.nextUrl.pathname

  // =========================
  // PUBLIC ROUTES
  // =========================
  if(
    pathname === "/" ||
    pathname.startsWith("/api/login")
  ){
    return NextResponse.next()
  }

  // =========================
  // NO TOKEN
  // =========================
  if(!token){
    return NextResponse.redirect(new URL("/", req.url))
  }

  const decoded: any = verifyToken(token)

  if(!decoded){
    return NextResponse.redirect(new URL("/", req.url))
  }

  const role = decoded.role

  // =========================
  // ROLE PROTECTION
  // =========================
  if(pathname.startsWith("/admin") && role !== "admin"){
    return NextResponse.redirect(new URL("/", req.url))
  }

  if(pathname.startsWith("/md") && role !== "md"){
    return NextResponse.redirect(new URL("/", req.url))
  }

  if(pathname.startsWith("/supervisor") && role !== "supervisor"){
    return NextResponse.redirect(new URL("/", req.url))
  }

  if(req.nextUrl.pathname.startsWith("/control-admin") && role !== "superadmin"){
  return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

// =========================
// MATCHER
// =========================
export const config = {
  matcher: [
    "/admin/:path*",
    "/md/:path*",
    "/supervisor/:path*",
    "/api/:path*"
  ]
}