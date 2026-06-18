# Akuçar Nakliyat — Yol Haritası (ROADMAP)

Bu döküman projenin fazlara bölünmüş geliştirme planını içerir. Strateji:
**önce site (v1) → sonra panel (v2) → sonra iyileştirme (v3).**

Her faz tamamlandığında işaretlenir. Tahmini süreler tek geliştirici varsayımıyla yaklaşıktır.

---

## 📍 Şu an üzerinde çalışılan

**Faz 1.7 — Yayın** ⬜ (başlanacak)

- Sıradaki: Vercel deploy, alan adı bağlama, müşteri onay turu.
- Açık not: Lighthouse ölçümü makinede yapılacak (sandbox'ta npm yok).

> Kural: Bu bölümdeki modül dışındaki dosyalara dokunulmaz. Panel/DB (Faz 2) bu fazda yok.

### Tamamlanan Modüller

- ✅ **Faz 0 — Tasarım Sistemi** → `docs/design-system.md`. Scope: `docs/scope/tasarim-sistemi.md`.
- ✅ **Faz 1.1 — Altyapı + 1.2 Çok dil/RTL** → Next.js 14 App Router, next-intl `[locale]`,
  Tailwind token'ları, Navbar/Footer/dil değiştirici. Scope: `docs/scope/altyapi-kurulumu.md`.
- ✅ **Faz 1.3 — Sayfalar** → 11 route (anasayfa, kurumsal+belgeler, hizmetler liste+detay, filo+lightbox,
  referanslar, ekip, haberler liste+detay, iletişim+harita, teklif). Scope: `docs/scope/sayfalar.md`.
- ✅ **Faz 1.4 — Animasyon** → Reveal, Counter, RouteMap, hover, PageTransition.
- ✅ **Faz 1.5 (kısmi)** → telifsiz placeholder görseller (`lib/images.ts`).
- ✅ **Faz 1.6 — Teknik Kalite** → SEO (metadata/OG/sitemap/robots/hreflang, `lib/seo.ts`), a11y (skip-link/aria-current), responsive denetim. Scope: `docs/scope/teknik-kalite.md`.

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
- [ ] PostgreSQL veritabanı kurulumu (Neon / Supabase)
- [ ] Prisma şema tasarımı (sayfalar, hizmetler, haberler, referanslar, filo, ayarlar)
- [ ] API Routes (CRUD endpoint'leri)
- [ ] Cloudinary / UploadThing entegrasyonu (görsel yükleme)

### 2.2 Kimlik Doğrulama & Güvenlik
- [ ] NextAuth / JWT ile admin girişi
- [ ] Yetkilendirme (admin rolleri)
- [ ] `/admin` alanının korunması
- [ ] Form doğrulama & güvenlik (rate limit, sanitizasyon)

### 2.3 Panel Modülleri
- [ ] **Dinamik Menü Yönetimi** — menü öğesi ekle/sil/düzenle, sürükle-bırak sıralama, tek seviye alt menü, 3 dilde başlık (TR/EN/AR), görünürlük aç/kapa
- [ ] **Dinamik Sayfa Oluşturma** — panelden yeni sayfa oluştur (başlık, slug, içerik bloğu, görsel, SEO meta), oluşturulan sayfayı menüye bağlama
- [ ] **Hizmetler & içerik sayfaları** — düzenle, görsel, sıralama
- [ ] **Haberler / Blog** — oluştur/düzenle/sil, kategori, görsel, tarih
- [ ] **Referanslar / logolar** — sürükle-bırak sıralama
- [ ] **Filo / araç parkı + galeri** — görsel yükle/düzenle
- [ ] **İletişim bilgileri** — adres, telefon, e-posta, harita
- [ ] **Hero slaytları** — görsel + slogan yönetimi
- [ ] **İstatistik sayaçları** — sayı güncelleme
- [ ] **SSS (Sıkça Sorulan Sorular)** — soru/cevap ekle/sil/sırala, 3 dil (gümrük süreleri, evrak, sigorta vb.)
- [ ] **Ekip / Kadro** — kişi ekle/düzenle (foto, isim, ünvan, kısa açıklama), sıralama
- [ ] **E-posta bülteni** — abone listesi yönetimi, abone dışa aktarma (CSV), kayıt formu içeriği
- [ ] **Site ayarları** — logo, sosyal medya, SEO meta

> **Dinamik menü + sayfa kuralları (tasarımı korumak için):**
> - Üst menüde önerilen maksimum öğe sayısı (örn. 6); aşıldığında panel nazik uyarı verir veya fazlası "Daha Fazla" altına toplanır.
> - Yeni menü öğesi ya var olan bir sayfaya ya da panelden oluşturulan dinamik bir sayfaya bağlanır (boş/404 link engellenir).
> - Her menü öğesi ve sayfa 3 dilde içerik ister; eksik dil için fallback davranışı tanımlanır.
> - Dinamik sayfalar Next.js'de tek bir `[slug]` route üzerinden render edilir; içerik veritabanından beslenir (ISR ile anlık güncelleme).

### 2.4 Panel UX
- [ ] Temiz, sezgisel panel arayüzü (müşteri dostu)
- [ ] Görsel önizleme (kaydetmeden önce nasıl görüneceği)
- [ ] Çok dilli içerik girişi (TR/EN/AR aynı panelde)
- [ ] Otomatik kaydetme / taslak özelliği (opsiyonel)

### 2.5 Site–Panel Entegrasyonu
- [ ] Statik içeriği veritabanına taşı
- [ ] Sayfaları veritabanından besle (ISR / revalidate)
- [ ] Panel değişikliklerinin canlıya yansıması test

---

## 🚀 FAZ 3 — İyileştirme & Final (10. Hafta+)

**Amaç:** Cilalama, gerçek içerik, optimizasyon.

- [ ] **Gerçek görseller** — müşterinin filo/proje fotoğraflarını entegre et
- [ ] Detaylı SEO (anahtar kelime, yapısal veri / schema.org)
- [ ] Performans ince ayarı (görsel lazy-load, kod bölme)
- [ ] Analitik kurulumu (Google Analytics / Plausible)
- [ ] İletişim formu → e-posta entegrasyonu (Resend / SMTP)
- [ ] WhatsApp / hızlı iletişim butonu
- [ ] Çok dilli SEO kontrolü (hreflang)
- [ ] Son güvenlik & yedekleme stratejisi
- [ ] Müşteriye panel kullanım eğitimi / kısa kılavuz

---

