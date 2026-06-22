"use client";

import React, { useRef, useState, useEffect, useTransition } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserMeta } from "@/hooks/useUserMeta";
import { createClient } from "@/lib/supabase/client";
import {
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
    UserProfileData,
} from "./actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/compress-image";


// Types
type Qualification = {
    university: string;
    degree_name?: string;
    cgpa: string;
    graduation_year: number | undefined;
    college_summary: string;
};

type Experience = {
    company: string;
    role: string;
    dates: string;
    location: string;
    description: string;
};

type Certificate = {
    name: string;
    date_issued: string;
    issued_by: string;
};

// Static data
const staticStudyLevels = ["Undergraduate", "Masters", "PhD"];

const POPULAR_DESTINATIONS = [
    "Australia",
    "New Zealand",
    "United Kingdom",
    "United States",
    "Canada",
    "Germany",
    "Ireland",
    "Netherlands",
    "France",
    "Sweden",
];



const generateIntakeSeasons = () => {
    const currentYear = new Date().getFullYear();
    const seasons = ["Spring", "Summer", "Winter"];
    const terms: { label: string; value: string }[] = [];
    [currentYear, currentYear + 1].forEach((year) => {
        if (seasons.includes("Spring"))
            terms.push({ label: `Spring ${year}`, value: `Spring ${year}` });
        if (seasons.includes("Summer"))
            terms.push({ label: `Summer ${year}`, value: `Summer ${year}` });
        if (seasons.includes("Winter"))
            terms.push({ label: `Winter ${year + 1}`, value: `Winter ${year + 1}` });
    });
    return terms;
};

export default function ProfilePage() {

    const supabase = createClient();

    const { user } = useAuth();
    const {
        avatarUrl: authAvatarUrl,
        fullName: authFullName,
        email: authEmail,
        initials,
    } = useUserMeta(user);
    const router = useRouter();

    // Avatar
    const [avatarUrlState, setAvatarUrlState] = useState<string | null>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // General states
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState("account-identity");

    // Dynamic lists
    const [intakeSeasons] = useState(generateIntakeSeasons());
    const [studyLevels] = useState(staticStudyLevels);

    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [interestedCourses, setInterestedCourses] = useState<string[]>([]);
    const [links, setLinks] = useState<string[]>([]);

    // Profile form
    const [formData, setFormData] = useState<UserProfileData>({
        full_name: "",
        professional_title: "",
        phone_number: "",
        university: "",
        degree_name: "",
        cgpa: "",
        graduation_year: undefined,
        target_destination: "",
        intake_date: "",
        study_level: "",
        course_name: "",
        preferred_university: "",
        budget_numeric: undefined,
        short_term_goal: "",
        long_term_goal: "",
        professional_summary: "",
        location: "",
        work_experience: "",
        college_summary: "",
    });

    // ----- Data Fetching -----
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            const [profileResult] = await Promise.all([getUserProfile()]);

            const { success, data, error } = profileResult;
            if (success && data) {
                setFormData({
                    full_name: data.full_name || authFullName,
                    professional_title: data.professional_title || "",
                    phone_number: data.phone_number || "",
                    university: data.university || "",
                    degree_name: data.degree_name || "",
                    cgpa: data.cgpa || "",
                    graduation_year: data.graduation_year || undefined,
                    target_destination: data.target_destination || "",
                    intake_date: data.intake_date || "",
                    study_level: data.study_level || "",
                    course_name: data.course_name || "",
                    preferred_university: data.preferred_university || "",
                    budget_numeric: data.budget_numeric ?? undefined,
                    short_term_goal: data.short_term_goal || "",
                    long_term_goal: data.long_term_goal || "",
                    professional_summary: data.professional_summary || "",
                    location: data.location || "",
                    work_experience: data.work_experience || "",
                    college_summary: data.college_summary || "",
                });
                setQualifications(Array.isArray(data.qualifications) ? data.qualifications : []);
                setExperiences(Array.isArray(data.experiences) ? data.experiences : []);
                setCertificates(Array.isArray(data.certificates) ? data.certificates : []);
                setSkills(Array.isArray(data.skills) ? data.skills : []);
                setLanguages(Array.isArray(data.languages) ? data.languages : []);
                setInterestedCourses(Array.isArray(data.interested_courses) ? data.interested_courses : []);
                setLinks(Array.isArray(data.links) ? data.links : []);
                setAvatarUrlState(data.avatar_url || authAvatarUrl || null);
            } else if (!data) {
                setFormData((prev) => ({ ...prev, full_name: authFullName }));
                setAvatarUrlState(authAvatarUrl || null);
            } else if (error) {
                toast.error("Failed to load profile data.");
            }
            setIsLoading(false);
        };

        fetchData();
    }, [user, authFullName, authAvatarUrl, supabase]);

    // ----- Handlers -----
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? null : parseInt(value, 10)) : value,
        }));
    };

    // Qualifications
    const handleAddQualification = () =>
        setQualifications((prev) => [
            ...prev,
            { university: "", degree_name: "", cgpa: "", graduation_year: undefined, college_summary: "" },
        ]);
    const handleRemoveQualification = (index: number) =>
        setQualifications((prev) => prev.filter((_, i) => i !== index));
    const handleQualificationChange = (
        index: number,
        field: keyof Qualification,
        value: string | number
    ) =>
        setQualifications((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: field === "graduation_year" ? (value ? Number(value) : undefined) : value }
                    : item
            )
        );

    // Experiences
    const handleAddExperience = (exp: Experience) => setExperiences((prev) => [...prev, exp]);
    const handleRemoveExperience = (index: number) =>
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    const handleExperienceChange = (index: number, field: keyof Experience, value: string) =>
        setExperiences((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );

    // Certificates
    const handleAddCertificate = (cert: Certificate) => setCertificates((prev) => [...prev, cert]);
    const handleRemoveCertificate = (index: number) =>
        setCertificates((prev) => prev.filter((_, i) => i !== index));
    const handleCertificateChange = (index: number, field: keyof Certificate, value: string) =>
        setCertificates((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );

    // Skills
    const handleAddSkill = () => setSkills((prev) => [...prev, ""]);
    const handleRemoveSkill = (index: number) => setSkills((prev) => prev.filter((_, i) => i !== index));
    const handleSkillChange = (index: number, value: string) =>
        setSkills((prev) => prev.map((item, i) => (i === index ? value : item)));

    // Languages
    const handleAddLanguage = (lang: string) => setLanguages((prev) => [...prev, lang]);
    const handleRemoveLanguage = (index: number) =>
        setLanguages((prev) => prev.filter((_, i) => i !== index));
    const handleLanguageChange = (index: number, value: string) =>
        setLanguages((prev) => prev.map((item, i) => (i === index ? value : item)));

    // Interested Courses
    const handleAddInterestedCourse = () => setInterestedCourses((prev) => [...prev, ""]);
    const handleRemoveInterestedCourse = (index: number) =>
        setInterestedCourses((prev) => prev.filter((_, i) => i !== index));
    const handleInterestedCourseChange = (index: number, value: string) =>
        setInterestedCourses((prev) => prev.map((item, i) => (i === index ? value : item)));

    // Links
    const handleAddLink = () => setLinks((prev) => [...prev, ""]);
    const handleRemoveLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index));
    const handleLinkChange = (index: number, value: string) =>
        setLinks((prev) => prev.map((item, i) => (i === index ? value : item)));

    // Avatar
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        try {
            const compressed = await compressImage(file, 600);
            const fd = new FormData();
            fd.append("file", compressed, file.name);
            const result = await uploadAvatar(fd);
            if (result.success && result.avatarUrl) {
                setAvatarUrlState(result.avatarUrl);
                toast.success("Avatar uploaded");
                router.refresh();
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch {
            toast.error("Error uploading avatar");
        } finally {
            setAvatarUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Save
    const handleSave = () => {
        startTransition(async () => {
            const payload = {
                ...formData,
                qualifications,
                experiences,
                certificates,
                skills,
                languages,
                interested_courses: interestedCourses,
                links,
            };
            const { success, error } = await updateUserProfile(payload);
            if (success) {
                toast.success("Profile saved");
            }
            else { toast.error(error || "Failed to save"); }
        });
    };

    const tabs = [
        { id: "account-identity", label: "Account Identity" },
        { id: "academic-background", label: "Academic Background" },
        { id: "study-preferences", label: "Study Preferences" },
        { id: "professional-experience", label: "Professional Experience" },
        { id: "additional-info", label: "Additional Info" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto  md:px-0 space-y-8 pb-24">
            {/* Header */}
            <div>
                <h3 className="text-xl md:text-headline-lg font-bold text-on-surface mb-2">
                    Manage your Identity
                </h3>
                <p className="text-xs md:text-body-md text-on-surface-variant">
                    Control your academic credentials, personal details, and connected ecosystem.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-outline-variant max-w-[calc(100vw-32px)] lg:max-w-full">
                <div className="flex gap-4 md:gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 md:pb-4 text-[11px] md:text-sm transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                ? "font-semibold text-primary border-b-2 border-primary"
                                : "font-medium text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <section className="w-full">
                    {/* ===================== TAB 1: Account Identity ===================== */}
                    {activeTab === "account-identity" && (
                        <div className="space-y-gutter animate-in fade-in duration-300">
                            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">

                                    {/* Avatar – centred on mobile */}
                                    <div className="relative group mx-auto md:mx-0">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-on-primary shadow-lg overflow-hidden relative flex items-center justify-center bg-primary-fixed">
                                            {avatarUrlState ? (
                                                <img
                                                    src={avatarUrlState}
                                                    alt="Avatar"
                                                    width={128}
                                                    height={128}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-3xl md:text-4xl font-bold text-[#1e00a9]">{initials}</span>
                                            )}
                                            {avatarUploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="material-symbols-outlined animate-spin text-white text-3xl">sync</span>
                                                </div>
                                            )}
                                            {!avatarUploading && (
                                                <button
                                                    className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <span className="material-symbols-outlined text-3xl">photo_camera</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                                            <span
                                                className="material-symbols-outlined text-blue-600 text-[18px] md:text-[20px] font-bold"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* Identity fields */}
                                    <div className="flex-1 w-full min-w-0 space-y-5 md:space-y-6">

                                        {/* Row 1: Full Name, Professional Title, Location */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Full Name</label>
                                                <input
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    className="w-full max-w-md px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Professional Title</label>
                                                <input
                                                    name="professional_title"
                                                    value={formData.professional_title}
                                                    onChange={handleInputChange}
                                                    className="w-full max-w-md px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all"
                                                    placeholder="e.g. Undergraduate Researcher"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Location</label>
                                                <input
                                                    name="location"
                                                    value={formData.location || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full max-w-md px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all"
                                                    placeholder="e.g. Sydney, Australia"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Email, Phone */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Email Address</label>
                                                <input
                                                    className="w-full max-w-md px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all text-on-surface-variant/70"
                                                    type="email"
                                                    value={authEmail || ""}
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Phone Number</label>
                                                <input
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleInputChange}
                                                    className="w-full max-w-md px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all"
                                                    type="tel"
                                                    placeholder="+1 (555) 012-3456"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Professional Summary */}
                                        <div className="space-y-2">
                                            <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Professional Summary</label>
                                            <textarea
                                                name="professional_summary"
                                                value={formData.professional_summary || ""}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all resize-none"
                                                placeholder="Brief overview of your skills, goals, and what you bring to the table."
                                            />
                                        </div>

                                        {/* Row 4: Links */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block mb-1 text-xs md:text-label-md font-medium text-on-surface-variant">Links</label>
                                                <button
                                                    onClick={handleAddLink}
                                                    type="button"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">add</span>
                                                    Add Link
                                                </button>
                                            </div>
                                            {links.length === 0 && (
                                                <p className="text-xs text-on-surface-variant italic">
                                                    No links added yet. Add your GitHub, LinkedIn, or portfolio.
                                                </p>
                                            )}
                                            <div className="space-y-2">
                                                {links.map((link, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <input
                                                            value={link}
                                                            onChange={(e) => handleLinkChange(idx, e.target.value)}
                                                            placeholder="https://github.com/your-profile"
                                                            type="text"
                                                            className="flex-1 max-w-md md:max-w-lg lg:max-w-none px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-sm md:text-body-sm outline-none transition-all"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveLink(idx)}
                                                            type="button"
                                                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB 2: Academic Background ===================== */}
                    {activeTab === "academic-background" && (
                        <div className="space-y-gutter animate-in fade-in duration-300">
                            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                                <h4 className="text-headline-sm font-bold text-on-surface mb-6">Education Details</h4>

                                {/* Primary Education */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">College / University</label>
                                        <input
                                            name="university"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. Stanford University"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Degree Name</label>
                                        <input
                                            name="degree_name"
                                            value={formData.degree_name || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. Bachelor of Science"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">CGPA / Grade</label>
                                        <input
                                            name="cgpa"
                                            value={formData.cgpa}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. 3.8/4.0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Graduation Year</label>
                                        <input
                                            name="graduation_year"
                                            value={formData.graduation_year || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="YYYY"
                                            type="number"
                                        />
                                    </div>
                                </div>

                                {/* College Summary */}
                                <div className="space-y-2 mb-8">
                                    <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">College Summary</label>
                                    <textarea
                                        name="college_summary"
                                        value={formData.college_summary || ""}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all resize-none"
                                        placeholder="Describe your college experience, projects, and activities."
                                    />
                                </div>

                                {/* Additional Qualifications */}
                                {qualifications.map((qual, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-outline-variant/50 rounded-2xl p-4 space-y-4 mb-4 relative pr-10"
                                    >
                                        <button
                                            onClick={() => handleRemoveQualification(idx)}
                                            className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                            title="Remove qualification"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">College / University</label>
                                                <input
                                                    value={qual.university}
                                                    onChange={(e) => handleQualificationChange(idx, "university", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                                    placeholder="e.g. University of Toronto"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Degree Name</label>
                                                <input
                                                    value={qual.degree_name || ""}
                                                    onChange={(e) => handleQualificationChange(idx, "degree_name", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                                    placeholder="e.g. Master of Science"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">CGPA / Grade</label>
                                                <input
                                                    value={qual.cgpa}
                                                    onChange={(e) => handleQualificationChange(idx, "cgpa", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                                    placeholder="e.g. 3.6/4.0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Graduation Year</label>
                                                <input
                                                    value={qual.graduation_year || ""}
                                                    onChange={(e) => handleQualificationChange(idx, "graduation_year", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                                    placeholder="YYYY"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                        {/* College Summary for qualification */}
                                        <div className="space-y-2">
                                            <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">College Summary</label>
                                            <textarea
                                                value={qual.college_summary}
                                                onChange={(e) => handleQualificationChange(idx, "college_summary", e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all resize-none"
                                                placeholder="Describe your experience at this institution."
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="text-right mt-4">
                                    <button
                                        onClick={handleAddQualification}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        Add Another Qualification
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB 3: Study Preferences ===================== */}
                    {activeTab === "study-preferences" && (
                        <div className="space-y-gutter animate-in fade-in duration-300">
                            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                                <h4 className="text-headline-sm font-bold text-on-surface mb-6">Your Academic Goals</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Target Destination</label>
                                        <select
                                            name="target_destination"
                                            value={formData.target_destination}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Select a country</option>
                                            {POPULAR_DESTINATIONS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Intake Dates</label>
                                        <select
                                            name="intake_date"
                                            value={formData.intake_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Select intake</option>
                                            {intakeSeasons.map((term) => (
                                                <option key={term.value} value={term.value}>{term.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Annual Budget (USD)</label>
                                        <input
                                            name="budget_numeric"
                                            type="number"
                                            value={formData.budget_numeric ?? ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. 50000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Study Level</label>
                                        <select
                                            name="study_level"
                                            value={formData.study_level}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Select level</option>
                                            {studyLevels.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Course Applying For</label>
                                        <input
                                            name="course_name"
                                            value={formData.course_name || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. Master of Computer Science"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Preferred University</label>
                                        <input
                                            name="preferred_university"
                                            value={formData.preferred_university || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all"
                                            placeholder="e.g. University of Auckland"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB 4: Professional Experience ===================== */}
                    {activeTab === "professional-experience" && (
                        <div className="space-y-gutter animate-in fade-in duration-300">
                            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-headline-sm font-bold text-on-surface">Professional Experience</h4>
                                    <button
                                        onClick={() =>
                                            handleAddExperience({
                                                company: "",
                                                role: "",
                                                dates: "",
                                                location: "",
                                                description: "",
                                            })
                                        }
                                        type="button"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        Add Experience
                                    </button>
                                </div>
                                {experiences.length === 0 && (
                                    <p className="text-xs text-on-surface-variant italic mb-4">No experience added yet.</p>
                                )}
                                {experiences.map((exp, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-outline-variant/30 rounded-xl p-4 space-y-3 mb-4 relative pr-10"
                                    >
                                        <button
                                            onClick={() => handleRemoveExperience(idx)}
                                            className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                value={exp.company}
                                                onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                                                className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                placeholder="Company"
                                            />
                                            <input
                                                value={exp.role}
                                                onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                                                className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                placeholder="Role"
                                            />
                                            <input
                                                value={exp.dates}
                                                onChange={(e) => handleExperienceChange(idx, "dates", e.target.value)}
                                                className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                placeholder="Dates (e.g. 2020-2023)"
                                            />
                                            <input
                                                value={exp.location}
                                                onChange={(e) => handleExperienceChange(idx, "location", e.target.value)}
                                                className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                placeholder="Location"
                                            />
                                        </div>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                                            className="w-full px-3 py-2 border border-outline-variant rounded text-sm min-h-[80px]"
                                            placeholder="Description"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===================== TAB 5: Additional Info ===================== */}
                    {activeTab === "additional-info" && (
                        <div className="space-y-gutter animate-in fade-in duration-300">
                            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                                <h4 className="text-headline-sm font-bold text-on-surface mb-6">Additional Information</h4>
                                <div className="space-y-8">
                                    {/* Short & Long Term Goals */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Short‑Term Goal</label>
                                            <textarea
                                                name="short_term_goal"
                                                value={formData.short_term_goal || ""}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all resize-none"
                                                placeholder="e.g. Become a software engineer at a top tech firm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Long‑Term Goal</label>
                                            <textarea
                                                name="long_term_goal"
                                                value={formData.long_term_goal || ""}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-body-sm outline-none transition-all resize-none"
                                                placeholder="e.g. Lead a technology team or start my own company"
                                            />
                                        </div>
                                    </div>

                                    {/* Skills & Interested Courses – 50% width each */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Skills */}
                                        {/* Skills */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Skills</label>
                                                <button
                                                    onClick={handleAddSkill}
                                                    type="button"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    Add Skill
                                                </button>
                                            </div>
                                            {skills.length === 0 && (
                                                <p className="text-xs text-on-surface-variant italic">No skills added yet.</p>
                                            )}
                                            <div className="space-y-3">
                                                {skills.map((skill, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center border border-outline-variant/30 rounded-xl p-4 pr-10 relative"
                                                    >
                                                        <input
                                                            value={skill}
                                                            onChange={(e) => handleSkillChange(idx, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-outline-variant rounded text-sm"
                                                            placeholder="e.g. React"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveSkill(idx)}
                                                            type="button"
                                                            className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Interested Courses */}
                                        {/* Interested Courses */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">
                                                    Other Courses You're Interested In
                                                </label>
                                                <button
                                                    onClick={handleAddInterestedCourse}
                                                    type="button"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    Add Course
                                                </button>
                                            </div>
                                            {interestedCourses.length === 0 && (
                                                <p className="text-xs text-on-surface-variant italic">No courses added yet.</p>
                                            )}
                                            <div className="space-y-3">
                                                {interestedCourses.map((course, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center border border-outline-variant/30 rounded-xl p-4 pr-10 relative"
                                                    >
                                                        <input
                                                            value={course}
                                                            onChange={(e) => handleInterestedCourseChange(idx, e.target.value)}
                                                            placeholder="e.g., Master of Computer Science"
                                                            type="text"
                                                            className="flex-1 px-3 py-2 border border-outline-variant rounded text-sm"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveInterestedCourse(idx)}
                                                            type="button"
                                                            className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Languages */}

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Languages</label>
                                                <button
                                                    onClick={() => handleAddLanguage("")}
                                                    type="button"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    Add Language
                                                </button>
                                            </div>
                                            {languages.length === 0 && (
                                                <p className="text-xs text-on-surface-variant italic">No languages added yet.</p>
                                            )}
                                            <div className="space-y-3">
                                                {languages.map((lang, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center border border-outline-variant/30 rounded-xl p-4 pr-10 relative"
                                                    >
                                                        <input
                                                            value={lang}
                                                            onChange={(e) => handleLanguageChange(idx, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-outline-variant rounded text-sm"
                                                            placeholder="e.g. English"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveLanguage(idx)}
                                                            type="button"
                                                            className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Certificates */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block mb-1 text-label-md font-label-md text-on-surface-variant">Certificates</label>
                                                <button
                                                    onClick={() =>
                                                        handleAddCertificate({
                                                            name: "",
                                                            date_issued: "",
                                                            issued_by: "",
                                                        })
                                                    }
                                                    type="button"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-bold hover:bg-primary/5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    Add Certificate
                                                </button>
                                            </div>
                                            {certificates.length === 0 && (
                                                <p className="text-xs text-on-surface-variant italic">No certificates added yet.</p>
                                            )}
                                            {certificates.map((cert, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border border-outline-variant/30 rounded-xl p-4 space-y-3 relative pr-10"
                                                >
                                                    <button
                                                        onClick={() => handleRemoveCertificate(idx)}
                                                        className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <input
                                                            value={cert.name}
                                                            onChange={(e) => handleCertificateChange(idx, "name", e.target.value)}
                                                            className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                            placeholder="Certificate name"
                                                        />
                                                        <input
                                                            value={cert.date_issued}
                                                            onChange={(e) => handleCertificateChange(idx, "date_issued", e.target.value)}
                                                            className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                            placeholder="Date issued"
                                                        />
                                                        <input
                                                            value={cert.issued_by}
                                                            onChange={(e) => handleCertificateChange(idx, "issued_by", e.target.value)}
                                                            className="w-full px-3 py-2 border border-outline-variant rounded text-sm"
                                                            placeholder="Issued by"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex select-invert items-center gap-1.5 md:gap-2 px-5 py-3 md:px-8 md:py-4 bg-primary text-on-primary rounded-full text-sm md:text-base font-bold shadow-xl shadow-primary/20 hover:bg-primary-container transform hover:-translate-y-1 transition-all active:scale-95 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">sync</span> Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined select-invert">save</span> Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}