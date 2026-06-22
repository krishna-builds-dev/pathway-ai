"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";   // ✅ new import

interface CoursesHeaderProps {
    initialQuery?: string;
    onSearch?: (query: string) => void;
}

interface SuggestionItem {
    type: "course" | "university";
    text: string;
    subtext?: string;
    id: string;                 // ✅ new field for course ID
}

export default function CoursesHeader({
    initialQuery = "",
    onSearch,
}: CoursesHeaderProps) {
    const [tempQuery, setTempQuery] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();   // ✅ for navigation

    // Sync with external filter changes (e.g., reset)
    useEffect(() => {
        setTempQuery(initialQuery);
    }, [initialQuery]);

    // Debounced search
    useEffect(() => {
        if (tempQuery.trim().length < 1) {
            setSuggestions([]);
            setLoadingSuggestions(false);
            return;
        }

        setLoadingSuggestions(true);

        const delayDebounceFn = setTimeout(async () => {
            try {
                const { data } = await supabase
                    .from("courses")
                    .select("id, title, university_name")   // ✅ also select id
                    .or(`title.ilike."%${tempQuery}%",university_name.ilike."%${tempQuery}%"`)
                    .limit(15);

                if (data) {
                    const seen = new Set<string>();
                    const parsedList: SuggestionItem[] = [];

                    data.forEach((item: any) => {
                        const key = `${item.title}|${item.university_name}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            parsedList.push({
                                type: "course",
                                text: item.title,
                                subtext: item.university_name,
                                id: item.id,                    // ✅ store the course ID
                            });
                        }
                    });

                    setSuggestions(parsedList.slice(0, 6));
                }
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [tempQuery, supabase]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Submit for traditional search (Enter key / button click)
    const handleSearchSubmit = (searchVal: string) => {
        setShowSuggestions(false);
        inputRef.current?.blur();
        if (onSearch) {
            onSearch(searchVal);
        }
    };

    // ✅ Click a suggestion → navigate directly to course detail
    const handleSuggestionClick = (item: SuggestionItem) => {
        setShowSuggestions(false);
        inputRef.current?.blur();
        router.push(`/courses/${item.id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                e.preventDefault();
                handleSuggestionClick(suggestions[highlightedIndex]);
            } else {
                handleSearchSubmit(tempQuery);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setShowSuggestions(true);
            setHighlightedIndex((prev) =>
                Math.min(prev + 1, suggestions.length - 1)
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
    };

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;
        const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const parts = text.split(new RegExp(`(${escaped})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={i} className="text-primary font-extrabold">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            <div className="relative w-full flex flex-col sm:flex-row gap-2">
  {/* Search icon – hidden on mobile, absolutely centred inside the input on desktop */}
  <span className="hidden sm:flex absolute inset-y-0 left-0 pl-4 items-center pointer-events-none text-outline">
    <span className="material-symbols-outlined text-[20px]">search</span>
  </span>
  <input
    ref={inputRef}
    className="w-full pl-4 sm:pl-12 pr-4 sm:pr-28 py-3 sm:py-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm text-sm md:text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
    placeholder="Search courses or universities..."
    type="text"
    value={tempQuery}
    onChange={(e) => {
      setTempQuery(e.target.value);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    }}
    onFocus={() => setShowSuggestions(true)}
    onKeyDown={handleKeyDown}
  />
  <button
    onClick={() => handleSearchSubmit(tempQuery)}
    className="w-full sm:w-auto px-5 py-2.5 bg-secondary text-on-secondary hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-lg text-sm md:text-ui-sm font-semibold cursor-pointer shadow-sm"
  >
    Search
  </button>
</div>
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && tempQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-100 max-h-72 sm:max-h-80 overflow-y-auto backdrop-blur-md max-w-[100vw] sm:max-w-none">
                    {/* Loading state */}
                    {loadingSuggestions && (
                        <div className="flex items-center gap-3 px-4 py-3 text-on-surface-variant">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Searching...</span>
                        </div>
                    )}

                    {/* Results */}
                    {!loadingSuggestions &&
                        suggestions.length > 0 &&
                        suggestions.map((item, idx) => {
                            const isHighlighted = idx === highlightedIndex;
                            return (
                                <div
                                    key={`${item.type}-${item.text}-${idx}`}
                                    onClick={() => handleSuggestionClick(item)}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    className={`flex items-center justify-between gap-4 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-outline-variant/30 last:border-b-0
                ${isHighlighted ? "bg-primary/5 text-primary" : "hover:bg-surface-container-low/40"}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div
                                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isHighlighted
                                                ? "bg-primary/10 text-primary"
                                                : "bg-surface-container-low text-on-surface-variant"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">book</span>
                                        </div>
                                        <div className="min-w-0 flex flex-col flex-1">
                                            <span className="text-sm font-semibold text-on-surface truncate">
                                                {highlightText(item.text, tempQuery)}
                                            </span>
                                            {item.subtext && (
                                                <span className="text-xs text-on-surface-variant truncate">
                                                    {highlightText(item.subtext, tempQuery)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    {/* No results state */}
                    {!loadingSuggestions && suggestions.length === 0 && (
                        <div className="flex items-center gap-3 px-4 py-3 text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg">search_off</span>
                            <span className="text-sm">No courses found for &quot;{tempQuery}&quot;</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}