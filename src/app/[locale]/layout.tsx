import type { Metadata } from "next";
import { IBM_Plex_Sans, Press_Start_2P } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";

import "../globals.css";

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "LocaleLayout" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("title"),
      template: "%s · eidast",
    },
    description: t("title"),
    alternates: {
      languages: {
        en: `${getSiteUrl()}/en`,
        es: `${getSiteUrl()}/es`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${body.variable} ${pixel.variable} h-full scroll-smooth antialiased`}
    >
      <body className="crt-overlay min-h-full font-sans text-[var(--pixel-fg)]">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-full flex-col">
            <SiteHeader locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
