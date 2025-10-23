/**
 * Sompo Sigorta - Yeni Trafik Teklifi Flow
 * Dashboard -> Yeni İş Teklifi -> Trafik -> Form Doldur -> Teklif Al
 */

import { Page } from "puppeteer";

export async function getTrafficQuoteNewFlow(
  page: Page,
  formData: any,
  screenshot: (name: string) => Promise<void>
): Promise<any> {
  try {
    console.log("🚗 Trafik sigortası teklifi alınıyor (Yeni Flow)...");

    // 1. "YENİ İŞ TEKLİFİ" butonuna tıkla
    console.log("📋 Yeni İş Teklifi...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) =>
        b.textContent?.includes("YENİ İŞ TEKLİFİ")
      );
      if (btn) (btn as HTMLElement).click();
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. "Trafik" seçeneğine tıkla
    console.log("🚦 Trafik...");
    await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll(".job__name"));
      const trafficDiv = divs.find((div) =>
        div.textContent?.includes("Trafik")
      );
      if (trafficDiv) {
        const parent = trafficDiv.closest('[class*="job"]');
        if (parent) {
          (parent as HTMLElement).click();
        } else {
          (trafficDiv as HTMLElement).click();
        }
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3. "TEKLİF AL" butonuna tıkla
    console.log("📝 Teklif Al...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.includes("TEKLİF AL"));
      if (btn) (btn as HTMLElement).click();
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await screenshot("traffic-form-opened");

    // 4. Kasko checkbox'ını KALDIR (eğer seçiliyse)
    console.log("🔲 Checkbox'ları ayarlıyorum...");
    await page.evaluate(() => {
      const kaskoCheckbox = document.querySelector(
        "#chkCasco"
      ) as HTMLInputElement;
      if (kaskoCheckbox && kaskoCheckbox.checked) {
        kaskoCheckbox.click();
      }
    });

    // 5. Trafik checkbox'ını SEÇ (eğer seçili değilse)
    await page.evaluate(() => {
      const trafficCheckbox = document.querySelector(
        "#chkTraffic"
      ) as HTMLInputElement;
      if (trafficCheckbox && !trafficCheckbox.checked) {
        trafficCheckbox.click();
      }
    });
    console.log("✅ Checkbox'lar ayarlandı");

    // 6. TC Kimlik No gir - Dinamik selector bulma
    console.log("🆔 TC Kimlik alanı aranıyor...");
    const tcInput = await page.evaluate(() => {
      // Farklı yöntemlerle TC input'u bul
      let input = document.querySelector(
        "#txtIdentityOrTaxNo"
      ) as HTMLInputElement;
      if (input) return { found: true, method: "id" };

      // Placeholder ile ara
      input = document.querySelector(
        'input[placeholder*="Kimlik"]'
      ) as HTMLInputElement;
      if (input) return { found: true, method: "placeholder" };

      // Label ile ara
      const labels = Array.from(document.querySelectorAll("label"));
      const tcLabel = labels.find(
        (l) =>
          l.textContent?.includes("TC") || l.textContent?.includes("Kimlik")
      );
      if (tcLabel) {
        const inputId = tcLabel.getAttribute("for");
        if (inputId) {
          input = document.querySelector(`#${inputId}`) as HTMLInputElement;
          if (input) return { found: true, method: "label" };
        }
      }

      // Name attribute ile ara
      input = document.querySelector(
        'input[name*="identity"]'
      ) as HTMLInputElement;
      if (input) return { found: true, method: "name" };

      return { found: false, method: "none" };
    });

    if (!tcInput.found) {
      console.error("❌ TC Kimlik input'u bulunamadı!");
      await screenshot("tc-input-not-found");
      throw new Error("TC Kimlik input alanı bulunamadı");
    }

    console.log("✅ TC input bulundu:", tcInput.method);

    // TC'yi gir - farklı methodlarla dene
    await page.evaluate((tcNo) => {
      const inputs = document.querySelectorAll("input");
      for (const input of inputs) {
        const placeholder =
          input.getAttribute("placeholder")?.toLowerCase() || "";
        const name = input.getAttribute("name")?.toLowerCase() || "";
        const id = input.getAttribute("id")?.toLowerCase() || "";

        if (
          id.includes("identity") ||
          id.includes("kimlik") ||
          id.includes("tc") ||
          placeholder.includes("kimlik") ||
          placeholder.includes("tc") ||
          name.includes("identity")
        ) {
          input.value = tcNo;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return true;
        }
      }
      return false;
    }, formData.driverTCKN);

    console.log("✅ TC Kimlik girildi:", formData.driverTCKN);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Otomatik doldurma için kısa bekle

    // 7. Plaka bilgilerini gir
    console.log("🚘 Plaka bilgileri giriliyor...");
    const plateParts = formData.plate.match(/^(\d{2})([A-Z]+)(\d+)$/i);
    if (!plateParts) {
      throw new Error("Geçersiz plaka formatı: " + formData.plate);
    }

    await page.evaluate(
      (cityCode, plateNo) => {
        // Şehir kodu
        const cityInput = document.querySelector(
          "#txtPlateNoCityNo"
        ) as HTMLInputElement;
        if (cityInput) {
          cityInput.value = cityCode;
          cityInput.dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Plaka
        const plateInput = document.querySelector(
          "#txtPlateNo"
        ) as HTMLInputElement;
        if (plateInput) {
          plateInput.value = plateNo;
          plateInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      },
      plateParts[1],
      plateParts[2] + plateParts[3]
    );
    console.log("✅ Plaka:", plateParts[1], plateParts[2] + plateParts[3]);

    // 8. Tescil Seri Kod ve Tescil No - Hızlı doldur
    await page.evaluate(
      (regCode, regNumber) => {
        // Tescil Seri Kod
        const regCodeInput = document.querySelector(
          "#txtEGMNoCode"
        ) as HTMLInputElement;
        if (regCodeInput && regCode) {
          regCodeInput.value = regCode;
          regCodeInput.dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Tescil No
        const regNoInput = document.querySelector(
          "#txtEGMNoNumber"
        ) as HTMLInputElement;
        if (regNoInput && regNumber) {
          regNoInput.value = regNumber;
          regNoInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      },
      formData.registrationCode || "",
      formData.registrationNumber || ""
    );
    console.log("✅ Tescil bilgileri girildi");

    // 9. EGM Sorgula - Dinamik ve hızlı
    console.log("🔍 EGM Sorgula...");
    const egmClicked = await page.evaluate(() => {
      const btn = document.querySelector("#btnSearchEgm") as HTMLElement;
      if (btn && !btn.hasAttribute("disabled")) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!egmClicked) {
      console.log("⏳ EGM butonu henüz aktif değil, bekleniyor...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.evaluate(() => {
        const btn = document.querySelector("#btnSearchEgm") as HTMLElement;
        if (btn) btn.click();
      });
    }

    console.log("✅ EGM Sorgula tıklandı");

    // Kısa bekle - EGM sonucu için
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await screenshot("after-egm-query");

    // 11. Adres ve telefon otomatik dolduruldu mu kontrol et
    console.log("📍 Adres ve telefon bilgileri kontrol ediliyor...");
    const autoFilledInfo = await page.evaluate(() => {
      const addressField = document.querySelector(
        "#txtCustAddress"
      ) as HTMLTextAreaElement;
      const phoneAreaCode = document.querySelector(
        "#txtInsuredGsmAreaCode"
      ) as HTMLInputElement;
      const phoneNumber = document.querySelector(
        "#txtInsuredGsmNumber"
      ) as HTMLInputElement;

      return {
        addressFilled: addressField && addressField.value.length > 0,
        phoneFilled: phoneAreaCode && phoneAreaCode.value.length > 0,
        address: addressField?.value || "",
        phone: (phoneAreaCode?.value || "") + (phoneNumber?.value || ""),
      };
    });
    console.log("✅ Adres otomatik dolduruldu:", autoFilledInfo.addressFilled);
    console.log("✅ Telefon otomatik dolduruldu:", autoFilledInfo.phoneFilled);
    if (autoFilledInfo.addressFilled) {
      console.log(
        "  📍 Adres:",
        autoFilledInfo.address.substring(0, 50) + "..."
      );
    }
    if (autoFilledInfo.phoneFilled) {
      console.log("  📞 Telefon:", autoFilledInfo.phone);
    }

    // 10. Teklif Oluştur butonuna tıkla
    console.log("💼 Teklif Oluştur...");
    await page.evaluate(() => {
      const link = document.querySelector("#btnProposalCreate") as HTMLElement;
      if (link) link.click();
    });
    console.log("✅ Teklif oluşturma isteği gönderildi");

    // 11. Teklif sonucu için akıllı bekle - Her 500ms'de kontrol et
    console.log("⏳ Teklif sonucu bekleniyor (maksimum 30 saniye)...");
    let proposalFound = false;
    let attempts = 0;
    const maxAttempts = 60; // 60 * 500ms = 30 saniye

    while (!proposalFound && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;

      proposalFound = await page.evaluate(() => {
        const cascoContainer = document.querySelector(
          "#loadedDivCascoProposal2"
        );
        const trafficContainer = document.querySelector(
          "#loadedDivTrafficProposalAlternative"
        );

        return (
          (cascoContainer &&
            (cascoContainer as HTMLElement).style.display !== "none") ||
          (trafficContainer &&
            (trafficContainer as HTMLElement).style.display !== "none")
        );
      });

      if (proposalFound) {
        console.log("✅ Teklif sonucu hazır! (" + attempts * 0.5 + " saniye)");
        break;
      }

      // Her 5 saniyede bir log
      if (attempts % 10 === 0) {
        console.log("  ⏳ " + attempts * 0.5 + " saniye geçti...");
      }
    }

    if (!proposalFound) {
      console.warn("⚠️ Teklif sonucu görünmedi, devam ediliyor...");
    }

    await screenshot("waiting-for-proposal");

    // 14. Sonuçları çek (önce Kasko container'ından, yoksa Trafik Alternative'den)
    const result = await page.evaluate(() => {
      // İlk önce Kasko teklifi container'ına bak (loadedDivCascoProposal2)
      const cascoContainer = document.querySelector("#loadedDivCascoProposal2");
      if (
        cascoContainer &&
        (cascoContainer as HTMLElement).style.display !== "none"
      ) {
        const priceEl = document.querySelector(
          "#lblCascoProposal2GrossPremium"
        );
        const proposalNoEl = document.querySelector(
          "#lblCascoProposal2TransactionNo"
        );
        const installmentEl = document.querySelector(
          "#lblCascoInstallmentPlanName"
        );

        return {
          found: true,
          type: "KASKO",
          price: priceEl?.textContent?.trim() || "",
          proposalNo: proposalNoEl?.textContent?.trim() || "",
          installment: installmentEl?.textContent?.trim() || "",
          commission: "",
          commissionRate: "",
        };
      }

      // Eğer Kasko yoksa, Trafik Alternative container'ına bak
      const trafficContainer = document.querySelector(
        "#loadedDivTrafficProposalAlternative"
      );
      if (
        trafficContainer &&
        (trafficContainer as HTMLElement).style.display !== "none"
      ) {
        const priceEl = document.querySelector(
          "#lblTrafficProposalGrossPremiumAlternative"
        );
        const proposalNoEl = document.querySelector(
          "#lblTrafficProposalStartEndDateOrProposalNoAlternative"
        );
        const commissionAmountEl = document.querySelector(
          "#lblTrafficProposalCommisionAmountAlternative"
        );
        const commissionRatioEl = document.querySelector(
          "#lblTrafficProposalCommisionRatioAlternative"
        );

        return {
          found: true,
          type: "TRAFFIC",
          price: priceEl?.textContent?.trim() || "",
          proposalNo: proposalNoEl?.textContent?.trim() || "",
          commission: commissionAmountEl?.textContent?.trim() || "",
          commissionRate: commissionRatioEl?.textContent?.trim() || "",
          installment: "",
        };
      }

      return {
        found: false,
        type: "",
        price: "",
        proposalNo: "",
        commission: "",
        commissionRate: "",
        installment: "",
      };
    });

    if (!result.found) {
      console.error("❌ Teklif sonucu bulunamadı!");
      await screenshot("proposal-not-found");
      throw new Error("Teklif sonucu sayfada bulunamadı");
    }

    console.log("✅ Teklif sonucu bulundu!");
    console.log("  Tip:", result.type);
    console.log("  Teklif No:", result.proposalNo);
    console.log("  Fiyat:", result.price);
    if (result.commission) console.log("  Komisyon:", result.commission);
    if (result.commissionRate)
      console.log("  Komisyon Oranı:", result.commissionRate);
    if (result.installment) console.log("  Taksit:", result.installment);

    await screenshot("proposal-result");

    // Fiyatı parse et (örn: "18.165,99 TL" -> 18165.99)
    const priceMatch = result.price.match(/[\d.,]+/);
    const price = priceMatch
      ? parseFloat(priceMatch[0].replace(/\./g, "").replace(",", "."))
      : 0;

    // Komisyon tutarını parse et
    const commissionMatch = result.commission.match(/[\d.,]+/);
    const commissionAmount = commissionMatch
      ? parseFloat(commissionMatch[0].replace(/\./g, "").replace(",", "."))
      : 0;

    return {
      success: true,
      company: "Sompo Sigorta",
      price: price,
      currency: "TRY",
      policyNumber: result.proposalNo,
      coverages: result.type === "KASKO" ? ["Kasko"] : ["Trafik Sigortası"],
      details: {
        proposalNo: result.proposalNo,
        grossPremium: result.price,
        commission: result.commission,
        commissionRate: result.commissionRate,
        commissionAmount: commissionAmount,
        installment: result.installment,
        type: result.type,
      },
      rawData: result,
    };
  } catch (error: any) {
    console.error("❌ Trafik teklifi alma hatası:", error.message);
    await screenshot("traffic-quote-error");
    throw error;
  }
}
