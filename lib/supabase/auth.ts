// lib/supabase/auth.ts
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export const getUser = cache(async (): Promise<User | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        return null;
    }

    return data.user;
});