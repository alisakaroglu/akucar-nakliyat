# Yayınlama Rehberi — Akuçar Nakliyat (v1)

Bu site **Next.js 14** ile yazıldı. Müşteriye göstermek için en hızlı ve ücretsiz yol **Vercel**'dir
(Next.js'i geliştiren firma; otomatik `https://proje-adi.vercel.app` önizleme linki verir).

---

## Nerede barındırılır? (kısa karşılaştırma)

| Seçenek | Ücret | Önizleme linki | Not |
|--------|-------|----------------|-----|
| **Vercel** ✅ (önerilen) | Hobby planı ücretsiz | `*.vercel.app` otomatik | Next.js için sıfır-ayar; SSR/ISR/`next/image` sorunsuz |
| Netlify | Ücretsiz katman | `*.netlify.app` | Next.js çalışır, eklenti gerekebilir |
| Cloudflare Pages | Ücretsiz katman | `*.pages.dev` | Next runtime ayarı ister |

> Müşteriye göstermek için **Vercel'in verdiği `*.vercel.app` linki yeterlidir** — alan adı satın almaya gerek yok.
> Onay sonrası gerçek alan adı (akucarnakliyat.com) Vercel'e bağlanır.

---

## Yöntem A — GitHub + Vercel (önerilen, kalıcı)

1. Projeyi bir GitHub deposuna gönderin:
   ```bash
   git init
   git add .
   git commit -m "Akuçar Nakliyat v1"
   git branch -M main
   git remote add origin https://github.com/<kullanıcı>/akucar-nakliyat.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → GitHub ile giriş → **Add New → Project** → bu depoyu seçin.
3. Vercel framework'ü **Next.js** olarak otomatik algılar. Ayar değiştirmeden **Deploy**.
4. ~1-2 dk sonra `https://akucar-nakliyat.vercel.app` benzeri link hazır → müşteriye bu linki gönderin.
5. Her `git push` otomatik yeni yayın üretir; her PR için ayrı önizleme linki çıkar.

## Yöntem B — Vercel CLI (depo olmadan hızlı)

```bash
npm i -g vercel
vercel            # ilk seferde giriş + proje kurulumu (sorulara Enter yeterli)
vercel --prod     # production yayını + link
```

---

## Yayından önce yerelde son kontrol

```bash
npm install
npm run build     # hatasız derlenmeli
npm run start     # http://localhost:3000 — TR/EN/AR ve /teklif, /filo lightbox test
```

Performans ölçümü (hedef Lighthouse 90+):
```bash
npx lighthouse http://localhost:3000/tr --view
```

---

## Ortam değişkenleri

**v1 için zorunlu değişken YOK** — site tamamen statik/çeviri tabanlı çalışır.

Tek opsiyonel değişken, doğru SEO adresleri (canonical, OpenGraph, sitemap) içindir:

| Değişken | Ne zaman | Değer |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Gerçek alan adı bağlanınca | `https://www.akucarnakliyat.com` |

- Ayarlanmazsa Vercel önizlemede otomatik olarak `*.vercel.app` adresi kullanılır (kod bunu kendisi çözer).
- Ayarlamak için: Vercel → Project → **Settings → Environment Variables**.

> `DATABASE_URL`, `CLOUDINARY_*`, `NEXTAUTH_SECRET` vb. yalnızca **v2 (panel)** aşamasında gerekir (bkz. `.env.example`).

---

## Gerçek alan adını bağlama (müşteri onayından sonra)

1. Vercel → Project → **Settings → Domains** → `akucarnakliyat.com` ekleyin.
2. Vercel'in verdiği DNS kayıtlarını (A / CNAME) alan adı sağlayıcısında tanımlayın.
3. `NEXT_PUBLIC_SITE_URL`'i bu alan adına ayarlayıp yeniden yayınlayın (SEO adresleri netleşsin).

---

## Notlar

- Görseller şu an telifsiz **Pexels** placeholder'larıdır; production'da müşterinin gerçek filo
  fotoğraflarıyla `lib/images.ts` üzerinden tek noktadan değiştirilir (v3).
- Başlık fontu (Clash Display) lisanslı dosya gelince `app/fonts.ts` içinde `next/font/local` ile
  değiştirilecek; şu an Space Grotesk stand-in.
