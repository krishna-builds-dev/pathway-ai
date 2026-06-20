"use client";

import { useEffect, useRef } from "react";
import CTABanner from "@/components/cta/Banner";
import Image from "next/image";

export default function AboutPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="pt-16">
      <style>{`
        .section-hidden {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="relative min-h-[500px] md:min-h-[650px] flex items-center justify-center overflow-hidden mesh-gradient section-hidden"
      >
        <div className="relative z-10 max-w-4xl mx-auto px-margin-mobile text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display-lg font-bold text-primary mb-6 leading-tight">
            Democratizing Global Education
          </h1>
          <p className="text-sm lg:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Navigating international borders shouldn&apos;t be the hardest part of your
            education. We use smart technology to simplify the visa process for
            students worldwide.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#our-mission"
              className="bg-primary text-on-primary px-6 py-2 lg:px-8 lg:py-3 rounded-full font-headline-md text-sm lg:text-base hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section
        id="our-mission"
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="py-12 lg:py-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto section-hidden"
      >
        <div className="glass-card p-6 lg:p-16 rounded-[32px] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-headline-lg font-bold text-primary mb-6">
              Our Mission
            </h2>
            <p className="text-sm lg:text-body-lg text-on-surface-variant mb-6 leading-relaxed">
              We believe that talent is universal, but opportunity is not.
              Pathway AI was founded to bridge the gap between student dreams
              and global academic opportunities through precision, transparency,
              and trust.
            </p>
            <p className="text-sm lg:text-body-lg text-on-surface-variant leading-relaxed">
              By leveraging advanced AI models and expert regulatory knowledge,
              we&apos;ve built a platform that eliminates the guesswork from visa
              applications, allowing students to focus on what truly matters:
              their education.
            </p>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-video rounded-2xl overflow-hidden relative border border-outline-variant/30">
            <Image
              src="/images/about/about.png"
              alt="Diverse group of international students"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="py-12 lg:py-24 bg-surface-container-low section-hidden"
      >
        <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-headline-lg font-bold text-on-surface mb-4">
              Values that Drive Us
            </h2>
            <p className="text-sm lg:text-body-md text-on-surface-variant">
              The principles that guide every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl lg:text-[32px]">
                  verified_user
                </span>
              </div>
              <h3 className="text-lg lg:text-headline-md font-bold text-on-surface mb-3">Integrity</h3>
              <p className="text-sm lg:text-body-md text-on-surface-variant">
                We prioritize accuracy and honesty in every visa assessment,
                ensuring students have a realistic path forward.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl lg:text-[32px]">
                  lightbulb
                </span>
              </div>
              <h3 className="text-lg lg:text-headline-md font-bold text-on-surface mb-3">Innovation</h3>
              <p className="text-sm lg:text-body-md text-on-surface-variant">
                Using state-of-the-art AI, we continuously evolve our algorithms
                to keep pace with changing global regulations.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl lg:text-[32px]">
                  public
                </span>
              </div>
              <h3 className="text-lg lg:text-headline-md font-bold text-on-surface mb-3">Inclusion</h3>
              <p className="text-sm lg:text-body-md text-on-surface-variant">
                Education is for everyone. We design our tools to be accessible
                to students from every corner of the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}