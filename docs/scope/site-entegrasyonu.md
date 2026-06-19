# Scope — Faz 2.5 Site–Panel Entegrasyonu

**Durum:** 🟨 Devam ediyor (kademeli)
**Karar:** Yönetilen DB (Neon/Supabase) + Vercel. Kademeli geçiş: önce Site Ayarları → sonra Hizmetler → diğerleri.

## İlke: güvenli fallback
- Tüm public veri çekiciler `lib/content.ts` içinde toplanır.
- `DATABASE_URL` tanımlı değilse **veya** DB hatası olursa → **statik fallback** (mevcut `lib/*.ts` / `messages`).
- Böylece Vercel'deki canlı v1, DB bağlanana kadar **aynen** çalışmaya devam eder; DB bağlanınca otomatik DB'den beslenir.
- ISR: `unstable_cache` + `revalidate` + `revalidateTag` (panelde kaydedince anlık tazeleme).

## Aktif klasörler
- `lib/content.ts` (yeni veri katmanı)
- `app/[locale]/layout.tsx`, `components/layout/Footer.tsx`, `WhatsAppButton.tsx`, `app/[locale]/iletisim/page.tsx`
- `app/api/admin/settings/route.ts` (revalidateTag)
- Sonraki adımda: `ServicesGrid`, `/hizmetler`, `[slug]` detay

## Sıra
1. [~] Site Ayarları → footer/iletişim/WhatsApp (bu adım)
2. [ ] Hizmetler (anasayfa + liste + detay) DB'den (fallback `lib/services` + messages)
3. [ ] Haberler, Filo, Hero, İstatistik, Referanslar, Ekip, SSS
4. [ ] Dinamik sayfalar: `app/[locale]/[slug]` render
5. [ ] Prod: Neon/Supabase'e geçiş + Vercel env + son test

## Dokunulmayacak
- Panel modülleri (Faz 2.3) — yalnızca gerekli `revalidateTag` eklentileri.
- Tasarım/çeviri yapısı — sadece veri kaynağı değişir, görünüm aynı.
