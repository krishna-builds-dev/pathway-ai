import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "@/app/(protected)/dashboard/profile/actions";
import { isProfileComplete } from "@/lib/profile-utils";

export function useProfileCompleteness() {
    const [profile, setProfile] = useState<any>(null);
    const [profileComplete, setProfileComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const checkProfile = useCallback(async () => {
        try {
            const res = await getUserProfile();
            if (res.success && res.data) {
                setProfile(res.data);
                const { complete, missingFields } = isProfileComplete(res.data);
                setProfileComplete(complete);
                setMissingFields(missingFields);
            } else {
                setProfileComplete(false);
                setMissingFields(["profile data"]);
            }
        } catch {
            setProfileComplete(false);
            setMissingFields(["network error"]);
        }
    }, []);

    useEffect(() => {
        checkProfile().finally(() => setLoading(false));
    }, [checkProfile]);

    // Re‑check when tab becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkProfile();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [checkProfile]);

    return { profile, profileComplete, missingFields, loading, checkProfile };
}