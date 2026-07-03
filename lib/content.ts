import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pickLocale, pickLocaleList, type LocalizedString, type LocalizedList } from "@/lib/i18n-content";
import { services as staticServices } from "@/lib/services";
import { images } from "@/lib/images";
import trMessages from "@/messages/tr.json";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

// Public site veri katmanı. DB varsa oradan, yoksa/hata olursa statik fallback.
// Böylece DATABASE_URL tanımlı olmayan (canlı v1) ortamda site eskisi gibi çalışır.

const MESSAGES: Record<string, typeof trMessages> = { tr: trMessages, en: enMessages, ar: arMessages };
const msgs = (locale: string) => MESSAGES[locale] ?? MESSAGES.tr;
const hasDb = () => !!process.env.DATABASE_URL;

// ---------- Ayarlar ----------
export type ContactSettings = { address?: string; phone?: string; email?: string; whatsapp?: string; hours?: string };
export type SocialSettings = { facebook?: string; instagram?: string; linkedin?: string; x?: string };
export type SiteSettings = { contact: ContactSettings; social: SocialSettings };

const SETTINGS_FALLBACK: SiteSettings = {
  contact: {
    address: "Antakya / Hatay, Türkiye",
    phone: "+90 (000) 000 00 00",
    email: "info@akucarnakliyat.com",
    whatsapp: "905000000000",
    hours: "Pazartesi – Cumartesi, 08:00 – 18:00",
  },
  social: {},
};

async function loadSettings(): Promise<SiteSettings> {
  if (!hasDb()) return SETTINGS_FALLBACK;
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: ["contact", "social"] } } });
    const map: Record<string, Record<string, string>> = {};
    for (const r of rows) map[r.key] = (r.value as Record<string, string>) ?? {};
    return {
      contact: { ...SETTINGS_FALLBACK.contact, ...(map.contact ?? {}) },
      social: { ...SETTINGS_FALLBACK.social, ...(map.social ?? {}) },
    };
  } catch {
    return SETTINGS_FALLBACK;
  }
}
export const getSettings = unstable_cache(loadSettings, ["site-settings"], { revalidate: 60, tags: ["settings"] });

// ---------- Hizmetler ----------
export type ServiceCard = {
  slug: string; icon: string | null; title: string; desc: string; image: string;
  intro?: string; body?: string; features?: string[];
};

const ICON_BY_SLUG: Record<string, string> = {
  lubnan: "Truck", suriye: "MapPin", ortadogu: "Globe2", turkiye: "Home", gumrukleme: "FileCheck",
};

function fallbackServices(locale: string): ServiceCard[] {
  const m = msgs(locale) as unknown as { services: Record<string, { title: string; desc: string }>; serviceDetail: Record<string, Record<string, string>> };
  return staticServices.map((s) => {
    const sd = m.serviceDetail?.[s.key] ?? {};
    return {
      slug: s.slug,
      icon: ICON_BY_SLUG[s.slug] ?? "Truck",
      title: m.services[s.key]?.title ?? s.slug,
      desc: m.services[s.key]?.desc ?? "",
      image: images.services[s.key],
      intro: sd.intro,
      body: sd.body,
      features: [sd.f1, sd.f2, sd.f3, sd.f4].filter(Boolean) as string[],
    };
  });
}

async function loadServices(locale: string): Promise<ServiceCard[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });
      if (rows.length) {
        return rows.map((r) => ({
          slug: r.slug,
          icon: r.icon,
          title: pickLocale(r.title as LocalizedString, locale),
          desc: pickLocale(r.desc as LocalizedString, locale),
          image: r.image || images.services[Object.keys(images.services)[0]],
          intro: pickLocale(r.intro as LocalizedString, locale),
          body: pickLocale(r.body as LocalizedString, locale),
          features: pickLocaleList(r.features as LocalizedList, locale),
        }));
      }
    } catch {
      // düş
    }
  }
  return fallbackServices(locale);
}

export async function getServices(locale: string): Promise<ServiceCard[]> {
  return unstable_cache(() => loadServices(locale), ["services", locale], { revalidate: 60, tags: ["services"] })();
}

export async function getServiceBySlug(slug: string, locale: string): Promise<ServiceCard | null> {
  const all = await getServices(locale);
  return all.find((s) => s.slug === slug) ?? null;
}

// ---------- Haberler ----------
import { posts as staticPosts } from "@/lib/news";
export type NewsCard = { slug: string; title: string; excerpt: string; body: string; coverImage: string; date: string };

function fallbackNews(locale: string): NewsCard[] {
  const m = msgs(locale) as unknown as { news: { posts: Record<string, { title: string; excerpt: string; body: string }> } };
  return staticPosts.map((p) => ({
    slug: p.slug,
    title: m.news.posts[p.slug]?.title ?? p.slug,
    excerpt: m.news.posts[p.slug]?.excerpt ?? "",
    body: m.news.posts[p.slug]?.body ?? "",
    coverImage: images.news[p.slug] ?? "",
    date: p.date,
  }));
}
async function loadNews(locale: string): Promise<NewsCard[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.newsPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
      if (rows.length) return rows.map((r) => ({
        slug: r.slug,
        title: pickLocale(r.title as LocalizedString, locale),
        excerpt: pickLocale(r.excerpt as LocalizedString, locale),
        body: pickLocale(r.body as LocalizedString, locale),
        coverImage: r.coverImage || "",
        date: (r.publishedAt ?? r.createdAt).toISOString(),
      }));
    } catch { /* düş */ }
  }
  return fallbackNews(locale);
}
export async function getNews(locale: string): Promise<NewsCard[]> {
  return unstable_cache(() => loadNews(locale), ["news", locale], { revalidate: 60, tags: ["news"] })();
}
export async function getNewsBySlug(slug: string, locale: string): Promise<NewsCard | null> {
  return (await getNews(locale)).find((p) => p.slug === slug) ?? null;
}

// ---------- İstatistikler ----------
export type StatItem = { key: string; label: string; value: number; suffix: string };
const STATS_FALLBACK_VALUES: Record<string, { value: number; suffix: string }> = {
  years: { value: 40, suffix: "+" }, routes: { value: 12, suffix: "" },
  deliveries: { value: 25000, suffix: "+" }, fleet: { value: 60, suffix: "+" },
};
function fallbackStats(locale: string): StatItem[] {
  const m = msgs(locale) as unknown as { stats: Record<string, string> };
  return ["years", "routes", "deliveries", "fleet"].map((k) => ({
    key: k, label: m.stats[k] ?? k, value: STATS_FALLBACK_VALUES[k].value, suffix: STATS_FALLBACK_VALUES[k].suffix,
  }));
}
async function loadStats(locale: string): Promise<StatItem[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.stat.findMany({ orderBy: { order: "asc" } });
      if (rows.length) return rows.map((r) => ({
        key: r.key, label: pickLocale(r.label as LocalizedString, locale), value: r.value, suffix: r.suffix ?? "",
      }));
    } catch { /* düş */ }
  }
  return fallbackStats(locale);
}
export async function getStats(locale: string): Promise<StatItem[]> {
  return unstable_cache(() => loadStats(locale), ["stats", locale], { revalidate: 60, tags: ["stats"] })();
}

// ---------- Ekip ----------
import { team as staticTeam } from "@/lib/team";
export type TeamCard = { id: string; name: string; role: string; photoUrl: string; initials: string };
function fallbackTeam(locale: string): TeamCard[] {
  const m = msgs(locale) as unknown as { team: { roles: Record<string, string> } };
  return staticTeam.map((t) => ({
    id: t.id, name: t.name, role: m.team.roles[t.roleKey] ?? "", photoUrl: "", initials: t.initials,
  }));
}
async function loadTeam(locale: string): Promise<TeamCard[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.teamMember.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      if (rows.length) return rows.map((r) => ({
        id: r.id, name: r.name, role: pickLocale(r.role as LocalizedString, locale),
        photoUrl: r.photoUrl ?? "", initials: r.name.charAt(0).toUpperCase(),
      }));
    } catch { /* düş */ }
  }
  return fallbackTeam(locale);
}
export async function getTeam(locale: string): Promise<TeamCard[]> {
  return unstable_cache(() => loadTeam(locale), ["team", locale], { revalidate: 60, tags: ["team"] })();
}

// ---------- SSS ----------
export type FaqItem = { q: string; a: string };
function fallbackFaq(locale: string): FaqItem[] {
  const m = msgs(locale) as unknown as { faq: { items: FaqItem[] } };
  return m.faq.items ?? [];
}
async function loadFaq(locale: string): Promise<FaqItem[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.faq.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      if (rows.length) return rows.map((r) => ({
        q: pickLocale(r.question as LocalizedString, locale), a: pickLocale(r.answer as LocalizedString, locale),
      }));
    } catch { /* düş */ }
  }
  return fallbackFaq(locale);
}
export async function getFaq(locale: string): Promise<FaqItem[]> {
  return unstable_cache(() => loadFaq(locale), ["faq", locale], { revalidate: 60, tags: ["faq"] })();
}

// ---------- Referanslar ----------
export type ReferenceItem = { id: string; name: string; logoUrl: string; website: string };
async function loadReferences(locale: string): Promise<ReferenceItem[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.reference.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      return rows.map((r) => ({
        id: r.id, name: pickLocale(r.name as LocalizedString, locale), logoUrl: r.logoUrl ?? "", website: r.website ?? "",
      }));
    } catch { /* düş */ }
  }
  return []; // statik fallback yok → sayfa placeholder gösterir
}
export async function getReferences(locale: string): Promise<ReferenceItem[]> {
  return unstable_cache(() => loadReferences(locale), ["references", locale], { revalidate: 60, tags: ["references"] })();
}

// ---------- Filo ----------
export type FleetCard = { slug: string; label: string; src: string };
const FLEET_FALLBACK_SLUGS = ["tir", "frigo", "lowbed", "konteyner", "tenteli", "parsiyel"];
function fallbackFleet(locale: string): FleetCard[] {
  const m = msgs(locale) as unknown as { fleet: { types: Record<string, string> } };
  return FLEET_FALLBACK_SLUGS.map((slug) => ({
    slug, label: m.fleet.types[slug] ?? slug, src: images.fleet[slug] ?? "",
  }));
}
async function loadFleet(locale: string): Promise<FleetCard[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.fleetItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      if (rows.length) return rows.map((r) => ({
        slug: r.slug, label: pickLocale(r.name as LocalizedString, locale),
        src: r.coverImage || images.fleet[FLEET_FALLBACK_SLUGS[0]],
      }));
    } catch { /* düş */ }
  }
  return fallbackFleet(locale);
}
export async function getFleet(locale: string): Promise<FleetCard[]> {
  return unstable_cache(() => loadFleet(locale), ["fleet", locale], { revalidate: 60, tags: ["fleet"] })();
}

// ---------- Hero ----------
export type HeroSlideContent = { title: string; subtitle: string; image: string; ctaHref: string };
function fallbackHero(locale: string): HeroSlideContent {
  const m = msgs(locale) as unknown as { hero: { title: string; subtitle: string } };
  return { title: m.hero.title, subtitle: m.hero.subtitle, image: images.hero, ctaHref: "/teklif" };
}
async function loadHero(locale: string): Promise<HeroSlideContent> {
  if (hasDb()) {
    try {
      const r = await prisma.heroSlide.findFirst({ where: { visible: true }, orderBy: { order: "asc" } });
      if (r) return {
        title: pickLocale(r.title as LocalizedString, locale),
        subtitle: pickLocale(r.subtitle as LocalizedString, locale) || fallbackHero(locale).subtitle,
        image: r.image || images.hero,
        ctaHref: r.ctaHref || "/teklif",
      };
    } catch { /* düş */ }
  }
  return fallbackHero(locale);
}
export async function getHero(locale: string): Promise<HeroSlideContent> {
  return unstable_cache(() => loadHero(locale), ["hero", locale], { revalidate: 60, tags: ["hero"] })();
}

// ---------- Dinamik Sayfalar ----------
export type DynamicPage = { slug: string; title: string; body: string; seoTitle?: string; seoDesc?: string };
export async function getPageBySlug(slug: string, locale: string): Promise<DynamicPage | null> {
  if (!hasDb()) return null;
  return unstable_cache(async () => {
    try {
      const r = await prisma.page.findFirst({ where: { slug, status: "PUBLISHED" } });
      if (!r) return null;
      return {
        slug: r.slug,
        title: pickLocale(r.title as LocalizedString, locale),
        body: pickLocale(r.body as LocalizedString, locale),
        seoTitle: pickLocale(r.seoTitle as LocalizedString, locale) || undefined,
        seoDesc: pickLocale(r.seoDesc as LocalizedString, locale) || undefined,
      };
    } catch { return null; }
  }, ["page", slug, locale], { revalidate: 60, tags: ["pages", `page:${slug}`] })();
}

// ---------- Güzergahlar (teklif formu) ----------
export type RouteOption = { id: string; from: string; to: string };
async function loadRoutes(locale: string): Promise<RouteOption[]> {
  if (hasDb()) {
    try {
      const rows = await prisma.route.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      return rows.map((r) => ({
        id: r.id,
        from: pickLocale(r.fromCity as LocalizedString, locale),
        to: pickLocale(r.toCity as LocalizedString, locale),
      }));
    } catch { /* düş */ }
  }
  return [];
}
export async function getRoutes(locale: string): Promise<RouteOption[]> {
  return unstable_cache(() => loadRoutes(locale), ["routes", locale], { revalidate: 60, tags: ["routes"] })();
}
