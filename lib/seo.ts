import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Tek kaynak SEO yardımcıları (DRY).
// Site URL: production'da NEXT_PUBLIC_SITE_URL, Vercel önizlemede VERCEL_URL,
// yoksa varsayılan canlı alan adı. (Canonical/OG/sitemap tek kaynağı.)
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "") ||
  "https://www.akucarnakliyat.com"
).replace(/\/$/, "");
export const SITE_NAME = "Akuçar Nakliyat";

// Bir yol için hreflang alternates üretir (path locale öneki içermez, örn. "/kurumsal").
export function languagesFor(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  const langs: Record<string, string> = {};
  for (const loc of routing.locales) langs[loc] = `${SITE_URL}/${loc}${clean}`;
  langs["x-default"] = `${SITE_URL}/${routing.defaultLocale}${clean}`;
  return langs;
}

// Sayfa metadata'sı kurar (başlık/description + canonical + hreflang + OpenGraph).
export function buildMetadata({
  locale,
  title,
  description,
  path = "/",
  keywords,
}: {
  locale: string;
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: { canonical: url, languages: languagesFor(path) },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
  };
}
