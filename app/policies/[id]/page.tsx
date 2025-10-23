import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, Download, FileText } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { PolicyUpdateForm } from "@/components/admin/PolicyUpdateForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

const insuranceTypeLabels: Record<string, string> = {
  TRAFFIC: "Trafik Sigortası",
  KASKO: "Kasko Sigortası",
  DASK: "DASK Sigortası",
  HEALTH: "Sağlık Sigortası",
};

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  ACTIVE: "Aktif",
  CANCELLED: "İptal",
  EXPIRED: "Süresi Doldu",
};

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  ACTIVE: "default",
  CANCELLED: "destructive",
  EXPIRED: "destructive",
};

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      company: true,
      quote: true,
    },
  });

  if (!policy) {
    notFound();
  }

  // Sadece poliçe sahibi veya admin erişebilir
  const isOwner = policy.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/dashboard");
  }

  const policyData = policy.policyData as any;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold">
              <span className="hidden sm:inline">Sigorta Acentesi</span>
              <span className="sm:hidden">Sigorta</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">
              {session.user.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <Link href="/policies">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Poliçelere Dön
              </Button>
            </Link>
          </div>

          {/* Admin düzenleme formu */}
          {isAdmin && (
            <PolicyUpdateForm
              policy={{
                ...policy,
                premium: Number(policy.premium),
                paymentAmount: policy.paymentAmount
                  ? Number(policy.paymentAmount)
                  : null,
                company: {
                  ...policy.company,
                  rating: policy.company.rating
                    ? Number(policy.company.rating)
                    : null,
                },
              }}
            />
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {/* Poliçe Özeti */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Poliçe Detayları</CardTitle>
                    <CardDescription>
                      {insuranceTypeLabels[policy.insuranceType]}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={statusColors[policy.status]}
                    className="text-sm"
                  >
                    {statusLabels[policy.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Genel Bilgiler */}
                <div>
                  <h3 className="font-semibold mb-4 text-base">
                    Genel Bilgiler
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Poliçe No</p>
                      <p className="font-mono font-medium">
                        {policy.policyNumber || "Henüz atanmadı"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sigorta Şirketi
                      </p>
                      <p className="font-medium">{policy.company.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Prim Tutarı
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(Number(policy.premium))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Para Birimi
                      </p>
                      <p className="font-medium">{policy.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Başlangıç Tarihi
                      </p>
                      <p className="font-medium">
                        {policy.startDate
                          ? new Date(policy.startDate).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Henüz başlamadı"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bitiş Tarihi
                      </p>
                      <p className="font-medium">
                        {policy.endDate
                          ? new Date(policy.endDate).toLocaleDateString("tr-TR")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ödeme Durumu */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 text-base">
                    Ödeme Bilgileri
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ödeme Durumu
                      </p>
                      <Badge
                        variant={
                          policy.paymentReceived ? "default" : "secondary"
                        }
                      >
                        {policy.paymentReceived ? "Ödendi" : "Bekliyor"}
                      </Badge>
                    </div>
                    {policy.paymentAmount && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ödenen Tutar
                        </p>
                        <p className="font-medium">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(Number(policy.paymentAmount))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Poliçe Verileri */}
                {policyData && Object.keys(policyData).length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-base">
                      Poliçe Verileri
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(policyData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* İşlemler */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {policy.pdfUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={policy.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF İndir
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/quotes/${policy.quoteId}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Teklifi Görüntüle
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Oluşturma Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Oluşturulma</p>
                    <p className="font-medium">
                      {new Date(policy.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Son Güncelleme</p>
                    <p className="font-medium">
                      {new Date(policy.updatedAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
