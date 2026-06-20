"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CoursesSidebarProps {
    filters: {
        q: string;
        category: string;
        level: string;
        country: string;
        city: string;
        maxFee: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onResetFilters: () => void;
}

export default function CoursesSidebar({
    filters,
    onFilterChange,
    onResetFilters,
}: CoursesSidebarProps) {
    const [cities, setCities] = useState<any[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [citiesError, setCitiesError] = useState(false);
      const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchCities = async () => {
            setCitiesLoading(true);
            setCitiesError(false);
            try {
                const { data, error } = await supabase
                    .from("cities")
                    .select("name, countries(slug)")
                    .order("name");
                if (error) throw error;
                if (data) setCities(data);
            } catch (err) {
                console.error("Failed to fetch cities:", err);
                setCitiesError(true);
            } finally {
                setCitiesLoading(false);
            }
        };
        fetchCities();
    }, [supabase]);

    const handleCountryChange = (c: string) => {
        onFilterChange("country", c);
        if (filters.city !== "all" && c !== "all") {
            const selectedCityObj = cities.find(
                (city) => city.name.toLowerCase() === filters.city.toLowerCase()
            );
            const countrySlug =
                selectedCityObj?.countries && !Array.isArray(selectedCityObj.countries)
                    ? selectedCityObj.countries.slug
                    : selectedCityObj?.countries?.[0]?.slug || "";

            if (selectedCityObj && countrySlug !== c) {
                onFilterChange("city", "all");
            }
        }
    };

    const handleReset = () => {
        onResetFilters();
    };

    const filteredCities = cities.filter((city) => {
        if (filters.country === "all") return true;
        const countrySlug =
            city.countries && !Array.isArray(city.countries)
                ? city.countries.slug
                : city.countries?.[0]?.slug || "";
        return countrySlug === filters.country;
    });

    const hasActiveFilters =
        filters.q !== "" ||
        filters.category !== "all" ||
        filters.level !== "all" ||
        filters.country !== "all" ||
        filters.city !== "all" ||
        filters.maxFee !== "any";

    return (
         <>
      {/* Mobile toggle button – only visible on small screens */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border border-outline-variant rounded-xl shadow-sm text-sm font-semibold text-on-surface"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Filters
          </span>
          <span className="material-symbols-outlined text-[20px]">
            {mobileFiltersOpen ? "close" : "arrow_drop_down"}
          </span>
        </button>
      </div>

      {/* Filter card – hidden on mobile unless toggled, always visible on desktop */}
      <div
        className={`${
          mobileFiltersOpen ? "block" : "hidden"
        } lg:block flex flex-col gap-6 md:gap-8 bg-white/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-outline-variant shadow-sm h-fit lg:sticky lg:top-24`}
      >
        {/* Header */}
        <div className="flex justify-between items-center md:mb-3 md:gap-8">
          <h3 className="text-lg md:text-xl font-bold text-on-surface">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-primary cursor-pointer text-xs font-bold hover:underline"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2 md:mb-3 md:gap-3">
          <p className="font-label-caps text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
            Destination
          </p>
          <div className="flex flex-col gap-2">
            {["all", "australia", "new-zealand"].map((c) => (
              <label key={c} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  checked={filters.country === c}
                  onChange={() => handleCountryChange(c)}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant transition-all cursor-pointer"
                />
                <span
                  className={`text-xs md:text-sm ${
                    filters.country === c
                      ? "text-primary font-bold"
                      : "text-on-surface-variant group-hover:text-on-surface"
                  } transition-colors`}
                >
                  {c === "all"
                    ? "All Countries"
                    : c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2 md:mb-3 md:gap-3">
          <p className="font-label-caps text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
            Field of Study
          </p>
          <select
            value={filters.category.toLowerCase()}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
          >
            <option value="all">All Fields</option>
            <option value="technology">IT</option>
            <option value="healthcare">Healthcare</option>
            <option value="business">Business</option>
            <option value="engineering">Engineering</option>
            <option value="education">Education</option>
          </select>
        </div>

        {/* Level of Study */}
        <div className="flex flex-col gap-2 md:mb-3 md:gap-3">
          <p className="font-label-caps text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
            Level of Study
          </p>
          <select
            value={filters.level.toLowerCase()}
            onChange={(e) => onFilterChange("level", e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="bachelor">Bachelor&apos;s Degree</option>
            <option value="master">Master&apos;s Degree</option>
          </select>
        </div>

        {/* Tuition Range */}
        <div className="flex flex-col gap-2 md:mb-3 md:gap-3">
          <p className="font-label-caps text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
            Annual Tuition
          </p>
          <select
            value={filters.maxFee}
            onChange={(e) => onFilterChange("maxFee", e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
          >
            <option value="any">Any Budget</option>
            <option value="low">Budget ($0 – $50k)</option>
            <option value="medium">Moderate ($50k – $100k)</option>
            <option value="high">Premium ($100k+)</option>
          </select>
        </div>

        {/* City Filter */}
        <div className="flex flex-col gap-2 md:mb-3 md:gap-3">
          <p className="font-label-caps text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
            City
          </p>
          <select
            value={filters.city.toLowerCase()}
            onChange={(e) => onFilterChange("city", e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
            disabled={citiesLoading || citiesError}
          >
            {citiesLoading ? (
              <option>All Cities</option>
            ) : citiesError ? (
              <option>Error loading cities</option>
            ) : (
              <>
                <option value="all">All Cities</option>
                {filteredCities.map((city) => (
                  <option key={city.name} value={city.name.toLowerCase()}>
                    {city.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>
    </>
    );
}