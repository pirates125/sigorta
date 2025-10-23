import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST - Admin: Komisyon durumunu güncelle
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["PENDING", "APPROVED", "PAID", "REJECTED"].includes(status)) {
      return NextResponse.json({ message: "Geçersiz durum" }, { status: 400 });
    }

    // Mevcut komisyonu kontrol et
    const commission = await prisma.commission.findUnique({
      where: { id },
    });

    if (!commission) {
      return NextResponse.json(
        { message: "Komisyon bulunamadı" },
        { status: 404 }
      );
    }

    // Durum geçişi validasyonu
    const validTransitions: Record<string, string[]> = {
      PENDING: ["APPROVED", "REJECTED"],
      APPROVED: ["PAID"],
      PAID: [],
      REJECTED: [],
    };

    if (!validTransitions[commission.status].includes(status)) {
      return NextResponse.json(
        { message: "Bu durum geçişi geçersiz" },
        { status: 400 }
      );
    }

    // Durumu güncelle
    const updated = await prisma.commission.update({
      where: { id },
      data: {
        status,
        ...(status === "PAID" && { paidAt: new Date() }),
      },
    });

    const statusMessages = {
      APPROVED: "Komisyon onaylandı",
      PAID: "Komisyon ödendi olarak işaretlendi",
      REJECTED: "Komisyon reddedildi",
    };

    return NextResponse.json({
      success: true,
      message: statusMessages[status as keyof typeof statusMessages],
      commission: {
        id: updated.id,
        status: updated.status,
        paidAt: updated.paidAt,
      },
    });
  } catch (error) {
    console.error("Update commission status error:", error);
    return NextResponse.json(
      { message: "Durum güncellenemedi" },
      { status: 500 }
    );
  }
}
