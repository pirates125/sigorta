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
import {
  kaskoCoveragePackages,
  usageTypes,
  type KaskoCoverageType,
} from "@/lib/kasko-coverages";
import { Check } from "lucide-react";

const kaskoInsuranceSchema = z.object({
  plate: z.string().min(7, "Geçerli bir plaka girin").max(10),
  vehicleBrand: z.string().min(1, "Marka girin"),
  vehicleModel: z.string().min(1, "Model girin"),
  vehicleYear: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  vehicleValue: z.number().min(10000, "Araç değeri en az 10.000 TL olmalıdır"),
  engineNumber: z.string().min(1, "Motor numarası girin"),
  chassisNumber: z.string().min(17, "Şase numarası 17 karakter olmalıdır"),
  usageType: z.enum(["PRIVATE", "TAXI", "COMMERCIAL"]),
  coverageType: z.enum(["MINI", "MIDI", "MAXI"]),
  driverName: z.string().min(2, "Sürücü adı girin"),
  driverTCKN: z.string().length(11, "TC Kimlik No 11 haneli olmalıdır"),
  driverBirthDate: z.string().min(1, "Doğum tarihi girin"),
  driverLicenseDate: z.string().min(1, "Ehliyet tarihi girin"),
  email: z.string().email("Geçerli bir email girin").optional(),
});

type KaskoInsuranceFormData = z.infer<typeof kaskoInsuranceSchema>;

export default function KaskoInsuranceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoverage, setSelectedCoverage] =
    useState<KaskoCoverageType>("MIDI");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KaskoInsuranceFormData>({
    resolver: zodResolver(kaskoInsuranceSchema),
    defaultValues: {
      usageType: "PRIVATE",
      coverageType: "MIDI",
    },
  });

  const vehicleYear = watch("vehicleYear");
  const vehicleValue = watch("vehicleValue");

  const onSubmit = async (data: KaskoInsuranceFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          insuranceType: "KASKO",
          formData: data,
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
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
      {/* Coverage Type Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Teminat Paketi Seçimi</CardTitle>
          <CardDescription>
            Aracınız için uygun koruma paketini seçin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {kaskoCoveragePackages.map((pkg) => (
              <button
                key={pkg.type}
                type="button"
                onClick={() => {
                  setSelectedCoverage(pkg.type);
                  setValue("coverageType", pkg.type);
                }}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  selectedCoverage === pkg.type
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Popüler
                  </div>
                )}
                {selectedCoverage === pkg.type && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl mb-2">{pkg.emoji}</div>
                  <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pkg.description}
                  </p>
                  <div className="text-xs text-left bg-muted/30 rounded p-2">
                    <p className="font-medium mb-1">Teminatlar:</p>
                    <p className="text-muted-foreground">
                      {pkg.coverages.length} kapsam
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
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
              <Label htmlFor="vehicleValue">Araç Değeri (TL) *</Label>
              <Input
                id="vehicleValue"
                type="number"
                {...register("vehicleValue", { valueAsNumber: true })}
                placeholder="500000"
                disabled={isLoading}
              />
              {errors.vehicleValue && (
                <p className="text-sm text-destructive">
                  {errors.vehicleValue.message}
                </p>
              )}
              {vehicleValue && (
                <p className="text-xs text-muted-foreground">
                  Tahmini prim: ~
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(vehicleValue * 0.045)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageType">Kullanım Şekli *</Label>
              <Select
                onValueChange={(value) => setValue("usageType", value as any)}
                defaultValue="PRIVATE"
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {usageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.usageType && (
                <p className="text-sm text-destructive">
                  {errors.usageType.message}
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

      {/* Driver Information */}
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

            <div className="space-y-2 md:col-span-2">
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
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Teklifler Alınıyor..." : "Kasko Teklifi Al"}
      </Button>
    </form>
  );
}

