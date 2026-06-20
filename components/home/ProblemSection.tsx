
export default function ProblemSection() {

    return (
        <section className="bg-surface-container-low py-12 lg:py-stack-lg">
            <div className="max-w-container-max mx-auto px-margin">
                <div className="text-center mb-10 lg:mb-stack-lg">
                    <h2 className="text-2xl sm:text-3xl lg:text-h1-marketing font-bold text-on-surface mb-4">
                        Studying abroad shouldn&apos;t be a gamble
                    </h2>
                    <p className="text-sm lg:text-body-md text-on-surface-variant max-w-2xl mx-auto">
                        We identified the core challenges students face when moving their lives across continents.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 lg:gap-stack-md">
                    {/* Card 1 */}
                    <div className="bg-white p-6 lg:p-stack-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
                        <div className="text-error mb-4">
                            <span className="material-symbols-outlined text-4xl lg:text-[48px]">psychology_alt</span>
                        </div>
                        <h3 className="text-lg lg:text-h2-dashboard font-bold mb-3">Extreme Confusion</h3>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Vague information and fragmented requirements lead to paralyzing decision fatigue for applicants.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white p-6 lg:p-stack-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
                        <div className="text-error mb-4">
                            <span className="material-symbols-outlined text-4xl lg:text-[48px]">account_balance_wallet</span>
                        </div>
                        <h3 className="text-lg lg:text-h2-dashboard font-bold mb-3">Agent Bias</h3>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Traditional agents often prioritize commissions over student fit, leading to mismatched university choices.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white p-6 lg:p-stack-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
                        <div className="text-error mb-4">
                            <span className="material-symbols-outlined text-4xl lg:text-[48px]">wrong_location</span>
                        </div>
                        <h3 className="text-lg lg:text-h2-dashboard font-bold mb-3">Regional Gaps</h3>
                        <p className="text-sm lg:text-body-md text-on-surface-variant">
                            Lack of awareness about living costs, employment rates, and regional nuances in AU/NZ.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}   