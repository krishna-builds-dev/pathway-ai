import { createClient } from '@/lib/supabase/server';
import CoursesClient from '@/components/courses/CoursesClient';
import type { Course } from '@/components/courses/CoursesList';

export const revalidate = 3600; // ISR

async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*, cities!inner(name, countries!inner(slug))')
    .order('is_high_demand', { ascending: false });
  return data ?? [];
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesClient initialCourses={courses} />;
}