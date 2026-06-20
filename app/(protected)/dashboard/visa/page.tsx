"use client";

import { useState, useEffect, useRef } from "react";
import { getVisaChecklist, saveVisaChecklist } from "./actions";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import RequireProfile from "@/components/providers/RequireProfile";

const defaultSections = [
    {
        title: "Identity Verification",
        items: [
            { id: "passport", label: "Valid Passport", desc: "Bio‑data page and all used pages.", done: false },
            { id: "photos", label: "Recent Passport Photos", desc: "White background, high resolution.", done: false },
            { id: "birth_cert", label: "Birth Certificate (if under 18)", desc: "Certified copy.", done: false },
        ],
    },
    {
        title: "Financial Capacity",
        items: [
            { id: "bank_stmt", label: "Bank Statements (Last 6 Months)", desc: "Proof of sufficient funds.", done: false },
            { id: "loan_docs", label: "Education Loan Documents", desc: "Sanction letter and disbursement details.", done: false },
            { id: "fin_dec", label: "Financial Declaration", desc: "Annual income evidence or sponsor affidavit.", done: false },
        ],
    },
    {
        title: "Health & Welfare",
        items: [
            { id: "oshc", label: "OSHC Insurance Confirmation", desc: "Overseas Student Health Cover.", done: false },
            { id: "med_exam", label: "Health Examination (eMedical)", desc: "If requested or required.", done: false },
            { id: "xray", label: "Chest X‑ray (if applicable)", desc: "Required for certain countries.", done: false },
        ],
    },
    {
        title: "Academic Credentials",
        items: [
            { id: "coe", label: "Confirmation of Enrolment (CoE)", desc: "Issued by your host university.", done: false },
            { id: "english_test", label: "English Test Results (IELTS/PTE)", desc: "Certified copy of the score report.", done: false },
            { id: "offer_letter", label: "University Offer Letter", desc: "Original admission letter.", done: false },
        ],
    },
    {
        title: "GTE & Personal Statements",
        items: [
            { id: "gte_statement", label: "GTE Statement", desc: "Explain your intentions to study and return home.", done: false },
            { id: "cv", label: "CV / Resume", desc: "Supporting your background.", done: false },
            { id: "travel_history", label: "Travel History", desc: "Previous visas & entry/exit stamps.", done: false },
        ],
    },
    {
        title: "Character & Legal",
        items: [
            { id: "police_clearance", label: "Police Clearance Certificate", desc: "From countries lived in for 12+ months (last 10 yrs).", done: false },
            { id: "form_80", label: "Form 80 (Character Assessment)", desc: "If requested.", done: false },
            { id: "consent_1229", label: "Parental Consent (Form 1229)", desc: "If under 18.", done: false },
        ],
    },
];

const getItemIcon = (id: string) => {
    const iconMap: Record<string, string> = {
        passport: "travel", photos: "photo_camera", birth_cert: "family_restroom",
        bank_stmt: "account_balance", loan_docs: "request_quote", fin_dec: "description",
        oshc: "health_and_safety", med_exam: "biotech", xray: "rib_cage",
        coe: "history_edu", english_test: "translate", offer_letter: "school",
        gte_statement: "edit_note", cv: "assignment_ind", travel_history: "flight_takeoff",
        police_clearance: "gavel", form_80: "fact_check", consent_1229: "approval",
    };
    return iconMap[id] || "task_alt";
};

export default function VisaPage() {
    const [sections, setSections] = useState(defaultSections);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);

    const { profile, profileComplete, missingFields, loading: profileLoading } = useProfileCompleteness();

    const isFirstRender = useRef(true);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Autosave
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (sections.length === 0) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            setSaving(true);
            try {
                await saveVisaChecklist(sections);
            } catch (error) {
                console.error("Autosave failed:", error);
            } finally {
                setSaving(false);
            }
        }, 2000);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [sections]);

    // Load checklist
    useEffect(() => {
        (async () => {
            try {
                const res = await getVisaChecklist();
                if (res.success && res.sections) {
                    setSections(res.sections);
                }
            } catch (error) {
                console.error("Failed to load checklist:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const toggleItem = (sectionIdx: number, itemIdx: number) => {
        setSections((prev) =>
            prev.map((sec, sIdx) =>
                sIdx !== sectionIdx
                    ? sec
                    : {
                        ...sec,
                        items: sec.items.map((item, iIdx) =>
                            iIdx !== itemIdx ? item : { ...item, done: !item.done }
                        ),
                    }
            )
        );
    };

    const totalItems = sections.reduce((acc, sec) => acc + sec.items.length, 0);
    const doneItems = sections.reduce((acc, sec) => acc + sec.items.filter((i) => i.done).length, 0);
    const progressPercent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
    const trustScore = progressPercent === 100 ? "High" : progressPercent >= 60 ? "Medium" : "Low";

    const destination = profile?.target_destination || "your destination";
    const courseName = profile?.course_name || profile?.interested_courses?.[0] || "your program";
    const university = profile?.preferred_university || "your university";

    if (loading || profileLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <RequireProfile
            profileComplete={profileComplete}
            missingFields={missingFields}
            message="The Visa Checklist uses your profile details to generate your visa requirements. Please fill in all required fields to continue."
        >
            <main className="w-full max-w-full overflow-hidden">
                <div className="flex-1">
                    {/* Header */}
                    <header className="mb-6 md:mb-10">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <span className="material-symbols-outlined">verified_user</span>
                            <span className="text-xs md:text-label-md uppercase tracking-widest">
                                Visa Application Strategy
                            </span>
                        </div>
                        <h2 className="text-xl md:text-headline-lg font-bold mb-2 wrap-break-word">
                            {destination} Student Visa Checklist
                        </h2>
                        <p className="text-sm md:text-body-md text-on-surface-variant wrap-break-word">
                            Your personalised roadmap to study <strong>{courseName}</strong> at{" "}
                            <strong>{university}</strong>. Click any item to mark it complete.
                        </p>
                    </header>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
                        <div className="bg-surface-container-high p-3 md:p-4 rounded-xl border border-outline-variant/30">
                            <p className="text-xs md:text-label-md text-on-surface-variant mb-1">Overall Progress</p>
                            <p className="text-xl md:text-headline-md font-bold text-primary">{progressPercent}%</p>
                            <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                        <div className="bg-surface-container-high p-3 md:p-4 rounded-xl border border-outline-variant/30">
                            <p className="text-xs md:text-label-md text-on-surface-variant mb-1">Documents Verified</p>
                            <p className="text-xl md:text-headline-md font-bold text-secondary">
                                {String(doneItems).padStart(2, "0")}/{String(totalItems).padStart(2, "0")}
                            </p>
                        </div>
                        <div className="bg-surface-container-high p-3 md:p-4 rounded-xl border border-outline-variant/30">
                            <p className="text-xs md:text-label-md text-on-surface-variant mb-1">AI Trust Score</p>
                            <p className="text-xl md:text-headline-md font-bold text-primary">{trustScore}</p>
                        </div>
                    </div>

                    {/* Track button + saving */}
                    <div className="flex justify-end mb-6 md:mb-10">
                        <button
                            onClick={() => setShowTrackModal(true)}
                            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-primary text-on-primary rounded-full text-sm md:text-label-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                            Track Documents
                        </button>
                        {saving && (
                            <span className="hidden sm:flex items-center gap-1 text-xs text-on-surface-variant ml-3">
                                <span className="animate-spin material-symbols-outlined text-[14px]">sync</span>
                                Saving…
                            </span>
                        )}
                    </div>

                    {/* Checklist */}
                    <div className="space-y-8 md:space-y-12">
                        {sections.map((section, sectionIdx) => (
                            <section key={sectionIdx}>
                                <h3 className="text-lg md:text-headline-md font-bold mb-4 md:mb-6">{section.title}</h3>
                                <div className="space-y-3 md:space-y-4">
                                    {section.items.map((item, itemIdx) => (
                                        <div
                                            key={item.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleItem(sectionIdx, itemIdx)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    toggleItem(sectionIdx, itemIdx);
                                                }
                                            }}
                                            className={`glass-card p-4 md:p-5 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:shadow-md ${item.done ? "border-l-4 border-primary" : ""
                                                }`}
                                            aria-pressed={item.done}
                                            aria-label={`${item.label} - ${item.done ? "Completed" : "Pending"}`}
                                        >
                                            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                                <div className="h-8 w-8 md:h-10 md:w-10 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-primary text-lg md:text-xl">
                                                        {getItemIcon(item.id)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm md:text-body-md font-semibold wrap-break-word">{item.label}</p>
                                                    <p className="text-xs md:text-body-sm text-on-surface-variant wrap-break-word">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 md:gap-6 shrink-0 ml-3">
                                                <span
                                                    className={`hidden sm:inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-label-md rounded-full ${item.done
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-surface-container-highest text-on-surface-variant"
                                                        }`}
                                                >
                                                    {item.done ? "Completed" : "Pending"}
                                                </span>
                                                <span
                                                    className={`material-symbols-outlined text-xl md:text-2xl transition-colors ${item.done ? "text-primary" : "text-on-surface-variant"
                                                        }`}
                                                >
                                                    {item.done ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Track Documents Modal */}
               {showTrackModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
      {/* Modal header */}
      <div className="px-5 py-5 md:px-8 md:py-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-headline-sm font-bold text-on-surface">
              Verified Documents Tracker
            </h3>
            <p className="text-xs md:text-body-sm text-on-surface-variant mt-1">
              {doneItems} of {totalItems} documents completed
            </p>
          </div>
          <button
            onClick={() => setShowTrackModal(false)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-surface-container-highest hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="w-full bg-surface-variant h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${totalItems > 0 ? (doneItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Modal table body – improved scrolling */}
      <div className="px-5 py-5 md:px-8 md:py-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
        {doneItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl md:text-5xl mb-4">assignment_late</span>
            <p className="text-sm md:text-body-md">No documents verified yet.</p>
            <p className="text-xs md:text-body-sm">Start checking items to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4 md:p-0 -mx-5 md:mx-0">
            <table className="w-full p-4 text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="pb-3 md:pb-4 text-xs md:text-label-md font-medium text-on-surface-variant uppercase tracking-wider pr-3">
                    Section
                  </th>
                  <th className="pb-3 md:pb-4 text-xs md:text-label-md font-medium text-on-surface-variant uppercase tracking-wider pr-3">
                    Document
                  </th>
                  <th className="pb-3 md:pb-4 text-xs md:text-label-md font-medium text-on-surface-variant uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y  divide-outline-variant/10">
                {sections.map((section) =>
                  section.items
                    .filter((item) => item.done)
                    .map((item, idx, filteredItems) => {
                      const isFirstOfSection = idx === 0;
                      return (
                        <tr
                          key={item.id}
                          className={`group hover:bg-surface-container/50 transition-colors ${
                            isFirstOfSection ? "border-t-2 border-outline-variant/30" : ""
                          }`}
                        >
                          <td className="py-3 md:py-4 pr-2 md:pr-4 pl-0 md:pl-0">
                            {isFirstOfSection ? (
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg md:text-[20px]">
                                  {getItemIcon(section.items[0].id)}
                                </span>
                                <span className="text-xs md:text-body-sm font-semibold text-on-surface break-words">
                                  {section.title}
                                </span>
                              </div>
                            ) : (
                              <span className="pl-6 md:pl-8" />
                            )}
                          </td>
                          <td className="py-3 md:py-4 pr-2 md:pr-4">
                            <p className="text-xs md:text-body-sm font-semibold text-on-surface break-words">
                              {item.label}
                            </p>
                            <p className="text-[10px] md:text-body-xs text-on-surface-variant break-words">
                              {item.desc}
                            </p>
                          </td>
                          <td className="py-3 md:py-4 text-right">
                            <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-primary/10 text-primary text-[10px] md:text-label-sm rounded-full">
                              <span className="material-symbols-outlined text-[14px] md:text-[16px]">verified</span>
                              Verified
                            </span>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
)}
            </main>
        </RequireProfile>
    );
}