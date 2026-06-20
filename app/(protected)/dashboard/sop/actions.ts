"use server";

import { getAuthContext } from "@/lib/supabase/server-utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { generateSOPTemplate } from "@/lib/sop-template";
import { sopSaveRatelimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { isProfileComplete } from "@/lib/profile-utils";      // DRY helper

// ----------------------------------------------------------------------
// Zod Schema
// ----------------------------------------------------------------------
const sopSchema = z.object({
    title: z.string().max(200).optional(),
    content: z.string().optional(),
});

// ----------------------------------------------------------------------
// Fetch SOP (or generate a fresh template)
// ----------------------------------------------------------------------
export async function getSOP() {
    const auth = await getAuthContext();
    if ("error" in auth) return { success: false, error: auth.error };
    const { user, supabase } = auth;

    // Fetch the user's profile with ALL required fields (including JSONB arrays)
    const { data: profile } = await supabase
        .from("profiles")
        .select(
            "full_name, professional_title, phone_number, university, cgpa, graduation_year, college_summary, degree_name, target_destination, intake_date, study_level, interested_courses, annual_budget, course_name, preferred_university, budget_numeric, skills, work_experience, short_term_goal, long_term_goal, qualifications, experiences, certificates, languages, links, location, professional_summary"
        )
        .eq("id", user.id)
        .single();

    // Check for a saved SOP
    const { data: sop, error } = await supabase
        .from("sops")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching SOP:", error);
        return { success: false, error: "Failed to load SOP" };
    }

    // If a saved SOP exists, return it
    if (sop) {
        return { success: true, data: sop };
    }

    // No saved SOP → generate a personalised template
    const templateContent = generateSOPTemplate({
        fullName: profile?.full_name || user.email?.split("@")[0] || "Student",
        country: profile?.target_destination,
        studyLevel: profile?.study_level,
        interestedCourses: profile?.interested_courses || [],
        annualBudget: profile?.annual_budget,
        course_name: profile?.course_name,
        preferred_university: profile?.preferred_university,
        budget_numeric: profile?.budget_numeric,
        skills: profile?.skills || [],
        work_experience: profile?.work_experience,
        short_term_goal: profile?.short_term_goal,
        long_term_goal: profile?.long_term_goal,
        prev_university: profile?.university,

        // ---- new fields (same as generateSOPDraft) ----
        degree_name: profile?.degree_name,
        cgpa: profile?.cgpa,
        graduation_year: profile?.graduation_year,
        college_summary: profile?.college_summary,
        qualifications: profile?.qualifications || [],
        experiences: profile?.experiences || [],
        certificates: profile?.certificates || [],
        languages: profile?.languages || [],
    });

    // Create a dynamic title
    const course = profile?.course_name || profile?.interested_courses?.[0] || "Program";
    const uni = profile?.preferred_university || "University";
    const templateTitle = `Statement of Purpose – ${course} at ${uni}`;

    return {
        success: true,
        data: {
            id: null,
            title: templateTitle,
            content: templateContent,
            status: "draft",
            word_count: templateContent.trim().split(/\s+/).length,
            updated_at: new Date().toISOString(),
        },
    };
}

// ----------------------------------------------------------------------
// Generate a fresh template draft (called by the “Generate” button)
// ----------------------------------------------------------------------
export async function generateSOPDraft() {
    const auth = await getAuthContext();
    if ("error" in auth) return { success: false, error: auth.error };
    const { user, supabase } = auth;

    const { data: profile } = await supabase
        .from("profiles")
        .select(
            "*"
        )
        .eq("id", user.id)
        .single();

    const { complete, missingFields } = isProfileComplete(profile);
    if (!complete) {
        return {
            success: false,
            error: `Profile incomplete. Missing: ${missingFields.join(', ')}`,
        };
    }

    // Generate the draft using the profile data
    const draft = generateSOPTemplate({
        fullName: profile?.full_name || user.email?.split("@")[0] || "Student",
        country: profile?.target_destination,
        studyLevel: profile?.study_level,
        interestedCourses: profile?.interested_courses || [],
        annualBudget: profile?.annual_budget,
        course_name: profile?.course_name,
        preferred_university: profile?.preferred_university,
        budget_numeric: profile?.budget_numeric,
        skills: profile?.skills || [],
        work_experience: profile?.work_experience,
        short_term_goal: profile?.short_term_goal,
        long_term_goal: profile?.long_term_goal,
        prev_university: profile?.university,

        // ---- new fields ----
        degree_name: profile?.degree_name,
        cgpa: profile?.cgpa,
        graduation_year: profile?.graduation_year,
        college_summary: profile?.college_summary,
        qualifications: profile?.qualifications || [],
        experiences: profile?.experiences || [],
        certificates: profile?.certificates || [],
        languages: profile?.languages || [],
    });

    // Generate a proper title
    const title = `${profile!.course_name}`;

    return { success: true, content: draft, title };
}

// ----------------------------------------------------------------------
// Save / Update SOP (upsert on user_id)
// ----------------------------------------------------------------------
export async function saveSOP(title: string, content: string) {
    const auth = await getAuthContext();
    if ("error" in auth) return { success: false, error: auth.error };

    // Rate limiting (very permissive – prevents spam, not autosave)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";
    const { success: rateLimitOk } = await sopSaveRatelimit.limit(ip);
    if (!rateLimitOk) {
        return { success: false, error: "Too many save requests. Please wait a moment." };
    }

    const { user, supabase } = auth;

    const parseResult = sopSchema.safeParse({ title, content });
    if (!parseResult.success) {
        return { success: false, error: "Invalid data" };
    }

    const { data: validated } = parseResult;

    const { error } = await supabase.from("sops").upsert(
        {
            user_id: user.id,
            title: validated.title,
            content: validated.content || "",
            word_count: (validated.content || "").trim().split(/\s+/).filter(Boolean).length,
            updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
    );

    if (error) {
        console.error("Error saving SOP:", error);
        return { success: false, error: "Failed to save SOP" };
    }

    revalidatePath("/dashboard/sop");
    return { success: true };
}