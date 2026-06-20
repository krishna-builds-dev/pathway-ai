"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function FeaturedCountries() {
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchCountries = async () => {
            const { data } = await supabase
                .from('countries')
                .select('*')
                .order('name', { ascending: true });

            if (data) setCountries(data);
            setLoading(false);
        };
        fetchCountries();
    }, [supabase]);

    return (
        <section className="py-stack-lg bg-surface-container-highest">
            <div className="max-w-container-max mx-auto px-margin">
                <div className="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-4">
                    <div>
                        <h2 className="font-h1-marketing text-h1-marketing text-on-surface">Top Destinations</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">Start your journey in the world's most livable regions.</p>
                    </div>
                    <Link href="/dashboard/countries" className="cursor-pointer font-label-caps text-label-caps text-primary border-b-3 border-primary-fixed hover:border-primary transition-all pb-1">View All Countries</Link>
                </div>

                <div className="grid md:grid-cols-2 gap-stack-md">
                    {loading ? (
                        // Basic Skeleton
                        <>
                            <div className="h-[400px] rounded-3xl bg-surface-container-high animate-pulse"></div>
                            <div className="h-[400px] rounded-3xl bg-surface-container-high animate-pulse"></div>
                        </>
                    ) : (
                        countries.map((country) => (
                            <Link
                                href={`/dashboard/countries?tab=${country.slug}`}
                                key={country.id}
                                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
                            >
                                <Image
                                    src={`/images/index/${country.hero_image_url}`}
                                    alt={country.name}
                                    fill
                                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 p-stack-md text-white ">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl select-invert">{country.flag_emoji}</span>
                                        <h3 className="font-h1-marketing text-3xl select-invert">{country.name}</h3>
                                    </div>
                                    <div className="flex gap-stack-md">
                                        <div>
                                            <p className="text-white/60 font-label-caps text-[10px] uppercase select-invert">Univs</p>
                                            <p className="font-bold select-invert">{country.total_institutions} {country.institution_type_label}</p>
                                        </div>
                                        {country.slug === 'australia' ? (
                                            <>
                                                <div>
                                                    <p className="text-white/60 font-label-caps text-[10px] uppercase select-invert">Work Rights</p>
                                                    <p className="font-bold select-invert">{country.work_rights_short}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-white/60 font-label-caps text-[10px] uppercase select-invert">Lifestyle</p>
                                                    <p className="font-bold select-invert">{country.lifestyle_label}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/60 font-label-caps text-[10px] uppercase select-invert">PSW Rights</p>
                                                    <p className="font-bold select-invert">{country.psw_rights_short}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}