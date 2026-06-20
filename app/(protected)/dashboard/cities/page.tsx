import { createClient } from '@/lib/supabase/server';
import { CityExplorer } from '@/components/cities';
import type { City } from '@/components/cities/CityCards'; // export City type from there

export const revalidate = 3600; // Cache for 1 hour

async function getCities(): Promise<City[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cities')
        .select('*, countries!inner(slug)')
        .order('rating', { ascending: false });

    if (error) {
        console.error('Failed to fetch cities:', error);
        return []; // fallback – you can also throw to trigger error.tsx
    }
    return (data as City[]) ?? [];
}

export default async function CitiesPage() {
    const cities = await getCities();

    return <CityExplorer cities={cities} />;
}