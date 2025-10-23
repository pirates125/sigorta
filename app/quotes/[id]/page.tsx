import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Shield, ArrowLeft, Clock, CheckCircle } from "lucide-react";
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

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function QuoteDetailPage(props: PageProps) {
  const session = await auth();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
  const { token } = searchParams;

  // Quote'u al
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      responses: {
        include: {
          company: true,
        },
        orderBy: {
          price: "asc",
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!quote) {
    notFound();
  }

  // Erişim kontrolü
  const isOwner = quote.userId === session?.user?.id;
  const hasToken = quote.accessToken === token;

  if (!isOwner && !hasToken) {
    redirect("/auth/login");
  }

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık Sigortası",
  };

  const statusLabels = {
    PENDING: { label: "Bekliyor", color: "text-yellow-600" },
    PROCESSING: { label: "İşleniyor", color: "text-blue-600" },
    COMPLETED: { label: "Tamamlandı", color: "text-green-600" },
    FAILED: { label: "Başarısız", color: "text-red-600" },
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
          <div className="flex items-center space-x-2">
            {session?.user ? (
              <Link href="/dashboard">
                <Button variant="outline">Panelim</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="space-y-6">
            {/* Quote Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {insuranceTypeLabels[quote.insuranceType]}
                    </CardTitle>
                    <CardDescription>
                      Teklif No: {quote.id.slice(0, 8)} •{" "}
                      {formatDateTime(quote.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {quote.status === "PROCESSING" && (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                    {quote.status === "COMPLETED" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span
                      className={`font-medium ${
                        statusLabels[quote.status].color
                      }`}
                    >
                      {statusLabels[quote.status].label}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Processing Status */}
            {quote.status === "PROCESSING" && (
              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <div>
                      <p className="font-medium">Fiyatlar alınıyor...</p>
                      <p className="text-sm text-muted-foreground">
                        Sigorta şirketlerinden teklifler toplanıyor. Bu işlem
                        1-2 dakika sürebilir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Table */}
            {quote.responses.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Fiyat Karşılaştırması</CardTitle>
                  <CardDescription>
                    {quote.responses.length} sigorta şirketinden teklif alındı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sigorta Şirketi</TableHead>
                        <TableHead>Fiyat</TableHead>
                        <TableHead>Teminat</TableHead>
                        <TableHead className="text-right">İşlem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.responses.map((response, index) => (
                        <TableRow key={response.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {index === 0 && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  En Ucuz
                                </span>
                              )}
                              <span>{response.company.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-lg font-bold">
                            {formatCurrency(Number(response.price))}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {(response.coverageDetails as any)?.limit ||
                                "Standart Teminat"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/policies/create?quoteResponseId=${response.id}`}
                            >
                              <Button size="sm">Poliçe Kes</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Tasarruf</h4>
                    <p className="text-sm text-muted-foreground">
                      En ucuz ve en pahalı teklif arasında{" "}
                      <span className="font-bold text-primary">
                        {formatCurrency(
                          Number(
                            quote.responses[quote.responses.length - 1]
                              ?.price || 0
                          ) - Number(quote.responses[0]?.price || 0)
                        )}
                      </span>{" "}
                      fark var. En uygun teklifi seçerek tasarruf edebilirsiniz!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              quote.status === "COMPLETED" && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      Henüz teklif alınamadı. Lütfen daha sonra tekrar deneyin.
                    </p>
                  </CardContent>
                </Card>
              )
            )}

            {/* Quote Data */}
            <Card>
              <CardHeader>
                <CardTitle>Teklif Detayları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(quote.formData as any).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
