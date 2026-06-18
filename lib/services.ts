import { Truck, MapPin, Globe2, Home, FileCheck, type LucideIcon } from "lucide-react";

// Hizmetlerin TEK kaynağı. Anasayfa kartları, liste ve detay sayfaları buradan beslenir.
// `key` → messages "services.<key>" (başlık/özet) ve "serviceDetail.<key>" (detay).
export type Service = {
  slug: string;
  key: "lebanon" | "syria" | "middleeast" | "turkey" | "customs";
  Icon: LucideIcon;
};

export const services: Service[] = [
  { slug: "lubnan", key: "lebanon", Icon: Truck },
  { slug: "suriye", key: "syria", Icon: MapPin },
  { slug: "ortadogu", key: "middleeast", Icon: Globe2 },
  { slug: "turkiye", key: "turkey", Icon: Home },
  { slug: "gumrukleme", key: "customs", Icon: FileCheck },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceSlugs = services.map((s) => s.slug);
