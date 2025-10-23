/**
 * Fiyat Skorlayıcı
 * En ucuz fiyat 100 puan alır, diğerleri oransal olarak düşer
 */

export interface PriceScorerInput {
  price: number;
  allPrices: number[];
}

export function calculatePriceScore(input: PriceScorerInput): number {
  const { price, allPrices } = input;

  if (allPrices.length === 0) return 0;

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Eğer tüm fiyatlar aynıysa, hepsine 100 puan ver
  if (minPrice === maxPrice) return 100;

  // En ucuz = 100, en pahalı = 0, diğerleri aralarında
  // Ters oran kullan: düşük fiyat = yüksek skor
  const score = ((maxPrice - price) / (maxPrice - minPrice)) * 100;

  return Math.round(score);
}
