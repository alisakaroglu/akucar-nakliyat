import { SITE_URL, SITE_NAME } from "./seo";

// schema.org yapısal veri (JSON-LD) üreticileri.
// Google'ın firmayı, hizmetleri ve hizmet verilen ülkeleri anlamasını kolaylaştırır.

// Hizmet verilen ülkeler (ISO 3166-1 alpha-2) — SEO hedef pazarları.
const AREA_SERVED = ["TR", "LB", "SY", "JO", "SA", "AE", "QA", "KW"];

export function organizationJsonLd(
  locale: string,
  contact?: { phone?: string; email?: string; address?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "Ak Uçar Uluslararası Taşımacılık Ticaret Ltd. Şti.",
    url: `${SITE_URL}/${locale}`,
    ...(contact?.phone ? { telephone: contact.phone } : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Antakya",
      addressRegion: "Hatay",
      addressCountry: "TR",
      ...(contact?.address ? { streetAddress: contact.address } : {}),
    },
    areaServed: AREA_SERVED.map((c) => ({ "@type": "Country", identifier: c })),
    foundingDate: "1985",
    slogan: "Ortadoğu sınır-ötesi taşımacılık uzmanı",
  };
}

export function serviceJsonLd({
  locale,
  title,
  description,
  slug,
}: {
  locale: string;
  title: string;
  description?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: title,
    ...(description ? { description } : {}),
    provider: {
      "@type": "MovingCompany",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    areaServed: AREA_SERVED.map((c) => ({ "@type": "Country", identifier: c })),
    url: `${SITE_URL}/${locale}/hizmetler/${slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
