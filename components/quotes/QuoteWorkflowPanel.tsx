"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface QuoteWorkflowPanelProps {
  quote: any;
  adminUsers: any[];
}

const statusLabels: Record<string, string> = {
  DRAFT: "Taslak",
  PENDING: "Beklemede",
  PROCESSING: "İşleniyor",
  COMPLETED: "Tamamlandı",
  CONTACTED: "İletişimde",
  QUOTED: "Teklif Sunuldu",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
  FAILED: "Hata",
};

const statusColors: Record<string, string> = {
  DRAFT: "secondary",
  PENDING: "secondary",
  PROCESSING: "default",
  COMPLETED: "default",
  CONTACTED: "default",
  QUOTED: "default",
  WON: "default",
  LOST: "destructive",
  FAILED: "destructive",
};

const priorityLabels: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
};

export function QuoteWorkflowPanel({
  quote,
  adminUsers,
}: QuoteWorkflowPanelProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(quote.status);
  const [priority, setPriority] = useState(quote.priority || "MEDIUM");
  const [assignedTo, setAssignedTo] = useState(quote.assignedTo || "UNASSIGNED");
  const [followUpDate, setFollowUpDate] = useState(
    quote.followUpDate
      ? new Date(quote.followUpDate).toISOString().split("T")[0]
      : ""
  );

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          assignedTo: assignedTo === "UNASSIGNED" ? null : assignedTo,
          followUpDate: followUpDate || null,
        }),
      });

      if (!response.ok) throw new Error("Güncelleme başarısız");

      toast.success("Teklif güncellendi! ✅");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Workflow Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Durum */}
        <div className="space-y-2">
          <Label>Durum</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Öncelik */}
        <div className="space-y-2">
          <Label>Öncelik</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Atanan Kişi */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-3 w-3" />
            Atanan Kişi
          </Label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNASSIGNED">Atanmamış</SelectItem>
              {adminUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Takip Tarihi */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Takip Tarihi
          </Label>
          <Input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>

        {/* Güncelle Butonu */}
        <Button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full"
          size="sm"
        >
          {updating ? "Güncelleniyor..." : "Güncelle"}
        </Button>

        {/* Mevcut Durum */}
        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Mevcut Durum:</span>
            <Badge variant={statusColors[quote.status] as any}>
              {statusLabels[quote.status]}
            </Badge>
          </div>
          {quote.assignedUser && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Atanan:</span>
              <span className="font-medium">{quote.assignedUser.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
