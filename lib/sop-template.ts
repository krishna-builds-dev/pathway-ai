export interface ProfileData {
    // existing fields …
    fullName?: string;
    country?: string;
    studyLevel?: string;
    interestedCourses?: string[];
    annualBudget?: string;
    course_name?: string;
    preferred_university?: string;
    budget_numeric?: number | null;
    skills?: string[];
    work_experience?: string;
    short_term_goal?: string;
    long_term_goal?: string;
    prev_university?: string;

    // ---- new fields ----
    degree_name?: string;
    cgpa?: string;
    graduation_year?: number;
    college_summary?: string;
    qualifications?: {
        university: string;
        degree_name?: string;
        cgpa: string;
        graduation_year?: number;
        college_summary: string;
    }[];
    experiences?: {
        company: string;
        role: string;
        dates: string;
        location: string;
        description: string;
    }[];
    certificates?: {
        name: string;
        date_issued: string;
        issued_by: string;
    }[];
    languages?: string[];
}

export function generateSOPTemplate(profile: ProfileData): string {
    const {
        fullName = "[Your Name]",
        country: destCountry,
        studyLevel,
        interestedCourses = [],
        annualBudget,
        course_name,
        preferred_university,
        budget_numeric,
        skills = [],
        work_experience,
        short_term_goal,
        long_term_goal,
        prev_university,
        degree_name,
        cgpa,
        graduation_year,
        college_summary,
        qualifications = [],
        experiences = [],
        certificates = [],
        languages = [],
    } = profile;

    const primaryCourse = course_name || interestedCourses[0] || "[Program]";
    const university = preferred_university || "[University]";
    const prevUniName = prev_university || "[Your Previous University]";
    const country = destCountry || "[Country]";
    const budget = budget_numeric
        ? `$${budget_numeric.toLocaleString()}`
        : annualBudget || "[Annual Budget]";
    const skillsText = skills.length
        ? skills.join(", ")
        : "[mention relevant skills]";
    const languagesText = languages.length
        ? languages.join(", ")
        : "English";

    // ---- Build Academic Background Section ----
    let academicSection = `I completed my ${degree_name || studyLevel || "degree"} from ${prevUniName}`;
    if (graduation_year) {
        academicSection += ` in ${graduation_year}`;
    }
    if (cgpa) {
        academicSection += ` with a CGPA of ${cgpa}`;
    }
    academicSection += `.`;
    if (college_summary) {
        academicSection += ` ${college_summary}`;
    }

    // Additional qualifications (if any)
    if (qualifications.length > 0) {
        academicSection += ` In addition, I hold the following qualifications: `;
        qualifications.forEach((q, i) => {
            academicSection += `${q.degree_name || "Degree"} from ${q.university}`;
            if (q.cgpa) academicSection += ` (CGPA: ${q.cgpa})`;
            if (q.graduation_year) academicSection += `, graduated ${q.graduation_year}`;
            if (q.college_summary) academicSection += ` – ${q.college_summary}`;
            if (i < qualifications.length - 1) academicSection += "; ";
        });
        academicSection += `.`;
    }

    // ---- Build Professional Experience Section ----
    let experienceSection = "";
    if (experiences.length > 0) {
        experienceSection = "My professional experience includes:\n";
        experiences.forEach((exp) => {
            experienceSection += `- ${exp.role} at ${exp.company}`;
            if (exp.dates) experienceSection += ` (${exp.dates})`;
            if (exp.description) experienceSection += `: ${exp.description}`;
            experienceSection += "";
        });
    } else if (work_experience) {
        experienceSection = `I have gained practical exposure through ${work_experience}.`;
    } else {
        experienceSection = `I have worked on [specific project or work experience].`;
    }

    // ---- Build Certificates Section ----
    let certSection = "";
    if (certificates.length > 0) {
        certSection = "I have also earned the following certifications:\n";
        certificates.forEach((cert) => {
            certSection += `- ${cert.name}`;
            if (cert.issued_by) certSection += `, issued by ${cert.issued_by}`;
            if (cert.date_issued) certSection += ` (${cert.date_issued})`;
            certSection += "\n";
        });
    }

    // ---- Build Languages Section ----
    const languageSentence = `I am proficient in ${languagesText}.`;

    // ---- Final template assembly ----
    return `I am applying for the ${primaryCourse} at ${university} in ${country}. ${languageSentence}

${academicSection}

My skills include ${skillsText}. ${certSection ? certSection : ""}
${experienceSection}

I have chosen ${university} because of its outstanding reputation in my field and its commitment to innovation and research excellence. The university’s focus on experiential learning and industry partnerships resonates strongly with my learning style and career ambitions.

I have carefully considered the financial commitment involved in studying abroad and have put in place a robust plan to cover all costs. My budget of ${budget} accounts for tuition, living expenses, accommodation, and incidentals.

Upon completing my degree, I aim to ${short_term_goal || "[short‑term goal]"}. In the longer term, I aspire to ${long_term_goal || "[long‑term goal]"}. I am confident that this program will lay the foundation for a successful and impactful career.`;
}