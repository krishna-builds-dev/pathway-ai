"use server";

import { createClient } from "@/lib/supabase/server";
import { contactRatelimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from 'zod';



// 1. Strict Validation Schema with length ceilings to block overflow payloads
const contactFormSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters.")
        .transform((val) => val.trim()),
    email: z.email("Please provide a valid email address.")
        .max(255, "Email address is too long.")
        .transform((val) => val.trim().toLowerCase()),
    subject: z
        .string()
        .min(1, "Subject choice is required.")
        .max(150, "Subject is too long.")
        .transform((val) => val.trim()),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters long.")
        .max(5000, "Message cannot exceed 5000 characters.")
        .transform((val) => val.trim()),
});

// Infer typing directly from the runtime Zod validation model
export type ContactFormData = z.infer<typeof contactFormSchema>;

interface ActionResult {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}

export async function submitContactInquiry(rawPayload: unknown): Promise<ActionResult> {
    try {
        // 1. Honey‑pot spam check (safe for unknown type)
        if (
            rawPayload &&
            typeof rawPayload === 'object' &&
            'website' in rawPayload &&
            typeof (rawPayload as Record<string, unknown>).website === 'string' &&
            (rawPayload as Record<string, string>).website.trim().length > 0
        ) {
            return {
                success: false,
                error: "Spam detected",
            };
        }

        // 2. Proactively Rate‑Limit Inbound Traffic (to be implemented with Upstash)
        // ...
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") ?? "unknown";
        const { success: rateLimitOk } = await contactRatelimit.limit(ip);
        if (!rateLimitOk) {
            return {
                success: false,
                error: "Too many requests. Please try again later.",
            };
        }

        // 3. Safe Parsing Validation Data
        const parseResult = contactFormSchema.safeParse(rawPayload);

        if (!parseResult.success) {
            return {
                success: false,
                error: "Invalid form input data.",
                fieldErrors: parseResult.error.flatten().fieldErrors,
            };
        }

        const validatedData = parseResult.data;
        const supabase = await createClient();

        // 4. Submit Payload utilizing Snake Case Database Mapping
        const { error } = await supabase.from("contact_inquiries").insert({
            full_name: validatedData.fullName,
            email: validatedData.email,
            subject: validatedData.subject,
            message: validatedData.message,
            status: "new",
        });

        if (error) {
            console.error("[CRITICAL] Contact Inquiry Database Insertion Failure:", {
                code: error.code,
                message: error.message,
                hint: error.hint,
                timestamp: new Date().toISOString(),
            });

            return {
                success: false,
                error: "Our database servers are experiencing heavy traffic. Please try again shortly.",
            };
        }

        return { success: true };
    } catch (unexpectedException) {
        console.error("[FATAL] Unexpected Exception in submitContactInquiry:", unexpectedException);

        return {
            success: false,
            error: "An unexpected system error occurred. Please try again later.",
        };
    }
}