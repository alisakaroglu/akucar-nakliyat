import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import { SITE_URL, SITE_NAME, languagesFor } from "@/lib/seo";
import { fontSans, fontDisplay, fontArabic } from "../fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PageTransition } from "@/components/layout/PageTransition";
import "../globals.css";

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
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontArabic.variable}`}
    >
      <body className={isRtl(locale) ? "font-arabic" : "font-sans"}>
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="skip-link">{tc("skip")}</a>
          <Navbar />
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
