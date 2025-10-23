import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * Ak Sigorta Scraper
 *
 * Bu scraper gerçek Ak Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 */
export class AkScraper extends BaseScraper {
  constructor() {
    super("AK", "Ak Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // Gerçek scraping yapılacak
      // await this.page?.goto('https://www.aksigorta.com.tr/trafik-sigortasi');

      // Form doldurma ve işlem...

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`Ak scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 5% şans ile hata döndür
    if (Math.random() < 0.05) {
      throw new Error("Timeout");
    }

    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1450, max: 2000 }
    );
  }
}
