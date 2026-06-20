import { useRouter, usePathname } from 'next/navigation';

type TabType = 'side-by-side' | 'australia' | 'new-zealand';

interface CountriesToggleProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function CountriesToggle({ activeTab, onTabChange }: CountriesToggleProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleTabChange = (tab: TabType) => {
        onTabChange(tab);
        router.push(`${pathname}?tab=${tab}`, { scroll: false });
    };

    return (
        <section className="max-w-container-max mx-auto mb-stack-md flex justify-center px-2 md:px-0">
            <div className="bg-surface-container-low p-1 md:p-1.5 rounded-xl border border-outline-variant flex gap-1 shadow-sm overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-2">
                <button
                    onClick={() => handleTabChange('side-by-side')}
                    className={`${activeTab === 'side-by-side'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                        } px-2 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-ui-sm flex items-center gap-1 md:gap-2 transition-all cursor-pointer whitespace-nowrap snap-start`}
                >
                    {/* <span className="material-symbols-outlined hidden- md:inline text-[18px] md:text-[20px]">
                        compare_arrows
                    </span> */}
                    Side-by-Side
                </button>
                <button
                    onClick={() => handleTabChange('australia')}
                    className={`${activeTab === 'australia'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                        } px-2 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-ui-sm transition-colors cursor-pointer whitespace-nowrap snap-start`}
                >
                    Australia
                </button>
                <button
                    onClick={() => handleTabChange('new-zealand')}
                    className={`${activeTab === 'new-zealand'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                        } px-2 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-ui-sm transition-colors cursor-pointer whitespace-nowrap snap-start`}
                >
                    New Zealand
                </button>
            </div>
        </section>
    );
}