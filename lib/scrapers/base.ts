import puppeteer, { Browser, Page } from "puppeteer";
import { ScraperResult } from "@/types";

export interface ScraperConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headless?: boolean;
}

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected companyCode: string;
  protected companyName: string;
  protected timeout: number = 60000; // 60 saniye
  protected retries: number = 2; // 2 deneme
  protected retryDelay: number = 3000; // 3 saniye bekleme
  protected headless: boolean = true;

  constructor(
    companyCode: string,
    companyName: string,
    config: ScraperConfig = {}
  ) {
    this.companyCode = companyCode;
    this.companyName = companyName;
    this.timeout = config.timeout || this.timeout;
    this.retries = config.retries || this.retries;
    this.retryDelay = config.retryDelay || this.retryDelay;
    this.headless = config.headless ?? this.headless;
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });
    this.page = await this.browser.newPage();

    // Navigation timeout ayarla
    this.page.setDefaultNavigationTimeout(this.timeout);
    this.page.setDefaultTimeout(this.timeout);

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

  // Ana çalıştırma metodu - Retry mekanizmalı
  async run(insuranceType: string, formData: any): Promise<ScraperResult> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(
            `[${this.companyName}] Retry attempt ${attempt}/${this.retries}`
          );
          await this.waitForTimeout(this.retryDelay);
        }

        await this.initialize();
        const result = await this.scrape(insuranceType, formData);

        return {
          ...result,
          duration: Date.now() - startTime,
        };
      } catch (error: any) {
        lastError = error;
        console.error(
          `[${this.companyName}] Attempt ${attempt + 1} failed:`,
          error.message
        );

        // Cleanup yap ve bir sonraki deneme için hazırlan
        await this.cleanup().catch(() => {});

        // Son denemeyse hata döndür
        if (attempt === this.retries) {
          break;
        }
      }
    }

    // Tüm denemeler başarısız oldu
    return {
      companyCode: this.companyCode,
      companyName: this.companyName,
      price: 0,
      currency: "TRY",
      success: false,
      error: lastError?.message || "Scraper hatası",
      duration: Date.now() - startTime,
    };
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
