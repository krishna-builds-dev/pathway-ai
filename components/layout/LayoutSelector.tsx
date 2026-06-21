"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProtectedLayout from "@/components/layout/ProtectedLayout"; // your sidebar+header layout

// Exact routes that should get the protected layout
const PROTECTED_ROUTES = [
    "/dashboard",
    "/dashboard/sop",
    "/dashboard/resume",
    "/dashboard/visa",
    "/dashboard/advisor",
    "/dashboard/profile",
    "/account",            // add other protected routes as needed
];

export default function LayoutSelector({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if the current path matches any protected route exactly,
    // or starts with one of them (to cover sub‑pages like /dashboard/sop/details)
    const isProtected = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname?.startsWith(route + "/")
    );

    if (isProtected) {
        return <ProtectedLayout>{children}</ProtectedLayout>;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}