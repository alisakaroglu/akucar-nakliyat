# Scope — Altyapı Kurulumu (Faz 1.1)

**Modül:** Faz 1.1 — Altyapı Kurulumu
**Durum:** 🟨 Devam ediyor
**Amaç:** Çalışan Next.js 14 (App Router) + TypeScript + Tailwind iskeleti; tasarım
token'larının config'e aktarımı; çok dil (TR/EN/AR) + RTL; temel layout (Navbar, Footer,
dil değiştirici). İçerik statik/çeviriden beslenir — panel/DB yok.

---

## Aktif klasörler (bu modülde dokunulabilir)

- `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`
- `app/` — App Router; `app/[locale]/` altında sayfalar ve layout
- `components/` — `ui/` (ortak: Button, Container), `layout/` (Navbar, Footer, LocaleSwitcher)
- `messages/` — `tr.json`, `en.json`, `ar.json`
- `i18n/`, `middleware.ts` — next-intl routing
- `app/globals.css` — token CSS değişkenleri, font, RTL
- `ROADMAP.md`, `README.md` — ilerleme işaretleme

## Dokunulmayacak

- Panel / veritabanı / API (Faz 2): `prisma/`, `app/api/`, `app/admin/` — bu fazda yok.
- `docs/design-system.md` token'ları **kaynak**tır; config ona göre yazılır, doküman değiştirilmez
  (pratik düzeltme gerekirse ayrıca işlenir).
- README AI promptları.

---

## Mimari kararlar (standart, sapma değil)

- next-intl **App Router + `[locale]` dinamik segment + middleware** yaklaşımı (resmi standart).
- Diller: `tr` (varsayılan), `en`, `ar`. AR'da `dir="rtl"`.
- Fontlar `next/font` ile: display (Clash Display fallback), sans (Inter), arabic (IBM Plex Sans Arabic).
- Tüm metinler çeviri dosyalarından; sabit string gömülmez.

## Definition of Done

- [ ] `npm install` + `next build` (veya `tsc --noEmit`) hatasız.
- [ ] `/tr`, `/en`, `/ar` render olur; AR'da RTL aktif.
- [ ] Navbar + Footer + dil değiştirici tasarım sistemine uygun.
- [ ] Anasayfa hero iskeleti (placeholder görsel notu ile) çeviriden beslenir.
