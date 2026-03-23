import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

import { FooterPixelStrip } from "./FooterPixelStrip";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <footer className="mt-auto border-t-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)]">
      <FooterPixelStrip />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pb-6 pt-2 text-sm text-[var(--pixel-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-pixel text-[9px] text-[var(--pixel-accent)]" aria-hidden>
            {">"}
          </span>
          <span>{t("disclaimer")}</span>
          <span
            className="footer-pixel-cursor font-pixel text-[9px] leading-none text-[var(--pixel-accent)]"
            aria-hidden
          >
            _
          </span>
        </p>
        <a
          href="https://www.linkedin.com/in/eidast/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel text-[9px] text-[var(--pixel-accent)] underline decoration-2 underline-offset-2 hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
        >
          {t("linkedin")}
        </a>
      </div>
    </footer>
  );
}
