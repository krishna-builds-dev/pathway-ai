"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!barRef.current) return;
            
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollableHeight = docHeight - winHeight;
            
            if (scrollableHeight <= 0) {
                barRef.current.style.width = "0%";
                return;
            }
            
            const scrollPercent = (window.scrollY / scrollableHeight) * 100;
            barRef.current.style.width = `${scrollPercent}%`;
        };

        // Attach scroll and resize event listeners for dynamic layouts
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        
        // Initial run
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-99999 pointer-events-none bg-transparent">
            <div
                ref={barRef}
                className="h-full w-0 bg-linear-to-r from-primary to-secondary transition-all duration-75 ease-out shadow-[0_0_8px_rgba(53,37,205,0.6)]"
            />
        </div>
    );
}
