// types/index.ts
// Shared TypeScript types across the Pathway application

export type BadgeType = 'primary' | 'secondary' | 'warning' | 'danger' | 'success';

export type PRStrength = 'low' | 'medium' | 'high' | 'very_high';

export type CourseLevel = 'Certificate' | 'Diploma' | 'Bachelor' | 'Postgraduate Diploma' | 'Master' | 'PhD';

export interface Country {
  id: string;
  slug: string;
  name: string;
  flag_emoji?: string;
  hero_image_url?: string;
  institution_type_label: string;
  institutions_count: number;
  min_wage?: string;
  visa_success_rate?: string;
  work_rights_short?: string;
  psw_rights_short?: string;
  lifestyle_label?: string;
  healthcare_info?: string;
  climate_info?: string;
  avg_tuition_range?: string;
  min_living_costs?: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  country_id: string;
  slug: string;
  name: string;
  subtitle?: string;
  rating: number;
  badge_text?: string;
  badge_type: BadgeType;
  image_url?: string;
  tags: string[];
  rent_numeric?: number;
  safety_score?: string;
  pr_strength?: PRStrength;
  created_at: string;
  updated_at: string;
}

export interface CurriculumItem {
  code: string;
  title: string;
  desc: string;
  type: 'Core' | 'Elective' | 'Lab' | 'Project';
}

export interface Course {
  id: string;
  city_id: string;
  slug: string;
  title: string;
  university_name: string;
  category: string;
  level: CourseLevel;
  duration?: string;
  image_url?: string;
  fee_numeric?: number;
  intake_months: number[];
  pr_pathway: boolean;
  is_high_demand: boolean;

  // AI-Enriched fields
  description?: string;
  requirements?: string[];
  career_outcomes?: string[];
  course_url?: string;
  qs_ranking?: number;
  ielts_requirement?: number;
  gpa_requirement?: number;
  student_count?: number;
  employment_rate?: number;
  is_top_rated?: boolean;
  application_fee_numeric?: number;
  curriculum?: CurriculumItem[];

  created_at: string;
  updated_at: string;
}
