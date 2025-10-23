import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET - Admin analytics data
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    // Son 7 günlük veriler
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Günlük kullanıcı kayıtları
    const userRegistrations = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        });

        return {
          date: date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
          }),
          count,
        };
      })
    );

    // Günlük teklif sayıları
    const quoteStats = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await prisma.quote.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        });

        return {
          date: date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
          }),
          count,
        };
      })
    );

    // Günlük poliçe satışları ve gelir
    const policyStats = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const policies = await prisma.policy.findMany({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
          select: {
            premium: true,
          },
        });

        const revenue = policies.reduce(
          (sum, policy) => sum + Number(policy.premium),
          0
        );

        return {
          date: date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
          }),
          count: policies.length,
          revenue,
        };
      })
    );

    // Sigorta türüne göre dağılım
    const insuranceTypeDistribution = await prisma.policy.groupBy({
      by: ["insuranceType"],
      _count: {
        id: true,
      },
      _sum: {
        premium: true,
      },
    });

    // Şirketlere göre performans
    const companyPerformance = await prisma.insuranceCompany.findMany({
      include: {
        _count: {
          select: {
            quoteResponses: true,
            policies: true,
          },
        },
        policies: {
          select: {
            premium: true,
          },
        },
      },
      orderBy: {
        policies: {
          _count: "desc",
        },
      },
      take: 10,
    });

    // Conversion rate hesapla
    const totalQuotes = await prisma.quote.count();
    const totalPolicies = await prisma.policy.count();
    const conversionRate =
      totalQuotes > 0 ? (totalPolicies / totalQuotes) * 100 : 0;

    // Ortalama poliçe değeri
    const avgPolicyValue = await prisma.policy.aggregate({
      _avg: {
        premium: true,
      },
    });

    return NextResponse.json({
      userRegistrations,
      quoteStats,
      policyStats,
      insuranceTypeDistribution: insuranceTypeDistribution.map((item) => ({
        type: item.insuranceType,
        count: item._count.id,
        revenue: Number(item._sum.premium || 0),
      })),
      companyPerformance: companyPerformance.map((company) => ({
        name: company.name,
        quotes: company._count.quoteResponses,
        policies: company._count.policies,
        revenue: company.policies.reduce(
          (sum, policy) => sum + Number(policy.premium),
          0
        ),
      })),
      metrics: {
        conversionRate: Number(conversionRate.toFixed(2)),
        avgPolicyValue: Number(avgPolicyValue._avg.premium || 0),
        totalQuotes,
        totalPolicies,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { message: "İstatistikler alınamadı" },
      { status: 500 }
    );
  }
}
