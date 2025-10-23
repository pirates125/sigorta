import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      select: {
        status: true,
        responses: {
          select: { id: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Aktif scraper sayısını database'den al
    const activeScrapersCount = await prisma.insuranceCompany.count({
      where: {
        scraperEnabled: true,
      },
    });

    return NextResponse.json({
      status: quote.status,
      completed: quote.responses.length,
      total: activeScrapersCount,
    });
  } catch (error) {
    console.error("Progress check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
