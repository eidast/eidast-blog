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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PixelCard className="p-6 sm:p-8">
        <h1 className="font-pixel text-xl text-[var(--pixel-fg)]">{t("title")}</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--pixel-fg-soft)]">
          {t("body")}
        </p>
      </PixelCard>
    </div>
  );
}
