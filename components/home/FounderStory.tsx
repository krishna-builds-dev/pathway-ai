import Image from 'next/image';

export default function FounderStory() {
    return (
        <section className="py-12 lg:py-stack-lg bg-white">
            <div className="max-w-4xl mx-auto px-margin text-center">
                <span
                    className="material-symbols-outlined text-primary mb-6 text-[40px] lg:text-[64px]"
                >
                    format_quote
                </span>
                <h2 className="font-h1-marketing text-xl lg:text-3xl mb-8 italic text-on-surface">
                    &ldquo;I arrived in Sydney with two suitcases and no idea where to find the best
                    student job or how to navigate my visa. I built Pathway AI so no student has to
                    start from zero again.&rdquo;
                </h2>
                <div className="flex flex-col items-center">
                    <div className="font-h2-dashboard text-lg">Rojan Adhikari</div>
                    <div className="font-label-caps text-on-surface-variant">Founder, Pathway AI</div>
                </div>
            </div>
        </section>
    );
}