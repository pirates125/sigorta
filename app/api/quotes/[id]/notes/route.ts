import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Teklif notlarını al
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

    const quote = await prisma.quote.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!quote) {
      return NextResponse.json(
        { message: "Teklif bulunamadı" },
        { status: 404 }
      );
    }

    // Sadece kendi teklifleri veya admin/broker görebilir
    const isOwner = quote.userId === session.user.id;
    const isAdminOrBroker = ["ADMIN", "BROKER"].includes(session.user.role!);

    if (!isOwner && !isAdminOrBroker) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    // Kullanıcılar sadece public notları görebilir
    const notes = await prisma.quoteNote.findMany({
      where: {
        quoteId: id,
        ...(isAdminOrBroker ? {} : { isInternal: false }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json({ message: "Notlar alınamadı" }, { status: 500 });
  }
}

/**
 * POST - Yeni not ekle
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

    const { content, isInternal } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { message: "Not içeriği gerekli" },
        { status: 400 }
      );
    }

    // Sadece admin/broker internal not ekleyebilir
    const canAddInternal = ["ADMIN", "BROKER"].includes(session.user.role!);
    const noteIsInternal = canAddInternal && isInternal;

    const note = await prisma.quoteNote.create({
      data: {
        quoteId: id,
        userId: session.user.id,
        content: content.trim(),
        isInternal: noteIsInternal,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ message: "Not eklenemedi" }, { status: 500 });
  }
}
