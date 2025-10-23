import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield,
  FileText,
  User,
  ArrowLeft,
  Search as SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LogoutButton } from "@/components/LogoutButton";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage(props: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const searchParams = await props.searchParams;
  const query = searchParams.q?.trim() || "";

  let results: {
    quotes: any[];
    policies: any[];
    customers: any[];
  } = {
    quotes: [],
    policies: [],
    customers: [],
  };

  if (query.length >= 2) {
    const isAdmin = session.user.role === "ADMIN";
    const isBroker = session.user.role === "BROKER";
    const userId = session.user.id;

    const isTCKN = /^\d{11}$/.test(query);
    const isPlate = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/i.test(
      query.replace(/\s/g, "")
    );
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

    // QUOTES
    const quoteWhere: any = { OR: [] };
    if (!isAdmin && !isBroker) {
      quoteWhere.userId = userId;
    }

    if (isPlate) {
      quoteWhere.OR.push({
        formData: {
          path: ["plate"],
          string_contains: query.toUpperCase().replace(/\s/g, ""),
        },
      });
    }

    if (isTCKN) {
      quoteWhere.OR.push({
        formData: {
          path: ["driverTCKN"],
          equals: query,
        },
      });
    }

    if (isEmail) {
      quoteWhere.OR.push({
        guestEmail: { contains: query, mode: "insensitive" },
      });
      if (isAdmin || isBroker) {
        quoteWhere.OR.push({
          user: { email: { contains: query, mode: "insensitive" } },
        });
      }
    }

    quoteWhere.OR.push({ id: { contains: query, mode: "insensitive" } });

    if (quoteWhere.OR.length > 0) {
      results.quotes = await prisma.quote.findMany({
        where: quoteWhere,
        include: {
          user: { select: { name: true, email: true } },
          responses: {
            orderBy: { price: "asc" },
            take: 1,
            include: { company: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    // POLICIES
    const policyWhere: any = { OR: [] };
    if (!isAdmin && !isBroker) {
      policyWhere.userId = userId;
    }

    if (query) {
      policyWhere.OR.push({
        policyNumber: { contains: query, mode: "insensitive" },
      });
    }

    if (isTCKN) {
      policyWhere.OR.push({
        quote: {
          formData: { path: ["driverTCKN"], equals: query },
        },
      });
    }

    if (isPlate) {
      policyWhere.OR.push({
        quote: {
          formData: {
            path: ["plate"],
            string_contains: query.toUpperCase().replace(/\s/g, ""),
          },
        },
      });
    }

    policyWhere.OR.push({ id: { contains: query, mode: "insensitive" } });

    if (policyWhere.OR.length > 0) {
      results.policies = await prisma.policy.findMany({
        where: policyWhere,
        include: {
          company: { select: { name: true } },
          quote: { select: { formData: true, insuranceType: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    // CUSTOMERS (Admin/Broker only)
    if (isAdmin || isBroker) {
      const customerWhere: any = { OR: [] };

      if (isTCKN) {
        const quotesWithTCKN = await prisma.quote.findMany({
          where: {
            formData: { path: ["driverTCKN"], equals: query },
          },
          distinct: ["userId"],
          select: { userId: true },
        });

        const userIds = quotesWithTCKN
          .filter((q) => q.userId)
          .map((q) => q.userId as string);
        if (userIds.length > 0) {
          customerWhere.OR.push({ id: { in: userIds } });
        }
      }

      if (query) {
        customerWhere.OR.push(
          { email: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } }
        );
      }

      if (customerWhere.OR.length > 0) {
        results.customers = await prisma.user.findMany({
          where: customerWhere,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { quotes: true, policies: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        });
      }
    }
  }

  const insuranceTypeLabels: Record<string, string> = {
    TRAFFIC: "Trafik",
    KASKO: "Kasko",
    DASK: "DASK",
    HEALTH: "Sağlık",
  };

  const totalResults =
    results.quotes.length + results.policies.length + results.customers.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold">
              Sigorta Acentesi
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard'a Dön
          </Link>

          {/* Search Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Arama Sonuçları</h1>
            {query && (
              <p className="text-muted-foreground">
                &quot;{query}&quot; için{" "}
                <span className="font-semibold">{totalResults}</span> sonuç
                bulundu
              </p>
            )}
          </div>

          {/* Search Box */}
          <div className="max-w-md">
            <GlobalSearch />
          </div>

          {/* No Query */}
          {!query && (
            <Card>
              <CardContent className="pt-6 text-center">
                <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">
                  Arama yapmak için bir terim girin
                </p>
                <p className="text-sm text-muted-foreground">
                  TC Kimlik No, Plaka, Email veya Poliçe Numarası ile arama
                  yapabilirsiniz
                </p>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {query && totalResults === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-lg font-medium mb-2">Sonuç bulunamadı</p>
                <p className="text-sm text-muted-foreground">
                  Farklı bir arama terimi deneyin
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quotes Results */}
          {results.quotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Teklifler ({results.quotes.length})
                </CardTitle>
                <CardDescription>Eşleşen teklif kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Bilgiler</TableHead>
                      <TableHead>En İyi Fiyat</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="text-sm">
                          {formatDateTime(quote.createdAt)}
                        </TableCell>
                        <TableCell>
                          {insuranceTypeLabels[quote.insuranceType]}
                        </TableCell>
                        <TableCell className="text-sm">
                          {quote.formData?.plate && (
                            <div>Plaka: {quote.formData.plate}</div>
                          )}
                          {quote.user?.name && (
                            <div className="text-muted-foreground">
                              {quote.user.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {quote.responses[0] ? (
                            <div>
                              <div className="font-semibold">
                                {formatCurrency(
                                  Number(quote.responses[0].price)
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {quote.responses[0].company.name}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/quotes/${quote.id}`}>
                            <Button size="sm" variant="outline">
                              Görüntüle
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Policies Results */}
          {results.policies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Poliçeler ({results.policies.length})
                </CardTitle>
                <CardDescription>Eşleşen poliçe kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poliçe No</TableHead>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Bilgiler</TableHead>
                      <TableHead>Prim</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">
                          {policy.policyNumber || "Yok"}
                        </TableCell>
                        <TableCell>{policy.company.name}</TableCell>
                        <TableCell className="text-sm">
                          {policy.quote?.formData?.plate && (
                            <div>Plaka: {policy.quote.formData.plate}</div>
                          )}
                          {policy.user?.name && (
                            <div className="text-muted-foreground">
                              {policy.user.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(policy.premium))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/policies/${policy.id}`}>
                            <Button size="sm" variant="outline">
                              Görüntüle
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Customers Results (Admin/Broker only) */}
          {results.customers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Müşteriler ({results.customers.length})
                </CardTitle>
                <CardDescription>Eşleşen müşteri kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>İstatistikler</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {customer._count.quotes} Teklif •{" "}
                          {customer._count.policies} Poliçe
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDateTime(customer.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/users?id=${customer.id}`}>
                            <Button size="sm" variant="outline">
                              Görüntüle
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
