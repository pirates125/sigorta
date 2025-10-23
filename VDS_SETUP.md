# 🚀 VDS Kurulum Rehberi

VDS (Virtual Dedicated Server) üzerinde projeyi çalıştırmak için adım adım kurulum rehberi.

## 📋 Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

---

## 1️⃣ Proje Dosyalarını Kopyala

```bash
git clone <repository-url>
cd sigorta
```

---

## 2️⃣ Environment Variables Ayarla

`.env.local` dosyası oluştur:

```env
# NextAuth
NEXTAUTH_SECRET="7NLHUjuTccWNx8DQVtpdYlzbS1wvgw+aq2BMxJvngY8="
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/sigorta?schema=public"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@sigorta.com"

# Cron Job Secret
CRON_SECRET="your-secure-cron-secret-change-this"

# Sompo Credentials (Opsiyonel - Gerçek scraping için)
SOMPO_USER="your-sompo-username"
SOMPO_PASS="your-sompo-password"
```

**Önemli:** Production'da `AUTH_TRUST_HOST=true` yerine doğru `NEXTAUTH_URL` kullan!

---

## 3️⃣ Paketleri Kur

```bash
npm install
```

---

## 4️⃣ Prisma Kurulumu

### Prisma Client Oluştur
```bash
npx prisma generate
```

### Veritabanı Tablolarını Oluştur

**Yöntem A: Migration (Production - ÖNERİLEN)**
```bash
npx prisma migrate deploy
```

**Yöntem B: DB Push (Development - Daha Hızlı)**
```bash
npx prisma db push
```

### Seed Verilerini Yükle
```bash
npm run db:seed
```

Bu komut şu kullanıcıları oluşturur:
- **Admin:** admin@sigorta.com / admin123
- **Broker:** broker@sigorta.com / broker123
- **Test User:** test@example.com / user123

---

## 5️⃣ Build ve Çalıştır

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## 🔧 Sık Karşılaşılan Hatalar ve Çözümler

### ❌ Hata: `UntrustedHost: Host must be trusted`

**Çözüm:**
`.env.local` dosyasına ekle:
```env
AUTH_TRUST_HOST=true
```

---

### ❌ Hata: `MissingCSRF: CSRF token was missing`

**Çözüm 1:** `.env.local` kontrol et, `AUTH_TRUST_HOST=true` olmalı

**Çözüm 2:** `NEXTAUTH_SECRET` doğru set edilmiş mi kontrol et:
```bash
openssl rand -base64 32
```

---

### ❌ Hata: `The table public.users does not exist`

**Çözüm:**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

---

### ❌ Hata: `Module 'lucide-react' not found`

**Çözüm:**
```bash
npm install
# veya
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Hata: `Type error: Parameter implicitly has an 'any' type`

**Geçici Çözüm:** `tsconfig.json` dosyasında:
```json
{
  "compilerOptions": {
    "strict": false,  // ← Bunu false yap
    ...
  }
}
```

**Kalıcı Çözüm:** Her fonksiyonda type tanımla.

---

## 🌐 Production Deployment

### Nginx Reverse Proxy (Opsiyonel)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 ile Çalıştırma (Opsiyonel)

```bash
npm install -g pm2
pm2 start npm --name "sigorta" -- start
pm2 save
pm2 startup
```

---

## 📊 Veritabanı Bakımı

### Migration Oluşturma
```bash
npx prisma migrate dev --name migration-name
```

### Database Studio
```bash
npm run db:studio
```

### Seed Tekrar Çalıştırma
```bash
npm run db:seed
```

---

## 🎯 Kontrol Listesi

- [ ] `.env.local` dosyası oluşturuldu
- [ ] `AUTH_TRUST_HOST=true` eklendi
- [ ] PostgreSQL çalışıyor
- [ ] `npm install` yapıldı
- [ ] `npx prisma generate` çalıştırıldı
- [ ] `npx prisma db push` çalıştırıldı
- [ ] `npm run db:seed` çalıştırıldı
- [ ] `npm run build` başarılı
- [ ] `npm start` ile çalıştırıldı
- [ ] `http://localhost:3000` açılıyor

---

## 📞 Yardım

Herhangi bir sorun yaşarsan:
1. Terminal log'ları kontrol et
2. `.env.local` dosyasını kontrol et
3. PostgreSQL bağlantısını test et: `npx prisma db pull`

---

**🎉 Kurulum Tamamlandı!**

Tarayıcıda `http://localhost:3000` adresini aç ve admin@sigorta.com / admin123 ile giriş yap.

