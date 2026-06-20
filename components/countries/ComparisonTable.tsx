"use client";

interface Country {
    name: string;
    slug: string;
    healthcare_info?: string | null;
    climate_info?: string | null;
    avg_tuition_range?: string | null;
    min_living_costs?: string | null;
    min_wage?: string | null;
    top_cities?: string | null;
    relational_cities?: string[];
    relational_courses?: string[];
    work_rights_short?: string | null;
    psw_rights_short?: string | null;
}

export default function ComparisonTable({ countries }: { countries: Country[] }) {
    // Find specific countries for column mapping
    const au = countries.find(c => c.slug === 'australia');
    const nz = countries.find(c => c.slug === 'new-zealand');

    // Helper to format cities
    const formatCities = (country?: Country) => {
        if (country?.relational_cities && country.relational_cities.length > 0) {
            return country.relational_cities.join(', ');
        }
        return country?.top_cities || 'N/A';
    };

    // Helper to format courses
    const formatCourses = (country?: Country) => {
        if (country?.relational_courses && country.relational_courses.length > 0) {
            return country.relational_courses.join(', ');
        }
        return 'N/A';
    };

    const rows = [
        {
            label: 'Top Cities',
            australia: formatCities(au),
            newZealand: formatCities(nz),
        },
        {
            label: 'Demand Fields',
            australia: formatCourses(au),
            newZealand: formatCourses(nz),
        },

        {
            label: 'Work Rights',
            australia: au?.work_rights_short || 'N/A',
            newZealand: nz?.work_rights_short || 'N/A',
        },
        {
            label: 'PSW Rights',
            australia: au?.psw_rights_short || 'N/A',
            newZealand: nz?.psw_rights_short || 'N/A',
        },
        {
            label: 'Min. Wage',
            australia: au?.min_wage || 'N/A',
            newZealand: nz?.min_wage || 'N/A',
        },
        {
            label: 'Avg. Tuition',
            australia: au?.avg_tuition_range || 'N/A',
            newZealand: nz?.avg_tuition_range || 'N/A',
        },
        {
            label: 'Living Costs',
            australia: au?.min_living_costs || 'N/A',
            newZealand: nz?.min_living_costs || 'N/A',
        },
        {
            label: 'Healthcare',
            australia: au?.healthcare_info || 'N/A',
            newZealand: nz?.healthcare_info || 'N/A',
        },
        {
            label: 'Climate',
            australia: au?.climate_info || 'N/A',
            newZealand: nz?.climate_info || 'N/A',
        }
    ];

    return (
        <section className="max-w-container-max mx-auto mb-8 lg:mb-stack-lg  md:px-0">
            {/* 
               CRITICAL FIX: A min-w element inside a flex layout will stretch the entire page. 
               We break this by capping the container's max-width on mobile to the screen width minus padding.
            */}
            <div className="w-full max-w-[calc(100vw-50px)] md:max-w-none mx-auto">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                    {/* Scrollable wrapper with temporary red border for debugging */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="bg-surface-bright border-b border-outline-variant">
                                    <th className="p-3 md:p-6 font-bold text-on-surface text-xs md:text-label-caps whitespace-nowrap md:whitespace-normal">
                                        Feature
                                    </th>
                                    <th className="p-3 md:p-6 font-bold text-primary text-xs md:text-label-caps whitespace-nowrap md:whitespace-normal">
                                        Australia
                                    </th>
                                    <th className="p-3 md:p-6 font-bold text-primary text-xs md:text-label-caps tracking-wide whitespace-nowrap md:whitespace-normal">
                                        New Zealand
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors group"
                                    >
                                        <td className="p-3 md:p-6 font-bold text-on-surface bg-surface-container-low/20 w-1/4">
                                            <div className="text-xs md:text-base whitespace-nowrap md:whitespace-normal">
                                                {row.label}
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-6 text-on-surface-variant text-xs md:text-body-sm leading-relaxed whitespace-nowrap md:whitespace-normal">
                                            {row.australia}
                                        </td>
                                        <td className="p-3 md:p-6 text-on-surface-variant text-xs md:text-body-sm leading-relaxed whitespace-nowrap md:whitespace-normal">
                                            {row.newZealand}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
