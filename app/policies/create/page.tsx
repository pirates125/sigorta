"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

function CreatePolicyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteResponseId = searchParams.get("quoteResponseId");

  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);

  useEffect(() => {
    if (!quoteResponseId) {
      toast.error("Geçersiz teklif");
      router.push("/dashboard");
      return;
    }

    loadQuoteResponse();
  }, [quoteResponseId]);

  const loadQuoteResponse = async () => {
    try {
      const response = await fetch(`/api/quote-responses/${quoteResponseId}`);

      if (!response.ok) {
        throw new Error("Teklif bulunamadı");
      }

      const data = await response.json();
      setQuoteResponse(data);
      setLoading(false);
    } catch (error) {
      console.error("Load quote response error:", error);
      toast.error("Teklif bulunamadı");
      router.push("/dashboard");
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchasing(true);

    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponseId,
          paymentMethod: "credit_card",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Poliçe oluşturulamadı");
      }

      const data = await response.json();

      toast.success("Poliçe başarıyla oluşturuldu!", {
        description: "Poliçeniz email adresinize gönderildi",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
      setPurchasing(false);
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
            <span className="text-2xl font-bold">Sigorta Acentesi</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard'a Dön
            </Link>
            <h1 className="text-3xl font-bold">Poliçe Satın Al</h1>
            <p className="text-muted-foreground mt-1">
              Seçtiğiniz teklif için ödeme yapın
            </p>
          </div>

          {/* Quote Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Teklif Özeti</CardTitle>
              <CardDescription>
                Seçtiğiniz sigorta teklifi bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sigorta Şirketi:</span>
                <span className="font-medium">
                  {quoteResponse.company.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sigorta Türü:</span>
                <span className="font-medium">
                  {quoteResponse.quote.insuranceType === "TRAFFIC"
                    ? "Trafik Sigortası"
                    : quoteResponse.quote.insuranceType === "KASKO"
                    ? "Kasko"
                    : quoteResponse.quote.insuranceType === "DASK"
                    ? "DASK"
                    : "Sağlık Sigortası"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold">Toplam Tutar:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(quoteResponse.price))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Bilgileri</CardTitle>
              <CardDescription>
                Kredi kartı bilgilerinizi güvenle girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchase} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Kart Numarası</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      disabled={purchasing}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      disabled={purchasing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      disabled={purchasing}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                  <Input
                    id="cardName"
                    placeholder="AD SOYAD"
                    disabled={purchasing}
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mr-2"
                      disabled={purchasing}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      <Link
                        href="/kvkk"
                        className="text-primary hover:underline"
                      >
                        KVKK
                      </Link>{" "}
                      ve{" "}
                      <Link
                        href="/gizlilik"
                        className="text-primary hover:underline"
                      >
                        Gizlilik Politikası
                      </Link>
                      'nı okudum, kabul ediyorum
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Ödemeyi Tamamla
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    🔒 Ödeme bilgileriniz SSL ile şifrelenir
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CreatePolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CreatePolicyContent />
    </Suspense>
  );
}
