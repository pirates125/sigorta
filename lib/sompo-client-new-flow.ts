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
    console.log("📋 Yeni İş Teklifi butonunu arıyorum...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) =>
        b.textContent?.includes("YENİ İŞ TEKLİFİ")
      );
      if (btn) (btn as HTMLElement).click();
    });
    console.log("✅ Yeni İş Teklifi butonuna tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await screenshot("after-new-proposal-click");

    // 2. "Trafik" seçeneğine tıkla
    console.log("🚦 Trafik seçeneğini arıyorum...");
    await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll(".job__name"));
      const trafficDiv = divs.find((div) =>
        div.textContent?.includes("Trafik")
      );
      if (trafficDiv) {
        // Parent'a tıkla (tüm card'a tıklamak için)
        const parent = trafficDiv.closest('[class*="job"]');
        if (parent) {
          (parent as HTMLElement).click();
        } else {
          (trafficDiv as HTMLElement).click();
        }
      }
    });
    console.log("✅ Trafik seçeneğine tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. "TEKLİF AL" butonuna tıkla
    console.log("📝 Teklif Al butonunu arıyorum...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.includes("TEKLİF AL"));
      if (btn) (btn as HTMLElement).click();
    });
    console.log("✅ Teklif Al butonuna tıklandı");
    await new Promise((resolve) => setTimeout(resolve, 3000));
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

    // 6. TC Kimlik No gir
    console.log("🆔 TC Kimlik giriliyor...");
    await page.waitForSelector("#txtIdentityOrTaxNo", { timeout: 10000 });
    await page.click("#txtIdentityOrTaxNo", { clickCount: 3 }); // Seç ve temizle
    await page.type("#txtIdentityOrTaxNo", formData.driverTCKN, { delay: 50 });
    console.log("✅ TC Kimlik girildi:", formData.driverTCKN);

    // TC girildikten sonra 2 saniye bekle (otomatik adres ve telefon doldurması için)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("⏳ TC'den otomatik bilgiler dolduruldu (adres, telefon)...");

    // 7. Plaka bilgilerini gir (şehir kodu + plaka)
    console.log("🚘 Plaka bilgileri giriliyor...");
    const plateParts = formData.plate.match(/^(\d{2})([A-Z]+)(\d+)$/i);
    if (!plateParts) {
      throw new Error("Geçersiz plaka formatı: " + formData.plate);
    }

    await page.click("#txtPlateNoCityNo");
    await page.type("#txtPlateNoCityNo", plateParts[1], { delay: 50 });
    console.log("  Şehir kodu:", plateParts[1]);

    await page.click("#txtPlateNo");
    await page.type("#txtPlateNo", plateParts[2] + plateParts[3], {
      delay: 50,
    });
    console.log("  Plaka:", plateParts[2] + plateParts[3]);

    // 8. Tescil Seri Kod gir (varsa)
    if (formData.registrationCode) {
      console.log("📄 Tescil Seri Kod giriliyor...");
      await page.click("#txtEGMNoCode");
      await page.type("#txtEGMNoCode", formData.registrationCode, {
        delay: 50,
      });
      console.log("✅ Tescil Seri Kod girildi:", formData.registrationCode);
    }

    // 9. Tescil/ASBIS No gir
    if (formData.registrationNumber) {
      console.log("📄 Tescil No giriliyor...");
      await page.click("#txtEGMNoNumber");
      await page.type("#txtEGMNoNumber", formData.registrationNumber, {
        delay: 50,
      });
      console.log("✅ Tescil No girildi:", formData.registrationNumber);
    }

    // 10. EGM Sorgula butonuna tıkla
    console.log("🔍 EGM Sorgula butonu bekleniyor...");
    await page.waitForSelector("#btnSearchEgm", { timeout: 10000 });

    // Butonun enable olmasını bekle
    await page.waitForFunction(
      () => {
        const btn = document.querySelector("#btnSearchEgm") as HTMLImageElement;
        return btn && !btn.hasAttribute("disabled");
      },
      { timeout: 10000 }
    );

    // JavaScript ile EGM butonuna tıkla
    await page.evaluate(() => {
      const btn = document.querySelector("#btnSearchEgm") as HTMLElement;
      if (btn) btn.click();
    });
    console.log("✅ EGM Sorgula butonuna tıklandı");

    // EGM sorgulamasının tamamlanmasını bekle
    await new Promise((resolve) => setTimeout(resolve, 5000));
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

    // 12. Teklif Oluştur butonuna tıkla
    console.log("💼 Teklif Oluştur butonuna tıklanıyor...");
    await page.waitForSelector("#btnProposalCreate", { timeout: 5000 });

    // JavaScript ile tıkla
    await page.evaluate(() => {
      const link = document.querySelector("#btnProposalCreate") as HTMLElement;
      if (link) link.click();
    });
    console.log("✅ Teklif oluşturma isteği gönderildi");

    // 13. Teklif sonucunu bekle - İki farklı container'dan birini bekle
    console.log("⏳ Teklif sonucu bekleniyor...");
    await new Promise((resolve) => setTimeout(resolve, 8000)); // 8 saniye bekle
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
