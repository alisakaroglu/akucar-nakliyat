# Backend Kurulum & Migration (Faz 2 — README stack)

Backend, ayrı sunucu olmadan **Next.js API Routes + Prisma + PostgreSQL** ile çalışır.
Mevcut PostgreSQL veritabanın kullanılır (şema: `akucarnakliyat`).

> **Güvenlik:** Aşağıdaki migration/seed komutlarını **sen** çalıştırırsın. Veritabanını
> sıfırlayan/silen (`migrate reset`, `db push --force-reset`, `drop`) komutlar onaysız kullanılmaz.

## 1. Ortam değişkenleri (`.env`)

> **ÖNEMLİ:** Prisma CLI **`.env`** dosyasını okur, `.env.local`'i DEĞİL. Bu yüzden DB/secret
> değişkenlerini **`.env`** dosyasına koy. (Next.js de `.env`'i okuduğundan çalışma zamanı da kapsanır.)

```bash
cp .env.example .env
```

`.env` içeriği (örnek):

```dotenv
DATABASE_URL="postgresql://postgres:12345@localhost:5432/postgres?schema=akucarnakliyat"
JWT_SECRET="<openssl rand -base64 48>"
SEED_ADMIN_EMAIL="admin@akucarnakliyat.com"
SEED_ADMIN_PASSWORD="<güçlü-parola>"
```

- `DATABASE_URL` — `...?schema=akucarnakliyat` parametresiyle şemayı hedefler (yoksa migrate oluşturur).
- `JWT_SECRET` — `openssl rand -base64 48` ile üret.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — ilk admin.

> Alternatif (illa `.env.local` kullanacaksan): `npx dotenv-cli -e .env.local -- npx prisma migrate dev --name init`.

## 2. Bağımlılıklar + Prisma client

```bash
npm install          # postinstall otomatik `prisma generate` çalıştırır
```

## 3. İlk migration (tabloları oluşturur)

```bash
npx prisma migrate dev --name init
```

- `akucarnakliyat` şeması altında tablolar oluşur. Mevcut başka şemalara (örn. `public`) dokunmaz.
- Üretimde: `npx prisma migrate deploy`.

## 4. Seed (admin + v1 içerik — idempotent)

```bash
npm run db:seed
```

- Admin kullanıcı + hizmetler + istatistik + SSS + iletişim ayarı yüklenir. Tekrar çalıştırmak güvenlidir (upsert).

## 5. Doğrulama

```bash
npm run dev
# Giriş: POST /api/auth/login  { email, password }  -> { token }
# Korumalı örnek: POST /api/services  (Authorization: Bearer <token>)
# Public: GET /api/services ; POST /api/quote | /api/contact | /api/newsletter
```

## Uçlar (2.1'de hazır)

| Uç | Yöntem | Koruma |
|----|--------|--------|
| `/api/auth/login` | POST | Public (rate limit) |
| `/api/services` | GET | Public (yayınlanmış) |
| `/api/services` | POST | Bearer |
| `/api/services/:id` | PUT, DELETE | Bearer |
| `/api/quote` | POST | Public (rate limit) |
| `/api/contact` | POST | Public (rate limit) |
| `/api/newsletter` | POST | Public (rate limit) |

> Kalan içerik tipleri (menü, sayfa, haber, referans, filo, galeri, hero, stat, SSS, ekip, ayarlar)
> aynı `services` CRUD desenini izleyerek eklenecek (2.3). Medya yükleme (Cloudinary) ayrı adım.

## 6. Medya yükleme (görseller)

Paneldeki tüm görsel alanları "Dosya yükle" düğmesiyle gelir (`/api/admin/upload`).

- **Cloudinary yapılandırılmışsa** (`.env`'de `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  görsel Cloudinary'ye yüklenir, `secure_url` döner. **Production için önerilen** (Vercel/serverless'te kalıcıdır).
- **Yoksa** görsel `public/uploads/` altına kaydedilir (`/uploads/...`). Yerel geliştirme ve Node host için
  yeterli; Vercel serverless'te kalıcı değildir, bu yüzden production'da Cloudinary kullanın.

> Maksimum 5MB, yalnızca görsel (jpg/png/webp/avif/svg). `public/uploads/` git'e dahil edilmez.
