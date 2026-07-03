# Akuçar Nakliyat — Proje Durumu & Devam Rehberi

> Bu dosya, projeye **başka bir bilgisayardan** kaldığın yerden devam edebilmen için
> her şeyi özetler: amaç, yapılanlar, mevcut durum, kurulum adımları ve kalan işler.
> Son güncelleme: 2026-07-03

---

## 1. Projenin Amacı

**Akuçar Nakliyat** için kurumsal, çok dilli ve sinematik bir web sitesi + kendi özel
yönetim paneli (mini-CMS).

- **Firma hikayesi:** Ortadoğu **sınır-ötesi taşımacılık uzmanı** (Lübnan / Suriye / Ortadoğu),
  **1985'ten beri köklü**, Hatay/Antakya merkezli. İçerik ve görseller bu hikayeyi destekler,
  jenerik "büyük lojistik" klişesine kaçmaz.
- **Diller:** Türkçe, İngilizce, Arapça (AR için tam **RTL** desteği).
- **Tasarım dili:** Koyu, premium, sinematik. Zemin gece-lacivert/kömür (`#0A0E14`),
  vurgu altın-amber (`#D4A24E` / `#E8B45A`), metin kırık beyaz (`#F5F3EF`).
- **Panel amacı:** Müşteri (Akuçar personeli) siteyi kod bilmeden yönetebilsin —
  hizmet, haber, ekip, filo, güzergah, ayarlar vb. hepsi panelden.

---

## 2. Teknoloji Yığını (Stack)

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Çok dil / RTL | next-intl (TR/EN/AR) |
| Animasyon | Framer Motion |
| Veritabanı | PostgreSQL — **Neon** (managed), şema adı `akucarnakliyat` |
| ORM | Prisma |
| Kimlik doğrulama | JWT Bearer (jose) + bcryptjs |
| Doğrulama | zod |
| Panel veri çekme | React Query (@tanstack/react-query) |
| Medya | Cloudinary (yoksa yerel `public/uploads` yedeği) |
| Hosting | Vercel |

---

## 3. Şu Ana Kadar Neler Yaptık (Fazlar)

### Faz 1 — v1 Site (statik, tamamlandı)
- Tasarım sistemi, tema token'ları, tipografi.
- next-intl ile 3 dil + RTL; navbar, footer, dil değiştirici.
- Tüm public sayfalar: Anasayfa (hero, referans şeridi, istatistik, hizmetler, rota haritası),
  Kurumsal (+belgeler), Hizmetler (liste + 5 detay: Lübnan/Suriye/Ortadoğu/Türkiye/Gümrükleme),
  Filo (+galeri/lightbox), Referanslar, İletişim (+OSM harita), Teklif (çok adımlı form),
  Ekip, Haberler (liste + detay).
- SEO altyapısı (metadata, sitemap, robots, hreflang), sayfa geçiş animasyonları.
- Görseller: telifsiz Pexels placeholder'lar (final için müşteri fotoğrafları gelecek).

### Faz 2 — Yönetim Paneli (tamamlandı)
- Prisma şeması: 17 model (User, MenuItem, Page, Service, NewsPost, Reference, FleetItem,
  GalleryImage, HeroSlide, Stat, Faq, TeamMember, NewsletterSubscriber, QuoteRequest,
  ContactMessage, SiteSetting, **Route**). Çok dilli alanlar JSON `{tr,en,ar}`.
- Auth: JWT Bearer + bcrypt + zod doğrulama + rate limit.
- Tüm API route'ları (CRUD + intake).
- Premium admin paneli (`/admin`): giriş ekranı + 15+ CRUD sayfası
  (Hizmetler, Filo, Güzergahlar, Haberler, Hero, İstatistik, Referanslar, Ekip, SSS, Sayfalar,
  Teklif Talepleri, Mesajlar, Aboneler, Ayarlar) + medya yükleme.

### Faz 2.5 — Site ↔ Panel Entegrasyonu (tamamlandı)
- Tüm içerik artık **veritabanından** besleniyor; `DATABASE_URL` yoksa/DB hatasında
  statik fallback'e düşer (canlı v1 asla bozulmaz). Dosya: `lib/content.ts`.
- Panelde değişiklik anında siteye yansır (`revalidateTag`).
- Bağlanan tipler: Ayarlar, Hizmetler, Haberler, İstatistik, Ekip, SSS, Referanslar, Filo,
  Hero, dinamik `[slug]` sayfalar.

### Neon'a geçiş + içerik aktarımı (tamamlandı)
- Veritabanı Neon'a taşındı (`akucarnakliyat` şeması).
- Kapsamlı `prisma/seed.ts` ile sitedeki **tüm içerik 3 dilde** DB'ye aktarıldı.

### Vercel'e deploy (canlı)
- Site yayında: **https://akucar-nakliyat-deploy.vercel.app**
- Env değişkenleri Vercel'de tanımlı (aşağıda).

### Formlar API'ye bağlandı (tamamlandı)
- Teklif formu → `/api/quote`, İletişim formu → `/api/contact`, Bülten → `/api/newsletter`.
- Artık talepler/mesajlar/aboneler admin paneline düşüyor.

### Güzergah (Route) modülü (kod tamam — canlıda migration gerekli, bkz. §6)
- Yeni `Route` modeli (3 dilli Nereden/Nereye), `/admin/routes` CRUD paneli.
- Teklif formundaki "Güzergâh" adımı artık panelden gelen güzergahları **açılır liste**
  olarak gösteriyor (güzergah yoksa serbest metne düşer).

---

## 4. Deploy Mimarisi (ÖNEMLİ — iki repo var!)

- **Kod reposu (origin):** `github.com/alisakaroglu/akucar-nakliyat`
- **Vercel'in izlediği repo (deploy):** `github.com/alisakaroglu/akucar-nakliyat-deploy`

Vercel **`akucar-nakliyat-deploy`** reposundan deploy eder. Bu yüzden değişiklik yayınlamak için
**iki remote'a da push** etmen gerekir:

```bash
git push origin main
git push deploy main      # <-- Vercel'i tetikleyen budur
```

> İpucu: Uzun vadede tek repoya inmek istersen, Vercel → Settings → Git → Disconnect →
> `akucar-nakliyat`'a bağla. O zaman tek push yeter.

---

## 5. Yeni Bilgisayarda Kurulum

```bash
# 1) Kodu al
git clone https://github.com/alisakaroglu/akucar-nakliyat.git
cd akucar-nakliyat

# 2) Deploy remote'unu ekle (Vercel bu repoyu izliyor)
git remote add deploy https://github.com/alisakaroglu/akucar-nakliyat-deploy.git

# 3) Bağımlılıklar
npm install

# 4) .env dosyasını oluştur (git'e GİRMEZ — §7'ye bak)

# 5) Prisma client üret + tabloları doğrula (veri zaten Neon'da)
npx prisma generate
npx prisma migrate deploy

# 6) Çalıştır
npm run dev      # http://localhost:3000
```

- **Admin girişi:** `http://localhost:3000/admin/login`
  → `admin@akucarnakliyat.com` / (seed'deki parola; `.env`'deki `SEED_ADMIN_PASSWORD`).

---

## 6. YAPILMASI GEREKEN İLK İŞ — Güzergah tablosu migration'ı

Güzergah modülünün kodu push edildi ama **Neon'da `Route` tablosunun oluşması için migration
çalıştırılmalı.** Eğer henüz yapmadıysan, kurulumdan sonra:

```bash
npx prisma generate
npx prisma migrate deploy      # add_routes migration'ını Neon'a uygular (güvenli, sadece ekler)
```

Bunu yapmadan `/admin/routes` ve teklif formundaki güzergah listesi çalışmaz (site geri kalanı
etkilenmez; teklif formu serbest metne düşer). Migration dosyası hazır:
`prisma/migrations/20260619140000_add_routes/`.

İstersen örnek güzergahları eklemek için `npx prisma db seed` çalıştırabilirsin —
**ama dikkat:** seed, SSS ve Hero içeriğini varsayılana **sıfırlar** (panelden elle
düzenlediysen üzerine yazar). Sadece güzergah eklemek istiyorsan seed'i atla, panelden gir.

---

## 7. Ortam Değişkenleri (.env) — GİZLİ, git'e girmez

`.env` dosyası `.gitignore`'da; **repoda yok**. Yeni makinede elle oluşturman gerekir.
Gerçek değerleri şuradan al: **Vercel → Settings → Environment Variables**, Neon panosu,
Cloudinary panosu (veya bu bilgisayardaki eski `.env`'i güvenli şekilde kopyala).

Gereken anahtarlar:

```dotenv
# Neon PostgreSQL — schema parametresi ŞART
DATABASE_URL="postgresql://<kullanıcı>:<parola>@<host>/neondb?sslmode=require&schema=akucarnakliyat"

# JWT imzalama (Vercel'dekiyle AYNI olmalı; yoksa panel oturumları geçersiz olur)
JWT_SECRET="<uzun-rastgele-değer>"

# İlk admin (seed)
SEED_ADMIN_EMAIL="admin@akucarnakliyat.com"
SEED_ADMIN_PASSWORD="<güçlü-parola>"

# Cloudinary (medya yükleme) — cloud name: dktmx6wto
CLOUDINARY_CLOUD_NAME="dktmx6wto"
CLOUDINARY_API_KEY="<cloudinary-api-key>"
CLOUDINARY_API_SECRET="<cloudinary-api-secret>"
```

> **Güvenlik notu:** Neon parolası ve Cloudinary bilgileri sohbet sırasında açığa çıktı.
> Fırsat bulunca Neon'dan parolayı **reset** edip hem `.env`'i hem Vercel'i güncelle.
> Bu `.md` dosyasına asla gerçek gizli değerleri yazma (git'e sızar).

---

## 8. Bilinen Açık Konular / Sıradaki İşler

1. **Güzergah migration'ı** — Neon'a `migrate deploy` (§6). En öncelikli.
2. **Resim yükleme (Cloudinary)** — cloud name `Root` → `dktmx6wto` olarak düzeltildi;
   son deploy sonrası panelden bir görsel yükleyip çalıştığını doğrula.
3. **Hero güncelleme (PUT 400)** — loglarda bir hero düzenlemede doğrulama hatası görülmüştü;
   panelden Hero düzenlemeyi test et, gerekirse `heroUpdateSchema`'ya bak.
4. **İki repo sadeleştirme** — Vercel'i tek repoya bağlamak push kolaylığı sağlar (§4).
5. **Gerçek görseller** — Pexels placeholder'ları müşterinin gerçek filo/proje fotoğraflarıyla değiştir.
6. **Referanslar** — sitede placeholder "LOGO" kutuları var; gerçek müşteri logolarını panelden ekle.
7. **Faz 2.2 — Yetkilendirme (roller)** — admin/editor rol bazlı izinler henüz tamam değil.
8. **Lighthouse 90+** — performans/erişilebilirlik denetimi yapılmadı (kendi makinende çalıştır).

---

## 9. Her Zaman Önce Oku

Projede çalışmaya başlarken **`README.md`** ve **`ROADMAP.md`** dosyalarını oku
(proje kuralları burada). Bu dosya (`PROJE-DURUMU-VE-DEVAM.md`) o ikisinin üstüne,
"nerede kaldık / nasıl devam ederim" özetidir.

**Faz sırası:** önce site (v1) → panel (v2) → iyileştirme (v3). Şu an v2.5 bitti,
sıradaki büyük başlık Faz 3 (cilalama + gerçek içerik + performans).
