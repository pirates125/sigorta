import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Şirketin mevcut durumunu al
    const company = await prisma.insuranceCompany.findUnique({
      where: { id },
      select: { scraperEnabled: true },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Şirket bulunamadı" },
        { status: 404 }
      );
    }

    // Scraper durumunu tersine çevir
    const updated = await prisma.insuranceCompany.update({
      where: { id },
      data: {
        scraperEnabled: !company.scraperEnabled,
      },
    });

    return NextResponse.json({
      message: updated.scraperEnabled
        ? "Scraper aktif edildi"
        : "Scraper devre dışı bırakıldı",
      scraperEnabled: updated.scraperEnabled,
    });
  } catch (error) {
    console.error("Toggle scraper error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
