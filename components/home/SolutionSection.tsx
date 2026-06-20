import Image from 'next/image';

export default function SolutionSection() {
    return (
        <section className="py-12 lg:py-stack-lg max-w-container-max mx-auto px-margin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-stack-lg items-center">
                {/* Image column – first on mobile, second on desktop */}
                <div className="lg:col-span-7 order-1 lg:order-1">
                    <div className="relative rounded-2xl overflow-hidden border border-outline-variant">
                        <Image
                            src="/images/dashboard/product.png"
                            alt="Dashboard interface on a laptop screen showing university rankings and visa checklist"
                            width={800}
                            height={600}
                            className="w-full h-auto"
                            sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                    </div>
                </div>

                {/* Text column – second on mobile, second on desktop */}
                <div className="lg:col-span-5 order-2 lg:order-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-h1-marketing font-bold text-on-surface mb-6">
                        Guidance that adapts to you
                    </h2>
                    <ul className="space-y-6 lg:space-y-stack-md">
                        <li className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary">
                                <span className="material-symbols-outlined text-sm select-invert">check</span>
                            </div>
                            <div>
                                <h4 className="text-base lg:text-lg font-bold">Unbiased AI Guidance</h4>
                                <p className="text-sm lg:text-body-md text-on-surface-variant">
                                    Algorithms that rank institutions based on your grades, budget, and career goals—not hidden fees.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary">
                                <span className="material-symbols-outlined text-sm select-invert">check</span>
                            </div>
                            <div>
                                <h4 className="text-base lg:text-lg font-bold">Side-by-Side Comparisons</h4>
                                <p className="text-sm lg:text-body-md text-on-surface-variant">
                                    Compare lifestyle, climate, and job opportunities across cities like Sydney, Melbourne, and Auckland.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary">
                                <span className="material-symbols-outlined text-sm select-invert">check</span>
                            </div>
                            <div>
                                <h4 className="text-base lg:text-lg font-bold">Automated Discovery</h4>
                                <p className="text-sm lg:text-body-md text-on-surface-variant">
                                    Discover niche courses that lead to permanent residency pathways in high-demand industries.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}   