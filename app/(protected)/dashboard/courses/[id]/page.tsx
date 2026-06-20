import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CourseDetailClient from './CourseDetailClient';

export const revalidate = 3600; // ISR: still works in Next.js 15

export default async function CoursePage({
    params,
}: {
    params: Promise<{ id: string }>;   // ✅ params is a Promise
}) {
    const { id } = await params;        // ✅ must be awaited

    const supabase = await createClient();
    const { data: course, error } = await supabase
        .from('courses')
        .select('*, cities(name, countries(name, slug))')
        .eq('id', id)
        .single();

    if (error || !course) notFound();

    return <CourseDetailClient course={course} />;
}