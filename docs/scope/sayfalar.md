# Scope — Sayfalar (Faz 1.3)

**Modül:** Faz 1.3 — Sayfalar
**Durum:** 🟨 Devam ediyor
**Amaç:** Navigasyondaki tüm hedefleri gerçek, tutarlı tasarımlı sayfalarla doldurmak.
İçerik statik/çeviriden beslenir (panel/DB yok). Tüm sayfalar TR/EN/AR + RTL.

---

## Aktif klasörler

- `app/[locale]/` altında yeni route'lar: `hizmetler/`, `hizmetler/[slug]/`, `kurumsal/`,
  `filo/`, `referanslar/`, `iletisim/`
- `components/ui/` — ortak `PageHeader`, `Section`, `Accordion`
- `components/sections/` — sayfaya özel bölümler
- `lib/` — `services.ts`, `faq.ts` gibi statik veri kaynakları
- `messages/tr|en|ar.json` — yeni anahtarlar
- `ROADMAP.md`, `README.md`

## Dokunulmayacak

- Panel/DB/API (Faz 2).
- `docs/design-system.md` (kaynak).
- Mevcut çalışan layout/anasayfa bileşenleri — yalnızca gerekiyorsa cerrahi dokunuş.

---

## Kapsam (bu turda)

- [ ] Ortak `PageHeader` (tüm iç sayfalar için tek kalıp), `Section`, `Accordion`.
- [ ] Hizmetler: liste (`/hizmetler`) + detay (`/hizmetler/[slug]`, 5 hizmet, `generateStaticParams`).
- [ ] Kurumsal (`/kurumsal`): Biz Kimiz / Vizyon-Misyon / Kalite / İK bölümleri tek sayfada.
- [ ] Filo & Galeri (`/filo`): kart gridi (placeholder görsel notu).
- [ ] Referanslar (`/referanslar`): logo gridi (placeholder).
- [ ] İletişim (`/iletisim`): bilgiler + teklif/iletişim formu (client validation, placeholder submit).
- [ ] SSS accordion (referanslar/iletişim ya da kurumsal içinde bir bölüm).

## Sonraki tur (Faz 1.3 devamı)

- Ekip/Kadro, Haberler/Blog (liste+detay), çok adımlı teklif formu, animasyonlu harita rotaları.

## Kurallar

- **Bileşen kalıbı tutarlılığı:** Tüm iç sayfalar aynı `PageHeader` ve `Section` kalıbını kullanır.
- Sabit string yok; her metin çeviri dosyasından. 3 dil tam parite.
- Hizmet slug'ları anasayfadaki kartlarla bire bir eşleşir.
