"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AuthProvider";


// ─── Types (exported so page.tsx can use) ────────────────────────────────────

export interface Course {
    id: string;
    title: string;
    university_name: string;
    category: string;
    level: string;
    duration: string;
    fee_numeric: number;
    intake_months: number[];
    pr_pathway: boolean;
    is_high_demand: boolean;
    image_url: string;
    requirements?: string[];
    career_outcomes?: string[];
    course_url?: string;
    description?: string;
    cities: {
        name: string;
        countries: {
            slug: string;
        };
    };
}

interface CoursesListProps {
    filters: {
        q: string;
        category: string;
        level: string;
        country: string;
        city: string;
        maxFee: string;
    };
    page: number;
    totalCount: number;
    onTotalCountChange: (count: number) => void;   // no‑op now, kept for compatibility
    courses: Course[];                             // pre‑filtered & paginated
    loading: boolean;                              // parent loading state
    onResetFilters: () => void;   // ✅ new
}

// ─── Helper functions ────────────────────────────────────────────────────────

const MONTHS_MAP: { [key: number]: string } = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
};

const formatFee = (fee: number, countrySlug: string) => {
    if (!fee) return "N/A";
    const currency = countrySlug === "new-zealand" ? "NZD" : "AUD";
    return `${currency} $${fee.toLocaleString()}`;
};

const formatIntake = (months: number[]) => {
    if (!months || months.length === 0) return "N/A";
    return months.map((m) => MONTHS_MAP[m] || m).join(", ");
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CoursesList({
    filters,
    page,
    totalCount,
    onTotalCountChange,
    courses,
    loading,
    onResetFilters
}: CoursesListProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);




    // ─── Loading State ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-48 bg-surface-container-high rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // ─── Empty State ───────────────────────────────────────────────────────────
    if (courses.length === 0) {
        return (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 opacity-20">
                    search_off
                </span>
                <h3 className="text-xl font-bold text-on-surface">No courses found</h3>
                <p className="text-on-surface-variant">
                    Try broadening your search or adjusting the filters.
                </p>
                <button
                    onClick={onResetFilters}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-ui-sm hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                    Clear Filters
                </button>
            </div>

        );
    }

    // ─── Main Content ──────────────────────────────────────────────────────────
    const startItem = (page - 1) * 10 + 1;
    const endItem = (page - 1) * 10 + courses.length;

    return (
        <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-0">
            {/* Showing results text */}
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-ui-sm font-medium text-on-surface-variant">
                    Showing{" "}
                    <span className="text-on-surface font-bold">
                        {startItem} - {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="text-on-surface font-bold">{totalCount} courses</span>{" "}
                    matching your criteria
                </p>
            </div>

            {/* Course Cards */}
            {courses.map((course) => (
                <div
                    key={course.id}
                    className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                    {/* Left side - Info */}
                    <div className="p-4 md:p-6 flex-1 flex flex-col gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="hidden md:inline-block bg-primary-container/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {course.category}
                                    </span>
                                    {/* High Demand – hidden on mobile, visible on md+ */}
                                    {course.is_high_demand && (
                                        <span className="hidden md:inline-block bg-tertiary-container/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            High Demand
                                        </span>
                                    )}
                                </div>
                                <Link href={`/dashboard/courses/${course.id}`}>
                                    <h3 className="text-base md:text-xl font-bold text-on-surface hover:text-primary transition-colors leading-tight cursor-pointer">
                                        {course.title}
                                    </h3>
                                </Link>
                                <p className="text-xs md:text-ui-sm font-medium text-on-surface-variant mt-1">
                                    {course.university_name}
                                </p>
                            </div>
                            {course.pr_pathway && (
                                <div className="flex flex-col items-end shrink-0">
                                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                                        PR Pathway
                                    </span>
                                    <span className="material-symbols-outlined text-tertiary fill-current">
                                        verified
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 py-3 md:py-4 border-y border-outline-variant/30">
                            <div className="flex flex-col">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">
                                    Duration
                                </span>
                                <span className="text-xs md:text-ui-sm font-bold text-on-surface">
                                    {course.duration}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">
                                    Annual Fee
                                </span>
                                <span className="text-xs md:text-ui-sm font-bold text-on-surface">
                                    {formatFee(course.fee_numeric, course.cities.countries.slug)}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">
                                    Next Intake
                                </span>
                                <span className="text-xs md:text-ui-sm font-bold text-on-surface">
                                    {formatIntake(course.intake_months)}
                                </span>
                            </div>
                        </div>

                        {/* Tags – hidden on mobile, visible on md+ */}
                        <div className="hidden md:flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] rounded-lg font-bold border border-outline-variant/30">
                                {course.level} Level
                            </span>
                            <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] rounded-lg font-bold border border-outline-variant/30 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                {course.cities.name},{" "}
                                {course.cities.countries.slug === "australia"
                                    ? "Australia"
                                    : "New Zealand"}
                            </span>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="p-4 md:p-6 bg-surface-container-low/30 md:w-56 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-outline-variant/50">
                        <Link
                            href={`/dashboard/courses/${course.id}`}
                            className="w-full py-3 md:py-4 bg-primary text-on-primary rounded-xl font-bold text-xs md:text-ui-sm shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all select-invert active:scale-95 cursor-pointer text-center block"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ))}

            {/* Auth Modal (for save action) */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}