import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";

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
    // Rastgele ama gerçekçi fiyat
    const basePrice = 1450;
    const variance = Math.random() * 550;
    const price = Math.round(basePrice + variance);

    // 5% şans ile hata döndür
    if (Math.random() < 0.05) {
      throw new Error("Timeout");
    }

    return {
      companyCode: this.companyCode,
      companyName: this.companyName,
      price,
      currency: "TRY",
      coverageDetails: {
        limit: "Yasal Limitler",
        deductible: 0,
        coverage: ["Zorunlu Mali Sorumluluk"],
      },
      responseData: {
        quoteReference: `AK-${Date.now()}`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      success: true,
      duration: 0,
    };
  }
}
