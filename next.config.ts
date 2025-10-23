import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Puppeteer ve bağımlılıkları server-side'da çalışacak
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-extra",
    "puppeteer-extra-plugin-stealth",
  ],

  // Webpack konfigürasyonu - eski CommonJS paketler için
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Server-side'da bu paketleri external olarak işaretle
      config.externals = config.externals || [];
      config.externals.push({
        "clone-deep": "commonjs clone-deep",
        "merge-deep": "commonjs merge-deep",
      });
    }

    // Warnings'i bastır
    config.ignoreWarnings = [
      { module: /node_modules\/clone-deep/ },
      { module: /node_modules\/merge-deep/ },
    ];

    return config;
  },
};

export default nextConfig;
