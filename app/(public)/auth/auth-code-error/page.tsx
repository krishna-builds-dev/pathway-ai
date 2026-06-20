'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthCodeErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorContent = () => {
        switch (error) {
            case 'invalid_request':
                return {
                    title: 'Invalid Request',
                    message: 'The authentication request was malformed. Please try signing in again.',
                };
            case 'unauthorized_client':
                return {
                    title: 'Unauthorized Application',
                    message: 'This application is not authorized to sign you in. Please contact support.',
                };
            case 'access_denied':
                return {
                    title: 'Sign In Cancelled',
                    message: 'You cancelled the sign‑in process. No worries – you can try again below.',
                };
            case 'invalid_grant':
                return {
                    title: 'Expired or Used Code',
                    message: 'The verification code has already been used or expired. Please request a new one.',
                };
            default:
                return {
                    title: 'Authentication Error',
                    message: 'Something went wrong during sign in. Please try again.',
                };
        }
    };

    const { title, message } = getErrorContent();

    return (
        <main className="flex-grow flex items-center justify-center px-gutter mt-30 mb-15 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
            <div className="w-full max-w-[440px] z-10">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-stack-md group">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-25"></div>
                        <span className="material-symbols-outlined text-[40px] text-primary" data-icon="verified_user">
                            error_outline
                        </span>

                    </div>
                    <h1 className="font-h2-dashboard text-h2-dashboard text-on-surface mb-stack-sm">{title}</h1>
                    <p className="font-body-md text-on-surface-variant mb-stack-lg leading-relaxed">
                        {message}
                    </p>
                    <div className="w-full flex flex-col gap-stack-sm mb-stack-md">
                        <Link href="/sign-in"
                            className="w-full bg-primary-container text-white font-ui-sm text-ui-sm py-4 rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >

                            Return to Sign In
                        </Link>

                    </div>
                    <div className="pt-stack-md border-t border-outline-variant w-full flex items-center justify-center gap-2">
                        <span className="font-ui-sm text-ui-sm text-on-surface-variant">Still having trouble?</span>
                        <Link
                            className="font-ui-sm text-ui-sm text-primary font-semibold hover:underline"
                            href="/contact"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}