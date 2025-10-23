import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
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

export default async function BrokerQuotesPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "BROKER" && session.user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const brokerId = session.user.id;

  // Müşterilerin tekliflerini al
  const quotes = await prisma.quote.findMany({
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
  });

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Taslak", color: "bg-gray-100 text-gray-800" },
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
    PROCESSING: { label: "İşleniyor", color: "bg-blue-100 text-blue-800" },
    COMPLETED: { label: "Tamamlandı", color: "bg-green-100 text-green-800" },
    CONTACTED: { label: "İletişimde", color: "bg-purple-100 text-purple-800" },
    QUOTED: { label: "Teklif Sunuldu", color: "bg-indigo-100 text-indigo-800" },
    WON: { label: "Kazanıldı", color: "bg-emerald-100 text-emerald-800" },
    LOST: { label: "Kaybedildi", color: "bg-red-100 text-red-800" },
    FAILED: { label: "Başarısız", color: "bg-red-100 text-red-800" },
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
            <h1 className="text-3xl font-bold">Müşteri Teklifleri</h1>
            <p className="text-muted-foreground mt-1">
              Müşterilerinizin yaptığı {quotes.length} fiyat sorgusu
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Teklif Listesi</CardTitle>
              <CardDescription>
                Müşterilerinizin tüm sigorta teklif sorguları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quotes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>En İyi Fiyat</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="text-sm">
                          {formatDateTime(quote.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {quote.user?.name || "İsimsiz"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {quote.user?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {insuranceTypeLabels[quote.insuranceType]}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              statusLabels[quote.status].color
                            }`}
                          >
                            {statusLabels[quote.status].label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {quote.responses[0] ? (
                            <div>
                              <p className="font-medium">
                                {formatCurrency(
                                  Number(quote.responses[0].price)
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {quote.responses[0].company.name}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/quotes/${quote.id}`}>
                            <Button size="sm" variant="outline">
                              Detaylar
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Henüz teklif yok</p>
                  <p className="text-sm mb-4">
                    Müşterileriniz teklif almaya başladığında burada
                    görünecekler
                  </p>
                  <Link href="/referrals">
                    <Button>Müşteri Davet Et</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
