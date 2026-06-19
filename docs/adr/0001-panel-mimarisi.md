# ADR 0001 — Admin Paneli Mimarisi (Faz 2)

**Durum:** Onaylandı — README planı (Next.js API Routes + Prisma + PostgreSQL). NestJS sapması değerlendirilip vazgeçildi.
**Tarih:** 2026-06-18
**Bağlam:** v1 statik site yayında. Müşterinin kod bilmeden tüm içeriği yönetebileceği panel kurulacak.
Tek uygulama + tek deploy (Vercel) tercih edildi; ayrı backend (NestJS) bu ölçekte overengineering bulundu.

---

## Kararlar (öneri)

### 1. Veritabanı: **Neon (PostgreSQL)** — önerilen
- Vercel ile sorunsuz, serverless, cömert ücretsiz katman, dallara göre branch DB.
- Alternatif: Supabase (ekstra auth/storage isteniyorsa). Öneri: Neon — yalnızca DB gerekiyor.

### 2. ORM: **Prisma**
- README stack ile uyumlu. `prisma migrate` ile sürümlenmiş şema.

### 3. Kimlik Doğrulama: **NextAuth (Credentials Provider)** — önerilen
- E-posta + parola ile tek admin. Parola `bcrypt` ile hash'li (`User.passwordHash`).
- Oturum: JWT strateji (DB'siz session, hızlı). Orta vadede `Role` enum ile genişletme.
- `/admin` ve yazma API'leri `auth()` kontrolünden geçer (middleware + route guard).

### 4. Çok dilli içerik: **JSON `{ tr, en, ar }` alanları** — önerilen
- Her çevrilebilir metin `Json` kolon (örn. `title Json`). Uygulamada `pickLocale(value, locale)`
  yardımcısıyla okunur; eksik dilde `tr → en → ar` fallback.
- Gerekçe: basit, az tablo, panelde tek formda 3 dil; site tarafında arama ihtiyacı düşük.
- Alternatif (reddedildi): satır-başına Translation tabloları — fazla JOIN, panel UX'i zorlaştırır.

### 5. Medya: **Cloudinary** (imzalı upload) — README ile uyumlu
- Yüklemeler API route üzerinden imzalanır; DB'de yalnızca `url` + `publicId` saklanır.

### 6. Veri çekme (panel istemci): **React Query** + mutation; doğrulama **zod**; **rate limit** yazma uçlarında.

---

## Şema Özeti (bkz. `prisma/schema.prisma` — DRAFT)

| Model | Amaç | Çevrilebilir alanlar (Json) |
|-------|------|------------------------------|
| `User` | Admin giriş | — |
| `MenuItem` | Dinamik üst menü (sıralama, parent, görünürlük) | `label` |
| `Page` | Dinamik sayfa (`[slug]`) + SEO | `title`, `body`, `seoTitle`, `seoDesc` |
| `Service` | Hizmet sayfaları | `title`, `desc`, `intro`, `body`, `features` |
| `NewsPost` | Haber/blog | `title`, `excerpt`, `body` |
| `Reference` | Müşteri logoları (sıra) | `name` |
| `FleetItem` | Filo/araç + galeri görselleri | `name`, `desc` |
| `GalleryImage` | Filo galeri görselleri (FleetItem'a opsiyonel bağlı) | `caption` |
| `HeroSlide` | Anasayfa hero slaytları | `title`, `subtitle` |
| `Stat` | İstatistik sayaçları | `label` |
| `Faq` | SSS (sıra) | `question`, `answer` |
| `TeamMember` | Ekip | `role` |
| `NewsletterSubscriber` | Bülten aboneleri (CSV dışa aktarma) | — |
| `QuoteRequest` | Teklif formu talepleri | — |
| `ContactMessage` | İletişim formu mesajları | — |
| `SiteSetting` | Tekil ayarlar (logo, sosyal, SEO, iletişim, harita) | `value` (Json) |

Ortak alanlar: `id (cuid)`, `createdAt`, `updatedAt`; sıralanabilirlerde `order Int`; yayın
durumları için `status` (DRAFT/PUBLISHED) ve `visible Boolean`.

---

## Güvenlik & Operasyon ilkeleri

- **Migration/seed/reset onaysız çalıştırılmaz.** İlk migration kullanıcının Neon DB'sinde,
  kullanıcı tarafından (veya açık onayla) yürütülür.
- v1 statik içeriği `seed.ts` ile DB'ye taşınır (yıkıcı değil, idempotent upsert).
- Site sayfaları DB'den ISR/`revalidate` ile beslenecek (2.5); v1 görünümü korunur.
- Menü kuralları: üst menü maks 6; yeni öğe var olan veya panelde üretilmiş sayfaya bağlanır (404 engeli).

## Sonuçlar / Riskler
- JSON i18n: tip güvenliği için `LocalizedString` tipi + zod şeması; yanlış dil anahtarı riski testle azaltılır.
- NextAuth Credentials: parola sıfırlama akışı v2.2'de eklenecek.
- Sandbox kısıtı: bu ortamda `npm`/Postgres yok; kurulum & migration kullanıcı makinesinde.
