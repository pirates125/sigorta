import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * Allianz Sigorta Scraper
 *
 * Bu scraper gerçek Allianz Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 *
 * Web Sitesi: https://www.allianz.com.tr/
 */
export class AllianzScraper extends BaseScraper {
  constructor() {
    super("ALLIANZ", "Allianz Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // TODO: Gerçek scraping implementasyonu
      // await this.page?.goto('https://www.allianz.com.tr/trafik-sigortasi');
      // await this.fillInput('#plaka', formData.plate);
      // ... form işlemleri
      // const price = await this.getPrice('.price-result');

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`Allianz scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 7% şans ile hata döndür (simülasyon)
    if (Math.random() < 0.07) {
      throw new Error("Timeout");
    }

    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1600, max: 2050 }
    );
  }
}
