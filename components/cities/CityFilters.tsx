"use client";

interface CityFiltersProps {
    filters: {
        country: string;
        cost: string;
        pr: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onReset: () => void;
}

export default function CityFilters({ filters, onFilterChange, onReset }: CityFiltersProps) {
    const hasActiveFilters = filters.country !== 'all' || filters.cost !== 'any' || filters.pr !== 'all';

    return (
        <section className=" md:top-20 z-40 mb-8 lg:mb-stack-lg px-4 md:px-0">
            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant p-4 md:p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full items-end">
                    {/* Country Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant tracking-widest uppercase font-bold opacity-60">
                            Country
                        </label>
                        <select
                            value={filters.country}
                            onChange={(e) => onFilterChange('country', e.target.value)}
                            className="bg-surface border border-outline-variant rounded-xl text-xs md:text-ui-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer hover:bg-surface-container-low"
                        >
                            <option value="all">All Countries</option>
                            <option value="australia">Australia</option>
                            <option value="new-zealand">New Zealand</option>
                        </select>
                    </div>

                    {/* Cost Level */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant tracking-widest uppercase font-bold opacity-60">
                            Cost Level
                        </label>
                        <select
                            value={filters.cost}
                            onChange={(e) => onFilterChange('cost', e.target.value)}
                            className="bg-surface border border-outline-variant rounded-xl text-xs md:text-ui-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer hover:bg-surface-container-low"
                        >
                            <option value="any">Any Budget</option>
                            <option value="economy">Economy</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* PR Strength */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant tracking-widest uppercase font-bold opacity-60">
                            PR Strength
                        </label>
                        <select
                            value={filters.pr}
                            onChange={(e) => onFilterChange('pr', e.target.value)}
                            className="bg-surface border border-outline-variant rounded-xl text-xs md:text-ui-sm px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer hover:bg-surface-container-low"
                        >
                            <option value="all">All Levels</option>
                            <option value="very_high">Very High (Regional)</option>
                            <option value="high">High (Metro)</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-center h-[42px]">
                        <button
                            onClick={onReset}
                            disabled={!hasActiveFilters}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-ui-sm font-bold transition-all
            ${hasActiveFilters
                                    ? 'text-primary hover:bg-primary/5 cursor-pointer'
                                    : 'text-on-surface-variant opacity-20 cursor-default'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
