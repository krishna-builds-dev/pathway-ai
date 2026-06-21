export function isProfileComplete(profile: Record<string, any> | null): { complete: boolean; missingFields: string[] } {
    if (!profile) return { complete: false, missingFields: ['profile'] };

    const arr = (key: string): any[] => {
        const val = profile[key];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        }
        return [];
    };

    const missingFields: string[] = [];
    if (!profile.full_name) missingFields.push('full_name');
    if (!profile.professional_title) missingFields.push('professional_title');
    if (!profile.phone_number) missingFields.push('phone_number');
    if (!profile.university) missingFields.push('university');
    if (!profile.degree_name) missingFields.push('degree_name');
    if (!profile.cgpa) missingFields.push('cgpa');
    if (!profile.graduation_year) missingFields.push('graduation_year');
    if (!profile.target_destination) missingFields.push('target_destination');
    if (!profile.intake_date) missingFields.push('intake_date');
    if (!profile.study_level) missingFields.push('study_level');
    if (!profile.budget_numeric) missingFields.push('budget_numeric');
    if (!profile.course_name) missingFields.push('course_name');
    if (!profile.preferred_university) missingFields.push('preferred_university');
    if (!profile.location) missingFields.push('location');
    if (!profile.professional_summary) missingFields.push('professional_summary');
    if (arr('links').length === 0) missingFields.push('links');
    if (arr('experiences').length === 0) missingFields.push('experiences');
    if (arr('skills').length === 0) missingFields.push('skills');
    if (arr('certificates').length === 0) missingFields.push('certificates');

    return {
        complete: missingFields.length === 0,
        missingFields,
    };
}