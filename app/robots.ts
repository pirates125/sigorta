import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sigorta.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/trafik", "/hakkimizda", "/iletisim", "/auth/*"],
        disallow: [
          "/admin/*",
          "/broker/*",
          "/dashboard/*",
          "/profile/*",
          "/quotes/*",
          "/policies/*",
          "/referrals/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
