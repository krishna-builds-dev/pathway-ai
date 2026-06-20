"use client";

// components/UserAvatar.tsx
// Reusable avatar — shows Google/OAuth photo or initials fallback.
// Used in Header (public nav) and ProtectedLayout (dashboard top bar + sidebar).

interface UserAvatarProps {
    avatarUrl: string | null;
    initials: string;
    fullName: string;
    size?: "sm" | "md";
    className?: string;
}

export default function UserAvatar({
    avatarUrl,
    initials,
    fullName,
    size = "md",
    className = "",
}: UserAvatarProps) {
    const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
    const textSize = size === "sm" ? "text-[11px]" : "text-xs";

    return (
        <div
            className={`${dim} rounded-full overflow-hidden border border-outline-variant bg-primary-fixed flex items-center justify-center shrink-0 ${className}`}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className={`${textSize} font-bold text-primary`}>{initials}</span>
            )}
        </div>
    );
}
