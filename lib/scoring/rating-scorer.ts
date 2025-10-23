/**
 * Şirket Puanı Skorlayıcı
 * Şirketin genel rating'ini ve kullanıcı değerlendirmelerini hesaba katar
 */

export interface RatingScorerInput {
  companyRating?: number | null;
  companyId: string;
}

export function calculateRatingScore(input: RatingScorerInput): number {
  const { companyRating } = input;

  // Eğer şirket rating'i varsa (0-5 arası)
  if (companyRating !== null && companyRating !== undefined) {
    // 5 üzerinden skoru 100 üzerinden skora çevir
    return Math.round((Number(companyRating) / 5) * 100);
  }

  // Hiçbir rating yoksa ortalama skor ver
  return 50;
}
