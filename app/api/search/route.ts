import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type"); // 'all', 'quotes', 'policies', 'customers'

    if (!query || query.length < 2) {
      return NextResponse.json(
        { message: "Arama terimi en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    const isBroker = session.user.role === "BROKER";
    const userId = session.user.id;

    const results: {
      quotes: any[];
      policies: any[];
      customers: any[];
    } = {
      quotes: [],
      policies: [],
      customers: [],
    };

    // TC Kimlik No formatı kontrolü (11 haneli sayı)
    const isTCKN = /^\d{11}$/.test(query);

    // Plaka formatı kontrolü (en az 7 karakter, harf ve rakam)
    const isPlate = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/i.test(
      query.replace(/\s/g, "")
    );

    // Email formatı kontrolü
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

    // QUOTES ARAMA
    if (!type || type === "all" || type === "quotes") {
      const quoteWhere: any = {
        OR: [],
      };

      // Sadece kendi tekliflerini göster (admin/broker hariç)
      if (!isAdmin && !isBroker) {
        quoteWhere.userId = userId;
      }

      // Plaka ile arama
      if (isPlate) {
        quoteWhere.OR.push({
          formData: {
            path: ["plate"],
            string_contains: query.toUpperCase().replace(/\s/g, ""),
          },
        });
      }

      // TC ile arama
      if (isTCKN) {
        quoteWhere.OR.push({
          formData: {
            path: ["driverTCKN"],
            equals: query,
          },
        });
      }

      // Email ile arama
      if (isEmail) {
        quoteWhere.OR.push({
          guestEmail: { contains: query, mode: "insensitive" },
        });
        if (isAdmin || isBroker) {
          quoteWhere.OR.push({
            user: {
              email: { contains: query, mode: "insensitive" },
            },
          });
        }
      }

      // Genel metin aramasi (ID)
      quoteWhere.OR.push({ id: { contains: query, mode: "insensitive" } });

      if (quoteWhere.OR.length > 0) {
        results.quotes = await prisma.quote.findMany({
          where: quoteWhere,
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            responses: {
              orderBy: {
                price: "asc",
              },
              take: 1,
              include: {
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        });
      }
    }

    // POLICIES ARAMA
    if (!type || type === "all" || type === "policies") {
      const policyWhere: any = {
        OR: [],
      };

      // Sadece kendi poliçelerini göster (admin/broker hariç)
      if (!isAdmin && !isBroker) {
        policyWhere.userId = userId;
      }

      // Poliçe numarası
      if (query) {
        policyWhere.OR.push({
          policyNumber: { contains: query, mode: "insensitive" },
        });
      }

      // TC ile arama (quote formData'dan)
      if (isTCKN) {
        policyWhere.OR.push({
          quote: {
            formData: {
              path: ["driverTCKN"],
              equals: query,
            },
          },
        });
      }

      // Plaka ile arama
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

      // ID ile arama
      policyWhere.OR.push({ id: { contains: query, mode: "insensitive" } });

      if (policyWhere.OR.length > 0) {
        results.policies = await prisma.policy.findMany({
          where: policyWhere,
          include: {
            company: {
              select: {
                name: true,
              },
            },
            quote: {
              select: {
                formData: true,
                insuranceType: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        });
      }
    }

    // CUSTOMERS ARAMA (Sadece Admin/Broker)
    if (
      (isAdmin || isBroker) &&
      (!type || type === "all" || type === "customers")
    ) {
      const customerWhere: any = {
        OR: [],
      };

      // TC ile arama (quotes'daki formData'dan)
      if (isTCKN) {
        const quotesWithTCKN = await prisma.quote.findMany({
          where: {
            formData: {
              path: ["driverTCKN"],
              equals: query,
            },
          },
          distinct: ["userId"],
          select: {
            userId: true,
          },
        });

        const userIds = quotesWithTCKN
          .filter((q) => q.userId)
          .map((q) => q.userId as string);

        if (userIds.length > 0) {
          customerWhere.OR.push({ id: { in: userIds } });
        }
      }

      // Email veya isim ile arama
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
            _count: {
              select: {
                quotes: true,
                policies: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        });
      }
    }

    return NextResponse.json({
      query,
      results,
      totalResults:
        results.quotes.length +
        results.policies.length +
        results.customers.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Arama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
