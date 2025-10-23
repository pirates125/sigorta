"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
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
  getRenewalStatusLabel,
  getRenewalStatusColor,
} from "@/lib/renewal-utils";

interface Policy {
  id: string;
  policyNumber: string | null;
  insuranceType: string;
  company: {
    name: string;
  };
  endDate: Date | null;
  premium: number;
  renewalStatus: string;
  daysLeft: number | null;
}

interface RenewalData {
  policies: Policy[];
  stats: {
    total: number;
    urgent: number;
    dueSoon: number;
    upcoming: number;
  };
}

const insuranceTypeLabels: Record<string, string> = {
  TRAFFIC: "Trafik",
  KASKO: "Kasko",
  DASK: "DASK",
  HEALTH: "Sağlık",
};

export function RenewalWidget() {
  const [data, setData] = useState<RenewalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "urgent" | "upcoming">("all");

  useEffect(() => {
    loadRenewalData();
  }, [filter]);

  const loadRenewalData = async () => {
    try {
      const response = await fetch(
        `/api/policies/upcoming-renewals?filter=${filter}`
      );
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
      <Card>
        <CardHeader>
          <CardTitle>Yaklaşan Vadeler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.policies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yaklaşan Vadeler</CardTitle>
          <CardDescription>Yenilenecek poliçe yok</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Yakın zamanda vadenizi dolacak poliçe bulunmuyor</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Yaklaşan Vadeler</CardTitle>
            <CardDescription>
              {data.stats.total} poliçe yenilenecek
            </CardDescription>
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
        <div className="space-y-4">
          {data.policies.map((policy) => (
            <div
              key={policy.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">
                    {insuranceTypeLabels[policy.insuranceType]}
                  </h4>
                  <Badge
                    variant={
                      policy.renewalStatus === "URGENT"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {policy.daysLeft !== null && policy.daysLeft >= 0
                      ? `${policy.daysLeft} gün`
                      : "Doldu"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {policy.company.name} • Poliçe No:{" "}
                  {policy.policyNumber || "Bekleniyor"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vade:{" "}
                  {policy.endDate
                    ? new Date(policy.endDate).toLocaleDateString("tr-TR")
                    : "-"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-sm text-muted-foreground">Mevcut Prim</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(policy.premium)}
                  </p>
                </div>

                {policy.renewalStatus === "URGENT" && (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
                {policy.renewalStatus === "DUE_SOON" && (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}

                <Link href={`/trafik?renewPolicy=${policy.id}`}>
                  <Button size="sm">Yenile</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {data.stats.urgent > 0 && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                {data.stats.urgent} poliçenizin süresi 7 gün içinde dolacak!
                Hemen yenileyin.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
