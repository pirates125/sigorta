import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Kullanıcının komisyonlarını al
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const userId = session.user.id;

    // Komisyonları al
    const commissions = await prisma.commission.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      include: {
        policy: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
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
        referral: {
          include: {
            referredUser: {
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

    // İstatistikler
    const stats = await prisma.commission.groupBy({
      by: ["status"],
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    return NextResponse.json({
      commissions: commissions.map((c) => ({
        id: c.id,
        amount: Number(c.amount),
        currency: c.currency,
        status: c.status,
        createdAt: c.createdAt,
        paidAt: c.paidAt,
        policy: {
          id: c.policy.id,
          insuranceType: c.policy.insuranceType,
          premium: Number(c.policy.premium),
          company: c.policy.company,
          customer: c.policy.user,
        },
        referral: c.referral
          ? {
              referredUser: c.referral.referredUser,
            }
          : null,
      })),
      stats: stats.reduce((acc, s) => {
        acc[s.status] = {
          amount: Number(s._sum.amount || 0),
          count: s._count,
        };
        return acc;
      }, {} as Record<string, { amount: number; count: number }>),
    });
  } catch (error) {
    console.error("Get commissions error:", error);
    return NextResponse.json(
      { message: "Komisyonlar alınamadı" },
      { status: 500 }
    );
  }
}
