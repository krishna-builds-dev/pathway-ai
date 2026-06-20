import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const nextRaw = searchParams.get('next') ?? '/dashboard';

  // -------------------- 1. Sanitise the redirect target --------------------
  let next: string;
  try {
    // Parse relative to origin – this strips any external domain
    const parsed = new URL(nextRaw, origin);
    // Ensure it's on the same origin and starts with '/'
    if (parsed.origin !== origin || !parsed.pathname.startsWith('/')) {
      next = '/dashboard';
    } else {
      next = parsed.pathname + parsed.search;
    }
  } catch {
    next = '/dashboard';
  }

  // -------------------- 2. Handle OAuth / email errors --------------------
  if (error === 'access_denied') {
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  if (error) {
    // Log the error for debugging (optional)
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}`);
  }

  // -------------------- 3. Exchange code for session --------------------
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Code exchange failed:', exchangeError);
  }

  // Fallback error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}