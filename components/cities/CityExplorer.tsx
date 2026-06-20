"use client";

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CityHeader from './CityHeader';
import CityFilters from './CityFilters';
import CityCards from './CityCards';
import type { City, PrStrength } from './CityCards';

interface CityExplorerProps {
    cities: City[];
}

const VALID_COUNTRIES = ['australia', 'new-zealand'];
const VALID_COSTS = ['economy', 'moderate', 'high'];
const VALID_PR: PrStrength[] = ['low', 'medium', 'high', 'very_high'];

export default function CityExplorer({ cities }: CityExplorerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const rawCountry = searchParams.get('country') ?? '';
    const rawCost = searchParams.get('cost') ?? '';
    const rawPr = searchParams.get('pr') ?? '';

    const country = VALID_COUNTRIES.includes(rawCountry) ? rawCountry : 'all';
    const cost = VALID_COSTS.includes(rawCost) ? rawCost : 'any';
    const pr = (VALID_PR as string[]).includes(rawPr) ? rawPr : 'all';

    const filters = { country, cost, pr };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const normalizedValue = value.toLowerCase();

        if (normalizedValue === 'all' || normalizedValue === 'any') {
            params.delete(key);
        } else {
            params.set(key, normalizedValue);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleReset = () => {
        router.push(pathname, { scroll: false });
    };

    // Client‑side filtering – instant, no network
    const filteredCities = useMemo(() => {
        return cities.filter((city) => {
            if (country !== 'all' && city.countries.slug !== country) return false;
            if (pr !== 'all' && city.pr_strength !== pr) return false;
            if (cost === 'economy' && city.rent_numeric >= 1800) return false;
            if (cost === 'moderate' && (city.rent_numeric < 1800 || city.rent_numeric > 2200)) return false;
            if (cost === 'high' && city.rent_numeric <= 2200) return false;
            return true;
        });
    }, [cities, country, cost, pr]);

    return (
        <main className="py-5 max-w-container-max mx-auto ">
            <CityHeader />
            <CityFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />
            <CityCards cities={filteredCities} />
        </main>
    );
}