import { TOTP } from "otpauth";

/**
 * Sompo Sigorta için Google Authenticator OTP kodu üret
 */
export function generateSompoOTP(): string {
  const secret = process.env.SOMPO_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "SOMPO_SECRET_KEY environment variable is required! .env.local dosyasına ekleyin."
    );
  }

  const totp = new TOTP({
    issuer: "Sompo Sigorta",
    label: "BULUT1",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });

  const code = totp.generate();
  console.log(`🔑 OTP Üretildi: ${code} (30 saniye geçerli)`);

  return code;
}

/**
 * OTP'nin kalan süresini göster
 */
export function getOTPRemainingTime(): number {
  const now = Math.floor(Date.now() / 1000);
  const period = 30;
  const remaining = period - (now % period);
  return remaining;
}
