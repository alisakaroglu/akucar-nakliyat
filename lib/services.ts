import { Truck, MapPin, Globe2, Home, FileCheck, Building2, Landmark, Navigation, type LucideIcon } from "lucide-react";

// Hizmetlerin TEK kaynağı. Anasayfa kartları, liste ve detay sayfaları buradan beslenir.
// `key` → messages "services.<key>" (başlık/özet) ve "serviceDetail.<key>" (detay).
// `keywords` → SEO meta anahtar kelimeleri (ülke bazlı taşımacılık/nakliye sorguları).
export type Service = {
  slug: string;
  key:
    | "lebanon" | "syria" | "middleeast" | "turkey" | "customs"
    | "dubai" | "qatar" | "kuwait" | "saudi" | "jordan";
  Icon: LucideIcon;
  keywords?: string[];
};

export const services: Service[] = [
  { slug: "lubnan", key: "lebanon", Icon: Truck,
    keywords: ["Lübnan taşımacılık", "Lübnan nakliye", "Beyrut nakliye", "Türkiye Lübnan nakliye", "Lübnan kargo"] },
  { slug: "suriye", key: "syria", Icon: MapPin,
    keywords: ["Suriye taşımacılık", "Suriye nakliye", "Şam nakliye", "Türkiye Suriye nakliye", "sınır ötesi taşımacılık"] },
  { slug: "urdun", key: "jordan", Icon: MapPin,
    keywords: ["Ürdün taşımacılık", "Ürdün nakliye", "Amman taşımacılık", "Amman nakliye", "Türkiye Ürdün nakliye"] },
  { slug: "suudi-arabistan", key: "saudi", Icon: Landmark,
    keywords: ["Suudi Arabistan taşımacılık", "Suudi Arabistan nakliye", "Riyad nakliye", "Cidde nakliye", "Dammam nakliye", "Türkiye Suudi Arabistan nakliye"] },
  { slug: "dubai", key: "dubai", Icon: Building2,
    keywords: ["Dubai taşımacılık", "Dubai nakliye", "BAE taşımacılık", "BAE nakliye", "Birleşik Arap Emirlikleri nakliye", "Dubai kargo"] },
  { slug: "katar", key: "qatar", Icon: Landmark,
    keywords: ["Katar taşımacılık", "Katar nakliye", "Doha taşımacılık", "Doha nakliye", "Türkiye Katar nakliye"] },
  { slug: "kuveyt", key: "kuwait", Icon: Navigation,
    keywords: ["Kuveyt taşımacılık", "Kuveyt nakliye", "Türkiye Kuveyt nakliye", "Kuveyt kargo"] },
  { slug: "ortadogu", key: "middleeast", Icon: Globe2,
    keywords: ["Ortadoğu taşımacılık", "Ortadoğu nakliye", "Körfez taşımacılık", "uluslararası nakliye"] },
  { slug: "turkiye", key: "turkey", Icon: Home,
    keywords: ["Türkiye içi nakliye", "yurt içi taşımacılık", "parsiyel taşımacılık", "komple yük taşıma"] },
  { slug: "gumrukleme", key: "customs", Icon: FileCheck,
    keywords: ["gümrükleme", "gümrük müşavirliği", "aktarma hizmetleri", "ihracat ithalat evrak"] },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceSlugs = services.map((s) => s.slug);
