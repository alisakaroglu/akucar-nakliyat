// Yeni SEO ülke hizmetlerini (Dubai, Katar, Kuveyt, Suudi Arabistan, Ürdün) ve
// mevcutları Neon'daki Service tablosuna yazar. SADECE Service tablosuna dokunur;
// SSS, Hero ve diğer içerikleri ASLA sıfırlamaz (tam seed'in aksine — güvenli).
// Çalıştırma:  npx tsx scripts/upsert-seo-services.ts
import { PrismaClient } from "@prisma/client";
import { images } from "../lib/images";
import tr from "../messages/tr.json";
import en from "../messages/en.json";
import ar from "../messages/ar.json";

const prisma = new PrismaClient();
const M = { tr, en, ar } as Record<string, any>;
const langs = ["tr", "en", "ar"] as const;
const loc = (pick: (m: any) => string) =>
  Object.fromEntries(langs.map((l) => [l, pick(M[l]) ?? pick(tr)])) as Record<string, string>;
const locList = (pick: (m: any) => string[]) =>
  Object.fromEntries(langs.map((l) => [l, (pick(M[l]) ?? pick(tr)).filter(Boolean)])) as Record<string, string[]>;

// seed.ts ile aynı sıralama/anahtar seti.
const serviceDefs = [
  { slug: "lubnan", key: "lebanon", icon: "Truck", order: 1 },
  { slug: "suriye", key: "syria", icon: "MapPin", order: 2 },
  { slug: "urdun", key: "jordan", icon: "MapPin", order: 3 },
  { slug: "suudi-arabistan", key: "saudi", icon: "Landmark", order: 4 },
  { slug: "dubai", key: "dubai", icon: "Building2", order: 5 },
  { slug: "katar", key: "qatar", icon: "Landmark", order: 6 },
  { slug: "kuveyt", key: "kuwait", icon: "Navigation", order: 7 },
  { slug: "ortadogu", key: "middleeast", icon: "Globe2", order: 8 },
  { slug: "turkiye", key: "turkey", icon: "Home", order: 9 },
  { slug: "gumrukleme", key: "customs", icon: "FileCheck", order: 10 },
];

async function main() {
  for (const s of serviceDefs) {
    const data = {
      icon: s.icon,
      order: s.order,
      status: "PUBLISHED" as const,
      image: images.services[s.key],
      title: loc((m) => m.services[s.key].title),
      desc: loc((m) => m.services[s.key].desc),
      intro: loc((m) => m.serviceDetail[s.key].intro),
      body: loc((m) => m.serviceDetail[s.key].body),
      features: locList((m) => [
        m.serviceDetail[s.key].f1,
        m.serviceDetail[s.key].f2,
        m.serviceDetail[s.key].f3,
        m.serviceDetail[s.key].f4,
      ]),
    };
    await prisma.service.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
    console.log("✓ upsert:", s.slug);
  }
  console.log(`\nToplam ${serviceDefs.length} hizmet güncellendi/eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
