"use server";

import { getAuthContext } from "@/lib/supabase/server-utils";
import { revalidatePath } from "next/cache";
import { isProfileComplete } from "@/lib/profile-utils";      // DRY helper
import { resumeSaveRatelimit } from "@/lib/rate-limit";

import { z } from "zod";

const sectionDataSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  links: z.string().optional(),
  content: z.string().optional(),
  items: z.array(z.any()).optional(),
  country: z.string().optional(),
});

const sectionSchema = z.object({
  type: z.string(),
  data: sectionDataSchema,
});

const sectionsSchema = z.array(sectionSchema);

// ----------------------------------------------------------------------
// Fetch the user's resume (only if saved)
// ----------------------------------------------------------------------
export async function getResume() {
  const auth = await getAuthContext();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user, supabase } = auth;

  // 1. Try to fetch an existing saved resume
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching resume:", error);
    return { success: false, error: "Failed to load resume" };
  }

  // 2. If a saved resume exists with a real name, return it
  if (data) {
    const heading = data.sections?.find((s: any) => s.type === "heading");
    if (
      heading &&
      heading.data?.name &&
      heading.data.name !== "[Your Name]" &&
      heading.data.name !== "Your Name"
    ) {
      return { success: true, data };
    }
    // Otherwise, delete the stale placeholder row
    await supabase.from("resumes").delete().eq("user_id", user.id);
  }

  // 3. No saved resume → return sections: null so the client shows placeholders
  return {
    success: true,
    data: { id: null, title: "Untitled Resume", sections: null },
  };
}

// ----------------------------------------------------------------------
// Generate a fresh resume from profile data
// ----------------------------------------------------------------------
export async function generateResumeDraft() {
  const auth = await getAuthContext();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user, supabase } = auth;

  // Fetch ALL profile fields we need
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

  // ---- Heading ----
  const headingName = profile?.full_name || user.email?.split("@")[0] || "[Your Name]";
  const headingLinks = Array.isArray(profile?.links)
    ? profile.links.join(", ")
    : "";

  const heading = {
    type: "heading",
    data: {
      name: headingName,
      title: profile?.professional_title || "[Your Title]",
      email: user.email || "",
      phone: profile?.phone_number || "[Your Phone]",
      location: profile?.location || "[Fetch Location]",
      links: headingLinks,
    },
  };

  // ---- Summary ----
  const summaryText = profile?.professional_summary
    ? profile.professional_summary
    : profile?.professional_title
      ? `A detail‑oriented ${profile.professional_title} with expertise in ${(profile?.skills || []).join(", ") || "various technologies"}.`
      : "";

  const summary = { type: "summary", data: { content: summaryText } };

  // ---- Education ----
  const educationItems = [];
  // Primary education
  if (profile?.university || profile?.degree_name) {
    educationItems.push({
      school: profile?.university || "",
      degree: profile?.degree_name || profile?.study_level || "",
      dates: profile?.graduation_year ? `Graduated ${profile.graduation_year}` : "",
      description: profile?.college_summary || "",
    });
  }
  // Additional qualifications
  const quals = Array.isArray(profile?.qualifications) ? profile.qualifications : [];
  for (const q of quals) {
    if (q.university || q.degree_name) {
      educationItems.push({
        school: q.university || "",
        degree: q.degree_name || "",
        dates: q.graduation_year ? `Graduated ${q.graduation_year}` : "",
        description: q.college_summary || "",
      });
    }
  }

  const education = {
    type: "education",
    data: {
      items: educationItems.length
        ? educationItems
        : [{ school: "", degree: "", dates: "", description: "" }],
    },
  };

  // ---- Experience ----
  const experienceItems = [];
  const experiences = Array.isArray(profile?.experiences) ? profile.experiences : [];
  if (experiences.length > 0) {
    for (const exp of experiences) {
      experienceItems.push({
        company: exp.company || "",
        role: exp.role || "",
        dates: exp.dates || "",
        description: exp.description || "",
      });
    }
  } else if (profile?.work_experience) {
    experienceItems.push({
      company: "",
      role: "",
      dates: "",
      description: profile.work_experience,
    });
  }

  const experience = {
    type: "experience",
    data: {
      items: experienceItems.length
        ? experienceItems
        : [{ company: "", role: "", dates: "", description: "" }],
    },
  };

  // ---- Skills ----
  const skills = {
    type: "skills",
    data: { items: profile?.skills || [] },
  };


  // ---- Languages ----
  const languages = {
    type: "languages",
    data: { items: profile?.languages || [] },
  };

  // ---- Certificates ----
  const certificates = {
    type: "certificates",
    data: { items: profile?.certificates || [] },
  };

  const sections = [
    heading,
    summary,
    education,
    experience,
    skills,
    languages,
    certificates,
  ];

  return { success: true, sections };
}

// ----------------------------------------------------------------------
// Save the entire sections array
// ----------------------------------------------------------------------
export async function saveResume(sections: unknown) {
  const auth = await getAuthContext();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user, supabase } = auth;

  // Validate shape
  const parsed = sectionsSchema.safeParse(sections);
  if (!parsed.success) {
    return { success: false, error: "Invalid resume data" };
  }

  // Rate limit
  const { success: rateLimitOk } = await resumeSaveRatelimit.limit(user.id);
  if (!rateLimitOk) {
    return { success: false, error: "Too many save requests. Please wait a moment." };
  }

  const { error } = await supabase.from("resumes").upsert(
    { user_id: user.id, sections: parsed.data, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error saving resume:", error);
    return { success: false, error: "Failed to save resume" };
  }

  revalidatePath("/dashboard/resume");
  return { success: true };
}