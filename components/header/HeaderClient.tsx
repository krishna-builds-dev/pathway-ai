// components/HeaderClient.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../providers/AuthProvider";
import { PathwayLogo } from "../icon/Icons"; // Ensure this exists
import { useState, useRef, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export default function HeaderClient({ initialUser }: { initialUser: User | null }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user: contextUser, supabase } = useAuth();

    // STRATEGY: Use contextUser if available (live), otherwise initialUser (SSR prop)
    // This ensures the UI is correct on the very first paint.
    const user = contextUser || initialUser;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";
    const userInitials = fullName
        .split(" ")
        .map((n: string) => n[0]) // 👈 Add ': string' here
        .slice(0, 2)
        .join("")
        .toUpperCase();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error(error.message);
        router.push("/");
    };

    return (
        <header className="h-16 border-b flex items-center justify-between px-4 bg-surface sticky top-0 z-50">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <PathwayLogo />
                <span className="font-bold text-on-surface">Pathway AI</span>
            </Link>

            {/* Right Side */}
            {user ? (
                <div className="flex items-center gap-4" ref={dropdownRef}>
                    {/* Notifications */}
                    <button className="relative p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
                    </button>

                    <div className="h-8 w-px bg-outline-variant hidden sm:block"></div>

                    {/* Profile Dropdown */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary/10 flex items-center justify-center">
                                {avatarUrl ? (
                                    <img alt={fullName} src={avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-xs font-semibold text-primary">{userInitials}</span>
                                )}
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-surface border border-outline-variant rounded-xl shadow-xl overflow-hidden z-60">
                                <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-lowest">
                                    <p className="font-ui-sm text-ui-sm text-on-surface font-semibold truncate">{fullName}</p>
                                    <p className="text-[12px] text-on-surface-variant truncate">{user.email}</p>
                                </div>
                                <div className="py-1">
                                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
                                    </Link>
                                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">person</span> My Profile
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                                    </Link>
                                </div>
                                <div className="py-1 border-t border-outline-variant bg-surface-container-lowest">
                                    <button onClick={() => { setIsDropdownOpen(false); handleSignOut(); }} className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20">
                                        <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden p-2 text-on-surface-variant">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-on-surface-variant hover:text-primary">Sign In</Link>
                    <Link href="/get-started" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90">Get Started</Link>
                </div>
            )}
        </header>
    );
}   