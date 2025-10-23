import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Kullanıcının referans istatistiklerini al
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Referanslar
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: userId,
      },
      include: {
        referredUser: {
          select: {
            name: true,
            email: true,
            createdAt: true,
          },
        },
        commissions: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Toplam istatistikler
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(
      (r) => r.status === "COMPLETED"
    ).length;
    const pendingReferrals = referrals.filter(
      (r) => r.status === "PENDING"
    ).length;

    // Komisyon istatistikleri
    const commissionStats = await prisma.commission.aggregate({
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });

    const totalCommission = Number(commissionStats._sum.amount || 0);

    // Referans verdiği kullanıcı sayısı
    const referredUsersCount = await prisma.user.count({
      where: {
        referredBy: userId,
      },
    });

    return NextResponse.json({
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      referredUsersCount,
      totalCommission,
      referrals: referrals.map((ref) => ({
        id: ref.id,
        referredUser: {
          name: ref.referredUser.name,
          email: ref.referredUser.email,
          joinedAt: ref.referredUser.createdAt,
        },
        status: ref.status,
        commissionRate: Number(ref.commissionRate),
        totalCommission: ref.commissions.reduce(
          (sum, c) => sum + Number(c.amount),
          0
        ),
        createdAt: ref.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get referral stats error:", error);
    return NextResponse.json(
      { message: "İstatistikler alınamadı" },
      { status: 500 }
    );
  }
}
