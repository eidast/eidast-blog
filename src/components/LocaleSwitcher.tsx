"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

/**
 * Uses locale-aware `Link` (next-intl) instead of `router.replace`, so the
 * locale cookie and prefixed URL stay in sync with App Router navigation.
 */
export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const href = pathname && pathname.length > 0 ? pathname : "/";

  return (
    <div
      className="flex gap-0 border-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)] font-pixel text-[10px]"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) =>
        loc === locale ? (
          <span
            key={loc}
            className="min-w-[2.5rem] px-2 py-1 text-center bg-[var(--pixel-accent)] text-[var(--pixel-bg)]"
            aria-current="true"
          >
            {labels[loc]}
          </span>
        ) : (
          <Link
            key={loc}
            href={href}
            locale={loc}
            replace
            scroll={false}
            prefetch={false}
            className="min-w-[2.5rem] px-2 py-1 text-center text-[var(--pixel-fg)] transition-colors hover:bg-[var(--pixel-grid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
          >
            {labels[loc]}
          </Link>
        ),
      )}
    </div>
  );
}
