"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Power, PowerOff } from "lucide-react";
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
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  code: string;
  rating: number | null;
  coverageScore: number | null;
  avgResponseTime: number | null;
  scraperEnabled: boolean;
  hasApi: boolean;
  _count: {
    quoteResponses: number;
    policies: number;
  };
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetch("/api/admin/companies");
      if (!response.ok) throw new Error("Yetkiniz yok");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      toast.error("Şirketler yüklenemedi");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const toggleScraper = async (companyId: string, currentStatus: boolean) => {
    setToggling(companyId);
    try {
      const response = await fetch(
        `/api/admin/companies/${companyId}/toggle-scraper`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("İşlem başarısız");

      const data = await response.json();
      toast.success(data.message);

      // Liste güncelle
      setCompanies(
        companies.map((c) =>
          c.id === companyId ? { ...c, scraperEnabled: data.scraperEnabled } : c
        )
      );
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              <h1 className="text-3xl font-bold">Sigorta Şirketleri</h1>
              <p className="text-muted-foreground mt-1">
                {companies.length} sigorta şirketi
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Şirket Listesi</CardTitle>
              <CardDescription>
                Platform'daki sigorta şirketleri ve performans metrikleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Şirket</TableHead>
                    <TableHead>Kod</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Kapsam Skoru</TableHead>
                    <TableHead>Ort. Yanıt Süresi</TableHead>
                    <TableHead>Teklifler</TableHead>
                    <TableHead>Poliçeler</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {company.code}
                      </TableCell>
                      <TableCell>
                        {company.rating ? (
                          <div className="flex items-center">
                            <span className="font-medium">
                              {Number(company.rating).toFixed(1)}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              / 5
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {company.coverageScore ? (
                          <div className="flex items-center">
                            <span className="font-medium">
                              {company.coverageScore}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              / 100
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {company.avgResponseTime ? (
                          <span className="text-sm">
                            {(company.avgResponseTime / 1000).toFixed(1)}s
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{company._count.quoteResponses}</TableCell>
                      <TableCell>{company._count.policies}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {company.scraperEnabled ? (
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                              Scraper Aktif
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                              Scraper Kapalı
                            </span>
                          )}
                          {company.hasApi && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              API Var
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={
                            company.scraperEnabled ? "destructive" : "default"
                          }
                          onClick={() =>
                            toggleScraper(company.id, company.scraperEnabled)
                          }
                          disabled={toggling === company.id}
                        >
                          {toggling === company.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : company.scraperEnabled ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-1" />
                              Devre Dışı
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-1" />
                              Aktif Et
                            </>
                          )}
                        </Button>
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
