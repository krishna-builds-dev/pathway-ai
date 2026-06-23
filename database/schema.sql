-- Pathway AI Database Tables
-- Run these CREATE TABLE queries in Supabase SQL Editor

-- ============================================
-- ENUMS (Custom Types)
-- ============================================

CREATE TYPE badge_type AS ENUM ('tier1', 'tier2', 'tier3', 'popular', 'emerging');
CREATE TYPE pr_strength AS ENUM ('excellent', 'very_good', 'good', 'moderate', 'limited');
CREATE TYPE course_level AS ENUM ('undergraduate', 'masters', 'phd', 'diploma', 'certificate');

-- ============================================
-- TABLES
-- ============================================

-- Profiles (Student Information)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  professional_title TEXT,
  professional_summary TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  university TEXT,
  college_summary TEXT,
  degree_name TEXT,
  cgpa TEXT,
  graduation_year SMALLINT,
  target_destination TEXT,
  intake_date TEXT,
  study_level TEXT,
  course_name TEXT,
  preferred_university TEXT,
  budget_numeric NUMERIC,
  short_term_goal TEXT,
  long_term_goal TEXT,
  work_experience TEXT,
  location TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  experiences JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificates JSONB NOT NULL DEFAULT '[]'::jsonb,
  links JSONB NOT NULL DEFAULT '{}'::jsonb,
  interested_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  qualifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Visa Checklists
CREATE TABLE visa_checklists (
  user_id UUID PRIMARY KEY,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Statements of Purpose
CREATE TABLE sops (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  word_count INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Resumes
CREATE TABLE resumes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Countries
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  flag_emoji TEXT,
  hero_image_url TEXT,
  min_living_costs TEXT,
  avg_tuition_range TEXT,
  climate_info TEXT,
  healthcare_info TEXT,
  lifestyle_label TEXT,
  visa_success_rate TEXT,
  work_rights_short TEXT,
  psw_rights_short TEXT,
  min_wage TEXT,
  institutions_count INTEGER NOT NULL DEFAULT 0,
  institution_type_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  subtitle TEXT,
  image_url TEXT,
  rating NUMERIC NOT NULL DEFAULT 0,
  safety_score TEXT,
  rent_numeric INTEGER,
  pr_strength pr_strength,
  tags TEXT[] NOT NULL DEFAULT '{}',
  badge_type badge_type NOT NULL DEFAULT 'popular',
  badge_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(slug, country_id)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  category TEXT NOT NULL,
  level course_level NOT NULL,
  description TEXT,
  curriculum JSONB,
  duration TEXT,
  intake_months TEXT[] NOT NULL DEFAULT '{}',
  fee_numeric INTEGER,
  application_fee_numeric INTEGER,
  ielts_requirement NUMERIC,
  gpa_requirement NUMERIC,
  is_high_demand BOOLEAN NOT NULL DEFAULT FALSE,
  is_top_rated BOOLEAN NOT NULL DEFAULT FALSE,
  pr_pathway BOOLEAN NOT NULL DEFAULT FALSE,
  employment_rate INTEGER,
  qs_ranking INTEGER,
  student_count INTEGER,
  requirements TEXT[],
  career_outcomes TEXT[],
  image_url TEXT,
  course_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Contact Inquiries
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
