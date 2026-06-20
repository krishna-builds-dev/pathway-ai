// hooks/useUserMeta.ts
// Single source of truth for deriving display info from a Supabase user object.

import { User } from "@supabase/supabase-js";

export function useUserMeta(user: User | null) {
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";

    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const email = user?.email || "";

    return { avatarUrl, fullName, initials, email };
}
