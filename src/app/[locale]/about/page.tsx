import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { PixelCard } from "@/components/PixelCard";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "AboutPage" });
  const base = getSiteUrl();

  return {
    title: t("title"),
    description: t("body").slice(0, 160),
    alternates: {
      canonical: `${base}/${locale}/about`,
      languages: {
        en: `${base}/en/about`,
        es: `${base}/es/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: "AboutPage" });
  const highlights = t.raw("highlights") as string[];
  const snapshot = t.raw("snapshot") as Array<{ value: string; label: string }>;
  const verticals = t.raw("verticals") as string[];
  const timeline = t.raw("timeline") as Array<{
    period: string;
    title: string;
    org: string;
    summary: string;
  }>;
  const projects = t.raw("projects") as Array<{
    period: string;
    title: string;
    org: string;
    summary: string;
  }>;
  const skillsGroups = t.raw("skillsGroups") as Array<{
    title: string;
    items: string[];
  }>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <section aria-labelledby="about-snapshot">
        <h2
          id="about-snapshot"
          className="font-pixel text-sm uppercase tracking-wide text-[var(--pixel-muted)]"
        >
          {t("snapshotTitle")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {snapshot.map((item) => (
            <PixelCard key={item.label} className="p-3">
              <p className="font-pixel text-[11px] text-[var(--pixel-accent)]">{item.value}</p>
              <p className="mt-1 text-[12px] leading-snug text-[var(--pixel-fg-soft)]">{item.label}</p>
            </PixelCard>
          ))}
        </div>
      </section>

      <PixelCard className="p-6 sm:p-8">
        <h1 className="font-pixel text-xl text-[var(--pixel-fg)]">{t("title")}</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--pixel-fg-soft)]">
          {t("body")}
        </p>

        <section className="mt-8" aria-labelledby="about-highlights">
          <h2
            id="about-highlights"
            className="font-pixel text-[11px] uppercase tracking-wide text-[var(--pixel-accent)]"
          >
            {t("highlightsTitle")}
          </h2>
          <ul className="mt-4 space-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="border-l-2 border-[var(--pixel-border)] pl-3 text-[14px] leading-relaxed text-[var(--pixel-fg-soft)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="about-verticals">
          <h2
            id="about-verticals"
            className="font-pixel text-[11px] uppercase tracking-wide text-[var(--pixel-accent)]"
          >
            {t("verticalsTitle")}
          </h2>
          <ul className="post-tag-list mt-4">
            {verticals.map((vertical) => (
              <li key={vertical}>
                <span className="post-tag-chip">{vertical}</span>
              </li>
            ))}
          </ul>
        </section>
      </PixelCard>

      <div className="mt-8 space-y-3">
        <details open className="group">
          <summary className="cursor-pointer list-none">
            <PixelCard className="flex items-center justify-between p-4">
              <span className="font-pixel text-sm uppercase tracking-wide text-[var(--pixel-muted)]">
                {t("timelineTitle")}
              </span>
              <span className="font-pixel text-[10px] text-[var(--pixel-accent)]">
                {timeline.length}
              </span>
            </PixelCard>
          </summary>
          <ol className="mt-4 space-y-4">
            {timeline.map((item, idx) => (
              <li key={`${item.period}-${item.title}`}>
                <PixelCard className="relative p-4 sm:p-5">
                  <span
                    aria-hidden
                    className="absolute left-3 top-5 h-2 w-2 bg-[var(--pixel-accent)] shadow-[2px_2px_0_0_var(--pixel-shadow)]"
                  />
                  {idx < timeline.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute bottom-[-18px] left-[0.95rem] top-8 w-[2px] bg-[var(--pixel-border)]"
                    />
                  ) : null}
                  <div className="pl-5">
                    <p className="font-pixel text-[10px] text-[var(--pixel-accent)]">{item.period}</p>
                    <h3 className="mt-1 text-[15px] font-semibold text-[var(--pixel-fg)]">{item.title}</h3>
                    <p className="text-sm text-[var(--pixel-muted)]">{item.org}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--pixel-fg-soft)]">
                      {item.summary}
                    </p>
                  </div>
                </PixelCard>
              </li>
            ))}
          </ol>
        </details>

        <details className="group">
          <summary className="cursor-pointer list-none">
            <PixelCard className="flex items-center justify-between p-4">
              <span className="font-pixel text-sm uppercase tracking-wide text-[var(--pixel-muted)]">
                {t("projectsTitle")}
              </span>
              <span className="font-pixel text-[10px] text-[var(--pixel-accent)]">{projects.length}</span>
            </PixelCard>
          </summary>
          <ol className="mt-4 space-y-4">
            {projects.map((item) => (
              <li key={`${item.period}-${item.title}`}>
                <PixelCard className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--pixel-fg)]">{item.title}</h3>
                    <span className="font-pixel text-[10px] text-[var(--pixel-accent)]">{item.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--pixel-muted)]">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--pixel-fg-soft)]">
                    {item.summary}
                  </p>
                </PixelCard>
              </li>
            ))}
          </ol>
        </details>

        <details className="group">
          <summary className="cursor-pointer list-none">
            <PixelCard className="flex items-center justify-between p-4">
              <span className="font-pixel text-sm uppercase tracking-wide text-[var(--pixel-muted)]">
                {t("skillsTitle")}
              </span>
              <span className="font-pixel text-[10px] text-[var(--pixel-accent)]">
                {skillsGroups.length}
              </span>
            </PixelCard>
          </summary>
          <div className="mt-4 space-y-4">
            {skillsGroups.map((group) => (
              <PixelCard key={group.title} className="p-4 sm:p-5">
                <h3 className="font-pixel text-[10px] uppercase tracking-wide text-[var(--pixel-accent)]">
                  {group.title}
                </h3>
                <ul className="post-tag-list mt-3">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="post-tag-chip">{item}</span>
                    </li>
                  ))}
                </ul>
              </PixelCard>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
