"use client";

import { useState, useEffect, useRef } from "react";
import { getVisaChecklist } from "@/app/(protected)/dashboard/visa/actions";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import RequireProfile from "@/components/providers/RequireProfile";
import { toast } from "react-toastify";



/* ---------- Expanded Rule Engine ---------- */
const generateResponse = (
  chip: string,
  profile: any,
  checklistProgress: number,
  doneItems: number,
  totalItems: number
): string => {
  const destination = profile?.target_destination || "your destination";
  const budget = profile?.budget_numeric ?? 0;
  const course = profile?.course_name || "your program";
  const university = profile?.preferred_university || "your university";
  const studyLevel = profile?.study_level || "your studies";

  switch (chip) {
    case "visa_tips":
      return `🗓️ **Visa Timing & Strategy for ${destination}**\n\n` +
        `The student visa process for ${destination} can take anywhere from a few weeks to several months, depending on the time of year and your specific circumstances. ` +
        `For most popular study destinations, I recommend applying at least **3–4 months before your course start date**.\n\n` +
        `📌 **Key steps to keep in mind:**\n` +
        `• Gather all required documents early (see your checklist).\n` +
        `• Book your health examination as soon as you have your CoE.\n` +
        `• If an interview is required, prepare to explain your study plans and ties to your home country.\n` +
        `• Keep an eye on the immigration website for any policy changes.\n\n` +
        `If you'd like more specific tips for ${destination}, feel free to ask!`;

    case "budget_check":
      const budgetFormatted = `$${budget.toLocaleString()}`;
      if (budget < 25000) {
        return `💰 **Budget Analysis – Tight but Manageable**\n\n` +
          `Your annual budget of ${budgetFormatted} is on the lower side for ${destination}, especially when you factor in tuition, living expenses, accommodation, and unexpected costs.\n\n` +
          `📌 **Suggestions to stretch your budget:**\n` +
          `• Look into **scholarships** offered by your university or external organisations.\n` +
          `• Consider **part‑time work** – many student visas allow up to 20 hours per week during term.\n` +
          `• Opt for shared accommodation or on‑campus housing to save on rent.\n` +
          `• Create a monthly expense plan to track your spending.\n\n` +
          `You can still make it work with careful planning. Use the visa checklist to avoid last‑minute expenses.`;
      } else if (budget < 50000) {
        return `💰 **Budget Analysis – Solid Foundation**\n\n` +
          `Your annual budget of ${budgetFormatted} puts you in a comfortable position for studying in ${destination}. ` +
          `It should cover typical tuition fees, living costs, and some extra for travel and emergencies.\n\n` +
          `📌 **Still, it's wise to:**\n` +
          `• Keep a buffer of at least 10‑15% for unexpected fees.\n` +
          `• Research local part‑time work opportunities to supplement your income.\n` +
          `• Monitor exchange rates if you're using a foreign currency.\n\n` +
          `Your financial preparation looks good – you can focus on other aspects of your application.`;
      } else {
        return `💰 **Budget Analysis – Strong Financial Position**\n\n` +
          `Your annual budget of ${budgetFormatted} is excellent for ${destination}. ` +
          `You'll have plenty of flexibility for a comfortable lifestyle while studying.\n\n` +
          `📌 **With such a strong budget, you might:**\n` +
          `• Invest in better accommodation or a prime location.\n` +
          `• Plan some travel to explore ${destination} during breaks.\n` +
          `• Consider paying tuition in advance to avoid currency fluctuations.\n\n` +
          `Financially, you're in great shape – now make sure your other documents are just as solid!`;
      }

    case "checklist":
      if (totalItems === 0) {
        return "📋 **Your Visa Checklist**\n\nYour checklist is currently empty. Head over to the Visa section to add documents and track your progress.";
      }
      const remaining = totalItems - doneItems;
      return `📋 **Checklist Progress: ${checklistProgress}% Complete**\n\n` +
        `You've verified **${doneItems} out of ${totalItems}** required documents.\n` +
        (remaining > 0
          ? `There are ${remaining} documents still to complete. `
          : `🎉 Amazing! You're fully documented and ready to apply. `) +
        `\n\n📌 **Next steps:**\n` +
        `• Focus on the incomplete sections first.\n` +
        `• Double‑check that all documents meet the official requirements.\n` +
        `• If you need help with a specific document, I can give you tips – just ask!`;

    case "sop_advice":
      return `📝 **Statement of Purpose (SOP) & GTE Advice**\n\n` +
        `A strong Statement of Purpose (or Genuine Temporary Entrant statement) is crucial for your visa application. ` +
        `It should convince the immigration officer that you are a genuine student with a clear plan.\n\n` +
        `📌 **What to include:**\n` +
        `• **Why this course?** Explain how it fits your previous studies or career goals.\n` +
        `• **Why this university?** Mention specific professors, research, or facilities that attracted you.\n` +
        `• **Why ${destination}?** Show you've researched the country and its education system.\n` +
        `• **Ties to home country:** Describe family, property, or a job offer that ensures you'll return.\n` +
        `• **Career goals:** How will this degree help you achieve your long‑term plans?\n\n` +
        `Keep it personal, honest, and well‑structured. If you've already written a draft in the SOP Builder, review it with these points in mind.`;

    case "scholarship":
      return `🎓 **Scholarship Opportunities**\n\n` +
        `Many international students can reduce their costs through scholarships. Here are some avenues to explore:\n\n` +
        `• **University‑specific awards:** Check ${university}'s international student scholarship page – many offer merit‑based or region‑specific grants.\n` +
        `• **Government scholarships:** Some governments offer funding for students from particular countries. Look for programs like Australia Awards, Chevening (UK), Fulbright (USA), etc.\n` +
        `• **Private organisations:** Rotary Clubs, philanthropic foundations, and corporate scholarships can be less competitive.\n\n` +
        `Start your search early – deadlines can be a year before intake. Even a partial scholarship can significantly lower your financial burden.`;

    case "accommodation":
      return `🏠 **Accommodation Tips for ${destination}**\n\n` +
        `Finding the right place to live is a key part of your student experience. Here are your main options:\n\n` +
        `• **On‑campus housing:** Convenient and safe, but often limited. Apply as early as possible.\n` +
        `• **Private rentals:** More independence, but you'll need to budget for utilities and possibly a guarantor.\n` +
        `• **Homestay:** Live with a local family – great for cultural immersion and language practice.\n` +
        `• **Purpose‑built student accommodation (PBSA):** Modern facilities with other students.\n\n` +
        `Research the areas near your university and factor in transportation costs. Many students find temporary accommodation for the first few weeks and then search on the ground.`;

    case "health_insurance":
      return `🩺 **Health Insurance (OSHC & Overseas Coverage)**\n\n` +
        `Most countries require international students to have health insurance. For Australia, you need OSHC (Overseas Student Health Cover); for other destinations, similar policies exist.\n\n` +
        `📌 **What to look for:**\n` +
        `• Coverage for doctor visits, hospital stays, and emergency ambulance.\n` +
        `• Some policies include extras like dental or optical – evaluate if you need them.\n` +
        `• Make sure the insurance is valid for the entire duration of your visa.\n` +
        `• Keep a digital copy of your policy card and know how to make a claim.\n\n` +
        `You can compare OSHC providers online. Your university may also recommend a preferred insurer.`;

    case "part_time_work":
      return `💼 **Part‑Time Work While Studying**\n\n` +
        `Most student visas allow you to work up to 20 hours per week during term and full‑time during breaks. This can help offset living costs and build local experience.\n\n` +
        `📌 **How to find work:**\n` +
        `• Check your university's career portal or student job board.\n` +
        `• Look for on‑campus roles in libraries, cafes, or administration.\n` +
        `• Use local job websites and networking events.\n` +
        `• Make sure your visa conditions explicitly allow work before you start.\n\n` +
        `Balancing work and study can be challenging – prioritize your coursework and use work as a supplement, not a necessity.`;

    case "english_tips":
      return `🗣️ **English Proficiency & Test Tips**\n\n` +
        `If you still need to take IELTS, TOEFL, or PTE, here are a few strategies:\n\n` +
        `• **Familiarise yourself with the test format** – practice tests are your best friend.\n` +
        `• **Focus on your weakest section** – whether it's writing, speaking, or listening.\n` +
        `• **Immerse yourself in English:** watch movies, read articles, and try to think in English.\n` +
        `• **Take a preparation course** if you can – many are available online.\n\n` +
        `Most universities have minimum score requirements. Aim to exceed them slightly to be safe. Good luck!`;

    case "motivation":
      const quotes = [
        "✨ Every document you complete brings you one step closer to your dream campus.",
        "🚀 You're building the foundation for an incredible international adventure.",
        "💪 One step at a time – you've got this!",
        "🌟 The effort you put in now will open doors for a lifetime.",
        "🎓 Imagine yourself walking onto that campus – it's within reach!",
      ];
      return `🌟 **A Little Motivation**\n\n${quotes[Math.floor(Math.random() * quotes.length)]}\n\nRemember why you started. The journey may seem long, but every task you complete is a victory. Keep going!`;

    default:
      return "I'm here to help with visa tips, budget, checklist, SOP, scholarships, accommodation, and more. Just tap a button above!";
  }
};

/* ---------- Chip Definitions ---------- */
const chips = [
  { id: "visa_tips", label: "✈️ Visa Tips" },
  { id: "budget_check", label: "💰 Budget Check" },
  { id: "checklist", label: "📋 My Checklist" },
  { id: "sop_advice", label: "📝 SOP Advice" },
  { id: "scholarship", label: "🎓 Scholarships" },
  { id: "accommodation", label: "🏠 Accommodation" },
  { id: "health_insurance", label: "🩺 Health Insurance" },
  { id: "part_time_work", label: "💼 Part-time Work" },
  { id: "english_tips", label: "🗣️ English Tests" },
  { id: "motivation", label: "🌟 Motivation" },
];

/* ---------- Component ---------- */
export default function AdvisorPage() {
  const [messages, setMessages] = useState<{ role: "user" | "advisor"; content: string }[]>([]);
  const [checklistStats, setChecklistStats] = useState({ done: 0, total: 0, progress: 0 });
  const [checklistLoading, setChecklistLoading] = useState(true);

  // DRY profile completeness hook
  const { profile, profileComplete, missingFields, loading: profileLoading } = useProfileCompleteness();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // ---- Load checklist (only) ----
  useEffect(() => {
    (async () => {
      try {
        const res = await getVisaChecklist();
        if (res.success && res.sections) {
          const sections = res.sections;
          const total = sections.reduce((acc: number, sec: any) => acc + sec.items.length, 0);
          const done = sections.reduce(
            (acc: number, sec: any) => acc + sec.items.filter((i: any) => i.done).length,
            0
          );
          setChecklistStats({
            done,
            total,
            progress: total === 0 ? 0 : Math.round((done / total) * 100),
          });
        }
      } catch (error) {
        console.error("Failed to load checklist:", error);
        toast.error("Could not load your visa checklist. Some advice may be less accurate.");

      } finally {
        setChecklistLoading(false);
      }
    })();
  }, []);

  // ---- Auto-scroll to latest message ----
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Handle chip click ----
  const handleChipClick = async (chipId: string) => {
    const chipLabel = chips.find((c) => c.id === chipId)?.label || chipId;
    setMessages((prev) => [...prev, { role: "user", content: chipLabel }]);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const advisorText = generateResponse(
      chipId,
      profile,
      checklistStats.progress,
      checklistStats.done,
      checklistStats.total
    );
    setMessages((prev) => [...prev, { role: "advisor", content: advisorText }]);
  };

  // ---- Loading (profile + checklist) ----
  if (profileLoading || checklistLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ---- Main UI (wrapped in profile guard) ----
  return (
    <RequireProfile
      profileComplete={profileComplete}
      missingFields={missingFields}
      message="The advisor provides personalised guidance based on your profile details. Complete your profile to start."
    >
      <main className="h-screen flex flex-col relative">
        {/* Header – responsive stacking */}
        <header className="min-h-[80px] md:h-24 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-3 md:py-0 bg-white/20 backdrop-blur-md border-b border-white/30 gap-3 md:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5 shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                Career Advisor
              </span>
              <h2 className="text-lg md:text-xl font-bold text-on-surface">Your Personal Visa Guide</h2>
              <p className="text-xs text-on-surface-variant font-medium hidden md:block">
                Tap a question below – I’ll give you instant, personalised advice.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile subtitle */}
            <p className="text-xs hidden text-on-surface-variant font-medium md:hidden">
              Tap a question below – I’ll give you instant advice.
            </p>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">
                  {profile?.full_name || "Student"}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  {profile?.target_destination || "Your Track"}
                </p>
              </div>
              <div className="w-10 hidden md:flex h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md bg-primary/5  items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">smart_toy</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat area – responsive padding */}
        <section className="grow flex flex-col p-3 md:p-6 overflow-hidden max-w-6xl mx-auto w-full relative">
          <div className="glass-container grow rounded-[24px] md:rounded-4xl overflow-hidden flex flex-col relative shadow-2xl shadow-primary/5 border border-white/40">
            {/* Messages */}
            <div className="grow overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-4 md:space-y-6 pb-40 md:pb-48">
              {/* Initial greeting */}
              {messages.length === 0 && (
                <div className="flex gap-3 md:gap-4 fade-in">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/5 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-lg md:text-xl">smart_toy</span>
                  </div>
                  <div className="bg-primary/10 p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tl-none max-w-[85%] md:max-w-[80%] border border-primary/5">
                    <p className="text-sm leading-relaxed text-on-surface">
                      Hello{profile?.full_name ? ` ${profile.full_name.split(" ")[0]}` : ""}! I'm your
                      advisor. I can help you with{" "}
                      <b>visa tips</b>, check your <b>budget</b>, review your{" "}
                      <b>checklist</b>, give <b>SOP advice</b>, and much more. What would you like to explore
                      first?
                    </p>
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 md:gap-4 fade-in ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "user"
                        ? "bg-primary shadow-lg shadow-primary/20"
                        : "bg-primary/10 border border-primary/5"
                      }`}
                  >
                    <span className={`material-symbols-outlined text-lg md:text-xl ${msg.role === "user" ? "text-white" : "text-primary"}`}>
                      {msg.role === "user" ? "person" : "smart_toy"}
                    </span>
                  </div>
                  <div
                    className={`p-3 md:p-5 rounded-2xl md:rounded-3xl max-w-[85%] md:max-w-[80%] ${msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/15"
                        : "bg-primary/10 rounded-tl-none border border-primary/5"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom area (chips + decorative input) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-linear-to-t from-white/95 via-white/80 to-transparent">
              {/* Chips – horizontally scrollable */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 md:pb-6">
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip.id)}
                    className="whitespace-nowrap px-4 py-2 md:px-5 md:py-2.5 bg-white border border-outline-variant/40 rounded-full text-xs md:text-[13px] font-semibold text-on-surface hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Decorative input bar */}
              <div className="relative glass-card rounded-[1rem] md:rounded-[1.25rem] shadow-xl p-3 md:p-4 flex items-center bg-white/90 border border-white cursor-default" aria-disabled="true">
                <span className="material-symbols-outlined text-primary/40 mr-2 md:mr-3 text-lg md:text-xl">
                  chat_bubble_outline
                </span>
                <p className="text-xs md:text-sm text-on-surface-variant/50 font-medium truncate">
                  Choose a question above – I’ll handle the rest.
                </p>
                <div className="ml-auto flex gap-1">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/20" />
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </RequireProfile>
  );
}