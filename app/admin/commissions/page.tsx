"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Commission {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  policy: {
    id: string;
    insuranceType: string;
    premium: number;
    company: {
      name: string;
    };
    customer: {
      name: string;
      email: string;
    };
  };
  broker: {
    name: string;
    email: string;
  };
}

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadCommissions = async () => {
    try {
      const url =
        statusFilter === "all"
          ? "/api/admin/commissions"
          : `/api/admin/commissions?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Yükleme hatası");
      const data = await response.json();
      setCommissions(data.commissions);
    } catch (error) {
      toast.error("Komisyonlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, [statusFilter]);

  const updateCommissionStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/commissions/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Güncelleme hatası");

      const data = await response.json();
      toast.success(data.message);
      await loadCommissions();
    } catch (error) {
      toast.error("İşlem başarısız oldu");
    } finally {
      setProcessingId(null);
    }
  };

  const statusLabels = {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
    APPROVED: { label: "Onaylandı", color: "bg-blue-100 text-blue-800" },
    PAID: { label: "Ödendi", color: "bg-green-100 text-green-800" },
    REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-800" },
  };

  const insuranceTypeLabels = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  const stats = {
    total: commissions.reduce((sum, c) => sum + c.amount, 0),
    pending: commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + c.amount, 0),
    approved: commissions
      .filter((c) => c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amount, 0),
    paid: commissions
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + c.amount, 0),
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
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard'a Dön
            </Link>
            <h1 className="text-3xl font-bold">Komisyon Yönetimi</h1>
            <p className="text-muted-foreground mt-1">
              Broker komisyonlarını yönetin ve onaylayın
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Komisyon Listesi</CardTitle>
                  <CardDescription>
                    {commissions.length} komisyon
                  </CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Durum filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="PENDING">Bekliyor</SelectItem>
                    <SelectItem value="APPROVED">Onaylandı</SelectItem>
                    <SelectItem value="PAID">Ödendi</SelectItem>
                    <SelectItem value="REJECTED">Reddedildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Yükleniyor...
                </div>
              ) : commissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Prim</TableHead>
                      <TableHead>Komisyon</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlem</TableHead>
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
                            <p className="font-medium text-sm">
                              {commission.broker.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {commission.broker.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {commission.policy.customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {commission.policy.customer.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {commission.policy.company.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {
                            insuranceTypeLabels[
                              commission.policy
                                .insuranceType as keyof typeof insuranceTypeLabels
                            ]
                          }
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(commission.policy.premium)}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {formatCurrency(commission.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              statusLabels[
                                commission.status as keyof typeof statusLabels
                              ].color
                            }`}
                          >
                            {
                              statusLabels[
                                commission.status as keyof typeof statusLabels
                              ].label
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {commission.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateCommissionStatus(
                                      commission.id,
                                      "APPROVED"
                                    )
                                  }
                                  disabled={processingId === commission.id}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Onayla
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateCommissionStatus(
                                      commission.id,
                                      "REJECTED"
                                    )
                                  }
                                  disabled={processingId === commission.id}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reddet
                                </Button>
                              </>
                            )}
                            {commission.status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateCommissionStatus(commission.id, "PAID")
                                }
                                disabled={processingId === commission.id}
                              >
                                <DollarSign className="h-3 w-3 mr-1" />
                                Ödendi İşaretle
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Komisyon bulunamadı</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
