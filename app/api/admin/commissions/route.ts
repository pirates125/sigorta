import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Admin: Tüm komisyonları al
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const commissions = await prisma.commission.findMany({
      where: {
        ...(status && status !== "all" && { status: status as any }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        policy: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      commissions: commissions.map((c) => ({
        id: c.id,
        amount: Number(c.amount),
        currency: c.currency,
        status: c.status,
        createdAt: c.createdAt,
        paidAt: c.paidAt,
        broker: {
          name: c.user.name,
          email: c.user.email,
        },
        policy: {
          id: c.policy.id,
          insuranceType: c.policy.insuranceType,
          premium: Number(c.policy.premium),
          company: c.policy.company,
          customer: c.policy.user,
        },
      })),
    });
  } catch (error) {
    console.error("Admin get commissions error:", error);
    return NextResponse.json(
      { message: "Komisyonlar alınamadı" },
      { status: 500 }
    );
  }
}
