import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Users,
  DollarSign,
  Palette,
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
import { RenewalWidget } from "@/components/dashboard/RenewalWidget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Kullanıcının verilerini al
  const quotes = await prisma.quote.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      responses: {
        include: {
          company: true,
        },
        orderBy: {
          price: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const policies = await prisma.policy.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  const statusLabels: Record<
    string,
    { label: string; icon: any; color: string }
  > = {
    DRAFT: { label: "Taslak", icon: FileText, color: "text-gray-600" },
    PENDING: { label: "Bekliyor", icon: Clock, color: "text-yellow-600" },
    PROCESSING: { label: "İşleniyor", icon: Clock, color: "text-blue-600" },
    COMPLETED: {
      label: "Tamamlandı",
      icon: CheckCircle,
      color: "text-green-600",
    },
    CONTACTED: {
      label: "İletişimde",
      icon: FileText,
      color: "text-purple-600",
    },
    QUOTED: {
      label: "Teklif Sunuldu",
      icon: FileText,
      color: "text-indigo-600",
    },
    WON: { label: "Kazanıldı", icon: CheckCircle, color: "text-emerald-600" },
    LOST: { label: "Kaybedildi", icon: FileText, color: "text-red-600" },
    FAILED: { label: "Başarısız", icon: CheckCircle, color: "text-red-600" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-2xl font-bold">
                <span className="hidden sm:inline">Sigorta Acentesi</span>
                <span className="sm:hidden">Sigorta</span>
              </span>
            </Link>

            {/* Search - Hidden on mobile */}
            <div className="hidden lg:block flex-1 max-w-md">
              <GlobalSearch />
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/profile"
                className="text-sm text-muted-foreground hidden xl:flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <span>Hoş geldiniz, {session.user.name}</span>
              </Link>
              <Link href="/referrals">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Users className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Arkadaş Davet</span>
                </Button>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <span className="hidden sm:inline">Admin Paneli</span>
                    <span className="sm:hidden">Admin</span>
                  </Button>
                </Link>
              )}
              {session.user.role === "BROKER" && (
                <Link href="/broker">
                  <Button variant="outline" size="sm">
                    <span className="hidden sm:inline">Broker Paneli</span>
                    <span className="sm:hidden">Broker</span>
                  </Button>
                </Link>
              )}
              <Link href="/profile" className="xl:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Sorgularım
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quotes.length}</div>
                <p className="text-xs text-muted-foreground">Son 10 sorgunuz</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Poliçelerim
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{policies.length}</div>
                <p className="text-xs text-muted-foreground">
                  Aktif poliçeleriniz
                </p>
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Arkadaş Davet Et
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <Link href="/referrals">
                  <Button className="w-full" variant="default">
                    Komisyon Kazan
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">
                  %5 komisyon fırsatı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Yeni Teklif Al
                </CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href="/#hizmetler">
                  <Button className="w-full">Teklif Al</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Theme Customization Banner */}
          <Card className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Renk Temanızı Özelleştirin! 🎨
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      9 farklı renk arasından sitenizin temasını seçin
                    </p>
                  </div>
                </div>
                <Link href="/profile">
                  <Button
                    variant="default"
                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Renkleri Gör
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Son Sorgularım</CardTitle>
              <CardDescription>
                En son yaptığınız fiyat sorgulamaları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quotes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>En İyi Fiyat</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => {
                      const StatusIcon = statusLabels[quote.status].icon;
                      return (
                        <TableRow key={quote.id}>
                          <TableCell className="text-sm">
                            {formatDateTime(quote.createdAt)}
                          </TableCell>
                          <TableCell>
                            {insuranceTypeLabels[quote.insuranceType]}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon
                                className={`h-4 w-4 ${
                                  statusLabels[quote.status].color
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  statusLabels[quote.status].color
                                }`}
                              >
                                {statusLabels[quote.status].label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {quote.responses[0] ? (
                              <span className="font-medium">
                                {formatCurrency(
                                  Number(quote.responses[0].price)
                                )}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/quotes/${quote.id}`}>
                              <Button size="sm" variant="outline">
                                Görüntüle
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz sorgu yok</p>
                  <Link href="/#hizmetler">
                    <Button className="mt-4">İlk Teklifinizi Alın</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Renewal Widget */}
          <RenewalWidget />

          {/* Policies */}
          {policies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Poliçelerim</CardTitle>
                <CardDescription>Aktif ve geçmiş poliçeleriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poliçe No</TableHead>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-mono text-sm">
                          {policy.policyNumber || "Bekliyor"}
                        </TableCell>
                        <TableCell>{policy.company.name}</TableCell>
                        <TableCell>
                          {insuranceTypeLabels[policy.insuranceType]}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(Number(policy.premium))}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {policy.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link href={`/policies/${policy.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
