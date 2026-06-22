"use server";

/**
 * Advisor response engine.
 *
 * Production (NODE_ENV=production): chip-based, rule-based logic
 * only. No free-text chat. Zero API cost, zero risk.
 *
 * Development (NODE_ENV=development): if GEMINI_API_KEY is set,
 * chip responses are personalized via Gemini AND free-text chat
 * is unlocked, so the AI Advisor can be properly tested/demoed
 * locally without touching production behavior at all.
 */

function checkAIUnlocked(): boolean {
  const isAIDev = process.env.NODE_ENV === "development";
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  return isAIDev && hasGeminiKey;
}

/**
 * Server Action — safe to call from a "use client" component.
 * This is how the client checks whether AI chat should be shown,
 * without ever touching process.env directly in browser code.
 */
export async function getAIChatUnlocked(): Promise<boolean> {
  return checkAIUnlocked();
}

interface AdvisorContext {
  chip: string;
  profile: any;
  checklistProgress: number;
  doneItems: number;
  totalItems: number;
}

/* ---------------------------------------------------------- */
/* Chip responses — enrich rule-based text with Gemini in dev  */
/* ---------------------------------------------------------- */

export async function getAdvisorResponse(
  context: AdvisorContext,
  ruleBasedResponse: string
): Promise<string> {
  if (checkAIUnlocked()) {
    try {
      return await callGeminiEnrich(context, ruleBasedResponse);
    } catch (err) {
      console.warn(
        "[advisor] Gemini enrich failed in dev, falling back to rule-based response:",
        err
      );
      return ruleBasedResponse;
    }
  }

  // Production — always the existing rule-based logic, untouched
  return ruleBasedResponse;
}

async function callGeminiEnrich(
  context: AdvisorContext,
  ruleBasedResponse: string
): Promise<string> {
  const { profile, chip } = context;

  const prompt = `
You are a study-abroad advisor for an international student.

Student profile:
- Target destination: ${profile?.target_destination || "not set"}
- Budget: ${profile?.budget_numeric ?? "not set"}
- Course: ${profile?.course_name || "not set"}
- University: ${profile?.preferred_university || "not set"}
- Study level: ${profile?.study_level || "not set"}

The student tapped the "${chip}" topic. Here is the standard
template answer our system already generates for this topic:

---
${ruleBasedResponse}
---

Rewrite this into a more personalized, conversational version
using the specific profile details above. Keep the same
structure (headers, bullet points) and keep it concise.
Do not invent facts about visa rules or costs that aren't
already in the template — only personalize tone and phrasing.
`;

  return callGemini(prompt);
}

/* ---------------------------------------------------------- */
/* Free-text chat — dev only, fully open-ended Gemini calls    */
/* ---------------------------------------------------------- */

export async function getFreeTextAdvisorResponse(
  profile: any,
  userMessage: string,
  conversationHistory: { role: "user" | "advisor"; content: string }[]
): Promise<string> {
  if (!checkAIUnlocked()) {
    // Should never be reachable in production since the UI
    // hides the chat input entirely, but guard anyway.
    return "Free-text chat is only available in development mode.";
  }

  try {
    const historyText = conversationHistory
      .slice(-6) // last few turns for context, keep prompt small
      .map((m) => `${m.role === "user" ? "Student" : "Advisor"}: ${m.content}`)
      .join("\n");

    const prompt = `
You are a helpful, honest study-abroad advisor for an
international student. Stay practical and concise. If you're
not sure about a specific visa rule or number, say so rather
than guessing.

Student profile:
- Target destination: ${profile?.target_destination || "not set"}
- Budget: ${profile?.budget_numeric ?? "not set"}
- Course: ${profile?.course_name || "not set"}
- University: ${profile?.preferred_university || "not set"}
- Study level: ${profile?.study_level || "not set"}

Recent conversation:
${historyText}

Student: ${userMessage}

Advisor:
`;

    return await callGemini(prompt);
  } catch (err) {
    console.warn("[advisor] Free-text Gemini call failed:", err);
    return "Sorry, I couldn't process that right now. Try one of the topic buttons above instead.";
  }
}

/* ---------------------------------------------------------- */
/* Shared Gemini call                                          */
/* ---------------------------------------------------------- */

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + process.env.GEMINI_MODEL + ":generateContent?key=" +
    apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned no content");
  }

  return text;
}