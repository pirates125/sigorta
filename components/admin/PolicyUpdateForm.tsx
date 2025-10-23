"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface PolicyUpdateFormProps {
  policy: any;
}

export function PolicyUpdateForm({ policy }: PolicyUpdateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: policy.policyNumber || "",
    status: policy.status,
    startDate: policy.startDate
      ? new Date(policy.startDate).toISOString().split("T")[0]
      : "",
    endDate: policy.endDate
      ? new Date(policy.endDate).toISOString().split("T")[0]
      : "",
    paymentReceived: policy.paymentReceived,
    paymentAmount: policy.paymentAmount
      ? Number(policy.paymentAmount).toString()
      : "",
    pdfUrl: policy.pdfUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare update data
      const updateData: any = {
        policyNumber: formData.policyNumber || null,
        status: formData.status,
        paymentReceived: formData.paymentReceived,
        pdfUrl: formData.pdfUrl || null,
      };

      // Only add dates if they're not empty
      if (formData.startDate) {
        updateData.startDate = formData.startDate;
      }
      if (formData.endDate) {
        updateData.endDate = formData.endDate;
      }

      // Only add payment amount if it has a value
      if (formData.paymentAmount) {
        updateData.paymentAmount = parseFloat(formData.paymentAmount);
      }

      console.log("Sending update data:", updateData);

      const response = await fetch(`/api/policies/${policy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error Response:", error);
        throw new Error(
          error.error
            ? `${error.message}: ${error.error}`
            : error.message || "Güncelleme başarısız"
        );
      }

      const result = await response.json();
      console.log("Update success:", result);
      toast.success("Poliçe başarıyla güncellendi! ✅");
      router.refresh();
    } catch (error: any) {
      console.error("Update error details:", {
        message: error.message,
        formData,
        policyId: policy.id,
      });
      toast.error(error.message || "Bir hata oluştu", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poliçe Düzenle</CardTitle>
        <CardDescription>
          Poliçe bilgilerini güncelleyebilirsiniz (Sadece Admin)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="policyNumber">Poliçe Numarası</Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) =>
                  setFormData({ ...formData, policyNumber: e.target.value })
                }
                placeholder="POL-12345"
              />
            </div>

            <div>
              <Label htmlFor="status">Durum</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Beklemede</SelectItem>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="CANCELLED">İptal</SelectItem>
                  <SelectItem value="EXPIRED">Süresi Doldu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="paymentReceived">Ödeme Durumu</Label>
              <Select
                value={formData.paymentReceived ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentReceived: value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Bekliyor</SelectItem>
                  <SelectItem value="true">Ödendi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentAmount">Ödenen Tutar (TRY)</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                value={formData.paymentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, paymentAmount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pdfUrl: e.target.value })
                }
                placeholder="https://example.com/policy.pdf"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
