import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteNotes } from "@/components/quotes/QuoteNotes";
import { QuoteWorkflowPanel } from "@/components/quotes/QuoteWorkflowPanel";
import { CoverageComparison } from "@/components/quotes/CoverageComparison";
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
import { scoreAndRankQuotes, getScoreLabel } from "@/lib/comparison-algorithm";
import { QuoteLoadingProgress } from "@/components/QuoteLoadingProgress";

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
          company: {
            select: {
              id: true,
              name: true,
              code: true,
              logo: true,
              rating: true,
              coverageScore: true,
              avgResponseTime: true,
            },
          },
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
  const isAdmin = session?.user?.role === "ADMIN";
  const isBroker = session?.user?.role === "BROKER";
  const isAdminOrBroker = isAdmin || isBroker;

  // Admin, sahip veya token sahibi değilse erişim reddet
  if (!isOwner && !hasToken && !isAdmin) {
    redirect("/auth/login");
  }

  // Admin/Broker kullanıcılarını al (workflow için)
  const adminUsers = isAdminOrBroker
    ? await prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "BROKER"],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
    : [];

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık Sigortası",
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Taslak", color: "text-gray-600" },
    PENDING: { label: "Bekliyor", color: "text-yellow-600" },
    PROCESSING: { label: "İşleniyor", color: "text-blue-600" },
    COMPLETED: { label: "Tamamlandı", color: "text-green-600" },
    CONTACTED: { label: "İletişimde", color: "text-purple-600" },
    QUOTED: { label: "Teklif Sunuldu", color: "text-indigo-600" },
    WON: { label: "Kazanıldı", color: "text-emerald-600" },
    LOST: { label: "Kaybedildi", color: "text-red-600" },
    FAILED: { label: "Başarısız", color: "text-red-600" },
  };

  // Akıllı skorlama algoritmasını uygula
  const scoredResponses =
    quote.responses.length > 0
      ? scoreAndRankQuotes(quote.responses as any)
      : [];

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

          {/* Loading Progress - Sadece işleniyorsa göster */}
          {quote.status === "PROCESSING" && (
            <QuoteLoadingProgress quoteId={quote.id} />
          )}

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

            {/* Guest User Notice */}
            {!session?.user && hasToken && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        Teklifleriniz Hazır!
                      </h3>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                        Poliçe oluşturmak ve tekliflerinizi kaydetmek için
                        ücretsiz hesap oluşturun.
                      </p>
                      <div className="flex gap-2">
                        <Link href="/auth/register">
                          <Button size="sm" variant="default">
                            Ücretsiz Kayıt Ol
                          </Button>
                        </Link>
                        <Link href="/auth/login">
                          <Button size="sm" variant="outline">
                            Giriş Yap
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Table with Smart Scoring */}
            {scoredResponses.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Akıllı Karşılaştırma</CardTitle>
                        <CardDescription>
                          {scoredResponses.length} sigorta şirketinden teklif -
                          Fiyat, Kapsam, Rating ve Hıza göre sıralandı
                        </CardDescription>
                      </div>
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sıra</TableHead>
                          <TableHead>Sigorta Şirketi</TableHead>
                          <TableHead>Fiyat</TableHead>
                          <TableHead>Genel Skor</TableHead>
                          <TableHead>Detaylar</TableHead>
                          <TableHead className="text-right">İşlem</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scoredResponses.map((response) => {
                          const scoreLabel = getScoreLabel(
                            response.scores.weighted
                          );
                          return (
                            <TableRow key={response.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  {response.rank === 1 && (
                                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                                  )}
                                  <span className="font-bold text-lg">
                                    #{response.rank}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div>
                                  <p>{response.company.name}</p>
                                  {response.rank === 1 && (
                                    <span className="text-xs text-green-600">
                                      ⭐ En İyi Öneri
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-lg font-bold">
                                {formatCurrency(Number(response.price))}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-2xl font-bold">
                                        {response.scores.weighted}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-1 rounded ${scoreLabel.color}`}
                                      >
                                        {scoreLabel.label}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{
                                          width: `${Math.min(
                                            100,
                                            response.scores.weighted
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs space-y-1">
                                  {/* Skor detayları */}
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Fiyat:
                                    </span>
                                    <span className="font-medium">
                                      {response.scores.price}/100
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Kapsam:
                                    </span>
                                    <span className="font-medium">
                                      {response.scores.coverage}/100
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Rating:
                                    </span>
                                    <span className="font-medium">
                                      {response.scores.rating}/100
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Hız:
                                    </span>
                                    <span className="font-medium">
                                      {response.scores.speed}/100
                                    </span>
                                  </div>

                                  {/* Sompo özel bilgiler */}
                                  {response.company.name === "Sompo Sigorta" &&
                                    response.responseData &&
                                    typeof response.responseData === "object" &&
                                    "details" in response.responseData && (
                                      <div className="mt-2 pt-2 border-t space-y-1">
                                        {(response.responseData as any).details
                                          ?.proposalNo && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Teklif No:
                                            </span>
                                            <span className="font-medium text-blue-600">
                                              {
                                                (response.responseData as any)
                                                  .details.proposalNo
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {(response.responseData as any).details
                                          ?.commission && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Komisyon:
                                            </span>
                                            <span className="font-medium text-green-600">
                                              {
                                                (response.responseData as any)
                                                  .details.commission
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {(response.responseData as any).details
                                          ?.installment && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                              Taksit:
                                            </span>
                                            <span className="font-medium">
                                              {
                                                (response.responseData as any)
                                                  .details.installment
                                              }
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {session?.user ? (
                                  <Link
                                    href={`/policies/create?quoteResponseId=${response.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      variant={
                                        response.rank === 1
                                          ? "default"
                                          : "outline"
                                      }
                                      className={
                                        response.rank === 1
                                          ? "bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                          : ""
                                      }
                                    >
                                      {response.rank === 1
                                        ? "🏆 Poliçe Oluştur"
                                        : "Poliçe Oluştur"}
                                    </Button>
                                  </Link>
                                ) : (
                                  <Link href="/auth/register">
                                    <Button size="sm" variant="outline">
                                      Kayıt Ol
                                    </Button>
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                          Skorlama Nasıl Çalışır?
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            • <strong>Fiyat (%40):</strong> Düşük fiyat yüksek
                            puan
                          </p>
                          <p>
                            • <strong>Kapsam (%30):</strong> Geniş teminat
                            yüksek puan
                          </p>
                          <p>
                            • <strong>Rating (%20):</strong> Müşteri memnuniyeti
                          </p>
                          <p>
                            • <strong>Hız (%10):</strong> Hızlı işlem süresi
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">💡 Tasarruf</h4>
                        <p className="text-sm text-muted-foreground">
                          En ucuz:{" "}
                          <strong>
                            {formatCurrency(
                              Math.min(
                                ...scoredResponses.map((r) => Number(r.price))
                              )
                            )}
                          </strong>
                          <br />
                          En pahalı:{" "}
                          <strong>
                            {formatCurrency(
                              Math.max(
                                ...scoredResponses.map((r) => Number(r.price))
                              )
                            )}
                          </strong>
                          <br />
                          <span className="font-bold text-primary">
                            {formatCurrency(
                              Math.max(
                                ...scoredResponses.map((r) => Number(r.price))
                              ) -
                                Math.min(
                                  ...scoredResponses.map((r) => Number(r.price))
                                )
                            )}
                          </span>{" "}
                          fark var!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Kasko Coverage Comparison */}
                {quote.insuranceType === "KASKO" && (
                  <CoverageComparison responses={quote.responses} />
                )}
              </>
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

            {/* Admin/Broker Tools */}
            {isAdminOrBroker && (
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <QuoteWorkflowPanel
                  quote={{
                    ...quote,
                    responses: quote.responses.map((response) => ({
                      ...response,
                      price: Number(response.price),
                      company: {
                        ...response.company,
                        rating: response.company.rating
                          ? Number(response.company.rating)
                          : null,
                      },
                    })),
                  }}
                  adminUsers={adminUsers}
                />
                <QuoteNotes quoteId={quote.id} isAdminOrBroker={true} />
              </div>
            )}

            {/* User Notes (sadece public notlar) */}
            {!isAdminOrBroker && (
              <div className="mt-6">
                <QuoteNotes quoteId={quote.id} isAdminOrBroker={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
