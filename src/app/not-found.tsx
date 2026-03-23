import Link from "next/link";

/** Fallback when no `[locale]` segment matches (rare with next-intl middleware). */
export default function RootNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-lg font-medium">404</h1>
      <p className="mt-2 max-w-sm text-sm opacity-80">
        Page not found. Try a locale home:
      </p>
      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/en" className="text-blue-400 underline">
          /en
        </Link>
        <Link href="/es" className="text-blue-400 underline">
          /es
        </Link>
      </div>
    </div>
  );
}
