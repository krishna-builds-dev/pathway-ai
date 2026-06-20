// app/countries/page.tsx

import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CountriesClient from "./CountriesClient";

// … types …


export const revalidate = 3600;
// Types – keep the same as before
interface Course {
    title: string;
    category: string;
    is_high_demand: boolean;
}
interface City {
    id: string;
    name: string;
    rating: number | null;
    courses: Course[];
}
interface CountryRaw {
    id: string;
    slug: string;
    name: string;
    flag_emoji: string | null;
    hero_image_url: string | null;
    institution_type_label: string;
    institutions_count: number;
    min_wage: string | null;
    work_rights_short: string | null;
    psw_rights_short: string | null;
    lifestyle_label: string | null;
    healthcare_info: string | null;
    climate_info: string | null;
    avg_tuition_range: string | null;
    min_living_costs: string | null;
    cities: City[];
}
export interface Country extends CountryRaw {
    relational_cities: string[];
    relational_courses: string[];
}

async function getCountries(): Promise<Country[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("countries")
        .select(
            `*,
      cities(
        id, name, rating,
        courses(title, category, is_high_demand)
      )`
        )
        .order("name", { ascending: true });

    if (error || !data) {
        // Will be caught by the nearest error.tsx or we can handle in the server component
        throw new Error("Failed to fetch countries");
    }

    return (data as CountryRaw[]).map((country) => {
        const allCities = country.cities ?? [];
        const sortedCities = [...allCities].sort(
            (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );

        return {
            ...country,
            relational_cities: [...new Set(sortedCities.map((c) => c.name))].slice(0, 5),
            relational_courses: [
                ...new Set(
                    allCities
                        .flatMap((city) => city.courses ?? [])
                        .filter((c) => c.is_high_demand)
                        .map((c) => c.category)
                ),
            ].slice(0, 5),
        };
    });
}

export default async function CountriesPage() {
    const countries = await getCountries();

    return (
        <Suspense
            fallback={
                <div className="flex justify-center py-12 md:py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            }
        >
            <CountriesClient countries={countries} />
        </Suspense>
    );
}