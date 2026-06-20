"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/components/providers/AuthProvider';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Course {
    id: string;
    title: string;
    university_name: string;
    category: string;
    level: string;
    duration: string;
    fee_numeric: number;
    intake_months: number[];
    pr_pathway: boolean;
    is_high_demand: boolean;
    image_url: string;
    description?: string;
    requirements?: string[];
    career_outcomes?: string[];
    course_url?: string;
    is_top_rated?: boolean;
    application_fee_numeric?: number;
    qs_ranking?: number;
    student_count?: number;
    employment_rate?: number;
    curriculum?: Array<{ code: string; title: string; desc: string; type?: 'core' | 'elective' }>;
    ielts_requirement?: number;
    gpa_requirement?: number;
    cities: {
        name: string;
        countries: {
            name: string;
            slug: string;
        }
    }
}

interface CourseDetailClientProps {
    course: Course;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Helper functions
    const formatIntake = (months: number[]) => {
        if (!months || months.length === 0) return 'N/A';
        const MONTHS_MAP: { [key: number]: string } = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        };
        return months.map(m => MONTHS_MAP[m] || m).join(', ');
    };

    const getCourseDescription = (c: Course) => {
        if (c.description && c.description.trim().length > 0) return c.description;
        const title = c.title;
        const uni = c.university_name;
        const level = c.level;

        if (c.category.toLowerCase().includes('tech') || c.category.toLowerCase().includes('it')) {
            return `The ${title} at ${uni} is a premier program engineered for high-potential technology innovators and software systems architects. It seamlessly blends theoretical foundations in computer science and advanced algorithmic design with intensive, project-driven software development laboratories.

Throughout their academic journey, students master full-stack software development, cloud infrastructure architectures, artificial intelligence integration, and cybersecurity best practices. The curriculum is closely aligned with international professional accreditation frameworks, preparing graduates to immediately enter competitive software engineering, tech consulting, and system management roles globally.`;
        }
        if (c.category.toLowerCase().includes('health') || c.category.toLowerCase().includes('nursing') || c.category.toLowerCase().includes('care')) {
            return `The ${title} at ${uni} delivers high-fidelity clinical and academic training for aspiring global healthcare practitioners. By pairing rigorous scientific lectures with extensive clinical placement rotations in premium regional hospitals, the program ensures students develop deep diagnostic skills, professional licensing readiness, and compassionate patient care techniques.

Students engage deeply with advanced physiological sciences, modern clinical nursing methodologies, acute care management, and public health policy frameworks. Graduates emerge fully equipped to meet professional registration criteria and enter high-demand careers across international hospitals, community clinics, and specialized care sectors.`;
        }
        if (c.category.toLowerCase().includes('business') || c.category.toLowerCase().includes('commerce') || c.category.toLowerCase().includes('admin')) {
            return `The ${title} at ${uni} is engineered to cultivate high-acuity strategic thinking and leadership within modern global business environments. Through rigorous, real-world case study analyses, active investment simulations, and industry-led corporate consulting projects, students develop advanced capabilities in financial modeling, modern marketing paradigms, and sustainable corporate development.

The course covers essential areas including risk management, data-driven market analytics, human capital strategies, and international business trade frameworks. Graduates are highly sought-after by top-tier financial consultancies, multinational conglomerates, and technology startups for critical analyst and executive leadership pathways.`;
        }
        return `The ${level} level ${title} program at ${uni} offers structured, research-led pathways toward advanced professional specialization. Integrating cutting-edge academic methodologies with practical industry applications, this course ensures international students acquire the advanced analytical skills and deep critical capabilities required to excel in complex modern workforces.

Students collaborate closely with faculty mentors, engage in peer-led team initiatives, and build strong professional portfolios. Graduates leave with a globally recognized qualification that enhances their migration score and positions them for competitive career acceleration.`;
    };

    const getCareersMock = (category: string, currency: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('tech') || cat.includes('it') || cat.includes('comput')) {
            return [
                { title: 'Data Scientist', salary: `Avg. $115k ${currency}`, icon: 'trending_up' },
                { title: 'ML Engineer', salary: `Avg. $130k ${currency}`, icon: 'psychology' },
                { title: 'Business Analyst', salary: `Avg. $95k ${currency}`, icon: 'insights' }
            ];
        }
        if (cat.includes('health') || cat.includes('nurs') || cat.includes('medic') || cat.includes('care')) {
            return [
                { title: 'Registered Nurse', salary: `Avg. $85k ${currency}`, icon: 'medical_services' },
                { title: 'Clinical Supervisor', salary: `Avg. $105k ${currency}`, icon: 'health_and_safety' },
                { title: 'Health Administrator', salary: `Avg. $95k ${currency}`, icon: 'admin_panel_settings' }
            ];
        }
        if (cat.includes('bus') || cat.includes('comm') || cat.includes('manag') || cat.includes('econ')) {
            return [
                { title: 'Investment Analyst', salary: `Avg. $110k ${currency}`, icon: 'query_stats' },
                { title: 'Marketing Director', salary: `Avg. $135k ${currency}`, icon: 'campaign' },
                { title: 'Operations Manager', salary: `Avg. $115k ${currency}`, icon: 'settings_suggest' }
            ];
        }
        return [
            { title: 'Research Specialist', salary: `Avg. $90k ${currency}`, icon: 'explore' },
            { title: 'Project Manager', salary: `Avg. $100k ${currency}`, icon: 'business_center' },
            { title: 'Academic Consultant', salary: `Avg. $85k ${currency}`, icon: 'assignment' }
        ];
    };

    const getAdmissionMetrics = (c: Course) => ({
        gpa: c.gpa_requirement
            ? `${c.gpa_requirement} GPA or equivalent`
            : (c.requirements?.[0] || '65% (WAM) or equivalent'),
        ielts: c.ielts_requirement
            ? `${c.ielts_requirement} Overall`
            : (c.requirements?.[1] || '6.5 Overall (no band < 6.0)'),
        prereqs: c.requirements?.[2] || (c.category.toLowerCase().includes('tech') ? 'Math & Programming foundation' : 'Relevant undergraduate degree background')
    });

    const countrySlug = course.cities.countries.slug;
    const countryName = course.cities.countries.name;
    const currency = countrySlug === 'australia' ? 'AUD' : 'NZD';
    const hasPR = course.pr_pathway || course.is_high_demand;

    // Career outcomes - explicit type for title parameter
    const careersMock = course.career_outcomes && Array.isArray(course.career_outcomes) && course.career_outcomes.length > 0
        ? course.career_outcomes.slice(0, 3).map((title: string, i: number) => {
            const icons = ['trending_up', 'psychology', 'insights'];
            const avgSal = countrySlug === 'australia' ? 100000 + (i * 15000) : 90000 + (i * 10000);
            return { title, salary: `Avg. $${(avgSal / 1000).toFixed(0)}k ${currency}`, icon: icons[i] || 'work' };
        })
        : getCareersMock(course.category, currency);

    const admissionMetrics = getAdmissionMetrics(course);

    return (
        <main className="pb-5  max-w-container-max mx-auto  flex flex-col gap-8">
            {/* Top Navigation Back Action */}
            <div className="relative z-10">
                <Link
                    href="/dashboard/courses"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl bg-white text-on-surface-variant hover:bg-surface-container-low font-bold text-base transition-all cursor-pointer shadow-sm hover:-translate-x-1"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back to Courses
                </Link>
            </div>

            {/* Hero Section */}
            <section className="flex flex-col gap-6 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    {(course.is_top_rated || (course.qs_ranking && course.qs_ranking <= 50)) && (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                            Top Rated
                        </span>
                    )}
                    {course.is_high_demand && (
                        <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-caps text-label-caps flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                            High Demand
                        </span>
                    )}
                    <span className="text-on-surface-variant font-ui-sm text-ui-sm font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                        {course.university_name}
                    </span>
                </div>

                <h1 className="font-h1-marketing text-4xl lg:text-5xl font-black tracking-tight text-on-background leading-tight">
                    {course.title}
                </h1>

                {/* Snapshot Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 lg:max-w-4xl">
                    <div className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                        <span className="text-on-surface-variant font-label-caps text-[10px] uppercase opacity-75 mb-1 font-bold">Duration</span>
                        <span className="text-primary font-black text-lg">{course.duration}</span>
                    </div>
                    <div className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                        <span className="text-on-surface-variant font-label-caps text-[10px] uppercase opacity-75 mb-1 font-bold">Intake</span>
                        <span className="text-primary font-black text-lg">{formatIntake(course.intake_months)}</span>
                    </div>
                    <div className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                        <span className="text-on-surface-variant font-label-caps text-[10px] uppercase opacity-75 mb-1 font-bold">Mode</span>
                        <span className="text-primary font-black text-lg">On-campus</span>
                    </div>
                    <div className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                        <span className="text-on-surface-variant font-label-caps text-[10px] uppercase opacity-75 mb-1 font-bold">Location</span>
                        <span className="text-primary font-black text-lg">{course.cities.name}</span>
                    </div>
                </div>
            </section>

            {/* Split Content Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* Left Column Content (8 columns) */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {/* Overview */}
                    <section className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                            <h2 className="font-h2-dashboard text-xl font-black text-on-background">Course Overview</h2>
                        </div>
                        <p className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">
                            {getCourseDescription(course)}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="flex gap-3 items-start p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl">
                                <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">check_circle</span>
                                <span className="text-sm font-bold text-on-surface-variant">Master advanced subjects and methodologies in {course.category}.</span>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl">
                                <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">check_circle</span>
                                <span className="text-sm font-bold text-on-surface-variant">Develop industry-aligned professional licensing skills.</span>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl">
                                <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">check_circle</span>
                                <span className="text-sm font-bold text-on-surface-variant">Streamlined work rights pathways in {countryName}.</span>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl">
                                <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">check_circle</span>
                                <span className="text-sm font-bold text-on-surface-variant">Undertake active research internships or industry capstone projects.</span>
                            </div>
                        </div>
                    </section>

                    {/* Entry Requirements */}
                    <section className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                            <h2 className="font-h2-dashboard text-xl font-black text-on-background">Entry Requirements</h2>
                        </div>
                        <div className="bg-surface-container-low/40 p-6 rounded-2xl border border-outline-variant/60 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                            <div className="flex flex-col gap-2">
                                <span className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold tracking-wider opacity-70">ACADEMIC GPA</span>
                                <p className="text-on-background font-black text-base">{admissionMetrics.gpa}</p>
                            </div>
                            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-outline-variant/50 pt-4 md:pt-0 md:pl-6">
                                <span className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold tracking-wider opacity-70">ENGLISH (IELTS)</span>
                                <p className="text-on-background font-black text-base">{admissionMetrics.ielts}</p>
                            </div>
                            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-outline-variant/50 pt-4 md:pt-0 md:pl-6">
                                <span className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold tracking-wider opacity-70">PREREQUISITES</span>
                                <p className="text-on-background font-black text-base">Prior Major Studies</p>
                            </div>
                        </div>
                    </section>

                    {/* Career Outcomes */}
                    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                            <h2 className="font-h2-dashboard text-xl font-black text-on-background">Career Outcomes</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {careersMock.map((item, i) => (
                                <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-on-background text-base">{item.title}</h4>
                                        <p className="text-primary font-extrabold text-sm mt-1">{item.salary}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column Sidebar (4 columns) */}
                <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-6 mt-8 lg:mt-0">
                    {/* AI Advisor Widget */}
                    <div className="bg-secondary-container p-6 rounded-2xl text-on-secondary-container shadow-md flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <div>
                                <h4 className="font-black text-base select-invert">Pathway AI Advisor</h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <p className="text-[11px] opacity-90 font-medium select-invert">Online now</p>
                                </div>
                            </div>
                        </div>
                        {user ? (
                            <p className="text-sm leading-relaxed select-invert">
                                Based on your profile, here's your compatibility with this course — and what we can help you prepare next.
                            </p>
                        ) : (
                            <p className="text-sm leading-relaxed select-invert">
                                Sign in to unlock your personalized AI compatibility with this course - and what we can help you prepare next.
                            </p>
                        )}
                        <button
                            onClick={() => {
                                if (user) {
                                    router.push('/dashboard/ai');
                                } else {
                                    setShowAuthModal(true);
                                }
                            }}
                            className="bg-white text-secondary py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all cursor-pointer w-full"
                        >
                            Talk to AI Advisor
                        </button>
                    </div>

                    {/* Migration/PR points Widget */}
                    {hasPR && (
                        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-tertiary fill-current text-[20px]">verified</span>
                                <h3 className="text-base font-black text-on-surface">Migration & PR Points</h3>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {countrySlug === 'australia'
                                    ? `This course matches occupations on the Australian MLTSSL list, giving streamlined access to regional 189/190 skilled visas.`
                                    : `This course satisfies New Zealand Green List requirements, enabling fast-track straight-to-residence PR visas.`}
                            </p>
                            <div className="flex gap-2">
                                {course.pr_pathway && <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[11px] font-bold rounded uppercase tracking-wider">PR Pathway</span>}
                                {course.is_high_demand && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded uppercase tracking-wider">High Demand</span>}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Metrics */}
                    {(course.student_count || course.qs_ranking || course.employment_rate) && (
                        <div className="bg-surface-container-low/20 border border-outline-variant/40 p-6 rounded-2xl flex flex-col gap-4">
                            <h4 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Course Metrics</h4>
                            {course.student_count && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
                                    <span className="font-medium">{course.student_count.toLocaleString()}+ International Students</span>
                                </div>
                            )}
                            {course.qs_ranking && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-primary text-[18px]">public</span>
                                    <span className="font-medium">Global School Ranking: #{course.qs_ranking}</span>
                                </div>
                            )}
                            {course.employment_rate && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-primary text-[18px]">work</span>
                                    <span className="font-medium">{course.employment_rate}% Graduate Employment Rate</span>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </main>
    );
}