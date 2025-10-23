import { ScraperResult } from "@/types";

/**
 * Mock scraper sonuçları için utility fonksiyon
 * Gerçekçi fiyatlar ve teminatlar üretir
 */
export function generateMockResult(
  companyCode: string,
  companyName: string,
  insuranceType: string,
  formData: any,
  priceVariance: { min: number; max: number } = { min: 1400, max: 2000 }
): ScraperResult {
  let basePrice: number;
  let coverageDetails: any;

  if (insuranceType === "KASKO") {
    const vehicleValue = formData.vehicleValue || 500000;
    const coverageType = formData.coverageType || "MIDI";

    const coverageMultipliers: Record<string, number> = {
      MINI: 0.03,
      MIDI: 0.045,
      MAXI: 0.06,
    };

    basePrice = vehicleValue * (coverageMultipliers[coverageType] || 0.045);
    const variance = basePrice * 0.15 * (Math.random() - 0.5);

    coverageDetails = {
      coverageType,
      vehicleValue,
      deductible:
        coverageType === "MINI" ? 2000 : coverageType === "MIDI" ? 1500 : 1000,
      coverage:
        coverageType === "MINI"
          ? ["Çarpma-Çarpılma", "Yangın", "Hırsızlık"]
          : coverageType === "MIDI"
          ? ["Çarpma-Çarpılma", "Yangın", "Hırsızlık", "Cam", "Sel"]
          : [
              "Çarpma-Çarpılma",
              "Yangın",
              "Hırsızlık",
              "Cam",
              "Sel",
              "Deprem",
              "Mini Onarım",
              "Anahtarsız Çalınma",
              "Ön Cam Filmi",
            ],
    };

    basePrice = Math.round(basePrice + variance);
  } else if (insuranceType === "TRAFFIC") {
    const variance = Math.random() * (priceVariance.max - priceVariance.min);
    basePrice = Math.round(priceVariance.min + variance);

    coverageDetails = {
      limit: "Yasal Limitler Dahilinde",
      deductible: 0,
      coverage: ["Zorunlu Mali Sorumluluk"],
    };
  } else {
    // DASK, HEALTH için gelecekte eklenecek
    basePrice = 1500;
    coverageDetails = {
      limit: "Standart Teminat",
      deductible: 0,
      coverage: ["Temel Koruma"],
    };
  }

  return {
    companyCode,
    companyName,
    price: basePrice,
    currency: "TRY",
    coverageDetails,
    responseData: {
      quoteReference: `${companyCode}-${Date.now()}`,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      coverageType: formData.coverageType,
    },
    success: true,
    duration: 0,
  };
}

