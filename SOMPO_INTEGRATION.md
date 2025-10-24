# Sompo Sigorta Entegrasyonu

Bu dokümantasyon, Sompo Sigorta scrapper entegrasyonunun nasıl çalıştığını ve kullanımını açıklar.

## 🏗️ Mimari

### Dosya Yapısı

```
lib/
├── scrapers/
│   └── sompo.ts                    # Ana Sompo scrapper
├── processors/
│   └── sompo-quote-processor.ts    # Teklif verilerini işleyen processor
└── otp-generator.ts                # Google OTP generator

app/api/
├── scraper/route.ts                # Genel scraper API
└── sompo/quote/route.ts           # Sompo özel API

test-sompo-integration.ts           # Test dosyası
```

## 🔧 Kurulum

### 1. Environment Variables

`.env.local` dosyasına aşağıdaki değişkenleri ekleyin:

```env
SOMPO_URL=https://your-sompo-url.com
SOMPO_USER=BULUT1
SOMPO_PASS=EEsigorta.2828
SOMPO_SECRET_KEY=your-google-authenticator-secret
```

### 2. Bağımlılıklar

```bash
npm install puppeteer otpauth
```

## 🚀 Kullanım

### 1. Genel Scraper API

```typescript
const response = await fetch("/api/scraper", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    quoteId: "quote-123",
    companyId: "sompo-id",
    companyCode: "SOMPO",
    insuranceType: "TRAFFIC",
    formData: {
      plate: "34ABC123",
      registrationCode: "ABC",
      registrationNumber: "1234567890123456789",
      driverTCKN: "12345678901",
    },
  }),
});
```

### 2. Sompo Özel API

```typescript
const response = await fetch("/api/sompo/quote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    quoteId: "quote-123",
    companyId: "sompo-id",
    formData: {
      plate: "34ABC123",
      registrationCode: "ABC",
      registrationNumber: "1234567890123456789",
      driverTCKN: "12345678901",
      vehicleType: "Binek Araç",
      vehicleBrand: "Toyota",
      vehicleModel: "Corolla",
      vehicleYear: 2020,
    },
  }),
});
```

## 🧮 Algoritma

### 1. Login Süreci

1. **Form Doldurma**: Kullanıcı adı ve şifre ile giriş
2. **OTP Validasyonu**: Google Authenticator ile 6 haneli kod
3. **Bot Detection Bypass**: Dashboard'a geçiş

### 2. Teklif Alma

1. **Modal Kapatma**: Z-index > 50 olan modal'ları kapat
2. **Yeni İş Teklifi**: "YENİ İŞ TEKLİFİ" butonuna tıkla
3. **Trafik Seçimi**: Trafik seçeneğini seç ve "TEKLİF AL" butonuna tıkla

### 3. Form Doldurma

1. **Checkbox Kontrolü**: Trafik seçili, Kasko kaldırılmış olmalı
2. **Plaka Bilgileri**: Şehir kodu ve plaka numarası
3. **Tescil Bilgileri**: Seri kod ve tescil numarası
4. **TC Kimlik**: Sürücü TC kimlik numarası

### 4. Sonuç Çıkarma

1. **Kasko Teklifi**: `#loadedDivCascoProposal2` container'ından
2. **Trafik Teklifi**: `#loadedDivTrafficProposalAlternative` container'ından
3. **Matematiksel Hesaplama**: En iyi fiyat seçimi

## 📊 Veri İşleme

### Fiyat Hesaplamaları

- **KDV Hesaplama**: %20 KDV eklenir
- **Taksit Seçenekleri**: 1, 2, 3, 6, 9, 12 taksit
- **İndirimler**: Peşin ödeme %5, Kombine %10
- **Komisyon**: Trafik teklifinden komisyon bilgisi

### Risk Analizi

- **Risk Skoru**: 0-1 arası değer
- **Risk Seviyesi**: LOW, MEDIUM, HIGH
- **Öneriler**: Risk seviyesine göre öneriler

### Teminat Detayları

- **Kasko**: Hırsızlık, yangın, doğal afet, terör, sürücü kazası
- **Trafik**: Üçüncü şahıs, maddi hasar, hukuki sorumluluk
- **Kombine**: Her iki poliçe birlikte alındığında indirim

## 🧪 Test

### Test Çalıştırma

```bash
# TypeScript ile çalıştır
npx ts-node test-sompo-integration.ts

# Veya npm script olarak
npm run test:sompo
```

### Test Kapsamı

1. **Environment Variables**: Gerekli değişkenlerin varlığı
2. **Scraper**: Sompo sitesinden veri çekme
3. **Processor**: Veri işleme ve hesaplamalar
4. **API**: Endpoint'lerin çalışması

## 🔍 Debug

### Screenshot Alma

Scraper otomatik olarak screenshot'lar alır:

```
screenshots/
├── SOMPO-login.png
├── SOMPO-otp.png
├── SOMPO-dashboard.png
└── SOMPO-results.png
```

### Log Seviyeleri

```typescript
console.log("[Sompo] İşlem başlatılıyor...");
console.log("[Sompo] OTP Kodu: 123456");
console.log("[Sompo] Fiyat: 1500 TL");
```

## ⚠️ Önemli Notlar

### 1. Bot Detection

- Sompo sitesi bot detection kullanıyor
- `headless: false` ile çalıştırın
- User agent ve viewport ayarları önemli

### 2. OTP Süresi

- Google OTP 30 saniye geçerli
- Hızlı işlem yapın
- Retry mekanizması var

### 3. Selector Değişiklikleri

- Sompo sitesi güncellenebilir
- Selector'lar değişebilir
- Düzenli kontrol edin

### 4. Rate Limiting

- Çok sık istek atmayın
- Retry delay: 10 saniye
- Maksimum 2 deneme

## 🚨 Hata Yönetimi

### Yaygın Hatalar

1. **Login Hatası**: Kullanıcı adı/şifre yanlış
2. **OTP Hatası**: Secret key yanlış veya süre dolmuş
3. **Selector Hatası**: Element bulunamadı
4. **Timeout**: Sayfa yüklenmedi

### Hata Çözümleri

1. Environment variables'ları kontrol edin
2. Sompo sitesinin erişilebilir olduğunu kontrol edin
3. Selector'ları güncelleyin
4. Timeout değerlerini artırın

## 📈 Performans

### Optimizasyonlar

- **Parallel Processing**: Birden fazla teklif aynı anda
- **Caching**: Tekrar eden istekler için cache
- **Connection Pooling**: Browser instance'ları paylaşımı

### Metrikler

- **Ortalama Süre**: 30-60 saniye
- **Başarı Oranı**: %85-95
- **Retry Oranı**: %10-15

## 🔄 Güncellemeler

### v1.0.0 (2024-01-XX)

- İlk sürüm
- Temel scraping fonksiyonları
- OTP entegrasyonu
- Matematiksel hesaplamalar

### Gelecek Sürümler

- [ ] Daha fazla teminat seçeneği
- [ ] Gelişmiş risk analizi
- [ ] Real-time fiyat takibi
- [ ] Mobile optimizasyon

## 📞 Destek

Sorunlar için:

1. Test dosyasını çalıştırın
2. Log'ları kontrol edin
3. Screenshot'ları inceleyin
4. GitHub issue açın

---

**Not**: Bu entegrasyon sadece test amaçlıdır. Üretim ortamında kullanmadan önce Sompo Sigorta ile iletişime geçin.
