import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateAccessToken } from "@/lib/utils";
import { z } from "zod";

const quoteRequestSchema = z.object({
  insuranceType: z.enum(["TRAFFIC", "KASKO", "DASK", "HEALTH"]),
  formData: z.record(z.string(), z.any()),
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const validatedData = quoteRequestSchema.parse(body);
    const { insuranceType, formData, email } = validatedData;

    // Access token oluştur (misafir kullanıcılar için)
    const accessToken = generateAccessToken();

    // Quote oluştur
    const quote = await prisma.quote.create({
      data: {
        userId: session?.user?.id,
        guestEmail: !session?.user?.id ? email : null,
        insuranceType,
        formData,
        accessToken: !session?.user?.id ? accessToken : null,
        status: "PROCESSING",
      },
    });

    // Scraper'ları başlat (arka planda)
    // Bu işlemi asenkron olarak yapacağız
    startScrapers(quote.id, insuranceType, formData);

    return NextResponse.json(
      {
        message: "Teklif isteği alındı",
        quoteId: quote.id,
        accessToken: !session?.user?.id ? accessToken : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Quote error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        responses: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Get quotes error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

// Scraper'ları başlat (arka plan işlemi)
async function startScrapers(
  quoteId: string,
  insuranceType: string,
  formData: any
) {
  try {
    // Aktif şirketleri al
    const companies = await prisma.insuranceCompany.findMany({
      where: {
        scraperEnabled: true,
      },
    });

    // Her şirket için scraper çalıştır
    const scraperPromises = companies.map(async (company) => {
      try {
        // Scraper'ı çalıştır
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scraper`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteId,
            companyId: company.id,
            companyCode: company.code,
            insuranceType,
            formData,
          }),
        });
      } catch (error) {
        console.error(`Scraper error for ${company.name}:`, error);
      }
    });

    // Tüm scraper'ları paralel çalıştır (await etmiyoruz, arka planda çalışsın)
    Promise.all(scraperPromises)
      .then(async () => {
        // Tüm scraper'lar bitti, quote durumunu güncelle
        await prisma.quote.update({
          where: { id: quoteId },
          data: { status: "COMPLETED" },
        });
      })
      .catch((error) => {
        console.error("Scrapers failed:", error);
        prisma.quote.update({
          where: { id: quoteId },
          data: { status: "FAILED" },
        });
      });
  } catch (error) {
    console.error("Start scrapers error:", error);
  }
}
