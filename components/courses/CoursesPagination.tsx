interface CoursesPaginationProps {
    currentPage: number;
    totalCount: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
}

export default function CoursesPagination({
    currentPage,
    totalCount,
    itemsPerPage = 10,
    onPageChange
}: CoursesPaginationProps) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Hide pagination if all results fit on 1 page
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    // Calculate a window of pages to show (e.g. up to 5 pages around the current page)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-1.5 md:gap-2 pt-6 md:pt-8">
            {/* Prev button */}
            <button
                disabled={currentPage === 1}
                onClick={handlePrev}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_left</span>
            </button>

            {/* Render ellipsis if there are pages before our start page */}
            {pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-low cursor-pointer text-xs md:text-sm"
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="px-0.5 md:px-1 text-xs text-on-surface-variant/60">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border transition-colors cursor-pointer text-xs md:text-sm font-medium
        ${currentPage === page
                            ? 'bg-primary text-on-primary border-primary font-bold'
                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                    {page}
                </button>
            ))}

            {/* Render ellipsis if there are pages after our end page */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-0.5 md:px-1 text-xs text-on-surface-variant/60">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-low cursor-pointer text-xs md:text-sm"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next button */}
            <button
                disabled={currentPage === totalPages}
                onClick={handleNext}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_right</span>
            </button>
        </div>
    );
}
