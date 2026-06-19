# Scope — Faz 2.1 Backend Altyapısı (Admin Paneli)

**Modül:** Faz 2.1 — Backend Altyapısı
**Durum:** 🟨 Devam ediyor (şema onayı bekleniyor)
**Amaç:** v1'in içerik yapısına göre, müşterinin kod bilmeden yönetebileceği panelin
veritabanı + API + kimlik doğrulama temelini kurmak.

---

## Aktif klasörler (bu modülde dokunulabilir)

- `prisma/` — `schema.prisma`, migration'lar, `seed.ts`
- `lib/` — `prisma.ts` (client singleton), `auth.ts`, `validation/` (zod şemaları)
- `app/api/` — API Routes (CRUD, auth)
- `app/[locale]/admin/` veya `app/admin/` — panel arayüzü (2.3+)
- `package.json` — yeni bağımlılıklar
- `.env.example` — DB/auth değişkenleri
- `ROADMAP.md`, `README.md`

## Dokunulmayacak (bu fazda)

- v1 site sayfaları/komponentleri — yalnızca panel entegrasyonu (2.5) aşamasında, cerrahi.
- Mevcut çeviri dosyaları yapısı — panel içeriği DB'ye taşınırken plan ayrı ele alınır.

## Güvenlik kuralları (bağlayıcı)

- **DB'yi sıfırlayan/migrate eden hiçbir komut onaysız çalıştırılmaz** (reset, drop, force, seed-overwrite).
- Şema değişikliği = mimari karar → önce sor (bu döküman + ADR onayı).
- `/admin` korunur; API route'ları oturum/yetki kontrolü olmadan veri döndürmez.
- Tüm girdi zod ile doğrulanır/sanitize edilir; yazma işlemlerinde rate limit.

## Definition of Done (2.1)

- [ ] Onaylı `schema.prisma` (sayfa, menü, hizmet, haber, referans, filo, galeri, hero, stat, SSS, ekip, bülten, teklif, ayar, kullanıcı).
- [ ] `lib/prisma.ts` client singleton.
- [ ] İlk migration + seed (v1 statik içeriğinden) — **kullanıcının DB'si + onayıyla**.
- [ ] CRUD API iskeleti (korumalı).

## Açık sorular (onay gerektiren)

1. Veritabanı sağlayıcısı: **Neon** mu **Supabase** mı? (ikisi de PostgreSQL; Vercel ile Neon pürüzsüz.)
2. Auth: **NextAuth (Credentials)** mu özel **JWT** mi? (öneri: NextAuth Credentials + tek admin rolü, sonra rol genişletme.)
3. Çok dilli içerik alan stratejisi: **JSON `{tr,en,ar}`** kolonları mı, ayrı **Translation tabloları** mı? (öneri: JSON — basit, fallback kolay; arama gereksinimi düşük.)
