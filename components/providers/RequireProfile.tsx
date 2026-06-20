import Link from "next/link";

type Props = {
    profileComplete: boolean;
    missingFields: string[];
    message?: string;
    children: React.ReactNode;
};

export default function RequireProfile({
    profileComplete,
    missingFields,
    message = "Complete your profile to unlock this tool.",
    children,
}: Props) {
    if (profileComplete) return <>{children}</>;

    return (
        <main className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card max-w-lg w-full p-8 text-center space-y-6">
                <span className="material-symbols-outlined text-5xl text-error">
                    gpp_maybe
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    Complete Your Profile First
                </h2>
                <p className="text-body-md text-on-surface-variant">{message}</p>
                {missingFields.length > 0 && (
                    <div className="text-left bg-surface-container-high p-4 rounded-xl">
                        <p className="font-label-md text-label-md text-on-surface mb-2">
                            Missing fields:
                        </p>
                        <ul className="list-disc list-inside text-body-sm text-on-surface-variant space-y-1">
                            {missingFields.map((field) => (
                                <li key={field} className="capitalize">
                                    {field.replace(/_/g, " ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-label-md hover:shadow-lg transition-all"
                >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Go to Profile
                </Link>
            </div>
        </main>
    );
}