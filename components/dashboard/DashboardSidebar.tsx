"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PathwayLogo } from "@/components/icon/Icons";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "SOP Builder", href: "/dashboard/sop", icon: "edit_note" },
  { name: "Resume Builder", href: "/dashboard/resume", icon: "badge" },
  { name: "Visa Checklist", href: "/dashboard/visa", icon: "fact_check" },
  { name: "Advisor", href: "/dashboard/advisor", icon: "psychology" },
];

const additionalLinks = [
  { name: "Countries", href: "/dashboard/countries", icon: "flag" },
  { name: "Cities", href: "/dashboard/cities", icon: "location_on" },
  { name: "Courses", href: "/dashboard/courses", icon: "book" },
];

export default function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#ffffff] border-r border-outline-variant/40 flex flex-col py-6 px-4 shadow-sm z-50">
      {/* Mobile close button – only visible on small screens */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      )}

      {/* Logo */}
      <Link href="/dashboard">
        <div className="mb-8 px-2 flex items-center gap-3">
          <PathwayLogo className="w-10 h-10" />
          <div>
            <h1 className="font-geist text-[18px] font-bold text-[#1e00a9] leading-tight">
              Pathway
            </h1>
            <p className="text-[11px] text-on-surface-variant opacity-70">
              Academic Excellence
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium ${active
                ? "bg-primary-fixed text-[#1e00a9] font-bold"
                : "text-on-surface-variant hover:bg-[#f0ecf9] hover:text-[#1e00a9]"
                }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 px-3 mt-4 mb-2">
          Explore
        </p>
        {additionalLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium ${active
                ? "bg-primary-fixed text-[#1e00a9] font-bold"
                : "text-on-surface-variant hover:bg-[#f0ecf9] hover:text-[#1e00a9]"
                }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}