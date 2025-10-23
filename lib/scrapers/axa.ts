import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * AXA Sigorta Scraper
 *
 * Bu scraper gerçek AXA Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 *
 * Web Sitesi: https://www.axa.com.tr/
 */
export class AxaScraper extends BaseScraper {
  constructor() {
    super("AXA", "AXA Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // TODO: Gerçek scraping implementasyonu
      // await this.page?.goto('https://www.axa.com.tr/trafik-sigortasi');
      // await this.fillInput('#plaka', formData.plate);
      // ... form işlemleri
      // const price = await this.getPrice('.price-selector');

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`AXA scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 8% şans ile hata döndür (simülasyon)
    if (Math.random() < 0.08) {
      throw new Error("Site yanıt vermiyor");
    }

    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1500, max: 2000 }
    );
  }
}
