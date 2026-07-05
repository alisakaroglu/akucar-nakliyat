import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import { SITE_URL, SITE_NAME, languagesFor } from "@/lib/seo";
import "../fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getSettings } from "@/lib/content";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import "../globals.css";

// Ülke bazlı hedef anahtar kelimeler (site geneli meta).
const SITE_KEYWORDS = [
  "uluslararası nakliye", "Ortadoğu taşımacılık", "sınır ötesi taşımacılık",
  "Dubai taşımacılık", "Dubai nakliye", "BAE nakliye",
  "Katar taşımacılık", "Katar nakliye",
  "Kuveyt taşımacılık", "Kuveyt nakliye",
  "Suudi Arabistan taşımacılık", "Suudi Arabistan nakliye",
  "Ürdün taşımacılık", "Ürdün nakliye",
  "Lübnan taşımacılık", "Lübnan nakliye",
  "Suriye taşımacılık", "Suriye nakliye",
  "Akuçar Nakliyat", "Hatay nakliye",
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = `${SITE_URL}/${locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${SITE_NAME}` },
    description: t("description"),
    keywords: SITE_KEYWORDS,
    alternates: { canonical: url, languages: languagesFor("/") },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tc = await getTranslations("common");
  const settings = await getSettings();
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={isRtl(locale) ? "font-arabic" : "font-sans"}>
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={organizationJsonLd(locale, settings.contact)} />
          <a href="#main" className="skip-link">{tc("skip")}</a>
          <Navbar />
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer contact={settings.contact} social={settings.social} />
          <WhatsAppButton phone={settings.contact.whatsapp} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
