import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-stack-lg px-margin relative overflow-hidden">
      {/* Background Accents to match the Hero style */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -z-10" />

      <div className="text-center max-w-2xl mx-auto z-10">
        <h1 className="font-h1-marketing text-6xl md:text-8xl lg:text-9xl font-bold text-primary mb-4 drop-shadow-sm">
          404
        </h1>
        <h2 className="font-h2-dashboard text-2xl md:text-3xl font-bold text-on-surface mb-6">
          Lost in transit?
        </h2>
        <p className="text-on-surface-variant font-geist text-ui-lg mb-10 max-w-md mx-auto">
          It looks like the page you're looking for has moved, been deleted, or never existed in the first place. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all font-geist text-ui-md flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">home</span>
            Return Home
          </Link>

        </div>
      </div>
    </main>
  );
}
