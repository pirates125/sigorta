/**
 * Sompo Sigorta Entegrasyon Client
 *
 * Bu dosya Sompo Sigorta'ya bağlanıp işlem yapmak için kullanılır.
 * Sompo'nun web tabanlı sistemi için Puppeteer kullanılabilir.
 */

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";
import fs from "fs";
import path from "path";
import { generateSompoOTP } from "./otp-generator";

// Stealth plugin'i ekle (bot algılamasını aşmak için)
puppeteer.use(StealthPlugin());

const SESSION_FILE = path.join(process.cwd(), ".sompo-session.json");

export class SompoClient {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn: boolean = false;

  private config = {
    url: process.env.SOMPO_URL || "",
    username: process.env.SOMPO_USER || "",
    password: process.env.SOMPO_PASS || "",
    secretKey: process.env.SOMPO_SECRET_KEY || "",
  };

  /**
   * Browser'ı başlat
   */
  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    this.page = await this.browser.newPage();

    // User agent ayarla
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  /**
   * Session kaydet
   */
  async saveSession(): Promise<void> {
    if (!this.page) return;

    try {
      const cookies = await this.page.cookies();
      const session = {
        cookies,
        timestamp: Date.now(),
      };

      fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
      console.log("✅ Session kaydedildi:", SESSION_FILE);
    } catch (error) {
      console.error("Session kaydetme hatası:", error);
    }
  }

  /**
   * Session yükle
   */
  async loadSession(): Promise<boolean> {
    try {
      if (!fs.existsSync(SESSION_FILE)) {
        console.log("📝 Session dosyası bulunamadı");
        return false;
      }

      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));

      // Session 12 saatten eski mi?
      const age = Date.now() - sessionData.timestamp;
      if (age > 12 * 60 * 60 * 1000) {
        console.log("⚠️  Session süresi dolmuş (12 saat)");
        fs.unlinkSync(SESSION_FILE);
        return false;
      }

      if (!this.page) {
        await this.initialize();
      }

      // Cookie'leri yükle
      await this.page!.setCookie(...sessionData.cookies);

      // Dashboard'a git
      await this.page!.goto("https://ejento.somposigorta.com.tr/dashboard/", {
        waitUntil: "networkidle2",
        timeout: 15000,
      });

      // Login kontrolü
      const url = this.page!.url();
      if (url.includes("/login") || url.includes("/bot")) {
        console.log("⚠️  Session geçersiz");
        fs.unlinkSync(SESSION_FILE);
        return false;
      }

      console.log("✅ Session yüklendi, giriş yapılmadı");
      this.isLoggedIn = true;
      return true;
    } catch (error) {
      console.error("Session yükleme hatası:", error);
      return false;
    }
  }

  /**
   * Sompo'ya giriş yap
   */
  async login(otpCode?: string): Promise<boolean> {
    // Önce kaydedilmiş session'ı dene
    const sessionLoaded = await this.loadSession();
    if (sessionLoaded) {
      return true;
    }

    // Session yoksa normal giriş yap
    if (!this.page) {
      await this.initialize();
    }

    try {
      console.log("Sompo'ya giriş yapılıyor...");
      await this.page!.goto(this.config.url, { waitUntil: "networkidle2" });

      // Kullanıcı adı - gerçek selector
      const usernameSelector = 'input[placeholder="Kullanıcı Adı"]';
      await this.page!.waitForSelector(usernameSelector, { timeout: 10000 });
      await this.page!.type(usernameSelector, this.config.username, {
        delay: 100,
      });

      // Şifre - gerçek selector
      const passwordSelector = 'input[placeholder="Parola"]';
      await this.page!.type(passwordSelector, this.config.password, {
        delay: 100,
      });

      // Giriş butonuna tıkla
      await this.page!.click('button[type="submit"]');

      // OTP sayfası için bekle
      await this.page!.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 15000,
      });

      // OTP kontrolü
      const currentUrl = this.page!.url();
      if (currentUrl.includes("google-authenticator-validation")) {
        console.log("⚠️  OTP gerekli! Otomatik üretiliyor...");

        // OTP'yi otomatik üret (secret key'den)
        const otp = otpCode || generateSompoOTP();
        console.log(`🔑 Kullanılan OTP: ${otp}`);

        // OTP input'larını doldur (6 haneli kod)
        const otpInputs = await this.page!.$$(".p-inputotp-input");
        const digits = otp.split("");

        for (let i = 0; i < Math.min(digits.length, otpInputs.length); i++) {
          await otpInputs[i].type(digits[i]);
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        // OTP gönderildikten sonra yönlendirmeyi bekle
        await this.page!.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 15000,
        });
      }

      // Dashboard'a yönlendirmeyi bekle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Bot algılaması kontrolü - eğer /bot'a giderse, "Ana Sayfayı Yükle" butonuna tıkla
      const finalUrl = this.page!.url();
      if (finalUrl.includes("/bot")) {
        console.log(
          "⚠️  Bot algılaması aktif! 'Ana Sayfayı Yükle' butonuna tıklanıyor..."
        );
        await this.screenshot("bot-detection-before");

        try {
          // "Ana Sayfayı Yükle" textini içeren elementi ara
          const buttonFound = await this.page!.evaluate(() => {
            // Tüm elementleri tara
            const allElements = document.querySelectorAll("*");
            for (const element of allElements) {
              const text = element.textContent?.trim() || "";
              if (
                text.includes("Ana Sayfayı Yükle") ||
                text === "Ana Sayfayı Yükle"
              ) {
                // Tıklanabilir bir element mi kontrol et
                if (
                  element.tagName === "BUTTON" ||
                  element.tagName === "A" ||
                  (element as any).onclick ||
                  (element as HTMLElement).style.cursor === "pointer"
                ) {
                  (element as HTMLElement).click();
                  return true;
                }
              }
            }
            return false;
          });

          if (buttonFound) {
            console.log("✅ 'Ana Sayfayı Yükle' butonuna tıklandı!");
            // Yönlendirmeyi bekle
            await this.page!.waitForNavigation({
              waitUntil: "networkidle2",
              timeout: 10000,
            }).catch(() => {
              // Navigation timeout olursa devam et
              console.log("Navigation timeout, devam ediliyor...");
            });
            await this.screenshot("bot-detection-after-click");
          } else {
            console.log("⚠️  'Ana Sayfayı Yükle' butonu bulunamadı!");
            await this.screenshot("bot-detection-no-button");

            // Alternatif: Tüm butonları/linkleri logla
            const elementsText = await this.page!.evaluate(() => {
              const buttons = document.querySelectorAll(
                'button, a, [role="button"]'
              );
              return Array.from(buttons)
                .map((el) => el.textContent?.trim())
                .filter((t) => t);
            });
            console.log("📋 Sayfadaki butonlar:", elementsText);
          }

          // Tekrar URL kontrolü
          const newUrl = this.page!.url();
          if (newUrl.includes("/bot")) {
            throw new Error(
              "Bot algılaması aşılamadı! Screenshot kontrol edin: screenshots/sompo-bot-detection-*.png"
            );
          }
        } catch (error: any) {
          console.error("Bot algılama hatası:", error.message);
          await this.screenshot("bot-detection-error");
          throw error;
        }
      }

      this.isLoggedIn = true;
      console.log("✅ Sompo'ya başarıyla giriş yapıldı");
      await this.screenshot("after-login");

      // Session'ı kaydet (bir sonraki çalışmada kullanmak için)
      await this.saveSession();

      return true;
    } catch (error: any) {
      console.error("❌ Sompo giriş hatası:", error.message);
      await this.screenshot("login-error");
      this.isLoggedIn = false;
      return false;
    }
  }

  /**
   * Trafik sigortası teklifi al
   */
  async getTrafficQuote(formData: any, otpCode?: string): Promise<any> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login(otpCode);
      if (!loginSuccess) {
        throw new Error("Sompo'ya giriş yapılamadı");
      }
    }

    try {
      console.log("Trafik sigortası teklifi alınıyor...");

      // Cosmos trafik formu sayfasına git
      const trafficFormUrl =
        "https://cosmos.sompojapan.com.tr/?guid=a981427e-83af-425c-bc28-ae8e74f24c98&startupScript=..."; // Tam URL formData'dan gelecek
      await this.page!.goto(trafficFormUrl, { waitUntil: "networkidle2" });
      await this.screenshot("traffic-form-loaded");

      // 1. TC Kimlik No
      await this.page!.waitForSelector("#txtIdentityOrTaxNo", {
        timeout: 10000,
      });
      await this.page!.type("#txtIdentityOrTaxNo", formData.driverTCKN, {
        delay: 50,
      });

      // 2. Plaka (şehir kodu + plaka)
      const plateParts = formData.plate.match(/^(\d{2})([A-Z]+)(\d+)$/i);
      if (plateParts) {
        await this.page!.type("#txtPlateNoCityNo", plateParts[1], {
          delay: 50,
        });
        await this.page!.type("#txtPlateNo", plateParts[2] + plateParts[3], {
          delay: 50,
        });
      }

      // 3. Checkbox'ları işaretle
      await this.page!.click("#chkTraffic"); // Trafik sigortası checkbox

      // 4. EGM Sorgula butonuna tıkla (araç bilgilerini çeker)
      await this.page!.waitForSelector("#btnSearchEgm", { timeout: 5000 });
      await this.page!.click("#btnSearchEgm");

      // EGM sorgulamasının tamamlanmasını bekle
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await this.screenshot("after-egm-query");

      // 5. Sigortalı iletişim bilgisi (Cep telefonu seçili olmalı)
      await this.page!.click("#rblInsuredContactType_0"); // Cep Tel radio button

      // Telefon numarası varsa gir
      if (formData.phone) {
        const phoneMatch = formData.phone.match(/^(\d{3})(\d{7})$/);
        if (phoneMatch) {
          await this.page!.type("#txtInsuredGsmAreaCode", phoneMatch[1], {
            delay: 50,
          });
          await this.page!.type("#txtInsuredGsmNumber", phoneMatch[2], {
            delay: 50,
          });
        }
      }

      // 6. Teklif Oluştur butonuna tıkla
      await this.page!.waitForSelector("#btnProposalCreate", { timeout: 5000 });
      await this.page!.click("#btnProposalCreate");
      console.log("Teklif oluşturma isteği gönderildi...");

      // 7. Teklif sonucunu bekle
      await this.page!.waitForSelector("#loadedDivTrafficProposal", {
        visible: true,
        timeout: 30000,
      });
      await this.screenshot("traffic-proposal-loaded");

      // 8. Fiyatı çek
      const priceText = await this.page!.$eval(
        "#lblTrafficProposalGrossPremium",
        (el) => el.textContent || "0"
      );

      // 9. Teklif numarasını al
      const proposalNo = await this.page!.$eval(
        "#lblTrafficProposalStartEndDateOrProposalNo",
        (el) => el.textContent || ""
      );

      // 10. Komisyon bilgilerini al
      const commissionAmount = await this.page!.$eval(
        "#lblTrafficProposalComissionAmount",
        (el) => el.textContent || ""
      ).catch(() => "");

      const commissionRatio = await this.page!.$eval(
        "#lblTrafficProposalComissionRatio",
        (el) => el.textContent || ""
      ).catch(() => "");

      // Fiyatı parse et (örn: "1.234,56 TL" -> 1234.56)
      const price = parseFloat(
        priceText
          .replace(/[^\d,]/g, "")
          .replace(".", "")
          .replace(",", ".")
      );

      console.log(
        `✅ Teklif alındı! Fiyat: ${price} TL, Teklif No: ${proposalNo}`
      );

      return {
        success: true,
        price: price || 0,
        reference: proposalNo.trim(),
        data: {
          grossPremium: priceText,
          commissionAmount,
          commissionRatio,
        },
      };
    } catch (error: any) {
      console.error("❌ Sompo teklif hatası:", error.message);
      await this.screenshot("traffic-quote-error");
      throw error;
    }
  }

  /**
   * Kasko teklifi al
   */
  async getKaskoQuote(formData: any): Promise<any> {
    if (!this.isLoggedIn) {
      await this.login();
    }

    // Kasko işlemleri...
    return {
      success: true,
      price: 0,
      reference: "",
      data: {},
    };
  }

  /**
   * Poliçe kes
   */
  async createPolicy(quoteData: any, paymentInfo: any): Promise<any> {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      // Poliçe kesme işlemleri...

      return {
        success: true,
        policyNumber: `SOMPO-${Date.now()}`,
        pdfUrl: "",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
    } catch (error: any) {
      console.error("Sompo poliçe kesme hatası:", error.message);
      throw error;
    }
  }

  /**
   * Oturumu kapat
   */
  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    this.isLoggedIn = false;
  }

  /**
   * Screenshot al (debug için)
   */
  async screenshot(name: string): Promise<void> {
    if (this.page) {
      await this.page.screenshot({ path: `./screenshots/sompo-${name}.png` });
    }
  }
}

// Singleton instance
let sompoClientInstance: SompoClient | null = null;

export function getSompoClient(): SompoClient {
  if (!sompoClientInstance) {
    sompoClientInstance = new SompoClient();
  }
  return sompoClientInstance;
}
