# Çalıştırma & Push — Hızlı Rehber

Günlük kullanım için kısa komut kılavuzu. (Detaylı durum: `PROJE-DURUMU-VE-DEVAM.md`)

---

## A) Projeyi Çalıştırma (yerel)

Proje klasöründe (`akucar-nakliyat`), terminalde:

```bash
npm install        # sadece ilk kez veya paket değiştiyse
npm run dev        # geliştirme sunucusu → http://localhost:3000
```

- Site: `http://localhost:3000`
- Panel: `http://localhost:3000/admin/login`
  → `admin@akucarnakliyat.com` + `.env`'deki `SEED_ADMIN_PASSWORD`

> `.env` dosyası olmadan çalışmaz. Yoksa `PROJE-DURUMU-VE-DEVAM.md` §7'ye bak.

Veritabanı/şema değiştiyse çalıştırmadan önce:

```bash
npx prisma generate        # Prisma client'ı günceller
npx prisma migrate deploy  # bekleyen migration'ları Neon'a uygular (güvenli)
```

---

## B) Değişiklikleri Yayınlama (push)

**Önemli:** İki repo var. Kod `origin`'de, ama **Vercel `deploy` reposunu izliyor**.
Canlıya çıkması için **ikisine de** push et.

```bash
git add -A
git commit -m "kısa açıklama"
git push origin main      # kod reposu (akucar-nakliyat)
git push deploy main      # Vercel'i tetikler (akucar-nakliyat-deploy)  ← BU ŞART
```

`git push deploy main` çalışınca Vercel otomatik yeni deploy başlatır.
Sonucu: https://vercel.com/casperv3/akucar-nakliyat-deploy → Deployments

---

## C) İlk Kurulumda (yeni bilgisayarda) `deploy` remote'unu ekle

`deploy` remote'u yoksa `git push deploy main` hata verir. Bir kere ekle:

```bash
git remote -v                                                                 # mevcut remote'ları gör
git remote add deploy https://github.com/alisakaroglu/akucar-nakliyat-deploy.git
```

Ekledikten sonra artık her seferinde sadece B bölümündeki push komutları yeter.

---

## D) Sık Karşılaşılanlar

| Durum | Çözüm |
|---|---|
| `git push deploy main` → "error: unrelated histories" veya reddedildi | Geçmişler farklıysa: `git push --force deploy main` (deploy reposunu senin kodunla eşitler) |
| Push'ta kimlik doğrulama isteniyor | GitHub kullanıcı adı + **Personal Access Token** (parola değil) ya da SSH |
| Deploy build hatası (type error vb.) | Vercel → Deployments → ilgili build → log'u oku; hatayı düzelt, tekrar push |
| Deploy oldu ama değişiklik görünmüyor | Doğru repoya (`deploy`) push ettiğinden emin ol; Vercel Deployments'ta yeni "Ready" var mı bak |
| Panelde içerik yok / DB hatası | `.env`'deki `DATABASE_URL` doğru mu (`&schema=akucarnakliyat` dahil)? |

---

## Özet (ezber kart)

```bash
# çalıştır
npm run dev

# yayınla
git add -A
git commit -m "..."
git push origin main
git push deploy main
```
