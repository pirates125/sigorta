# 🔧 Sompo Sigorta Web Scraping Entegrasyonu

Bu döküman Sompo Sigorta'dan gerçek teklif almak için web scraping entegrasyonunu açıklar.

## 📋 Genel Bakış

Sompo için **web scraping** kullanıyoruz (API değil). Puppeteer ile:

1. Login yapıyoruz
2. Dashboard'a gidiyoruz
3. Cosmos teklif formuna yönleniyoruz
4. Formu dolduruyoruz
5. Teklifi alıp parse ediyoruz

## 🔐 Credentials Ayarlama

`.env` dosyanıza Sompo bilgilerinizi ekleyin:

```env
SOMPO_URL="https://ejento.somposigorta.com.tr/dashboard/login"
SOMPO_USER="your-username"
SOMPO_PASS="your-password"
SOMPO_SECRET_KEY="your-google-authenticator-secret"  # OTP için gerekli!
```

### ⚠️ SOMPO_SECRET_KEY Nedir?

Sompo Sigorta giriş yaparken **Google Authenticator** ile 2FA (OTP) kullanıyor. Bu secret key, OTP kodunu otomatik üretmek için gereklidir.

**Secret Key'i Nasıl Bulursunuz?**

1. Sompo hesabınızda Google Authenticator aktif edildiğinde size bir QR kod verilir
2. QR kod yerine "Manual Entry" seçeneğini kullanarak secret key'i görebilirsiniz
3. Bu key genellikle 16-32 karakterlik bir string'dir (örn: `JBSWY3DPEHPK3PXP`)

**Test Etmek İçin**:

```bash
npm run test-sompo-otp
```

Bu script OTP'nin doğru üretildiğini ve her 30 saniyede değiştiğini gösterir.

## 🚀 Nasıl Çalışır?

### 1. Login Süreci (`lib/sompo-client.ts:login()`)

```typescript
// Selector'lar (login.md'den)
- Kullanıcı Adı: input[placeholder="Kullanıcı Adı"]
- Parola: input[placeholder="Parola"]
- Giriş Yap: button[type="submit"]
```

**Login URL**: `https://ejento.somposigorta.com.tr/dashboard/login`

### 2. OTP Doğrulama (Google Authenticator)

Login sonrası Sompo sizi OTP sayfasına yönlendirir:

**OTP URL**: `https://ejento.somposigorta.com.tr/dashboard/google-authenticator-validation`

```typescript
// OTP Selector'ları (otp.md'den)
.p-inputotp-input  // 6 adet input (her biri 1 hane için)
```

**Otomatik OTP Üretimi**:

```typescript
import { generateSompoOTP } from "./otp-generator";

// OTP sayfası kontrolü
if (currentUrl.includes("google-authenticator-validation")) {
  const otp = generateSompoOTP(); // "123456" gibi 6 haneli kod
  const otpInputs = await page.$$(".p-inputotp-input");
  const digits = otp.split("");

  for (let i = 0; i < 6; i++) {
    await otpInputs[i].type(digits[i]);
  }
}
```

OTP kodu **30 saniye geçerlidir** ve `SOMPO_SECRET_KEY` ile otomatik üretilir.

### 3. Cosmos URL Alma (`lib/sompo-client.ts`)

Dashboard'da Cosmos linkini bulur:

```typescript
// Dashboard'da trafik sigortası linki
a[(href *= "cosmos.sompojapan.com.tr")];
```

**NOT**: Traffic-form.md'deki URL çok uzun bir GUID içeriyor. Bu GUID session bazlı olabilir. Dashboard'dan dinamik olarak almamız gerekiyor.

### 4. Teklif Formu Doldurma (`lib/sompo-client.ts:getTrafficQuote()`)

```typescript
// Form Selector'ları (traffic-form.md'den)
#txtIdentityOrTaxNo; // TC Kimlik No
#txtPlateNoCityNo; // Plaka il kodu (örn: 34)
#txtPlateNo; // Plaka numarası (örn: ABC123)
#chkTraffic; // Trafik checkbox
#btnSearchEgm; // EGM Sorgula (araç bilgileri)
#rblInsuredContactType_0; // Cep telefonu radio
#txtInsuredGsmAreaCode; // Tel alan kodu (5XX)
#txtInsuredGsmNumber; // Tel numarası (1234567)
#btnProposalCreate; // Teklif Oluştur butonu
```

### 5. Teklif Sonucu Parse Etme

```typescript
// Sonuç Selector'ları
#loadedDivTrafficProposal; // Teklif div'i (görününce hazır)
#lblTrafficProposalGrossPremium; // Brüt Prim (örn: "1.234,56 TL")
#lblTrafficProposalStartEndDateOrProposalNo; // Teklif No
#lblTrafficProposalComissionAmount; // Komisyon Tutarı
```

## 🧪 Test Etme

### OTP Test

```bash
# OTP üretimini test et
npm run test-sompo-otp
```

Bu script:

- `SOMPO_SECRET_KEY`'in tanımlı olup olmadığını kontrol eder
- 6 haneli OTP kodu üretir
- 30 saniye boyunca OTP değişimini gösterir

### Manuel Test

```bash
# Development server başlat
npm run dev

# Tarayıcıda http://localhost:3000/trafik adresine git
# Formu doldur ve "Teklif Al" butonuna tıkla
# Sompo'dan teklif gelip gelmediğini kontrol et
```

### Debug Modu

`lib/sompo-client.ts` dosyasında debug etmek için:

```typescript
// Headless mode'u kapat (tarayıcıyı görmek için)
this.browser = await puppeteer.launch({
  headless: false, // false yap
  args: [...],
});

// Screenshot al
await this.page.screenshot({ path: 'debug-step1.png' });
```

### Konsol Logları

Scraping sırasında konsolda şunları göreceksiniz:

```
🔐 Sompo'ya giriş yapılıyor...
✅ Sompo'ya giriş başarılı
🚗 Trafik sigortası teklifi alınıyor...
✅ Sompo teklifi alındı: 1234.56 TL
```

## 🔍 Selector Bulma Rehberi

Eğer Sompo sitesi değişirse selector'ları güncellemeniz gerekebilir:

### 1. Chrome DevTools Kullanın

```bash
1. Sompo sitesine gidin
2. F12 ile DevTools'u açın
3. Elements sekmesine geçin
4. Ctrl+Shift+C ile element seçici aktif edin
5. İstediğiniz elemente tıklayın
6. HTML'de seçilir, ID veya class'ını kopyalayın
```

### 2. Ortak Selector Sorunları

**Problem**: Selector bulunamıyor

```typescript
// Hata
Error: Waiting for selector '#txtIdentityOrTaxNo' failed

// Çözüm 1: Timeout artır
await this.page.waitForSelector('#txtIdentityOrTaxNo', {
  timeout: 30000 // 30 saniye
});

// Çözüm 2: Alternatif selector kullan
await this.page.waitForSelector('input[id="txtIdentityOrTaxNo"]');
```

**Problem**: Element tıklanamıyor

```typescript
// Çözüm 1: Önce görünür olmasını bekle
await this.page.waitForSelector("#btnProposalCreate", { visible: true });
await this.page.click("#btnProposalCreate");

// Çözüm 2: JavaScript ile tıkla
await this.page.evaluate(() => {
  document.querySelector("#btnProposalCreate").click();
});
```

### 3. OTP ile İlgili Sorunlar

**Problem**: `SOMPO_SECRET_KEY` bulunamadı

```bash
Error: SOMPO_SECRET_KEY environment variable is required!
```

**Çözümler**:

- `.env` veya `.env.local` dosyasında `SOMPO_SECRET_KEY` tanımlı mı kontrol edin
- Google Authenticator secret key'inizi doğru girdiğinizden emin olun
- Secret key genellikle Base32 formatındadır (örn: `JBSWY3DPEHPK3PXP`)

**Problem**: OTP yanlış veya süresi dolmuş

```typescript
// Çözüm: Yeni OTP üret ve tekrar dene
const otp = generateSompoOTP();
console.log(`Yeni OTP: ${otp}, Kalan süre: ${getOTPRemainingTime()}s`);
```

**Problem**: OTP input'ları bulunamıyor

```typescript
// Hata
Error: Cannot type into OTP inputs

// Çözüm: Selector ve bekleme süresini kontrol et
await this.page.waitForSelector(".p-inputotp-input", {
  visible: true,
  timeout: 10000
});
const otpInputs = await this.page.$$(".p-inputotp-input");
console.log(`${otpInputs.length} OTP input bulundu`); // 6 olmalı
```

**Problem**: OTP girildikten sonra yönlenmiyor

```typescript
// Çözüm: Navigation'ı bekle
await this.page.waitForNavigation({
  waitUntil: "networkidle2",
  timeout: 20000,
});
```

## ⚡ Performance İyileştirmeleri

### 1. Browser Instance Yeniden Kullanma

Şu anda her teklif için yeni browser açılıyor. Optimize etmek için:

```typescript
// Singleton pattern kullan
private static browserInstance: Browser | null = null;

private async initialize(): Promise<void> {
  if (SompoAPI.browserInstance) {
    this.browser = SompoAPI.browserInstance;
    return;
  }
  // Browser oluştur...
  SompoAPI.browserInstance = this.browser;
}
```

### 2. Timeout'ları Optimize Et

```typescript
// Çok uzun bekleme yerine
await this.page.waitForTimeout(5000); // ❌

// Specific selector bekle
await this.page.waitForSelector("#element", { timeout: 5000 }); // ✅
```

### 3. Paralel İşlem

Birden fazla şirketten teklif alırken:

```typescript
// Seri değil
const sompo = await sompoScraper.run(); // ❌
const anadolu = await anadoluScraper.run();

// Paralel
const [sompo, anadolu] = await Promise.all([
  // ✅
  sompoScraper.run(),
  anadoluScraper.run(),
]);
```

## 🐛 Yaygın Hatalar ve Çözümleri

### 1. Login Başarısız

**Hata**: "Kullanıcı adı veya şifre hatalı"

**Çözümler**:

- `.env` dosyasındaki credential'ları kontrol edin
- Sompo hesabınızın aktif olduğundan emin olun
- Manuel olarak giriş yapıp test edin

### 2. Timeout Hataları

**Hata**: "Navigation timeout exceeded"

**Çözümler**:

```typescript
// Timeout artır
await this.page.goto(url, {
  waitUntil: "networkidle2",
  timeout: 60000, // 60 saniye
});
```

### 3. Element Bulunamadı

**Hata**: "Node is not visible"

**Çözümler**:

```typescript
// Scroll yapıp görünür hale getir
await this.page.evaluate(() => {
  document.querySelector("#element")?.scrollIntoView();
});

// Sonra tıkla
await this.page.click("#element");
```

### 4. CAPTCHA / Bot Koruması

Eğer Sompo CAPTCHA gösterirse:

```typescript
// User-Agent güncelle
await this.page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"
);

// Ekstra header'lar
await this.page.setExtraHTTPHeaders({
  "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
});

// Mouse hareketleri simüle et
await this.page.mouse.move(100, 200);
await this.page.mouse.move(300, 400);
```

## 📊 Monitoring & Logging

### Scraper Logları

```typescript
// lib/sompo-api.ts içinde
console.log('🔐 Sompo'ya giriş yapılıyor...');
console.log('✅ Sompo'ya giriş başarılı');
console.log('🚗 Trafik sigortası teklifi alınıyor...');
console.log(`✅ Sompo teklifi alındı: ${price} TL`);
```

### Database'de Loglama

```typescript
// Scraper istatistiklerini kaydet
await prisma.scraperLog.create({
  data: {
    companyId: sompoCompany.id,
    insuranceType: "TRAFFIC",
    status: "SUCCESS",
    duration: Date.now() - startTime,
    metadata: { price, quoteNo },
  },
});
```

## 🔒 Güvenlik

### 1. Credentials Güvenliği

```bash
# ❌ YAPMAYIN
SOMPO_USER="username" # Kodda hardcode
SOMPO_PASS="password"

# ✅ YAPIN
# .env dosyasında saklayın
# .gitignore'a ekleyin
# Production'da environment variables kullanın
```

### 2. Rate Limiting

```typescript
// Çok sık istek atmayın
const RATE_LIMIT = 10; // Saatte 10 teklif
const lastRequest = Date.now();

if (Date.now() - lastRequest < 360000) {
  // 6 dakika
  throw new Error("Rate limit exceeded");
}
```

## 🎯 Production Checklist

- [ ] `.env` dosyasında gerçek Sompo credential'ları var
- [ ] Timeout'lar production için optimize edildi
- [ ] Error handling tüm adımlarda mevcut
- [ ] Scraper logları aktif
- [ ] Browser instance düzgün temizleniyor
- [ ] Rate limiting aktif
- [ ] Screenshot/debug modları kapalı
- [ ] Headless mode aktif (`headless: true`)
- [ ] Memory leak yok (browser cleanup)

## 📚 Ek Kaynaklar

- [Puppeteer Documentation](https://pptr.dev/)
- [Selector Strategies](https://pptr.dev/#?product=Puppeteer&version=v21.0.0&show=api-pageselector)
- [Debugging Tips](https://pptr.dev/#?product=Puppeteer&version=v21.0.0&show=api-pagescreenshotoptions)

## 🤝 Destek

Sompo entegrasyonunda sorun yaşarsanız:

1. Konsol loglarını kontrol edin
2. Debug mode ile manuel test edin
3. Screenshot'larla adım adım takip edin
4. Selector'ların güncel olduğundan emin olun

---

**Not**: Sompo sitesi her güncellendiğinde selector'ları kontrol etmeniz gerekebilir.
