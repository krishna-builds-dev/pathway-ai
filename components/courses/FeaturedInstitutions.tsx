export default function FeaturedInstitutions() {
    const institutions = [
        {
            title: 'University of Melbourne',
            location: 'Melbourne, VIC',
            badge: 'Rank #1 Engineering',
            courses: '420+ Courses',
            tag: 'Group of Eight',
            tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
            image:
                '/images/courses/melbourne.png',
        },
        {
            title: 'UNSW Sydney',
            location: 'Kensington, NSW',
            badge: 'Top Post-Grad Hire',
            courses: '315+ Courses',
            tag: 'Regional Leader',
            tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
            image:
                '/images/courses/sydney.png',
        },
        {
            title: 'University of Adelaide',
            location: 'Adelaide, SA',
            badge: 'Regional Points',
            courses: '180+ Courses',
            tag: 'Regional Bonus',
            tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
            image:
                '/images/courses/adelaide.png',
        },
    ];

    return (
        <div>
            <h2 className="font-h2-dashboard text-h2-dashboard text-on-surface mb-stack-md">
                Featured Institutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {institutions.map((inst) => (
                    <div
                        key={inst.title}
                        className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="h-32 bg-primary-fixed relative overflow-hidden">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={inst.image}
                                alt={inst.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-3 left-3 bg-secondary text-on-secondary px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                {inst.badge}
                            </span>
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                            <h4 className="font-h2-dashboard text-lg text-on-surface">{inst.title}</h4>
                            <div className="flex items-center gap-2 text-on-surface-variant text-ui-sm">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                <span>{inst.location}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-ui-sm font-semibold text-primary">{inst.courses}</span>
                                <span className={`px-2 py-1 ${inst.tagColor} rounded text-[12px] font-bold`}>
                                    {inst.tag}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
