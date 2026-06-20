import Link from "next/link";

export default function ProtectedNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Decorative accent */}
            <div className="relative mb-8">
                <div className="absolute inset-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <span
                    className="material-symbols-outlined relative text-[80px] text-primary/60"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                >
                    explore_off
                </span>
            </div>

            <h1 className="font-geist text-6xl font-bold text-primary/80 mb-2">
                404
            </h1>
            <h2 className="font-geist text-xl font-semibold text-on-surface mb-3">
                Page not found
            </h2>
            <p className="text-on-surface-variant text-sm max-w-sm mb-10 leading-relaxed">
                This dashboard page doesn&apos;t exist or may have been moved.
                Head back to your dashboard.
            </p>

            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Go to Dashboard
            </Link>
        </div>
    );
}
