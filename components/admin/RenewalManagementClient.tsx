"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Calendar, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Policy {
  id: string;
  policyNumber: string | null;
  insuranceType: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  company: {
    name: string;
  };
  endDate: Date | null;
  premium: number;
  renewalStatus: string;
  daysLeft: number | null;
  renewalReminded: boolean;
}

interface RenewalData {
  policies: Policy[];
  stats: {
    total: number;
    urgent: number;
    dueSoon: number;
    upcoming: number;
    reminded: number;
  };
}

const insuranceTypeLabels: Record<string, string> = {
  TRAFFIC: "Trafik",
  KASKO: "Kasko",
  DASK: "DASK",
  HEALTH: "Sağlık",
};

export function RenewalManagementClient() {
  const [data, setData] = useState<RenewalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "urgent" | "upcoming">("all");

  useEffect(() => {
    loadRenewalData();
  }, [filter]);

  const loadRenewalData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/renewals?filter=${filter}`);
      if (response.ok) {
        const renewalData = await response.json();
        setData(renewalData);
      }
    } catch (error) {
      console.error("Renewal data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return <div>Veri yüklenemedi</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Yaklaşan
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acil (7 Gün)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {data.stats.urgent}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yakın (15 Gün)
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {data.stats.dueSoon}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hatırlatma Gönderildi
            </CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.stats.reminded}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vade Takip</CardTitle>
              <CardDescription>Tüm yaklaşan poliçe vadeleri</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                Tümü ({data.stats.total})
              </Button>
              <Button
                size="sm"
                variant={filter === "urgent" ? "destructive" : "outline"}
                onClick={() => setFilter("urgent")}
              >
                Acil ({data.stats.urgent})
              </Button>
              <Button
                size="sm"
                variant={filter === "upcoming" ? "default" : "outline"}
                onClick={() => setFilter("upcoming")}
              >
                Yaklaşan ({data.stats.upcoming})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.policies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Yakın zamanda vadesi dolacak poliçe bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Poliçe No</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Vade Tarihi</TableHead>
                  <TableHead>Kalan Gün</TableHead>
                  <TableHead>Prim</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {policy.user.name || "İsimsiz"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {policy.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{policy.policyNumber || "-"}</TableCell>
                    <TableCell>
                      {insuranceTypeLabels[policy.insuranceType]}
                    </TableCell>
                    <TableCell>{policy.company.name}</TableCell>
                    <TableCell>
                      {policy.endDate
                        ? new Date(policy.endDate).toLocaleDateString("tr-TR")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          policy.renewalStatus === "URGENT"
                            ? "destructive"
                            : policy.renewalStatus === "DUE_SOON"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {policy.daysLeft !== null && policy.daysLeft >= 0
                          ? `${policy.daysLeft} gün`
                          : "Doldu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(policy.premium)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {policy.renewalStatus === "URGENT" && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        {policy.renewalReminded && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Hatırlatıldı
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
