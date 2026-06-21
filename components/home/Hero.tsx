"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/components/providers/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';

export default function Hero() {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <section className="relative px-margin py-stack-lg max-w-container-max mx-auto overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
                    {/* ---- Text content ---- */}
                    <div className="z-10 order-2 lg:order-1">
                        <span className="inline-block px-3 py-1 mb-4 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-label-caps text-label-caps">
                            TRANSFORMING EDUCATION
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-on-surface">
                            Smarter pathways for{" "}
                            <span className="text-primary">international students</span>
                        </h1>
                        <p className="font-body-lg text-md md:text-body-lg text-on-surface-variant mb-stack-md max-w-lg">
                            {user
                                ? "Welcome back! Continue your journey, manage your shortlists, and explore new university pathways tailored to your goals in your dashboard."
                                : "Navigate the complexity of studying abroad with our smart planning platform. Discover unique university pathways tailored to your unique goals."}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {user ? (
                                <Link
                                    href="/dashboard/advisor"
                                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all font-geist text-ui-md flex items-center gap-2 group"
                                >
                                    Ask Career Advisor
                                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg active:translate-y-0 transition-all font-geist text-ui-md flex items-center gap-2 group cursor-pointer hover:opacity-90"
                                >
                                    Start Planning
                                    <span className="material-symbols-outlined text-xl transition-transform select-invert">
                                        arrow_forward
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ---- Image column ---- */}
                    <div className="relative order-2 lg:order-2">
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="relative hidden md:block rounded-2xl overflow-hidden shadow-2xl border border-white/50 aspect-4/3">
                            <Image
                                src="/images/index/hero.png"
                                alt="Diverse international students on a sunny university campus"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover "
                            />
                        </div>
                        {/* Fake stat badge removed */}
                    </div>
                </div>
            </section>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    );
}