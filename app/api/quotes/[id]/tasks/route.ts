import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Teklif görevlerini al
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

    // Sadece admin/broker görevleri görebilir
    if (!["ADMIN", "BROKER"].includes(session.user.role!)) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const tasks = await prisma.quoteTask.findMany({
      where: { quoteId: id },
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
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { message: "Görevler alınamadı" },
      { status: 500 }
    );
  }
}

/**
 * POST - Yeni görev ekle
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Sadece admin/broker görev ekleyebilir
    if (!["ADMIN", "BROKER"].includes(session.user.role!)) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const { title, description, priority, dueDate, assignedTo } =
      await req.json();

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { message: "Görev başlığı gerekli" },
        { status: 400 }
      );
    }

    const task = await prisma.quoteTask.create({
      data: {
        quoteId: id,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: session.user.id,
        assignedTo: assignedTo || null,
      },
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

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ message: "Görev eklenemedi" }, { status: 500 });
  }
}
