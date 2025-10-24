import { NextResponse } from "next/server";
import { SompoScraper } from "@/lib/scrapers/sompo";
import { TrafficInsuranceFormData } from "@/types";

/**
 * Sompo Sigorta Özel Teklif API
 *
 * Bu endpoint sadece Sompo için optimize edilmiş teklif alma işlemi yapar.
 * Matematiksel hesaplamalar ve detaylı analiz içerir.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      quoteId,
      companyId,
      formData,
    }: {
      quoteId: string;
      companyId: string;
      formData: TrafficInsuranceFormData;
    } = body;

    console.log(`[Sompo API] Teklif isteği alındı - Quote ID: ${quoteId}`);

    // Form validasyonu
    const validation = validateTrafficForm(formData);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Form validasyon hatası",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Sompo scraper'ı başlat
    const scraper = new SompoScraper();

    try {
      // Scraping işlemini çalıştır
      const rawResult = await scraper.run("TRAFFIC", formData);
      const scrapingDuration = Date.now() - startTime;

      if (!rawResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: rawResult.error || "Scraping hatası",
            duration: scrapingDuration,
          },
          { status: 500 }
        );
      }

      // Ham sonucu döndür (matematik işlemi yok)
      const totalDuration = Date.now() - startTime;

      console.log(
        `[Sompo API] Teklif başarıyla alındı - Süre: ${totalDuration}ms`
      );

      // Ham veri yanıtı döndür
      return NextResponse.json({
        success: true,
        companyCode: "SOMPO",
        companyName: "Sompo Sigorta",
        quoteId,
        price: rawResult.price,
        currency: rawResult.currency,
        coverageDetails: rawResult.coverageDetails,
        responseData: rawResult.responseData,
        duration: totalDuration,
        metadata: {
          scrapingDuration,
          totalDuration,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (scrapingError: any) {
      console.error("[Sompo API] Scraping hatası:", scrapingError.message);

      return NextResponse.json(
        {
          success: false,
          error: "Sompo scraping hatası",
          details: scrapingError.message,
          duration: Date.now() - startTime,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Sompo API] Genel hata:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Trafik sigortası form validasyonu
 */
function validateTrafficForm(formData: TrafficInsuranceFormData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Zorunlu alanlar
  if (!formData.plate || formData.plate.trim().length === 0) {
    errors.push("Araç plakası zorunludur");
  } else if (!isValidPlate(formData.plate)) {
    errors.push("Geçersiz plaka formatı (örn: 34ABC123)");
  }

  if (
    !formData.registrationCode ||
    formData.registrationCode.trim().length === 0
  ) {
    errors.push("Tescil seri kodu zorunludur");
  } else if (formData.registrationCode.length !== 3) {
    errors.push("Tescil seri kodu 3 karakter olmalıdır");
  }

  if (
    !formData.registrationNumber ||
    formData.registrationNumber.trim().length === 0
  ) {
    errors.push("Tescil/ASBIS numarası zorunludur");
  } else if (formData.registrationNumber.length > 19) {
    errors.push("Tescil/ASBIS numarası 19 karakterden fazla olamaz");
  }

  if (!formData.driverTCKN || formData.driverTCKN.trim().length === 0) {
    errors.push("Sürücü TC kimlik numarası zorunludur");
  } else if (!isValidTCKN(formData.driverTCKN)) {
    errors.push("Geçersiz TC kimlik numarası");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Plaka formatı kontrolü
 */
function isValidPlate(plate: string): boolean {
  const cleanPlate = plate.replace(/\s/g, "").toUpperCase();
  // Türk plaka formatı: 34ABC123
  const plateRegex = /^\d{2}[A-Z]{1,3}\d{2,4}$/;
  return plateRegex.test(cleanPlate);
}

/**
 * TC Kimlik numarası kontrolü
 */
function isValidTCKN(tckn: string): boolean {
  const cleanTCKN = tckn.replace(/\s/g, "");

  // 11 haneli olmalı ve sadece rakam içermeli
  if (!/^\d{11}$/.test(cleanTCKN)) {
    return false;
  }

  // TC Kimlik algoritması kontrolü
  const digits = cleanTCKN.split("").map(Number);

  // İlk hane 0 olamaz
  if (digits[0] === 0) {
    return false;
  }

  // 10. hane kontrolü
  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const check1 = (sum1 - sum2) % 10;

  if (check1 !== digits[9]) {
    return false;
  }

  // 11. hane kontrolü
  const sum3 =
    digits[0] +
    digits[1] +
    digits[2] +
    digits[3] +
    digits[4] +
    digits[5] +
    digits[6] +
    digits[7] +
    digits[8] +
    digits[9];
  const check2 = sum3 % 10;

  return check2 === digits[10];
}
