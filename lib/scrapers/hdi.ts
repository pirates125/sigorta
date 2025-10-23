import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * HDI Sigorta Scraper
 *
 * Bu scraper gerçek HDI Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 *
 * Web Sitesi: https://www.hdi.com.tr/
 */
export class HdiScraper extends BaseScraper {
  constructor() {
    super("HDI", "HDI Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // TODO: Gerçek scraping implementasyonu
      // await this.page?.goto('https://www.hdi.com.tr/trafik-sigortasi');
      // await this.fillInput('#plaka', formData.plate);
      // ... form işlemleri
      // const price = await this.getPrice('.fiyat');

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`HDI scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 6% şans ile hata döndür (simülasyon)
    if (Math.random() < 0.06) {
      throw new Error("Sistem yoğun");
    }

    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1550, max: 2100 }
    );
  }
}
