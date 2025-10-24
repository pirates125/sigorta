/**
 * Sompo Sigorta Entegrasyon Test Dosyası
 *
 * Bu dosya Sompo scrapper'ının doğru çalışıp çalışmadığını test eder.
 * Test çalıştırmadan önce .env dosyasında gerekli değişkenlerin tanımlı olduğundan emin olun.
 */

const { SompoScraper } = require("./lib/scrapers/sompo");
const {
  SompoQuoteProcessor,
} = require("./lib/processors/sompo-quote-processor");

// Test verileri
const testFormData = {
  plate: "34ABC123",
  registrationCode: "ABC",
  registrationNumber: "1234567890123456789",
  driverTCKN: "12345678901",
  vehicleType: "Binek Araç",
  vehicleBrand: "Toyota",
  vehicleModel: "Corolla",
  vehicleYear: 2020,
  driverName: "Test Kullanıcı",
  driverBirthDate: "1990-01-01",
  driverLicenseDate: "2010-01-01",
  email: "test@example.com",
  phone: "05551234567",
};

/**
 * Sompo Scraper Test
 */
async function testSompoScraper() {
  console.log("🧪 Sompo Scraper Test Başlatılıyor...");

  try {
    const scraper = new SompoScraper();

    console.log("📋 Test verileri:");
    console.log(JSON.stringify(testFormData, null, 2));

    console.log("🚀 Scraping işlemi başlatılıyor...");
    const startTime = Date.now();

    const result = await scraper.run("TRAFFIC", testFormData);

    const duration = Date.now() - startTime;
    console.log(`⏱️  İşlem süresi: ${duration}ms`);

    if (result.success) {
      console.log("✅ Scraping başarılı!");
      console.log(`💰 Fiyat: ${result.price} ${result.currency}`);
      console.log(`🏢 Şirket: ${result.companyName}`);

      if (result.coverageDetails) {
        console.log("📊 Teminat detayları:");
        console.log(JSON.stringify(result.coverageDetails, null, 2));
      }

      return result;
    } else {
      console.log("❌ Scraping başarısız!");
      console.log(`🚨 Hata: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error("💥 Test hatası:", error.message);
    return null;
  }
}

/**
 * Sompo Quote Processor Test
 */
async function testSompoQuoteProcessor(rawResult) {
  if (!rawResult) {
    console.log("⚠️  Ham sonuç yok, processor testi atlanıyor...");
    return;
  }

  console.log("\n🧮 Sompo Quote Processor Test Başlatılıyor...");

  try {
    const processedResult = SompoQuoteProcessor.processQuoteResult(rawResult);

    console.log("✅ İşleme başarılı!");
    console.log("\n📈 Fiyat Hesaplamaları:");
    console.log(
      `   Kasko Brüt Prim: ${processedResult.pricing.casco.grossPremium} TL`
    );
    console.log(
      `   Trafik Brüt Prim: ${processedResult.pricing.traffic.grossPremium} TL`
    );
    console.log(
      `   Toplam Brüt Prim: ${processedResult.pricing.combined.grossPremium} TL`
    );
    console.log(
      `   KDV Tutarı: ${processedResult.pricing.combined.kdvAmount} TL`
    );
    console.log(
      `   Toplam (KDV Dahil): ${processedResult.pricing.combined.totalWithTax} TL`
    );

    console.log("\n💸 Taksit Seçenekleri:");
    processedResult.pricing.installmentOptions.forEach((option, index) => {
      console.log(
        `   ${option.installmentCount} Taksit: ${option.monthlyAmount} TL/ay (Toplam: ${option.totalAmount} TL)`
      );
    });

    console.log("\n🎯 Tasarruf Bilgileri:");
    console.log(
      `   Kombine İndirim: ${
        processedResult.pricing.savings.combinedDiscount.amount
      } TL (%${processedResult.pricing.savings.combinedDiscount.rate * 100})`
    );
    console.log(
      `   Peşin İndirim: ${
        processedResult.pricing.savings.cashDiscount.amount
      } TL (%${processedResult.pricing.savings.cashDiscount.rate * 100})`
    );
    console.log(
      `   Maksimum Tasarruf: ${
        processedResult.pricing.savings.maxSavings.amount
      } TL (%${processedResult.pricing.savings.maxSavings.rate * 100})`
    );

    console.log("\n⚠️  Risk Analizi:");
    console.log(`   Risk Skoru: ${processedResult.riskAnalysis.riskScore}`);
    console.log(`   Risk Seviyesi: ${processedResult.riskAnalysis.riskLevel}`);
    if (processedResult.riskAnalysis.recommendations.length > 0) {
      console.log("   Öneriler:");
      processedResult.riskAnalysis.recommendations.forEach((rec) => {
        console.log(`     - ${rec}`);
      });
    }

    console.log("\n💼 Komisyon Bilgileri:");
    console.log(`   Brüt Prim: ${processedResult.commission.grossPremium} TL`);
    console.log(
      `   Komisyon Tutarı: ${processedResult.commission.commissionAmount} TL`
    );
    console.log(
      `   Komisyon Oranı: %${processedResult.commission.commissionRate * 100}`
    );
    console.log(`   Net Prim: ${processedResult.commission.netPremium} TL`);

    return processedResult;
  } catch (error) {
    console.error("💥 Processor test hatası:", error.message);
    return null;
  }
}

/**
 * Environment Variables Test
 */
function testEnvironmentVariables() {
  console.log("🔧 Environment Variables Test...");

  const requiredVars = [
    "SOMPO_URL",
    "SOMPO_USER",
    "SOMPO_PASS",
    "SOMPO_SECRET_KEY",
  ];

  const missingVars = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      console.log(
        `✅ ${varName}: ${process.env[varName]?.substring(0, 10)}...`
      );
    }
  });

  if (missingVars.length > 0) {
    console.log("❌ Eksik environment variables:");
    missingVars.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
    console.log("\n📝 .env dosyasına şu değişkenleri ekleyin:");
    console.log("SOMPO_URL=https://your-sompo-url.com");
    console.log("SOMPO_USER=BULUT1");
    console.log("SOMPO_PASS=EEsigorta.2828");
    console.log("SOMPO_SECRET_KEY=your-secret-key");
    return false;
  }

  console.log("✅ Tüm environment variables mevcut!");
  return true;
}

/**
 * Ana Test Fonksiyonu
 */
async function runTests() {
  console.log("🚀 Sompo Sigorta Entegrasyon Testleri Başlatılıyor...\n");

  // 1. Environment variables testi
  const envTest = testEnvironmentVariables();
  if (!envTest) {
    console.log(
      "\n❌ Environment variables testi başarısız. Testler durduruluyor."
    );
    return;
  }

  console.log("\n" + "=".repeat(50));

  // 2. Scraper testi
  const rawResult = await testSompoScraper();

  console.log("\n" + "=".repeat(50));

  // 3. Processor testi
  await testSompoQuoteProcessor(rawResult);

  console.log("\n" + "=".repeat(50));
  console.log("🏁 Testler tamamlandı!");
}

// Test çalıştır
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testSompoScraper,
  testSompoQuoteProcessor,
  testEnvironmentVariables,
};
