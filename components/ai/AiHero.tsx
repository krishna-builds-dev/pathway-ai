"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AiHero() {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.08)_0%,rgba(255,255,255,0)_100%)]" />

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/20 text-secondary mb-6 sm:mb-8">
                    <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        stars
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                        50,000+ students guided
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-on-background mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
                    Master Your Application with{" "}
                    <span className="text-primary">AI</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                    Generate professional SOPs, resumes, and visa checklists in minutes.
                    Our intelligent engine understands university requirements across
                    Australia and New Zealand.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {user ? (
                        <Link
                            href="/dashboard/ai"
                            className="group bg-primary-container text-on-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:opacity-95 transition-all active:scale-95 flex items-center justify-center"
                        >
                            Ask AI Advisor
                            <span className="ms-2 material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-primary-container text-on-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:opacity-95 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                        >
                            Start for Free
                        </button>
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    );
}