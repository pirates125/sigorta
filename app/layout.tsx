import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Sigorta Acentesi - En Uygun Sigorta Fiyatları",
    template: "%s | Sigorta Acentesi",
  },
  description:
    "Türkiye'nin en güvenilir online sigorta karşılaştırma platformu. Trafik, Kasko, DASK ve Sağlık sigortası fiyatlarını karşılaştırın, dakikalar içinde en uygun teklifi alın. 20+ sigorta şirketi, akıllı karşılaştırma algoritması.",
  keywords: [
    "sigorta",
    "trafik sigortası",
    "kasko sigortası",
    "dask sigortası",
    "sağlık sigortası",
    "sigorta karşılaştırma",
    "en ucuz sigorta",
    "online sigorta",
    "sigorta teklifi",
    "sigorta fiyatları",
  ],
  authors: [{ name: "Sigorta Acentesi" }],
  creator: "Sigorta Acentesi",
  publisher: "Sigorta Acentesi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sigorta.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sigorta Acentesi - En Uygun Sigorta Fiyatları",
    description:
      "Türkiye'nin en güvenilir online sigorta karşılaştırma platformu. 20+ sigorta şirketi, akıllı karşılaştırma algoritması.",
    url: "https://sigorta.com",
    siteName: "Sigorta Acentesi",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sigorta Acentesi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigorta Acentesi - En Uygun Sigorta Fiyatları",
    description:
      "Türkiye'nin en güvenilir online sigorta karşılaştırma platformu.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
