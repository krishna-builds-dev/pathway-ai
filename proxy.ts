// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Exact routes that must be protected (same list as LayoutSelector)
const PROTECTED_ROUTES = [
    "/dashboard",
    "/dashboard/sop",
    "/dashboard/resume",
    "/dashboard/visa",
    "/dashboard/advisor",
    "/dashboard/profile",
    "/account",
    "/dashboard/courses",
    "/dashboard/countries",
    "/dashboard/cities"
];

const GUEST_ONLY = ["/sign-in", "/get-started", "/forgot-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { response, user } = await updateSession(request);

    // Check if the current path is an actual protected route
    const isProtected = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname?.startsWith(route + "/")
    );

    const isGuestOnly = GUEST_ONLY.some((p) => pathname.startsWith(p));

    // Not logged in → trying a real protected route → redirect to sign-in
    if (isProtected && !user) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Already logged in → trying guest‑only route → redirect to dashboard
    if (isGuestOnly && user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    ],
};