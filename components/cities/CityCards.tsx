"use client";

import Image from 'next/image';
import Link from 'next/link';

// ─── Types (exported so page.tsx can use it) ──────────────────────────────────

export type PrStrength = 'low' | 'medium' | 'high' | 'very_high';
export type BadgeType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'success' | 'danger';

export interface City {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    rating: number;
    badge_text: string;
    badge_type: BadgeType;
    rent_numeric: number;
    safety_score: string;
    image_url: string;
    tags: string[];
    pr_strength: PrStrength;
    countries: { slug: string };
}

interface CityCardsProps {
    cities: City[];
}

const badgeColors: Record<BadgeType, string> = {
    primary: 'bg-primary/90 select-invert',
    secondary: 'bg-secondary/90 select-invert',
    tertiary: 'bg-tertiary/90 select-invert',
    warning: 'bg-amber-500/90 select-invert',
    success: 'bg-emerald-500/90 select-invert',
    danger: 'bg-red-500/90 select-invert',
};

function tagIcon(_tag: string): string {
    return 'label'; // restore your mapping later
}

export default function CityCards({ cities }: CityCardsProps) {
    if (cities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 gap-3 text-center mt-8 md:mt-12">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-on-surface-variant opacity-40">search_off</span>
                <p className="text-base md:text-lg font-semibold text-on-surface">No cities match your filters.</p>
                <p className="text-sm text-on-surface-variant">Try adjusting or clearing your filters.</p>
            </div>
        );
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-12 px-4 md:px-0">
            {cities.map((city) => (
                <div
                    key={city.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                >
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                        <Image
                            src={`/images/city-explorer/${city.image_url}`}
                            alt={city.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className={`absolute top-4 right-4 bg-primary/90 text-white font-label-caps text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md font-bold tracking-widest uppercase`}>
                            {city.badge_text}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 md:p-6 flex flex-col grow gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-on-surface leading-tight">
                                    {city.name}, {city.countries.slug === 'australia' ? 'AU' : 'NZ'}
                                </h3>
                                <p className="text-xs md:text-ui-sm text-on-surface-variant font-medium opacity-80">{city.subtitle}</p>
                            </div>
                            <div className="flex items-center text-tertiary">
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="font-ui-sm font-bold ml-1">{city.rating}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4 py-3 md:py-4 border-y border-outline-variant/30">
                            <div className="flex flex-col">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">Rent (Avg)</span>
                                <span className="text-sm md:text-lg font-bold text-on-surface">{city.countries.slug === 'new-zealand' ? 'NZD' : 'AUD'} ${city.rent_numeric.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">Safety Score</span>
                                <span className="text-sm md:text-lg font-bold text-on-surface">{city.safety_score}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className=" flex-wrap gap-2 pt-1 md:pt-2 hidden md:flex">
                            {city.tags.map((tag) => (
                                <span key={tag} className="bg-surface-container-high text-primary px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold flex items-center gap-1 md:gap-1.5 border border-primary/5">
                                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">{tagIcon(tag)}</span>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                        <Link
                            href={`/dashboard/courses?city=${city.slug}`}
                            className="select-invert w-full py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm md:text-ui-sm flex items-center justify-center gap-2 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 shadow-md"
                        >
                            <span className="material-symbols-outlined text-[18px]">school</span>
                            Explore Courses
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}