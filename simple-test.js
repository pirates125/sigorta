/**
 * Basit Sompo Test
 */

// Environment variables testi
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
    console.log("\n📝 Environment variables'ları set edin:");
    console.log("export SOMPO_URL='https://your-sompo-url.com'");
    console.log("export SOMPO_USER='BULUT1'");
    console.log("export SOMPO_PASS='EEsigorta.2828'");
    console.log("export SOMPO_SECRET_KEY='your-secret-key'");
    return false;
  }

  console.log("✅ Tüm environment variables mevcut!");
  return true;
}

// Test çalıştır
console.log("🚀 Sompo Sigorta Basit Test Başlatılıyor...\n");

const envTest = testEnvironmentVariables();

if (envTest) {
  console.log("\n✅ Environment variables testi başarılı!");
  console.log("🎉 Sompo entegrasyonu için gerekli değişkenler mevcut.");
  console.log("\n📋 Sonraki adımlar:");
  console.log("1. Gerçek Sompo URL'ini SOMPO_URL'e ekleyin");
  console.log(
    "2. Gerçek Google Authenticator secret'ını SOMPO_SECRET_KEY'e ekleyin"
  );
  console.log("3. Next.js uygulamasını çalıştırın: npm run dev");
  console.log("4. API endpoint'lerini test edin: /api/sompo/quote");
} else {
  console.log("\n❌ Environment variables testi başarısız!");
  console.log("Lütfen gerekli değişkenleri set edin ve tekrar deneyin.");
}
