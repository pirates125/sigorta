import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BrokerReportsPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "BROKER" && session.user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const brokerId = session.user.id;

  // Genel istatistikler
  const [totalCustomers, totalQuotes, totalPolicies, commissionStats] =
    await Promise.all([
      prisma.user.count({
        where: {
          referredBy: brokerId,
        },
      }),
      prisma.quote.count({
        where: {
          user: {
            referredBy: brokerId,
          },
        },
      }),
      prisma.policy.count({
        where: {
          user: {
            referredBy: brokerId,
          },
        },
      }),
      prisma.commission.aggregate({
        where: {
          userId: brokerId,
        },
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

  // Bu ay istatistikleri
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyCustomers, monthlyQuotes, monthlyPolicies, monthlyCommissions] =
    await Promise.all([
      prisma.user.count({
        where: {
          referredBy: brokerId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.quote.count({
        where: {
          user: {
            referredBy: brokerId,
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.policy.count({
        where: {
          user: {
            referredBy: brokerId,
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.commission.aggregate({
        where: {
          userId: brokerId,
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

  // Sigorta türüne göre dağılım
  const policiesByType = await prisma.policy.groupBy({
    by: ["insuranceType"],
    where: {
      user: {
        referredBy: brokerId,
      },
    },
    _count: true,
    _sum: {
      premium: true,
    },
  });

  // Conversion rate
  const conversionRate =
    totalQuotes > 0 ? ((totalPolicies / totalQuotes) * 100).toFixed(1) : "0.0";

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Broker Paneli</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/broker">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <Link
              href="/broker"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard'a Dön
            </Link>
            <h1 className="text-3xl font-bold">Raporlar & Analizler</h1>
            <p className="text-muted-foreground mt-1">
              Performans metrikleriniz ve istatistikleriniz
            </p>
          </div>

          {/* Genel İstatistikler */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Genel İstatistikler</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Müşteri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tüm zamanlar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Teklif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuotes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fiyat sorgusu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Poliçe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPolicies}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Satılan poliçe
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Komisyon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(Number(commissionStats._sum.amount || 0))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {commissionStats._count} ödeme
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bu Ay */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Bu Ay (
              {new Date().toLocaleString("tr-TR", {
                month: "long",
                year: "numeric",
              })}
              )
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Yeni Müşteri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyCustomers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Teklif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyQuotes}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Poliçe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyPolicies}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Komisyon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(Number(monthlyCommissions._sum.amount || 0))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performans Metrikleri */}
          <Card>
            <CardHeader>
              <CardTitle>Performans Metrikleri</CardTitle>
              <CardDescription>Önemli performans göstergeleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold">{conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">
                      Teklif → Poliçe
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ortalama Müşteri Değeri
                    </p>
                    <p className="text-2xl font-bold">
                      {totalCustomers > 0
                        ? new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(
                            Number(commissionStats._sum.amount || 0) /
                              totalCustomers
                          )
                        : "0 ₺"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Komisyon / Müşteri
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Teklif / Müşteri
                    </p>
                    <p className="text-2xl font-bold">
                      {totalCustomers > 0
                        ? (totalQuotes / totalCustomers).toFixed(1)
                        : "0.0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ortalama sorgu sayısı
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sigorta Türüne Göre Dağılım */}
          <Card>
            <CardHeader>
              <CardTitle>Sigorta Türüne Göre Dağılım</CardTitle>
              <CardDescription>
                Müşterilerinizin tercih ettiği sigorta türleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policiesByType.map((item) => {
                  const percentage =
                    totalPolicies > 0
                      ? ((item._count / totalPolicies) * 100).toFixed(1)
                      : "0";
                  return (
                    <div key={item.insuranceType}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {insuranceTypeLabels[item.insuranceType]}
                        </span>
                        <div className="text-right">
                          <span className="font-bold">
                            {item._count} poliçe
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Toplam prim:{" "}
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(Number(item._sum.premium || 0))}
                      </p>
                    </div>
                  );
                })}
                {policiesByType.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Henüz poliçe satışı yok
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
