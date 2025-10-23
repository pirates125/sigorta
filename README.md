e# 🛡️ Sigorta Acentesi - Production Ready Platform

Modern, kapsamlı bir sigorta karşılaştırma ve satış platformu. **Gerçek web scraping** ile Sompo ve diğer sigorta şirketlerinden otomatik teklif alır.

## ✨ Özellikler

### 🎯 Temel Özellikler

- ✅ **Akıllı Karşılaştırma Algoritması** - Fiyat (%40) + Kapsam (%30) + Rating (%20) + Hız (%10)
- ✅ **Referans & Komisyon Sistemi** - Kullanıcı referansları ve otomatik komisyon hesaplama
- ✅ **3 Rol Sistemi** - Admin, Broker, Kullanıcı
- ✅ **Gerçek Web Scraping** - Sompo Sigorta'dan otomatik teklif alma
- ✅ **Online Poliçe Satın Alma** - Tam entegre checkout süreci
- ✅ **Rate Limiting & Güvenlik** - Production-ready güvenlik katmanları

### 📊 Broker Özellikleri

- Müşteri yönetimi ve takibi
- Komisyon dashboard'u
- Detaylı raporlar ve analizler
- Müşteri tekliflerini görüntüleme

### 🎨 UI/UX

- Modern responsive tasarım
- Skor kartları ve detaylı karşılaştırma
- Referans widget'ları
- Kullanıcı dostu arayüz

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 2. Kurulum

```bash
# Repository'yi klonlayın
git clone <your-repo-url>
cd sigorta

# Bağımlılıkları yükleyin
npm install
```

### 3. Environment Variables

`.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sigorta"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Sompo Sigorta Credentials
SOMPO_URL="https://ejento.somposigorta.com.tr/dashboard/login"
SOMPO_USER="your-sompo-username"
SOMPO_PASS="your-sompo-password"
SOMPO_SECRET_KEY="your-google-authenticator-secret"  # OTP için gerekli!

# App URL (referral links için)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Hazırlama

```bash
# PostgreSQL veritabanı oluşturun
createdb sigorta

# Migration çalıştırın
npx prisma migrate dev --name production_ready_upgrade

# Seed data ekleyin (admin kullanıcı ve şirketler)
npx prisma db seed
```

### 5. Development Server

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 👤 Demo Hesaplar

Seed komutundan sonra otomatik oluşturulur:

### Admin

- Email: `admin@sigorta.com`
- Şifre: `admin123`

### Broker

- Email: `broker@sigorta.com`
- Şifre: `broker123`

### Kullanıcı

- Email: `user@sigorta.com`
- Şifre: `user123`

## 📁 Proje Yapısı

```
sigorta/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── auth/                 # Authentication (NextAuth)
│   │   ├── quotes/               # Teklif API
│   │   ├── referrals/            # Referans API
│   │   ├── commissions/          # Komisyon API
│   │   ├── policies/             # Poliçe API
│   │   └── profile/              # Profil API
│   ├── admin/                    # Admin panel
│   │   ├── users/                # Kullanıcı yönetimi
│   │   └── companies/            # Şirket yönetimi
│   ├── broker/                   # Broker dashboard
│   │   ├── customers/            # Müşteri listesi
│   │   ├── commissions/          # Komisyon takibi
│   │   ├── quotes/               # Müşteri teklifleri
│   │   └── reports/              # Raporlar
│   ├── auth/                     # Login/Register
│   ├── dashboard/                # Kullanıcı dashboard
│   ├── quotes/[id]/              # Teklif sonuçları
│   ├── referrals/                # Referans dashboard
│   ├── profile/                  # Profil ayarları
│   ├── policies/create/          # Poliçe satın alma
│   ├── trafik/                   # Trafik sigortası formu
│   ├── hakkimizda/               # Hakkımızda
│   ├── iletisim/                 # İletişim
│   ├── kvkk/                     # KVKK
│   └── gizlilik/                 # Gizlilik Politikası
├── components/
│   ├── forms/                    # Sigorta formları
│   └── ui/                       # shadcn/ui bileşenleri
├── lib/
│   ├── scrapers/                 # Scraper sınıfları
│   │   ├── base.ts               # Base scraper
│   │   ├── sompo.ts              # Sompo (web scraping)
│   │   ├── anadolu.ts            # Anadolu
│   │   └── ak.ts                 # Ak Sigorta
│   ├── scoring/                  # Karşılaştırma algoritması
│   │   ├── price-scorer.ts       # Fiyat skorlama
│   │   ├── coverage-scorer.ts    # Kapsam skorlama
│   │   ├── rating-scorer.ts      # Rating skorlama
│   │   └── speed-scorer.ts       # Hız skorlama
│   ├── validation/               # Zod schemas
│   ├── comparison-algorithm.ts   # Ana algoritma
│   ├── referral-generator.ts     # Referans kod oluşturucu
│   ├── rate-limit.ts             # Rate limiting
│   ├── sompo-api.ts              # Sompo web scraping
│   ├── auth.ts                   # NextAuth config
│   └── utils.ts                  # Utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── types/                        # TypeScript types
```

## 🔧 Komutlar

```bash
# Development
npm run dev                # Dev server başlat
npm run build              # Production build
npm start                  # Production server

# Database
npx prisma studio          # Database GUI
npx prisma migrate dev     # Yeni migration
npx prisma db seed         # Seed data ekle

# Linting
npm run lint               # ESLint çalıştır
```

## 🌐 API Endpoints

### Public APIs

- `POST /api/quotes` - Yeni teklif oluştur
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/referrals/validate` - Referans kodu doğrula

### Authenticated APIs

- `GET /api/quotes` - Kullanıcının teklifleri
- `GET /api/referrals/generate` - Referans kodu oluştur
- `GET /api/referrals/stats` - Referans istatistikleri
- `GET /api/commissions` - Komisyonlar
- `POST /api/policies` - Poliçe oluştur
- `PUT /api/profile` - Profil güncelle

### Admin APIs

- `GET /api/admin/users` - Tüm kullanıcılar
- `GET /api/admin/companies` - Şirket yönetimi

### Broker APIs

- Broker'lar için özel endpoint'ler otomatik filtrelenir

## 🔐 Güvenlik

- ✅ HTTPS zorunlu (production)
- ✅ bcrypt password hashing
- ✅ Rate limiting (login, API, quotes)
- ✅ Input validation (Zod schemas)
- ✅ SQL injection koruması (Prisma)
- ✅ XSS koruması
- ✅ Role-based access control
- ✅ Session management (NextAuth)

## 🎯 Akıllı Karşılaştırma Algoritması

```typescript
// Ağırlıklı Skor Hesaplama
Score =
  priceScore * 0.4 + // %40 Fiyat
  coverageScore * 0.3 + // %30 Kapsam
  ratingScore * 0.2 + // %20 Şirket Puanı
  speedScore * 0.1; // %10 Hız

// En yüksek skora sahip teklif #1 olur
```

## 💰 Referans & Komisyon Sistemi

### Nasıl Çalışır?

1. Her kullanıcı benzersiz referans kodu alır (örn: `REF-A3B7N9K2`)
2. Kullanıcı kodunu paylaşır
3. Yeni kullanıcı kayıt olurken kodu girer
4. Yeni kullanıcı ilk poliçesini aldığında:
   - Referans veren kişiye %5 komisyon oluşur
   - Komisyon PENDING durumda olur
   - Admin onayladığında APPROVED olur
   - Ödeme yapılınca PAID olur

### Broker Komisyonu

- Broker'lar müşterilerinden kazanırlar
- Detaylı komisyon takibi
- Aylık/yıllık raporlar

## 🤖 Sompo Web Scraping

`lib/sompo-client.ts` dosyası gerçek web scraping yapar (OTP desteğiyle):

1. **Login** - Sompo e-jento sistemine giriş
2. **OTP Doğrulama** - Google Authenticator ile 2FA (otomatik)
3. **Dashboard** - Cosmos URL'ini al
4. **Form Doldurma** - TC, plaka, telefon
5. **EGM Sorgula** - Araç bilgilerini çek
6. **Teklif Al** - Teklif oluştur butonuna tıkla
7. **Parse** - Fiyat, teklif no, komisyon bilgisi

### OTP Test

```bash
npm run test-sompo-otp
```

Bu script OTP'nin doğru üretildiğini ve her 30 saniyede değiştiğini gösterir. **SOMPO_SECRET_KEY** environment variable'ı gereklidir.

### Selector'lar (traffic-form.md'den)

- TC Input: `#txtIdentityOrTaxNo`
- Plaka: `#txtPlateNoCityNo` + `#txtPlateNo`
- Trafik Checkbox: `#chkTraffic`
- EGM Sorgula: `#btnSearchEgm`
- Teklif Oluştur: `#btnProposalCreate`
- Sonuç Div: `#loadedDivTrafficProposal`
- Fiyat: `#lblTrafficProposalGrossPremium`
- OTP Input: `.p-inputotp-input` (6 adet)

## 🎨 Teknolojiler

- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Scraping**: Puppeteer
- **Styling**: Tailwind CSS + CSS Modules

## 📊 Database Schema

### Ana Tablolar

- **User** - Kullanıcılar (role: USER/BROKER/ADMIN)
- **Quote** - Teklif sorguları
- **QuoteResponse** - Şirket teklifleri
- **Policy** - Satın alınan poliçeler
- **Referral** - Referans kayıtları
- **Commission** - Komisyon ödemeleri
- **InsuranceCompany** - Sigorta şirketleri
- **CompanyRating** - Şirket değerlendirmeleri

## 🚀 Production Deployment

### 1. Environment Variables Ayarla

```bash
DATABASE_URL="your-production-db-url"
NEXTAUTH_SECRET="strong-random-secret"
SOMPO_URL="https://ejento.somposigorta.com.tr/dashboard/login"
SOMPO_USER="production-username"
SOMPO_PASS="production-password"
SOMPO_SECRET_KEY="production-google-authenticator-secret"
```

### 2. Build

```bash
npm run build
```

### 3. Migration

```bash
npx prisma migrate deploy
```

### 4. Start

```bash
npm start
```

## 📝 Lisans

Bu proje özel kullanım içindir.

## 🤝 Destek

Sorularınız için: info@sigorta.com

---

**Not**: Gerçek Sompo credential'larınızı `.env` dosyasına eklemeyi unutmayın.

## 🎯 Önemli Notlar

1. **Database Migration Gerekli**: İlk kurulumda veya güncellemelerden sonra:

   ```bash
   npx prisma migrate dev --name production_ready_upgrade
   ```

2. **Sompo Credentials**: `.env` dosyasında gerçek bilgilerinizi kullanın

3. **Rate Limiting**: Production'da daha sıkı limitler ayarlayın

4. **Scraping**: Sompo sitesi değişirse selector'ları güncellemeniz gerekebilir

5. **Performance**: Production'da Puppeteer için yeterli RAM (min 2GB) gerekir
