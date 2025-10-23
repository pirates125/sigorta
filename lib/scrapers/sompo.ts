import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { sompoAPI } from "../sompo-api";

export class SompoScraper extends BaseScraper {
  constructor() {
    super("SOMPO", "Sompo Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // Sompo için API kullanıyoruz (scraping değil)
      let result: ScraperResult;

      switch (insuranceType) {
        case "TRAFFIC":
          result = await sompoAPI.getTrafficQuote(formData);
          break;
        case "KASKO":
          result = await sompoAPI.getKaskoQuote(formData);
          break;
        default:
          throw new Error(`${insuranceType} türü desteklenmiyor`);
      }

      return result;
    } catch (error: any) {
      throw new Error(`Sompo API hatası: ${error.message}`);
    }
  }
}
