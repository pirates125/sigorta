import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * Quick Sigorta Scraper
 *
 * Bu scraper gerçek Quick Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 *
 * Web Sitesi: https://www.quicksigorta.com/
 */
export class QuickScraper extends BaseScraper {
  constructor() {
    super("QUICK", "Quick Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // TODO: Gerçek scraping implementasyonu
      // await this.page?.goto('https://www.quicksigorta.com/trafik-sigortasi');
      // await this.fillInput('#plaka', formData.plate);
      // ... form işlemleri
      // const price = await this.getPrice('.quote-price');

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`Quick scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 5% şans ile hata döndür (simülasyon)
    if (Math.random() < 0.05) {
      throw new Error("Bağlantı hatası");
    }

    // Quick genelde daha ucuz
    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1300, max: 1800 }
    );
  }
}
