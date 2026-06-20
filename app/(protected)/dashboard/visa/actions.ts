"use server";

import { visaSaveRatelimit } from "@/lib/rate-limit";
import { getAuthContext } from "@/lib/supabase/server-utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const checklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  desc: z.string(),
  done: z.boolean(),
});
const sectionsSchema = z.array(
  z.object({
    title: z.string(),
    items: z.array(checklistItemSchema),
  })
);

// Fetch saved checklist
export async function getVisaChecklist() {
  const auth = await getAuthContext();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user, supabase } = auth;

  const { data, error } = await supabase
    .from("visa_checklists")
    .select("sections")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching visa checklist:", error);
    return { success: false, error: "Failed to load checklist" };
  }

  return { success: true, sections: data?.sections || null };
}

// Save / upsert checklist
export async function saveVisaChecklist(sections: any[]) {
  const auth = await getAuthContext();
  if ("error" in auth) return { success: false, error: auth.error };
  const { user, supabase } = auth;

  const parsed = sectionsSchema.safeParse(sections);
  if (!parsed.success) {
    console.error("Invalid checklist data", parsed.error);
    return { success: false, error: "Invalid checklist data" };
  }

  const { success: rateLimitOk } = await visaSaveRatelimit.limit(user.id);

  if (!rateLimitOk) {
    return { success: false, error: "Too many requests" };
  }



  const { error } = await supabase.from("visa_checklists").upsert(
    {
      user_id: user.id,
      sections: parsed.data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error saving visa checklist:", error);
    return { success: false, error: "Failed to save checklist" };
  }

  revalidatePath("/dashboard/visa");
  return { success: true };
}