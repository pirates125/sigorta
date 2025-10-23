/**
 * Sompo Sigorta Web Scraping
 *
 * Sompo Sigorta'dan gerçek teklif almak için web scraping kullanır
 */

import { ScraperResult } from "@/types";
import puppeteer, { Browser, Page } from "puppeteer";

interface SompoConfig {
  loginUrl: string;
  dashboardUrl: string;
  username: string;
  password: string;
}

export class SompoAPI {
  private config: SompoConfig;
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn: boolean = false;

  constructor() {
    this.config = {
      loginUrl:
        process.env.SOMPO_LOGIN_URL ||
        "https://ejento.somposigorta.com.tr/dashboard/login",
      dashboardUrl:
        process.env.SOMPO_DASHBOARD_URL ||
        "https://ejento.somposigorta.com.tr/dashboard/",
      username: process.env.SOMPO_USER || "BULUT1",
      password: process.env.SOMPO_PASS || "EEsigorta.2828",
    };
  }

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async initialize(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
  }

  private async login(): Promise<void> {
    if (this.isLoggedIn || !this.page) return;

    console.log("🔐 Sompo'ya giriş yapılıyor...");

    await this.page.goto(this.config.loginUrl, { waitUntil: "networkidle2" });
    await this.wait(2000);

    // Kullanıcı adı gir
    await this.page.waitForSelector('input[placeholder="Kullanıcı Adı"]');
    await this.page.type(
      'input[placeholder="Kullanıcı Adı"]',
      this.config.username,
      {
        delay: 100,
      }
    );

    // Şifre gir
    await this.page.waitForSelector('input[placeholder="Parola"]');
    await this.page.type('input[placeholder="Parola"]', this.config.password, {
      delay: 100,
    });

    // Giriş yap butonuna tıkla
    await this.page.waitForSelector('button[type="submit"]');
    await this.page.click('button[type="submit"]');

    // Dashboard'a yönlendirilmesini bekle
    await this.page.waitForNavigation({ waitUntil: "networkidle2" });
    await this.wait(2000);

    this.isLoggedIn = true;
    console.log("✅ Sompo'ya giriş başarılı");
  }

  private async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    this.browser = null;
    this.page = null;
    this.isLoggedIn = false;
  }

  /**
   * Trafik sigortası teklifi al
   */
  async getTrafficQuote(formData: any): Promise<ScraperResult> {
    const startTime = Date.now();

    try {
      await this.initialize();
      await this.login();

      if (!this.page) {
        throw new Error("Sayfa başlatılamadı");
      }

      console.log("🚗 Trafik sigortası teklifi alınıyor...");

      // Cosmos teklif sayfasına git
      // Not: Gerçek GUID'i almak için dashboard'dan almamız gerekebilir
      // Şimdilik direkt teklif sayfasına gidiyoruz
      const cosmosUrl = await this.getCosmosUrl();
      await this.page.goto(cosmosUrl, { waitUntil: "networkidle2" });
      await this.wait(3000);

      // TC Kimlik No gir
      await this.page.waitForSelector("#txtIdentityOrTaxNo", {
        timeout: 10000,
      });
      await this.page.type(
        "#txtIdentityOrTaxNo",
        formData.driverTCKN || "11111111110",
        {
          delay: 100,
        }
      );

      // Plaka gir
      const plateCity = formData.plate.substring(0, 2); // İlk 2-3 karakter
      const plateNo = formData.plate.substring(2); // Geri kalan

      await this.page.waitForSelector("#txtPlateNoCityNo");
      await this.page.type("#txtPlateNoCityNo", plateCity, { delay: 100 });

      await this.page.waitForSelector("#txtPlateNo");
      await this.page.type("#txtPlateNo", plateNo, { delay: 100 });

      // Trafik checkbox'ı işaretle (eğer işaretli değilse)
      await this.page.waitForSelector("#chkTraffic");
      const isChecked = await this.page.$eval(
        "#chkTraffic",
        (el: any) => el.checked
      );
      if (!isChecked) {
        await this.page.click("#chkTraffic");
      }

      // EGM Sorgula butonuna tıkla (araç bilgilerini çekmek için)
      await this.page.waitForSelector("#btnSearchEgm");
      await this.page.click("#btnSearchEgm");
      await this.wait(3000);

      // İletişim bilgileri
      // Cep telefonu seç
      const gsmRadio = await this.page.$("#rblInsuredContactType_0");
      if (gsmRadio) {
        await this.page.click("#rblInsuredContactType_0");
        await this.wait(500);

        // Telefon gir
        if (formData.phone) {
          const phoneArea = formData.phone.substring(0, 3);
          const phoneNumber = formData.phone.substring(3);

          await this.page.waitForSelector("#txtInsuredGsmAreaCode");
          await this.page.type("#txtInsuredGsmAreaCode", phoneArea, {
            delay: 100,
          });

          await this.page.waitForSelector("#txtInsuredGsmNumber");
          await this.page.type("#txtInsuredGsmNumber", phoneNumber, {
            delay: 100,
          });
        }
      }

      // Teklif Oluştur butonuna tıkla
      await this.page.waitForSelector("#btnProposalCreate");
      await this.page.click("#btnProposalCreate");

      // Teklif sonucunu bekle
      await this.page.waitForSelector("#loadedDivTrafficProposal", {
        timeout: 30000,
      });
      await this.wait(2000);

      // Fiyatı çek
      const priceText = await this.page.$eval(
        "#lblTrafficProposalGrossPremium",
        (el) => el.textContent || ""
      );

      // Teklif numarasını çek
      const quoteNo = await this.page.$eval(
        "#lblTrafficProposalStartEndDateOrProposalNo",
        (el) => el.textContent || ""
      );

      // Komisyon bilgilerini çek
      const commissionAmount = await this.page.$eval(
        "#lblTrafficProposalComissionAmount",
        (el) => el.textContent || ""
      );

      // Fiyatı parse et (örn: "1.234,56 TL" -> 1234.56)
      const price = this.parsePrice(priceText);

      console.log(`✅ Sompo teklifi alındı: ${price} TL`);

      return {
        companyCode: "SOMPO",
        companyName: "Sompo Sigorta",
        price,
        currency: "TRY",
        coverageDetails: {
          limit: "Zorunlu Mali Mesuliyet",
          quoteNo: quoteNo.trim(),
          commission: commissionAmount.trim(),
        },
        responseData: {
          quoteReference: quoteNo.trim(),
          grossPremium: price,
        },
        success: true,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error("Sompo scraping error:", error);

      return {
        companyCode: "SOMPO",
        companyName: "Sompo Sigorta",
        price: 0,
        currency: "TRY",
        success: false,
        error: error.message || "Teklif alınamadı",
        duration: Date.now() - startTime,
      };
    } finally {
      await this.cleanup();
    }
  }

  private parsePrice(priceText: string): number {
    // "1.234,56 TL" veya "1234,56" gibi formatlardaki fiyatı parse et
    const cleanText = priceText.replace(/[^\d,]/g, ""); // Sadece rakam ve virgül
    const price = parseFloat(cleanText.replace(".", "").replace(",", "."));
    return isNaN(price) ? 0 : price;
  }

  private async getCosmosUrl(): Promise<string> {
    // Dashboard'dan Cosmos URL'ini al
    // Şimdilik sabit bir URL döndürüyoruz
    // Gerçek implementasyonda dashboard'dan alınmalı

    // NOT: traffic-form.md'deki URL çok uzun bir GUID içeriyor
    // Bu GUID session bazlı oluşturuluyor olabilir
    // Dashboard'da "Yeni Teklif" butonuna tıklayarak gerçek URL'i almamız gerekebilir

    if (!this.page) throw new Error("Page not initialized");

    await this.page.goto(this.config.dashboardUrl, {
      waitUntil: "networkidle2",
    });
    await this.wait(2000);

    // Trafik sigortası linkini bul ve tıkla
    // NOT: Bu selector'ı dashboard'da bulmanız gerekebilir
    const trafficLink = await this.page.$(
      'a[href*="cosmos.sompojapan.com.tr"]'
    );

    if (trafficLink) {
      const href = await this.page.evaluate(
        (el) => el.getAttribute("href"),
        trafficLink
      );
      return href || this.config.dashboardUrl;
    }

    // Link bulunamazsa dashboard URL'ini dön
    return this.config.dashboardUrl;
  }

  /**
   * Kasko sigortası teklifi al
   */
  async getKaskoQuote(formData: any): Promise<ScraperResult> {
    try {
      // Gerçek API çağrısı
      return this.getMockQuote(formData);
    } catch (error: any) {
      console.error("Sompo API error:", error);
      throw error;
    }
  }

  /**
   * Poliçe kes
   */
  async createPolicy(quoteId: string, paymentInfo: any): Promise<any> {
    try {
      // Gerçek API çağrısı yapılacak
      // const response = await fetch(`${this.config.apiUrl}/policy/create`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': this.config.apiKey,
      //     'X-API-Secret': this.config.apiSecret,
      //   },
      //   body: JSON.stringify({
      //     agentCode: this.config.agentCode,
      //     quoteId,
      //     paymentInfo,
      //   }),
      // });

      // Mock response
      return {
        policyNumber: `SOMPO-${Date.now()}`,
        policyPdf: "https://example.com/policy.pdf",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
    } catch (error: any) {
      console.error("Sompo API error:", error);
      throw error;
    }
  }

  /**
   * Poliçe iptal et
   */
  async cancelPolicy(policyNumber: string): Promise<boolean> {
    try {
      // Gerçek API çağrısı yapılacak
      return true;
    } catch (error: any) {
      console.error("Sompo API error:", error);
      throw error;
    }
  }

  /**
   * Poliçe yenile
   */
  async renewPolicy(policyNumber: string): Promise<any> {
    try {
      // Gerçek API çağrısı yapılacak
      return {
        success: true,
        newPolicyNumber: `SOMPO-${Date.now()}`,
      };
    } catch (error: any) {
      console.error("Sompo API error:", error);
      throw error;
    }
  }

  /**
   * Mock teklif - Geliştirme ve test için
   */
  private getMockQuote(formData: any): ScraperResult {
    // Rastgele fiyat üret (gerçekçi aralıkta)
    const basePrice = 1500;
    const variance = Math.random() * 500;
    const price = Math.round(basePrice + variance);

    return {
      companyCode: "SOMPO",
      companyName: "Sompo Sigorta",
      price,
      currency: "TRY",
      coverageDetails: {
        limit: "Sınırsız",
        deductible: 0,
        coverage: ["Maddi Hasar", "Manevi Tazminat", "Tedavi Masrafları"],
      },
      responseData: {
        quoteReference: `SOMPO-QUOTE-${Date.now()}`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      success: true,
      duration: 1200,
    };
  }
}

export const sompoAPI = new SompoAPI();
