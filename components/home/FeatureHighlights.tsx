export default function FeatureHighlights() {
    return (
        <section className="py-12 md:py-stack-lg max-w-container-max mx-auto px-margin">
            <div className="text-center mb-10 md:mb-stack-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-h1-marketing font-bold mb-4">
                    Powerful Tools for Every Step
                </h2>
                <p className="text-sm lg:text-body-md text-on-surface-variant max-w-2xl mx-auto">
                    Beyond just university searches, we provide a full ecosystem for your international transition.
                </p>
            </div>

            {/* Responsive grid – single column on mobile, 12‑column layout on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 h-auto md:h-[450px]">

                {/* City Explorer – spans 8 columns on desktop */}
                <div className="md:col-span-8 bg-white border border-outline-variant rounded-2xl p-6 md:p-stack-md flex flex-col justify-between shadow-sm">
                    <div>
                        <span className="material-symbols-outlined text-primary mb-4 text-4xl md:text-[40px]">travel_explore</span>
                        <h3 className="text-lg lg:text-h2-dashboard font-bold">City Explorer</h3>
                        <p className="text-sm lg:text-body-md text-on-surface-variant mt-2 max-w-md">
                            Deep‑dive into local neighborhoods, transport costs, and part‑time job heatmaps in your target city.
                        </p>
                    </div>
                </div>

                {/* Visa Checklist AI – spans 4 columns on desktop */}
                <div className="md:col-span-4 bg-primary-container text-on-primary-container border border-primary/20 rounded-2xl p-6 md:p-stack-md shadow-lg">
                    <span className="material-symbols-outlined mb-4 select-invert text-4xl md:text-[40px]">fact_check</span>
                    <h3 className="text-lg lg:text-h2-dashboard font-bold select-invert">Visa Checklist</h3>
                    <p className="text-sm lg:text-body-md mt-2 opacity-90 select-invert">
                        Real‑time tracking of your GTE (Genuine Temporary Entrant) requirements and document verification.
                    </p>
                </div>

                {/* SOP Builder – spans 4 columns on desktop */}
                <div className="md:col-span-4 bg-surface-container-high border border-outline-variant rounded-2xl p-6 md:p-stack-md shadow-sm">
                    <span className="material-symbols-outlined text-secondary mb-4 text-4xl md:text-[40px]">description</span>
                    <h3 className="text-lg lg:text-h2-dashboard font-bold">SOP Builder</h3>
                    <p className="text-sm lg:text-body-md text-on-surface-variant mt-2">
                        Generate compelling Statements of Purpose that highlight your unique academic strengths.
                    </p>
                </div>

                {/* Course Finder – spans 8 columns on desktop, internal two‑column layout stacks on mobile */}
                <div className="md:col-span-8 bg-white border border-outline-variant rounded-2xl p-6 md:p-stack-md shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <span className="material-symbols-outlined text-tertiary mb-4 text-4xl md:text-[40px]">school</span>
                        <h3 className="text-lg lg:text-h2-dashboard font-bold">Course Finder</h3>
                        <p className="text-sm lg:text-body-md text-on-surface-variant mt-2">
                            Filter courses by CRICOS codes, intake dates, and tuition fee range.
                        </p>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center justify-between">
                            <span className="text-ui-sm">Computer Science</span>
                            <span className="text-[10px] bg-green-100 text-green-800 px-2 rounded">High PR Link</span>
                        </div>
                        <div className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center justify-between">
                            <span className="text-ui-sm">Public Health</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 rounded">Scholarship Availability</span>
                        </div>
                        <div className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center justify-between">
                            <span className="text-ui-sm">Creative Arts</span>
                            <span className="text-[10px] bg-gray-100 text-gray-800 px-2 rounded">Limited Seats</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}