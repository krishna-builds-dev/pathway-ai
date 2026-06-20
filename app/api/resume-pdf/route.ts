import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { getAuthContext } from "@/lib/supabase/server-utils";
import { resumePdfRatelimit } from "@/lib/rate-limit";

// Simple HTML sanitizer (remove script tags & inline event handlers)
function stripDangerousHtml(html: string): string {
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    clean = clean.replace(/((?:href|src)\s*=\s*")(javascript:[^"]+)/gi, '$1#');
    return clean;
}

export async function POST(request: Request) {
    try {
        // 1. Authentication
        const auth = await getAuthContext();
        if ("error" in auth) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }
        const { user } = auth;

        // 2. Rate limiting (5 PDFs per 10 minutes per user)
        const { success } = await resumePdfRatelimit.limit(user.id);
        if (!success) {
            return NextResponse.json(
                { error: "Too many PDF requests. Please wait a moment." },
                { status: 429 }
            );
        }

        // 3. Parse & sanitize the HTML
        const { html } = await request.json();
        if (!html) {
            return NextResponse.json({ error: "No HTML provided" }, { status: 400 });
        }

        const cleanHtml = stripDangerousHtml(html);

        // 4. Puppeteer PDF generation
        const isLocal = process.env.NODE_ENV === "development";
        const browser = await puppeteer.launch({
            args: isLocal ? [] : chromium.args,
            executablePath: isLocal
                ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
                : await chromium.executablePath(
                    "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
                ),
            headless: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setContent(cleanHtml, { waitUntil: "networkidle0" as any });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
        });

        await browser.close();

        // Convert Buffer to Uint8Array for a valid BodyInit
        return new NextResponse(new Uint8Array(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="resume.pdf"',
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: "PDF generation failed" },
            { status: 500 }
        );
    }
}