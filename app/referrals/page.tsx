"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Copy,
  Share2,
  Users,
  DollarSign,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  referredUsersCount: number;
  totalCommission: number;
  referrals: Array<{
    id: string;
    referredUser: {
      name: string;
      email: string;
      joinedAt: string;
    };
    status: string;
    commissionRate: number;
    totalCommission: number;
    createdAt: string;
  }>;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referralUrl, setReferralUrl] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      // Referans kodunu al
      const codeRes = await fetch("/api/referrals/generate");
      if (codeRes.ok) {
        const codeData = await codeRes.json();
        setReferralCode(codeData.referralCode);
        setReferralUrl(codeData.referralUrl);
      }

      // İstatistikleri al
      const statsRes = await fetch("/api/referrals/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Load referral data error:", error);
      toast.error("Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Panoya kopyalandı!");
  };

  const shareReferralUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: "Sigorta Acentesi'ne Katıl",
        text: "En uygun sigorta fiyatlarını bul!",
        url: referralUrl,
      });
    } else {
      copyToClipboard(referralUrl);
    }
  };

  const statusLabels = {
    PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
    COMPLETED: { label: "Tamamlandı", color: "bg-green-100 text-green-800" },
    EXPIRED: { label: "Süresi Doldu", color: "bg-gray-100 text-gray-800" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold">
              <span className="hidden sm:inline">Sigorta Acentesi</span>
              <span className="sm:hidden">Sigorta</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard'a Dön
            </Link>
            <h1 className="text-3xl font-bold mb-2">Referans Programı</h1>
            <p className="text-muted-foreground">
              Arkadaşlarınızı davet edin, komisyon kazanın!
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Davet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.referredUsersCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Kayıt olan kullanıcı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Aktif Referans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalReferrals || 0}
                </div>
                <p className="text-xs text-muted-foreground">Toplam referans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tamamlanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.completedReferrals || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Komisyon kazandı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Kazanç
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(stats?.totalCommission || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Komisyon</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Code & URL */}
          <Card>
            <CardHeader>
              <CardTitle>Referans Linkiniz</CardTitle>
              <CardDescription>
                Bu linki paylaşarak arkadaşlarınızı davet edin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Referans Kodunuz
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="font-mono text-lg"
                  />
                  <Button
                    onClick={() => copyToClipboard(referralCode)}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopyala
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Davet Linki
                </label>
                <div className="flex gap-2">
                  <Input value={referralUrl} readOnly />
                  <Button
                    onClick={() => copyToClipboard(referralUrl)}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopyala
                  </Button>
                  <Button onClick={shareReferralUrl}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Nasıl Çalışır?
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    Referans linkinizi arkadaşlarınızla paylaşın
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    Arkadaşınız linkiniz üzerinden kayıt olsun
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    İlk poliçesini aldığında %5 komisyon kazanın
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Referrals Table */}
          {stats && stats.referrals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Davet Ettiğiniz Kullanıcılar</CardTitle>
                <CardDescription>
                  Referans sistemi üzerinden kayıt olan kullanıcılar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kullanıcı</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Komisyon Oranı</TableHead>
                      <TableHead>Kazanç</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {referral.referredUser.name || "İsimsiz"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {referral.referredUser.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(
                            referral.referredUser.joinedAt
                          ).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              statusLabels[
                                referral.status as keyof typeof statusLabels
                              ]?.color || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {statusLabels[
                              referral.status as keyof typeof statusLabels
                            ]?.label || referral.status}
                          </span>
                        </TableCell>
                        <TableCell>%{referral.commissionRate}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(referral.totalCommission)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
