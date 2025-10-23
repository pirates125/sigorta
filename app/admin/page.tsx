import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, Users, FileText, Receipt, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // İstatistikleri al
  const [totalUsers, totalQuotes, totalPolicies, recentQuotes] =
    await Promise.all([
      prisma.user.count(),
      prisma.quote.count(),
      prisma.policy.count(),
      prisma.quote.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

  const totalRevenue = await prisma.policy.aggregate({
    _sum: {
      premium: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Admin Paneli</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name} (Admin)
            </span>
            <Link href="/dashboard">
              <Button variant="outline">Kullanıcı Paneli</Button>
            </Link>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" type="submit">
                Çıkış
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Platform istatistiklerine ve yönetimine hoş geldiniz
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Kullanıcı
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Kayıtlı kullanıcılar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Sorgu
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalQuotes}</div>
                <p className="text-xs text-muted-foreground">
                  Tüm fiyat sorguları
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Poliçe
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPolicies}</div>
                <p className="text-xs text-muted-foreground">
                  Kesilen poliçeler
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Ciro
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(totalRevenue._sum.premium || 0))}
                </div>
                <p className="text-xs text-muted-foreground">Prim toplamı</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan admin işlemleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Kullanıcılar</span>
                    <span className="text-xs text-muted-foreground">
                      Kullanıcı yönetimi
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/admin/quotes">
                    <FileText className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Sorgular</span>
                    <span className="text-xs text-muted-foreground">
                      Tüm sorgular
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  asChild
                >
                  <Link href="/admin/policies">
                    <Receipt className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Poliçeler</span>
                    <span className="text-xs text-muted-foreground">
                      Poliçe yönetimi
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>En son yapılan fiyat sorguları</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
              <CardDescription>Scraper ve API durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sompo API</span>
                  <span className="text-sm text-green-600 font-medium">
                    ● Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anadolu Scraper</span>
                  <span className="text-sm text-green-600 font-medium">
                    ● Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ak Scraper</span>
                  <span className="text-sm text-green-600 font-medium">
                    ● Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Veritabanı</span>
                  <span className="text-sm text-green-600 font-medium">
                    ● Bağlı
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
