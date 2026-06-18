import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, languagesFor } from "@/lib/seo";
import { serviceSlugs } from "@/lib/services";
import { postSlugs } from "@/lib/news";

const staticPaths = [
  "/", "/kurumsal", "/hizmetler", "/filo", "/referanslar",
  "/ekip", "/haberler", "/iletisim", "/teklif",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...serviceSlugs.map((s) => `/hizmetler/${s}`),
    ...postSlugs.map((s) => `/haberler/${s}`),
  ];

  const now = new Date();
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: languagesFor(path) },
    }))
  );
}
