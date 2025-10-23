import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield,
  Users,
  FileText,
  Receipt,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { GlobalSearch } from "@/components/GlobalSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommissionCharts } from "@/components/broker/CommissionCharts";

export default async function BrokerPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "BROKER" && session.user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  // Broker istatistiklerini al
  const brokerId = session.user.id;

  // Referans verdiği kullanıcılar
  const referredUsers = await prisma.user.count({
    where: {
      referredBy: brokerId,
    },
  });

  // Toplam komisyon
  const commissionStats = await prisma.commission.aggregate({
    where: {
      userId: brokerId,
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  // Bekleyen komisyonlar
  const pendingCommissions = await prisma.commission.aggregate({
    where: {
      userId: brokerId,
      status: "PENDING",
    },
    _sum: {
      amount: true,
    },
  });

  // Ödenen komisyonlar
  const paidCommissions = await prisma.commission.aggregate({
    where: {
      userId: brokerId,
      status: "PAID",
    },
    _sum: {
      amount: true,
    },
  });

  // Son teklifler (referans verdiği kullanıcılardan)
  const recentQuotes = await prisma.quote.findMany({
    where: {
      user: {
        referredBy: brokerId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Broker Paneli</span>
            </Link>

            {/* Search - Hidden on mobile */}
            <div className="hidden lg:block flex-1 max-w-md">
              <GlobalSearch />
            </div>

            <div className="flex items-center space-x-4 shrink-0">
              <span className="text-sm text-muted-foreground hidden xl:inline">
                {session.user.name} (Broker)
              </span>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Paneli
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Kullanıcı Paneli
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 lg:hidden">
            <GlobalSearch />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Broker Dashboard</h1>
            <p className="text-muted-foreground">
              Müşterilerinizi ve komisyon gelirlerinizi yönetin
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Müşteri
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{referredUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Referans verdiğiniz kullanıcılar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Komisyon
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(commissionStats._sum.amount || 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {commissionStats._count} komisyon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bekleyen Komisyon
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(pendingCommissions._sum.amount || 0))}
                </div>
                <p className="text-xs text-muted-foreground">Onay bekliyor</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ödenen Komisyon
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(paidCommissions._sum.amount || 0))}
                </div>
                <p className="text-xs text-muted-foreground">Ödeme yapıldı</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan broker işlemleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/broker/customers">
                    <Users className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Müşterilerim</span>
                    <span className="text-xs text-muted-foreground">
                      {referredUsers} müşteri
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/broker/commissions">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Komisyonlar</span>
                    <span className="text-xs text-muted-foreground">
                      Kazançlarım
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/broker/quotes">
                    <FileText className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Teklifler</span>
                    <span className="text-xs text-muted-foreground">
                      Müşteri teklifleri
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/broker/reports">
                    <TrendingUp className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Raporlar</span>
                    <span className="text-xs text-muted-foreground">
                      Analizler
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Müşteri Aktiviteleri</CardTitle>
              <CardDescription>
                Müşterilerinizin son yaptığı fiyat sorgulamaları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuotes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">
                          {quote.user?.name || quote.guestEmail || "Misafir"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quote.insuranceType} -{" "}
                          {new Date(quote.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            quote.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : quote.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {quote.status}
                        </span>
                        <Link href={`/quotes/${quote.id}`}>
                          <Button size="sm" variant="ghost">
                            Görüntüle
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz müşteri aktivitesi yok</p>
                  <Link href="/referrals">
                    <Button className="mt-4">Müşteri Davet Et</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Charts */}
          <div className="mt-8">
            <CommissionCharts />
          </div>
        </div>
      </div>
    </div>
  );
}
