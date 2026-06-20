"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/app/(protected)/dashboard/profile/actions";
import { getVisaChecklist } from "@/app/(protected)/dashboard/visa/actions";

export default function DashboardPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [sopCount, setSopCount] = useState(0);
    const [resumeExists, setResumeExists] = useState(false);
    const [visaProgress, setVisaProgress] = useState(0);
    const [visaDone, setVisaDone] = useState(0);
    const [visaTotal, setVisaTotal] = useState(0);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [showProfileBanner, setShowProfileBanner] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const [profileRes, visaRes] = await Promise.all([
                    getUserProfile(),
                    getVisaChecklist(),
                ]);
                let profileData = null;
                if (profileRes.success && profileRes.data) {
                    profileData = profileRes.data;
                    setProfile(profileData);
                }
                if (visaRes.success && visaRes.sections) {
                    const sections = visaRes.sections;
                    const total = sections.reduce((acc: number, sec: any) => acc + sec.items.length, 0);
                    const done = sections.reduce(
                        (acc: number, sec: any) => acc + sec.items.filter((i: any) => i.done).length,
                        0
                    );
                    setVisaTotal(total);
                    setVisaDone(done);
                    setVisaProgress(total === 0 ? 0 : Math.round((done / total) * 100));
                }
                const { count: sopCountRes } = await supabase
                    .from("sops")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user.id);
                setSopCount(sopCountRes || 0);
                const { count: resumeCount } = await supabase
                    .from("resumes")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user.id);
                setResumeExists((resumeCount || 0) > 0);
                const [sopsLatest, resumesLatest, visasLatest] = await Promise.all([
                    supabase
                        .from("sops")
                        .select("title, updated_at")
                        .eq("user_id", user.id)
                        .order("updated_at", { ascending: false })
                        .limit(2),
                    supabase
                        .from("resumes")
                        .select("title, updated_at")
                        .eq("user_id", user.id)
                        .order("updated_at", { ascending: false })
                        .limit(2),
                    supabase
                        .from("visa_checklists")
                        .select("updated_at")
                        .eq("user_id", user.id)
                        .order("updated_at", { ascending: false })
                        .limit(2),
                ]);
                const activities: any[] = [];
                (sopsLatest.data || []).forEach((sop: any) => {
                    activities.push({
                        type: "sop",
                        text: `Updated SOP "${sop.title || "Untitled"}"`,
                        time: sop.updated_at,
                    });
                });
                (resumesLatest.data || []).forEach((resume: any) => {
                    activities.push({
                        type: "resume",
                        text: "Updated resume",
                        time: resume.updated_at,
                    });
                });
                (visasLatest.data || []).forEach((visa: any) => {
                    activities.push({
                        type: "visa",
                        text: "Updated visa checklist",
                        time: visa.updated_at,
                    });
                });
                activities.sort(
                    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
                );
                setRecentActivity(activities.slice(0, 3));
            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [user, supabase]);

    const firstName = profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "there";
    const destination = profile?.target_destination || "Australia";
    const intakeDate = profile?.intake_date || "Not set";
    const interestedCoursesCount = profile?.interested_courses?.length || 0;
    const profileCompletePercent = useMemo(() => {
        if (!profile) return 0;
        const fields = [
            "full_name", "professional_title", "phone_number", "university",
            "degree_name", "cgpa", "graduation_year", "target_destination",
            "intake_date", "study_level", "budget_numeric", "course_name",
            "preferred_university", "location", "professional_summary",
            "links", "experiences", "skills", "certificates",
        ];
        let filled = 0;
        fields.forEach((f) => {
            const val = profile[f];
            if (val && (Array.isArray(val) ? val.length > 0 : true)) filled++;
        });
        return Math.round((filled / fields.length) * 100);
    }, [profile]);

    const timeAgo = (dateStr: string) => {
        const now = new Date();
        const then = new Date(dateStr);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    const activityIcon = (type: string) => {
        switch (type) {
            case "sop": return "edit_square";
            case "resume": return "badge";
            case "visa": return "fact_check";
            default: return "history";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Profile incomplete banner – responsive padding and stacking */}
            {profileCompletePercent < 100 && showProfileBanner && (
                <div className="bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl shrink-0">info</span>
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Complete your profile to unlock all features
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                Your profile is only {profileCompletePercent}% complete. Add the missing details to get better recommendations.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <Link
                            href="/dashboard/profile"
                            className="whitespace-nowrap px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:shadow-md transition-all"
                        >
                            Complete Now
                        </Link>
                        <button
                            onClick={() => setShowProfileBanner(false)}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                            aria-label="Dismiss"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Welcome Banner – reduce padding and font size on mobile */}
            <section className="relative overflow-hidden rounded-[24px] bg-[#1e00a9] text-white p-6 md:p-10 shadow-xl">
                <div className="relative z-10 flex justify-between items-start flex-wrap gap-6">
                    <div>
                        <h3 className="font-geist text-2xl md:text-[32px] font-bold mb-2">
                            Welcome back, {firstName} 👋
                        </h3>
                        <p className="text-white/80 text-sm md:text-base mb-6">
                            Here&apos;s your study abroad progress at a glance.
                        </p>
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                {profile?.location || "Your location"}
                            </span>
                            <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                            <span className="text-xs font-semibold uppercase tracking-wider">{destination}</span>
                        </div>
                    </div>
                    <div className="hidden lg:block bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                        <p className="text-xs text-white/70 mb-1 uppercase tracking-wider">Target Intake</p>
                        <p className="font-geist text-xl font-bold">{intakeDate}</p>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
                <div className="absolute -left-20 -top-20 w-60 h-60 bg-white rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
            </section>

            {/* Quick Stats – responsive grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Profile Completion */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#ffdbd1] flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[#621500] text-xl">person</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1e00a9]">{profileCompletePercent}%</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface mb-3">Profile Complete</p>
                    <div className="w-full h-2.5 bg-[#f0ecf9] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-[#1e00a9] to-secondary rounded-full transition-all duration-700"
                            style={{ width: `${profileCompletePercent}%` }}
                        />
                    </div>
                </div>

                {/* Visa Checklist */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#e4e1ee] flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[#1b1b24] text-xl">fact_check</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1e00a9]">{visaProgress}%</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface mb-3">Visa Checklist</p>
                    <div className="w-full h-2.5 bg-[#f0ecf9] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-[#1e00a9] to-secondary rounded-full transition-all duration-700"
                            style={{ width: `${visaProgress}%` }}
                        />
                    </div>
                </div>

                {/* Profile link card */}
                <Link
                    href="/dashboard/profile"
                    className="bg-white p-4 md:p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-[#1e00a9]/20 transition-all duration-300 cursor-pointer group flex flex-col"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#ffdbd1] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[#621500] text-xl">person</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1e00a9] flex items-center gap-1">
                            Edit
                        </span>
                    </div>
                    <p className="text-xs font-medium text-on-surface">Profile</p>
                    <p className="text-xs text-on-surface-variant/60 mt-1 leading-relaxed">
                        Keep your details up to date
                    </p>
                </Link>

                {/* AI Advisor link card */}
                <Link
                    href="/dashboard/advisor"
                    className="bg-white p-4 md:p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-[#1e00a9]/20 transition-all duration-300 cursor-pointer group flex flex-col"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#e4e1ee] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[#1e00a9] text-xl">smart_toy</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1e00a9] flex items-center gap-1">
                            Chat
                        </span>
                    </div>
                    <p className="text-xs font-medium text-on-surface">AI Advisor</p>
                    <p className="text-xs text-on-surface-variant/60 mt-1 leading-relaxed">
                        Get instant, personalised visa guidance
                    </p>
                </Link>
            </section>

            {/* AI Tools – responsive grid */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-geist text-lg md:text-xl font-bold text-[#1b1b24]">Your AI-Powered Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* SOP Builder */}
                    <div className="glass-card p-6 lg:p-8 rounded-[24px] flex flex-col hover:border-[#1e00a9]/30 transition-all group">
                        <div className="mb-6 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#1e00a9] text-[28px] lg:text-[32px]">edit_note</span>
                        </div>
                        <h4 className="font-geist text-base lg:text-lg font-bold mb-2 text-[#1b1b24]">SOP Builder</h4>
                        <p className="text-sm text-on-surface-variant mb-6 lg:mb-8 leading-relaxed flex-1">
                            Craft compelling Statements of Purpose tailored to your target universities with our context-aware AI engine.
                        </p>
                        <Link
                            href="/dashboard/sop"
                            className="mt-auto inline-flex items-center justify-center px-5 py-2.5 lg:px-6 lg:py-3 rounded-full border border-[#1e00a9] text-[#1e00a9] text-xs lg:text-sm font-semibold hover:bg-[#1e00a9] hover:text-white transition-all"
                        >
                            Open Builder →
                        </Link>
                    </div>

                    {/* Resume Builder */}
                    <div className="glass-card p-6 lg:p-8 rounded-[24px] flex flex-col hover:border-[#1e00a9]/30 transition-all group">
                        <div className="mb-6 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#1e00a9] text-[28px] lg:text-[32px]">badge</span>
                        </div>
                        <h4 className="font-geist text-base lg:text-lg font-bold mb-2 text-[#1b1b24]">Resume Builder</h4>
                        <p className="text-sm text-on-surface-variant mb-6 lg:mb-8 leading-relaxed flex-1">
                            Convert your experience into a professional format compliant with AU/NZ admission board standards automatically.
                        </p>
                        <Link
                            href="/dashboard/resume"
                            className="mt-auto inline-flex items-center justify-center px-5 py-2.5 lg:px-6 lg:py-3 rounded-full border border-[#1e00a9] text-[#1e00a9] text-xs lg:text-sm font-semibold hover:bg-[#1e00a9] hover:text-white transition-all"
                        >
                            Open Builder →
                        </Link>
                    </div>

                    {/* Visa Checklist */}
                    <div className="glass-card p-6 lg:p-8 rounded-[24px] flex flex-col hover:border-[#1e00a9]/30 transition-all group">
                        <div className="mb-6 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#1e00a9] text-[28px] lg:text-[32px]">task_alt</span>
                        </div>
                        <h4 className="font-geist text-base lg:text-lg font-bold mb-2 text-[#1b1b24]">Visa Checklist</h4>
                        <p className="text-sm text-on-surface-variant mb-6 lg:mb-8 leading-relaxed flex-1">
                            Auto-generated document lists based on your nationality, destination, and selected program requirements.
                        </p>
                        <Link
                            href="/dashboard/visa"
                            className="mt-auto inline-flex items-center justify-center px-5 py-2.5 lg:px-6 lg:py-3 rounded-full border border-[#1e00a9] text-[#1e00a9] text-xs lg:text-sm font-semibold hover:bg-[#1e00a9] hover:text-white transition-all"
                        >
                            Open Checklist →
                        </Link>
                    </div>
                </div>
            </section>


        </div>
    );
}