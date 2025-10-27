import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Edge Function'da cookie'den session bilgisini oku
  const token =
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token");
  const isLoggedIn = !!token;

  // Public pages - middleware'den muaf
  const publicPages = [
    "/",
    "/trafik",
    "/kasko",
    "/dask",
    "/saglik",
    "/hakkimizda",
    "/iletisim",
    "/kvkk",
    "/gizlilik",
    "/api/", // API routes
  ];

  // Public page kontrolü
  if (
      publicPages.some((page) => pathname === page || pathname.startsWith(page))
  ) {
    return NextResponse.next();
  }

  // Admin routes - sadece login kontrolü
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
          new URL("/auth/login?from=" + pathname, req.url)
      );
    }
  }

  // Broker routes - sadece login kontrolü
  if (pathname.startsWith("/broker")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
          new URL("/auth/login?from=" + pathname, req.url)
      );
    }
  }

  // Dashboard routes - sadece login kontrolü
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
          new URL("/auth/login?from=" + pathname, req.url)
      );
    }
  }

  // Profile and Referrals routes
  if (pathname.startsWith("/profile") || pathname.startsWith("/referrals")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
          new URL("/auth/login?from=" + pathname, req.url)
      );
    }
  }

  // Quotes route - guest access with token OR logged in
  if (pathname.startsWith("/quotes")) {
    const queryToken = req.nextUrl.searchParams.get("token");
    if (!isLoggedIn && !queryToken) {
      return NextResponse.redirect(
          new URL("/auth/login?from=" + pathname, req.url)
      );
    }
  }

  // Auth routes - login kontrolü
  if (
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register")
  ) {
    if (isLoggedIn) {
      const from = req.nextUrl.searchParams.get("from");
      if (from && from.startsWith("/") && !from.startsWith("//")) {
        return NextResponse.redirect(new URL(from, req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
