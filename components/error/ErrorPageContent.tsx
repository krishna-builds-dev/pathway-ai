"use client";

interface ErrorPageContentProps {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
    description?: string;
}

export default function ErrorPageContent({
    error,
    reset,
    title = "Something went wrong on our end.",
    description = "We've encountered an internal server error. Our team has been notified and is working to restore your academic path.",
}: ErrorPageContentProps) {
    return (
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-stack-lg items-center">
            {/* Left side – visual */}
            <div className="relative hidden md:flex justify-center order-2 md:order-1">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                <div className="relative animate-float">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 lg:p-8 rounded-xl shadow-sm error-glow">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-surface-container-high rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                                <span
                                    className="material-symbols-outlined text-primary text-4xl lg:text-6xl"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    bolt
                                </span>
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <span className="material-symbols-outlined text-error text-lg lg:text-xl">warning</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-6xl lg:text-display-xl font-bold text-primary opacity-20 block leading-none">
                                    500
                                </span>
                                <span className="text-[10px] lg:text-label-caps text-outline uppercase tracking-[0.2em] -mt-2 block">
                                    Internal Server Error
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side – message & actions */}
            <div className="flex flex-col space-y-4 lg:space-y-stack-md order-1 md:order-2 text-center md:text-left">
                <div className="space-y-4">
                    <h1 className="text-2xl lg:text-h1-marketing font-bold text-on-surface">
                        {title}
                    </h1>
                    <p className="text-sm lg:text-body-lg text-on-surface-variant max-w-md">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                    <button
                        onClick={() => reset()}
                        className="inline-flex select-invert items-center justify-center px-6 lg:px-8 py-3 bg-linear-to-r from-primary to-secondary text-on-primary font-bold text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer"
                    >
                        Try Again
                        <span className="material-symbols-outlined select-invert ml-2 text-sm group-hover:translate-x-1 transition-transform">
                            refresh
                        </span>
                    </button>

                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 lg:px-8 py-3 bg-white border border-outline-variant text-on-surface-variant font-bold text-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined mr-2 text-sm">home</span>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}