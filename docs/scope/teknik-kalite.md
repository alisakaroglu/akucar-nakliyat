# Scope — Teknik Kalite (Faz 1.6)

**Modül:** Faz 1.6 — Teknik Kalite
**Durum:** 🟨 Devam ediyor
**Amaç:** SEO, erişilebilirlik ve performans temellerini sağlamlaştırmak.

## Aktif klasörler
- `app/` — `sitemap.ts`, `robots.ts`, `[locale]/layout.tsx` (metadata), sayfa `generateMetadata`
- `lib/seo.ts` — ortak SEO yardımcıları (SITE_URL, alternates/hreflang, buildMetadata)
- `app/globals.css` — skip-link/focus
- `ROADMAP.md`, `README.md`

## Dokunulmayacak
- İçerik/çeviri yapısı (yalnızca gerekiyorsa meta için okunur), panel/DB (Faz 2).

## Kapsam
- [ ] Ortak `lib/seo.ts`: metadataBase, başlık şablonu, OpenGraph/Twitter, hreflang alternates.
- [ ] Tüm sayfalara benzersiz başlık/description (`generateMetadata`).
- [ ] `sitemap.xml` (tüm route × dil) ve `robots.txt`.
- [ ] a11y: skip-to-content linki, görünür focus (mevcut), nav `aria-current`.
- [ ] Responsive statik denetim; taşma/yatay-scroll kontrolü.
- [ ] Lighthouse: makinede çalıştırılacak (sandbox'ta npm yok) — checklist bırak.
