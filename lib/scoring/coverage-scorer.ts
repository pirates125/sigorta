/**
 * Kapsam Skorlayıcı
 * Teminat detaylarını ve kapsamı değerlendirir
 */

export interface CoverageScorerInput {
  coverageDetails?: any;
  companyId: string;
  companyCoverageScore?: number | null;
}

export function calculateCoverageScore(input: CoverageScorerInput): number {
  const { coverageDetails, companyCoverageScore } = input;

  // Eğer şirketin genel kapsam skoru varsa, onu kullan (0-100 arası)
  if (companyCoverageScore !== null && companyCoverageScore !== undefined) {
    // coverageScore zaten 0-100 arası, direkt kullan
    return Math.min(100, Math.round(Number(companyCoverageScore)));
  }

  // Eğer coverageDetails varsa, onu analiz et
  if (coverageDetails && typeof coverageDetails === "object") {
    let score = 50; // Başlangıç puanı

    // Temel teminatlar kontrolü
    const hasBasicCoverage = Object.keys(coverageDetails).length > 0;
    if (hasBasicCoverage) score += 20;

    // Limit kontrolü (yüksek limit = yüksek skor)
    if (coverageDetails.limit) {
      const limit = Number(coverageDetails.limit);
      if (limit >= 1000000) score += 30;
      else if (limit >= 500000) score += 20;
      else if (limit >= 100000) score += 10;
    }

    return Math.min(100, Math.round(score));
  }

  // Hiçbir veri yoksa ortalama skor ver
  return 50;
}
