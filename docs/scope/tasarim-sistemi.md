# Scope — Tasarım Sistemi (Faz 0)

**Modül:** Faz 0 — Keşif & Tasarım Sistemi
**Durum:** 🟨 Devam ediyor
**Amaç:** Kod yazmadan önce görsel dili ve içerik mimarisini kesinleştiren, projenin
bağlayıcı tasarım referansını üretmek. Faz 1.1'de Tailwind config'e birebir aktarılacak
token'ları tanımlamak.

---

## Aktif klasörler (bu modülde dokunulabilir)

- `docs/` — tasarım sistemi ve scope dökümanları
  - `docs/design-system.md` (ana çıktı)
  - `docs/scope/tasarim-sistemi.md` (bu dosya)
- `README.md` — yalnızca Faz 0 ile ilgili satırın işaretlenmesi
- `ROADMAP.md` — "Şu an üzerinde çalışılan", Faz 0 checkbox'ları ve ilerleme tablosu

## Dokunulmayacak

- Henüz mevcut olmayan tüm uygulama kodu (`app/`, `src/`, `components/`, `messages/`,
  `prisma/` vb.) — bunlar Faz 1.1 ve sonrasının konusudur.
- `package.json`, Tailwind/Next config'leri — Faz 1.1'de oluşturulacak.
- Panel / veritabanı / API ile ilgili hiçbir şey (Faz 2).
- README'deki AI görsel promptları — yalnızca referans; değiştirilmeyecek.

---

## Çıktılar (Definition of Done)

- [ ] `docs/design-system.md`: renk paleti, tipografi skalası, spacing & grid,
      komponent kütüphanesi taslağı, hareket/animasyon ilkeleri.
- [ ] Faz 1.1'e hazır, kopyala-yapıştır seviyesinde **design token** taslağı
      (Tailwind `theme.extend` formatında) döküman içinde.
- [ ] ROADMAP & README güncel.

## Kapsam dışı (bu modülde yapılmayacak)

- Gerçek kod / komponent implementasyonu.
- Sitemap zaten README'de mevcut; burada tekrar üretilmeyecek, yalnızca referans verilecek.
- Wireframe görselleri (gerekirse ayrı ele alınır; bu modülde metinsel yapı yeterli).

---

## Notlar

- Palet ve tipografi değerleri README §3 (Görsel Yön) ile **tutarlı** olmak zorundadır;
  çakışma olursa README esas alınır.
- Bu döküman "yaşayan belge"dir; Faz 1.1 uygulaması sırasında pratik düzeltmeler buraya işlenir.
