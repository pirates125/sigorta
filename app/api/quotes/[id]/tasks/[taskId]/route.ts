import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH - Görev durumunu güncelle
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await auth();
    const { taskId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Sadece admin/broker güncelleyebilir
    if (!["ADMIN", "BROKER"].includes(session.user.role!)) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const { status, completedAt } = await req.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (status === "COMPLETED" && !completedAt) {
      updateData.completedAt = new Date();
    } else if (status !== "COMPLETED") {
      updateData.completedAt = null;
    }

    const task = await prisma.quoteTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { message: "Görev güncellenemedi" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Görevi sil
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await auth();
    const { taskId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Sadece admin/broker silebilir
    if (!["ADMIN", "BROKER"].includes(session.user.role!)) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    await prisma.quoteTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Görev silindi" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ message: "Görev silinemedi" }, { status: 500 });
  }
}
