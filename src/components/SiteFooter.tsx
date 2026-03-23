import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <footer className="mt-auto border-t-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)] px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-sm text-[var(--pixel-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>{t("disclaimer")}</p>
        <a
          href="https://www.linkedin.com/in/eidast/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--pixel-accent)] underline decoration-2 underline-offset-2 hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
        >
          {t("linkedin")}
        </a>
      </div>
    </footer>
  );
}
