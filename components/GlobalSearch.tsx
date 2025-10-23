"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FileText, Shield, User, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async () => {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery("");
  };

  const insuranceTypeLabels: Record<string, string> = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  const totalResults = results?.totalResults || 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="TC, Plaka, Email ile ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results && totalResults > 0 && (
        <Card className="absolute top-full mt-2 w-full max-h-[70vh] overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-4 space-y-4">
            {/* Quotes */}
            {results.results.quotes?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Teklifler ({results.results.quotes.length})
                </h4>
                <div className="space-y-2">
                  {results.results.quotes.map((quote: any) => (
                    <Link
                      key={quote.id}
                      href={`/quotes/${quote.id}`}
                      onClick={handleResultClick}
                    >
                      <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {insuranceTypeLabels[quote.insuranceType]}{" "}
                              Sigortası
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {quote.formData?.plate && (
                                <>Plaka: {quote.formData.plate}</>
                              )}
                              {quote.user?.name && <> • {quote.user.name}</>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(quote.createdAt)}
                            </p>
                          </div>
                          {quote.responses[0] && (
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(
                                  Number(quote.responses[0].price)
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {quote.responses[0].company.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {results.results.policies?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Poliçeler ({results.results.policies.length})
                </h4>
                <div className="space-y-2">
                  {results.results.policies.map((policy: any) => (
                    <Link
                      key={policy.id}
                      href={`/policies/${policy.id}`}
                      onClick={handleResultClick}
                    >
                      <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {policy.policyNumber || "Poliçe Numarası Yok"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {policy.company.name}
                              {policy.quote?.formData?.plate && (
                                <> • Plaka: {policy.quote.formData.plate}</>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(policy.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(Number(policy.premium))}
                            </p>
                            <p className="text-xs text-green-600">
                              {policy.status === "ACTIVE" ? "Aktif" : "Pasif"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Customers (Admin/Broker only) */}
            {results.results.customers?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Müşteriler ({results.results.customers.length})
                </h4>
                <div className="space-y-2">
                  {results.results.customers.map((customer: any) => (
                    <Link
                      key={customer.id}
                      href={`/admin/users?id=${customer.id}`}
                      onClick={handleResultClick}
                    >
                      <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer._count.quotes} Teklif •{" "}
                              {customer._count.policies} Poliçe
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.role}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* View All Results */}
            <div className="pt-2 border-t">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
              >
                <button className="text-sm text-primary hover:underline w-full text-center">
                  Tüm Sonuçları Görüntüle ({totalResults})
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && results && totalResults === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              &quot;{query}&quot; için sonuç bulunamadı
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              TC Kimlik No, Plaka veya Email ile arama yapabilirsiniz
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
