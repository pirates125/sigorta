/**
 * Rate Limiting Middleware
 * Brute force ve spam saldırılarını önlemek için
 */

import { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Temizleme interval'i (5 dakikada bir)
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number; // milliseconds
}

/**
 * Rate limiter
 * @param request Next.js request
 * @param limit Maksimum istek sayısı
 * @param windowMs Zaman penceresi (ms)
 */
export async function rateLimit(
  request: NextRequest,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 dakika
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // IP adresini al
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const identifier = `${ip}-${request.nextUrl.pathname}`;
  const now = Date.now();

  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      remaining: limit - 1,
      reset: store[identifier].resetTime,
    };
  }

  // Zaman penceresi dolmuşsa sıfırla
  if (now > store[identifier].resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      remaining: limit - 1,
      reset: store[identifier].resetTime,
    };
  }

  // Limit aşıldı mı kontrol et
  if (store[identifier].count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: store[identifier].resetTime,
    };
  }

  // İsteği say
  store[identifier].count++;

  return {
    success: true,
    remaining: limit - store[identifier].count,
    reset: store[identifier].resetTime,
  };
}

/**
 * Login rate limiter (daha sıkı)
 */
export async function loginRateLimit(request: NextRequest) {
  return rateLimit(request, 5, 15 * 60 * 1000); // 15 dakikada 5 deneme
}

/**
 * API rate limiter (genel)
 */
export async function apiRateLimit(request: NextRequest) {
  return rateLimit(request, 60, 60 * 1000); // dakikada 60 istek
}

/**
 * Quote rate limiter (sorgu oluşturma)
 */
export async function quoteRateLimit(request: NextRequest) {
  return rateLimit(request, 10, 60 * 60 * 1000); // saatte 10 sorgu
}
