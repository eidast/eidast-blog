import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

import { LocaleSwitcher } from "./LocaleSwitcher";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <header className="border-b-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-pixel text-xs text-[var(--pixel-fg)] tracking-wide hover:text-[var(--pixel-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)] sm:text-sm"
        >
          eidast
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          <Link
            href="/"
            className="text-sm text-[var(--pixel-fg-soft)] hover:text-[var(--pixel-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
          >
            {t("home")}
          </Link>
          <Link
            href="/blog"
            className="text-sm text-[var(--pixel-fg-soft)] hover:text-[var(--pixel-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
          >
            {t("blog")}
          </Link>
          <Link
            href="/about"
            className="text-sm text-[var(--pixel-fg-soft)] hover:text-[var(--pixel-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
          >
            {t("about")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
