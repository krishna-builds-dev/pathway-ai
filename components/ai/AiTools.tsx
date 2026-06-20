"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function AiTools() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <section className="py-12 lg:py-stack-lg bg-surface-container-low/30">
      <div className="max-w-container-max mx-auto px-margin">
        <div className="mb-12 text-center">
          <h2 className="text-2xl lg:text-h2-dashboard font-bold text-on-background mb-4">
            Powerful Tools for Your Journey
          </h2>
          <p className="text-sm lg:text-body-md text-on-surface-variant">
            Precision-engineered AI tools designed specifically for international education.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* SOP Builder */}
          <div className="glass-card p-6 lg:p-8 rounded-xl flex flex-col items-start hover:shadow-xl transition-shadow border-outline-variant">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-2xl lg:text-[32px]">description</span>
            </div>
            <h3 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-3">
              SOP Builder
            </h3>
            <p className="text-sm lg:text-body-md text-on-surface-variant mb-8 flex-grow">
              Craft compelling Statements of Purpose tailored to your target universities. Highlight your strengths with AI-optimized narratives.
            </p>
            {user ? (
              <Link
                href="/dashboard/sop"
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            )}
          </div>

          {/* Resume Builder */}
          <div className="glass-card p-6 lg:p-8 rounded-xl flex flex-col items-start hover:shadow-xl transition-shadow border-outline-variant">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-2xl lg:text-[32px]">contact_page</span>
            </div>
            <h3 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-3">
              Resume Builder
            </h3>
            <p className="text-sm lg:text-body-md text-on-surface-variant mb-8 flex-grow">
              Convert your experience into a professional format that resonates with Australian and New Zealand admission boards.
            </p>
            {user ? (
              <Link
                href="/dashboard/resume"
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            )}
          </div>

          {/* Visa Checklist */}
          <div className="glass-card p-6 lg:p-8 rounded-xl flex flex-col items-start hover:shadow-xl transition-shadow border-outline-variant">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-tertiary-container/10 text-tertiary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-2xl lg:text-[32px]">fact_check</span>
            </div>
            <h3 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-3">
              Visa Checklist
            </h3>
            <p className="text-sm lg:text-body-md text-on-surface-variant mb-8 flex-grow">
              Stay compliant with auto-generated document lists based on your nationality, destination, and study program.
            </p>
            {user ? (
              <Link
                href="/dashboard/visa"
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 px-4 border cursor-pointer border-primary text-primary text-xs lg:text-ui-sm font-medium rounded-lg hover:bg-primary hover:text-on-primary transition-all group flex items-center justify-center gap-2"
              >
                Try it Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
}