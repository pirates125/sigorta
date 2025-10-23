import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SompoScraper } from "@/lib/scrapers/sompo";
import { AnadoluScraper } from "@/lib/scrapers/anadolu";
import { AkScraper } from "@/lib/scrapers/ak";
import { AxaScraper } from "@/lib/scrapers/axa";
import { AllianzScraper } from "@/lib/scrapers/allianz";
import { HdiScraper } from "@/lib/scrapers/hdi";
import { QuickScraper } from "@/lib/scrapers/quick";
import { BaseScraper } from "@/lib/scrapers/base";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quoteId, companyId, companyCode, insuranceType, formData } = body;

    const startTime = Date.now();

    // Uygun scraper'ı seç
    let scraper: BaseScraper;
    switch (companyCode) {
      case "SOMPO":
        scraper = new SompoScraper();
        break;
      case "ANADOLU":
        scraper = new AnadoluScraper();
        break;
      case "AK":
        scraper = new AkScraper();
        break;
      case "AXA":
        scraper = new AxaScraper();
        break;
      case "ALLIANZ":
        scraper = new AllianzScraper();
        break;
      case "HDI":
        scraper = new HdiScraper();
        break;
      case "QUICK":
        scraper = new QuickScraper();
        break;
      default:
        throw new Error(`Desteklenmeyen şirket: ${companyCode}`);
    }

    // Scraper'ı çalıştır
    const result = await scraper.run(insuranceType, formData);
    const duration = Date.now() - startTime;

    // Sonucu kaydet
    if (result.success && result.price > 0) {
      await prisma.quoteResponse.create({
        data: {
          quoteId,
          companyId,
          price: result.price,
          currency: result.currency,
          coverageDetails: result.coverageDetails,
          responseData: result.responseData,
        },
      });

      // Log kaydet
      await prisma.scraperLog.create({
        data: {
          companyId,
          insuranceType: insuranceType as any,
          status: "SUCCESS",
          duration,
          metadata: JSON.parse(JSON.stringify({ result })),
        },
      });
    } else {
      // Hata logu
      await prisma.scraperLog.create({
        data: {
          companyId,
          insuranceType: insuranceType as any,
          status: "FAILED",
          duration,
          errorMessage: result.error,
          metadata: JSON.parse(JSON.stringify({ result })),
        },
      });
    }

    return NextResponse.json(
      {
        success: result.success,
        companyName: result.companyName,
        price: result.price,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Scraper API error:", error);

    // Hata durumunda da log kaydet
    try {
      const { quoteId, companyId, insuranceType } = await req.json();
      await prisma.scraperLog.create({
        data: {
          companyId,
          insuranceType: insuranceType as any,
          status: "FAILED",
          duration: 0,
          errorMessage: error.message,
        },
      });
    } catch (logError) {
      console.error("Failed to log scraper error:", logError);
    }

    return NextResponse.json(
      { message: "Scraper hatası", error: error.message },
      { status: 500 }
    );
  }
}
