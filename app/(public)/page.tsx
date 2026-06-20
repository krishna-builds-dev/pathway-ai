import {
  FeatureHighlights,
  FounderStory,
  Hero,
  ProblemSection,
  SolutionSection,
} from '@/components/home';

import CTABanner from '@/components/cta/Banner';

export const revalidate = 3600; // 1 hour
export default function Home() {

  return (
    <main className="pt-24">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeatureHighlights />
      <FounderStory />
      <CTABanner />
    </main>
  );
}

