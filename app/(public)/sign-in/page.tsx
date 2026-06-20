"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { PathwayLogo, ShieldCheckIcon } from "@/components/icon/Icons";
import Link from "next/link";
import OAuthButtons from "@/components/auth/OAuthButtons";

function SignInForm() {


    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    const { user } = useAuth();

    // Redirect if already logged in (handles cross‑tab sync)
    useEffect(() => {
        if (user) {
            window.location.href = redirectTo;
        }
    }, [user, redirectTo, router]);

    return (
        <main className="min-h-[calc(100vh-180px)] grow flex items-center justify-center px-4 py-12 mt-20 mb-7.5 md:mt-30 md:mb-15">
            <div className="w-full max-w-[440px]">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-4 hover:scale-105 transition-transform">
                        <PathwayLogo className="w-12 h-12" />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl lg:text-h2-dashboard font-bold text-on-surface mb-2">
                            Welcome back
                        </h1>
                        <p className="text-sm lg:text-body-md text-on-surface-variant max-w-[320px] mx-auto">
                            Sign in to continue your journey to Australia and New Zealand.
                        </p>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 lg:p-8 shadow-[0px_8px_30px_rgba(0,0,0,0.08)]">
                    <OAuthButtons redirectUrl={redirectTo} className="flex flex-col gap-3" />
                </div>

                <div className="mt-6 lg:mt-stack-md flex items-center justify-center gap-2 text-outline">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <p className="text-[10px] lg:text-label-caps uppercase tracking-wider">
                        Secure 256-bit SSL Connection
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function SignIn() {
    return (
        <Suspense
            fallback={
                <div className="grow flex items-center justify-center">
                    <span className="text-sm lg:text-base text-on-surface-variant">
                        Loading...
                    </span>
                </div>
            }
        >
            <SignInForm />
        </Suspense>
    );
}