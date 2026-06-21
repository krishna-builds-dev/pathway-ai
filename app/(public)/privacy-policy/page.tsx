"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("introduction");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-120px 0px -70% 0px" }
        );

        const sectionIds = [
            "introduction",
            "data-collection",
            "data-usage",
            "security",
            "user-rights"
        ];

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 112;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setActiveSection(id);
        }
    };

    const navItems = [
        { id: "introduction", label: "Introduction" },
        { id: "data-collection", label: "Data We Collect" },
        { id: "data-usage", label: "How We Use Data" },
        { id: "security", label: "Data Security" },
        { id: "user-rights", label: "Your Legal Rights" },
    ];

    return (
        <main className="pt-24 pb-12 lg:pb-stack-lg max-w-container-max mx-auto px-margin">
            {/* Header */}
            <section className="mb-12 lg:mb-stack-lg">
                <div className="max-w-3xl">
                    <h1 className="text-3xl lg:text-h1-marketing font-bold text-on-background mb-4">
                        Legal Center
                    </h1>
                    <p className="text-sm lg:text-body-lg text-on-surface-variant">
                        Transparency is the foundation of trust. Learn how Pathway protects your journey and your data.
                    </p>
                </div>
            </section>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-gutter">
                {/* Sidebar – stacks on mobile, sticky on desktop */}
                <aside className="md:col-span-3">
                    <div className="md:sticky md:top-28 space-y-6">
                        <nav className="flex flex-col gap-2">
                            <p className="text-xs lg:text-label-caps text-outline mb-2">ON THIS PAGE</p>
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleScroll(e, item.id)}
                                    className={`text-sm lg:text-ui-sm py-1 transition-all ${activeSection === item.id
                                        ? "font-medium text-primary"
                                        : "text-on-surface-variant hover:text-primary"
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                        <div className="bg-surface-container p-4 lg:p-6 rounded-xl border border-outline-variant">
                            <p className="text-base lg:text-h2-dashboard font-bold text-primary mb-2">
                                Need clarity?
                            </p>
                            <p className="text-xs lg:text-ui-sm text-on-surface-variant mb-4">
                                Our compliance team is available for any specific legal inquiries.
                            </p>
                            <Link
                                href="/contact"
                                className="flex items-center gap-2 text-primary font-bold text-xs lg:text-ui-sm hover:opacity-75 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-sm">mail</span>
                                Contact Legal
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <article className="md:col-span-9 bg-surface-container-lowest p-6 lg:p-stack-lg rounded-2xl border border-outline-variant shadow-sm policy-content">
                    {/* Tabs */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 lg:mb-stack-md border-b border-outline-variant pb-6 lg:pb-stack-md">
                        <button className="w-full sm:w-auto bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm lg:text-ui-sm cursor-pointer">
                            Privacy Policy
                        </button>
                        <Link
                            href="/terms-of-service"
                            className="w-full sm:w-auto text-center text-on-surface-variant hover:bg-surface-variant px-4 py-2 rounded-lg font-medium text-sm lg:text-ui-sm transition-all cursor-pointer"
                        >
                            Terms of Service
                        </Link>
                    </div>

                    {/* Introduction */}
                    <div id="introduction" className="scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Introduction</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">Last Updated: April {new Date().getFullYear()}</p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            Welcome to Pathway. We are committed to protecting your personal information and your right to
                            privacy. This Privacy Policy applies to all information collected through our website, mobile
                            application, and any related services, sales, marketing, or events.
                        </p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            When you use Pathway to navigate your educational journey to Australia or New Zealand, you
                            trust us with your personal data. We take this responsibility seriously and have designed our
                            systems to prioritize your security and data sovereignty.
                        </p>
                    </div>

                    {/* Data Collection */}
                    <div id="data-collection" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Data We Collect</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            We collect personal information that you voluntarily provide to us when you register on the
                            platform, express an interest in obtaining information about us or our products and services, or
                            otherwise when you contact us.
                        </p>
                        <ul className="list-disc ml-6 mb-6 space-y-2 text-sm lg:text-base text-on-surface-variant">
                            <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and mailing address.</li>
                            <li><strong>Academic Credentials:</strong> Educational history, transcripts, test scores (IELTS/TOEFL), and certifications.</li>
                            <li><strong>Financial Information:</strong> Payment details for premium services and proof of funds for visa processing.</li>
                            <li><strong>Professional History:</strong> Resumes, employment history, and professional references.</li>
                        </ul>
                    </div>

                    {/* Data Processing Disclosure */}
                    <div className="my-8 lg:my-stack-lg p-4 lg:p-6 bg-surface-container-high rounded-xl border border-primary/20 relative overflow-hidden scroll-mt-28" id="data-processing">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-primary mb-3">
                                <span className="material-symbols-outlined">description</span>
                                <span className="text-xs lg:text-label-caps">Data Processing Disclosure</span>
                            </div>
                            <h3 className="text-lg lg:text-h2-dashboard font-bold mb-3">
                                How Pathway processes your data
                            </h3>
                            <p className="text-xs lg:text-ui-sm text-on-surface-variant max-w-2xl">
                                Pathway uses rule-based tools to match your academic profile against university requirements and generate document templates. Your data stays in your account and is only processed to provide the features you use — SOP building, resume formatting, and visa checklist generation.
                            </p>
                        </div>
                        <div className="absolute -right-12 -bottom-12 opacity-5">
                            <span className="material-symbols-outlined text-[120px] lg:text-[240px]">description</span>
                        </div>
                    </div>

                    {/* Data Usage */}
                    <div id="data-usage" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">How We Use Data</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            We use personal information collected via our Services for a variety of business purposes
                            described below. We process your personal information for these purposes in reliance on our
                            legitimate business interests, in order to enter into or perform a contract with you, with your
                            consent, and/or for compliance with our legal obligations.
                        </p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            Specifically, we use your information to facilitate account creation, send administrative
                            information, fulfill and manage orders, and provide personalized university and course
                            recommendations based on your specific profile and preferences.
                        </p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            We may share your academic profile and contact information with verified education consultancies
                            and institutions to help connect you with relevant opportunities. You may opt out of this sharing
                            at any time through your account settings. We may also share anonymized, aggregated
                            insights derived from user data with education industry partners for research and
                            advisory purposes. This aggregated data cannot be used to identify you personally.
                        </p>
                    </div>

                    {/* Security */}
                    <div id="security" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Data Security</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            We have implemented appropriate technical and organizational security measures designed to
                            protect the security of any personal information we process. However, despite our safeguards and
                            efforts to secure your information, no electronic transmission over the Internet or information
                            storage technology can be guaranteed to be 100% secure.
                        </p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Access to your
                            personal information is strictly limited to authorized Pathway personnel and partners who
                            require access to perform their professional duties.
                        </p>
                    </div>

                   

                    {/* User Rights */}
                    <div id="user-rights" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Your Legal Rights</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            Depending on your location (specifically if you are a resident of the EEA or UK), you have
                            certain rights under applicable data protection laws. These may include the right to request
                            access and obtain a copy of your personal information, to request rectification or erasure, to
                            restrict the processing of your personal information, and, if applicable, to data portability.
                        </p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            In certain circumstances, you may also have the right to object to the processing of your
                            personal information. To make such a request, please use the contact details provided below. We
                            will consider and act upon any request in accordance with applicable data protection laws.
                        </p>
                    </div>

                    {/* Footer note */}
                    <div className="mt-8 lg:mt-stack-lg pt-6 lg:pt-stack-md border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs lg:text-ui-sm text-on-surface-variant italic">
                            Next Review Date: April {new Date().getFullYear()}
                        </p>
                    </div>
                </article>
            </div>
        </main>
    );
}