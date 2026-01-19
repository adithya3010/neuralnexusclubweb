import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const adminSession = request.cookies.get("admin_session")
    const isLoginPage = request.nextUrl.pathname === "/admin/login"

    // If trying to access admin pages without session
    if (request.nextUrl.pathname.startsWith("/admin") && !isLoginPage) {
        if (!adminSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    // If already logged in and trying to access login page
    if (isLoginPage && adminSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/admin/:path*",
}
