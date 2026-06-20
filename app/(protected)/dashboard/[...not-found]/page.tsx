import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched URLs under /dashboard/*.
 * Calls notFound() which bubbles up to (protected)/not-found.tsx,
 * rendering the 404 inside the sidebar layout.
 */
export default function DashboardCatchAll() {
    notFound();
}
