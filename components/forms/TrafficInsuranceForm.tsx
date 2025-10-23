"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const trafficInsuranceSchema = z.object({
  plate: z.string().min(7, "Geçerli bir plaka girin").max(10),
  registrationCode: z.string().min(1, "Tescil seri kod girin (örn: ABC)").max(3, "Maksimum 3 karakter"),
  registrationNumber: z.string().min(1, "Tescil numarası girin").max(19, "Maksimum 19 karakter"),
  vehicleType: z.string().min(1, "Araç tipi seçin"),
  vehicleBrand: z.string().min(1, "Marka girin"),
  vehicleModel: z.string().min(1, "Model girin"),
  vehicleYear: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  engineNumber: z.string().min(1, "Motor numarası girin"),
  chassisNumber: z.string().min(17, "Şase numarası 17 karakter olmalıdır"),
  driverName: z.string().min(2, "Sürücü adı girin"),
  driverTCKN: z.string().length(11, "TC Kimlik No 11 haneli olmalıdır"),
  driverBirthDate: z.string().min(1, "Doğum tarihi girin"),
  driverLicenseDate: z.string().min(1, "Ehliyet tarihi girin"),
  hasClaimHistory: z.boolean(),
  claimCount: z.number().min(0).optional(),
  email: z.string().email("Geçerli bir email girin").optional(),
  phone: z.string().optional(), // Sompo TC'den otomatik çeker
});

type TrafficInsuranceFormData = z.infer<typeof trafficInsuranceSchema>;

export default function TrafficInsuranceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasClaimHistory, setHasClaimHistory] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrafficInsuranceFormData>({
    resolver: zodResolver(trafficInsuranceSchema),
    defaultValues: {
      hasClaimHistory: false,
      claimCount: 0,
    },
  });

  const onSubmit = async (data: TrafficInsuranceFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          insuranceType: "TRAFFIC",
          formData: data,
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Detaylı hata mesajı göster
        const errorMessage = result.message || "Teklif isteği başarısız oldu";
        toast.error("İşlem Başarısız", {
          description: errorMessage,
          duration: 5000,
        });
        return;
      }

      toast.success("Teklif İsteği Alındı! 🎉", {
        description: "Sigorta şirketlerinden fiyatlar karşılaştırılıyor...",
        duration: 3000,
      });

      // Sonuç sayfasına yönlendir
      const redirectUrl = result.accessToken
        ? `/quotes/${result.quoteId}?token=${result.accessToken}`
        : `/quotes/${result.quoteId}`;

      router.push(redirectUrl);
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error("Beklenmeyen Bir Hata Oluştu", {
        description:
          "Lütfen internet bağlantınızı kontrol edip tekrar deneyin.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Araç Bilgileri</CardTitle>
          <CardDescription>
            Sigorta yaptıracağınız aracın bilgilerini girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">Plaka *</Label>
              <Input
                id="plate"
                {...register("plate")}
                placeholder="34ABC123"
                disabled={isLoading}
              />
              {errors.plate && (
                <p className="text-sm text-destructive">
                  {errors.plate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationCode">Tescil Seri Kod *</Label>
              <Input
                id="registrationCode"
                {...register("registrationCode")}
                placeholder="ABC (3 karakter)"
                maxLength={3}
                disabled={isLoading}
              />
              {errors.registrationCode && (
                <p className="text-sm text-destructive">
                  {errors.registrationCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Tescil/ASBIS No *</Label>
              <Input
                id="registrationNumber"
                {...register("registrationNumber")}
                placeholder="12345678901234567890"
                maxLength={19}
                disabled={isLoading}
              />
              {errors.registrationNumber && (
                <p className="text-sm text-destructive">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Araç Tipi *</Label>
              <Select
                onValueChange={(value) => setValue("vehicleType", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otomobil">Otomobil</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="minibus">Minibüs</SelectItem>
                  <SelectItem value="kamyonet">Kamyonet</SelectItem>
                  <SelectItem value="motosiklet">Motosiklet</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-sm text-destructive">
                  {errors.vehicleType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Marka *</Label>
              <Input
                id="vehicleBrand"
                {...register("vehicleBrand")}
                placeholder="Toyota"
                disabled={isLoading}
              />
              {errors.vehicleBrand && (
                <p className="text-sm text-destructive">
                  {errors.vehicleBrand.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Model *</Label>
              <Input
                id="vehicleModel"
                {...register("vehicleModel")}
                placeholder="Corolla"
                disabled={isLoading}
              />
              {errors.vehicleModel && (
                <p className="text-sm text-destructive">
                  {errors.vehicleModel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Model Yılı *</Label>
              <Input
                id="vehicleYear"
                type="number"
                {...register("vehicleYear", { valueAsNumber: true })}
                placeholder="2020"
                disabled={isLoading}
              />
              {errors.vehicleYear && (
                <p className="text-sm text-destructive">
                  {errors.vehicleYear.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engineNumber">Motor Numarası *</Label>
              <Input
                id="engineNumber"
                {...register("engineNumber")}
                placeholder="XXXXXX"
                disabled={isLoading}
              />
              {errors.engineNumber && (
                <p className="text-sm text-destructive">
                  {errors.engineNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="chassisNumber">Şase Numarası *</Label>
              <Input
                id="chassisNumber"
                {...register("chassisNumber")}
                placeholder="17 haneli şase numarası"
                disabled={isLoading}
              />
              {errors.chassisNumber && (
                <p className="text-sm text-destructive">
                  {errors.chassisNumber.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sürücü Bilgileri</CardTitle>
          <CardDescription>Sigorta ettiren kişinin bilgileri</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Ad Soyad *</Label>
              <Input
                id="driverName"
                {...register("driverName")}
                placeholder="Ahmet Yılmaz"
                disabled={isLoading}
              />
              {errors.driverName && (
                <p className="text-sm text-destructive">
                  {errors.driverName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverTCKN">TC Kimlik No *</Label>
              <Input
                id="driverTCKN"
                {...register("driverTCKN")}
                placeholder="12345678901"
                maxLength={11}
                disabled={isLoading}
              />
              {errors.driverTCKN && (
                <p className="text-sm text-destructive">
                  {errors.driverTCKN.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverBirthDate">Doğum Tarihi *</Label>
              <Input
                id="driverBirthDate"
                type="date"
                {...register("driverBirthDate")}
                disabled={isLoading}
              />
              {errors.driverBirthDate && (
                <p className="text-sm text-destructive">
                  {errors.driverBirthDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverLicenseDate">Ehliyet Tarihi *</Label>
              <Input
                id="driverLicenseDate"
                type="date"
                {...register("driverLicenseDate")}
                disabled={isLoading}
              />
              {errors.driverLicenseDate && (
                <p className="text-sm text-destructive">
                  {errors.driverLicenseDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Sonuçlar için)</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="ornek@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon (Opsiyonel - TC'den otomatik alınır)</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="5XXXXXXXXX (boş bırakılabilir)"
                maxLength={10}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Sompo TC Kimlik'ten otomatik çeker, boş bırakabilirsiniz
              </p>
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hasar Geçmişi</CardTitle>
          <CardDescription>Son 5 yıldaki hasar durumu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasClaimHistory"
              {...register("hasClaimHistory")}
              onChange={(e) => {
                setHasClaimHistory(e.target.checked);
                setValue("hasClaimHistory", e.target.checked);
                if (!e.target.checked) {
                  setValue("claimCount", 0);
                }
              }}
              disabled={isLoading}
              className="w-4 h-4"
            />
            <Label htmlFor="hasClaimHistory" className="cursor-pointer">
              Son 5 yılda hasar kaydım var
            </Label>
          </div>

          {hasClaimHistory && (
            <div className="space-y-2">
              <Label htmlFor="claimCount">Hasar Sayısı</Label>
              <Input
                id="claimCount"
                type="number"
                {...register("claimCount", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                disabled={isLoading}
              />
              {errors.claimCount && (
                <p className="text-sm text-destructive">
                  {errors.claimCount.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Teklifler Alınıyor..." : "Teklif Al"}
      </Button>
    </form>
  );
}
