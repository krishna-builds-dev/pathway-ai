import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const contactRatelimit = new Ratelimit({
    redis,
    // 1 attempt per 3 minutes
    limiter: Ratelimit.slidingWindow(5, "3 m"),
    analytics: true,
    prefix: "contact",
});

export const aiSuggestionRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),   // 3 requests per minute
    analytics: true,
    prefix: "ai-suggestion",
});

export const profileRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),   // 5 requests per minute
    analytics: true,
    prefix: "profile",
});

export const sopSaveRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),   // 20 autosaves per minute – way above the ~30 that autosave would send
    analytics: true,
    prefix: "sop-save",
});

export const visaSaveRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),   // 5 requests per minute
    analytics: true,
    prefix: "visa-save",
});


export const resumeSaveRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),   // 5 requests per minute
    analytics: true,
    prefix: "resume-save",
});

export const resumePdfRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),   // 5 requests per minute
    analytics: true,
    prefix: "resume-pdf",
});



