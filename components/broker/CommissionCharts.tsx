"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

interface CommissionData {
  date: string;
  amount: number;
  count: number;
}

export function CommissionCharts() {
  const [data, setData] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissionData();
  }, []);

  const loadCommissionData = async () => {
    try {
      // Son 7 günlük komisyon verilerini simüle et
      // Gerçek uygulamada API'den gelecek
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
          }),
          amount: Math.random() * 5000 + 1000,
          count: Math.floor(Math.random() * 10) + 1,
        };
      });

      setData(last7Days);
    } catch (error) {
      console.error("Commission data load error:", error);
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

  return (
    <div className="space-y-6">
      {/* Commission Amount Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Komisyon Geliri Trendi</CardTitle>
          <CardDescription>Son 7 günlük komisyon kazancı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Komisyon (TL)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commission Count */}
      <Card>
        <CardHeader>
          <CardTitle>Komisyon Sayısı</CardTitle>
          <CardDescription>Günlük komisyon kazanma sayısı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#667eea" name="Komisyon Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
