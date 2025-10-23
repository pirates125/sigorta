/**
 * Sompo OTP Test Script
 *
 * Bu script Sompo OTP'nin doğru üretilip üretilmediğini test eder.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateSompoOTP, getOTPRemainingTime } from "./lib/otp-generator";

console.log("🔐 Sompo OTP Test\n");
console.log(
  "SECRET_KEY:",
  process.env.SOMPO_SECRET_KEY ? "✅ Bulundu" : "❌ Bulunamadı"
);
console.log("");

if (!process.env.SOMPO_SECRET_KEY) {
  console.error(
    "❌ SOMPO_SECRET_KEY bulunamadı! .env.local dosyasını kontrol edin."
  );
  process.exit(1);
}

try {
  // İlk OTP üret
  console.log("📱 İlk OTP üretiliyor...");
  const otp1 = generateSompoOTP();
  console.log(`   OTP: ${otp1}`);
  console.log(`   Kalan süre: ${getOTPRemainingTime()} saniye`);
  console.log("");

  // OTP'nin 6 haneli olduğunu kontrol et
  if (otp1.length !== 6) {
    throw new Error("OTP 6 haneli değil!");
  }

  // OTP'nin sadece rakamlardan oluştuğunu kontrol et
  if (!/^\d{6}$/.test(otp1)) {
    throw new Error("OTP sadece rakamlardan oluşmalı!");
  }

  console.log("✅ OTP formatı doğru!");
  console.log("");

  // 30 saniye boyunca OTP'leri göster
  console.log("📊 OTP değişimini izliyoruz (30 saniye)...");
  console.log("");

  let lastOtp = otp1;
  let changeCount = 0;

  const interval = setInterval(() => {
    const currentOtp = generateSompoOTP();
    const remaining = getOTPRemainingTime();

    if (currentOtp !== lastOtp) {
      changeCount++;
      console.log(`🔄 OTP değişti! (${changeCount}. değişim)`);
      lastOtp = currentOtp;
    }

    console.log(`   Mevcut OTP: ${currentOtp} | Kalan: ${remaining}s`);
  }, 2000);

  // 35 saniye sonra durdur
  setTimeout(() => {
    clearInterval(interval);
    console.log("");
    console.log("✅ Test tamamlandı!");
    console.log(`   Toplam ${changeCount} kez OTP değişti.`);
    console.log("");
    console.log("💡 Bu OTP kodunu Sompo girişinde kullanabilirsiniz.");
    process.exit(0);
  }, 35000);
} catch (error: any) {
  console.error("❌ Hata:", error.message);
  process.exit(1);
}
