import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

import { FooterCitySimulation } from "./FooterCitySimulation";
import { PixelInstagramIcon, PixelLinkedInIcon, PixelXIcon } from "./PixelSocialIcon";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <footer className="relative mt-auto flex min-h-[168px] flex-col overflow-hidden border-t-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)]">
      {/* City only in the upper band so links/icons never sit on top of the animation */}
      <div className="relative min-h-[96px] flex-1 overflow-hidden">
        <FooterCitySimulation />
      </div>
      <div className="relative z-10 shrink-0 border-t-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)] px-4 pb-5 pt-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-[var(--pixel-muted)] sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/eidast/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("linkedin")}
              className="inline-flex items-center justify-center border border-[var(--pixel-border)] bg-[var(--pixel-bg)] p-1.5 text-[var(--pixel-accent)] shadow-[2px_2px_0_0_var(--pixel-shadow)] hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
            >
              <PixelLinkedInIcon size={22} className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/eidast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("instagram")}
              className="inline-flex items-center justify-center border border-[var(--pixel-border)] bg-[var(--pixel-bg)] p-1.5 text-[var(--pixel-accent)] shadow-[2px_2px_0_0_var(--pixel-shadow)] hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
            >
              <PixelInstagramIcon
                size={22}
                className="h-[22px] w-[22px] shrink-0"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://x.com/eidast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("x")}
              className="inline-flex items-center justify-center border border-[var(--pixel-border)] bg-[var(--pixel-bg)] p-1.5 text-[var(--pixel-accent)] shadow-[2px_2px_0_0_var(--pixel-shadow)] hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
            >
              <PixelXIcon size={22} className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
