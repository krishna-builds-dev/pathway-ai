import { notFound } from "next/navigation";

/**
 * Catch-all route for unmatched public URLs.
 *
 * When a user navigates to e.g. /ais or /random,
 * and no matching page exists, this catch-all fires and calls notFound(),
 * which renders (public)/not-found.tsx within the public layout (Header/Footer).
 */
export default function PublicCatchAll() {
    notFound();
}
