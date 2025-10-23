import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateRenewalStatus,
  getDaysUntilExpiry,
} from "@/lib/renewal-utils";

/**
 * GET - Admin: Tüm yaklaşan vadeleri al
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için admin yetkisi gerekli" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    const whereClause: any = {
      status: "ACTIVE",
      endDate: {
        not: null,
      },
    };

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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    const policiesWithStatus = policies.map((policy) => {
      const renewalStatus = calculateRenewalStatus(policy.endDate);
      const daysLeft = getDaysUntilExpiry(policy.endDate);

      return {
        id: policy.id,
        policyNumber: policy.policyNumber,
        insuranceType: policy.insuranceType,
        user: policy.user,
        company: policy.company,
        premium: Number(policy.premium),
        startDate: policy.startDate,
        endDate: policy.endDate,
        renewalStatus,
        daysLeft,
        renewalReminded: policy.renewalReminded,
      };
    });

    const stats = {
      total: policiesWithStatus.length,
      urgent: policiesWithStatus.filter((p) => p.renewalStatus === "URGENT")
        .length,
      dueSoon: policiesWithStatus.filter((p) => p.renewalStatus === "DUE_SOON")
        .length,
      upcoming: policiesWithStatus.filter((p) => p.renewalStatus === "UPCOMING")
        .length,
      reminded: policiesWithStatus.filter((p) => p.renewalReminded).length,
    };

    return NextResponse.json({
      policies: policiesWithStatus,
      stats,
    });
  } catch (error) {
    console.error("Admin renewals error:", error);
    return NextResponse.json({ message: "Vadeler alınamadı" }, { status: 500 });
  }
}
