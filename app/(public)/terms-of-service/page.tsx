"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState("acceptance");

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
            "acceptance",
            "description",
            "responsibilities",
            "intellectual-property",
            "liability",
            "governing-law",
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
        { id: "acceptance", label: "Acceptance of Terms" },
        { id: "description", label: "Description of Service" },
        { id: "responsibilities", label: "User Responsibilities" },
        { id: "intellectual-property", label: "Intellectual Property" },
        { id: "liability", label: "Limitation of Liability" },
        { id: "governing-law", label: "Governing Law" },
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
                        Transparency is the foundation of trust. Learn how Pathway AI protects your journey and your data.
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
                        <Link
                            href="/privacy-policy"
                            className="w-full sm:w-auto text-center text-on-surface-variant hover:bg-surface-variant px-4 py-2 rounded-lg font-medium text-sm lg:text-ui-sm transition-all cursor-pointer"
                        >
                            Privacy Policy
                        </Link>
                        <button className="w-full sm:w-auto bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm lg:text-ui-sm cursor-pointer">
                            Terms of Service
                        </button>
                    </div>

                    <div id="acceptance" className="scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Acceptance of Terms</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">Last Updated: April {new Date().getFullYear()}</p>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            By accessing or using the Pathway AI platform, you agree to be bound by these Terms of
                            Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    <div id="description" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Description of Service</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            Pathway AI provides educational guidance and data-driven insights for students seeking to
                            study in Australia and New Zealand. Important: Pathway AI is an educational guidance
                            platform and not a registered migration or visa agency. We provide information to support
                            your journey, but we do not provide legal visa advice or guarantee visa outcomes.
                        </p>
                    </div>

                    <div id="responsibilities" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">User Responsibilities</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            You are responsible for providing accurate and truthful information on the platform. You
                            agree to use the service only for lawful purposes and in a way that does not infringe the
                            rights of others or restrict their use and enjoyment of the platform.
                        </p>
                    </div>

                    <div id="intellectual-property" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Intellectual Property</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            The content, features, and functionality of the Pathway AI platform, including but not
                            limited to the AI Hub algorithms and design elements, are the exclusive property of Pathway
                            AI and are protected by international copyright and trademark laws.
                        </p>
                    </div>

                    <div id="liability" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Limitation of Liability</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            Pathway AI shall not be liable for any indirect, incidental, special, consequential, or
                            punitive damages resulting from your use of or inability to use the service. All
                            recommendations are provided for informational purposes only.
                        </p>
                    </div>

                    <div id="governing-law" className="mt-8 scroll-mt-28">
                        <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-4">Governing Law</h2>
                        <p className="text-sm lg:text-base text-on-surface-variant mb-4">
                            These terms shall be governed by and defined following the laws of the jurisdiction in which
                            Pathway AI is registered. Both parties consent that the courts of said jurisdiction shall
                            have exclusive jurisdiction to settle any dispute which may arise in connection with these
                            terms.
                        </p>
                    </div>

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