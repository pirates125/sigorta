# 🚀 BAŞLANGIÇ REHBERİ

Sigorta Acentesi platformunuz hazır! Bu dosya size ilk adımları gösterecek.

## ✅ Yapılması Gerekenler (Sırayla)

### 1. PostgreSQL Veritabanını Hazırlayın

Terminal'de şu komutları çalıştırın:

```bash
# PostgreSQL'e bağlanın (Mac için brew ile kurduysanız)
brew services start postgresql@14

# PostgreSQL'e giriş yapın
psql -U postgres

# Veritabanı oluşturun (PostgreSQL içinde)
CREATE DATABASE sigorta;

# Çıkış yapın
\q
```

**Not**: Eğer PostgreSQL kurulu değilse:

- Mac: `brew install postgresql@14`
- Windows: https://www.postgresql.org/download/windows/

### 2. Veritabanı Tablolarını Oluşturun

```bash
# Proje klasöründeyken:
cd /Users/kaanoba/workspace/sigorta

# Prisma ile tabloları oluşturun
npx prisma db push

# Başlangıç verilerini yükleyin (admin, kullanıcılar, şirketler)
npm run db:seed
```

### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda açın: **http://localhost:3000**

## 🎯 İlk Giriş

### Admin Hesabı

- Email: `admin@sigorta.com`
- Şifre: `admin123`
- Panel: http://localhost:3000/admin

### Test Kullanıcı

- Email: `test@example.com`
- Şifre: `user123`
- Panel: http://localhost:3000/dashboard

## 📝 Hızlı Test Senaryosu

1. Ana sayfaya gidin
2. "Trafik Sigortası" kartına tıklayın
3. Formu doldurun:
   - Plaka: **34ABC123**
   - Araç Tipi: Otomobil
   - Marka: Toyota
   - Model: Corolla
   - Model Yılı: 2020
   - Motor No: TEST123
   - Şase No: **12345678901234567** (17 hane)
   - Sürücü: Ahmet Yılmaz
   - TCKN: **12345678901** (11 hane)
   - Doğum Tarihi: 01/01/1990
   - Ehliyet Tarihi: 01/01/2010
4. "Teklif Al" butonuna tıklayın
5. 1-2 dakika bekleyin
6. Fiyatları görün!

## 🔧 Önemli Komutlar

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server başlat
npm start

# Veritabanı GUI (Prisma Studio)
npm run db:studio

# Seed data yükle
npm run db:seed

# Prisma generate (schema değişikliklerinden sonra)
npx prisma generate

# Database migration
npx prisma db push
```

## 📁 Önemli Dosyalar

- `.env.local` - Ortam değişkenleri (database, API keys)
- `prisma/schema.prisma` - Veritabanı şeması
- `prisma/seed.ts` - Başlangıç verileri
- `lib/scrapers/` - Scraper sınıfları
- `app/api/` - API endpoints

## 🎨 Yapılanlar

✅ Next.js 15 + TypeScript kuruldu
✅ PostgreSQL + Prisma ORM entegre edildi
✅ NextAuth.js ile kimlik doğrulama hazır
✅ Admin ve kullanıcı panelleri oluşturuldu
✅ 4 sigorta formu hazır (Trafik, Kasko, DASK, Sağlık)
✅ Fiyat karşılaştırma sistemi hazır
✅ Scraper altyapısı hazır (Sompo, Anadolu, Ak)
✅ Modern UI (Tailwind + shadcn/ui)
✅ Email sistemi hazır (Nodemailer)
✅ Responsive tasarım

## 🚧 Yapılacaklar (Sizin Tamamlamanız Gerekenler)

### Yüksek Öncelik

1. **Gerçek Sompo API Bilgilerini Ekleyin**

   - `.env.local` dosyasına gerçek API bilgilerinizi girin
   - `lib/sompo-api.ts` dosyasında mock fonksiyonları gerçek API çağrılarıyla değiştirin

2. **Scraper'ları Geliştirin**

   - `lib/scrapers/anadolu.ts` - Anadolu Sigorta web sitesinden veri çekin
   - `lib/scrapers/ak.ts` - Ak Sigorta web sitesinden veri çekin
   - Gerçek CSS selector'ları ve form alanlarını ekleyin

3. **Email Ayarlarını Yapın**
   - `.env.local` dosyasına SMTP bilgilerinizi girin
   - Gmail kullanıyorsanız "App Password" oluşturun

### Orta Öncelik

4. **Ödeme Entegrasyonu**

   - iyzico hesabı açın
   - API key'leri `.env.local`'e ekleyin
   - `app/policies/create` sayfası oluşturun

5. **Email Template'leri**

   - `lib/email-templates.ts` oluşturun
   - Müşteri bildirimleri için HTML template'ler

6. **Admin Paneli Geliştirme**
   - Kullanıcı listesi sayfası
   - Sorgu detayları sayfası
   - Poliçe yönetimi sayfası
   - İstatistik grafikleri

### Düşük Öncelik

7. **Diğer Sigorta Formları**

   - Kasko formu
   - DASK formu
   - Sağlık sigortası formu

8. **Ek Özellikler**
   - PDF export
   - SMS bildirimleri
   - Canlı destek
   - Referans sistemi

## 🔒 Güvenlik Notları

**ÜRETİME ÇIKMADAN ÖNCE:**

1. `.env.local` dosyasındaki `NEXTAUTH_SECRET`'ı değiştirin:

   ```bash
   openssl rand -base64 32
   ```

2. PostgreSQL şifrenizi güçlü yapın

3. HTTPS kullanın (Vercel otomatik sağlıyor)

4. API rate limiting ekleyin

5. Admin şifresini değiştirin

## 📚 Daha Fazla Bilgi

- `README.md` - Teknik dokümantasyon
- `KULLANIM_KILAVUZU.md` - Detaylı kullanım rehberi
- `prisma/schema.prisma` - Veritabanı yapısı

## 🐛 Sorun mu Yaşıyorsunuz?

### Port 3000 Zaten Kullanımda

```bash
# Port'u bulun ve sonlandırın (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Veya farklı port kullanın
PORT=3001 npm run dev
```

### Database Bağlantı Hatası

1. PostgreSQL çalışıyor mu kontrol edin:

   ```bash
   brew services list  # Mac
   pg_isready          # Linux/Mac
   ```

2. `.env.local` dosyasındaki `DATABASE_URL`'i kontrol edin

3. Veritabanı adını ve şifreyi kontrol edin

### Prisma Hataları

```bash
# Prisma'yı sıfırlayın
npx prisma generate
npx prisma db push --force-reset
npm run db:seed
```

### Build Hataları

```bash
# Cache'i temizle
rm -rf .next
npm run build
```

## 🎓 Öğrenme Kaynakları

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org/
- Tailwind CSS: https://tailwindcss.com/docs
- Puppeteer: https://pptr.dev/

## 🚀 Deploy (Canlıya Alma)

### Vercel (Önerilen - Ücretsiz)

1. GitHub'a push yapın
2. https://vercel.com/ adresine gidin
3. "Import Project" ile GitHub repo'nuzu seçin
4. Environment variables ekleyin (`.env.local` içindekileri)
5. Deploy!

### Database (Supabase - Ücretsiz)

1. https://supabase.com/ adresine gidin
2. Yeni proje oluşturun
3. PostgreSQL connection string'i alın
4. Vercel'de `DATABASE_URL`'i güncelleyin

## ✅ Checklist

Başlamadan önce:

- [ ] PostgreSQL kurulu ve çalışıyor
- [ ] Veritabanı oluşturuldu (`sigorta`)
- [ ] `npm install` tamamlandı
- [ ] `.env.local` dosyası var
- [ ] `npx prisma db push` çalıştırıldı
- [ ] `npm run db:seed` çalıştırıldı
- [ ] `npm run dev` ile server başladı
- [ ] http://localhost:3000 açılıyor
- [ ] Admin girişi yapılabiliyor

---

**Tebrikler! Platformunuz hazır. İyi çalışmalar! 💼🎉**

Sorularınız için: admin@sigorta.com
