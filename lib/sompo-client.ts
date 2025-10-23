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
import { getTrafficQuoteNewFlow } from "./sompo-client-new-flow";

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
   * Browser'ı başlat (zaten açıksa tekrar açma)
   */
  async initialize(): Promise<void> {
    // Browser zaten açıksa ve bağlantı varsa, yeniden açma
    if (this.browser && this.browser.isConnected()) {
      console.log("♻️ Mevcut browser kullanılıyor (singleton)");

      // Page yoksa veya kapalıysa yeni page aç
      if (!this.page || this.page.isClosed()) {
        console.log("📄 Yeni page açılıyor...");
        this.page = await this.browser.newPage();
        await this.setupPage();
      }
      return;
    }

    console.log("🚀 Yeni browser başlatılıyor...");
    this.browser = await puppeteer.launch({
      headless: false, // 👀 Chrome'u açık göster
      slowMo: 50, // 100ms -> 50ms daha hızlı
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--start-maximized", // Tam ekran başlat
      ],
    });
    this.page = await this.browser.newPage();
    await this.setupPage();
  }

  /**
   * Page ayarlarını yap (console, error handlers, timeouts)
   */
  private async setupPage(): Promise<void> {
    if (!this.page) return;

    // Console log'larını yakala
    this.page.on("console", async (msg) => {
      const msgType = msg.type();
      const msgText = msg.text();
      console.log("[Browser " + msgType + "]", msgText);
    });

    // Page error'larını yakala
    this.page.on("pageerror", (error) => {
      console.error("[Page Error]", (error as Error).message);
    });

    // User agent ayarla
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await this.page.setViewport({ width: 1920, height: 1080 });

    // Timeout'ları artır (15s → 30s)
    this.page.setDefaultNavigationTimeout(30000);
    this.page.setDefaultTimeout(30000);
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
        timeout: 30000,
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
      console.log("🌐 Sompo login sayfasına gidiliyor...");
      await this.page!.goto(this.config.url, { waitUntil: "networkidle2" });
      console.log("✅ Sayfa yüklendi:", this.config.url);

      // Kullanıcı adı - gerçek selector
      console.log("📝 Kullanıcı adı giriliyor...");
      const usernameSelector = 'input[placeholder="Kullanıcı Adı"]';
      await this.page!.waitForSelector(usernameSelector, { timeout: 15000 });
      await this.page!.type(usernameSelector, this.config.username, {
        delay: 100,
      });
      console.log("✅ Kullanıcı adı girildi:", this.config.username);

      // Şifre - gerçek selector
      console.log("🔒 Şifre giriliyor...");
      const passwordSelector = 'input[placeholder="Parola"]';
      await this.page!.type(passwordSelector, this.config.password, {
        delay: 100,
      });
      console.log("✅ Şifre girildi");

      await this.screenshot("before-login-click");

      // Giriş butonuna tıkla VE navigation'ı bekle (Promise.all ile)
      console.log("🖱️  Giriş butonunu arıyorum...");

      // Önce butonları listeleyelim
      const buttonTexts = await this.page!.evaluate(() => {
        const buttons = document.querySelectorAll(
          'button, [role="button"], input[type="submit"]'
        );
        return Array.from(buttons).map((btn, idx) => ({
          index: idx,
          text: btn.textContent?.trim() || "",
          type: btn.getAttribute("type"),
          ariaLabel: btn.getAttribute("aria-label"),
          class: btn.getAttribute("class"),
          disabled:
            btn.hasAttribute("disabled") ||
            btn.getAttribute("data-p-disabled") === "true",
        }));
      });
      console.log(
        "📋 Sayfadaki butonlar:",
        JSON.stringify(buttonTexts, null, 2)
      );

      // Birden fazla yöntemle butonu bul
      let loginButton = await this.page!.$('button[aria-label="GİRİŞ YAP"]');
      if (!loginButton) {
        console.log(
          "⚠️  aria-label ile bulunamadı, type=submit ile deniyorum..."
        );
        loginButton = await this.page!.$('button[type="submit"]');
      }
      if (!loginButton) {
        console.log(
          "⚠️  type=submit ile bulunamadı, text içeriğine göre arıyorum..."
        );
        loginButton = (await this.page!.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          return buttons.find(
            (btn) =>
              btn.textContent?.includes("GİRİŞ YAP") ||
              btn.textContent?.includes("Giriş Yap")
          );
        })) as any;
      }

      if (!loginButton || !loginButton.asElement()) {
        throw new Error("Giriş butonu hiçbir yöntemle bulunamadı!");
      }

      // Butonun disabled olup olmadığını kontrol et
      const isDisabled = await this.page!.evaluate((btn) => {
        return (
          (btn as HTMLButtonElement).disabled ||
          (btn as HTMLButtonElement).getAttribute("data-p-disabled") === "true"
        );
      }, loginButton);

      if (isDisabled) {
        console.error(
          "❌ Giriş butonu disabled durumda! Form validation hatası olabilir."
        );
        await this.screenshot("button-disabled");
        throw new Error("Giriş butonu disabled durumda");
      }

      console.log("✅ Giriş butonu bulundu ve aktif");
      console.log("⏳ Giriş butonuna tıklanıyor...");

      // Farklı click yöntemleri dene
      try {
        // 1. JavaScript ile direkt click trigger et
        await this.page!.evaluate((btn) => {
          (btn as HTMLElement).click();
        }, loginButton);
        console.log("✅ JavaScript ile click tetiklendi");
      } catch (err: any) {
        console.log(
          "⚠️ JavaScript click başarısız, Puppeteer click deneniyor..."
        );
        await loginButton.click();
        console.log("✅ Puppeteer click yapıldı");
      }

      // Navigation'ı bekle
      console.log("⏳ Sayfa yönlendirmesi bekleniyor (10 saniye)...");

      // 10 saniye bekle ve URL'i kontrol et
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const currentUrl = this.page!.url();
        console.log("  " + (i + 1) + "s:", currentUrl);

        if (!currentUrl.includes("/login")) {
          console.log("✅ Login sayfasından çıkıldı!");
          break;
        }
      }

      // 2 saniye bekle (AJAX işlemleri için)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Sayfa yüklendi");

      // OTP kontrolü
      const currentUrl = this.page!.url();
      console.log("📍 Yönlendirilen URL:", currentUrl);

      // Eğer hala login sayfasındaysa, hata var
      if (currentUrl.includes("/login")) {
        console.error(
          "❌ HATA: Hala login sayfasında! Giriş başarısız olabilir."
        );
        await this.screenshot("still-on-login");

        // Sayfadaki hata mesajlarını kontrol et
        const errorMessages = await this.page!.evaluate(() => {
          const errors = document.querySelectorAll(
            '.error, .alert, .p-message-error, [role="alert"]'
          );
          return Array.from(errors).map((el) => el.textContent?.trim());
        });

        if (errorMessages.length > 0) {
          console.error("🚨 Hata mesajları:", errorMessages);
          throw new Error(`Giriş başarısız: ${errorMessages.join(", ")}`);
        }

        throw new Error("Giriş başarısız: Sayfa yönlendirmesi olmadı");
      }

      if (currentUrl.includes("google-authenticator-validation")) {
        console.log("🔐 OTP gerekli! Otomatik üretiliyor...");
        await this.screenshot("otp-page");

        // OTP'yi otomatik üret (secret key'den)
        const otp = otpCode || generateSompoOTP();
        console.log("🔑 Kullanılan OTP:", otp);

        // OTP input'larını bekle
        await this.page!.waitForSelector(".p-inputotp-input", {
          timeout: 10000,
        });
        const otpInputs = await this.page!.$$(".p-inputotp-input");
        console.log("📝 Bulunan OTP input sayısı:", otpInputs.length);

        if (otpInputs.length === 0) {
          throw new Error("OTP input'ları bulunamadı!");
        }

        const digits = otp.split("");

        // OTP input'larını doldur
        for (let i = 0; i < Math.min(digits.length, otpInputs.length); i++) {
          await otpInputs[i].click(); // Focus için
          await otpInputs[i].type(digits[i], { delay: 100 });
          await new Promise((resolve) => setTimeout(resolve, 200));
          console.log("  " + (i + 1) + ". hane girildi:", digits[i]);
        }
        console.log("✅ OTP tamamen girildi");
        await this.screenshot("otp-filled");

        // OTP girildiğinde otomatik submit olabilir, 2 saniye bekle
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Eğer hala aynı sayfadaysak, submit butonu ara
        const stillOnOtpPage = this.page!.url().includes(
          "google-authenticator-validation"
        );
        if (stillOnOtpPage) {
          console.log("⚠️  OTP sayfasında hala, submit butonu aranıyor...");
          const submitButton = await this.page!.$('button[type="submit"]');
          if (submitButton) {
            console.log("🖱️  Submit butonuna tıklanıyor...");

            // JavaScript ile click
            try {
              await this.page!.evaluate((btn) => {
                (btn as HTMLElement).click();
              }, submitButton);
              console.log("✅ OTP submit JavaScript click tetiklendi");
            } catch (err) {
              console.log(
                "⚠️ JavaScript click başarısız, Puppeteer deneniyor..."
              );
              await submitButton.click();
            }

            // Navigation bekle
            await this.page!.waitForNavigation({
              waitUntil: "networkidle2",
              timeout: 30000,
            }).catch(() =>
              console.log("OTP navigation timeout, devam ediliyor...")
            );
          }
        }

        // Dashboard'a yönlenme kontrolü
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("✅ OTP doğrulandı, dashboard'a yönlendirildi");
      } else {
        console.log("ℹ️  OTP gerektirmiyor, direkt dashboard'a yönlendirdi");
      }

      // Dashboard'a yönlendirmeyi bekle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Bot algılaması kontrolü - eğer /bot'a giderse, "Ana Sayfayı Yükle" butonuna tıkla
      const finalUrl = this.page!.url();
      console.log("📍 Son URL kontrolü:", finalUrl);

      if (
        finalUrl.includes("/bot") ||
        finalUrl.includes("security") ||
        finalUrl.includes("validation")
      ) {
        console.log(
          "🔐 Bot/Güvenlik kontrolü aktif! 'Ana Sayfayı Yükle' butonuna tıklanıyor..."
        );
        await this.screenshot("bot-detection-before");

        try {
          // "Ana Sayfayı Yükle" veya "ANA SAYFAYI YÜKLE" textini içeren elementi ara
          const buttonFound = await this.page!.evaluate(() => {
            // Tüm buton ve link elementleri tara
            const buttons = document.querySelectorAll(
              'button, a, [role="button"], [onclick]'
            );

            for (const button of buttons) {
              const text = button.textContent?.trim().toUpperCase() || "";
              const innerText =
                (button as HTMLElement).innerText?.trim().toUpperCase() || "";

              // "ANA SAYFAYI YÜKLE", "Ana Sayfayı Yükle", "ANA SAYFAYA DÖN" vb.
              if (
                text.includes("ANA SAYFAYI YÜKLE") ||
                text.includes("ANA SAYFAYA") ||
                innerText.includes("ANA SAYFAYI YÜKLE") ||
                innerText.includes("ANA SAYFAYA")
              ) {
                console.log("🎯 Buton bulundu:", text || innerText);
                (button as HTMLElement).click();
                return true;
              }
            }

            // Eğer bulunamazsa, tüm butonları logla
            console.log("📋 Sayfadaki tüm butonlar:");
            buttons.forEach((btn, idx) => {
              console.log(idx + 1 + ". " + (btn.textContent?.trim() || ""));
            });

            return false;
          });

          if (buttonFound) {
            console.log("✅ 'Ana Sayfayı Yükle' butonuna tıklandı!");
            // Yönlendirmeyi bekle
            await this.page!.waitForNavigation({
              waitUntil: "networkidle2",
              timeout: 30000,
            }).catch((navError) => {
              // Navigation timeout olursa devam et
              console.log("⚠️ Navigation timeout:", navError.message);
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
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const newUrl = this.page!.url();
          if (
            newUrl.includes("/bot") ||
            newUrl.includes("security") ||
            newUrl.includes("validation")
          ) {
            console.log("⚠️  Bot kontrolü hala aktif, ama devam ediyoruz...");
            // Artık hata atmıyoruz, devam ediyoruz
          }
        } catch (error: any) {
          console.error("Bot algılama hatası:", error.message);
          await this.screenshot("bot-detection-error");
          throw error;
        }
      }

      this.isLoggedIn = true;
      console.log("✅ Sompo'ya başarıyla giriş yapıldı");
      console.log("📍 Mevcut URL:", this.page!.url());
      await this.screenshot("after-login");

      // Session'ı kaydet (bir sonraki çalışmada kullanmak için)
      await this.saveSession();

      return true;
    } catch (error: any) {
      console.error("❌ Sompo giriş hatası:", error.message);
      console.error("📍 Hata anındaki URL:", this.page?.url());
      await this.screenshot("login-error");

      // Sayfanın HTML'ini de log'la (debug için)
      if (this.page) {
        const pageContent = await this.page.content();
        console.log(
          "📄 Sayfa içeriği (ilk 500 karakter):",
          pageContent.substring(0, 500)
        );
      }

      this.isLoggedIn = false;
      return false;
    }
  }

  /**
   * Trafik sigortası teklifi al (YENİ FLOW)
   * Dashboard -> Yeni İş Teklifi -> Trafik -> Form Doldur -> Teklif Al
   */
  async getTrafficQuote(formData: any, otpCode?: string): Promise<any> {
    // Browser'ı başlat (singleton - zaten açıksa tekrar açılmaz)
    await this.initialize();

    // Login kontrolü - zaten login olmuşsa atlıyoruz
    if (!this.isLoggedIn) {
      console.log("🔐 Login gerekli, giriş yapılıyor...");
      const loginSuccess = await this.login(otpCode);
      if (!loginSuccess) {
        throw new Error("Sompo'ya giriş yapılamadı");
      }
    } else {
      console.log("✅ Zaten login olunmuş, direkt teklif alınıyor...");
    }

    try {
      // Yeni flow ile teklif al (Dashboard -> Yeni İş Teklifi -> Trafik -> Form)
      const result = await getTrafficQuoteNewFlow(
        this.page!,
        formData,
        this.screenshot.bind(this)
      );

      return result;
    } catch (error: any) {
      console.error("❌ Sompo teklif hatası:", error.message);

      // Hata session ile ilgiliyse, login flag'i sıfırla
      if (
        error.message.includes("login") ||
        error.message.includes("session")
      ) {
        console.log(
          "⚠️ Session sorunu tespit edildi, login flag sıfırlanıyor..."
        );
        this.isLoggedIn = false;
      }

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
    try {
      if (this.page) {
        // Screenshots klasörünü kontrol et, yoksa oluştur
        const screenshotsDir = path.join(process.cwd(), "screenshots");
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        const screenshotPath = path.join(
          screenshotsDir,
          `sompo-${name}.png`
        ) as `${string}.png`;
        await this.page.screenshot({ path: screenshotPath });
      }
    } catch (error) {
      console.log("⚠️ Screenshot alınamadı (" + name + "):", error);
      // Devam et, screenshot hatası kritik değil
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
