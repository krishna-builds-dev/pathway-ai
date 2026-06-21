export default function Works() {
    return (
        <section className="py-12 lg:py-stack-lg">
            <div className="max-w-container-max mx-auto px-margin">
                <div className="mb-12 lg:mb-16 text-center">
                    <h2 className="text-2xl lg:text-h2-dashboard font-bold text-on-background mb-4">
                        Your Journey in 3 Steps
                    </h2>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Connecting line – hidden on mobile */}
                    <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-outline-variant"></div>

                    {/* Step 1 */}
                    <div className="relative text-center">
                        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg ring-8 ring-surface">
                            <span className="material-symbols-outlined text-xl lg:text-[32px] select-invert">
                                person_add
                            </span>
                        </div>
                        <h4 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-2">
                            1. Create Profile
                        </h4>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Tell us about your background, goals, and destination preferences.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative text-center">
                        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg ring-8 ring-surface">
                            <span className="material-symbols-outlined text-xl lg:text-[32px] select-invert">
                                edit_note
                            </span>
                        </div>
                        <h4 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-2">
                            2. Input Details
                        </h4>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Fill in a few key details about your academic and work experience.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative text-center">
                        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg ring-8 ring-surface">
                            <span className="material-symbols-outlined text-xl lg:text-[32px] select-invert">
                                auto_awesome
                            </span>
                        </div>
                        <h4 className="text-base lg:text-h2-dashboard font-bold text-on-background mb-2">
                            3. Generate &amp; Refine
                        </h4>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Get instant, professional drafts and refine them with smart suggestions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}