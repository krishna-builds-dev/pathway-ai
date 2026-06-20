"use client";

import ErrorPageContent from "@/components/error/ErrorPageContent";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <>
    <main className="flex-1 h-screen flex items-center justify-center px-gutter py-stack-lg">

      <ErrorPageContent error={error} reset={reset} />
    </main>
  </>
}