import puppeteer, { Browser, Page } from "puppeteer";
import { ScraperResult } from "@/types";

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected companyCode: string;
  protected companyName: string;
  protected timeout: number = 60000; // 60 saniye

  constructor(companyCode: string, companyName: string) {
    this.companyCode = companyCode;
    this.companyName = companyName;
  }

  async initialize(): Promise<void> {
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

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async waitForTimeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async takeScreenshot(name: string): Promise<void> {
    if (this.page) {
      await this.page.screenshot({
        path: `./screenshots/${this.companyCode}-${name}.png`,
      });
    }
  }

  // Her sigorta şirketi kendi scrape metodunu implement edecek
  abstract scrape(insuranceType: string, formData: any): Promise<ScraperResult>;

  // Ana çalıştırma metodu
  async run(insuranceType: string, formData: any): Promise<ScraperResult> {
    const startTime = Date.now();

    try {
      await this.initialize();
      const result = await this.scrape(insuranceType, formData);

      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error(`Scraper error (${this.companyName}):`, error);

      return {
        companyCode: this.companyCode,
        companyName: this.companyName,
        price: 0,
        currency: "TRY",
        success: false,
        error: error.message || "Scraper hatası",
        duration: Date.now() - startTime,
      };
    } finally {
      await this.cleanup();
    }
  }

  // Yardımcı metodlar
  protected async fillInput(
    selector: string,
    value: string,
    options: { delay?: number; clear?: boolean } = {}
  ): Promise<void> {
    if (!this.page) return;

    await this.page.waitForSelector(selector, { timeout: this.timeout });

    if (options.clear) {
      await this.page.click(selector, { clickCount: 3 });
      await this.page.keyboard.press("Backspace");
    }

    await this.page.type(selector, value, {
      delay: options.delay || 50,
    });
  }

  protected async clickButton(selector: string): Promise<void> {
    if (!this.page) return;

    await this.page.waitForSelector(selector, { timeout: this.timeout });
    await this.page.click(selector);
  }

  protected async selectOption(selector: string, value: string): Promise<void> {
    if (!this.page) return;

    await this.page.waitForSelector(selector, { timeout: this.timeout });
    await this.page.select(selector, value);
  }

  protected async getText(selector: string): Promise<string> {
    if (!this.page) return "";

    await this.page.waitForSelector(selector, { timeout: this.timeout });
    return await this.page.$eval(selector, (el) => el.textContent || "");
  }

  protected async getPrice(selector: string): Promise<number> {
    const text = await this.getText(selector);
    // Fiyat metinden sayıyı çıkar (örn: "1.234,56 TL" -> 1234.56)
    const cleanText = text.replace(/[^\d,]/g, "");
    const price = parseFloat(cleanText.replace(",", "."));
    return isNaN(price) ? 0 : price;
  }
}
