"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserMeta } from "@/hooks/useUserMeta";
import UserAvatar from "./UserAvatar";
import { getUserProfile } from "@/app/(protected)/dashboard/profile/actions";
import { isProfileComplete as checkProfileComplete } from "@/lib/profile-utils";

export default function UserNavControls() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, supabase } = useAuth();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { avatarUrl: oauthAvatarUrl, fullName, initials } = useUserMeta(user);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(true);

    // Help tooltip state
    const [isHelpTooltipOpen, setIsHelpTooltipOpen] = useState(false);
    const helpRef = useRef<HTMLDivElement>(null);

    // Profile completeness
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);

    useEffect(() => {
        if (!user) {
            setAvatarLoading(false);
            return;
        }
        getUserProfile()
            .then(({ data }) => {
                setAvatarUrl(data?.avatar_url || oauthAvatarUrl);
                const { complete, missingFields } = checkProfileComplete(data);
                setIsProfileComplete(complete);
                setMissingFields(missingFields);
            })
            .finally(() => setAvatarLoading(false));
    }, [user, pathname, oauthAvatarUrl]);

    // Close dropdown and tooltip on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
                setIsHelpTooltipOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsDropdownOpen(false);
        setIsHelpTooltipOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
            return;
        }
        if (pathname.startsWith("/dashboard")) {
            window.location.href = '/';
        }
    };

    if (!user) return null;

    const handleHelpClick = () => {
        setIsHelpTooltipOpen(!isHelpTooltipOpen);
    };

    return (
        <div className="flex items-center gap-4" ref={dropdownRef}>
            <div className="relative inline-block text-left">
                <div className="flex items-center gap-2">
                    {/* Help icon with tooltip – hidden on mobile, visible on sm and up */}
                    <div ref={helpRef} className="relative hidden sm:block">
                        <button
                            onClick={handleHelpClick}
                            className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors p-1 pb-0"
                            aria-label="Profile help"
                        >
                            <span className="material-symbols-outlined text-[20px]">help_outline</span>
                        </button>

                        {isHelpTooltipOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-xl p-4 z-110 animate-in fade-in slide-in-from-top-2">
                                {isProfileComplete ? (
                                    <>
                                        <p className="text-sm text-on-surface mb-3">
                                            Your profile is looking great! You can still update your details anytime to keep your recommendations accurate.
                                        </p>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsHelpTooltipOpen(false)}
                                            className="text-primary font-bold text-sm inline-flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">person</span>
                                            <span className="hover:underline">Go to Profile →</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-on-surface mb-3">
                                            Complete your profile to unlock accurate recommendations and personalised guidance across all tools.
                                        </p>
                                        {missingFields.length > 0 && (
                                            <div className="mb-3 text-left bg-surface-container-high p-2 rounded-lg">
                                                <p className="text-xs font-semibold text-on-surface mb-1">Missing fields:</p>
                                                <ul className="list-disc list-inside text-xs text-on-surface-variant">
                                                    {missingFields.map((field) => (
                                                        <li key={field} className="capitalize">
                                                            {field.replace(/_/g, ' ')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsHelpTooltipOpen(false)}
                                            className="text-primary font-bold text-sm inline-flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">person</span>
                                            <span className="hover:underline">Go to Profile →</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Separator – hidden on mobile */}
                    <div className="w-px h-6 bg-outline-variant/30 hidden sm:block" />

                    {/* Avatar button – always visible */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        {avatarLoading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : (
                            <UserAvatar
                                avatarUrl={avatarUrl}
                                initials={initials}
                                fullName={fullName}
                                size="sm"
                            />
                        )}
                    </button>
                </div>

                {/* Dropdown menu – increased z-index, full width on small screens */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-38 sm:w-50 max-w-[80vw] bg-surface border border-outline-variant rounded-xl shadow-xl overflow-hidden z-100 animate-in fade-in slide-in-from-top-2">
                        {/* Name / email – hidden on mobile to save space */}
                        <div className="hidden sm:block px-4 py-3 border-b border-outline-variant bg-surface-container-lowest">
                            <p className="font-ui-sm text-ui-sm text-on-surface font-semibold truncate">{fullName}</p>
                            <p className="text-[12px] text-on-surface-variant truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 font-ui-sm text-ui-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">dashboard</span>
                                Dashboard
                            </Link>
                            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 font-ui-sm text-ui-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">person</span>
                                My Profile
                            </Link>
                        </div>
                        <div className="py-1 border-t border-outline-variant bg-surface-container-lowest">
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    handleSignOut();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 font-ui-sm text-ui-sm text-error hover:bg-error-container/20 transition-colors cursor-pointer text-left"
                            >
                                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}