"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Shield, Gift } from "lucide-react";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  async function validateReferralCode(code: string) {
    if (!code) {
      setReferralValid(null);
      return;
    }

    try {
      const response = await fetch("/api/referrals/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: code }),
      });

      const data = await response.json();
      setReferralValid(data.valid);

      if (data.valid) {
        toast.success("Referans kodu geçerli!", {
          description: `${data.referrer.name} tarafından davet edildiniz`,
        });
      }
    } catch (error) {
      console.error("Validate referral error:", error);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      referralCode: referralCode || undefined,
    };

    if (data.password !== data.confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      setIsLoading(false);
      return;
    }

    if (data.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          referralCode: data.referralCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Kayıt başarısız");
      }

      toast.success("Kayıt başarılı!", {
        description: "Giriş sayfasına yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      toast.error("Kayıt başarısız", {
        description: error.message || "Lütfen tekrar deneyin",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Sigorta Acentesi</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Kayıt Ol</CardTitle>
            <CardDescription className="text-center">
              Yeni hesap oluşturarak başlayın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Referral Code */}
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referans Kodu (Opsiyonel)</Label>
                <div className="relative">
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder="REF-XXXXXXXX"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      if (e.target.value) {
                        validateReferralCode(e.target.value.toUpperCase());
                      } else {
                        setReferralValid(null);
                      }
                    }}
                    disabled={isLoading}
                    className={
                      referralValid === true
                        ? "border-green-500"
                        : referralValid === false
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {referralValid === true && (
                    <Gift className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                  )}
                </div>
                {referralValid === true && (
                  <p className="text-xs text-green-600">
                    ✓ Referans kodu geçerli! İlk poliçenizden komisyon
                    kazanacaksınız.
                  </p>
                )}
                {referralValid === false && (
                  <p className="text-xs text-red-600">
                    ✗ Geçersiz referans kodu
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Zaten hesabınız var mı?{" "}
              </span>
              <Link href="/auth/login" className="text-primary hover:underline">
                Giriş Yap
              </Link>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    veya
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  ← Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
