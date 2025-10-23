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
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default async function AdminQuotesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Tüm sorguları al
  const quotes = await prisma.quote.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      responses: {
        select: {
          id: true,
          price: true,
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
    take: 100,
  });

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık Sigortası",
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

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
            <Link href="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard'a Dön
              </Link>
              <h1 className="text-3xl font-bold">Tüm Sorgular</h1>
              <p className="text-muted-foreground mt-1">
                {quotes.length} fiyat sorgusu
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sorgu Listesi</CardTitle>
              <CardDescription>
                Platform'daki tüm fiyat sorgulamaları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Sigorta Türü</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Teklifler</TableHead>
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
                            {quote.user?.name || quote.guestEmail || "Misafir"}
                          </p>
                          {quote.user?.email && (
                            <p className="text-xs text-muted-foreground">
                              {quote.user.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {
                          insuranceTypeLabels[
                            quote.insuranceType as keyof typeof insuranceTypeLabels
                          ]
                        }
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            statusColors[
                              quote.status as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {quote.status}
                        </span>
                      </TableCell>
                      <TableCell>{quote.responses.length}</TableCell>
                      <TableCell>
                        {quote.responses[0] ? (
                          <span className="font-medium">
                            {formatCurrency(Number(quote.responses[0].price))}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
