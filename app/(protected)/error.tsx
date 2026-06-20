"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import ErrorPageContent from "@/components/error/ErrorPageContent";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <main className="flex-1 h-[calc(100vh-8rem)] flex items-center justify-center px-gutter py-stack-lg">
        <ErrorPageContent error={error} reset={reset} />
      </main>
    </>
  )

}