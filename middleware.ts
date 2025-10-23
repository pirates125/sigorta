import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;
  const isAdmin = isLoggedIn && userRole === "ADMIN";
  const isBroker = isLoggedIn && userRole === "BROKER";

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
  ];

  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/auth/login?from=" + pathname, req.url)
      );
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Broker routes
  if (pathname.startsWith("/broker")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/auth/login?from=" + pathname, req.url)
      );
    }
    if (!isBroker && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Dashboard routes
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
    // Guest users can access with valid token
    const token = req.nextUrl.searchParams.get("token");

    // If not logged in and no token, redirect to login
    if (!isLoggedIn && !token) {
      return NextResponse.redirect(
        new URL("/auth/login?from=" + pathname, req.url)
      );
    }
    // If has token OR logged in, allow access
  }

  // Auth routes (login, register) - Eğer giriş yaptıysa dashboard'a yönlendir
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    if (isLoggedIn) {
      // URL'den from parametresini al
      const from = req.nextUrl.searchParams.get("from");

      // Eğer from varsa ve güvenli bir URL ise oraya yönlendir
      if (from && from.startsWith("/") && !from.startsWith("//")) {
        return NextResponse.redirect(new URL(from, req.url));
      }

      // Yoksa role'e göre yönlendir
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (isBroker) {
        return NextResponse.redirect(new URL("/broker", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

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
