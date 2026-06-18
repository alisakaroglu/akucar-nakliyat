# Akuçar Nakliyat — Kurumsal Web Sitesi & Yönetim Paneli

> **Ortadoğu sınır-ötesi taşımacılığının Hatay'daki köklü uzmanı.**
> 1985'ten beri süregelen tecrübeyi, modern ve sinematik bir dijital deneyime taşıyan kurumsal web projesi.

---

## 1. Proje Özeti

Akuçar Nakliyat (Ak Uçar Ulus. Taş. Tic. Ltd. Şti.), 1985'ten bu yana taşımacılık sektöründe faaliyet gösteren, Hatay merkezli, **Lübnan – Suriye – Ortadoğu hattında uzmanlaşmış** uluslararası bir nakliye firmasıdır.

Mevcut sitesi ([akucarnakliyat.com](https://www.akucarnakliyat.com/)) eski bir WordPress + Elementor şablonu üzerine kurulu olup; yavaş, jenerik ve görsel olarak zayıftır. Bu proje, siteyi sıfırdan **modern, hızlı, premium ve yönetilebilir** bir yapıya taşımayı hedefler.

**Konumlandırma farkımız:** Rakipler (Kayra, Assan, Gökbora vb.) "her yöne taşıma yapan büyük lojistik" hikayesini anlatırken; biz Akuçar'ın gerçek kozunu öne çıkarıyoruz — **Ortadoğu / Suriye / Lübnan sınır-ötesi taşımacılıkta nadir bulunan, köklü uzmanlık.**

---

## 2. Hedefler

- Sektörde fark yaratan, "şablon" hissi vermeyen premium bir kurumsal kimlik
- Müthiş UX/UI: koyu, sinematik, altın-amber vurgulu modern tasarım
- Mükemmel performans (hızlı yükleme, SEO dostu, mobil öncelikli)
- Çok dilli yapı: **Türkçe / İngilizce / Arapça** (Arapça için RTL desteği)
- İçeriğin tamamını müşterinin kod bilmeden yönetebileceği **özel admin paneli** (v2)

---

## 3. Görsel Yön (Design Direction)

**Vibe:** Koyu, premium, sinematik. Lojistikte herkes mavi kullanır; biz altın-amber ile sıcak ve pahalı bir his veriyoruz (Hatay/Ortadoğu güneşini de çağrıştırır).

| Öğe | Değer / Yön |
|-----|-------------|
| Zemin | Derin gece-lacivert / kömür siyahı (`#0A0E14` civarı) |
| Vurgu | Altın-amber (`#D4A24E` / `#E8B45A`) |
| Metin | Kırık beyaz (`#F5F3EF`) |
| Başlık fontu | Karakterli display font (örn. Clash Display / General Sans) |
| Gövde fontu | Inter / General Sans (okunabilir sans-serif) |
| Arapça font | Uyumlu bir Arabic font (örn. IBM Plex Sans Arabic) |
| Hareket | Scroll-reveal, animasyonlu sayaçlar, parallax, yumuşak geçişler |
| Dokunuşlar | İnce grain/noise dokusu, animasyonlu harita rotaları (Hatay→Beyrut→Şam) |

> ✅ Detaylı renk paleti, tipografi skalası ve komponent sistemi hazırlandı → **[`docs/design-system.md`](docs/design-system.md)** (bağlayıcı tasarım sistemi belgesi). Faz 1.1'de Tailwind config'e aktarılacak token taslağı da bu belgededir.

---

## 4. Teknik Mimari (Tech Stack)

### Frontend
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — stil sistemi
- **Framer Motion** — sinematik animasyonlar / scroll efektleri
- **next-intl** — çok dil (TR / EN / AR) + RTL desteği

### Backend / Panel (v2)
- **Next.js API Routes** + **Prisma ORM**
- **PostgreSQL** (Neon / Supabase)
- **NextAuth.js** veya özel JWT — admin kimlik doğrulama

### Medya
- **Cloudinary** veya **UploadThing** — otomatik görsel optimizasyonu (WebP), CDN

### Hosting / Altyapı
- **Vercel** (frontend + API)
- **Neon / Supabase** (veritabanı)

> Bu yapı, WordPress'in şişkinliği olmadan tam kontrol ve üstün performans sağlar.

---

## 5. Site Haritası (Sayfalar)

```
Anasayfa
├── Kurumsal
│   ├── Biz Kimiz
│   ├── Vizyon & Misyon
│   ├── Kalite Politikamız
│   ├── İnsan Kaynakları Politikamız
│   └── Belgelerimiz
├── Hizmetlerimiz
│   ├── Lübnan Taşımacılık
│   ├── Suriye Taşımacılık
│   ├── Ortadoğu Taşımacılık
│   ├── Türkiye Cumhuriyeti Nakliye
│   └── Gümrükleme ve Aktarma Hizmetleri
├── Filo & Galeri
├── Referanslar
├── SSS (Sıkça Sorulan Sorular)
├── Ekip / Kadro
├── Haberler / Blog
├── Teklif / Fiyat Talep Formu
└── İletişim
```

> Ek olarak tüm sayfalarda: **WhatsApp hızlı iletişim butonu** (sabit) ve footer'da **e-posta bülteni kayıt formu**.

---

## 6. Admin Paneli — Yönetilebilir Modüller (v2)

Müşteri, kod bilmeden aşağıdaki alanların tamamını panelden yönetebilecek:

- **Dinamik menü** — menü öğesi ekle/sil/düzenle, sürükle-bırak sıralama, alt menü, 3 dil, görünürlük
- **Dinamik sayfa oluşturma** — panelden yeni sayfa açma ve bu sayfayı menüye bağlama
- **Hizmetler & içerik sayfaları** — metin, görsel, sıralama
- **Haberler / Blog** — kategori, görsel, yayın tarihi
- **Referanslar / müşteri logoları** — sürükle-bırak sıralama
- **Filo / araç parkı + galeri** — görsel yükleme ve düzenleme
- **İletişim bilgileri** — adres, telefon, e-posta, harita
- **Hero slaytları** — anasayfa kapak görselleri ve sloganları
- **İstatistik sayaçları** — proje sayısı, mutlu müşteri vb.
- **SSS** — soru/cevap ekle/düzenle/sırala (3 dil)
- **Ekip / Kadro** — kişi ekle/düzenle (foto, isim, ünvan)
- **E-posta bülteni** — abone listesi yönetimi ve dışa aktarma
- **Teklif talepleri** — formdan gelen talepleri görüntüleme/yönetme
- **Site geneli ayarlar** — logo, sosyal medya, SEO meta etiketleri

---

## 7. Görsel Stratejisi

Görseller projenin kalite algısının %50'sini belirler. Strateji:

1. **Tema/geliştirme aşaması (placeholder):** AI ile üretilmiş sinematik görseller (Midjourney / Flux / Imagen vb.). Bu repodaki proje sahibi, sağlanan hazır promptlarla bu görselleri üretecektir.
2. **Yayın aşaması (final):** Mümkün olduğunca **müşterinin gerçek filo / proje fotoğrafları** ile değiştirme. Lojistikte gerçek filo görseli, AI'dan daha inandırıcıdır.
3. **Atmosfer:** Hero / arka plan gibi sinematik sahnelerde AI; ürün/filo/plaka detaylarında gerçek fotoğraf (AI gerçek plaka/marka üretiminde hatalıdır).

> **Not:** Bu asistan (Claude) görsel *üretmez*; yalnızca harici AI araçları için kullanıma hazır İngilizce promptlar sağlar ve web'de stok görsel araştırır. Görsel üretimi proje sahibi tarafından harici bir araçta yapılır.

> **Telif uyarısı:** Web'den araştırılan görseller (Unsplash/Pexels hariç) çoğunlukla ticari stok olup production'da doğrudan kullanılamaz. Geliştirme/placeholder aşaması için referanstır. Final için: lisanslı stok (Adobe Stock/iStock), müşterinin gerçek filosu veya aşağıdaki promptlarla üretilmiş özgün AI görselleri kullanılmalıdır.

---

## 7.1 Hayal Edilen Görseller — AI Promptları

Aşağıdaki promptlar **Midjourney v6 / Flux 1.1 Pro / Google Imagen** gibi araçlar için optimize edilmiştir. Ortak stil çapası: *koyu, sinematik, altın-amber ışık, Ortadoğu/Hatay atmosferi.* Her promptun sonundaki teknik parametreler (`--ar`, `--style` vb.) Midjourney içindir; diğer araçlarda metin kısmı yeterlidir.

### 🎬 Hero — Ana Kapak (en kritik görsel)

```
Cinematic wide shot of a lone modern semi-truck on an empty desert highway
at golden hour, warm amber sunlight low on the horizon, long dramatic shadows,
Middle Eastern landscape with distant mountains, dust haze in the air,
deep contrast, dark moody sky, volumetric light rays, anamorphic lens flare,
shot on ARRI Alexa, 35mm, ultra detailed, premium commercial photography
--ar 16:9 --style raw --v 6
```

### 🌙 Hero Alternatif — Gece Konvoyu

```
Cinematic shot of a truck convoy driving on a coastal highway at blue hour,
headlights glowing, warm amber tail lights forming light trails, deep navy sky,
distant city lights of a Mediterranean port (evoking Beirut/Antakya),
long exposure feel, moody, atmospheric, cinematic color grade,
dark background with golden accents, ultra premium
--ar 16:9 --style raw --v 6
```

### 🚚 Hizmet Kartı — Lübnan / Suriye / Ortadoğu Taşımacılık

```
A heavy-duty truck crossing a border checkpoint road at dawn,
Middle Eastern terrain, soft golden morning light, dust and warmth,
cinematic depth of field, dark foreground, amber rim light on the truck,
sense of long-distance journey and trust, premium editorial photography
--ar 4:3 --style raw --v 6
```

### 🇹🇷 Hizmet Kartı — Türkiye İçi Nakliye

```
Modern cargo truck on a Turkish motorway winding through green-amber hills
at sunset, warm cinematic lighting, motion sense, clean and premium,
dark moody sky with golden glow, professional logistics photography
--ar 4:3 --style raw --v 6
```

### 📦 Hizmet Kartı — Gümrükleme & Aktarma

```
Stacked shipping containers at an industrial port during golden hour,
warm amber light hitting metal surfaces, a few containers in deep shadow,
cinematic wide angle, dramatic sky, sense of scale and international trade,
dark premium mood, high detail commercial photography
--ar 4:3 --style raw --v 6
```

### 🏭 Filo & Galeri — Araç Park Atmosferi

```
A fleet of clean modern trucks parked in a row at night,
lit by warm amber floodlights, wet asphalt reflections,
cinematic low-angle composition, dark background, premium and powerful mood,
fog and atmosphere, professional automotive photography
--ar 16:9 --style raw --v 6
```

### 🗺️ Soyut Arka Plan — Harita / Rota Dokusu

```
Abstract dark cartographic background, a glowing amber route line connecting
Antakya to Beirut to Damascus across a stylized topographic map,
subtle grain texture, deep charcoal navy base, thin golden lines,
minimal, premium, used as a website section background, very dark
--ar 16:9 --v 6
```

### 🧱 Doku — Grain / Noise Overlay

```
Subtle fine film grain texture overlay, warm dark tone, transparent feel,
high resolution, seamless, for premium website background layering
--ar 1:1 --v 6
```

> **İpucu:** Tutarlılık için tüm görsellerde aynı renk paletini koru: koyu zemin + `#D4A24E` amber vurgu. Midjourney'de `--style raw` daha gerçekçi/az süslü sonuç verir; lojistik için idealdir. Gerçek plaka/marka istemiyoruz — AI bunları hatalı üretir, o yüzden promptlarda marka/plaka belirtilmedi.

---

## 8. Sürüm Planı (Özet)

- **v1 — Statik Site:** Tüm sayfalar, çok dil, sinematik tasarım, AI placeholder görseller. Panel YOK; içerik kod/CMS verisi olarak gömülü.
- **v2 — Admin Paneli:** v1'deki içerik yapısına göre özel yönetim paneli, veritabanı, kimlik doğrulama.
- **v3 — İyileştirme:** Gerçek görsellerin entegrasyonu, SEO optimizasyonu, performans ince ayarı, ek özellikler.

> Detaylar için bkz. **ROADMAP.md**

---

## 9. Kurulum (Geliştirme — taslak)

```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

> Ortam değişkenleri (`DATABASE_URL`, `CLOUDINARY_*`, `NEXTAUTH_SECRET` vb.) v2 panel aşamasında detaylandırılacaktır.

> **Faz 1.1 durumu:** İskelet kuruldu (App Router + next-intl `[locale]` + Tailwind token'ları + Navbar/Footer/dil değiştirici + anasayfa hero/stats/services). `npm install` ve `npm run dev` ile çalışır. Statik doğrulama yapıldı; `next build` yerel makinede çalıştırılmalı (geliştirme ortamı npm registry'e açık olmalı).
>
> **Not (font):** Tasarım sistemi başlık fontu olarak Clash Display öngörür (Google Fonts'ta yok). Lisanslı font dosyası gelince `app/fonts.ts` içinde `next/font/local` ile değiştirilir; şimdilik Space Grotesk stand-in.

---

## 10. Proje Bilgileri

| | |
|---|---|
| **Müşteri** | Akuçar Nakliyat (Ak Uçar Ulus. Taş. Tic. Ltd. Şti.) |
| **Sektör** | Uluslararası lojistik / nakliye |
| **Merkez** | Antakya / Hatay |
| **Diller** | TR / EN / AR |
| **Bütçe hedefi** | ~$10.000 (premium kurumsal site) |
| **Referans (mevcut)** | https://www.akucarnakliyat.com/ |

---

*Bu döküman projenin yaşayan belgesidir; geliştirme ilerledikçe güncellenecektir.*
