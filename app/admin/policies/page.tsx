import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowLeft, Receipt, Eye } from "lucide-react";
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

export default async function AdminPoliciesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Tüm poliçeleri al
  const policies = await prisma.policy.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      company: {
        select: {
          name: true,
        },
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
    ACTIVE: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
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
              <h1 className="text-3xl font-bold">Tüm Poliçeler</h1>
              <p className="text-muted-foreground mt-1">
                {policies.length} kesilen poliçe
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Poliçe Listesi</CardTitle>
              <CardDescription>
                Platform'daki tüm sigorta poliçeleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Poliçe No</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Şirket</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Prim</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="text-sm">
                        {formatDateTime(policy.createdAt)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {policy.policyNumber || "Bekliyor"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{policy.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {policy.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{policy.company.name}</TableCell>
                      <TableCell>
                        {
                          insuranceTypeLabels[
                            policy.insuranceType as keyof typeof insuranceTypeLabels
                          ]
                        }
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(Number(policy.premium))}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            statusColors[
                              policy.status as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {policy.status}
                        </span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
