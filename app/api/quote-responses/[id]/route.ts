import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // QuoteResponse'u al
    const quoteResponse = await prisma.quoteResponse.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        quote: {
          select: {
            id: true,
            insuranceType: true,
            userId: true,
            formData: true,
          },
        },
      },
    });

    if (!quoteResponse) {
      return NextResponse.json(
        { message: "Quote response bulunamadı" },
        { status: 404 }
      );
    }

    // Sadece kendi quote'u olan kullanıcı veya admin erişebilir
    const isOwner = quoteResponse.quote.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Bu teklife erişim yetkiniz yok" },
        { status: 403 }
      );
    }

    return NextResponse.json(quoteResponse);
  } catch (error) {
    console.error("Get quote response error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
