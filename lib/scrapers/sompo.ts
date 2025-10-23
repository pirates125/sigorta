import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { getSompoClient } from "../sompo-client";

export class SompoScraper extends BaseScraper {
  constructor() {
    super("SOMPO", "Sompo Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    // Singleton instance'ı kullan - browser bir kez açılır, kapanmaz
    const client = getSompoClient();

    try {
      // Sompo için web scraping yapıyoruz (Puppeteer ile + OTP desteği)
      // Login, OTP, form doldurma ve teklif alma işlemleri sompo-client.ts'de
      let result: any;

      switch (insuranceType) {
        case "TRAFFIC":
          result = await client.getTrafficQuote(formData);
          break;
        case "KASKO":
          result = await client.getKaskoQuote(formData);
          break;
        default:
          throw new Error(`${insuranceType} türü desteklenmiyor`);
      }

      // ScraperResult formatına dönüştür
      return {
        companyCode: "SOMPO",
        companyName: "Sompo Sigorta",
        price: result.price || 0,
        currency: result.currency || "TRY",
        coverageDetails: result.coverageDetails || result.details,
        responseData: result,
        success: true,
        duration: result.duration || 0,
      };
    } catch (error: any) {
      throw new Error(`Sompo scraping hatası: ${error.message}`);
    }
    // ❌ cleanup() KALDIRILDI - Browser açık kalacak, bir sonraki çağrıda kullanılacak
  }
}
