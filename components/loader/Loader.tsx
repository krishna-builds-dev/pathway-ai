"use client";

import { useEffect, useState } from "react";

interface LoaderProps {
    /** 
     * If true, overlays the entire screen. 
     * If false, centers the loader within the available container space.
     */
    fullScreen?: boolean;
}

const loadingMessages = [
    "Analyzing 500+ university matches...",
    "Evaluating visa pathways...",
    "Curating course options...",
    "Finalizing your AI roadmap..."
];

export default function Loader({ fullScreen = false }: LoaderProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    // Rotate through the dynamic messages every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const content = (
        <main className="flex flex-col items-center justify-center flex-1 max-w-2xl text-center mx-auto px-4">
            {/* AI Loading Element */}
            <div className="relative mb-stack-lg flex items-center justify-center w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                <span 
                    className="material-symbols-outlined text-primary text-[48px] sparkle-pulse" 
                    data-icon="auto_awesome" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    auto_awesome
                </span>
            </div>

            {/* Heading */}
            <h2 
                className="font-h1-marketing text-h1-marketing text-on-surface mb-gutter fade-in-up" 
                style={{ animationDelay: '0.1s' }}
            >
                Preparing your personalized roadmap...
            </h2>

            {/* Dynamic Subtext */}
            <div 
                className="h-8 flex items-center justify-center fade-in-up" 
                style={{ animationDelay: '0.3s' }}
            >
                <p 
                    key={messageIndex}
                    className="font-body-lg text-body-lg text-on-surface-variant message-fade animate-pulse" 
                    id="dynamic-message"
                >
                    {loadingMessages[messageIndex]}
                </p>
            </div>
        </main>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-surface/90 backdrop-blur-md">
                {content}
            </div>
        );
    }

    return (
        <div className="flex w-full h-[60vh] items-center justify-center">
            {content}
        </div>
    );
}
