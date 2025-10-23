import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, DollarSign } from "lucide-react";
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

export default async function BrokerCommissionsPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "BROKER" && session.user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const brokerId = session.user.id;

  // Komisyonları al
  const commissions = await prisma.commission.findMany({
    where: {
      userId: brokerId,
    },
    include: {
      policy: {
        include: {
          company: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      referral: {
        include: {
          referredUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // İstatistikler
  const stats = {
    total: commissions.reduce((sum, c) => sum + Number(c.amount), 0),
    pending: commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + Number(c.amount), 0),
    approved: commissions
      .filter((c) => c.status === "APPROVED")
      .reduce((sum, c) => sum + Number(c.amount), 0),
    paid: commissions
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + Number(c.amount), 0),
  };

  const statusLabels = {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
    APPROVED: { label: "Onaylandı", color: "bg-blue-100 text-blue-800" },
    PAID: { label: "Ödendi", color: "bg-green-100 text-green-800" },
    REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-800" },
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
            <h1 className="text-3xl font-bold">Komisyonlarım</h1>
            <p className="text-muted-foreground mt-1">
              Referans sistemi üzerinden kazandığınız komisyonlar
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Komisyon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.total)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bekliyor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pending)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Onaylandı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.approved)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ödendi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.paid)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Komisyon Geçmişi</CardTitle>
              <CardDescription>
                Tüm komisyon ödemeleriniz ve durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Poliçe Primi</TableHead>
                      <TableHead>Komisyon</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="text-sm">
                          {formatDateTime(commission.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {commission.policy.user.name || "İsimsiz"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {commission.policy.user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{commission.policy.company.name}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(Number(commission.policy.premium))}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {formatCurrency(Number(commission.amount))}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              statusLabels[commission.status].color
                            }`}
                          >
                            {statusLabels[commission.status].label}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Henüz komisyon yok</p>
                  <p className="text-sm mb-4">
                    Müşterileriniz poliçe aldığında komisyon kazanmaya
                    başlayacaksınız
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
