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
    console.log("🚗 Trafik sigortası teklifi alınıyor...");

    // 1. Mevcut URL'i logla
    const currentUrl = page.url();
    console.log("📍 Başlangıç URL:", currentUrl);

    await screenshot("01-start");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. "YENİ İŞ TEKLİFİ" butonunu bul ve tıkla
    console.log("📋 YENİ İŞ TEKLİFİ butonu aranıyor...");

    const newProposalClicked = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll("button, a, [role='button']")
      );
      for (const btn of buttons) {
        const text = btn.textContent?.toUpperCase() || "";
        if (
          text.includes("YENİ İŞ") ||
          text.includes("YENI") ||
          text.includes("TEKLİF")
        ) {
          (btn as HTMLElement).click();
          return true;
        }
      }
      return false;
    });

    if (!newProposalClicked) {
      throw new Error("YENİ İŞ TEKLİFİ butonu bulunamadı");
    }

    console.log("✅ YENİ İŞ TEKLİFİ tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("📍 URL:", page.url());
    await screenshot("02-new-proposal-clicked");

    // 3. "Trafik" seçeneğini bul ve tıkla
    console.log("🚦 Trafik seçeneği aranıyor...");

    const trafficClicked = await page.evaluate(() => {
      // job__name class'ı
      const jobDivs = Array.from(
        document.querySelectorAll(".job__name, [class*='job']")
      );
      for (const div of jobDivs) {
        const text = div.textContent?.toUpperCase() || "";
        if (text.includes("TRAFİK") || text.includes("TRAFFIC")) {
          // Parent veya kendisine tıkla
          const clickable = div.closest("[class*='job']") || div;
          (clickable as HTMLElement).click();
          return true;
        }
      }

      // Alternatif - tüm clickable elementler
      const allClickables = Array.from(
        document.querySelectorAll("div, button, a")
      );
      for (const el of allClickables) {
        const text = el.textContent?.toUpperCase() || "";
        if (text.trim() === "TRAFİK" || text.trim() === "TRAFFIC") {
          (el as HTMLElement).click();
          return true;
        }
      }
      return false;
    });

    if (!trafficClicked) {
      throw new Error("Trafik seçeneği bulunamadı");
    }

    console.log("✅ Trafik tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("📍 URL:", page.url());
    await screenshot("03-traffic-clicked");

    // 4. "TEKLİF AL" butonunu bul ve tıkla
    console.log("📝 TEKLİF AL butonu aranıyor...");

    const quoteButtonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a"));
      for (const btn of buttons) {
        const text = btn.textContent?.toUpperCase() || "";
        if (text.includes("TEKLİF AL") || text.includes("TEKLIF AL")) {
          (btn as HTMLElement).click();
          return true;
        }
      }
      return false;
    });

    if (!quoteButtonClicked) {
      throw new Error("TEKLİF AL butonu bulunamadı");
    }

    console.log("✅ TEKLİF AL tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("📍 URL:", page.url());
    await screenshot("04-form-opened");

    // 5. Checkbox'ları ayarla
    console.log("🔲 Checkbox'lar ayarlanıyor...");
    await page.evaluate(() => {
      const kaskoCheckbox = document.querySelector(
        "#chkCasco"
      ) as HTMLInputElement;
      if (kaskoCheckbox?.checked) {
        kaskoCheckbox.click();
      }

      const trafficCheckbox = document.querySelector(
        "#chkTraffic"
      ) as HTMLInputElement;
      if (trafficCheckbox && !trafficCheckbox.checked) {
        trafficCheckbox.click();
      }
    });

    // 6. TC Kimlik No gir
    console.log("🆔 TC Kimlik giriliyor...");
    const tcFilled = await page.evaluate((tcNo) => {
      const inputs = document.querySelectorAll("input");
      for (const input of inputs) {
        const id = input.getAttribute("id")?.toLowerCase() || "";
        const placeholder =
          input.getAttribute("placeholder")?.toLowerCase() || "";
        const name = input.getAttribute("name")?.toLowerCase() || "";

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
          input.dispatchEvent(new Event("blur", { bubbles: true }));
          return true;
        }
      }
      return false;
    }, formData.driverTCKN);

    if (!tcFilled) {
      throw new Error("TC Kimlik input alanı bulunamadı");
    }

    console.log("✅ TC:", formData.driverTCKN);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await screenshot("05-tc-filled");

    // 7. Plaka gir
    console.log("🚘 Plaka giriliyor...");
    const plateParts = formData.plate.match(/^(\d{2})([A-Z]+)(\d+)$/i);
    if (!plateParts) {
      throw new Error("Geçersiz plaka: " + formData.plate);
    }

    await page.evaluate(
      (cityCode, plateNo) => {
        const cityInput = document.querySelector(
          "#txtPlateNoCityNo"
        ) as HTMLInputElement;
        if (cityInput) {
          cityInput.value = cityCode;
          cityInput.dispatchEvent(new Event("input", { bubbles: true }));
          cityInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        const plateInput = document.querySelector(
          "#txtPlateNo"
        ) as HTMLInputElement;
        if (plateInput) {
          plateInput.value = plateNo;
          plateInput.dispatchEvent(new Event("input", { bubbles: true }));
          plateInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
      },
      plateParts[1],
      plateParts[2] + plateParts[3]
    );
    console.log("✅ Plaka:", formData.plate);

    // 8. Tescil bilgileri
    await page.evaluate(
      (regCode, regNumber) => {
        const regCodeInput = document.querySelector(
          "#txtEGMNoCode"
        ) as HTMLInputElement;
        if (regCodeInput && regCode) {
          regCodeInput.value = regCode;
          regCodeInput.dispatchEvent(new Event("input", { bubbles: true }));
        }

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
    await screenshot("06-all-inputs-filled");

    // 9. EGM Sorgula
    console.log("🔍 EGM Sorgula...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.evaluate(() => {
      const btn = document.querySelector("#btnSearchEgm") as HTMLElement;
      if (btn) btn.click();
    });

    console.log("✅ EGM Sorgula tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await screenshot("07-egm-queried");

    // 10. Teklif Oluştur
    console.log("💼 Teklif Oluştur...");
    await page.evaluate(() => {
      const btn = document.querySelector("#btnProposalCreate") as HTMLElement;
      if (btn) btn.click();
    });

    console.log("✅ Teklif Oluştur tıklandı");

    // 11. Sonuç için akıllı bekle
    console.log("⏳ Teklif sonucu bekleniyor...");
    let proposalFound = false;

    for (let i = 0; i < 60; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      proposalFound = await page.evaluate(() => {
        const cascoDiv = document.querySelector("#loadedDivCascoProposal2");
        const trafficDiv = document.querySelector(
          "#loadedDivTrafficProposalAlternative"
        );

        return (
          (cascoDiv && (cascoDiv as HTMLElement).style.display !== "none") ||
          (trafficDiv && (trafficDiv as HTMLElement).style.display !== "none")
        );
      });

      if (proposalFound) {
        console.log("✅ Teklif hazır! (" + i * 0.5 + " saniye)");
        break;
      }

      if (i % 10 === 0 && i > 0) {
        console.log("  ⏳ " + i * 0.5 + " saniye...");
      }
    }

    await screenshot("08-proposal-result");

    // 12. Sonuçları çek
    const result = await page.evaluate(() => {
      const cascoDiv = document.querySelector("#loadedDivCascoProposal2");
      if (cascoDiv && (cascoDiv as HTMLElement).style.display !== "none") {
        return {
          found: true,
          type: "KASKO",
          price:
            document
              .querySelector("#lblCascoProposal2GrossPremium")
              ?.textContent?.trim() || "",
          proposalNo:
            document
              .querySelector("#lblCascoProposal2TransactionNo")
              ?.textContent?.trim() || "",
          installment:
            document
              .querySelector("#lblCascoInstallmentPlanName")
              ?.textContent?.trim() || "",
          commission: "",
          commissionRate: "",
        };
      }

      const trafficDiv = document.querySelector(
        "#loadedDivTrafficProposalAlternative"
      );
      if (trafficDiv && (trafficDiv as HTMLElement).style.display !== "none") {
        return {
          found: true,
          type: "TRAFFIC",
          price:
            document
              .querySelector("#lblTrafficProposalGrossPremiumAlternative")
              ?.textContent?.trim() || "",
          proposalNo:
            document
              .querySelector(
                "#lblTrafficProposalStartEndDateOrProposalNoAlternative"
              )
              ?.textContent?.trim() || "",
          commission:
            document
              .querySelector("#lblTrafficProposalCommisionAmountAlternative")
              ?.textContent?.trim() || "",
          commissionRate:
            document
              .querySelector("#lblTrafficProposalCommisionRatioAlternative")
              ?.textContent?.trim() || "",
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
      console.log("📍 Son URL:", page.url());
      throw new Error("Teklif sonucu bulunamadı");
    }

    console.log("✅ Sonuç:", result.type, result.price);
    console.log("📍 Son URL:", page.url());

    // Parse price
    const priceMatch = result.price.match(/[\d.,]+/);
    const price = priceMatch
      ? parseFloat(priceMatch[0].replace(/\./g, "").replace(",", "."))
      : 0;

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
    console.error("❌ Hata:", error.message);
    await screenshot("error");
    throw error;
  }
}
