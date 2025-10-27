# 🚀 Vercel Deployment Rehberi

Bu dokümanda projenizi Vercel'e deploy etmek için gereken tüm adımlar açıklanmaktadır.

## 📋 Gereksinimler

- GitHub hesabı
- Vercel hesabı (ücretsiz plan yeterli)
- PostgreSQL database (Vercel Postgres, Supabase veya Railway önerilir)

---

## 1️⃣ Projeyi GitHub'a Push Edin

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 2️⃣ Vercel Projesi Oluşturun

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Import edin

---

## 3️⃣ Environment Variables Ayarlayın

Vercel project settings'ten aşağıdaki environment variable'ları ekleyin:

```env
# ===== 📊 DATABASE =====
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# ===== 🔐 AUTH (NextAuth) =====
NEXTAUTH_SECRET="your-strong-random-secret-min-32-chars"
NEXTAUTH_URL="https://your-project.vercel.app"
AUTH_TRUST_HOST="true"

# ===== 📧 EMAIL (Nodemailer) =====
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
SMTP_FROM="noreply@sigorta.com"

# ===== 🌐 APP CONFIGURATION =====
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"

# ===== 🤖 SOMPO SİGORTA INTEGRASYON =====
SOMPO_URL="https://ejento.somposigorta.com.tr/dashboard/login"
SOMPO_USER="your-sompo-username"
SOMPO_PASS="your-sompo-password"
SOMPO_SECRET_KEY="your-google-authenticator-secret"

# ===== 🔄 CRON JOBS =====
CRON_SECRET="your-secure-cron-secret"

# ===== 🎯 ENVIRONMENT =====
NODE_ENV="production"
```

### 🔑 Secret Key Oluşturma

```bash
# NEXTAUTH_SECRET için
openssl rand -base64 32

# CRON_SECRET için
openssl rand -hex 16
```

---

## 4️⃣ PostgreSQL Database Oluşturun

### Seçenek A: Vercel Postgres (Önerilen)

1. Vercel project sayfasında "Storage" tab'ına gidin
2. "Create Database" → "Postgres" seçin
3. Database oluşturulduğunda `DATABASE_URL` otomatik eklenir

### Seçenek B: Supabase

1. [Supabase](https://supabase.com)'e gidin
2. Yeni proje oluşturun
3. Settings → Database → Connection string'i kopyalayın
4. `.prisma` değişikliklerini ekleyin

### Seçenek C: Railway

1. [Railway](https://railway.app) hesabı oluşturun
2. New Project → PostgreSQL ekleyin
3. Connection URL'i alın

---

## 5️⃣ Build Settings

Vercel otomatik olarak Next.js projelerini algılar. Eğer özel ayar gerekiyorsa:

**Build Command:**
```bash
prisma generate && prisma migrate deploy && next build
```

**Install Command:** (Zaten varsayılan)
```bash
npm install
```

---

## 6️⃣ Database Migration

İlk deployment sonrası migration'ları çalıştırın:

### Vercel CLI ile:

```bash
# Vercel CLI'yı yükleyin
npm i -g vercel

# Login olun
vercel login

# Database bağlantısını ayarlayın
vercel env pull

# Migration çalıştırın
npx prisma migrate deploy
```

### Alternatif: Vercel Dashboard'dan

1. Project Settings → Functions
2. "Deploy a Function" ile migration script'i deploy edin

### Ya da: Vercel Postgres ile

```bash
vercel postgres connect
# Connection string'i verir
vercel env add DATABASE_URL
```

---

## 7️⃣ İlk Deployment

1. "Deploy" butonuna tıklayın
2. Vercel otomatik olarak:
   - Dependencies install eder
   - Prisma generate eder (postinstall script)
   - Build eder
   - Deploy eder

---

## 8️⃣ İlk Admin Kullanıcıyı Oluşturun

Database'i seed etmek için:

### Seçenek A: Local'dan

```bash
# .env.local dosyasını production DATABASE_URL ile oluşturun
DATABASE_URL="postgresql://..."

# Seed çalıştırın
npm run db:seed
```

### Seçenek B: Vercel CLI ile

```bash
vercel env pull
npm run db:seed
```

### Seçenek C: SQL ile

Vercel Postgres'e bağlanıp:

```sql
-- Admin kullanıcı
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-id',
  'admin@sigorta.com',
  'Admin User',
  '$2a$10$hashed-password-here',  -- bcrypt hash of 'admin123'
  'ADMIN',
  NOW(),
  NOW()
);
```

---

## 9️⃣ Environment Variables Kontrol Listesi

Deploy edilmeden önce şunları kontrol edin:

- [ ] `DATABASE_URL` - Doğru PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Güçlü rastgele string (32+ karakter)
- [ ] `NEXTAUTH_URL` - Production domain URL
- [ ] `AUTH_TRUST_HOST` - "true" değeri
- [ ] `SMTP_USER` - Geçerli email
- [ ] `SMTP_PASSWORD` - Gmail App Password
- [ ] `CRON_SECRET` - Güvenli rastgele string
- [ ] `NEXT_PUBLIC_APP_URL` - Production domain URL

---

## 🔧 Sık Karşılaşılan Hatalar ve Çözümler

### ❌ Hata: `Prisma Client is not generated`

**Çözüm:**
`package.json`'a `postinstall` script ekleyin:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

---

### ❌ Hata: `DATABASE_URL environment variable is missing`

**Çözüm:**
Vercel project settings → Environment Variables → `DATABASE_URL` ekleyin

---

### ❌ Hata: `Module not found: Can't resolve '@/lib/prisma'`

**Çözüm:**
```bash
npx prisma generate
git add prisma/
git commit -m "Add prisma generated files"
git push
```

---

### ❌ Hata: `Authentication failed - 500 Internal Server Error`

**Çözüm:**
1. `NEXTAUTH_URL` ve `NEXTAUTH_SECRET` doğru mu kontrol edin
2. Vercel Functions logs'a bakın
3. Database connection çalışıyor mu kontrol edin

---

### ❌ Hata: `Middleware size exceeds limit`

**Çözüm:**
Middleware'i optimize ettik - dosya boyutu 1MB altında olmalı. Build loglarına bakın.

---

## 📊 Database Management

### Prisma Studio ile:

```bash
# Local'den production'a bağlan
DATABASE_URL="your-production-url" npx prisma studio
```

### Migration oluşturma:

```bash
# Development'ta
npm run db:migrate

# Production'da
npx prisma migrate deploy
```

---

## 🔄 Cron Jobs

`vercel.json` dosyası cron job'ları otomatik ayarlar:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-renewals",
      "schedule": "0 9 * * *"  // Her gün saat 09:00
    }
  ]
}
```

Cron secret'ı environment variable olarak ekleyin.

---

## 📝 Notlar

1. **First Deployment**: İlk deployment'ta database migration'ları manuel çalıştırmanız gerekebilir
2. **Environment Variables**: Production ve Preview environment'ları ayırın
3. **Database Backups**: Düzenli backup alın
4. **Monitoring**: Vercel Analytics'i kullanın
5. **Edge Functions**: Middleware Edge runtime'da çalışır - Prisma kullanmamaya dikkat!

---

## ✅ Deployment Checklist

- [ ] Repository GitHub'da
- [ ] Vercel project oluşturuldu
- [ ] Environment variables eklendi
- [ ] PostgreSQL database hazır
- [ ] `DATABASE_URL` doğru
- [ ] `NEXTAUTH_SECRET` oluşturuldu
- [ ] Build başarılı
- [ ] Migration'lar çalıştırıldı
- [ ] Seed data eklendi (Admin kullanıcı)
- [ ] İlk login test edildi
- [ ] Cron jobs çalışıyor
- [ ] Email gönderimi test edildi

---

## 🎉 Başarılı Deployment!

Projeniz artık `https://your-project.vercel.app` adresinde çalışıyor! 🚀

