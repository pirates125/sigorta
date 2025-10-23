import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { SompoClient } from "../sompo-client";

export class SompoScraper extends BaseScraper {
  constructor() {
    super("SOMPO", "Sompo Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    const client = new SompoClient();

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
        coverageDetails: result.coverageDetails,
        responseData: result.responseData,
        success: true,
        duration: result.duration || 0,
      };
    } catch (error: any) {
      throw new Error(`Sompo scraping hatası: ${error.message}`);
    } finally {
      await client.cleanup();
    }
  }
}
