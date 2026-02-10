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

    // --- Event Admin Middleware ---
    const eventToken = request.cookies.get("event_token")
    const isEventLoginPage = request.nextUrl.pathname === "/event-login"

    if (request.nextUrl.pathname.startsWith("/event-admin")) {
        if (!eventToken) {
            return NextResponse.redirect(new URL("/event-login", request.url))
        }
        // Ideally verify JWT here or in layout, but existence check is basic first step for middleware
    }

    if (isEventLoginPage && eventToken) {
        return NextResponse.redirect(new URL("/event-admin/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/admin/:path*",
}
