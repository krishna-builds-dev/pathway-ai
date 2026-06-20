import { getUser } from "@/lib/supabase/auth"; // your existing cached helper
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AuthContext =
    | { user: User; supabase: SupabaseClient }
    | { error: string };

/**
 * Reusable authentication context.
 * Uses your cached getUser – zero extra auth calls.
 * Creates a fresh Supabase client only when the user is valid.
 */
export async function getAuthContext(): Promise<AuthContext> {
    const user = await getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const supabase = await createClient();
    return { user, supabase };
}