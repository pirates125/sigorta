"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Building2 } from "lucide-react";

interface QuoteLoadingProgressProps {
  quoteId: string;
}

export function QuoteLoadingProgress({ quoteId }: QuoteLoadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(7); // Aktif scraper sayısı
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Zamanı say
    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Polling - her 2 saniyede bir durumu kontrol et
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}/progress`);
        if (response.ok) {
          const data = await response.json();
          setTotal(data.total || 7);
          setCompleted(data.completed || 0);
          setProgress(((data.completed || 0) / (data.total || 7)) * 100);

          // Tüm şirketlerden cevap geldi mi?
          if (data.status === "COMPLETED" || data.completed >= total) {
            setIsLoading(false);
            clearInterval(interval);
            clearInterval(timeInterval);
            // Sayfayı yenile
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Progress check error:", error);
      }
    }, 2000); // Her 2 saniyede bir kontrol

    // 60 saniye sonra timeout (30'dan 60'a uzattık)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(interval);
      clearInterval(timeInterval);
      window.location.reload();
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
      clearTimeout(timeout);
    };
  }, [quoteId, total]);

  if (!isLoading) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${secs}s`;
  };

  return (
    <Card className="mb-8 border-primary/20 bg-linear-to-r from-primary/5 to-background">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Teklifler Alınıyor...</h3>
                <p className="text-sm text-muted-foreground">
                  {completed}/{total} sigorta şirketinden yanıt alındı
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Companies */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center justify-center p-2 rounded-md border transition-all ${
                  index < completed
                    ? "bg-green-50 dark:bg-green-950 border-green-500 text-green-700 dark:text-green-400"
                    : "bg-muted border-muted-foreground/20"
                }`}
              >
                {index < completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Building2 className="h-4 w-4 opacity-50" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              💡 Birden fazla şirket karşılaştırılarak size en uygun fiyat
              bulunuyor...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
