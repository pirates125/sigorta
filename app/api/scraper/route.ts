import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SompoScraper } from "@/lib/scrapers/sompo";
import { SompoQuoteProcessor } from "@/lib/processors/sompo-quote-processor";
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

    // Sompo için özel işleme
    let processedResult = result;
    let processedData: any = null;

    if (companyCode === "SOMPO" && result.success) {
      try {
        processedData = SompoQuoteProcessor.processQuoteResult(result);
        console.log(
          `[${companyCode}] Teklif işlendi: ${processedData.pricing.combined.totalWithTax} TL`
        );

        // Processed data'yı ScraperResult formatına dönüştür
        processedResult = {
          ...result,
          coverageDetails: processedData.coverage,
          responseData: {
            ...result.responseData,
            processedData: processedData,
          },
        };
      } catch (processError: any) {
        console.error(`[${companyCode}] İşleme hatası:`, processError.message);
        // İşleme hatası olsa bile ham sonucu kullan
      }
    }

    // Sonucu kaydet
    if (processedResult.success && processedResult.price > 0) {
      await prisma.quoteResponse.create({
        data: {
          quoteId,
          companyId,
          price: processedResult.price,
          currency: processedResult.currency,
          coverageDetails: processedResult.coverageDetails,
          responseData: processedResult.responseData,
        },
      });

      // Log kaydet
      await prisma.scraperLog.create({
        data: {
          companyId,
          insuranceType: insuranceType as any,
          status: "SUCCESS",
          duration,
          metadata: JSON.parse(
            JSON.stringify({
              result: processedResult,
              processingTime: new Date().toISOString(),
            })
          ),
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
          errorMessage: processedResult.error,
          metadata: JSON.parse(JSON.stringify({ result: processedResult })),
        },
      });
    }

    return NextResponse.json(
      {
        success: processedResult.success,
        companyName: processedResult.companyName,
        price: processedResult.price,
        currency: processedResult.currency,
        coverageDetails: processedResult.coverageDetails,
        responseData: processedResult.responseData,
        duration,
        processed: companyCode === "SOMPO", // Sompo için işlenmiş veri olduğunu belirt
        processedData: processedData, // İşlenmiş veri (sadece Sompo için)
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
