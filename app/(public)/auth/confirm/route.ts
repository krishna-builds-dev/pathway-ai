import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const redirectTo = request.nextUrl.clone()
    const validTypes = ['signup', 'recovery', 'invite', 'magiclink'];
    redirectTo.pathname = next

    if (token_hash && type && validTypes.includes(type)) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // return the user to an error page with some instructions
    redirectTo.pathname = '/auth/auth-code-error'
    return NextResponse.redirect(redirectTo)
}