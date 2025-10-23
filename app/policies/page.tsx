import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, Eye, FileText, Plus } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
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
import { Badge } from "@/components/ui/badge";

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

export default async function PoliciesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const policies = await prisma.policy.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard&apos;a Dön
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Poliçelerim</CardTitle>
                  <CardDescription className="mt-2">
                    Tüm poliçelerinizi görüntüleyin ve yönetin
                  </CardDescription>
                </div>
                {policies.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {policies.length} poliçe
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto max-w-sm">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      Henüz poliçeniz bulunmuyor
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Hemen teklif alarak size en uygun sigortayı bulabilirsiniz
                    </p>
                    <Link href="/trafik">
                      <Button size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Teklif Al
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Poliçe No</TableHead>
                        <TableHead>Sigorta Türü</TableHead>
                        <TableHead>Şirket</TableHead>
                        <TableHead>Prim</TableHead>
                        <TableHead>Başlangıç</TableHead>
                        <TableHead>Bitiş</TableHead>
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
                          <TableCell>
                            {insuranceTypeLabels[policy.insuranceType]}
                          </TableCell>
                          <TableCell>{policy.company.name}</TableCell>
                          <TableCell className="font-medium">
                            {new Intl.NumberFormat("tr-TR", {
                              style: "currency",
                              currency: "TRY",
                            }).format(Number(policy.premium))}
                          </TableCell>
                          <TableCell>
                            {policy.startDate
                              ? new Date(policy.startDate).toLocaleDateString(
                                  "tr-TR"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {policy.endDate
                              ? new Date(policy.endDate).toLocaleDateString(
                                  "tr-TR"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusColors[policy.status]}>
                              {statusLabels[policy.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/policies/${policy.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Görüntüle
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
