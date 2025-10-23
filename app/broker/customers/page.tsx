import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, Users } from "lucide-react";
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
import { formatDateTime } from "@/lib/utils";

export default async function BrokerCustomersPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "BROKER" && session.user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const brokerId = session.user.id;

  // Referans verdiği kullanıcıları al
  const customers = await prisma.user.findMany({
    where: {
      referredBy: brokerId,
    },
    include: {
      _count: {
        select: {
          quotes: true,
          policies: true,
        },
      },
      policies: {
        select: {
          premium: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/broker"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard'a Dön
              </Link>
              <h1 className="text-3xl font-bold">Müşterilerim</h1>
              <p className="text-muted-foreground mt-1">
                Referans verdiğiniz {customers.length} müşteri
              </p>
            </div>
            <Link href="/referrals">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Yeni Müşteri Davet Et
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Müşteri Listesi</CardTitle>
              <CardDescription>
                Referans sistemi üzerinden kazandığınız müşteriler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>Sorgular</TableHead>
                      <TableHead>Poliçeler</TableHead>
                      <TableHead>Toplam Prim</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => {
                      const totalPremium = customer.policies.reduce(
                        (sum, policy) => sum + Number(policy.premium),
                        0
                      );
                      return (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name || "İsimsiz"}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell className="text-sm">
                            {formatDateTime(customer.createdAt)}
                          </TableCell>
                          <TableCell>{customer._count.quotes}</TableCell>
                          <TableCell>{customer._count.policies}</TableCell>
                          <TableCell className="font-medium">
                            {new Intl.NumberFormat("tr-TR", {
                              style: "currency",
                              currency: "TRY",
                            }).format(totalPremium)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Henüz müşteriniz yok</p>
                  <p className="text-sm mb-4">
                    Referans linkinizi paylaşarak müşteri kazanmaya başlayın
                  </p>
                  <Link href="/referrals">
                    <Button>Referans Linki Oluştur</Button>
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
