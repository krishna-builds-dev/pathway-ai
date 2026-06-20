// app/countries/CountriesClient.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  CountriesHeader,
  CountriesToggle,
  CountryCards,
  ComparisonTable,
} from "@/components/countries";
import type { Country } from "./page"; // import the type from server component

type TabType = "side-by-side" | "australia" | "new-zealand";

export default function CountriesClient({
  countries,
}: {
  countries: Country[];
}) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("side-by-side");

  // Deep-link from ?tab=...
  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && ["side-by-side", "australia", "new-zealand"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // No loading / error states needed – data is already fetched on the server

  return (
    <main className="py-5 ">
      <CountriesHeader />
      <CountriesToggle activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "side-by-side" ? (
        <ComparisonTable countries={countries} />
      ) : (
        <CountryCards countries={countries} selectedSlug={activeTab} />
      )}
    </main>
  );
}