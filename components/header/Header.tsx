"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { PathwayLogo } from "../icon/Icons";
import { useUserMeta } from "@/hooks/useUserMeta";
import { useState, useRef, useEffect } from "react";
import UserNavControls from "./UserNavControls";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, supabase } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const { avatarUrl, fullName, initials } = useUserMeta(user);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                !(event.target instanceof HTMLElement && event.target.closest(".mobile-menu-toggle"))
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lock / unlock body scroll when mobile menu opens or closes
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    // Close menus on route change
    useEffect(() => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navItems = [
        { name: "About us", href: "/about" },
        { name: "Ai studio", href: "/ai" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 glass-header border-b border-outline-variant/30">
                <div className="flex justify-between items-center px-margin py-4 max-w-container-max mx-auto">
                    {/* ---- Mobile hamburger (left, hidden on desktop) ---- */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mobile-menu-toggle md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? (
                            <span className="material-symbols-outlined text-2xl">close</span>
                        ) : (
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        )}
                    </button>

                    {/* ---- Logo (centered on mobile via flex, natural on desktop) ---- */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="hidden sm:block group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <PathwayLogo className="w-8 h-8" />
                        </div>
                        <div className="font-geist text-2xl md:text-h2-dashboard font-bold text-primary">
                            Pathway AI
                        </div>
                    </Link>

                    {/* ---- Desktop Navigation (unchanged, hidden on mobile) ---- */}
                    <div className="hidden md:flex items-center gap-stack-md">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative group py-1 font-geist text-ui-sm transition-colors duration-300 ${isActive
                                        ? "text-primary"
                                        : "text-on-surface-variant hover:text-primary"
                                        }`}
                                >
                                    {item.name}
                                    <span
                                        className={`absolute left-0 bottom-0 h-[2px] bg-primary rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* ---- Auth / User controls (always visible on right) ---- */}
                    <div className="flex items-center gap-4">
                        {/* Desktop auth (visible on md and up) – unchanged */}
                        <div className="hidden md:block">
                            {user ? (
                                <UserNavControls />
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="px-6 py-2  bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                        {/* Mobile auth – only avatar/sign‑in button (no extra controls) */}
                        <div className="md:hidden">
                            {user ? (
                                <UserNavControls />
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="px-3 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:opacity-90 transition-all"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu – always rendered, slides in/out from the left via transform */}
                <div
                    ref={mobileMenuRef}
                    className={`md:hidden min-h-screen fixed inset-0 top-[65px] z-40 w-full bg-surface-container-lowest px-6 pt-6 pb-24 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <p className="text-xs text-center font-semibold uppercase tracking-widest text-on-surface-variant/50 mb-2 px-2">
                        Navigation
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block text-center px-4 py-3.5 rounded-xl font-geist font-medium text-base transition-all duration-200
                                    ${isActive
                                        ? "text-primary "
                                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}