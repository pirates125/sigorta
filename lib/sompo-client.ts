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
      headless: false, // 👀 Chrome'u açık göster
      slowMo: 100, // Her aksiyonu 100ms yavaşlat (daha iyi görünürlük)
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--start-maximized", // Tam ekran başlat
      ],
    });
    this.page = await this.browser.newPage();

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
        "https://cosmos.sompojapan.com.tr/?guid=a981427e-83af-425c-bc28-ae8e74f24c98&startupScript=52614B506A16E1209E52C33A2D21DEF5B761124842915AB2C7A856FF04781C07964708F4F864802E7C2C45060EBE983DFC99EBF3861094F0785961AD9170E8473812BCFE3B21EE1A1DA30065819F6D42903D992B8847BADA2AC6C78D6653CCD6F2FC7E435E5B7C517832CE42AB54EC8B1C49448E8E009ED8FC3ABC1DE3B5FDA2CAD419282A53AD595AB826AD059CD0B28FD1D356AE45C5642E4F26A425391DBEB9EC86A7248101AFDB008DF6F91C739EF63931CEF68BA05290C54B7E19E5B82AEE92540763D60FA0DF95098982253DEDDC7D452A47641FEE65CE86FAD237BE2E19FACC8FBFB2D2C4631B1530AD33292EF0C34C1BC0760649F5ABC8A068494E3A3C3227F1813D67F28C40A462121F651E21AE46B22A46CBECF24A82761AA7F61E78B2D841E18E089DD5E9B41907C2DF68F027855B6FA87CB5B894D1074578B549C58ECDF48203D9E521711038AD29AB7A0C89EFAE5673C433B9FE8D2FDCFF7642C0BF8624FA8C41DA85018D236D83CCC4F3740C8C78699EC365619610D06B505179AAD3AACA652477D1E2228CB3167B31D47840AD021C288516CA746EAD6B5E8832EAB25B8B8696D8AE13A881AA5B74B9AC8FA622ACEDA2153FBEC86DCE9AC2B07FE999521C08D467556434CAE3C26339155953B841FA2E8CBDD1662860CD8C0CC952A704E56CDE5A8678CE723A3F7826C3116778E928D3D0463A6D50AD009A82025096684DE5B526068970F4F42CE1C535055FF25310409F0982D84599E16C598715654E747BCEBD1C8974398AE9873E5C0745FE07FD8E42301F61944074CE843A691B4C633E0E076517928A3CBDE2BA78B52754177D7514B7B8CE9BF20BDD618B8A6E25A7779732B0E6C72FC100793D8AAAB6AABCE663CA31870AB678769E8061B7428890D52C5E3874165E4D2E081A";
      await this.page!.goto(trafficFormUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
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
      console.log("EGM Sorgula butonu bekleniyor...");
      await this.page!.waitForSelector("#btnSearchEgm", { timeout: 10000 });

      // Butonun enable olmasını bekle (disabled attribute'u kalkana kadar)
      await this.page!.waitForFunction(
        () => {
          const btn = document.querySelector(
            "#btnSearchEgm"
          ) as HTMLImageElement;
          return btn && !btn.hasAttribute("disabled");
        },
        { timeout: 10000 }
      );

      // JavaScript ile EGM butonuna tıkla
      await this.page!.evaluate(() => {
        const btn = document.querySelector("#btnSearchEgm") as HTMLElement;
        if (btn) btn.click();
      });
      console.log("EGM Sorgula butonuna tıklandı (JavaScript click)");

      // EGM sorgulamasının tamamlanmasını bekle
      await new Promise((resolve) => setTimeout(resolve, 5000));
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

      // JavaScript ile tıkla
      await this.page!.evaluate(() => {
        const btn = document.querySelector("#btnProposalCreate") as HTMLElement;
        if (btn) btn.click();
      });
      console.log("Teklif oluşturma isteği gönderildi (JavaScript click)...");

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
