import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { images } from "../lib/images";
import { posts } from "../lib/news";
import { team } from "../lib/team";
import tr from "../messages/tr.json";
import en from "../messages/en.json";
import ar from "../messages/ar.json";

const prisma = new PrismaClient();

// Üç dilli içerik kaynağı: site neyi gösteriyorsa (çeviri + görsel) DB'ye birebir yazar.
// Idempotent: tekrar çalıştırılabilir. Doğal anahtarı olmayan FAQ/Hero hariç hepsi upsert;
// FAQ/Hero kopya oluşmasın diye deleteMany → insert (yalnızca seed içeriği, kullanıcı verisi yok).
const M = { tr, en, ar } as Record<string, any>;
const langs = ["tr", "en", "ar"] as const;
// Bir seçiciyi üç dile uygular: loc(m => m.services.lebanon.title) → { tr, en, ar }
const loc = (pick: (m: any) => string) =>
  Object.fromEntries(langs.map((l) => [l, pick(M[l]) ?? pick(tr)])) as Record<string, string>;
const locList = (pick: (m: any) => string[]) =>
  Object.fromEntries(langs.map((l) => [l, (pick(M[l]) ?? pick(tr)).filter(Boolean)])) as Record<string, string[]>;

async function main() {
  // 1) Admin
  const email = process.env.SEED_ADMIN_EMAIL || "admin@akucarnakliyat.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "change-me-strong-password";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, name: "Admin", passwordHash, role: "ADMIN" },
  });
  console.log(`Admin hazır: ${email}`);

  // 2) Hizmetler (başlık/özet/intro/gövde/özellikler/görsel — 3 dil)
  const serviceDefs = [
    { slug: "lubnan", key: "lebanon", icon: "Truck", order: 1 },
    { slug: "suriye", key: "syria", icon: "MapPin", order: 2 },
    { slug: "ortadogu", key: "middleeast", icon: "Globe2", order: 3 },
    { slug: "turkiye", key: "turkey", icon: "Home", order: 4 },
    { slug: "gumrukleme", key: "customs", icon: "FileCheck", order: 5 },
  ];
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
  }
  console.log(`Hizmetler: ${serviceDefs.length}`);

  // 3) İstatistik sayaçları
  const stats = [
    { key: "years", value: 40, suffix: "+", order: 1 },
    { key: "routes", value: 12, suffix: "", order: 2 },
    { key: "deliveries", value: 25000, suffix: "+", order: 3 },
    { key: "fleet", value: 60, suffix: "+", order: 4 },
  ];
  for (const st of stats) {
    const label = loc((m) => m.stats[st.key]);
    await prisma.stat.upsert({
      where: { key: st.key },
      update: { value: st.value, suffix: st.suffix, order: st.order, label },
      create: { ...st, label },
    });
  }
  console.log(`İstatistikler: ${stats.length}`);

  // 4) Haberler (3 dil + kapak görseli + tarih)
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const data = {
      status: "PUBLISHED" as const,
      coverImage: images.news[p.slug] ?? "",
      publishedAt: new Date(p.date),
      title: loc((m) => m.news.posts[p.slug].title),
      excerpt: loc((m) => m.news.posts[p.slug].excerpt),
      body: loc((m) => m.news.posts[p.slug].body),
    };
    await prisma.newsPost.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  }
  console.log(`Haberler: ${posts.length}`);

  // 5) Ekip (isim sabit; ünvan 3 dil) — deterministik id ile upsert
  for (let i = 0; i < team.length; i++) {
    const t = team[i];
    const data = { name: t.name, role: loc((m) => m.team.roles[t.roleKey]), photoUrl: "", order: i + 1, visible: true };
    await prisma.teamMember.upsert({ where: { id: t.id }, update: data, create: { id: t.id, ...data } });
  }
  console.log(`Ekip: ${team.length}`);

  // 6) Filo (tip adı 3 dil + görsel) — slug benzersiz
  const fleetSlugs = ["tir", "frigo", "lowbed", "konteyner", "tenteli", "parsiyel"];
  for (let i = 0; i < fleetSlugs.length; i++) {
    const slug = fleetSlugs[i];
    const data = { name: loc((m) => m.fleet.types[slug]), coverImage: images.fleet[slug] ?? "", order: i + 1, visible: true };
    await prisma.fleetItem.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
  console.log(`Filo: ${fleetSlugs.length}`);

  // 7) SSS (doğal anahtar yok → temizle + yeniden yaz)
  const faqItems = (tr.faq.items as { q: string; a: string }[]);
  await prisma.faq.deleteMany({});
  for (let i = 0; i < faqItems.length; i++) {
    await prisma.faq.create({
      data: {
        order: i + 1,
        visible: true,
        question: loc((m) => m.faq.items[i].q),
        answer: loc((m) => m.faq.items[i].a),
      },
    });
  }
  console.log(`SSS: ${faqItems.length}`);

  // 8) Hero (doğal anahtar yok → temizle + tek slayt)
  await prisma.heroSlide.deleteMany({});
  await prisma.heroSlide.create({
    data: {
      order: 1,
      visible: true,
      image: images.hero,
      ctaHref: "/teklif",
      title: loc((m) => m.hero.title),
      subtitle: loc((m) => m.hero.subtitle),
    },
  });
  console.log("Hero: 1 slayt");

  // 9) Site ayarları (iletişim + sosyal)
  await prisma.siteSetting.upsert({
    where: { key: "contact" },
    update: {
      value: {
        address: tr.contact.info.address,
        phone: tr.contact.info.phone,
        email: tr.contact.info.email,
        whatsapp: "905000000000",
        hours: tr.contact.info.hours,
      },
    },
    create: {
      key: "contact",
      value: {
        address: tr.contact.info.address,
        phone: tr.contact.info.phone,
        email: tr.contact.info.email,
        whatsapp: "905000000000",
        hours: tr.contact.info.hours,
      },
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "social" },
    update: {},
    create: { key: "social", value: {} },
  });
  console.log("Ayarlar: contact + social");

  console.log("Seed tamamlandı — site içeriği DB'ye aktarıldı.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
