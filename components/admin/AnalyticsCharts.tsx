"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  userRegistrations: Array<{ date: string; count: number }>;
  quoteStats: Array<{ date: string; count: number }>;
  policyStats: Array<{ date: string; count: number; revenue: number }>;
  insuranceTypeDistribution: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  companyPerformance: Array<{
    name: string;
    quotes: number;
    policies: number;
    revenue: number;
  }>;
  metrics: {
    conversionRate: number;
    avgPolicyValue: number;
    totalQuotes: number;
    totalPolicies: number;
  };
}

const COLORS = [
  "#667eea",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const insuranceTypeLabels: Record<string, string> = {
  TRAFFIC: "Trafik",
  KASKO: "Kasko",
  DASK: "DASK",
  HEALTH: "Sağlık",
};

export function AnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Analytics load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        İstatistikler yüklenemedi
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
        <TabsTrigger value="sales">Satışlar</TabsTrigger>
        <TabsTrigger value="companies">Şirketler</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                %{data.metrics.conversionRate}
              </div>
              <p className="text-xs text-muted-foreground">
                Teklif → Poliçe dönüşüm oranı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Ortalama Poliçe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 0,
                }).format(data.metrics.avgPolicyValue)}
              </div>
              <p className="text-xs text-muted-foreground">Ortalama prim</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Teklif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {data.metrics.totalQuotes}
              </div>
              <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Poliçe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {data.metrics.totalPolicies}
              </div>
              <p className="text-xs text-muted-foreground">Satılan poliçe</p>
            </CardContent>
          </Card>
        </div>

        {/* User Registrations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Kayıtları</CardTitle>
            <CardDescription>Son 7 günlük kayıt trendi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Kayıt Sayısı"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quote Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Teklif İstatistikleri</CardTitle>
            <CardDescription>Günlük teklif sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.quoteStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Teklif Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sales" className="space-y-6">
        {/* Policy Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Poliçe Satışları</CardTitle>
            <CardDescription>Günlük poliçe ve gelir trendi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.policyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Poliçe Sayısı"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Gelir (TL)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insurance Type Distribution */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sigorta Türü Dağılımı</CardTitle>
              <CardDescription>Poliçe sayısına göre</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.insuranceTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                      `${insuranceTypeLabels[entry.type]} (${entry.count})`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.insuranceTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gelir Dağılımı</CardTitle>
              <CardDescription>Sigorta türüne göre</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.insuranceTypeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    tickFormatter={(value) => insuranceTypeLabels[value]}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(value)
                    }
                    labelFormatter={(value) => insuranceTypeLabels[value]}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" name="Gelir (TL)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="companies" className="space-y-6">
        {/* Company Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Şirket Performansı</CardTitle>
            <CardDescription>Poliçe sayısına göre top 10</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data.companyPerformance}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="policies" fill="#667eea" name="Poliçe Sayısı" />
                <Bar dataKey="quotes" fill="#10b981" name="Teklif Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Company Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Şirket Geliri</CardTitle>
            <CardDescription>Prim toplamına göre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data.companyPerformance}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(value)
                  }
                />
                <Bar dataKey="revenue" fill="#f59e0b" name="Toplam Prim (TL)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
