import { ScraperResult } from "@/types";

/**
 * Sompo Sigorta Teklif İşleyici
 *
 * Scraper'dan gelen ham verileri işler ve normalize eder.
 * Matematiksel hesaplamalar ve veri doğrulama yapar.
 */
export class SompoQuoteProcessor {
  /**
   * Ham scraper sonucunu işle ve normalize et
   */
  static processQuoteResult(rawResult: ScraperResult): ProcessedQuoteResult {
    try {
      const { coverageDetails, responseData } = rawResult;

      // Kasko ve Trafik verilerini çıkar
      const cascoData = coverageDetails?.casco || {};
      const trafficData = coverageDetails?.traffic || {};

      // Fiyat hesaplamaları
      const calculations = this.calculatePricing(cascoData, trafficData);

      // Teminat detaylarını işle
      const coverageInfo = this.processCoverageDetails(cascoData, trafficData);

      // Risk analizi
      const riskAnalysis = this.performRiskAnalysis(rawResult);

      // Komisyon hesaplamaları
      const commissionInfo = this.calculateCommission(trafficData);

      return {
        success: rawResult.success,
        companyCode: rawResult.companyCode,
        companyName: rawResult.companyName,
        pricing: calculations,
        coverage: coverageInfo,
        riskAnalysis,
        commission: commissionInfo,
        rawData: {
          casco: cascoData,
          traffic: trafficData,
          timestamp: responseData?.timestamp || new Date().toISOString(),
        },
        metadata: {
          processingTime: new Date().toISOString(),
          version: "1.0.0",
        },
      };
    } catch (error: any) {
      console.error("[SompoQuoteProcessor] İşleme hatası:", error.message);
      throw new Error(`Teklif işleme hatası: ${error.message}`);
    }
  }

  /**
   * Fiyat hesaplamaları yap
   */
  private static calculatePricing(
    cascoData: any,
    trafficData: any
  ): PricingInfo {
    const cascoPrice = cascoData.price || 0;
    const trafficPrice = trafficData.price || 0;
    const totalPrice = cascoPrice + trafficPrice;

    // Vergi hesaplamaları (KDV %20)
    const kdvRate = 0.2;
    const kdvAmount = totalPrice * kdvRate;
    const priceWithTax = totalPrice + kdvAmount;

    // Taksit hesaplamaları
    const installmentOptions = this.calculateInstallmentOptions(totalPrice);

    return {
      casco: {
        grossPremium: cascoPrice,
        netPremium: cascoPrice / (1 + kdvRate),
        kdvAmount: cascoPrice * kdvRate,
        totalWithTax: cascoPrice * (1 + kdvRate),
      },
      traffic: {
        grossPremium: trafficPrice,
        netPremium: trafficPrice / (1 + kdvRate),
        kdvAmount: trafficPrice * kdvRate,
        totalWithTax: trafficPrice * (1 + kdvRate),
      },
      combined: {
        grossPremium: totalPrice,
        netPremium: totalPrice / (1 + kdvRate),
        kdvAmount,
        totalWithTax: priceWithTax,
      },
      installmentOptions,
      savings: this.calculateSavings(cascoData, trafficData),
    };
  }

  /**
   * Taksit seçeneklerini hesapla
   */
  private static calculateInstallmentOptions(
    totalPrice: number
  ): InstallmentOption[] {
    const options: InstallmentOption[] = [];

    // Farklı taksit seçenekleri
    const installmentCounts = [1, 2, 3, 6, 9, 12];

    for (const count of installmentCounts) {
      if (count === 1) {
        // Peşin ödeme - %5 indirim
        const discount = totalPrice * 0.05;
        options.push({
          installmentCount: count,
          monthlyAmount: totalPrice - discount,
          totalAmount: totalPrice - discount,
          discount: discount,
          discountRate: 0.05,
          interestRate: 0,
        });
      } else {
        // Taksitli ödeme - %2 faiz
        const interestRate = 0.02;
        const monthlyAmount = (totalPrice * (1 + interestRate)) / count;

        options.push({
          installmentCount: count,
          monthlyAmount: Math.round(monthlyAmount * 100) / 100,
          totalAmount: Math.round(monthlyAmount * count * 100) / 100,
          discount: 0,
          discountRate: 0,
          interestRate,
        });
      }
    }

    return options;
  }

  /**
   * Tasarruf hesaplamaları
   */
  private static calculateSavings(
    cascoData: any,
    trafficData: any
  ): SavingsInfo {
    const cascoPrice = cascoData.price || 0;
    const trafficPrice = trafficData.price || 0;
    const totalPrice = cascoPrice + trafficPrice;

    // Kombine poliçe indirimi (%10)
    const combinedDiscount = totalPrice * 0.1;
    const combinedPrice = totalPrice - combinedDiscount;

    // Peşin ödeme indirimi (%5)
    const cashDiscount = totalPrice * 0.05;
    const cashPrice = totalPrice - cashDiscount;

    // Maksimum tasarruf (kombine + peşin)
    const maxSavings = combinedDiscount + cashDiscount;
    const maxSavingsPrice = totalPrice - maxSavings;

    return {
      combinedDiscount: {
        amount: combinedDiscount,
        rate: 0.1,
        newPrice: combinedPrice,
      },
      cashDiscount: {
        amount: cashDiscount,
        rate: 0.05,
        newPrice: cashPrice,
      },
      maxSavings: {
        amount: maxSavings,
        rate: 0.15,
        newPrice: maxSavingsPrice,
      },
      potentialSavings: maxSavings,
    };
  }

  /**
   * Teminat detaylarını işle
   */
  private static processCoverageDetails(
    cascoData: any,
    trafficData: any
  ): CoverageInfo {
    return {
      casco: {
        proposalNumber: cascoData.proposalNumber || "",
        installmentPlan: cascoData.installmentPlan || "",
        coverage: {
          theft: true,
          fire: true,
          naturalDisaster: true,
          terrorism: true,
          driverAccident: true,
          glassBreakage: false, // Sompo'da ayrı seçenek
          roadAssistance: true,
        },
        limits: {
          vehicleValue: 0, // Form'dan gelecek
          deductible: 0, // Form'dan gelecek
          maxCoverage: 0, // Form'dan gelecek
        },
      },
      traffic: {
        proposalNumber: trafficData.proposalNumber || "",
        coverage: {
          thirdPartyLiability: true,
          personalAccident: true,
          propertyDamage: true,
          legalLiability: true,
        },
        limits: {
          personalAccident: 100000, // TL
          propertyDamage: 1000000, // TL
          legalLiability: 500000, // TL
        },
      },
      combined: {
        available: cascoData.price > 0 && trafficData.price > 0,
        discount: cascoData.price > 0 && trafficData.price > 0 ? 0.1 : 0,
      },
    };
  }

  /**
   * Risk analizi yap
   */
  private static performRiskAnalysis(rawResult: ScraperResult): RiskAnalysis {
    const { coverageDetails } = rawResult;
    const cascoData = coverageDetails?.casco || {};
    const trafficData = coverageDetails?.traffic || {};

    // Risk skorları
    const riskFactors = {
      highValue: cascoData.price > 10000 ? 0.3 : 0,
      newDriver: false, // Form'dan gelecek
      highRiskArea: false, // Form'dan gelecek
      previousClaims: false, // Form'dan gelecek
      vehicleAge: 0, // Form'dan gelecek
    };

    const totalRiskScore: number = Object.values(riskFactors).reduce(
      (sum: number, factor: number | boolean) =>
        sum + (typeof factor === "number" ? factor : 0),
      0
    );

    return {
      riskScore: Math.min(totalRiskScore, 1), // 0-1 arası
      riskLevel: this.getRiskLevel(totalRiskScore),
      factors: riskFactors,
      recommendations: this.getRiskRecommendations(totalRiskScore),
    };
  }

  /**
   * Risk seviyesini belirle
   */
  private static getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
    if (score < 0.3) return "LOW";
    if (score < 0.7) return "MEDIUM";
    return "HIGH";
  }

  /**
   * Risk önerileri
   */
  private static getRiskRecommendations(score: number): string[] {
    const recommendations: string[] = [];

    if (score > 0.7) {
      recommendations.push(
        "Yüksek risk profili tespit edildi. Ek teminatlar önerilir."
      );
      recommendations.push(
        "Daha yüksek muafiyet seçenekleri değerlendirilebilir."
      );
    }

    if (score > 0.5) {
      recommendations.push(
        "Orta risk profili. Kombine poliçe avantajları değerlendirilebilir."
      );
    }

    if (score < 0.3) {
      recommendations.push(
        "Düşük risk profili. En uygun fiyatlı seçenekler mevcut."
      );
    }

    return recommendations;
  }

  /**
   * Komisyon hesaplamaları
   */
  private static calculateCommission(trafficData: any): CommissionInfo {
    const grossPremium = trafficData.price || 0;
    const commissionAmount = trafficData.commissionAmount || 0;
    const commissionRatio = this.parseCommissionRatio(
      trafficData.commissionRatio || ""
    );

    return {
      grossPremium,
      commissionAmount,
      commissionRatio,
      netPremium: grossPremium - commissionAmount,
      commissionRate: commissionAmount / grossPremium || 0,
    };
  }

  /**
   * Komisyon oranını parse et
   */
  private static parseCommissionRatio(ratioText: string): number {
    if (!ratioText) return 0;

    const match = ratioText.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }
}

// Type definitions
export interface ProcessedQuoteResult {
  success: boolean;
  companyCode: string;
  companyName: string;
  pricing: PricingInfo;
  coverage: CoverageInfo;
  riskAnalysis: RiskAnalysis;
  commission: CommissionInfo;
  rawData: {
    casco: any;
    traffic: any;
    timestamp: string;
  };
  metadata: {
    processingTime: string;
    version: string;
  };
}

export interface PricingInfo {
  casco: PriceBreakdown;
  traffic: PriceBreakdown;
  combined: PriceBreakdown;
  installmentOptions: InstallmentOption[];
  savings: SavingsInfo;
}

export interface PriceBreakdown {
  grossPremium: number;
  netPremium: number;
  kdvAmount: number;
  totalWithTax: number;
}

export interface InstallmentOption {
  installmentCount: number;
  monthlyAmount: number;
  totalAmount: number;
  discount: number;
  discountRate: number;
  interestRate: number;
}

export interface SavingsInfo {
  combinedDiscount: DiscountInfo;
  cashDiscount: DiscountInfo;
  maxSavings: DiscountInfo;
  potentialSavings: number;
}

export interface DiscountInfo {
  amount: number;
  rate: number;
  newPrice: number;
}

export interface CoverageInfo {
  casco: CascoCoverage;
  traffic: TrafficCoverage;
  combined: CombinedCoverage;
}

export interface CascoCoverage {
  proposalNumber: string;
  installmentPlan: string;
  coverage: {
    theft: boolean;
    fire: boolean;
    naturalDisaster: boolean;
    terrorism: boolean;
    driverAccident: boolean;
    glassBreakage: boolean;
    roadAssistance: boolean;
  };
  limits: {
    vehicleValue: number;
    deductible: number;
    maxCoverage: number;
  };
}

export interface TrafficCoverage {
  proposalNumber: string;
  coverage: {
    thirdPartyLiability: boolean;
    personalAccident: boolean;
    propertyDamage: boolean;
    legalLiability: boolean;
  };
  limits: {
    personalAccident: number;
    propertyDamage: number;
    legalLiability: number;
  };
}

export interface CombinedCoverage {
  available: boolean;
  discount: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  factors: {
    highValue: number;
    newDriver: boolean;
    highRiskArea: boolean;
    previousClaims: boolean;
    vehicleAge: number;
  };
  recommendations: string[];
}

export interface CommissionInfo {
  grossPremium: number;
  commissionAmount: number;
  commissionRatio: number;
  netPremium: number;
  commissionRate: number;
}
