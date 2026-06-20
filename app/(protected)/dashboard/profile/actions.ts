"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/supabase/server-utils";
import { profileRatelimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const qualificationSchema = z.object({
    university: z.string().max(150).optional(),
    degree_name: z.string().max(150).optional(),
    cgpa: z.string().max(20).optional(),
    graduation_year: z.number().int().min(1900).max(2100).optional().nullable(),
    college_summary: z.string().optional(),  // NEW

});

const experienceSchema = z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    dates: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
});

const certificateSchema = z.object({
    name: z.string().optional(),
    date_issued: z.string().optional(),
    issued_by: z.string().optional(),
});

const profileSchema = z.object({
    full_name: z.string().max(100).optional(),
    professional_title: z.string().max(100).optional(),
    phone_number: z.string().max(20).optional(),
    university: z.string().max(150).optional(),
    degree_name: z.string().max(150).optional(),
    cgpa: z.string().max(20).optional(),
    graduation_year: z.preprocess(
        (val) => {
            if (val === "" || val === "undefined" || Number(val) === 0 || val === null) return null;
            const num = Number(val);
            return isNaN(num) ? val : num;
        },
        z.number().int().min(1900).max(2100).optional().nullable()
    ),
    target_destination: z.string().max(100).optional(),
    intake_date: z.string().max(50).optional(),
    study_level: z.string().max(50).optional(),
    qualifications: z.array(qualificationSchema).optional(),
    experiences: z.array(experienceSchema).optional(),
    certificates: z.array(certificateSchema).optional(),
    avatar_url: z.url().optional().nullable(),
    annual_budget: z.string().optional(),
    interested_courses: z.array(z.string()).optional(),
    course_name: z.string().max(200).optional(),
    preferred_university: z.string().max(200).optional(),
    budget_numeric: z.number().positive().optional().nullable(),
    skills: z.array(z.string()).optional(),
    work_experience: z.string().optional(),
    short_term_goal: z.string().optional(),
    long_term_goal: z.string().optional(),
    professional_summary: z.string().optional(),
    links: z.array(z.string()).optional(),
    location: z.string().max(200).optional(),
    languages: z.array(z.string()).optional(),
    college_summary: z.string().optional(),

});

function parseJsonArray(val: any): any[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
    }
    return [];
}

async function checkProfileRateLimit() {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";
    const { success } = await profileRatelimit.limit(ip);
    if (!success) {
        return { blocked: true, error: "Too many requests. Try again later." };
    }
    return { blocked: false };
}

export type UserProfileData = z.infer<typeof profileSchema>;

export async function getUserProfile() {
    const auth = await getAuthContext();
    if ("error" in auth) return { success: false, error: auth.error };
    const { user, supabase } = auth;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return { success: false, error: "Failed to load profile" };
    }
    return {
        success: true,
        data: data ? {
            ...data,
            qualifications: parseJsonArray(data.qualifications),
            experiences: parseJsonArray(data.experiences),
            certificates: parseJsonArray(data.certificates),
            languages: parseJsonArray(data.languages),
            skills: parseJsonArray(data.skills),
            links: parseJsonArray(data.links),
            interested_courses: parseJsonArray(data.interested_courses),
        } : null,
    };
}

export async function updateUserProfile(rawPayload: unknown) {
    try {
        const auth = await getAuthContext();
        if ("error" in auth) return { success: false, error: auth.error };
        const rateCheck = await checkProfileRateLimit();
        if (rateCheck.blocked) return { success: false, error: rateCheck.error };
        const { user, supabase } = auth;
        const parseResult = profileSchema.safeParse(rawPayload);
        if (!parseResult.success) {
            return {
                success: false,
                error: "Invalid profile data",
                fieldErrors: parseResult.error.flatten().fieldErrors,
            };
        }
        const validatedData = parseResult.data;
        const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            ...validatedData,
            qualifications: validatedData.qualifications ?? [],
            experiences: validatedData.experiences ?? [],
            certificates: validatedData.certificates ?? [],
            interested_courses: validatedData.interested_courses ?? [],
            skills: validatedData.skills ?? [],
            links: validatedData.links ?? [],
        });
        if (error) {
            console.error("Profile update error:", error);
            return { success: false, error: "Failed to update profile." };
        }
        revalidatePath("/dashboard/profile");
        return { success: true };
    } catch (error) {
        console.error("Unexpected error in updateUserProfile:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        const auth = await getAuthContext();
        if ("error" in auth) return { success: false, error: auth.error };
        const rateCheck = await checkProfileRateLimit();
        if (rateCheck.blocked) return { success: false, error: rateCheck.error };
        const { user, supabase } = auth;
        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "No file provided" };
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: "Only JPEG, PNG, and WebP images are allowed." };
        }
        if (file.size > 300 * 1024) {
            return { success: false, error: "File size must be less than 300 KB." };
        }
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, error: "Failed to upload avatar" };
        }
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;
        const { error: updateError } = await supabase.from("profiles").upsert({
            id: user.id,
            avatar_url: publicUrl,
        });
        if (updateError) {
            console.error("Profile update error:", updateError);
            return { success: false, error: "Failed to update avatar URL" };
        }
        revalidatePath("/dashboard/profile");
        return { success: true, avatarUrl: publicUrl };
    } catch (error) {
        console.error("Unexpected error in uploadAvatar:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}