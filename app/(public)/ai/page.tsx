import { AiHero, AiTools, AiWorks } from "@/components/ai";
import CTABanner from "@/components/cta/Banner";

export const revalidate = 86400; // 24 hours


export default function ai() {

    return (
        <main className="pt-12 md:pt-20">
            <AiHero />
            <AiTools />
            <AiWorks />
            <CTABanner />
        </main>

    );
}
