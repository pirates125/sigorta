import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, FileText, Clock, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const statusLabels = {
    PENDING: { label: "Bekliyor", icon: Clock, color: "text-yellow-600" },
    PROCESSING: { label: "İşleniyor", icon: Clock, color: "text-blue-600" },
    COMPLETED: {
      label: "Tamamlandı",
      icon: CheckCircle,
      color: "text-green-600",
    },
    FAILED: { label: "Başarısız", icon: CheckCircle, color: "text-red-600" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Sigorta Acentesi</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Hoş geldiniz, {session.user.name}
            </span>
            {session.user.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline">Admin Paneli</Button>
              </Link>
            )}
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
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
