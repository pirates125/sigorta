import { BaseScraper } from "./base";
import { ScraperResult } from "@/types";
import { generateSompoOTP } from "@/lib/otp-generator";

/**
 * Sompo Sigorta Scraper
 *
 * Algoritma:
 * 1. Login formu doldur (BULUT1 / EEsigorta.2828)
 * 2. Google OTP validasyonu (6 haneli kod)
 * 3. Dashboard'a yönlendirme (bot detection bypass)
 * 4. "YENİ İŞ TEKLİFİ" butonuna tıkla
 * 5. Trafik seçeneğini seç ve "TEKLİF AL" butonuna tıkla
 * 6. Form doldur (plaka, tescil bilgileri, TC kimlik)
 * 7. Teklif oluştur ve sonuçları çek
 */
export class SompoScraper extends BaseScraper {
  private readonly SOMPO_URL: string;
  private readonly SOMPO_USER: string;
  private readonly SOMPO_PASS: string;

  constructor() {
    super("SOMPO", "Sompo Sigorta", {
      timeout: 120000, // 2 dakika timeout
      retries: 2,
      retryDelay: 10000, // 10 saniye bekleme
      headless: false, // Debug için false
    });

    this.SOMPO_URL = process.env.SOMPO_URL || "";
    this.SOMPO_USER = process.env.SOMPO_USER || "BULUT1";
    this.SOMPO_PASS = process.env.SOMPO_PASS || "EEsigorta.2828";

    if (!this.SOMPO_URL) {
      throw new Error("SOMPO_URL environment variable is required!");
    }
  }

  async scrape(insuranceType: string, formData: any): Promise<ScraperResult> {
    try {
      console.log(`[${this.companyName}] Scraping başlatılıyor...`);

      // 1. Sompo sitesine git
      await this.page!.goto(this.SOMPO_URL, {
        waitUntil: "networkidle2",
        timeout: this.timeout,
      });

      // 2. Login işlemi
      await this.performLogin();

      // 3. OTP validasyonu
      await this.handleOTPValidation();

      // 4. Dashboard'a geçiş (bot detection bypass)
      await this.navigateToDashboard();

      // 5. Yeni iş teklifi butonuna tıkla
      await this.clickNewQuoteButton();

      // 6. Trafik seçeneğini seç
      await this.selectTrafficOption();

      // 7. Form doldur
      await this.fillTrafficForm(formData);

      // 8. Teklif oluştur
      await this.createQuote();

      // 9. Sonuçları çek
      const result = await this.extractQuoteResults();

      console.log(
        `[${this.companyName}] Scraping tamamlandı. Fiyat: ${result.price} TL`
      );

      return result;
    } catch (error: any) {
      console.error(`[${this.companyName}] Scraping hatası:`, error.message);
      throw new Error(`Sompo scraper hatası: ${error.message}`);
    }
  }

  /**
   * Login formunu doldur ve giriş yap
   */
  private async performLogin(): Promise<void> {
    console.log("[Sompo] Login işlemi başlatılıyor...");

    // Kullanıcı adı alanını doldur
    await this.fillInput(
      'input[placeholder="Kullanıcı Adı"]',
      this.SOMPO_USER,
      { clear: true }
    );

    // Şifre alanını doldur
    await this.fillInput('input[placeholder="Parola"]', this.SOMPO_PASS, {
      clear: true,
    });

    // Giriş yap butonuna tıkla
    await this.clickButton('button[aria-label="GİRİŞ YAP"]');

    // Sayfa yüklenmesini bekle
    await this.waitForTimeout(3000);
  }

  /**
   * Google OTP validasyonu
   */
  private async handleOTPValidation(): Promise<void> {
    console.log("[Sompo] OTP validasyonu başlatılıyor...");

    // OTP input alanlarını bekle
    await this.page!.waitForSelector(".p-inputotp-input", { timeout: 10000 });

    // OTP kodunu üret
    const otpCode = generateSompoOTP();
    console.log(`[Sompo] OTP Kodu: ${otpCode}`);

    // OTP input alanlarını doldur
    const otpInputs = await this.page!.$$(".p-inputotp-input");

    for (let i = 0; i < Math.min(otpCode.length, otpInputs.length); i++) {
      await otpInputs[i].type(otpCode[i]);
      await this.waitForTimeout(200); // Her karakter arasında kısa bekleme
    }

    // Enter tuşuna bas (otomatik submit)
    await this.page!.keyboard.press("Enter");

    // OTP doğrulamasının tamamlanmasını bekle
    await this.waitForTimeout(5000);
  }

  /**
   * Dashboard'a geçiş (bot detection bypass)
   */
  private async navigateToDashboard(): Promise<void> {
    console.log("[Sompo] Dashboard'a geçiş yapılıyor...");

    // URL'de /bot varsa bot detection bypass işlemi
    const currentUrl = this.page!.url();
    if (currentUrl.includes("/bot")) {
      console.log(
        "[Sompo] Bot detection tespit edildi, bypass işlemi başlatılıyor..."
      );

      // 1. Close Tour butonuna tıkla
      console.log("[Sompo] Close Tour butonu aranıyor...");
      const closeTourButton = await this.page!.$(
        'button[aria-label="Close Tour"]'
      );
      if (closeTourButton) {
        await closeTourButton.click();
        console.log("[Sompo] Close Tour butonu tıklandı");
        await this.waitForTimeout(1000);
      }

      // 2. ANA SAYFAYI YÜKLE butonuna tıkla
      console.log("[Sompo] ANA SAYFAYI YÜKLE butonu aranıyor...");
      const loadHomeButton = await this.page!.$(
        'button[aria-label="ANA SAYFAYI YÜKLE"]'
      );
      if (loadHomeButton) {
        await loadHomeButton.click();
        console.log("[Sompo] ANA SAYFAYI YÜKLE butonu tıklandı");
        await this.waitForTimeout(3000);
      }
    }

    // Dashboard yüklenmesini bekle
    await this.waitForTimeout(500);
  }

  /**
   * Yeni iş teklifi butonuna tıkla
   */
  private async clickNewQuoteButton(): Promise<void> {
    console.log("[Sompo] Yeni iş teklifi butonuna tıklanıyor...");

    // "YENİ İŞ TEKLİFİ" butonunu ara
    await this.page!.waitForSelector('button:has-text("YENİ İŞ TEKLİFİ")', {
      timeout: 10000,
    });
    await this.clickButton('button:has-text("YENİ İŞ TEKLİFİ")');

    // Modal açılmasını bekle
    await this.waitForTimeout(2000);
  }

  /**
   * Trafik seçeneğini seç
   */
  private async selectTrafficOption(): Promise<void> {
    console.log("[Sompo] Trafik seçeneği seçiliyor...");

    // Trafik kartını bul ve "TEKLİF AL" butonuna tıkla
    const trafficCard = await this.page!.$(
      '.job__content:has(.job__name:has-text("Trafik"))'
    );
    if (!trafficCard) {
      throw new Error("Trafik seçeneği bulunamadı!");
    }

    const teklifAlButton = await trafficCard.$('button:has-text("TEKLİF AL")');
    if (!teklifAlButton) {
      throw new Error("TEKLİF AL butonu bulunamadı!");
    }

    await teklifAlButton.click();

    // Yeni sayfa açılmasını bekle
    await this.waitForTimeout(3000);
  }

  /**
   * Trafik formunu doldur
   */
  private async fillTrafficForm(formData: any): Promise<void> {
    console.log("[Sompo] Trafik formu dolduruluyor...");

    // Trafik checkbox'ını seç
    await this.page!.waitForSelector("#chkTraffic", { timeout: 10000 });
    await this.page!.click("#chkTraffic");

    // Kasko checkbox'ını kaldır (eğer seçiliyse)
    const cascoCheckbox = await this.page!.$("#chkCasco");
    if (cascoCheckbox) {
      const isChecked = await this.page!.evaluate(
        (el) => (el as HTMLInputElement).checked,
        cascoCheckbox
      );
      if (isChecked) {
        await cascoCheckbox.click();
      }
    }

    // Trafik checkbox'ının seçili olduğunu kontrol et
    const trafficChecked = await this.page!.$eval(
      "#chkTraffic",
      (el: any) => el.checked
    );
    if (!trafficChecked) {
      await this.page!.click("#chkTraffic");
    }

    // Plaka bilgilerini doldur
    if (formData.plate) {
      const plateParts = this.parsePlate(formData.plate);
      if (plateParts.cityCode) {
        await this.fillInput("#txtPlateNoCityNo", plateParts.cityCode);
      }
      if (plateParts.plateNumber) {
        await this.fillInput("#txtPlateNo", plateParts.plateNumber);
      }
    }

    // Tescil bilgilerini doldur
    if (formData.registrationCode) {
      await this.fillInput("#txtEGMNoCode", formData.registrationCode);
    }
    if (formData.registrationNumber) {
      await this.fillInput("#txtEGMNoNumber", formData.registrationNumber);
    }

    // TC Kimlik numarasını doldur
    if (formData.driverTCKN) {
      await this.fillInput("#txtIdentityOrTaxNo", formData.driverTCKN);
    }

    // Adres bilgisini otomatik doldur (TC'ye tıklayarak)
    if (formData.driverTCKN) {
      await this.page!.click("#txtIdentityOrTaxNo");
      await this.waitForTimeout(2000); // Adres bilgisinin yüklenmesini bekle
    }

    console.log("[Sompo] Form doldurma tamamlandı");
  }

  /**
   * Teklif oluştur
   */
  private async createQuote(): Promise<void> {
    console.log("[Sompo] Teklif oluşturuluyor...");

    // "Teklif Oluştur" butonuna tıkla
    await this.page!.waitForSelector("#btnProposalCreate", { timeout: 10000 });
    await this.clickButton("#btnProposalCreate");

    // Teklif sonuçlarının yüklenmesini bekle
    await this.waitForTimeout(5000);
  }

  /**
   * Teklif sonuçlarını çıkar
   */
  private async extractQuoteResults(): Promise<ScraperResult> {
    console.log("[Sompo] Teklif sonuçları çıkarılıyor...");

    try {
      // Kasko teklifi sonuçlarını çek
      const cascoResults = await this.extractCascoResults();

      // Trafik teklifi sonuçlarını çek
      const trafficResults = await this.extractTrafficResults();

      // Fiyatları al (matematik işlemi yok, sadece selector'dan çekilen veriler)
      const cascoPrice = cascoResults.price || 0;
      const trafficPrice = trafficResults.price || 0;

      return {
        companyCode: this.companyCode,
        companyName: this.companyName,
        price: cascoPrice + trafficPrice, // Basit toplama
        currency: "TRY",
        success: true,
        duration: 0, // Bu değer run() metodunda set edilecek
        coverageDetails: {
          casco: cascoResults,
          traffic: trafficResults,
          combined: true,
        },
        responseData: {
          casco: cascoResults,
          traffic: trafficResults,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("[Sompo] Sonuç çıkarma hatası:", error.message);
      throw new Error(`Sonuç çıkarma hatası: ${error.message}`);
    }
  }

  /**
   * Kasko teklifi sonuçlarını çıkar
   */
  private async extractCascoResults(): Promise<any> {
    const cascoContainer = await this.page!.$("#loadedDivCascoProposal2");
    if (!cascoContainer) {
      return { price: 0, proposalNumber: "", installmentPlan: "" };
    }

    const proposalNumber = await this.page!.$eval(
      "#lblCascoProposal2TransactionNo",
      (el: any) => el.textContent?.trim() || ""
    );
    const grossPremium = await this.page!.$eval(
      "#lblCascoProposal2GrossPremium",
      (el: any) => el.textContent?.trim() || ""
    );
    const installmentPlan = await this.page!.$eval(
      "#lblCascoInstallmentPlanName",
      (el: any) => el.textContent?.trim() || ""
    );

    const price = this.parsePrice(grossPremium);

    return {
      price,
      proposalNumber,
      installmentPlan,
      grossPremium,
    };
  }

  /**
   * Trafik teklifi sonuçlarını çıkar
   */
  private async extractTrafficResults(): Promise<any> {
    const trafficContainer = await this.page!.$(
      "#loadedDivTrafficProposalAlternative"
    );
    if (!trafficContainer) {
      return {
        price: 0,
        proposalNumber: "",
        commissionAmount: 0,
        commissionRatio: "",
      };
    }

    const proposalNumber = await this.page!.$eval(
      "#lblTrafficProposalStartEndDateOrProposalNoAlternative",
      (el: any) => el.textContent?.trim() || ""
    );
    const grossPremium = await this.page!.$eval(
      "#lblTrafficProposalGrossPremiumAlternative",
      (el: any) => el.textContent?.trim() || ""
    );
    const commissionAmount = await this.page!.$eval(
      "#lblTrafficProposalCommisionAmountAlternative",
      (el: any) => el.textContent?.trim() || ""
    );
    const commissionRatio = await this.page!.$eval(
      "#lblTrafficProposalCommisionRatioAlternative",
      (el: any) => el.textContent?.trim() || ""
    );

    const price = this.parsePrice(grossPremium);
    const commission = this.parsePrice(commissionAmount);

    return {
      price,
      proposalNumber,
      commissionAmount: commission,
      commissionRatio,
      grossPremium,
    };
  }

  /**
   * Plaka numarasını parse et
   */
  private parsePlate(plate: string): { cityCode: string; plateNumber: string } {
    const cleanPlate = plate.replace(/\s/g, "").toUpperCase();

    // Türk plaka formatı: 34ABC123 veya 34 ABC 123
    const match = cleanPlate.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);

    if (match) {
      return {
        cityCode: match[1],
        plateNumber: match[2] + match[3],
      };
    }

    // Fallback: ilk 2 karakteri şehir kodu olarak al
    return {
      cityCode: cleanPlate.substring(0, 2),
      plateNumber: cleanPlate.substring(2),
    };
  }

  /**
   * Fiyat metnini parse et
   */
  private parsePrice(priceText: string): number {
    if (!priceText) return 0;

    // "18.165,99 TL" formatından sayıyı çıkar
    const cleanText = priceText.replace(/[^\d,]/g, "");
    const price = parseFloat(cleanText.replace(",", "."));

    return isNaN(price) ? 0 : price;
  }
}
