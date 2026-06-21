"use client";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    icon?: string;
}

export default function AuthModal({
    isOpen,
    onClose,
    title = "Start Your Journey",
    description = "Sign in or create an account to start building your university shortlist, comparing fees, and planning your path to permanent residency.",
    icon = "rocket_launch"
}: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            />

            <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-6 flex flex-col gap-6 transform transition-transform duration-300 animate-in zoom-in-95">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant hover:bg-surface-container-low text-on-surface-variant transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="flex flex-col items-center text-center mt-4 gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px] fill-current">{icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mt-2">{title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <button
                        onClick={() => window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                        className="w-full py-3.5 bg-primary select-invert text-on-primary hover:bg-primary/90 transition-all rounded-xl font-bold text-ui-sm text-center shadow-md active:scale-95 cursor-pointer"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => window.location.href = `/get-started?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                        className="w-full py-3.5 border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-all rounded-xl font-bold text-ui-sm text-center active:scale-95 cursor-pointer"
                    >
                        Create Account
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors text-center font-bold hover:underline cursor-pointer"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
}
