"use client";

import Link from "next/link";

interface Country {
    id: string;
    name: string;
    slug: string;
    flag_emoji?: string | null;
    hero_image_url?: string | null;
    institutions_count: number;
    institution_type_label: string;
    work_rights_short?: string | null;
    psw_rights_short?: string | null;
    lifestyle_label?: string | null;
    healthcare_info?: string | null;
    climate_info?: string | null;
    avg_tuition_range?: string | null;
    min_living_costs?: string | null;
    top_cities?: string | string[] | null;
    popular_courses?: string | null;
    min_wage?: string | null;
    relational_cities?: string[];
    relational_courses?: string[];
}

function CountryCard({ country }: { country: Country }) {
    const stats = [
        { label: country.institution_type_label || 'Universities', value: country.institutions_count, icon: 'account_balance', color: 'text-primary' },
        { label: 'Min. Wage', value: country.min_wage, icon: 'payments', color: 'text-primary' },
        { label: 'Avg. Tuition', value: country.avg_tuition_range, icon: 'account_balance_wallet', color: 'text-primary' },
    ];

    const citiesList = country.relational_cities && country.relational_cities.length > 0
        ? country.relational_cities
        : (typeof country.top_cities === 'string'
            ? country.top_cities.split(',').map(s => s.trim())
            : (country.top_cities || []));

    const coursesList = country.relational_courses && country.relational_courses.length > 0
        ? country.relational_courses
        : (country.popular_courses || '').split(',').map(s => s.trim()).filter(Boolean);

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-primary/10 shrink-0">
                        {country.flag_emoji}
                    </div>
                    <div>
                        <h2 className="text-lg md:text-h2-dashboard font-bold text-on-surface">{country.name}</h2>
                        <p className="text-[9px] md:text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">International Pathway</p>
                    </div>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold border border-primary/20 whitespace-nowrap shrink-0 hidden md:inline-block">
                    {country.lifestyle_label}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-surface-container-low p-3 md:p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-bright transition-colors shadow-sm">
                        <div className={`material-symbols-outlined ${stat.color} text-[18px] md:text-[20px] mb-1 md:mb-2`}>{stat.icon}</div>
                        <p className="text-on-surface-variant text-[9px] md:text-[10px] uppercase tracking-wider mb-1 opacity-70">{stat.label}</p>
                        <p className="font-bold text-on-surface text-base md:text-lg leading-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8 pt-4 md:pt-6 px-2 md:px-4 border-t border-outline-variant/50">
                <div className="flex gap-3">
                    <div className="material-symbols-outlined text-primary text-xl">globe_location_pin</div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] md:text-label-caps text-on-surface-variant uppercase">Top Cities</span>
                        <div className="flex flex-wrap gap-2">
                            {citiesList.map((city, idx) => (
                                <Link
                                    key={idx}
                                    href={`/dashboard/courses?city=${city.toLowerCase()}`}
                                    className="text-xs md:text-ui-sm font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    {city}{idx < citiesList.length - 1 ? ',' : ''}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="material-symbols-outlined text-primary text-xl">school</div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] md:text-label-caps text-on-surface-variant uppercase">Popular Courses</span>
                        <div className="flex flex-wrap gap-2">
                            {coursesList.map((course, idx) => (
                                <Link
                                    key={idx}
                                    href={`/dashboard/courses?category=${course.toLowerCase()}&country=${country.slug.toLowerCase()}`}
                                    className="text-xs md:text-ui-sm font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    {course}{idx < coursesList.length - 1 ? ',' : ''}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-low/50 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row justify-between gap-3 md:gap-4 border border-outline-variant/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">work_history</span>
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase">Post-Study Work</p>
                        <p className="font-normal md:font-bold text-on-surface text-xs md:text-sm">{country.psw_rights_short}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">savings</span>
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase">Min. Living Cost</p>
                        <p className="font-normal md:font-bold text-on-surface text-xs md:text-sm">
                            {country.min_living_costs} <span className="font-normal opacity-60 text-[10px] md:text-[11px]">/ year</span>
                        </p>
                    </div>
                </div>
            </div>

            <Link
                href={`/dashboard/courses?country=${country.slug}`}
                className="select-invert w-full mt-4 md:mt-6 bg-primary text-on-primary py-3 md:py-4 rounded-xl font-normal md:font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-primary/90 hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer group/btn active:scale-[0.98] text-sm md:text-base"
            >
                Explore Courses in {country.name}
           
            </Link>
        </div>
    );
}

export default function CountryCards({ countries, selectedSlug }: { countries: Country[], selectedSlug?: string }) {
    const filteredCountries = selectedSlug && selectedSlug !== 'side-by-side'
        ? countries.filter(c => c.slug === selectedSlug)
        : countries;

    return (
        <section className={`max-w-container-max mx-auto px-4 md:px-0 grid grid-cols-1 ${filteredCountries.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'} gap-4 md:gap-gutter mb-8 lg:mb-stack-lg`}>
            {filteredCountries.map((country) => (
                <CountryCard key={country.id} country={country} />
            ))}
        </section>
    );
}