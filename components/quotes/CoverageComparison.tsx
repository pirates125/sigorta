"use client";

import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  kaskoCoverages,
  kaskoCoveragePackages,
  type KaskoCoverageType,
} from "@/lib/kasko-coverages";

interface CoverageComparisonProps {
  responses: any[];
}

export function CoverageComparison({ responses }: CoverageComparisonProps) {
  // Group responses by coverage type
  const responsesByCoverage: Record<string, any[]> = {
    MINI: [],
    MIDI: [],
    MAXI: [],
  };

  responses.forEach((response) => {
    const coverageType = response.coverageType || "MIDI";
    if (responsesByCoverage[coverageType]) {
      responsesByCoverage[coverageType].push(response);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teminat Karşılaştırması</CardTitle>
        <CardDescription>
          Paketlere göre kapsam detayları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Teminat</th>
                {kaskoCoveragePackages.map((pkg) => (
                  <th key={pkg.type} className="text-center p-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{pkg.emoji}</span>
                      <span className="font-semibold">{pkg.name}</span>
                      {pkg.popular && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Popüler
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kaskoCoverages.map((coverage, index) => (
                <tr
                  key={coverage.id}
                  className={index % 2 === 0 ? "bg-muted/30" : ""}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{coverage.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {coverage.description}
                      </p>
                    </div>
                  </td>
                  {kaskoCoveragePackages.map((pkg) => (
                    <td key={pkg.type} className="text-center p-4">
                      {coverage.includedIn.includes(pkg.type) ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <X className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t bg-muted/50">
              <tr>
                <td className="p-4 font-semibold">Toplam Teminat Sayısı</td>
                {kaskoCoveragePackages.map((pkg) => (
                  <td key={pkg.type} className="text-center p-4 font-bold">
                    {pkg.coverages.length} Kapsam
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Price Comparison (if responses available) */}
        {responses.length > 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {kaskoCoveragePackages.map((pkg) => {
              const pkgResponses = responsesByCoverage[pkg.type] || [];
              const bestPrice =
                pkgResponses.length > 0
                  ? Math.min(...pkgResponses.map((r) => Number(r.price)))
                  : null;

              return (
                <Card
                  key={pkg.type}
                  className={pkg.popular ? "border-primary" : ""}
                >
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{pkg.emoji}</div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    {bestPrice ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          En düşük fiyat
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(bestPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {pkgResponses.length} şirketten teklif
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Teklif bekleniyor...
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

