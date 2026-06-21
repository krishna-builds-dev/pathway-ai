"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';

interface CTABannerProps {
    titleLoggedOut?: string;
    titleLoggedIn?: string;
    descriptionLoggedOut?: string;
    descriptionLoggedIn?: string;
}

export default function CTABanner({
    titleLoggedOut = "Start your journey today",
    titleLoggedIn = "Ready to continue?",
    descriptionLoggedOut = "Join students from across Nepal and beyond planning their future in Australia and New Zealand with Pathway.",
    descriptionLoggedIn = "Your personalized study plan and university shortlists are waiting. Head to your dashboard to pick up right where you left off."
}: CTABannerProps = {}) {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <section className="px-margin py-12 lg:py-stack-lg">
            <div className="max-w-container-max mx-auto bg-primary rounded-[32px] lg:rounded-[40px] p-8 lg:p-stack-lg relative overflow-hidden text-center text-on-primary shadow-2xl">
                {/* Decorative blobs – smaller on mobile */}
                <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full -mr-32 lg:-mr-48 -mt-32 lg:-mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-secondary/20 rounded-full -ml-32 lg:-ml-48 -mb-32 lg:-mb-48 blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-h1-marketing font-bold mb-6 select-invert">
                        {user ? titleLoggedIn : titleLoggedOut}
                    </h2>
                    <p className="text-sm lg:text-body-lg mb-6 lg:mb-stack-md opacity-90 max-w-xl mx-auto select-invert">
                        {user ? descriptionLoggedIn : descriptionLoggedOut}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="bg-white text-primary font-bold px-6 py-3 lg:px-10 lg:py-4 rounded-xl shadow-lg hover:bg-surface-container-low transition-all cursor-pointer text-sm lg:text-base"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-white text-primary font-bold px-6 py-3 lg:px-10 lg:py-4 rounded-xl shadow-lg hover:bg-surface-container-low transition-all cursor-pointer text-sm lg:text-base"
                            >
                                Create Free Account
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    );
}