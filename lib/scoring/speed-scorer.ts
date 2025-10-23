/**
 * Hız Skorlayıcı
 * Şirketin ortalama yanıt süresini değerlendirir
 */

export interface SpeedScorerInput {
  avgResponseTime?: number | null; // milliseconds
  companyId: string;
}

export function calculateSpeedScore(input: SpeedScorerInput): number {
  const { avgResponseTime } = input;

  // Eğer response time yoksa ortalama skor ver
  if (avgResponseTime === null || avgResponseTime === undefined) {
    return 50;
  }

  const timeMs = Number(avgResponseTime);

  // Hız metrikleri (milliseconds)
  // < 1000ms = Excellent (100 puan)
  // 1000-2000ms = Good (80 puan)
  // 2000-3000ms = Average (60 puan)
  // 3000-5000ms = Slow (40 puan)
  // > 5000ms = Very Slow (20 puan)

  if (timeMs < 1000) return 100;
  if (timeMs < 2000) return 80;
  if (timeMs < 3000) return 60;
  if (timeMs < 5000) return 40;
  return 20;
}
