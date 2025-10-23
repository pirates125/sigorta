# Sigorta Acentesi Platformu - Kullanım Kılavuzu

Bu kılavuz, platformu sıfırdan kurmak ve çalıştırmak için adım adım talimatlar içerir.

## 📚 İçindekiler

1. [Sistem Gereksinimleri](#sistem-gereksinimleri)
2. [Kurulum Adımları](#kurulum-adımları)
3. [İlk Çalıştırma](#ilk-çalıştırma)
4. [Platform Kullanımı](#platform-kullanımı)
5. [Admin Paneli](#admin-paneli)
6. [Sorun Giderme](#sorun-giderme)

## 📋 Sistem Gereksinimleri

### Yazılım Bilginiz Olmasa Bile Kurabilirsiniz!

Sisteminizde aşağıdakilerin kurulu olması gerekiyor:

1. **Node.js** (v18 veya üzeri)

   - İndirme: https://nodejs.org/
   - Kurulum: İndirdiğiniz dosyayı çalıştırın ve "Next" butonuna basarak ilerleyin

2. **PostgreSQL** (v14 veya üzeri)

   - Mac için: https://postgresapp.com/
   - Windows için: https://www.postgresql.org/download/windows/
   - Kurulum: Varsayılan ayarları kabul edin, şifre olarak "password" yazın

3. **Bir Kod Editörü** (Opsiyonel ama tavsiye edilir)
   - VS Code: https://code.visualstudio.com/

## 🚀 Kurulum Adımları

### Adım 1: Projeyi Açın

Terminal veya Komut İstemi'ni açın:

- **Mac**: Spotlight'ı açın (Cmd+Space), "Terminal" yazın
- **Windows**: Başlat menüsünden "cmd" aratın

Proje klasörüne gidin:

```bash
cd /Users/kaanoba/workspace/sigorta
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut birkaç dakika sürebilir. Bekleyin ve tamamlanmasını izleyin.

### Adım 3: Veritabanını Hazırlayın

#### PostgreSQL'i Başlatın

**Mac (Postgres.app kullanıyorsanız):**

- Postgres.app'i açın
- "Start" butonuna tıklayın

**Windows:**

- PostgreSQL zaten arka planda çalışıyor olmalı

#### Veritabanını Oluşturun

Terminal'de:

```bash
# PostgreSQL'e bağlan (şifre: password)
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE sigorta;

# Çık
\q
```

### Adım 4: Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası zaten oluşturuldu, ama kontrol edin:

```bash
cat .env.local
```

Şu satırları görmelisiniz:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/sigorta"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sigorta-secret-key-change-in-production-12345"
```

Eğer PostgreSQL şifreniz farklıysa, `password` kısmını değiştirin.

### Adım 5: Veritabanı Tablolarını Oluşturun

```bash
npx prisma db push
```

Bu komut tüm tabloları oluşturacak.

### Adım 6: Başlangıç Verilerini Yükleyin

```bash
npm run db:seed
```

Bu komut:

- Admin kullanıcı (admin@sigorta.com / admin123)
- Test kullanıcı (test@example.com / user123)
- 8 sigorta şirketi
  oluşturacak.

## 🎯 İlk Çalıştırma

### Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda şu adresi açın:

```
http://localhost:3000
```

Başarılı! 🎉 Ana sayfa açılmalı.

## 👥 Platform Kullanımı

### Misafir Kullanıcı Olarak

1. Ana sayfada "Trafik Sigortası" kartına tıklayın
2. Formu doldurun (tüm alanlar zorunlu)
3. "Teklif Al" butonuna tıklayın
4. 1-2 dakika içinde fiyatlar gelecek
5. En uygun fiyatı seçin ve "Poliçe Kes" butonuna tıklayın

**Not**: Email adresinizi girin, size sonuç linki gönderilecek.

### Kayıtlı Kullanıcı Olarak

1. Sağ üstten "Kayıt Ol" butonuna tıklayın
2. Bilgilerinizi girin ve kayıt olun
3. Giriş yapın
4. "Panelim" bölümünden:
   - Geçmiş sorgularınızı görün
   - Poliçelerinizi takip edin
   - Yeni teklif alın

## 🔐 Admin Paneli

### Admin Girişi

1. "Giriş Yap" butonuna tıklayın
2. Email: `admin@sigorta.com`
3. Şifre: `admin123`
4. Otomatik olarak admin paneline yönlendirileceksiniz

### Admin Özellikleri (Geliştirilecek)

Admin panelinde şunları yapabileceksiniz:

- Tüm kullanıcıları görüntüleme
- Tüm teklifleri görüntüleme
- Poliçeleri yönetme
- Sigorta şirketlerini aktif/pasif yapma
- İstatistikleri görüntüleme
- Scraper loglarını inceleme

**Not**: Admin paneli şu anda temel seviyede, geliştirilmeye devam ediliyor.

## 🔍 Özellikler

### 1. Fiyat Karşılaştırma

- Formu doldurun
- Sistemimiz aynı anda 3 şirketten fiyat çeker:
  - Sompo Sigorta (API ile)
  - Anadolu Sigorta (Scraping ile)
  - Ak Sigorta (Scraping ile)
- Fiyatlar düşükten yükseğe sıralanır
- Tasarruf miktarını gösterir

### 2. Poliçe Kesme

- Sompo Sigorta için API entegrasyonu var
- Diğer şirketler için manuel işlem
- Ödeme entegrasyonu eklenecek (iyzico)

### 3. Misafir Kullanıcı

- Kayıt olmadan teklif alabilir
- Email ile sonuç linki alır
- Link ile tekrar erişebilir

### 4. Kayıtlı Kullanıcı

- Geçmiş sorguları görebilir
- Poliçelerini takip edebilir
- Daha hızlı işlem yapabilir

## 🛠️ Veritabanı Yönetimi

### Prisma Studio (GUI)

Veritabanını görsel olarak yönetmek için:

```bash
npm run db:studio
```

Tarayıcıda otomatik açılacak. Buradan:

- Kullanıcıları görebilirsiniz
- Teklifleri görebilirsiniz
- Manuel veri ekleyebilirsiniz
- Verileri düzenleyebilirsiniz

### Manuel SQL Sorguları

```bash
# PostgreSQL'e bağlan
psql -U postgres sigorta

# Tüm kullanıcıları listele
SELECT * FROM users;

# Tüm teklifleri listele
SELECT * FROM quotes;

# Çık
\q
```

## 📊 Test Senaryoları

### Senaryo 1: Trafik Sigortası Teklifi

1. Ana sayfadan "Trafik Sigortası"na tıklayın
2. Test verileri:
   - Plaka: 34ABC123
   - Araç Tipi: Otomobil
   - Marka: Toyota
   - Model: Corolla
   - Model Yılı: 2020
   - Motor No: TEST123
   - Şase No: 12345678901234567
   - Sürücü: Ahmet Yılmaz
   - TCKN: 12345678901
   - Doğum Tarihi: 01/01/1990
   - Ehliyet Tarihi: 01/01/2010
3. "Teklif Al" butonuna tıklayın
4. Sonuçları görün

## ⚠️ Sorun Giderme

### Sorun: "Port 3000 already in use"

**Çözüm**:

```bash
# Port'u kullanımdan kaldırın (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Veya farklı port kullanın
PORT=3001 npm run dev
```

### Sorun: "Database connection error"

**Çözüm**:

1. PostgreSQL çalışıyor mu kontrol edin
2. `.env.local` dosyasındaki şifreyi kontrol edin
3. Veritabanı adını kontrol edin

```bash
# PostgreSQL status kontrolü (Mac)
pg_isready

# PostgreSQL'i yeniden başlat
brew services restart postgresql@14
```

### Sorun: "Module not found"

**Çözüm**:

```bash
# node_modules'u sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Sorun: Prisma hataları

**Çözüm**:

```bash
# Prisma'yı sıfırla
npx prisma generate
npx prisma db push
```

## 📞 Destek

Sorun yaşarsanız:

1. **Logları kontrol edin**: Terminal'de hata mesajlarını okuyun
2. **Tarayıcı konsolunu açın**: F12 tuşu -> Console sekmesi
3. **Veritabanını kontrol edin**: `npm run db:studio`
4. **README.md** dosyasını okuyun

## 🎓 Öğrenme Kaynakları

Bu platformda kullanılan teknolojiler:

- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **Prisma**: https://www.prisma.io/docs/getting-started
- **TypeScript**: https://www.typescriptlang.org/docs/

## 🚀 Production'a Alma (Canlıya Alm)

### Vercel ile Deploy (Ücretsiz)

1. GitHub'a proje yükleyin
2. https://vercel.com/ adresine gidin
3. "Import Project" diyerek GitHub reponuzu seçin
4. Environment variables ekleyin
5. Deploy!

### Database (Supabase - Ücretsiz)

1. https://supabase.com/ adresine gidin
2. Yeni proje oluşturun
3. PostgreSQL bilgilerini alın
4. `DATABASE_URL`'i güncelleyin

## ✅ Checklist

Başlamadan önce kontrol edin:

- [ ] Node.js kurulu (v18+)
- [ ] PostgreSQL kurulu ve çalışıyor
- [ ] Proje klasöründeyim
- [ ] `npm install` çalıştırdım
- [ ] Veritabanı oluşturuldu
- [ ] `.env.local` dosyası var
- [ ] `npx prisma db push` çalıştırdım
- [ ] `npm run db:seed` çalıştırdım
- [ ] `npm run dev` ile server başladı
- [ ] http://localhost:3000 açıldı

Hepsi tamamsa, hazırsınız! 🎉

---

**İyi Kullanımlar!** 💼
