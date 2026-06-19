# Akuçar Nakliyat — Yol Haritası (ROADMAP)

Bu döküman projenin fazlara bölünmüş geliştirme planını içerir. Strateji:
**önce site (v1) → sonra panel (v2) → sonra iyileştirme (v3).**

Her faz tamamlandığında işaretlenir. Tahmini süreler tek geliştirici varsayımıyla yaklaşıktır.

---

## 📍 Şu an üzerinde çalışılan

**Faz 2.5 — Site–Panel Entegrasyonu** ⬜ (deploy planı konuşulacak)

- 2.1 backend (Prisma + auth + Service CRUD + intake) ve 2.2 güvenlik hazır.
- ✅ Faz 2.3 tamam: tüm panel modülleri gerçek CRUD (Hizmetler, Filo, Haberler, Hero, İstatistik, Referanslar, Ekip, SSS, Dinamik Sayfalar, Teklifler, Mesajlar, Aboneler, Ayarlar) + medya yükleme.
- Karar: **Neon/Supabase + Vercel**, kademeli. Güvenli fallback (`lib/content.ts`): DATABASE_URL yoksa/DB hatasında statik → canlı v1 bozulmaz.
- [x] **Site Ayarları → site**: İletişim sayfası bilgileri, WhatsApp telefonu, footer iletişim+sosyal medya artık panelden (revalidateTag ile anlık tazeleme).
- [x] **Hizmetler → site**: anasayfa gridi + `/hizmetler` + detay artık DB'den (`getServices`/`getServiceBySlug`, fallback `lib/services`+çeviri, `revalidateTag("services")`).
- [x] **Haberler → site**: `/haberler` liste + detay DB'den (`getNews`/`getNewsBySlug`, `revalidateTag("news")`).
- [x] **İstatistikler → site**: anasayfa sayaçları DB'den (`getStats`, `revalidateTag("stats")`).
- [x] **Ekip → site**: `/ekip` DB'den (`getTeam`, foto varsa next/image, yoksa baş harf; `revalidateTag("team")`).
- [x] **SSS → site**: İletişim sayfası akordeonu DB'den (`getFaq`, `revalidateTag("faq")`).
- [x] **Referanslar → site**: `/referanslar` DB'den (`getReferences`; boşsa placeholder logo; `revalidateTag("references")`).
- [x] **Filo → site**: `/filo` galeri DB'den (`getFleet`, `revalidateTag("fleet")`).
- [x] **Hero → site**: anasayfa hero ilk görünür slaytı DB'den (`getHero`, `revalidateTag("hero")`); çok-slaytlı carousel v3 cilasına bırakıldı.
- [x] **Dinamik sayfalar → site**: `app/[locale]/[slug]` panelden oluşturulan yayınlanmış sayfaları render eder (`getPageBySlug`, `revalidateTag("pages")`); statik route'lar öncelikli.
- [x] **Neon bağlandı (lokal)**: `DATABASE_URL` → Neon Postgres (`akucarnakliyat` şeması), `migrate deploy` + kapsamlı `seed` ile tüm site içeriği 3 dilde DB'de. Panel↔site canlı doğrulandı.
- Sonraki: **Vercel'e `DATABASE_URL` + `JWT_SECRET` + Cloudinary** ekle → redeploy → prod'da panel→canlı yansıma testi. (Güvenlik: Neon parolasını reset et.)
- Açık not: DB migrate/seed kullanıcı DB'sinde, onayla. Backend testi için `docs/backend-kurulum.md`.

> Kural: Bu bölümdeki modül dışındaki dosyalara dokunulmaz. Panel/DB (Faz 2) bu fazda yok.

### Tamamlanan Modüller

- ✅ **Faz 0 — Tasarım Sistemi** → `docs/design-system.md`. Scope: `docs/scope/tasarim-sistemi.md`.
- ✅ **Faz 1.1 — Altyapı + 1.2 Çok dil/RTL** → Next.js 14 App Router, next-intl `[locale]`,
  Tailwind token'ları, Navbar/Footer/dil değiştirici. Scope: `docs/scope/altyapi-kurulumu.md`.
- ✅ **Faz 1.3 — Sayfalar** → 11 route (anasayfa, kurumsal+belgeler, hizmetler liste+detay, filo+lightbox,
  referanslar, ekip, haberler liste+detay, iletişim+harita, teklif). Scope: `docs/scope/sayfalar.md`.
- ✅ **Faz 1.4 — Animasyon** → Reveal, Counter, RouteMap, hover, PageTransition.
- ✅ **Faz 1.5 (kısmi)** → telifsiz placeholder görseller (`lib/images.ts`).
- ✅ **Faz 1.6 — Teknik Kalite** → SEO (metadata/OG/sitemap/robots/hreflang, `lib/seo.ts`), a11y, responsive. Scope: `docs/scope/teknik-kalite.md`.
- ✅ **Faz 1.7 — Yayın** → `DEPLOY.md`; Vercel deploy yapıldı, v1 müşteride. (Alan adı + onay turu açık.)

---

## 🧭 Genel Strateji

1. **v1** — Statik, çok dilli, sinematik kurumsal site yayında. İçerik koda/veriye gömülü, AI placeholder görseller.
2. **v2** — v1'in içerik yapısına göre tasarlanmış özel admin paneli + veritabanı.
3. **v3** — Gerçek görseller, SEO/performans ince ayarı, ek özellikler.

> Panelin **v1 sonrası** gelmesinin nedeni: gerçek sayfa yapısı netleşmeden panel tasarlamak israftır. Önce siteyi görürüz, sonra "neyin yönetilebilir olması gerektiğini" kesinleştirip paneli ona göre kurarız.

---

## 📐 FAZ 0 — Keşif & Tasarım Sistemi (1. Hafta)

**Amaç:** Kod yazmadan önce görsel dili ve içerik mimarisini kesinleştirmek.

- [x] Rakip analizi (Kayra, Assan, Gökbora, Şah, Pancar) — README §1'de konumlandırma kararına bağlandı
- [x] Konumlandırma kararı: "Ortadoğu sınır-ötesi uzmanı" hikayesi netleşti (README §1)
- [x] **Tasarım sistemi dökümanı** hazırlandı → `docs/design-system.md`:
  - [x] Renk paleti (zemin, amber tonları, metin, durum renkleri)
  - [x] Tipografi skalası (başlık/gövde fontları, boyut ölçeği)
  - [x] Boşluk (spacing) ve grid sistemi
  - [x] Komponent kütüphanesi taslağı (buton, kart, navbar, footer)
- [x] Sitemap (README §5) · [ ] wireframe (anasayfa + 1 hizmet + iletişim — gerekirse ayrıca)
- [x] **AI görsel prompt listesi** hazır (README §7.1)

---

## 🎨 FAZ 1 — v1: Statik Site (2.–5. Hafta)

**Amaç:** Tam fonksiyonel, çok dilli, sinematik kurumsal site — panel olmadan.

### 1.1 Altyapı Kurulumu
- [x] Next.js 14 + TypeScript + Tailwind projesi başlat
- [x] Framer Motion, next-intl kurulumu (package.json)
- [x] Font yükleme (display + sans + Arabic) — display için Clash Display gelene kadar Space Grotesk stand-in
- [x] Tema değişkenleri (renkler, spacing) Tailwind config'e işle
- [x] Temel layout: Navbar, Footer, dil değiştirici

### 1.2 Çok Dil & RTL
- [x] TR / EN / AR çeviri dosyaları yapısı (44 anahtar, tam parite)
- [x] Arapça için RTL (sağdan sola) layout desteği
- [x] Dil bazlı URL yapısı (`/tr`, `/en`, `/ar`)

### 1.3 Sayfalar
- [x] **Anasayfa** — sinematik hero, hizmet kartları, istatistik sayaçları, animasyonlu harita rotaları (Hatay→Beyrut→Şam), referans şeridi
- [x] **Kurumsal** — Biz Kimiz, Vizyon & Misyon, Kalite, İK, Belgelerimiz (tek sayfa bölümleri)
- [x] **Hizmetler** — liste + 5 detay sayfası (Lübnan, Suriye, Ortadoğu, Türkiye, Gümrükleme), `[slug]` route
- [x] **Filo & Galeri** — araç kartları + tam ekran lightbox galeri (prev/next, klavye, RTL)
- [x] **Referanslar** — müşteri logo gridi (placeholder)
- [x] **SSS** — accordion (İletişim sayfasında)
- [x] **Ekip / Kadro** — kadro tanıtım kartları (`/ekip`)
- [x] **Haberler / Blog** — liste + detay sayfası (`/haberler`, `[slug]`)
- [x] **İletişim** — form + iletişim bilgileri + OpenStreetMap harita gömme
- [x] **Teklif / Fiyat Talep Formu** — çok adımlı akıllı form (`/teklif`): güzergâh → yük tipi/ağırlık/tarih → iletişim, stepper
- [x] **WhatsApp hızlı iletişim butonu** — sabit, tüm sayfalarda
- [x] **E-posta bülteni kayıt formu** — footer'da

### 1.4 Animasyon & Mikro-etkileşim
- [x] Scroll-reveal animasyonları (`Reveal`)
- [x] Animasyonlu istatistik sayaçları (`Counter`)
- [x] Hover derinlik efektleri (hizmet/filo/haber kartları)
- [x] Animasyonlu harita rotaları (`RouteMap`, Hatay → Beyrut → Şam)
- [x] Sayfa geçiş animasyonları (`PageTransition`)

### 1.5 Görsel İş Akışı (AI Placeholder)
> **Önemli:** Görseller harici AI aracında (Midjourney / Flux / Google Imagen vb.) proje sahibi tarafından üretilir. Claude yalnızca hazır promptlar ve stok görsel araştırması sağlar.

- [ ] Hero görselleri için AI promptları yaz (gece yolu, amber gün batımı, tır konvoyu)
- [ ] Hizmet kartı görselleri için promptlar (her hizmete uygun atmosfer)
- [ ] Arka plan/doku görselleri
- [x] Placeholder görseller eklendi (telifsiz Pexels, `next/image` ile WebP/AVIF optimizasyon, merkezi `lib/images.ts`). AI/gerçek görsellerle v3'te değiştirilebilir.
- [ ] **Final için not:** Gerçek filo fotoğrafları müşteriden istenecek (v3'te değiştirilecek)

### 1.6 Teknik Kalite
- [x] Responsive statik denetim (Tailwind breakpoint'leri, clamp hero, sabit-px/taşma yok)
- [x] Temel SEO: per-sayfa `generateMetadata` (başlık/description), OpenGraph/Twitter, metadataBase, başlık şablonu, hreflang alternates, `sitemap.ts`, `robots.ts` (`lib/seo.ts` tek kaynak)
- [ ] Lighthouse performans kontrolü (hedef 90+) — makinede `npm run build && npx lighthouse` ile çalıştırılacak (sandbox'ta npm yok)
- [x] Erişilebilirlik temel: skip-to-content linki, görünür focus, `lang`/`dir`, nav `aria-current`, ikon-buton `aria-label`

### 1.7 Yayın
- [x] Deploy rehberi hazır → `DEPLOY.md` (Vercel; ücretsiz `*.vercel.app` önizleme linki). `NEXT_PUBLIC_SITE_URL` esnek.
- [ ] Vercel'e deploy (kullanıcı tarafından: GitHub import veya `vercel --prod`)
- [ ] Alan adı bağlama (akucarnakliyat.com)
- [ ] Müşteri onay turu & revizyonlar

---

## 🛠️ FAZ 2 — v2: Admin Paneli (6.–9. Hafta)

**Amaç:** v1'in içerik yapısına göre, müşterinin kod bilmeden her şeyi yönetebileceği özel panel.

### 2.1 Backend Altyapısı
- [x] PostgreSQL (mevcut DB, şema `akucarnakliyat`) — kurulum `docs/backend-kurulum.md`
- [x] Prisma şema tasarımı (16 model, JSON i18n) → `prisma/schema.prisma`
- [~] API Routes — `lib/prisma.ts`, auth (JWT Bearer + bcrypt), Service CRUD + intake (quote/contact/newsletter); kalan içerik tipleri 2.3 deseniyle
- [x] Medya yükleme — `/api/admin/upload` + `ImageUpload` bileşeni (Cloudinary varsa oraya, yoksa `public/uploads`); tüm form görsel alanlarına entegre
- [x] seed (`prisma/seed.ts`, idempotent: admin + v1 içerik) — kullanıcı DB'sinde çalıştırılır

### 2.2 Kimlik Doğrulama & Güvenlik
- [x] JWT (Bearer) ile admin girişi (`/api/auth/login`, bcrypt, premium login ekranı)
- [ ] Yetkilendirme (admin rolleri)
- [x] `/admin` korunması (client guard + her korumalı API'de `requireAdmin`); middleware'den `/admin` hariç
- [x] Form doğrulama (zod) & rate limit (login + intake)

### 2.3 Panel Modülleri
- [ ] **Dinamik Menü Yönetimi** — menü öğesi ekle/sil/düzenle, sürükle-bırak sıralama, tek seviye alt menü, 3 dilde başlık (TR/EN/AR), görünürlük aç/kapa
- [x] **Dinamik Sayfa Oluşturma** — `/admin/pages`: 3 dilli başlık/içerik + SEO + durum (public render & menü bağlama 2.5'te)
- [x] **Hizmetler** — panel CRUD (liste/tablo, 3 dilli modal form, durum/sıra, sil) `/admin/services`
- [x] **Teklif Talepleri** — `/admin/quotes`: tablo + detay modal + durum (Yeni/İncelemede/Kapandı) + sil
- [x] **Mesajlar** — `/admin/messages`: liste + okuma modal + okundu işaretle + sil
- [x] **Genel Bakış (Dashboard)** — özet kartları + son talep/mesajlar (`/admin`)
- [x] **Haberler / Blog** — `/admin/news`: 3 dilli CRUD (başlık/özet/içerik), slug/kategori/tarih/durum/kapak
- [x] **Referanslar / logolar** — `/admin/references`: 3 dilli ad, logo/web, sıra, görünür
- [x] **Filo / araç parkı** — `/admin/fleet`: 3 dilli CRUD (galeri görselleri Cloudinary'den sonra)
- [ ] **İletişim bilgileri** — adres, telefon, e-posta, harita
- [x] **Hero slaytları** — `/admin/hero`: görsel + 3 dilli başlık/slogan, sıra
- [x] **İstatistik sayaçları** — `/admin/stats`: değer/sonek/etiket
- [x] **SSS** — `/admin/faq`: soru/cevap 3 dil, sıra, görünür
- [x] **Ekip / Kadro** — `/admin/team`: isim, ünvan 3 dil, foto, sıra, görünür
- [x] **E-posta bülteni** — `/admin/subscribers`: liste + CSV dışa aktarma
- [x] **Site ayarları** — `/admin/settings`: iletişim/sosyal/SEO (canlı siteye bağlama 2.5'te)

> **Dinamik menü + sayfa kuralları (tasarımı korumak için):**
> - Üst menüde önerilen maksimum öğe sayısı (örn. 6); aşıldığında panel nazik uyarı verir veya fazlası "Daha Fazla" altına toplanır.
> - Yeni menü öğesi ya var olan bir sayfaya ya da panelden oluşturulan dinamik bir sayfaya bağlanır (boş/404 link engellenir).
> - Her menü öğesi ve sayfa 3 dilde içerik ister; eksik dil için fallback davranışı tanımlanır.
> - Dinamik sayfalar Next.js'de tek bir `[slug]` route üzerinden render edilir; içerik veritabanından beslenir (ISR ile anlık güncelleme).

### 2.4 Panel UX
- [x] Premium panel kabuğu (sidebar+topbar, dashboard), sinematik login; diğer modüller `Yakında` placeholder
- [ ] Görsel önizleme (kaydetmeden önce nasıl görüneceği)
- [x] Çok dilli içerik girişi (TR/EN/AR sekmeli `LocalizedInput`)
- [ ] Otomatik kaydetme / taslak özelliği (opsiyonel)

### 2.5 Site–Panel Entegrasyonu
- [x] Sayfaları veritabanından besle (ISR / `revalidateTag`) — Ayarlar, Hizmetler, Haberler, İstatistik, Ekip, SSS, Referanslar, Filo, Hero, dinamik `[slug]`
- [ ] Neon/Supabase'e geçiş + Vercel `DATABASE_URL` + panel→canlı yansıma testi

---

## 🚀 FAZ 3 — İyileştirme & Final (10. Hafta+)

**Amaç:** Cilalama, gerçek içerik, optimizasyon.

- [ ] **Gerçek görseller** — müşterinin filo/proje fotoğraflarını entegre et
- [ ] Detaylı SEO (anahtar kelime, yapısal veri / schema.org)
- [ ] Performans ince ayarı (görsel lazy-load, kod bölme)
- [ ] Analitik kurulumu (Go