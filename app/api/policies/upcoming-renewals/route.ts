import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateRenewalStatus,
  getDaysUntilExpiry,
} from "@/lib/renewal-utils";

/**
 * GET - Yaklaşan vadeleri al
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
    const filter = searchParams.get("filter") || "all"; // all, urgent, upcoming

    // Kullanıcının poliçelerini al
    const whereClause: any = {
      userId: session.user.id,
      status: "ACTIVE",
      endDate: {
        not: null,
      },
    };

    // Filtre uygula
    if (filter === "urgent") {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      whereClause.endDate = {
        ...whereClause.endDate,
        lte: sevenDaysFromNow,
        gte: new Date(),
      };
    } else if (filter === "upcoming") {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      whereClause.endDate = {
        ...whereClause.endDate,
        lte: thirtyDaysFromNow,
        gte: new Date(),
      };
    }

    const policies = await prisma.policy.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });

    // Her poliçe için renewal status hesapla
    const policiesWithStatus = policies.map((policy) => {
      const renewalStatus = calculateRenewalStatus(policy.endDate);
      const daysLeft = getDaysUntilExpiry(policy.endDate);

      return {
        id: policy.id,
        policyNumber: policy.policyNumber,
        insuranceType: policy.insuranceType,
        company: policy.company,
        premium: Number(policy.premium),
        startDate: policy.startDate,
        endDate: policy.endDate,
        renewalStatus,
        daysLeft,
        renewalReminded: policy.renewalReminded,
      };
    });

    // İstatistikler
    const stats = {
      total: policiesWithStatus.length,
      urgent: policiesWithStatus.filter((p) => p.renewalStatus === "URGENT")
        .length,
      dueSoon: policiesWithStatus.filter((p) => p.renewalStatus === "DUE_SOON")
        .length,
      upcoming: policiesWithStatus.filter((p) => p.renewalStatus === "UPCOMING")
        .length,
    };

    return NextResponse.json({
      policies: policiesWithStatus,
      stats,
    });
  } catch (error) {
    console.error("Upcoming renewals error:", error);
    return NextResponse.json({ message: "Vadeler alınamadı" }, { status: 500 });
  }
}
