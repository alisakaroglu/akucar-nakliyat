# Akuçar Nakliyat — Tasarım Sistemi

> **Bağlayıcı belge.** Tüm sayfalar ve bileşenler bu sisteme uyar. Renk, tipografi ve
> bileşen kalıplarında bu dökümanın dışına çıkılmaz. README §3 (Görsel Yön) ile çakışma
> olursa README esas alınır; bu döküman onu sayısallaştırır.

**Vibe:** Koyu, premium, sinematik. Lojistikte herkes mavi kullanır; Akuçar altın-amber ile
sıcak, pahalı ve Ortadoğu/Hatay güneşini çağrıştıran bir his verir. Modern ama sade —
absürt renk yok, paletin dışına çıkılmaz.

---

## 1. Renk Paleti

### 1.1 Çekirdek (Core)

| Rol | Token | HEX | Kullanım |
|-----|-------|-----|----------|
| Zemin (en koyu) | `bg-base` | `#0A0E14` | Sayfa arka planı, hero zemini |
| Zemin (yükseltilmiş) | `bg-elevated` | `#11161F` | Kart, panel, footer |
| Zemin (üst katman) | `bg-overlay` | `#1A212D` | Modal, dropdown, hover yüzeyi |
| Kenarlık | `border-subtle` | `#232C3A` | Kart kenarı, ayraç çizgileri |
| Metin (birincil) | `text-primary` | `#F5F3EF` | Başlık ve gövde ana metin |
| Metin (ikincil) | `text-muted` | `#A8AEB8` | Alt metin, açıklama, caption |
| Metin (soluk) | `text-faint` | `#6B7280` | Placeholder, devre dışı |

### 1.2 Vurgu (Amber — marka rengi)

| Rol | Token | HEX | Kullanım |
|-----|-------|-----|----------|
| Amber (ana) | `accent` | `#D4A24E` | Birincil buton, vurgu, ikon, link hover |
| Amber (açık) | `accent-light` | `#E8B45A` | Gradient üst ucu, parlama, hover |
| Amber (koyu) | `accent-dark` | `#A87C34` | Basılı (active) durum, gölge tonu |
| Amber (soft zemin) | `accent-soft` | `rgba(212,162,78,0.12)` | Amber rozet/etiket arka planı |

> Tek vurgu rengi disiplini: amber dışında ikinci bir marka rengi **yok**. Çeşitlilik
> tonlama (lightness) ve şeffaflıkla sağlanır.

### 1.3 Durum Renkleri (state) — yalnızca form/sistem geri bildirimi

| Rol | Token | HEX |
|-----|-------|-----|
| Başarı | `success` | `#4E9D6B` |
| Uyarı | `warning` | `#D9A441` |
| Hata | `danger` | `#C5564B` |
| Bilgi | `info` | `#5B8AA6` |

> Durum renkleri sadık biçimde soluk/koyu tutulur; sinematik paleti bozmaz. Marketing
> yüzeylerinde kullanılmaz, yalnızca form doğrulama ve panel (v2) geri bildiriminde.

### 1.4 Gradientler & Doku

- **Hero overlay:** `linear-gradient(180deg, rgba(10,14,20,0) 0%, #0A0E14 90%)` — görsel
  üstüne metin okunabilirliği için alttan koyulaşma.
- **Amber glow:** `radial-gradient(circle, rgba(232,180,90,0.18), transparent 70%)` — buton
  ve harita rota düğümleri arkası.
- **Grain/noise:** İnce film grain overlay (`opacity: 0.04–0.06`), `mix-blend-mode: overlay`.
  README'deki grain promptundan üretilen PNG tile olarak kullanılır.

---

## 2. Tipografi

### 2.1 Font Aileleri

| Rol | Font | Yedek | Not |
|-----|------|-------|-----|
| Display / başlık | **Clash Display** (veya General Sans) | `Georgia, serif` değil → `system-ui` | Karakterli, geniş tracking'li başlıklar |
| Gövde / UI | **Inter** (veya General Sans) | `system-ui, sans-serif` | Okunabilir, nötr |
| Arapça (AR) | **IBM Plex Sans Arabic** | `Tahoma` | RTL; display + gövde aynı aile |

> `next/font` ile lokal/Google barındırma (Faz 1.1). Arapça layout aktifken (`lang=ar`)
> başlık ve gövde IBM Plex Sans Arabic'e düşer.

### 2.2 Tip Skalası (1.250 — Major Third, 16px taban)

| Token | Boyut (rem / px) | Satır yük. | Ağırlık | Kullanım |
|-------|------------------|-----------|---------|----------|
| `display` | 4.209 / ~67px | 1.05 | 600 | Hero başlığı (desktop) |
| `h1` | 3.157 / ~50px | 1.1 | 600 | Sayfa başlığı |
| `h2` | 2.369 / ~38px | 1.15 | 600 | Bölüm başlığı |
| `h3` | 1.777 / ~28px | 1.2 | 500 | Kart/alt başlık |
| `h4` | 1.333 / ~21px | 1.3 | 500 | Küçük başlık |
| `body-lg` | 1.125 / 18px | 1.6 | 400 | Giriş paragrafı |
| `body` | 1.0 / 16px | 1.65 | 400 | Ana gövde |
| `small` | 0.875 / 14px | 1.5 | 400 | Caption, etiket |
| `overline` | 0.75 / 12px | 1.4 | 500 | Üst etiket, `letter-spacing: 0.12em`, UPPERCASE |

> **Mobil:** `display` ve `h1` mobilde bir kademe düşürülür (clamp ile akışkan). Örn.
> `font-size: clamp(2.5rem, 8vw, 4.209rem)`.

### 2.3 Tipografi Kuralları

- Başlıklarda hafif negatif tracking (`-0.02em`); overline'da pozitif (`0.12em`).
- Paragraf maksimum genişlik `~70ch` (okunabilirlik).
- Amber yalnızca tek kelime/ifade vurgusu için; tüm başlığı amber yapma.

---

## 3. Boşluk (Spacing) & Grid

### 3.1 Spacing skalası (4px tabanı)

`0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128` (px) → token: `1,2,3,4,5,6,8,12,16,24,32`
(Tailwind ölçeğiyle uyumlu; özel: `18=72px`, `30=120px`, `40=160px` bölüm aralıkları için).

### 3.2 Layout

- **İçerik max genişlik:** `1280px` (`container`), yanlardan `padding: 24px` (mobil),
  `32px` (desktop).
- **Bölüm dikey boşluğu (section):** desktop `120–160px`, mobil `64–80px`.
- **Grid:** 12 kolon, gutter `24px`. Hizmet kartları desktop 2–3 kolon, tablet 2, mobil 1.

### 3.3 Köşe yarıçapı (radius)

| Token | Değer | Kullanım |
|-------|-------|----------|
| `sm` | 6px | Etiket, input |
| `md` | 12px | Buton, küçük kart |
| `lg` | 20px | Kart, panel |
| `xl` | 28px | Hero görsel, büyük modal |
| `full` | 9999px | Pill buton, avatar |

### 3.4 Gölge & Derinlik

- `shadow-card`: `0 8px 30px rgba(0,0,0,0.35)` — kartlar.
- `shadow-amber`: `0 6px 24px rgba(212,162,78,0.25)` — birincil buton hover.
- Koyu temada gölge yerine çoğunlukla **kenarlık + zemin tonu farkı** ile derinlik verilir.

---

## 4. Komponent Kütüphanesi (Taslak)

> **Kalıp tutarlılığı zorunlu.** Bir yerde modal kullanıldıysa her yerde modal; karışık
> patern yok. Aşağıdaki kalıplar tüm sayfalar ve (ileride) panel için tek kaynaktır.

### 4.1 Butonlar

| Varyant | Görünüm | Kullanım |
|---------|---------|----------|
| `primary` | Amber dolgu (`accent`), koyu metin (`bg-base`), hover'da `accent-light` + `shadow-amber` | Ana CTA (Teklif Al, İletişim) |
| `secondary` | Şeffaf, `border-subtle` kenar, `text-primary`; hover'da amber kenar | İkincil aksiyon |
| `ghost` | Kenarsız, `text-muted`; hover'da `text-primary` | Navbar linkleri, düşük öncelik |
| `icon` | Kare/yuvarlak, yalnız ikon | WhatsApp, sosyal, dil değiştirici |

Boyutlar: `sm (h36)`, `md (h44)`, `lg (h52)`. Geçiş: `transition 200ms ease`.

### 4.2 Kartlar

- **Hizmet kartı:** `bg-elevated`, `radius-lg`, üstte görsel (`radius` üst köşeler), altta
  başlık + kısa açıklama + "Detay →" ghost link. Hover: hafif yukarı kalkma (`translateY(-4px)`)
  + amber kenar parlaması.
- **Filo/galeri kartı:** Görsel ağırlıklı; hover'da overlay + zoom (`scale 1.03`). Tıkla → lightbox.
- **İstatistik kartı:** Büyük animasyonlu sayı (amber) + etiket (`text-muted`).
- **Referans logosu:** Gri/desature, hover'da renklenir; tek satır kayan şerit.

### 4.3 Navigasyon

- **Navbar:** Sticky, scroll'da `bg-base/80` + `backdrop-blur`. Sol logo, orta menü
  (`ghost` linkler), sağ dil değiştirici + birincil CTA. Mobilde hamburger → tam ekran
  overlay menü. Üst menü öğe limiti: **maks 6** (panel v2'de uyarı korunur).
- **Dil değiştirici:** `icon`/pill; TR / EN / AR. AR seçilince RTL aktif.
- **Footer:** `bg-elevated`, çok kolon (kurumsal, hizmetler, iletişim, bülten formu),
  altta telif + sosyal ikonlar.

### 4.4 Form Elemanları

- Input/textarea/select: `bg-overlay`, `border-subtle`, focus'ta amber kenar + soft glow.
- Hata durumu: `danger` kenar + `small` hata metni.
- **Teklif formu:** Çok adımlı (stepper); adım göstergesi amber dolu/boş.
- **Modal:** Ekleme/düzenleme gibi tüm "oluştur" akışları modal ile (panel v2 dahil tutarlı).

### 4.5 Overlay & Diğer

- **Modal:** `bg-overlay`, `radius-xl`, arka plan `rgba(0,0,0,0.6)` + blur. Kapatma sağ üst (RTL'de sol üst).
- **Accordion (SSS):** Kenarlıkla ayrılmış satırlar; açılınca amber ikon dönüşü.
- **Lightbox (galeri):** Tam ekran koyu zemin, ok navigasyon (RTL'de yön ters).
- **WhatsApp butonu:** Sabit sağ alt (RTL'de sol alt), `icon` yuvarlak, amber glow.
- **Toast/bildirim:** Sağ üst, durum renkli kenar.

---

## 5. Hareket & Animasyon (Framer Motion)

- **Scroll-reveal:** Bölümler `opacity 0 → 1` + `translateY(24px → 0)`, `duration 0.6s`,
  `ease [0.22,1,0.36,1]`, `viewport once`.
- **İstatistik sayaçları:** Görünür olunca 0'dan hedefe sayma (`~1.5s`).
- **Hover derinlik:** Kartlarda `translateY` + gölge; `spring` geçiş.
- **Harita rotaları:** Hatay → Beyrut → Şam çizgisi `pathLength 0 → 1` ile çizilir; düğümlerde amber glow.
- **Sayfa geçişi:** Yumuşak fade/slide; ağır değil.
- **Erişilebilirlik:** `prefers-reduced-motion` aktifse tüm büyük hareketler kapatılır,
  yalnızca anlık opacity geçişi kalır.

---

## 6. İkonografi & Görsel Dil

- **İkon seti:** `lucide-react` (ince çizgi, modern) — tek set, tutarlı stroke `1.5px`.
- **İkon rengi:** Varsayılan `text-muted`, aktif/hover `accent`.
- **Görseller:** README §7 ve §7.1'deki AI promptlarından üretilir (Claude görsel üretmez).
  Tümü koyu + amber paletine sadık. `next/image`, WebP, lazy-load. Gerçek plaka/marka yok.

---

## 7. Erişilebilirlik (a11y) Temel Kuralları

- Metin/zemin kontrastı AA (amber `#D4A24E` üzerine koyu metin; açık metin koyu zemin üzerinde ≥ 4.5:1).
- Tüm interaktif öğelerde görünür focus halkası (amber).
- Form etiketleri `label` ile bağlı; ikon-butonlarda `aria-label`.
- RTL'de yön, hizalama ve ikon yönleri (ok, chevron) doğru çevrilir.

---

## 8. Design Tokens — Tailwind Taslağı (Faz 1.1'e hazır)

> Faz 1.1'de `tailwind.config.ts` içine `theme.extend` olarak aktarılacak. CSS değişkenleri
> `globals.css`'te `:root` altında tanımlanır; tema tek noktadan beslenir (DRY).

```ts
// tailwind.config.ts — theme.extend taslağı
export const themeExtend = {
  colors: {
    base: "#0A0E14",
    elevated: "#11161F",
    overlay: "#1A212D",
    border: { subtle: "#232C3A" },
    text: { primary: "#F5F3EF", muted: "#A8AEB8", faint: "#6B7280" },
    accent: {
      DEFAULT: "#D4A24E",
      light: "#E8B45A",
      dark: "#A87C34",
    },
    success: "#4E9D6B",
    warning: "#D9A441",
    danger: "#C5564B",
    info: "#5B8AA6",
  },
  fontFamily: {
    display: ["var(--font-display)", "system-ui", "sans-serif"],
    sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
  },
  fontSize: {
    overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
    small: ["0.875rem", { lineHeight: "1.5" }],
    body: ["1rem", { lineHeight: "1.65" }],
    "body-lg": ["1.125rem", { lineHeight: "1.6" }],
    h4: ["1.333rem", { lineHeight: "1.3" }],
    h3: ["1.777rem", { lineHeight: "1.2" }],
    h2: ["2.369rem", { lineHeight: "1.15" }],
    h1: ["3.157rem", { lineHeight: "1.1" }],
    display: ["4.209rem", { lineHeight: "1.05" }],
  },
  spacing: { 18: "4.5rem", 30: "7.5rem", 40: "10rem" }, // 72 / 120 / 160px
  borderRadius: { sm: "6px", md: "12px", lg: "20px", xl: "28px" },
  boxShadow: {
    card: "0 8px 30px rgba(0,0,0,0.35)",
    amber: "0 6px 24px rgba(212,162,78,0.25)",
  },
  maxWidth: { container: "1280px", prose: "70ch" },
};
```

```css
/* globals.css — CSS değişkenleri (referans) */
:root {
  --color-base: #0A0E14;
  --color-accent: #D4A24E;
  --color-text-primary: #F5F3EF;
  /* ... token'lar tailwind config ile senkron tutulur ... */
}
[dir="rtl"] { /* Arapça yön düzeltmeleri burada toplanır */ }
```

---

*Bu döküman yaşayan belgedir. Faz 1.1 uygulaması sırasında ortaya çıkan pratik
düzeltmeler (ör. clamp değerleri, gerçek font metrikleri) buraya işlenir.*
