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

    // Kendini engelleyemez
    if (session.user.id === id) {
      return NextResponse.json(
        { message: "Kendinizi engelleyemezsiniz" },
        { status: 400 }
      );
    }

    // Kullanıcının mevcut durumunu al
    const user = await prisma.user.findUnique({
      where: { id },
      select: { blocked: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Admin kullanıcıları engellenemez
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin kullanıcıları engellenemez" },
        { status: 400 }
      );
    }

    // Engel durumunu tersine çevir
    const updated = await prisma.user.update({
      where: { id },
      data: {
        blocked: !user.blocked,
      },
    });

    return NextResponse.json({
      message: updated.blocked ? "Kullanıcı engellendi" : "Engel kaldırıldı",
      blocked: updated.blocked,
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
