import { customAlphabet } from "nanoid";

// Referans kodu için özel alphabet (karışıklığı önlemek için 0, O, I, l gibi karakterler çıkarıldı)
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 8);

/**
 * Benzersiz referans kodu oluşturur
 * Format: REF-XXXXXXXX (örn: REF-A3B7N9K2)
 */
export function generateReferralCode(): string {
  return `REF-${nanoid()}`;
}

/**
 * Referans kodunun formatını kontrol eder
 */
export function isValidReferralCodeFormat(code: string): boolean {
  const pattern = /^REF-[123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
  return pattern.test(code);
}

/**
 * Referans URL'si oluşturur
 */
export function generateReferralUrl(
  referralCode: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
): string {
  return `${baseUrl}/auth/register?ref=${referralCode}`;
}
