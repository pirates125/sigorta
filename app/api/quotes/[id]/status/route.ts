import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH - Teklif durumunu güncelle
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

    // Sadece admin/broker durum güncelleyebilir
    if (!["ADMIN", "BROKER"].includes(session.user.role!)) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const { status, assignedTo, priority, followUpDate } = await req.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (priority) updateData.priority = priority;
    if (followUpDate !== undefined) {
      updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Update quote status error:", error);
    return NextResponse.json(
      { message: "Durum güncellenemedi" },
      { status: 500 }
    );
  }
}
