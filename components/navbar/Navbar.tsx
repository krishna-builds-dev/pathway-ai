"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserNavControls from "@/components/header/UserNavControls";
import { createClient } from "@/lib/supabase/client";

const segmentDisplayNames: Record<string, string> = {
  ai: "AI Advisor",
  sop: "SOP Builder",
  visa: "Visa Checklist",
  resume: "Resume Builder",
  profile: "Profile",
  dashboard: "Dashboard",
};

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const rawSegments = pathname?.split("/").filter(Boolean) || [];

  // Remove the leading "dashboard" segment if there are deeper pages
  const pathSegments =
    rawSegments[0] === "dashboard" && rawSegments.length > 1
      ? rawSegments.slice(1)
      : rawSegments;

  const formatSegment = (segment: string) => {
    if (segmentDisplayNames[segment]) {
      return segmentDisplayNames[segment];
    }
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isUUID = (s: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

  const lastSegment = pathSegments[pathSegments.length - 1] ?? "";
  const lastIsUUID = isUUID(lastSegment);

  const [entityTitle, setEntityTitle] = useState<string | null>(null);
  useEffect(() => {
    if (!lastIsUUID) {
      setEntityTitle(null);
      return;
    }
    const parentSegment = pathSegments[pathSegments.length - 2] ?? "";
    const supabase = createClient();
    (async () => {
      if (parentSegment === "courses") {
        const { data } = await supabase
          .from("courses")
          .select("title")
          .eq("id", lastSegment)
          .single();
        setEntityTitle(data?.title ?? null);
      }
    })();
  }, [lastSegment, lastIsUUID]);

  const pageTitle = entityTitle ??
    (lastIsUUID ? "Detail" : formatSegment(lastSegment) || "Dashboard");

  return (
    <header className="sticky top-0 z-40 bg-[#fcf8ff]/80 backdrop-blur-md border-b border-outline-variant/40 flex items-center h-16 px-4 md:px-8 shadow-sm gap-4">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      )}

      <div className="flex flex-col justify-center min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="text-[11px]">Home</span>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const formattedName =
              isLast && lastIsUUID
                ? entityTitle ?? "Detail"
                : isUUID(segment)
                  ? "Detail"
                  : formatSegment(segment);
            return (
              <React.Fragment key={segment}>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <span
                  className={`text-[11px] truncate ${isLast ? "text-[#1e00a9] font-semibold" : ""
                    }`}
                >
                  {formattedName}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        <h2 className="font-geist text-[16px] md:text-[18px] font-bold text-[#1b1b24] leading-tight mt-0.5 truncate">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <UserNavControls />
      </div>
    </header>
  );
}