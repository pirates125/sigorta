import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Poliçe detayını al
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        company: true,
        quote: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!policy) {
      return NextResponse.json(
        { message: "Poliçe bulunamadı" },
        { status: 404 }
      );
    }

    // Sadece poliçe sahibi veya admin erişebilir
    const isOwner = policy.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Bu poliçeye erişim yetkiniz yok" },
        { status: 403 }
      );
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error("Get policy error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

/**
 * PATCH - Poliçe bilgilerini güncelle
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!policy) {
      return NextResponse.json(
        { message: "Poliçe bulunamadı" },
        { status: 404 }
      );
    }

    // Sadece admin güncelleyebilir
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için admin yetkisi gerekli" },
        { status: 403 }
      );
    }

    const data = await req.json();
    console.log("Received update data:", data);

    // Güncellenebilir alanlar
    const updateData: any = {};

    if (data.policyNumber !== undefined)
      updateData.policyNumber = data.policyNumber;

    if (data.status !== undefined) updateData.status = data.status;

    // Tarihler için boş string kontrolü
    if (data.startDate !== undefined && data.startDate !== "") {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.endDate !== undefined && data.endDate !== "") {
      updateData.endDate = new Date(data.endDate);
    }

    if (data.paymentReceived !== undefined)
      updateData.paymentReceived = data.paymentReceived;

    if (data.paymentAmount !== undefined && data.paymentAmount !== null)
      updateData.paymentAmount = data.paymentAmount;

    if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl;

    console.log("Prepared update data:", updateData);

    const updated = await prisma.policy.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        quote: true,
      },
    });

    return NextResponse.json({
      message: "Poliçe güncellendi",
      policy: updated,
    });
  } catch (error: any) {
    console.error("Update policy error:", error);
    return NextResponse.json(
      {
        message: "Poliçe güncellenemedi",
        error: error.message || "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
