"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CoursesHeader from "./CoursesHeader";
import CoursesSidebar from "./CoursesSidebar";
import CoursesList from "./CoursesList";
import CoursesPagination from "./CoursesPagination";
import type { Course } from "./CoursesList";

interface CoursesClientProps {
    initialCourses?: Course[];
}


const ITEMS_PER_PAGE = 10;



export default function CoursesClient({ initialCourses }: CoursesClientProps) {


    const [allCourses, setAllCourses] = useState<Course[]>(initialCourses ?? []);
    const [loading, setLoading] = useState(!initialCourses);
    const supabase = useMemo(() => createClient(), []);
    const searchParams = useSearchParams();

    // 1. Initialize filters from URL (for deep‑linking) – no validation
    const [filters, setFilters] = useState(() => ({
        q: searchParams.get("q") || "",
        category: searchParams.get("category") || "all",
        level: searchParams.get("level") || "all",
        country: searchParams.get("country") || "all",
        city: searchParams.get("city") || "all",
        maxFee: searchParams.get("maxFee") || "any",
    }));

    const [page, setPage] = useState(1);

    // 2. Fetch all courses once
    useEffect(() => {
        if (initialCourses && initialCourses.length > 0) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("courses")
                    .select("*, cities!inner(name, countries!inner(slug))")
                    .order("is_high_demand", { ascending: false });
                if (error) throw error;
                setAllCourses(data || []);
            } catch (err) {
                console.error("Failed to load courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [supabase, initialCourses]);

    // 3. Keep URL in sync with filters + page (for bookmarking / sharing)
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all" && value !== "any") {
                params.set(key, value);
            }
        });
        if (page > 1) params.set("page", String(page));
        const newPath = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;
        window.history.replaceState(null, "", newPath);
    }, [filters, page]);

    // 4. Filter locally
    const filteredCourses = useMemo(() => {
        return allCourses.filter((course) => {
            if (filters.q) {
                const q = filters.q.toLowerCase();
                if (
                    !course.title.toLowerCase().includes(q) &&
                    !course.university_name.toLowerCase().includes(q)
                )
                    return false;
            }
            if (filters.category !== "all" && !course.category.toLowerCase().includes(filters.category))
                return false;
            if (filters.level !== "all" && course.level.toLowerCase() !== filters.level)
                return false;
            if (filters.country !== "all" && course.cities?.countries?.slug !== filters.country)
                return false;
            if (filters.city !== "all" && course.cities?.name?.toLowerCase() !== filters.city)
                return false;
            if (filters.maxFee !== "any") {
                if (filters.maxFee === "low" && course.fee_numeric > 50000) return false;
                if (filters.maxFee === "medium" && (course.fee_numeric <= 50000 || course.fee_numeric > 100000)) return false;
                if (filters.maxFee === "high" && course.fee_numeric <= 100000) return false;
            }
            return true;
        });
    }, [allCourses, filters]);

    const totalCount = filteredCourses.length;
    const paginatedCourses = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCourses, page]);

    // 5. Handlers that update local state directly
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            q: "",
            category: "all",
            level: "all",
            country: "all",
            city: "all",
            maxFee: "any",
        });
        setPage(1);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setFilters((prev) => ({ ...prev, q: query }));
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="max-w-container-max mx-auto  pb-5">
            <CoursesHeader initialQuery={filters.q} onSearch={handleSearch} />
            <div className="flex flex-col lg:flex-row gap-gutter mt-stack-md">
                <aside className="lg:w-80 shrink-0">
                    <CoursesSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                    />
                </aside>
                <main className="flex-1">
                    <CoursesList
                        filters={filters}
                        page={page}
                        totalCount={totalCount}
                        onTotalCountChange={() => { }}
                        courses={paginatedCourses}
                        loading={loading}
                        onResetFilters={handleResetFilters}
                    />
                    <CoursesPagination
                        currentPage={page}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                    />
                </main>
            </div>
        </div>
    );
}