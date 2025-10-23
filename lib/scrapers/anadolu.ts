import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateMockResult } from "./mock-utils";

/**
 * Anadolu Sigorta Scraper
 *
 * Bu scraper gerçek Anadolu Sigorta web sitesinden fiyat çekecek şekilde
 * geliştirilmelidir. Şu anda mock data döndürüyor.
 *
 * Gerçek implementasyon için:
 * 1. Anadolu Sigorta web sitesinin yapısını inceleyin
 * 2. Form alanlarını ve selector'ları belirleyin
 * 3. Fiyat sonuç sayfasının selector'ını bulun
 * 4. CAPTCHA varsa çözücü entegre edin
 */
export class AnadoluScraper extends BaseScraper {
  constructor() {
    super("ANADOLU", "Anadolu Sigorta");
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      // Gerçek scraping yapılacak
      // await this.page?.goto('https://www.anadolusigorta.com.tr/trafik-sigortasi');

      // Form doldurma
      // await this.fillInput('#plaka', formData.plate);
      // await this.fillInput('#tckn', formData.driverTCKN);
      // ... diğer alanlar

      // Teklif al butonuna tıkla
      // await this.clickButton('#teklifAl');

      // Sonucu bekle ve fiyatı çek
      // const price = await this.getPrice('.fiyat-sonuc');

      // Şimdilik mock data
      return this.getMockResult(insuranceType, formData);
    } catch (error: any) {
      throw new Error(`Anadolu scraper hatası: ${error.message}`);
    }
  }

  private getMockResult(insuranceType: string, formData: any): ScraperResult {
    // 10% şans ile hata döndür (gerçek senaryoları simüle etmek için)
    if (Math.random() < 0.1) {
      throw new Error("Site yavaş yanıt verdi");
    }

    return generateMockResult(
      this.companyCode,
      this.companyName,
      insuranceType,
      formData,
      { min: 1400, max: 2000 }
    );
  }
}
