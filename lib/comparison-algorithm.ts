/**
 * Akıllı Karşılaştırma Algoritması
 * Fiyat, Kapsam, Rating ve Hız metriklerini birleştirerek skor hesaplar
 */

import { calculatePriceScore } from "./scoring/price-scorer";
import { calculateCoverageScore } from "./scoring/coverage-scorer";
import { calculateRatingScore } from "./scoring/rating-scorer";
import { calculateSpeedScore } from "./scoring/speed-scorer";

// Ağırlıklar (toplam 100%)
export const WEIGHTS = {
  price: 0.4, // %40
  coverage: 0.3, // %30
  rating: 0.2, // %20
  speed: 0.1, // %10
} as const;

export interface QuoteResponseWithCompany {
  id: string;
  price: number;
  coverageDetails?: any;
  responseData?: any;
  company: {
    id: string;
    name: string;
    rating?: number | null;
    coverageScore?: number | null;
    avgResponseTime?: number | null;
  };
}

export interface ScoredQuoteResponse extends QuoteResponseWithCompany {
  scores: {
    price: number;
    coverage: number;
    rating: number;
    speed: number;
    total: number;
    weighted: number;
  };
  rank: number;
}

/**
 * Teklif listesini skorla ve sırala
 */
export function scoreAndRankQuotes(
  quotes: QuoteResponseWithCompany[]
): ScoredQuoteResponse[] {
  if (quotes.length === 0) return [];

  // Tüm fiyatları topla
  const allPrices = quotes.map((q) => Number(q.price));

  // Her teklif için skor hesapla
  const scoredQuotes: ScoredQuoteResponse[] = quotes.map((quote) => {
    const priceScore = calculatePriceScore({
      price: Number(quote.price),
      allPrices,
    });

    const coverageScore = calculateCoverageScore({
      coverageDetails: quote.coverageDetails,
      companyId: quote.company.id,
      companyCoverageScore: quote.company.coverageScore
        ? Number(quote.company.coverageScore)
        : null,
    });

    const ratingScore = calculateRatingScore({
      companyRating: quote.company.rating ? Number(quote.company.rating) : null,
      companyId: quote.company.id,
    });

    const speedScore = calculateSpeedScore({
      avgResponseTime: quote.company.avgResponseTime,
      companyId: quote.company.id,
    });

    // Ağırlıklı toplam skor
    const weightedScore =
      priceScore * WEIGHTS.price +
      coverageScore * WEIGHTS.coverage +
      ratingScore * WEIGHTS.rating +
      speedScore * WEIGHTS.speed;

    return {
      ...quote,
      scores: {
        price: priceScore,
        coverage: coverageScore,
        rating: ratingScore,
        speed: speedScore,
        total: Math.round(
          (priceScore + coverageScore + ratingScore + speedScore) / 4
        ),
        weighted: Math.round(weightedScore),
      },
      rank: 0, // Will be assigned after sorting
    };
  });

  // Ağırlıklı skora göre sırala (en yüksek skor en üstte)
  scoredQuotes.sort((a, b) => b.scores.weighted - a.scores.weighted);

  // Rank ata
  scoredQuotes.forEach((quote, index) => {
    quote.rank = index + 1;
  });

  return scoredQuotes;
}

/**
 * Tek bir teklif için skor hesapla (diğer teklifler olmadan)
 */
export function scoreQuote(
  quote: QuoteResponseWithCompany,
  allQuotes: QuoteResponseWithCompany[]
): ScoredQuoteResponse {
  const scored = scoreAndRankQuotes(allQuotes);
  return scored.find((q) => q.id === quote.id) || ({} as ScoredQuoteResponse);
}

/**
 * Skor açıklaması al
 */
export function getScoreLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90)
    return { label: "Mükemmel", color: "text-green-600 bg-green-100" };
  if (score >= 75)
    return { label: "Çok İyi", color: "text-blue-600 bg-blue-100" };
  if (score >= 60)
    return { label: "İyi", color: "text-yellow-600 bg-yellow-100" };
  if (score >= 40)
    return { label: "Orta", color: "text-orange-600 bg-orange-100" };
  return { label: "Düşük", color: "text-red-600 bg-red-100" };
}
